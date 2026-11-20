'use client'

import type { StageTone } from '@/components/home/HeroStage'
import { cn } from '@/lib/utils'

/**
 * Rail de navigation du diaporama.
 *
 * Une longue ligne traverse le bas de la bannière et vient mourir sur un
 * groupe de pastilles rondes encadrées de deux flèches. Le nom de la
 * diapositive en cours est écrit dessous : les pastilles situent, le texte
 * nomme.
 *
 * À chaque bascule, un filet doré se charge le long de la ligne, de gauche à
 * droite, puis le tracé se poursuit dans le contour des pastilles — toujours
 * de gauche à droite — jusqu'à celle qui devient active. Le mouvement est
 * continu : la ligne amène le regard là où le choix se fait.
 *
 * Les animations sont relancées en remontant les éléments à chaque
 * changement : une animation CSS ne rejoue pas d'elle-même, et le `key` posé
 * sur la diapositive courante suffit, les deux vues alternant toujours.
 */

/** Rayon et périmètre de l'anneau, en unités du `viewBox`. */
const RING_R = 7
const CIRCUMFERENCE = 2 * Math.PI * RING_R

/** La ligne se charge, puis chaque anneau se dessine à son tour. */
const SWEEP_MS = 560
const RING_MS = 300
const RING_STEP = 220

type Slide = { id: string; label: string }

export function SlideRail({
  slides,
  current,
  onSelect,
  tone = 'light',
  dwellMs,
  paused = false,
  className,
}: {
  slides: readonly Slide[]
  current: string
  onSelect: (id: string) => void
  tone?: StageTone
  /** Durée avant bascule automatique, pour le compte à rebours. */
  dwellMs?: number
  paused?: boolean
  className?: string
}) {
  const onDark = tone === 'dark'
  const index = Math.max(
    0,
    slides.findIndex((slide) => slide.id === current),
  )
  const step = (direction: 1 | -1) => {
    const next = (index + direction + slides.length) % slides.length
    const target = slides[next]
    if (target) onSelect(target.id)
  }

  const arrowClass = cn(
    'inline-flex size-9 items-center justify-center rounded-full border transition-colors duration-300',
    onDark
      ? 'border-white/25 text-white/70 hover:border-white/60 hover:text-white'
      : 'border-line-strong text-ink-400 hover:border-ink-900 hover:text-ink-900',
  )

  return (
    <div className={cn('flex items-center gap-5 sm:gap-8', className)}>
      {/* La ligne reste fine et nue. C'est une petite pastille dorée qui la
          parcourt de gauche à droite, en emportant sa lueur : le halo passe,
          il ne s'installe pas. */}
      <div
        aria-hidden="true"
        className={cn('relative hidden h-px flex-1 sm:block', onDark ? 'bg-white/20' : 'bg-line')}
      >
        <span
          key={current}
          data-rail-travel
          className="absolute top-1/2 h-[3px] w-10 rounded-full bg-linear-to-r from-brand-500 via-[#f6c76a] to-brand-400 shadow-[0_0_14px_3px_rgb(246_199_106/0.45)]"
          style={{ animation: `rail-travel ${SWEEP_MS}ms var(--ease-out-soft) both` }}
        />
      </div>

      <div className="flex flex-col items-start gap-2 sm:items-end">
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={() => step(-1)} className={arrowClass}>
            <span className="sr-only">Vue précédente</span>
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current stroke-[1.8]">
              <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div key={current} className="flex items-center gap-0">
            {slides.map((slide, i) => {
              const active = slide.id === current
              // Seuls les anneaux parcourus par le filet s'animent : il va de
              // la gauche jusqu'à la pastille qui devient active, pas au-delà.
              const swept = i <= index

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => onSelect(slide.id)}
                  aria-pressed={active}
                  className="group relative inline-flex size-9 items-center justify-center"
                >
                  <span className="sr-only">{slide.label}</span>

                  {/* La pastille en cours est nettement plus grande : c'est
                      elle qui doit se repérer d'un coup d'œil, pas la série. */}
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className={cn(
                      'size-full origin-center transition-transform duration-500 ease-[var(--ease-out-soft)]',
                      active ? 'scale-[1.35]' : 'scale-[0.6]',
                    )}
                  >
                    {/* Contour au repos */}
                    <circle
                      cx="10"
                      cy="10"
                      r={RING_R}
                      fill="none"
                      strokeWidth="1.2"
                      className={cn(
                        'transition-colors duration-300',
                        onDark
                          ? active
                            ? 'stroke-white/70'
                            : 'stroke-white/25 group-hover:stroke-white/50'
                          : active
                            ? 'stroke-ink-900/60'
                            : 'stroke-line-strong group-hover:stroke-ink-400',
                      )}
                    />

                    {/* Le filet doré qui se dessine, départ à gauche. */}
                    {swept ? (
                      <circle
                        data-ring-draw
                        cx="10"
                        cy="10"
                        r={RING_R}
                        fill="none"
                        stroke="#f6c76a"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        transform="rotate(180 10 10)"
                        style={
                          {
                            '--circumference': CIRCUMFERENCE,
                            strokeDasharray: CIRCUMFERENCE,
                            animation: `ring-draw ${RING_MS}ms var(--ease-out-soft) ${SWEEP_MS + i * RING_STEP}ms both`,
                          } as React.CSSProperties
                        }
                      />
                    ) : null}

                    {/* Pastille pleine : la vue en cours. */}
                    <circle
                      cx="10"
                      cy="10"
                      r="5"
                      className={cn(
                        'origin-center transition-all duration-500 ease-[var(--ease-out-soft)]',
                        active ? 'scale-100 fill-brand-500' : 'scale-0 fill-transparent',
                      )}
                    />
                  </svg>
                </button>
              )
            })}
          </div>

          <button type="button" onClick={() => step(1)} className={cn(arrowClass, 'relative')}>
            <span className="sr-only">Vue suivante</span>
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current stroke-[1.8]">
              <path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Compte à rebours avant la bascule automatique. Il rend la
                pause au survol visible : sans lui, l'arrêt du diaporama ne se
                remarque pas et on croit l'animation figée. */}
            {dwellMs ? (
              <svg
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="absolute -inset-1 size-[calc(100%+0.5rem)] -rotate-90"
              >
                <circle
                  key={current}
                  data-ring-progress
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="#f6c76a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray="100"
                  style={{
                    animation: `ring-progress ${dwellMs}ms linear forwards`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              </svg>
            ) : null}
          </button>
        </div>

        {/* Le nom de la vue en cours, sous les pastilles. */}
        <p
          aria-live="polite"
          className={cn(
            'text-xs font-medium tracking-wide',
            onDark ? 'text-white/70' : 'text-ink-500',
          )}
        >
          {slides[index]?.label}
        </p>
      </div>
    </div>
  )
}
