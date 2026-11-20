import 'server-only'

import { API_URL } from '@/lib/api/env'

/**
 * Fichiers publics de l'API, servis depuis l'origine du site.
 *
 * Même approche que le front 3 : une URL de l'API (« https://api/storage/x.jpg »)
 * devient un chemin du site (« /storage/x.jpg »), relayé par les routes
 * `/storage` et `/media` (`lib/api/file.ts`). `next/image` ne charge donc que
 * des images locales, et l'origine de l'API n'apparaît jamais dans les pages.
 *
 * Toute autre origine est refusée : la fiche montre alors sa vignette de
 * remplacement, plutôt qu'une image cassée ou chargée chez un tiers.
 */
export function mediaPath(url: string | null | undefined): string | null {
  if (!url || !API_URL) return null
  try {
    const origin = new URL(API_URL).origin
    const parsed = new URL(url, origin)
    return parsed.origin === origin && /^\/(storage|media)\//.test(parsed.pathname)
      ? parsed.pathname
      : null
  } catch {
    return null
  }
}
