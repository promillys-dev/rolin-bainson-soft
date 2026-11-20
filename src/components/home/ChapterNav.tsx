'use client'

import { useEffect, useRef, useState } from 'react'
import type { HomeChapter } from '@/config/homeChapters'
import { LOGO_MARK, markPath } from '@/lib/logoMark'
import { cn } from '@/lib/utils'

/**
 * Le sommaire vivant de la page d'accueil.
 *
 * Il répond à trois questions que le visiteur se pose sans les formuler :
 * où suis-je, qu'est-ce qu'on me montre de la maison, et qu'y a-t-il
 * ensuite. Sur grand écran, c'est une colonne de pastilles posée au bord
 * droit : la pastille du chapitre en cours s'allume et annonce son nom
 * quelques secondes à chaque changement — sans rester posée sur le
 * contenu —, son numéro reste affiché en pied de colonne, un filet doré — celui du rail de la bannière — se remplit au fil de la
 * lecture, et au survol le sommaire entier se déplie avec une phrase par
 * chapitre. Lu d'un trait, il présente Rolin Bainson.
 *
 * Sur mobile, une barre flottante en bas d'écran donne le chapitre en cours
 * et deux flèches pour passer au précédent ou au suivant ; elle n'apparaît
 * qu'une fois la bannière dépassée, pour ne pas la recouvrir.
 *
 * Chaque entrée est un simple lien d'ancre : le défilement doux est celui
 * du navigateur, et le sommaire fonctionne au clavier comme une liste de
 * liens. Le chapitre actif est celui qui occupe le milieu de l'écran.
 */

const MARK = (['ink', 'brand'] as const).map((id) => ({
  id,
  d: markPath(LOGO_MARK[id], (point) => point),
}))

const pad = (value: number) => String(value).padStart(2, '0')

