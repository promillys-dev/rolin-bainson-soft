'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { HeroBackdrop } from '@/components/home/HeroBackdrop'
import { HeroCopy } from '@/components/home/HeroCopy'
import { HeroStage, type StageTone } from '@/components/home/HeroStage'
import { SlideRail } from '@/components/home/SlideRail'
import { trustMarkers } from '@/config/home'
import { heroSlides } from '@/config/heroSlides'
import type { StageView } from '@/lib/heroMorph'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

/**
 * Bannière interactive.
 *
 * Cinq diapositives, et le fond en fait partie : la photographie change, en
 * mosaïque, en même temps que la figure se transforme.
 *
 * L'état vit ici, et non dans la scène, parce que le fond de section et le
 * visuel doivent basculer ensemble. Le texte reste rendu côté serveur : il
 * arrive en `children`, ce composant ne fait que l'entourer.
 */

const RAIL_SLIDES = heroSlides.map(({ id, label }) => ({ id, label }))

/**
 * Durée d'affichage avant bascule automatique.
 *
 * Généreuse : la séquence complète — filet doré, signature qui rejoint Lyon,
 * déformation, puis les trois légendes — court sur près de trois secondes. En
 * deçà, la carte repartirait avant d'avoir fini de se raconter.
 */
const DWELL = 9500

/**
 * Le voile posé sur la photo, dans la couleur de fond du site.
 *
 * Dosage délicat : une photographie de reportage est contrastée et occupée,
 * elle entre en concurrence avec le texte à gauche et avec la scène animée à
 * droite. Opaque sous le texte, il s'allège vers la droite sans jamais
 * disparaître — la photo doit rester une atmosphère, pas un sujet. La seconde
 * passe ramène le bas à l'opaque, pour que la bannière rejoigne la section
 * suivante sans couture.
 */
/**
 * Variante sombre : la photographie est montrée en entier, et c'est une
 * couche sombre — et non la couleur du site — qui rend le texte lisible.
 *
 * Elle reste légère à droite pour que l'image respire, et se renforce à
 * gauche sous le texte. La dernière bande ramène au crème du site, sans quoi
 * la bannière se couperait net sur la section suivante.
 *
 * Allégée d'environ un dixième depuis que chaque vue a sa photographie :
 * l'image change avec le propos, elle mérite d'être un peu plus vue.
 */
const SCRIM_DARK =
  // Assombrissement localisé derrière la colonne de texte. C'est lui qui
  // garantit le contraste du titre : la passe horizontale seule dépend de ce
  // que la photographie montre à cet endroit, et une photo claire reprend
  // toujours le dessus.
  'radial-gradient(75% 95% at 20% 48%,' +
  ' rgb(12 10 9 / 0.66) 0%,' +
  ' rgb(12 10 9 / 0.4) 45%,' +
  ' transparent 72%),' +
  'linear-gradient(100deg,' +
  ' rgb(15 13 11 / 0.86) 0%,' +
  ' rgb(15 13 11 / 0.78) 34%,' +
  ' rgb(15 13 11 / 0.62) 62%,' +
  ' rgb(15 13 11 / 0.5) 100%),' +
  'linear-gradient(to bottom,' +
  ' rgb(15 13 11 / 0.56) 0%,' +
  ' transparent 22%,' +
  ' transparent 80%,' +
  ' var(--color-surface-warm) 100%)'

const SCRIM =
  'linear-gradient(100deg,' +
  ' var(--color-surface-warm) 0%,' +
  ' color-mix(in oklab, var(--color-surface-warm) 97%, transparent) 26%,' +
  ' color-mix(in oklab, var(--color-surface-warm) 84%, transparent) 46%,' +
  ' color-mix(in oklab, var(--color-surface-warm) 66%, transparent) 70%,' +
  ' color-mix(in oklab, var(--color-surface-warm) 56%, transparent) 100%),' +
  'linear-gradient(to bottom,' +
  ' color-mix(in oklab, var(--color-surface-warm) 45%, transparent) 0%,' +
  ' transparent 26%,' +
  ' transparent 70%,' +
  ' var(--color-surface-warm) 100%)'

