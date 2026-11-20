import { propertyKinds } from '@/config/search'
import { properties } from '@/data/properties'
import { apiFind, apiGet, apiGetAll, isApiConfigured, toQuery, warnFixtures } from '@/lib/api/client'
import { mapProperty, type ApiProperty } from '@/lib/api/mappers'
import type { Property, PropertySearchParams, TransactionType } from '@/types/property'

/**
 * Accès au catalogue.
 *
 * SEUL point de contact entre le front et les annonces. Elles viennent du
 * back-office (`/api/v1/properties`), qui les reçoit lui-même du flux
 * ConvertImmo ; aucune page n'interroge l'API ni `data/properties.ts`
 * directement. Sans `API_URL`, ces fonctions retombent sur les données
 * d'exemple, avec les mêmes règles de filtrage.
 *
 * Les règles de filtrage reprennent celles de `offre.ctrl.php:186-245`, avec
 * les corrections actées à l'audit (`SPEC §3.2`) :
 *  - pièces et chambres sont des MINIMUMS, pas des égalités ;
 *  - le budget s'applique même sans type de transaction choisi.
 */

/** Nombre de résultats par page du site précédent. */
export const DEFAULT_PAGE_SIZE = 10

export const pageSizeOptions = [10, 20, 50] as const

export const sortOptions = [
  { value: 'recent', label: 'Les plus récents' },
  { value: 'prix-asc', label: 'Prix croissant' },
  { value: 'prix-desc', label: 'Prix décroissant' },
  { value: 'surface-desc', label: 'Surface décroissante' },
  { value: 'surface-asc', label: 'Surface croissante' },
] as const

export type SortValue = (typeof sortOptions)[number]['value']

/**
 * Titre d'annonce.
 *
 * Calculé, jamais saisi — règle métier n° 5 de la spécification. La valeur
 * stockée dans le flux existe mais a dérivé sur le site précédent ; on ne
 * l'affiche pas. Un garage ou un parking n'a pas de pièces, on tombe alors sur
 * `<nature> <surface> m²`.
 */
export function propertyTitle(property: Property): string {
  const { rooms, livingArea } = property.features
  const parts = [property.kind]
  if (rooms) parts.push(`${rooms} ${rooms > 1 ? 'pièces' : 'pièce'}`)
  if (livingArea) parts.push(`${livingArea} m²`)
  return parts.join(' ')
}

/** Version longue, qui ajoute la commune — utilisée en titre de page et en SEO. */
export function propertyFullTitle(property: Property): string {
  return `${propertyTitle(property)} à ${property.location.city}`
}

/**
 * Adresse affichable.
 *
 * En location, le numéro de rue est masqué : c'est une demande constante des
 * bailleurs, qui ne veulent pas que leur immeuble soit identifiable depuis une
 * annonce publique. La voie reste visible, elle sert au visiteur.
 */
export function displayStreet(property: Property): string | undefined {
  const { street } = property.location
  if (!street) return undefined
  if (property.transaction === 'vente') return street
  return street.replace(/^\s*\d+\s*(bis|ter|quater)?\s*/i, '').trim() || undefined
}

/** Secteur affiché sur les cartes : le quartier s'il existe, sinon la commune. */
export function displaySector(property: Property): string {
  return property.location.district ?? property.location.city
}

/**
 * Mention de prix réglementaire.
 *
 * « F.A.I. » (frais d'agence inclus) en vente, « C.C. » (charges comprises) en
 * location : le site précédent les affichait, elles doivent le rester.
 */
export function priceMention(transaction: TransactionType): string {
  return transaction === 'vente' ? 'F.A.I.' : 'C.C.'
}

/**
 * Tronque sans couper un mot, pour les résumés de carte et les métadonnées.
 * La ponctuation finale est retirée avant les points de suspension : sans
 * cela, une coupe qui tombe après un point donne « aménagée.… ».
 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  const kept = cut.slice(0, lastSpace > 0 ? lastSpace : max)
  return `${kept.replace(/[\s.,;:!?–—-]+$/u, '')}…`
}

/** Valeur du prix servant au tri et au filtre budget. */
function priceValue(property: Property): number {
  return property.price.amount
}

function matchesKind(property: Property, kind: string): boolean {
  // Le paramètre d'URL porte la valeur du référentiel (`t3`, `garage`…) ;
  // le bien porte le libellé. On passe par `config/search.ts` plutôt que de
  // dupliquer la correspondance ici.
  const label = propertyKinds.find((entry) => entry.value === kind)?.label
  return label !== undefined && property.category === label
}

