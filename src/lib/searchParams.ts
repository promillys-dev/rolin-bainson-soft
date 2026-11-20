import { DEFAULT_PAGE_SIZE, pageSizeOptions, sortOptions, type SortValue } from '@/lib/properties'
import type { PropertySearchParams, TransactionType } from '@/types/property'

/**
 * Lecture et écriture des critères de recherche dans l'URL.
 *
 * La recherche est un `<form method="get">` : l'URL est donc l'état. Elle doit
 * rester partageable, indexable et reconstructible — d'où un module dédié
 * plutôt que des lectures de `searchParams` éparpillées dans les pages.
 *
 * Tout ce qui est hors domaine est ignoré silencieusement. Un paramètre
 * bidouillé à la main ne doit pas produire d'erreur 500 sur une page publique.
 */

/** Ce que Next.js passe à une page : une valeur, plusieurs, ou rien. */
export type RawSearchParams = Record<string, string | string[] | undefined>

function first(raw: RawSearchParams, key: string): string | undefined {
  const value = raw[key]
  const single = Array.isArray(value) ? value[0] : value
  const trimmed = single?.trim()
  return trimmed ? trimmed : undefined
}

function positiveInt(raw: RawSearchParams, key: string): number | undefined {
  const value = first(raw, key)
  if (value === undefined) return undefined
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

export function parseSearchParams(raw: RawSearchParams): PropertySearchParams {
  const transaction = first(raw, 'transaction')
  const sort = first(raw, 'sort')

  return {
    transaction:
      transaction === 'vente' || transaction === 'location'
        ? (transaction as TransactionType)
        : undefined,
    localisation: first(raw, 'localisation'),
    kind: first(raw, 'kind'),
    piecesMin: positiveInt(raw, 'piecesMin'),
    bedroomsMin: positiveInt(raw, 'bedroomsMin'),
    areaMin: positiveInt(raw, 'areaMin'),
    budgetMin: positiveInt(raw, 'budgetMin'),
    budgetMax: positiveInt(raw, 'budgetMax'),
    reference: first(raw, 'reference'),
    sort: sortOptions.some((option) => option.value === sort)
      ? (sort as SortValue)
      : undefined,
    page: positiveInt(raw, 'page'),
  }
}

export function parsePageSize(raw: RawSearchParams): number {
  const value = positiveInt(raw, 'parPage')
  return pageSizeOptions.find((size) => size === value) ?? DEFAULT_PAGE_SIZE
}

/**
 * Reconstruit la query string à partir des critères, en remplaçant ceux
 * passés en second argument. Sert aux liens de tri et de pagination, qui
 * doivent préserver la recherche en cours.
 */
export function buildSearchQuery(
  criteria: PropertySearchParams,
  overrides: Partial<PropertySearchParams & { parPage: number }> = {},
): string {
  const merged = { ...criteria, ...overrides }
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined || value === '' || value === null) continue
    // `page=1` est l'état par défaut : l'omettre évite deux URLs pour la
    // même page de résultats, donc du contenu dupliqué aux yeux des moteurs.
    if (key === 'page' && value === 1) continue
    params.set(key, String(value))
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

/**
 * Critères de filtrage seuls, tri et pagination exclus. Sert aux formulaires
 * qui doivent reconduire la recherche en cours sans figer la page affichée.
 */
export function filterCriteriaEntries(
  criteria: PropertySearchParams,
): readonly [string, string][] {
  return Object.entries(criteria)
    .filter(([key]) => key !== 'sort' && key !== 'page')
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => [key, String(value)] as [string, string])
}
