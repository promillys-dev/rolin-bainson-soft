import 'server-only'

import { API_URL } from '@/lib/api/env'

/**
 * Relaie un fichier public de l'API (`/storage/...`, `/media/...`) depuis
 * l'origine du site. Repris du front 3 (`lib/api-file.ts`).
 *
 * Remplace les réécritures d'URL vers l'API : le site appelle lui-même
 * l'API (certificat épinglé compris, voir `ca.ts`), et ne laisse passer que
 * des chemins simples et des types de fichiers connus. Aucun en-tête du
 * visiteur (cookies…) n'est transmis.
 */

/** Types de fichiers publics que l'API sert : images des annonces et de la médiathèque, PDF des contenus. */
const ALLOWED_TYPE = /^(image\/(jpeg|png|gif|webp|avif)|application\/pdf)(;|$)/i
const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,199}$/

const notFound = () =>
  new Response(null, { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } })

export async function relayApiFile(prefix: 'storage' | 'media', segments: string[]): Promise<Response> {
  if (
    !API_URL ||
    segments.length === 0 ||
    segments.length > 8 ||
    !segments.every((segment) => SEGMENT.test(segment) && !segment.includes('..'))
  ) {
    return notFound()
  }

  // Délai sur l'attente de la réponse seulement : une grande photo peut
  // ensuite se télécharger à son rythme (un délai global coupait les images
  // en cours de transfert).
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15_000)
  let upstream: Response
  try {
    upstream = await fetch(`${API_URL}/${prefix}/${segments.join('/')}`, {
      headers: { Accept: 'image/*,application/pdf' },
      redirect: 'error',
      signal: controller.signal,
    })
  } catch {
    return new Response(null, { status: 502 })
  } finally {
    clearTimeout(timer)
  }

  const type = upstream.headers.get('content-type') ?? ''
  // Un fichier vide (0 octet) n'est pas une image : traité comme absent.
  const empty = upstream.headers.get('content-length') === '0'
  if (!upstream.ok || !upstream.body || !ALLOWED_TYPE.test(type) || empty) {
    await upstream.body?.cancel()
    return notFound()
  }

  const headers = new Headers({
    'Content-Type': type,
    // Fichiers immuables côté API (un nouveau fichier = un nouveau nom) : longue durée de cache.
    'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; sandbox",
  })
  const length = upstream.headers.get('content-length')
  if (length) headers.set('Content-Length', length)

  return new Response(upstream.body, { status: 200, headers })
}