export function HeroExperience({ tone = 'light' }: { tone?: StageTone }) {
  const onDark = tone === 'dark'
  const [slide, setSlide] = useState<StageView>('blocks')
  const [paused, setPaused] = useState(false)
  // Le titre ne monte mot à mot qu'à partir de la première bascule : au
  // chargement, il est là d'emblée.
  const [touched, setTouched] = useState(false)
  if (!touched && slide !== 'blocks') setTouched(true)

  // Bascule automatique, suspendue au survol et au focus clavier, en pause
  // quand l'onglet passe en arrière-plan, et désactivée si l'utilisateur
  // limite les animations — les deux boutons suffisent alors.
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      if (document.hidden) return
      setSlide((current) => {
        const next = (heroSlides.findIndex((s) => s.id === current) + 1) % heroSlides.length
        return heroSlides[next]?.id ?? 'blocks'
      })
    }, DWELL)

    return () => window.clearInterval(timer)
  }, [paused])

  const hold = useCallback(() => setPaused(true), [])
  const release = useCallback(() => setPaused(false), [])

  // Sur mobile, un glissé horizontal change de vue, comme sur tout carrousel
  // tactile. Un geste surtout vertical reste un défilement de la page.
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const step = (direction: 1 | -1) =>
    setSlide((current) => {
      const index = heroSlides.findIndex((item) => item.id === current)
      return heroSlides[(index + direction + heroSlides.length) % heroSlides.length]?.id ?? 'blocks'
    })

  return (
    <section
      /* Un filet en pied ferme franchement la bannière : sans lui, la photo
         se fondrait dans la section suivante et la recherche paraîtrait
         encore lui appartenir. */
      className={cn(
        'relative overflow-hidden border-b',
        onDark ? 'border-ink-900/15 bg-ink-900' : 'border-line bg-surface-warm',
      )}
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocusCapture={hold}
      onBlurCapture={release}
      onTouchStart={(event) => {
        const touch = event.touches[0]
        touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current
        const touch = event.changedTouches[0]
        touchStart.current = null
        if (!start || !touch) return
        const dx = touch.clientX - start.x
        const dy = touch.clientY - start.y
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1)
      }}
    >
      {/* Une photographie par vue, qui arrive en mosaïque. */}
      <HeroBackdrop slide={slide} onDark={onDark} />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: onDark ? SCRIM_DARK : SCRIM }} />

      <Container width="wide" className="relative pt-[45px] pb-[10px]">
        {/* Une seule grille, deux compositions.

            Sur ordinateur : le texte et ses repères à gauche, la figure à
            droite, le rail de navigation en pied.

            Sur mobile, à la manière de la bannière de Meta Energy : la figure
            remonte dans le coin haut droit, débordant du bord de l'écran,
            les commandes du diaporama se logent à sa gauche, et le texte
            passe dessous. Ce sont les mêmes éléments, replacés par la
            grille : la figure, coûteuse, n'est rendue qu'une fois. */}
        <div className="grid grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] items-center gap-x-3 gap-y-8 lg:grid-cols-[1.05fr_1fr] lg:gap-x-16 lg:gap-y-0 xl:gap-x-20">
          <MobileSlideNav
            current={slide}
            onSelect={setSlide}
            paused={paused}
            className="col-start-1 row-start-1 self-center lg:hidden"
          />

          {/* Les cinq textes occupent la même cellule et se croisent : tout
              est dans le HTML initial, et basculer ne coûte qu'une classe. */}
          <div className="col-span-2 row-start-2 lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:self-end">
            <div className="grid">
              {heroSlides.map((item, index) => (
                <HeroCopy
                  key={item.id}
                  slide={item}
                  tone={tone}
                  primary={index === 0}
                  active={item.id === slide}
                  number={index + 1}
                  total={heroSlides.length}
                  animate={touched}
                />
              ))}
            </div>
          </div>

          {/* Les repères chiffrés, communs aux cinq vues : ils restent
              en place pendant que le propos change au-dessus d'eux, et
              c'est ce qui ancre la bannière. */}
          <dl
              className={cn(
                'animate-rise col-span-2 row-start-3 grid max-w-lg grid-cols-3 gap-6 self-start border-t pt-6 lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:mt-10',
                onDark ? 'border-white/15 sm:ml-6' : 'border-line',
              )}
              style={{ animationDelay: '260ms' }}
            >
              {trustMarkers.map((marker) => (
                <div key={marker.value}>
                  <dt
                    className={cn(
                      'font-serif text-[1.75rem] leading-none font-semibold sm:text-[2rem]',
                      onDark
                        ? 'text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.4)]'
                        : 'text-ink-900',
                    )}
                  >
                    {marker.value}
                  </dt>
                  <dd
                    className={cn(
                      'mt-2 text-xs leading-snug',
                      onDark ? 'text-white/70' : 'text-ink-400',
                    )}
                  >
                    {marker.label}
                  </dd>
                </div>
              ))}
          </dl>

          <div
            className="animate-fade col-start-2 row-start-1 -mr-4 sm:-mr-6 lg:mr-0 lg:row-span-2 lg:self-center"
            style={{ animationDelay: '200ms' }}
          >
            {/* La composition : la figure animée, et la carte UNIS à cheval
                sur son coin bas gauche. Le cercle détouré qui coiffait le
                coin haut gauche a été retiré : il ne s'accordait à aucune des
                cinq figures et venait mordre sur l'orbite de la gestion.

                Sur mobile, la figure est un peu agrandie depuis le bord
                droit, et la carte UNIS se retire : à cette taille, elle
                recouvrirait la figure. */}
            <div className="relative origin-right max-lg:scale-[1.06]">
              <HeroStage slide={slide} tone={tone} />

              <div
                className="animate-rise absolute -bottom-8 left-8 hidden items-center gap-3 rounded-panel border border-line bg-surface/95 p-3 pr-5 shadow-float backdrop-blur lg:flex"
                style={{ animationDelay: '720ms' }}
              >
                <Image
                  src="/brand/unis.png"
                  alt=""
                  width={90}
                  height={90}
                  className="size-10 rounded-card object-contain"
                />
                <p className="text-sm leading-snug">
                  <span className="block font-semibold text-ink-900">Membre UNIS</span>
                  <span className="block text-ink-400">Union des syndicats de l’immobilier</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Le rail ferme la bannière : il part de la gauche, traverse toute la
            largeur et vient mourir sur les commandes du diaporama. Sur
            mobile, ses commandes sont remontées à côté de la figure. */}
        <div className="hidden lg:block">
          <SlideRail
            slides={RAIL_SLIDES}
            current={slide}
            onSelect={(id) => setSlide(id as StageView)}
            tone={tone}
            dwellMs={DWELL}
            paused={paused}
            className="mt-16"
          />
        </div>
        <div aria-hidden="true" className="h-8 lg:hidden" />
      </Container>
    </section>
  )
}