function matches(property: Property, criteria: PropertySearchParams): boolean {
  if (criteria.reference) {
    // La référence est discriminante : elle court-circuite tout le reste,
    // comme le faisait le legacy.
    return property.reference === criteria.reference.trim()
  }

  if (criteria.transaction && property.transaction !== criteria.transaction) return false

  if (criteria.localisation) {
    const sector = `${property.location.district ?? ''} ${property.location.city} ${property.location.postalCode}`
    if (!sector.toLowerCase().includes(criteria.localisation.toLowerCase())) return false
  }

  if (criteria.kind && !matchesKind(property, criteria.kind)) return false

  if (criteria.piecesMin && (property.features.rooms ?? 0) < criteria.piecesMin) return false
  if (criteria.bedroomsMin && (property.features.bedrooms ?? 0) < criteria.bedroomsMin) {
    return false
  }
  if (criteria.areaMin && (property.features.livingArea ?? 0) < criteria.areaMin) return false

  const price = priceValue(property)
  if (criteria.budgetMin !== undefined && price < criteria.budgetMin) return false
  if (criteria.budgetMax !== undefined && price > criteria.budgetMax) return false

  return true
}

function compare(sort: SortValue): (a: Property, b: Property) => number {
  switch (sort) {
    case 'prix-asc':
      return (a, b) => priceValue(a) - priceValue(b)
    case 'prix-desc':
      return (a, b) => priceValue(b) - priceValue(a)
    case 'surface-asc':
      return (a, b) => (a.features.livingArea ?? 0) - (b.features.livingArea ?? 0)
    case 'surface-desc':
      return (a, b) => (b.features.livingArea ?? 0) - (a.features.livingArea ?? 0)
    case 'recent':
      return (a, b) => b.publishedAt.localeCompare(a.publishedAt)
  }
}

export type SearchResult = {
  items: readonly Property[]
  total: number
  page: number
  pageCount: number
  pageSize: number
}

type ApiPage<T> = {
  data: T[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}

/** Plafond de l'API par page. */
const API_MAX_PAGE_SIZE = 50

export async function searchProperties(
  criteria: PropertySearchParams,
  pageSize: number = DEFAULT_PAGE_SIZE,
): Promise<SearchResult> {
  if (!isApiConfigured) {
    warnFixtures()
    return searchFixtures(criteria, pageSize)
  }

  const response = await apiGet<ApiPage<ApiProperty>>(
    `/properties${toQuery({ ...criteria, perPage: Math.min(pageSize, API_MAX_PAGE_SIZE) })}`,
    ['listings'],
  )
  return {
    items: response.data.map(mapProperty),
    total: response.meta.total,
    page: response.meta.current_page,
    pageCount: Math.max(1, response.meta.last_page),
    pageSize: response.meta.per_page,
  }
}

export async function getProperty(reference: string): Promise<Property | undefined> {
  if (!isApiConfigured) {
    warnFixtures()
    return properties.find((property) => property.reference === reference)
  }
  const response = await apiFind<{ data: ApiProperty }>(
    `/properties/${encodeURIComponent(reference)}`,
    ['listings'],
  )
  return response ? mapProperty(response.data) : undefined
}

/** Toutes les annonces, pour la carte, `generateStaticParams` et le plan du site. */
export async function getAllProperties(): Promise<readonly Property[]> {
  if (!isApiConfigured) {
    warnFixtures()
    return properties
  }
  const items = await apiGetAll<ApiProperty>('/properties', ['listings'], API_MAX_PAGE_SIZE)
  return items.map(mapProperty)
}

/**
 * Annonces similaires : même transaction, même commune, surface proche.
 * Le legacy cherchait dans un rayon de 20 km ; sans carte ici, la commune et
 * l'écart de surface donnent un résultat plus lisible.
 */
export async function getSimilarProperties(
  property: Property,
  limit = 3,
): Promise<readonly Property[]> {
  const { items } = await searchProperties(
    { transaction: property.transaction, localisation: property.location.city },
    API_MAX_PAGE_SIZE,
  )
  const area = property.features.livingArea ?? 0
  return items
    .filter((candidate) => candidate.reference !== property.reference)
    .sort(
      (a, b) =>
        Math.abs((a.features.livingArea ?? 0) - area) -
        Math.abs((b.features.livingArea ?? 0) - area),
    )
    .slice(0, limit)
}

/** Compteurs par transaction — ceux du référentiel de l'API, calculés en base. */
export async function countByTransaction(transaction: TransactionType): Promise<number> {
  if (!isApiConfigured) {
    warnFixtures()
    return properties.filter((property) => property.transaction === transaction).length
  }
  const { data } = await apiGet<{ data: { counts: Partial<Record<TransactionType, number>> } }>(
    '/reference-data',
    ['listings'],
  )
  return data.counts[transaction] ?? 0
}

/** Recherche sur les données d'exemple, quand le back-office n'est pas configuré. */
function searchFixtures(criteria: PropertySearchParams, pageSize: number): SearchResult {
  const filtered = properties.filter((property) => matches(property, criteria))
  const sorted = [...filtered].sort(compare(criteria.sort ?? 'recent'))

  const total = sorted.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(criteria.page ?? 1, 1), pageCount)
  const start = (page - 1) * pageSize

  return { items: sorted.slice(start, start + pageSize), total, page, pageCount, pageSize }
}
