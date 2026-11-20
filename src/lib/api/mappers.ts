import { mediaPath } from '@/lib/api/media'
import type { EnergyRating, Property, PropertyMedia, TransactionType } from '@/types/property'

/**
 * Correspondance entre les ressources de l'API et les types du front.
 *
 * Les types du front ont été écrits comme le contrat de l'API, et les clés
 * coïncident presque toutes. Restent les écarts qu'on règle ici, à un seul
 * endroit : les équipements en liste plutôt qu'en booléens, les champs
 * absents qui arrivent en `null` plutôt qu'omis, les photos — servies depuis
 * le site par les routes `/storage` et `/media`, jamais depuis l'API.
 */

/** Ce que l'API renvoie pour une annonce, en liste comme en fiche. */
export type ApiProperty = {
  reference: string
  slug: string
  transaction: TransactionType
  isLifeAnnuity?: boolean
  isExclusive?: boolean
  isFurnished?: boolean
  title: string
  description?: string | null
  kind: string
  category?: string | null
  price: {
    amount: number
    excludingCharges?: number | null
    charges?: number | null
    deposit?: number | null
    fees?: number | null
  }
  rentControl?: {
    applies: boolean
    baseRent?: number | null
    referenceRentIncreased?: number | null
    supplement?: number | null
  } | null
  energy?: {
    date?: string | null
    energyClass?: string | null
    energyValue?: number | null
    gasClass?: string | null
    gasValue?: number | null
  } | null
  location: {
    street?: string | null
    district?: string | null
    postalCode: string
    city: string
    coordinates?: { lat: number; lng: number } | null
  }
  features: Record<string, number | string | boolean | null | undefined>
  amenities?: string[]
  availableAt?: string | null
  virtualTourUrl?: string | null
  mandateNumber?: string | null
  media?: { url: string; alt?: string | null; width?: number | null; height?: number | null }[]
  cover?: { url: string; alt?: string | null } | null
  agency?: { slug: string; name: string } | null
  firstSeenAt?: string | null
}

/** `null` → `undefined` : le front distingue « absent », pas « nul ». */
const opt = <T>(value: T | null | undefined): T | undefined => value ?? undefined

const RATINGS = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
const rating = (value: string | null | undefined): EnergyRating | undefined =>
  value && RATINGS.has(value) ? (value as EnergyRating) : undefined

const num = (value: unknown): number | undefined => (typeof value === 'number' ? value : undefined)

export function mapProperty(api: ApiProperty): Property {
  const amenities = new Set(api.amenities ?? [])
  const has = (key: string) => (amenities.size ? amenities.has(key) : undefined)

  // En liste, l'API ne donne que la photo de couverture ; en fiche, toutes.
  const rawMedia: { url: string; alt?: string | null; width?: number | null; height?: number | null }[] =
    api.media?.length ? api.media : api.cover ? [api.cover] : []
  const media: PropertyMedia[] = rawMedia
    .map((item) => ({ ...item, path: mediaPath(item.url) }))
    .filter((item): item is typeof item & { path: string } => item.path !== null)
    .map((item) => ({
      url: item.path,
      alt: item.alt ?? api.title,
      width: opt(item.width),
      height: opt(item.height),
    }))

  return {
    reference: api.reference,
    slug: api.slug,
    transaction: api.transaction,
    isLifeAnnuity: api.isLifeAnnuity,
    isExclusive: api.isExclusive,
    kind: api.kind,
    category: opt(api.category),
    title: api.title,
    description: opt(api.description),
    price: {
      amount: api.price.amount,
      excludingCharges: opt(api.price.excludingCharges),
      charges: opt(api.price.charges),
      deposit: opt(api.price.deposit),
      fees: opt(api.price.fees),
    },
    rentControl: api.rentControl
      ? {
          applies: api.rentControl.applies,
          baseRent: opt(api.rentControl.baseRent),
          referenceRentIncreased: opt(api.rentControl.referenceRentIncreased),
          supplement: opt(api.rentControl.supplement),
        }
      : undefined,
    energy: api.energy
      ? {
          date: opt(api.energy.date),
          energyClass: rating(api.energy.energyClass),
          energyValue: opt(api.energy.energyValue),
          gasClass: rating(api.energy.gasClass),
          gasValue: opt(api.energy.gasValue),
        }
      : undefined,
    location: {
      street: opt(api.location.street),
      district: opt(api.location.district),
      postalCode: api.location.postalCode,
      city: api.location.city,
      coordinates: opt(api.location.coordinates),
    },
    features: {
      rooms: num(api.features.rooms),
      bedrooms: num(api.features.bedrooms),
      bathrooms: num(api.features.bathrooms),
      floor: num(api.features.floor),
      floors: num(api.features.floors),
      livingArea: num(api.features.livingArea),
      landArea: num(api.features.landArea),
      constructionYear: num(api.features.constructionYear),
      hasElevator: has('elevator'),
      hasBalcony: has('balcony'),
      hasTerrace: has('terrace'),
      hasCellar: has('cellar'),
      hasParking: has('parking') ?? (api.features.hasParking === true ? true : undefined),
      hasGarage: has('garage'),
      isFurnished: api.isFurnished,
    },
    media,
    virtualTourUrl: opt(api.virtualTourUrl),
    mandateNumber: opt(api.mandateNumber),
    agencySlug: api.agency?.slug,
    availableAt: opt(api.availableAt),
    publishedAt: api.firstSeenAt ?? new Date(0).toISOString(),
  }
}
