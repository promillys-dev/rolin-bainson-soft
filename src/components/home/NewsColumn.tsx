'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { SlideRail } from '@/components/home/SlideRail'
import { ArrowLink } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { NewsItem } from '@/config/home'
import { cn } from '@/lib/utils'

/**
 * Le slider d'actualités, en colonne à droite de la carte.
 *
 * Reprend la place que lui donnait l'ancienne page d'accueil — quatre
 * colonnes sur douze, à côté de la carte — et sa navigation est celle de la
 * bannière : le même rail, le même filet doré qui se charge vers la pastille
 * active, le même compte à rebours autour de la flèche suivante. Les deux
 * diaporamas de la page se pilotent du même geste.
 *
 * Les quatre articles sont tous dans le HTML, empilés dans une seule cellule
 * de grille et croisés en opacité : rien n'attend le script pour être lu, et
 * la colonne garde la hauteur du plus long sans sauter d'un article à
 * l'autre.
 */

const DWELL = 8000

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/**
 * Les articles arrivent du composant serveur qui l'entoure, qui les lit au
 * back-office : un composant client ne parle pas à l'API.
 */
export function NewsColumn({
  items: latestNews,
  className,
}: {
  items: readonly NewsItem[]
  className?: string
}) {
  const RAIL = latestNews.map((item) => ({ id: item.slug, label: item.category }))
  const [current, setCurrent] = useState(latestNews[0]?.slug ?? '')
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      if (document.hidden) return
      setCurrent((slug) => {
        const index = latestNews.findIndex((item) => item.slug === slug)
        return latestNews[(index + 1) % latestNews.length]?.slug ?? slug
      })
    }, DWELL)
    return () => window.clearInterval(timer)
  }, [paused, latestNews])

  const hold = useCallback(() => setPaused(true), [])
  const release = useCallback(() => setPaused(false), [])

  return (
    <div
      className={cn('flex flex-col', className)}
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocusCapture={hold}
      onBlurCapture={release}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <Eyebrow>Nos actualités</Eyebrow>
          <h2 className="mt-4 text-[1.75rem] leading-[1.1] font-semibold sm:text-[2rem]">
            La vie de la maison
          </h2>
        </div>
        <ArrowLink href="/actualites" className="shrink-0 pb-1 text-sm">
          Tout voir
        </ArrowLink>
      </div>

      <div className="mt-6 grid flex-1">
        {latestNews.map((item) => {
          const active = item.slug === current
          return (
            <article
              key={item.slug}
              aria-hidden={!active}
              className={cn(
                '[grid-area:1/1] transition-all duration-700 ease-[var(--ease-out-soft)]',
                active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
              )}
            >
              <Link
                href={`/actualites/${item.slug}`}
                tabIndex={active ? undefined : -1}
                className="gilt-edge group flex h-full flex-col overflow-hidden rounded-panel border border-line bg-white shadow-card transition-shadow duration-500 ease-[var(--ease-out-soft)] hover:shadow-raised"
              >
                <div className="relative aspect-16/10 overflow-hidden">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 26rem, 100vw"
                    className={cn(
                      'media-zoom object-cover transition-transform duration-[2400ms] ease-[var(--ease-out-soft)]',
                      // Un très lent recul de l'image à l'arrivée : la vue
                      // respire au lieu de simplement apparaître.
                      active ? 'scale-100' : 'scale-[1.06]',
                    )}
                  />
                  <span className="absolute top-4 left-4 rounded-pill bg-white/90 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-brand-700 shadow-card backdrop-blur">
                    {item.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <time dateTime={item.publishedAt} className="text-xs text-ink-400">
                    {dateFormatter.format(new Date(item.publishedAt))}
                  </time>
                  <h3 className="mt-2 text-lg leading-snug font-semibold transition-colors duration-300 group-hover:text-brand-700">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-500">
                    {item.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700">
                    Lire la suite
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </article>
          )
        })}
      </div>

      <SlideRail
        slides={RAIL}
        current={current}
        onSelect={setCurrent}
        dwellMs={DWELL}
        paused={paused}
        className="mt-5"
      />
    </div>
  )
}