/**
 * Les commandes du diaporama, version mobile.
 *
 * Logées à gauche de la figure, dans le coin haut de la bannière : le numéro
 * de la vue, son nom, les deux flèches — la suivante porte le compte à
 * rebours, comme sur le rail du bureau — et une rangée de pastilles.
 */
function MobileSlideNav({
  current,
  onSelect,
  paused,
  className,
}: {
  current: StageView
  onSelect: (id: StageView) => void
  paused: boolean
  className?: string
}) {
  const index = Math.max(
    0,
    heroSlides.findIndex((item) => item.id === current),
  )
  const go = (direction: 1 | -1) => {
    const next = heroSlides[(index + direction + heroSlides.length) % heroSlides.length]
    if (next) onSelect(next.id)
  }
  const arrow =
    'relative inline-flex size-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors duration-300 active:bg-white/10'

  return (
    <div className={cn('animate-fade text-white', className)}>
      <p
        key={current}
        aria-live="polite"
        className="animate-rise font-display leading-none font-semibold [text-shadow:0_1px_2px_rgb(0_0_0/0.4)]"
      >
        <span className="text-[2.5rem] tracking-tight">{String(index + 1).padStart(2, '0')}</span>
        <span className="ml-1 text-sm text-white/50">/ {String(heroSlides.length).padStart(2, '0')}</span>
        <span className="mt-2 block text-xs font-medium tracking-wide text-[#f6c76a]">
          {heroSlides[index]?.label}
        </span>
      </p>

      <div className="mt-4 flex items-center gap-2">
        <button type="button" onClick={() => go(-1)} className={arrow}>
          <span className="sr-only">Vue précédente</span>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current stroke-[1.8]">
            <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" onClick={() => go(1)} className={arrow}>
          <span className="sr-only">Vue suivante</span>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current stroke-[1.8]">
            <path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute -inset-1 size-[calc(100%+0.5rem)] -rotate-90">
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
                animation: `ring-progress ${DWELL}ms linear forwards`,
                animationPlayState: paused ? 'paused' : 'running',
              }}
            />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex items-center gap-1">
        {heroSlides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-pressed={i === index}
            className="inline-flex h-6 items-center"
          >
            <span className="sr-only">{item.label}</span>
            <span
              aria-hidden="true"
              className={cn(
                'block h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-out-soft)]',
                i === index ? 'w-5 bg-brand-500' : 'w-1.5 bg-white/35',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