export function ChapterNav({ chapters }: { chapters: readonly HomeChapter[] }) {
  const [active, setActive] = useState(0)
  // Le chapitre dont le nom est annoncé, le temps d'une lecture.
  const [announced, setAnnounced] = useState(-1)
  // Le sommaire appartient au contenu : il s'efface sur le pied de page,
  // dont il recouvrirait les menus.
  const [atFooter, setAtFooter] = useState(false)
  const desktopFill = useRef<HTMLSpanElement>(null)
  const mobileFill = useRef<HTMLSpanElement>(null)
  const activeRef = useRef(0)

  // Le chapitre actif : celui qui traverse la ligne médiane de l'écran.
  useEffect(() => {
    const nodes = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((node): node is HTMLElement => node !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = chapters.findIndex((chapter) => chapter.id === entry.target.id)
          if (index >= 0) {
            activeRef.current = index
            setActive(index)
            setAnnounced(index)
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [chapters])

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const observer = new IntersectionObserver(
      ([entry]) => setAtFooter(Boolean(entry?.isIntersecting)),
      { threshold: 0.12 },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (announced < 0) return
    const timer = window.setTimeout(() => setAnnounced(-1), 2600)
    return () => window.clearTimeout(timer)
  }, [announced])

  // Le filet doré : il atteint la pastille du chapitre en cours, puis avance
  // vers la suivante à mesure qu'on lit la section. Écrit directement sur
  // le nœud — un état React re-rendrait le sommaire à chaque pixel.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const index = activeRef.current
      const node = document.getElementById(chapters[index]?.id ?? '')
      let within = 0
      if (node) {
        const rect = node.getBoundingClientRect()
        within = Math.min(Math.max((window.innerHeight / 2 - rect.top) / rect.height, 0), 1)
      }
      const span = Math.max(chapters.length - 1, 1)
      const ratio = Math.min((index + within) / span, 1)
      if (desktopFill.current) desktopFill.current.style.transform = `scaleY(${ratio})`
      if (mobileFill.current) mobileFill.current.style.transform = `scaleX(${ratio})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [chapters, active])

  const current = chapters[active]
  const previous = chapters[active - 1]
  const next = chapters[active + 1]

  return (
    <>
      {/* Grand écran : la colonne de pastilles, au bord droit. */}
      <nav
        aria-label="Sommaire de la page"
        className={cn(
          'group/nav fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 transition-[opacity,translate] duration-500 ease-[var(--ease-out-soft)] lg:block xl:right-6',
          atFooter && 'pointer-events-none translate-x-4 opacity-0',
        )}
      >
        <div className="flex flex-col items-center gap-2 rounded-pill bg-white/80 px-1.5 py-2.5 shadow-raised ring-1 ring-ink-900/10 backdrop-blur-md">
          {/* Le monogramme en tête : il ramène en haut de page, et dit au
              survol de qui parle ce sommaire. */}
          <a
            href={`#${chapters[0]?.id ?? ''}`}
            className="group/item relative grid size-7 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
          >
            <svg aria-hidden="true" viewBox="10 19 62 81" className="h-4 w-auto">
              {MARK.map((panel) => (
                <path
                  key={panel.id}
                  d={panel.d}
                  fill={panel.id === 'brand' ? 'var(--color-brand-500)' : 'var(--color-ink-900)'}
                />
              ))}
            </svg>
            <span className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-card bg-ink-900 px-3 py-2 text-right whitespace-nowrap text-white opacity-0 shadow-raised transition-all duration-300 ease-[var(--ease-out-soft)] group-hover/nav:opacity-100 group-focus-within/nav:opacity-100">
              <span className="block font-display text-sm font-semibold">Rolin Bainson</span>
              <span className="block text-[0.6875rem] text-white/60">
                Lyon et Villeurbanne, depuis 1957
              </span>
            </span>
          </a>

          <span aria-hidden="true" className="h-px w-4 bg-ink-900/10" />

          <ol className="relative flex flex-col">
            {/* La piste et son remplissage doré, d'une pastille à l'autre. */}
            <span
              aria-hidden="true"
              className="absolute top-3.5 bottom-3.5 left-1/2 w-px -translate-x-1/2 bg-ink-900/12"
            >
              <span
                ref={desktopFill}
                className="absolute inset-0 origin-top bg-linear-to-b from-brand-500 via-[#f6c76a] to-brand-400 transition-transform duration-300 ease-out"
                style={{ transform: 'scaleY(0)' }}
              />
            </span>

            {chapters.map((chapter, index) => {
              const on = index === active
              const done = index < active
              const shown = on && announced === index
              return (
                <li key={chapter.id} className="relative hover:z-10 has-[:focus-visible]:z-10">
                  <a
                    href={`#${chapter.id}`}
                    aria-current={on ? 'location' : undefined}
                    className="group/item relative grid size-7 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        'relative block rounded-full transition-all duration-500 ease-[var(--ease-out-soft)]',
                        on
                          ? 'size-3 bg-brand-500 ring-4 ring-[#f6c76a]/35'
                          : done
                            ? 'size-2 bg-brand-400'
                            : 'size-2 bg-ink-900/25 group-hover/item:bg-ink-900/60',
                      )}
                    />

                    {/* Le nom du chapitre : annoncé quand il devient actif,
                        déplié pour tous au survol du sommaire. */}
                    <span
                      className={cn(
                        'pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-card px-3 py-1.5 text-right whitespace-nowrap shadow-card transition-all duration-300 ease-[var(--ease-out-soft)]',
                        on ? 'bg-ink-900 text-white' : 'bg-white text-ink-900 ring-1 ring-line',
                        shown
                          ? 'translate-x-0 opacity-100'
                          : 'translate-x-1 opacity-0 group-hover/nav:translate-x-0 group-hover/nav:opacity-100 group-focus-within/nav:translate-x-0 group-focus-within/nav:opacity-100',
                      )}
                    >
                      <span className="flex items-baseline justify-end gap-2">
                        <span
                          className={cn(
                            'text-[0.6875rem] font-semibold tabular-nums',
                            on ? 'text-brand-300' : 'text-brand-600',
                          )}
                        >
                          {pad(index + 1)}
                        </span>
                        <span className="font-display text-sm font-semibold">{chapter.label}</span>
                      </span>
                      {/* La phrase n'apparaît que pour le chapitre survolé :
                          en lecture, le nom suffit, et déplier toutes les
                          phrases à la fois les ferait se chevaucher. */}
                      <span
                        className={cn(
                          'block max-h-0 overflow-hidden text-[0.6875rem] transition-all duration-300 group-hover/item:mt-0.5 group-hover/item:max-h-6 group-focus-visible/item:mt-0.5 group-focus-visible/item:max-h-6',
                          on ? 'text-white/65' : 'text-ink-400',
                        )}
                      >
                        {chapter.caption}
                      </span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>

          {/* Le numéro du chapitre en cours, toujours lisible. */}
          <span aria-hidden="true" className="h-px w-4 bg-ink-900/10" />
          <span
            aria-hidden="true"
            className="pb-0.5 text-center text-[0.625rem] leading-tight font-semibold tabular-nums"
          >
            <span className="block text-brand-600">{pad(active + 1)}</span>
            <span className="block text-ink-300">{pad(chapters.length)}</span>
          </span>
        </div>
      </nav>

      {/* Mobile : la barre de chapitre, en bas d'écran, après la bannière. */}
      <nav
        aria-label="Chapitres de la page"
        className={cn(
          'fixed inset-x-4 bottom-4 z-40 transition-all duration-500 ease-[var(--ease-out-soft)] lg:hidden',
          active > 0 && !atFooter
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-6 opacity-0',
        )}
      >
        <div className="relative mx-auto flex max-w-md items-center gap-2 overflow-hidden rounded-pill bg-ink-900/92 p-1.5 text-white shadow-raised ring-1 ring-white/10 backdrop-blur-md">
          <ChapterArrow chapter={previous} direction="prev" />
          <p aria-live="polite" className="min-w-0 flex-1 text-center">
            <span className="text-[0.6875rem] font-semibold text-brand-300 tabular-nums">
              {pad(active + 1)} / {pad(chapters.length)}
            </span>{' '}
            <span className="font-display text-sm font-semibold">{current?.label}</span>
            <span className="block truncate text-[0.6875rem] text-white/55">{current?.caption}</span>
          </p>
          <ChapterArrow chapter={next} direction="next" />
          <span aria-hidden="true" className="absolute inset-x-5 bottom-0 h-0.5 bg-white/10">
            <span
              ref={mobileFill}
              className="absolute inset-0 origin-left bg-linear-to-r from-brand-500 via-[#f6c76a] to-brand-400 transition-transform duration-300 ease-out"
              style={{ transform: 'scaleX(0)' }}
            />
          </span>
        </div>
      </nav>
    </>
  )
}

function ChapterArrow({
  chapter,
  direction,
}: {
  chapter: HomeChapter | undefined
  direction: 'prev' | 'next'
}) {
  const path = direction === 'prev' ? 'M10 3 5 8l5 5' : 'm6 3 5 5-5 5'
  const className =
    'grid size-10 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20'
  if (!chapter) {
    return <span aria-hidden="true" className={cn(className, 'opacity-30')} />
  }
  return (
    <a
      href={`#${chapter.id}`}
      className={className}
      aria-label={`${direction === 'prev' ? 'Chapitre précédent' : 'Chapitre suivant'} : ${chapter.label}`}
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 fill-none stroke-current stroke-[1.8]">
        <path d={path} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}
