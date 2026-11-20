import { agencies as fixtureAgencies, type Agency } from '@/config/site'
import { agencyContent, type AgencyContent } from '@/data/agencyContent'
import { apiFind, apiGet, isApiConfigured, warnFixtures } from '@/lib/api/client'
import { pickStable } from '@/lib/utils'

/**
 * Accès aux agences.
 *
 * Elles viennent du back-office (`/api/v1/agencies`) ; seules les agences
 * publiées y figurent. Le back-office ne connaît ni les photos d'agence ni
 * leurs métiers, et n'a pas toujours leurs coordonnées : on règle ces trois
 * manques ici, à un seul endroit, pour que les pages n'aient rien à savoir.
 *
 *  - noms : la base legacy les a en capitales (« AGENCE CHARPENNES ROLIN
 *    BAINSON ») ; on les remet en casse de titre, et on en tire un nom court ;
 *  - téléphones : « 0478930045 » devient « 04 78 93 00 45 » ;
 *  - coordonnées absentes : géocodées sur la Base Adresse Nationale à partir
 *    de l'adresse, et mises en cache trente jours ;
 *  - photo : celle de la maison, à défaut d'une photo d'agence en back-office.
 */

export type AgencyAgent = { name: string; role?: string; phone?: string; email?: string }

export type AgencyView = Agency & {
  /** Textes de présentation. Absents si le back-office n'en a pas. */
  content?: AgencyContent
  agents: readonly AgencyAgent[]
  propertiesCount?: number
}

type ApiAgency = {
  slug: string
  name: string
  description?: string | null
  editorialDescription?: string | null
  openingHours?: string[] | null
  contactNote?: string | null
  address: string
  postalCode: string
  city: string
  phone?: string | null
  email?: string | null
  coordinates?: { lat: number; lng: number } | null
  propertiesCount?: number
  agents?: {
    name?: string | null
    firstName?: string | null
    lastName?: string | null
    role?: string | null
    phone?: string | null
    email?: string | null
  }[]
}

/**
 * L'image d'une agence ne vient pas du back-office : le flux ConvertImmo n'en
 * porte aucune. Les trois agences réelles ont donc la leur, choisie — sans
 * quoi `pickStable` la tire au hachage du slug, ce qui donnait à Confluence
 * une façade de bureaux grise sans rapport avec le quartier.
 */
const AGENCY_IMAGES: Record<string, string> = {
  'rolin-bainson-sa': '/brand/agence-1.jpg',
  'agence-charpennes': '/brand/cta.jpg',
  'confluence-rolin-bainson': '/brand/coverage.jpg',
}

/** Pour une agence que le back-office ajouterait demain. */
const FALLBACK_IMAGES = ['/brand/agence-1.jpg', '/brand/agence-2.jpg', '/brand/block-2.jpg']

/** Mots qui gardent leur casse : sigles et petits mots. */
const KEEP_UPPER = new Set(['SA', 'SAS', 'SARL', 'UNIS'])
const KEEP_LOWER = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'et', 'à'])

/** « AGENCE CHARPENNES ROLIN BAINSON » → « Agence Charpennes Rolin Bainson ». */
export function titleCase(text: string): string {
  if (text !== text.toUpperCase()) return text.trim()
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (KEEP_UPPER.has(word.toUpperCase())) return word.toUpperCase()
      if (index > 0 && KEEP_LOWER.has(word)) return word
      return word.replace(/(^|[-'’])(\p{L})/gu, (_, sep: string, letter: string) => sep + letter.toUpperCase())
    })
    .join(' ')
}

/** « Agence Charpennes Rolin Bainson » → « Charpennes » ; le siège n'a pas d'autre nom. */
function shortNameOf(name: string): string {
  const short = name
    .replace(/rolin[\s-]*bainson/gi, '')
    .replace(/\bagence\b/gi, '')
    .replace(/\b(SA|SAS|SARL)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return short || 'Siège'
}

/** « 0478930045 » → « 04 78 93 00 45 ». Un format inattendu est rendu tel quel. */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 ? digits.replace(/(\d{2})(?=\d)/g, '$1 ') : phone
}

/**
 * Coordonnées d'une adresse, par la Base Adresse Nationale (service public,
 * sans clé). Un échec n'est pas une erreur : l'agence n'apparaît simplement
 * pas sur la carte.
 */
async function geocode(address: string, postalCode: string, city: string) {
  try {
    const query = encodeURIComponent(`${address} ${postalCode} ${city.replace(/\s+\d+$/, '')}`)
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=1`, {
      next: { revalidate: 60 * 60 * 24 * 30, tags: ['geocode'] },
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return null
    const json = (await response.json()) as {
      features?: { geometry: { coordinates: [number, number] }; properties: { score: number } }[]
    }
    const best = json.features?.[0]
    if (!best || best.properties.score < 0.6) return null
    const [lng, lat] = best.geometry.coordinates
    return { lat, lng }
  } catch {
    return null
  }
}

async function mapAgency(api: ApiAgency): Promise<AgencyView> {
  const name = titleCase(api.name)
  const coordinates =
    api.coordinates ?? (await geocode(api.address, api.postalCode, api.city))
  // Une description qui ne fait que répéter le nom (« Agence Charpennes »)
  // n'apprend rien : elle est ignorée plutôt qu'affichée sous le nom.
  const repeatsName = (text: string | undefined) =>
    Boolean(text) && name.toLowerCase().includes(text!.toLowerCase())
  const rawDescription = api.description?.trim()
  const description = repeatsName(rawDescription) ? undefined : rawDescription
  const editorial = api.editorialDescription?.trim()

  return {
    slug: api.slug,
    name,
    shortName: shortNameOf(name),
    address: api.address,
    postalCode: api.postalCode,
    city: api.city,
    phone: formatPhone(api.phone),
    email: api.email ?? '',
    activities: [],
    openingHours: api.openingHours ?? [],
    coordinates,
    image: AGENCY_IMAGES[api.slug] ?? pickStable(FALLBACK_IMAGES, api.slug),
    content:
      description || editorial || api.contactNote
        ? {
            tagline: description && description !== editorial ? description : '',
            intro: editorial ?? description ?? '',
            highlights: [],
            access: api.contactNote ?? '',
          }
        : undefined,
    agents: (api.agents ?? []).map((agent) => ({
      name:
        agent.name ?? [agent.firstName, agent.lastName].filter(Boolean).join(' ') ?? '',
      role: agent.role ?? undefined,
      phone: formatPhone(agent.phone) || undefined,
      email: agent.email ?? undefined,
    })),
    propertiesCount: api.propertiesCount,
  }
}

function fromFixture(agency: Agency): AgencyView {
  return { ...agency, content: agencyContent[agency.slug], agents: [] }
}

export async function getAgencies(): Promise<readonly AgencyView[]> {
  if (!isApiConfigured) {
    warnFixtures()
    return fixtureAgencies.map(fromFixture)
  }
  const { data } = await apiGet<{ data: ApiAgency[] }>('/agencies', ['site'])
  return Promise.all(data.map(mapAgency))
}

export async function getAgency(slug: string): Promise<AgencyView | undefined> {
  if (!isApiConfigured) {
    warnFixtures()
    const agency = fixtureAgencies.find((entry) => entry.slug === slug)
    return agency ? fromFixture(agency) : undefined
  }
  const detail = await apiFind<{ data: ApiAgency }>(`/agencies/${encodeURIComponent(slug)}`, ['site'])
  return detail ? mapAgency(detail.data) : undefined
}
