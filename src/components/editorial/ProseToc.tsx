'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * « Sur cette page » : le sommaire d'un texte long.
 *
 * Le même principe que le sommaire de l'accueil, à l'échelle d'une page :
 * on voit d'un coup d'œil de quoi parle la page, où l'on en est, et l'on
 * saute à la partie qui répond à sa question. La section en cours s'allume ;
 * un filet doré marque celles déjà lues.
 *
 * Ce sont de simples liens d'ancre : sans JavaScript, le sommaire reste une
 * liste de liens qui fonctionne.
 */
export function ProseToc({
  items,
  className,
}: {
  items: readonly { id: string; label: string }[]
  className?: string
}) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null)

    // Le titre actif est le dernier passé sous le tiers haut de l'écran.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = items.findIndex((item) => item.id === entry.target.id)
          if (index >= 0) setActive(index)
        }
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav aria-label="Sur cette page" className={className}>
      <p className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-ink-400 uppercase">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-500" />
        Sur cette page
      </p>
      <ol className="relative mt-4 border-l border-line">
        {items.map((item, index) => {
          const on = index === active
          const done = index < active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? 'location' : undefined}
                className={cn(
                  'relative -ml-px block border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors duration-300',
                  on
                    ? 'border-brand-500 font-medium text-ink-900'
                    : done
                      ? 'border-[#f6c76a] text-ink-500 hover:text-ink-900'
                      : 'border-transparent text-ink-400 hover:text-ink-900',
                )}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
