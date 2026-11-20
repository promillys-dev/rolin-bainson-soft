'use client'

import { useEffect, useRef } from 'react'
import { gestionOrbit } from '@/config/heroSlides'
import { AGENCY_POINTS } from '@/config/map'
import {
  STAGE_H,
  STAGE_VIEWS,
  STAGE_W,
  interpolate,
  lyonPoint,
  ORBIT,
  orbitBadges,
  round2,
  shapeTracks,
  viewFrames,
  type StageView,
} from '@/lib/heroMorph'
import { LOGO_MARK, markPath } from '@/lib/logoMark'
import { cn } from '@/lib/utils'

/**
 * Les blocs, et leur transformation en carte.
 *
 * Six formes : les cinq blocs de la mosaïque, qui deviennent les cinq pièces
 * de l'Hexagone, et le cercle décoratif du coin bas droit, qui devient la
 * Corse. Chacune garde la place qu'elle occupait.
 *
 * La bascule se joue en quatre temps, et c'est ce qui fait le récit :
 *
 *   1. un filet doré parcourt le contour de chaque forme — la transformation
 *      s'annonce avant de commencer ;
 *   2. la signature « Rolin Bainson », posée derrière les blocs, se contracte
 *      et vient se poser sur Lyon, où elle devient le point ;
 *   3. les formes se déforment, décalées les unes par rapport aux autres, et
 *      perdent la photographie qu'elles portaient pour ne garder que la
 *      couleur — une carte ne se lit pas à travers une image ;
 *   4. trois traits sortent du point et vont chercher le nom de chaque
 *      agence, au bout de la ligne.
 *
 * Tout est piloté image par image : la propriété `d` d'un tracé ne s'anime pas
 * de façon fiable d'un navigateur à l'autre, et l'enchaînement des quatre
 * temps demande de toute façon une horloge commune.
 */

/**
 * Deux fonds possibles sous la scène.
 *
 * En `dark`, la carte doit s'éclaircir : les gris profonds qui la dessinent
 * sur fond crème disparaîtraient purement et simplement sur une
 * photographie assombrie.
 */
export type StageTone = 'light' | 'dark'

/** Dégradés des blocs : ceux du visuel d'origine, cercle décoratif compris. */
const BLOCK_GRADIENTS: [string, string][] = [
  ['var(--color-ink-800)', 'var(--color-ink-900)'],
  ['var(--color-brand-400)', 'var(--color-brand-600)'],
  ['var(--color-tint-sand)', 'var(--color-surface-sunken)'],
  ['var(--color-tint-sky)', 'var(--color-surface-sunken)'],
  ['var(--color-ink-700)', 'var(--color-ink-800)'],
  ['var(--color-brand-100)', 'var(--color-brand-200)'],
]

/**
 * Teintes des vues autres que « blocs ».
 *
 * Chaque figure a sa dominante : la carte réserve l'orange au Sud-Est, les
 * barres le gardent pour la plus haute, la tour pour son socle, le bouclier
 * pour son centre. Une seule pièce porte la couleur de marque à la fois —
 * c'est elle qui dit où regarder.
 */
const MAP_GRADIENTS: Record<StageTone, [string, string][]> = {
  light: [
    ['#2a2320', '#15120f'],
    ['#332b26', '#1d1916'],
    ['#3b322b', '#241f1b'],
    ['#2e2724', '#1a1715'],
    ['var(--color-brand-400)', 'var(--color-brand-600)'],
    ['#2a2320', '#15120f'],
  ],
  dark: [
    ['#f3ece4', '#ddd2c6'],
    ['#eae2d8', '#d3c7b9'],
    ['#f6f0e9', '#e2d8cc'],
    ['#e7ded3', '#cfc3b4'],
    ['var(--color-brand-400)', 'var(--color-brand-600)'],
    ['#f3ece4', '#ddd2c6'],
  ],
}

