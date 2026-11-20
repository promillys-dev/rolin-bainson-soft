import { timingSafeEqual } from 'node:crypto'

import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'

import { REVALIDATE_SECRET } from '@/lib/api/env'

/**
 * Appelée par l'API après une modification dans le back-office : invalide
 * les données concernées, sans attendre la fin du délai de cache.
 *
 * Même contrat que le front 3 : `POST` avec `Authorization: Bearer
 * <REVALIDATE_SECRET>` et un corps `{ "tags": ["listings", …] }`. Le secret
 * est comparé en temps constant ; sans secret configuré, tout est refusé.
 */
const TAGS = new Set(['site', 'pages', 'posts', 'listings', 'forms', 'insurance'])

function authorized(request: NextRequest): boolean {
  const given = Buffer.from(request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '')
  const expected = Buffer.from(REVALIDATE_SECRET)
  return expected.length > 0 && given.length === expected.length && timingSafeEqual(given, expected)
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return Response.json({ message: 'Non autorisé' }, { status: 401 })
  const body = (await request.json().catch(() => ({}))) as { tags?: unknown }
  const tags = (Array.isArray(body.tags) ? body.tags : []).filter(
    (tag): tag is string => typeof tag === 'string' && TAGS.has(tag),
  )
  // « max » : les visiteurs reçoivent encore l'ancienne version le temps que
  // la nouvelle soit prête.
  for (const tag of tags) revalidateTag(tag, 'max')
  return Response.json({ revalidated: tags })
}
