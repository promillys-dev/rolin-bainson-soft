import 'server-only'

import { API_URL, FRONT_TOKEN, isApiConfigured } from '@/lib/api/env'

/**
 * Client de l'API publique du back-office (Laravel, `/api/v1`).
 *
 * Même contrat que le front 3 (branche `nouveau-front-3`) :
 *  - chaque appel porte le jeton interne `X-Front-Token` (variable
 *    `FRONT_INTERNAL_TOKEN`, la même des deux côtés) ;
 *  - les envois relayés portent l'adresse du visiteur dans `X-Client-Ip` :
 *    le middleware `TrustFrontRelay` de l'API la reconnaît grâce au jeton, et
 *    la limite d'envoi s'applique visiteur par visiteur, non au serveur du
 *    front ;
 *  - les lectures sont mises en cache et étiquetées (`listings`, `posts`,
 *    `pages`, `site`, `forms`) : `/api/revalidate` les invalide quand le
 *    back-office signale une modification.
 *
 * C'est la seule porte d'entrée vers le back-office, côté serveur
 * uniquement. Passer du back-office local au back-office en ligne se fait en
 * changeant `API_URL`, rien d'autre.
 *
 * Sans `API_URL`, le site retombe sur ses données d'exemple (`src/data`) et
 * le dit une fois dans la console du serveur. Défini mais injoignable, en
 * revanche, une erreur est levée : un site qui afficherait en silence de
 * vieilles données d'exemple à la place du catalogue réel serait pire
 * qu'une page d'erreur.
 */

export { isApiConfigured }

/** Les étiquettes de cache que `/api/revalidate` sait invalider. */
export type ApiTag = 'listings' | 'posts' | 'pages' | 'site' | 'forms'

/** Durée de fraîcheur des lectures, filet de sécurité de la revalidation. */
const REVALIDATE = 300

/**
 * Au-delà, on abandonne : une page ne doit pas pendre sur un back-office
 * lent. Pendant le build, en revanche, des dizaines de pages sont générées
 * en parallèle et font la queue devant l'API — à plus forte raison devant
 * `php artisan serve`, qui ne traite qu'une requête à la fois : le délai y
 * est plus long, sans quoi le build échoue sur une API simplement occupée.
 */
const READ_TIMEOUT_MS = process.env.NEXT_PHASE === 'phase-production-build' ? 90_000 : 10_000
const WRITE_TIMEOUT_MS = 20_000

let warned = false
/** Signale une fois que le site tourne sur ses données d'exemple. */
export function warnFixtures() {
  if (warned || isApiConfigured) return
  warned = true
  console.warn(
    '[rolin-bainson] API_URL non défini : le site affiche ses données d’exemple (src/data), pas celles du back-office.',
  )
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type QueryValue = string | number | boolean | null | undefined

/** `{ page: 2, kind: undefined }` → `?page=2` : les valeurs vides ne partent pas. */
export function toQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}

/**
 * Lecture. 404 devient `null` ; toute autre erreur est levée (la page
 * affiche alors l'écran d'erreur).
 */
export async function apiFind<T>(path: string, tags: readonly ApiTag[]): Promise<T | null> {
  if (!isApiConfigured) throw new ApiError(0, path, 'API_URL n’est pas défini.')

  // Un identifiant vide donne `/properties/`, et l'API répond 200 avec la
  // LISTE : l'appelant reçoit un tableau là où il attend un objet, et plante
  // en le lisant. Le cas arrive dès qu'une page cherche un bien ou une agence
  // d'après un paramètre d'URL absent — la page de contact le faisait à
  // chaque visite sans `?bien=`. Rien à trouver, donc rien trouvé.
  if (path.endsWith('/')) return null

  let response: Response
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, {
      headers: { Accept: 'application/json', 'X-Front-Token': FRONT_TOKEN },
      next: { revalidate: REVALIDATE, tags: [...tags] },
      signal: AbortSignal.timeout(READ_TIMEOUT_MS),
    })
  } catch (cause) {
    throw new ApiError(0, path, `Back-office injoignable (${API_URL}) : ${String(cause)}`)
  }
  if (response.status === 404) return null
  if (!response.ok) {
    throw new ApiError(response.status, path, `Le back-office a répondu ${response.status} sur ${path}.`)
  }
  return (await response.json()) as T
}

/** Lecture d'une ressource qui doit exister : 404 est une erreur. */
export async function apiGet<T>(path: string, tags: readonly ApiTag[]): Promise<T> {
  const result = await apiFind<T>(path, tags)
  if (result === null) throw new ApiError(404, path, `Introuvable sur le back-office : ${path}.`)
  return result
}

type Paginated<T> = { data: T[]; meta?: { last_page?: number } }

/**
 * Toutes les pages d'une liste paginée. Pour le plan du site, la carte et
 * `generateStaticParams` — jamais pour un affichage paginé.
 */
export async function apiGetAll<T>(
  path: string,
  tags: readonly ApiTag[],
  perPage = 50,
): Promise<T[]> {
  const separator = path.includes('?') ? '&' : '?'
  const first = await apiGet<Paginated<T>>(`${path}${separator}perPage=${perPage}&page=1`, tags)
  const pages = first.meta?.last_page ?? 1
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, index) =>
      apiGet<Paginated<T>>(`${path}${separator}perPage=${perPage}&page=${index + 2}`, tags),
    ),
  )
  return [first, ...rest].flatMap((page) => page.data)
}

/** Adresse IP plausible, ou rien : on ne relaie pas n'importe quel en-tête. */
export function sanitizeIp(ip: string | null | undefined): string | null {
  const value = ip?.split(',')[0]?.trim()
  return value && /^[0-9a-f.:]{3,45}$/i.test(value) ? value : null
}

/**
 * Écriture relayée : l'envoi d'un formulaire. Jamais mise en cache.
 *
 * Une réponse qui n'est pas du JSON (page de pare-feu, erreur du serveur
 * web) n'est jamais relayée telle quelle : elle devient une 502.
 */
export async function apiPost(
  path: string,
  body: FormData,
  clientIp: string | null,
): Promise<{ status: number; body: { message?: string; errors?: Record<string, string[]> } }> {
  if (!isApiConfigured) throw new ApiError(0, path, 'API_URL n’est pas défini.')

  let response: Response
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, {
      method: 'POST',
      body,
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'X-Front-Token': FRONT_TOKEN,
        ...(clientIp ? { 'X-Client-Ip': clientIp } : {}),
      },
      signal: AbortSignal.timeout(WRITE_TIMEOUT_MS),
    })
  } catch {
    return { status: 503, body: {} }
  }

  if (!response.headers.get('content-type')?.includes('application/json')) {
    await response.body?.cancel()
    return { status: 502, body: {} }
  }
  return { status: response.status, body: await response.json().catch(() => ({})) }
}