/**
 * Chaque bloc porte une photographie, cadrée sur lui.
 *
 * Une image par bloc, et chacune dit un morceau du métier : les toits du
 * Vieux Lyon, une copropriété, un séjour, la remise des clés, une façade, une
 * chambre. Ensemble, elles racontent la transaction, la gestion et le syndic
 * sans qu'un mot soit écrit.
 *
 * Elles sont recadrées à la source au format exact de leur bloc — portrait
 * marqué pour la tuile haute, paysage court pour les quatre autres, carré
 * pour le cercle — plutôt que laissées au rognage du navigateur. Photos
 * Unsplash, licence libre y compris pour un usage commercial ; à remplacer
 * par les photos de la maison quand elles seront disponibles.
 *
 * Elles sont rendues telles quelles, sans voile coloré. C'est le liseré qui
 * tient alors la composition : sans lui, les blocs se dissoudraient dans la
 * photographie de fond, qui est de la même matière.
 *
 * Une forme peut aussi n'avoir pas de photographie du tout : elle est alors
 * remplie à plat. C'est le cas des pastilles de la gestion locative, qui
 * portent un pictogramme — à ce diamètre, une image ne se lirait pas.
 */
const PHOTOS_BY_VIEW: Record<number, (string | null)[]> = {
  // Vue « blocs » : la maison et son territoire.
  0: [
    '/brand/block-1.jpg', // toits du Vieux Lyon et cathédrale Saint-Jean
    '/brand/block-2.jpg', // immeuble à balcons — la copropriété
    '/brand/block-3.jpg', // séjour lumineux — le bien à louer ou à vendre
    '/brand/block-4.jpg', // remise des clés — la transaction
    '/brand/block-5.jpg', // façade à volets — le patrimoine en gestion
    '/brand/block-6.jpg', // chambre — l'emménagement
  ],
  // Vue « gestion » : le bien au centre, ses charges en pastilles autour.
  2: ['/brand/block-2.jpg', null, null, null, null, null],
}

/**
 * Cadre de chaque bloc, dans son état « blocs ».
 *
 * Il sert à poser l'image une fois sur le bloc plutôt que de la répéter à
 * l'intérieur. Il est calculé sur la forme de départ, donc figé : pendant la
 * déformation le calque photographique s'efface de toute façon, et la carte
 * ne porte que de la couleur.
 */
/** Les vues qui portent des photographies. Les autres vivent de leur couleur. */
const PHOTO_VIEWS = new Set(Object.keys(PHOTOS_BY_VIEW).map(Number))

/** Durées : filet doré, puis déformation, puis légendes. */
const TRACE = 700
const DURATION = 1150
const STAGGER = 85
const SIGNATURE = 1250
const MORPH_END = TRACE + DURATION + STAGGER * 5

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Ancre de la signature dans le repère : centrée, posée au-dessus des blocs. */
const SIGN_X = STAGE_W / 2
const SIGN_Y = -4

/**
 * Légendes : trois traits qui sortent du point et vont chercher un nom.
 *
 * Elles se déploient vers la gauche, seule zone libre une fois la carte en
 * place — la France occupe la moitié droite de la scène.
 */
const LABEL_X = 26
const ELBOW_X = 35
/** Le bas de la scène appartient à la carte UNIS : les légendes s'arrêtent avant. */
const clampY = (y: number) => Math.min(Math.max(y, 8), STAGE_H - 15)

const callouts = AGENCY_POINTS.map((point, index) => {
  const from: [number, number] = [
    lyonPoint.x + point.dx * 1.6,
    lyonPoint.y + point.dy * 1.6,
  ]
  const y = clampY(lyonPoint.y - 7 + (index - 1) * 15)
  const path = `M${from[0].toFixed(2)} ${from[1].toFixed(2)} L${ELBOW_X} ${y.toFixed(2)} L${LABEL_X + 1.5} ${y.toFixed(2)}`
  const length =
    Math.hypot(ELBOW_X - from[0], y - from[1]) + Math.abs(ELBOW_X - (LABEL_X + 1.5))
  return { ...point, path, length, y }
})

