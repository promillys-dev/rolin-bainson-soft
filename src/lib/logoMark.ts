/**
 * Le monogramme du logo, en géométrie.
 *
 * Deux panneaux dressés en perspective, chacun terminé par une pointe de
 * flèche tournée vers le bas : le petit sombre à gauche, le grand orange à
 * droite. Les sommets sont relevés au pixel sur
 * `public/brand/rolin-bainson.png` (109 px de haut) ; ils servent tels quels
 * partout où le logo est redessiné — au cœur du disque de la gestion
 * locative, et dans la scène de la recherche.
 */

export type MarkPoint = [number, number]
export type MarkPanel = 'ink' | 'brand'

export const LOGO_MARK: Record<MarkPanel, MarkPoint[]> = {
  ink: [[12, 39.5], [29.5, 33.5], [29.5, 77], [34.5, 77.5], [29.3, 84.5], [12, 76.5]],
  brand: [[34.5, 30.5], [57.5, 21.5], [57.5, 87.5], [70, 87.5], [56.5, 97.5], [34.5, 87.5]],
}

/** Boîte englobante d'un panneau, dans le repère du logo. */
export function markBox(points: MarkPoint[]) {
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  return { x: minX, y: minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY }
}

/**
 * Le tracé d'un panneau, après une transformation de son choix.
 *
 * Arrondi au centième : le même nombre doit sortir du serveur et du
 * navigateur, sans quoi React signale un écart d'hydratation.
 */
export function markPath(points: MarkPoint[], map: (point: MarkPoint) => MarkPoint): string {
  return (
    points
      .map((point, index) => {
        const [x, y] = map(point)
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`
      })
      .join(' ') + ' Z'
  )
}

/**
 * Un panneau posé dans une boîte : coin haut gauche en (x, y), hauteur h.
 * La largeur suit, pour garder les proportions du dessin.
 */
export function placeMark(points: MarkPoint[], at: { x: number; y: number; h: number }) {
  const box = markBox(points)
  const scale = at.h / box.h
  return {
    d: markPath(points, ([x, y]) => [at.x + (x - box.x) * scale, at.y + (y - box.y) * scale]),
    box: { x: at.x, y: at.y, w: box.w * scale, h: at.h },
  }
}
