import Link from 'next/link'
import { buildSearchQuery } from '@/lib/searchParams'
import { cn } from '@/lib/utils'
import type { PropertySearchParams } from '@/types/property'

/**
 * Pagination des résultats.
 *
 * Des liens, pas des boutons : chaque page de résultats doit avoir sa propre
 * URL, atteignable sans JavaScript et indexable. La page courante est marquée
 * `aria-current`, et la fenêtre de numéros reste courte pour ne pas déborder
 * sur mobile.
 */

/** Fenêtre de pages autour de la courante, bornes toujours visibles. */
function pageWindow(page: number, pageCount: number): readonly (number | 'gap')[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)

  const around = [page - 1, page, page + 1].filter((n) => n > 1 && n < pageCount)
  const pages: (number | 'gap')[] = [1]

  if (around.length > 0 && (around[0] ?? 0) > 2) pages.push('gap')
  pages.push(...around)
  if ((around.at(-1) ?? 1) < pageCount - 1) pages.push('gap')
  pages.push(pageCount)

  return pages
}

const itemClass =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-pill px-3 text-sm font-medium transition-colors'

export function Pagination({
  criteria,
  page,
  pageCount,
  pageSize,
}: {
  criteria: PropertySearchParams
  page: number
  pageCount: number
  pageSize: number
}) {
  if (pageCount <= 1) return null

  const href = (target: number) =>
    `/offres${buildSearchQuery(criteria, { page: target, parPage: pageSize })}`

  return (
    <nav aria-label="Pagination des résultats" className="flex justify-center">
      <ul className="flex flex-wrap items-center gap-1.5">
        <li>
          {page > 1 ? (
            <Link
              href={href(page - 1)}
              rel="prev"
              className={cn(itemClass, 'border border-line bg-surface text-ink-800 hover:border-ink-900')}
            >
              Précédent
            </Link>
          ) : (
            <span className={cn(itemClass, 'border border-line text-ink-300')}>Précédent</span>
          )}
        </li>

        {pageWindow(page, pageCount).map((entry, index) =>
          entry === 'gap' ? (
            <li key={`gap-${index}`} className="px-1 text-ink-300" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={entry}>
              {entry === page ? (
                <span aria-current="page" className={cn(itemClass, 'bg-ink-900 text-white')}>
                  {entry}
                </span>
              ) : (
                <Link
                  href={href(entry)}
                  className={cn(
                    itemClass,
                    'border border-line bg-surface text-ink-800 hover:border-ink-900',
                  )}
                >
                  {entry}
                </Link>
              )}
            </li>
          ),
        )}

        <li>
          {page < pageCount ? (
            <Link
              href={href(page + 1)}
              rel="next"
              className={cn(itemClass, 'border border-line bg-surface text-ink-800 hover:border-ink-900')}
            >
              Suivant
            </Link>
          ) : (
            <span className={cn(itemClass, 'border border-line text-ink-300')}>Suivant</span>
          )}
        </li>
      </ul>
    </nav>
  )
}
