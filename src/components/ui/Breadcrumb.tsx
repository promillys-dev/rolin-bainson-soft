import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Fil d'Ariane.
 *
 * Le site précédent en affichait un sur toutes les pages internes
 * (`Lib\Ariane\Filariane`) ; il est repris, mais avec les données structurées
 * que le legacy n'avait pas. Sur une arborescence à trois niveaux comme
 * `/offres/<référence>/<slug>`, c'est ce qui permet aux moteurs d'afficher le
 * chemin plutôt que l'URL brute.
 *
 * Le dernier élément n'est pas un lien : il désigne la page courante.
 *
 * `tone="dark"` le pose sur l'en-tête sombre des pages intérieures.
 */
export type Crumb = { label: string; href?: string }

export function Breadcrumb({
  items,
  tone = 'light',
  className,
}: {
  items: readonly Crumb[]
  tone?: 'light' | 'dark'
  className?: string
}) {
  const onDark = tone === 'dark'
  const trail: readonly Crumb[] = [{ label: 'Accueil', href: '/' }, ...items]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  }

  return (
    <nav aria-label="Fil d’Ariane" className={cn('text-sm', className)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ol
        className={cn(
          'flex flex-wrap items-center gap-x-2 gap-y-1',
          onDark ? 'text-white/55' : 'text-ink-400',
        )}
      >
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className={onDark ? 'text-white/25' : 'text-line-strong'}>
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    'transition-colors',
                    onDark ? 'hover:text-white' : 'hover:text-brand-700',
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast && (onDark ? 'text-white' : 'text-ink-700'))}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