/* ------------------------------------------------------------------ */
/* La vue « gestion locative »                                         */
/* ------------------------------------------------------------------ */

const polar = (deg: number, radius: number) =>
  [
    round2(ORBIT.center.x + radius * Math.cos((deg * Math.PI) / 180)),
    round2(ORBIT.center.y + radius * Math.sin((deg * Math.PI) / 180)),
  ] as const

/** Un morceau d'anneau, en degrés, sur le cercle doré qui cerne le disque. */
function haloArc(from: number, to: number): string {
  const [x1, y1] = polar(from, ORBIT.haloR)
  const [x2, y2] = polar(to, ORBIT.haloR)
  const large = Math.abs(to - from) > 180 ? 1 : 0
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${ORBIT.haloR} ${ORBIT.haloR} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

/**
 * L'anneau est rompu, et non continu.
 *
 * Un cercle fermé enfermerait la figure ; deux arcs inégaux la font respirer
 * et laissent passer les pastilles qui les traversent.
 */
const HALO_ARCS = [haloArc(-168, 38), haloArc(62, 118)]
/** Deux points posés sur l'anneau, dans les intervalles. */
const HALO_DOTS = [polar(50, ORBIT.haloR), polar(140, ORBIT.haloR)]

/**
 * Les pictogrammes des pastilles, dessinés dans une boîte de 24 par 24.
 *
 * Un trait, pas d'aplat : à ce diamètre — une soixantaine de pixels — un
 * dessin plein se referme sur lui-même et ne se lit plus. L'ordre suit celui
 * des libellés, donc celui de la description de la vue.
 */
const ORBIT_ICONS: string[][] = [
  // Locataire — une personne.
  ['M12 11.5a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z', 'M4.8 20a7.2 7.2 0 0 1 14.4 0'],
  // État des lieux — la fiche que l'on coche, pièce par pièce.
  [
    'M9 3.5h6v3H9z',
    'M9 5H6.5A1.5 1.5 0 0 0 5 6.5v13A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 17.5 5H15',
    'm8.8 13.4 2.1 2.1 4.3-4.3',
  ],
  // Quittances — le reçu, avec son bord déchiré.
  ['M6 3h12v18l-2.4-1.6-2.4 1.6-2.4-1.6-2.4 1.6L6 21z', 'M9.2 8.6h5.6', 'M9.2 12.4h5.6'],
  // Travaux — la clé à molette.
  [
    'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z',
  ],
  // Fiscalité — le pourcentage.
  ['m18.5 5.5-13 13', 'M8 5.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z', 'M16 13.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z'],
]

/**
 * Le monogramme du logo, au cœur du disque (géométrie dans `lib/logoMark`).
 *
 * Ramené au centre du disque, à une échelle qui laisse deux unités d'air
 * entre la pointe orange et la pastille « Travaux ».
 */
const LOGO_SCALE = 0.44
const LOGO_ORIGIN = { x: 41, y: 59.5 }
const LOGO_PANELS = (['ink', 'brand'] as const).map((id) => ({
  id,
  d: markPath(LOGO_MARK[id], ([x, y]) => [
    ORBIT.center.x + (x - LOGO_ORIGIN.x) * LOGO_SCALE,
    ORBIT.center.y - 0.5 + (y - LOGO_ORIGIN.y) * LOGO_SCALE,
  ]),
}))

/**
 * Chaque libellé s'écarte de sa pastille dans l'axe du rayon, et s'aligne du
 * côté où il a de la place : le texte prolonge la pastille vers l'extérieur
 * au lieu de se poser dessus.
 */
const ORBIT_LABELS: { x: number; y: number; anchor: 'start' | 'middle' | 'end' }[] =
  orbitBadges.map((badge) => {
    const cos = Math.cos(badge.angle)
    const sin = Math.sin(badge.angle)
    const reach = badge.r + 2.6
    return {
      x: round2(badge.x + cos * reach),
      y: round2(badge.y + sin * reach + 0.9),
      anchor: cos > 0.15 ? 'start' : cos < -0.15 ? 'end' : 'middle',
    }
  })

function Gradients({ id, stops }: { id: string; stops: [string, string][] }) {
  return (
    <>
      {stops.map(([from, to], index) => (
        <linearGradient key={index} id={`${id}-${index}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      ))}
    </>
  )
}

export function HeroStage({
  slide,
  tone = 'light',
  className,
}: {
  slide: StageView
  tone?: StageTone
  className?: string
}) {
  const mapStops = MAP_GRADIENTS[tone]
  const onDark = tone === 'dark'

  // Trois jeux de tracés pour un seul jeu de formes : la photographie teintée,
  // les couleurs de la carte, et le filet doré qui en parcourt le contour.
  const photoPaths = useRef<(SVGPathElement | null)[]>([])
  const mapPaths = useRef<(SVGPathElement | null)[]>([])
  const tracers = useRef<(SVGPathElement | null)[]>([])
  const signature = useRef<SVGTextElement>(null)
  const parallax = useRef<SVGGElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const progress = useRef(0)
  const frame = useRef(0)

  // Parallaxe de la signature : elle descend moins vite que la page, donc
  // paraît presque immobile et se laisse recouvrir. Écrite directement sur le
  // nœud — un état React re-rendrait la bannière à chaque pixel défilé.
  useEffect(() => {
    const node = parallax.current
    const svg = svgRef.current
    if (!node || !svg) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const unit = svg.clientWidth / STAGE_W || 1
      const offset = Math.min(window.scrollY * 0.28, 180) / unit
      node.setAttribute('transform', `translate(0 ${offset.toFixed(2)})`)
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const target = Math.max(0, STAGE_VIEWS.indexOf(slide))
    const start = progress.current
    if (start === target) return

    const setShape = (index: number, d: string) => {
      for (const set of [photoPaths, mapPaths, tracers]) {
        set.current[index]?.setAttribute('d', d)
      }
    }

    // La signature se contracte vers Lyon jusqu'à n'être plus qu'un point.
    //
    // On interpole la position de son ancre, de sa place au-dessus des blocs
    // jusqu'à la ville, puis on compose la translation qui amène l'ancre là
    // en tenant compte de l'échelle. Poser directement l'ancre sur Lyon,
    // quelle que soit l'échelle, laissait la signature décalée au milieu de
    // la scène une fois revenue à l'état de repos.
    const setSignature = (t: number) => {
      const node = signature.current
      if (!node) return
      const s = 1 + (0.02 - 1) * t
      const px = SIGN_X + (lyonPoint.x - SIGN_X) * t
      const py = SIGN_Y + (lyonPoint.y - SIGN_Y) * t
      const tx = px - SIGN_X * s
      const ty = py - SIGN_Y * s
      node.setAttribute(
        'transform',
        `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})`,
      )
      node.setAttribute('opacity', `${(0.18 * (1 - t) ** 0.6).toFixed(3)}`)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      progress.current = target
      shapeTracks.forEach((track, i) => setShape(i, interpolate(track, target, target, 1)))
      setSignature(target === 0 ? 0 : 1)
      return
    }

    // En sens inverse, c'est la dernière forme qui part la première : le
    // repliement se lit dans l'autre sens, et non comme un rembobinage.
    const order = target > start ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0]
    const began = performance.now()

    const tick = (now: number) => {
      const elapsed = now - began

      // La signature part dès le filet doré : elle a le temps d'arriver sur
      // Lyon avant que la carte ne soit formée.
      const sig = Math.min(elapsed / SIGNATURE, 1)
      const eased = easeInOut(sig)
      setSignature(target === 0 ? 1 - eased : eased)

      if (elapsed < TRACE) {
        const t = elapsed / TRACE
        shapeTracks.forEach((track, i) => {
          const node = tracers.current[i]
          if (!node) return
          const length = track.perimeters[start] ?? 100
          const dash = length * 0.22
          node.setAttribute('stroke-dasharray', `${dash} ${length}`)
          node.setAttribute('stroke-dashoffset', `${-t * (length + dash)}`)
          node.setAttribute('stroke-opacity', `${Math.sin(Math.PI * t).toFixed(3)}`)
        })
        frame.current = requestAnimationFrame(tick)
        return
      }

      const since = elapsed - TRACE
      let done = true

      shapeTracks.forEach((track, i) => {
        const delay = STAGGER * order.indexOf(i)
        const local = Math.min(Math.max((since - delay) / DURATION, 0), 1)
        if (local < 1) done = false
        setShape(i, interpolate(track, start, target, easeInOut(local)))
        tracers.current[i]?.setAttribute(
          'stroke-opacity',
          `${(Math.sin(Math.PI * local) * 0.55).toFixed(3)}`,
        )
        tracers.current[i]?.setAttribute('stroke-dasharray', 'none')
      })

      if ((!done || sig < 1) && elapsed < MORPH_END + SIGNATURE) {
        frame.current = requestAnimationFrame(tick)
      } else {
        progress.current = target
        tracers.current.forEach((node) => node?.setAttribute('stroke-opacity', '0'))
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [slide])

  // Les photographies n'appartiennent qu'à la vue « blocs » ; le repérage
  // d'agences et les légendes qu'à la carte. Les trois figures qui suivent
  // n'ont ni l'un ni l'autre : elles vivent de leur seule couleur.
  const viewIndex = Math.max(0, STAGE_VIEWS.indexOf(slide))
  const onMap = slide === 'map'
  // La vue en cours porte-t-elle des photographies ? Sinon on garde le
  // dernier jeu monté, le calque étant de toute façon masqué.
  const hasPhotos = PHOTO_VIEWS.has(viewIndex)
  const photoView = hasPhotos ? viewIndex : 0
  const photos = PHOTOS_BY_VIEW[photoView] ?? []
  // La mosaïque de la gestion est cernée d'un liseré doré épais, comme sur la
  // planche de référence ; les blocs gardent leur filet orange discret.
  const gilded = viewIndex === 2

  return (
    <div
      className={cn('relative w-full', className)}
      style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}
      data-slide={slide}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        /* L'ombre portée détache les formes de la photographie de fond, qui
           est contrastée et occupée. Sans elle, la carte s'y dissout. */
        className="size-full overflow-visible [filter:drop-shadow(0_20px_34px_rgb(28_25_23/0.28))]"
        role="img"
        aria-label="Nos trois agences, toutes situées à Lyon et Villeurbanne"
      >
        <defs>
          <Gradients id="block" stops={BLOCK_GRADIENTS} />
          <Gradients id="map" stops={mapStops} />

          {/* Un motif par forme, calé sur sa boîte englobante dans la vue en
              cours : le cadrage suit la figure au lieu de rester accroché à
              celle des blocs. */}
          {photos.map((src, index) => {
            if (!src) return null
            const frame = viewFrames[index]?.[photoView] ?? { x: 0, y: 0, w: 1, h: 1 }
            return (
              <pattern
                key={index}
                id={`tile-${index}`}
                patternUnits="userSpaceOnUse"
                x={frame.x}
                y={frame.y}
                width={frame.w}
                height={frame.h}
              >
                <image
                  href={src}
                  x="0"
                  y="0"
                  width={frame.w}
                  height={frame.h}
                  preserveAspectRatio="xMidYMid slice"
                />
                {/* Sur la gestion, le disque porte le monogramme : la photo
                    est voilée pour qu'il s'y détache. Le voile est dans le
                    motif, donc sous les pastilles qui chevauchent le bord. */}
                {photoView === 2 && index === 0 ? (
                  <rect width={frame.w} height={frame.h} fill="rgb(21 18 15 / 0.42)" />
                ) : null}
              </pattern>
            )
          })}

          {/* Lueur chaude posée sous le disque de la gestion : elle décolle la
              figure de la photographie de fond, qui est sombre et occupée. */}
          <radialGradient id="orbit-glow">
            <stop offset="0%" stopColor="#f6c76a" stopOpacity={onDark ? 0.3 : 0.22} />
            <stop offset="55%" stopColor="#e5703a" stopOpacity={onDark ? 0.14 : 0.1} />
            <stop offset="100%" stopColor="#e5703a" stopOpacity="0" />
          </radialGradient>

          {/* Les deux panneaux du monogramme. Sur fond sombre, le panneau
              noir passe en crème — c'est la déclinaison inversée du logo. */}
          <linearGradient id="logo-ink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={onDark ? '#fbf6ef' : '#2a2320'} />
            <stop offset="100%" stopColor={onDark ? '#e6dccf' : '#0f0d0b'} />
          </linearGradient>
          <linearGradient id="logo-brand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-400)" />
            <stop offset="100%" stopColor="var(--color-brand-600)" />
          </linearGradient>

          <linearGradient id="gilt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f6c76a" />
            <stop offset="50%" stopColor="#e5703a" />
            <stop offset="100%" stopColor="#f6c76a" />
          </linearGradient>
          <filter id="gilt-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="0.7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Signature, en retrait derrière les blocs. */}
        <g ref={parallax}>
          <text
            ref={signature}
            x={SIGN_X}
            y={SIGN_Y}
            textAnchor="middle"
            className="font-display font-semibold select-none"
            fontSize="9.5"
            letterSpacing="-0.4"
            fill={onDark ? '#ffffff' : 'var(--color-ink-900)'}
            opacity={onDark ? 0.16 : 0.18}
          >
            Rolin Bainson
          </text>
        </g>

        {/* Lueur de la vue « gestion », sous les formes. */}
        <circle
          cx={ORBIT.center.x}
          cy={ORBIT.center.y}
          r={ORBIT.r * 1.55}
          fill="url(#orbit-glow)"
          className="transition-opacity duration-700 ease-[var(--ease-out-soft)]"
          style={{ opacity: gilded ? 1 : 0 }}
        />

        {/* L'anneau tourne, arcs et points ensemble : c'est le seul mouvement
            continu de la figure. Il est posé avant les formes, donc il passe
            derrière les pastilles au lieu de les barrer. */}
        <g
          className={cn(
            'transition-opacity duration-500 ease-[var(--ease-out-soft)]',
            gilded ? 'opacity-100 delay-[900ms]' : 'opacity-0',
          )}
        >
          <g
            data-orbit-spin
            style={{
              transformBox: 'view-box',
              transformOrigin: `${ORBIT.center.x}px ${ORBIT.center.y}px`,
              animation: 'orbit-spin 32s linear infinite',
              animationPlayState: gilded ? 'running' : 'paused',
            }}
          >
            <g fill="none" stroke="url(#gilt)" strokeLinecap="round" opacity="0.85">
              {HALO_ARCS.map((d, index) => (
                <path key={index} d={d} strokeWidth={index === 0 ? 0.55 : 0.4} />
              ))}
            </g>
            {HALO_DOTS.map(([x, y]) => (
              <circle key={`${x}`} cx={x} cy={y} r="0.7" fill="#f6c76a" />
            ))}
          </g>
        </g>

        {/* Calque photographique : les blocs portent l'image, en répétition. */}
        <g
          className="transition-opacity duration-700 ease-[var(--ease-out-soft)]"
          style={{ opacity: hasPhotos ? 1 : 0 }}
        >
          {shapeTracks.map((track, index) => (
            <path
              key={index}
              ref={(node) => {
                photoPaths.current[index] = node
              }}
              d={interpolate(track, 0, 0, 0)}
              /* Sans photographie, la forme est un aplat clair : c'est le
                 fond des pastilles de la gestion, sur lequel se détache le
                 pictogramme. */
              fill={photos[index] ? `url(#tile-${index})` : 'var(--color-surface-warm)'}
              /* Le liseré remplace le voile coloré : il détoure chaque bloc
                 et rend la couleur de marque à une composition devenue
                 entièrement photographique. Sur la gestion, seul le disque
                 central porte l'or — cinq pastilles dorées se disputeraient
                 le regard avec lui. */
              stroke={
                gilded
                  ? index > 0
                    ? 'rgb(255 255 255 / 0.85)'
                    : 'url(#gilt)'
                  : 'var(--color-brand-500)'
              }
              strokeWidth={gilded ? (index > 0 ? 0.8 : 0.6) : 0.55}
              strokeLinejoin="round"
              className="transition-[stroke-width] duration-700 ease-[var(--ease-out-soft)]"
            />
          ))}
        </g>

        {/* Calque de la carte : la couleur seule, sans image. */}
        <g
          className="transition-opacity duration-700 ease-[var(--ease-out-soft)]"
          style={{ opacity: hasPhotos ? 0 : 1 }}
        >
          {shapeTracks.map((track, index) => (
            <path
              key={index}
              ref={(node) => {
                mapPaths.current[index] = node
              }}
              d={interpolate(track, 0, 0, 0)}
              fill={`url(#map-${index})`}
            />
          ))}
        </g>

        {/* Filet doré : il parcourt le contour avant chaque transformation. */}
        <g fill="none" stroke="url(#gilt)" strokeLinecap="round" filter="url(#gilt-glow)">
          {shapeTracks.map((track, index) => (
            <path
              key={index}
              ref={(node) => {
                tracers.current[index] = node
              }}
              d={interpolate(track, 0, 0, 0)}
              strokeWidth="0.7"
              strokeOpacity="0"
            />
          ))}
        </g>

        {/* Le point d'arrivée de la signature, puis les trois agences. */}
        <g
          className={cn(
            'transition-opacity duration-500 ease-[var(--ease-out-soft)]',
            onMap ? 'opacity-100 delay-[1150ms]' : 'opacity-0',
          )}
        >
          <circle
            cx={lyonPoint.x}
            cy={lyonPoint.y}
            r="5"
            fill="none"
            stroke={onDark ? 'var(--color-ink-900)' : 'white'}
            strokeOpacity="0.45"
            strokeWidth="0.3"
          />
          {AGENCY_POINTS.map((point) => (
            <circle
              key={point.slug}
              cx={lyonPoint.x + point.dx * 1.6}
              cy={lyonPoint.y + point.dy * 1.6}
              r="0.85"
              fill={onDark ? 'var(--color-ink-900)' : 'white'}
              stroke={onDark ? '#ffffff' : 'var(--color-ink-900)'}
              strokeWidth="0.25"
            />
          ))}
        </g>

        {/* La vue « gestion » : l'arc doré, les pictogrammes, les noms. */}
        <g
          className={cn(
            'transition-opacity duration-500 ease-[var(--ease-out-soft)]',
            gilded ? 'opacity-100 delay-[900ms]' : 'opacity-0',
          )}
        >
          {/* Le monogramme descend se poser dans le disque, un panneau après
              l'autre — ce sont des flèches tournées vers le bas, elles
              arrivent dans leur sens. */}
          <g style={{ filter: 'drop-shadow(0 1.2px 1.6px rgb(0 0 0 / 0.45))' }}>
            {LOGO_PANELS.map((panel, index) => (
              <path
                key={panel.id}
                d={panel.d}
                fill={`url(#logo-${panel.id})`}
                stroke="rgb(255 255 255 / 0.55)"
                strokeWidth="0.25"
                strokeLinejoin="round"
                style={{
                  opacity: gilded ? 1 : 0,
                  transform: gilded ? 'translateY(0)' : 'translateY(-5px)',
                  transition:
                    'opacity 520ms var(--ease-out-soft), transform 820ms var(--ease-out-soft)',
                  transitionDelay: gilded ? `${950 + index * 180}ms` : '0ms',
                }}
              />
            ))}
          </g>

          {orbitBadges.map((badge, index) => {
            const label = ORBIT_LABELS[index]
            // Le pictogramme est dessiné dans une boîte de 24 ; on la ramène
            // à soixante pour cent du diamètre de la pastille, centrée.
            const scale = (badge.r * 1.16) / 24
            return (
              <g
                key={gestionOrbit[index]}
                style={{
                  opacity: gilded ? 1 : 0,
                  transition: 'opacity 420ms var(--ease-out-soft)',
                  transitionDelay: gilded ? `${1050 + index * 130}ms` : '0ms',
                }}
              >
                <g
                  transform={`translate(${(badge.x - 12 * scale).toFixed(2)} ${(badge.y - 12 * scale).toFixed(2)}) scale(${scale.toFixed(4)})`}
                  fill="none"
                  stroke="var(--color-brand-500)"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {(ORBIT_ICONS[index] ?? []).map((d) => (
                    <path key={d} d={d} />
                  ))}
                </g>

                <text
                  x={label?.x}
                  y={label?.y}
                  textAnchor={label?.anchor}
                  className="font-display"
                  fontSize="2.8"
                  fontWeight="600"
                  fill={onDark ? '#ffffff' : 'var(--color-ink-900)'}
                  stroke={onDark ? 'rgb(21 18 15 / 0.75)' : 'var(--color-surface-warm)'}
                  strokeWidth="0.9"
                  strokeLinejoin="round"
                  paintOrder="stroke"
                >
                  {gestionOrbit[index]}
                </text>
              </g>
            )
          })}
        </g>

        {/* Légendes : le trait se dessine, le nom arrive au bout. */}
        <g>
          {callouts.map((callout, index) => (
            <g key={callout.slug}>
              <path
                d={callout.path}
                fill="none"
                stroke="var(--color-brand-500)"
                strokeWidth="0.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={callout.length}
                strokeDashoffset={onMap ? 0 : callout.length}
                style={{
                  transition: 'stroke-dashoffset 620ms var(--ease-out-soft)',
                  transitionDelay: onMap ? `${1900 + index * 220}ms` : '0ms',
                }}
              />
              <circle
                cx={LABEL_X + 1.5}
                cy={callout.y}
                r="0.6"
                fill="var(--color-brand-500)"
                className="transition-opacity duration-300"
                style={{
                  opacity: onMap ? 1 : 0,
                  transitionDelay: onMap ? `${2400 + index * 220}ms` : '0ms',
                }}
              />
              <text
                x={LABEL_X - 1}
                y={callout.y}
                textAnchor="end"
                className="font-display"
                fontSize="2.7"
                fontWeight="600"
                fill={onDark ? '#ffffff' : 'var(--color-ink-900)'}
                /* Halo dans la couleur du fond : les légendes se posent sur la
                   photographie, et doivent rester lisibles quel que soit ce
                   qu'il y a dessous. */
                stroke={onDark ? 'rgb(21 18 15 / 0.75)' : 'var(--color-surface-warm)'}
                strokeWidth="0.9"
                strokeLinejoin="round"
                paintOrder="stroke"
                style={{
                  opacity: onMap ? 1 : 0,
                  transition: 'opacity 420ms var(--ease-out-soft)',
                  transitionDelay: onMap ? `${2450 + index * 220}ms` : '0ms',
                }}
              >
                <tspan x={LABEL_X - 1} dy="-0.3">
                  {callout.label}
                </tspan>
                <tspan
                  x={LABEL_X - 1}
                  dy="3.3"
                  fontSize="2.2"
                  fontWeight="400"
                  fill={onDark ? 'rgb(255 255 255 / 0.65)' : 'var(--color-ink-400)'}
                >
                  {callout.slug === 'confluence-rolin-bainson' ? 'Lyon 2e' : 'Villeurbanne'}
                </tspan>
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
