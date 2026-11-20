'use client'

import { useEffect, useState } from 'react'
import type { StageView } from '@/lib/heroMorph'

/**
 * La photographie de fond de la bannière, une par vue.
 *
 * Chacune est choisie pour ce que dit le texte, pas pour illustrer le métier
 * en général :
 *
 *  - trouver un bien — un appartement ancien, lumineux, parquet en point de
 *    Hongrie : le produit du catalogue, vide et prêt, où le visiteur se
 *    projette. On lui montre ce qu'il cherche, pas quelqu'un qui le cherche ;
 *  - la maison — le Vieux Lyon, Saint-Georges et Fourvière sur la Saône :
 *    « expert à Lyon » se reconnaît avant de se lire ;
 *  - la gestion — la remise des clés sur le bureau : c'est le geste même de
 *    confier son bien ;
 *  - le syndic — une façade entière, étage sur étage : une copropriété, donc
 *    plusieurs foyers derrière les mêmes balcons ;
 *  - les assurances — une mère et son enfant blottis sur le canapé : le
 *    titre parle de l'occupant autant que du bien.
 *
 * Toutes viennent d'Unsplash (licence libre, usage commercial compris),
 * recadrées en 2200 × 1400 et recompressées, entre 130 et 440 Ko. À
 * remplacer par les photos de la maison quand elles seront disponibles.
 */
const BACKDROPS: Record<StageView, { src: string; position: string }> = {
  blocks: { src: '/brand/hero-trouver.jpg', position: '50% 60%' },
  map: { src: '/brand/hero-lyon.jpg', position: '50% 35%' },
  gestion: { src: '/brand/hero-gestion.jpg', position: '50% 30%' },
  syndic: { src: '/brand/hero-syndic.jpg', position: '50% 40%' },
  assurances: { src: '/brand/hero-assurances.jpg', position: '50% 45%' },
}

/**
 * La nouvelle image arrive en mosaïque.
 *
 * Elle est découpée en tuiles qui se posent une à une sur l'ancienne, en
 * vague de gauche à droite — le sens du rail et du filet doré. Un léger
 * décalage propre à chaque tuile casse la régularité du balayage : on doit
 * lire des carreaux qui se posent, pas un rideau qui glisse.
 *
 * Chaque tuile ne contient qu'une fenêtre sur l'image entière, dimensionnée
 * à la taille de la bannière et décalée de la position de la tuile : les
 * morceaux se raccordent exactement, et chaque calque animé reste petit.
 */
const COLS = 7
const ROWS = 4
const TILE_MS = 760
const STEP_MS = 62

const TILES = Array.from({ length: COLS * ROWS }, (_, index) => {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  // Décalage déterministe — identique au serveur et au navigateur.
  const jitter = ((col * 7 + row * 13) % 5) * 28
  return { col, row, delay: Math.round((col + row * 0.6) * STEP_MS + jitter) }
})
const LAST_TILE = TILES.reduce((last, tile) => (tile.delay > last.delay ? tile : last))

export function HeroBackdrop({ slide, onDark }: { slide: StageView; onDark: boolean }) {
  // L'image posée dessous, et celle qui arrive par-dessus en mosaïque. Une
  // fois la dernière tuile posée, la nouvelle passe dessous et les tuiles
  // disparaissent : au repos, il n'y a qu'un calque.
  const [shown, setShown] = useState({ current: slide, previous: slide })
  if (shown.current !== slide) setShown({ current: slide, previous: shown.current })

  // Les images des autres vues sont chargées une fois la page posée : sans
  // cela, la première bascule poserait des tuiles vides.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const { src } of Object.values(BACKDROPS)) new window.Image().src = src
    }, 2500)
    return () => window.clearTimeout(timer)
  }, [])

  const paint = (view: StageView) => ({
    backgroundImage: `url('${BACKDROPS[view].src}')`,
    backgroundPosition: BACKDROPS[view].position,
    // Légèrement désaturée en clair : la photo tient son rôle d'ambiance
    // sans disputer l'orange de la marque.
    filter: onDark ? 'saturate(1.02)' : 'saturate(0.88)',
  })

  const settling = shown.previous !== shown.current

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-no-repeat" style={paint(shown.previous)} />

      {settling ? (
        <div key={shown.current} className="absolute inset-0">
          {TILES.map((tile) => (
            <div
              key={`${tile.col}-${tile.row}`}
              data-mosaic-tile
              className="absolute overflow-hidden"
              style={{
                left: `${(tile.col * 100) / COLS}%`,
                top: `${(tile.row * 100) / ROWS}%`,
                width: `${100 / COLS}%`,
                height: `${100 / ROWS}%`,
                animation: `mosaic-in ${TILE_MS}ms var(--ease-out-soft) ${tile.delay}ms both`,
              }}
              onAnimationEnd={
                tile === LAST_TILE
                  ? () => setShown((state) => ({ ...state, previous: state.current }))
                  : undefined
              }
            >
              <div
                className="absolute bg-cover bg-no-repeat"
                style={{
                  ...paint(shown.current),
                  left: `${-tile.col * 100}%`,
                  top: `${-tile.row * 100}%`,
                  width: `${COLS * 100}%`,
                  height: `${ROWS * 100}%`,
                }}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
