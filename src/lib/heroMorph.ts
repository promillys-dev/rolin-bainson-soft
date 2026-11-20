import { CORSICA_OUTLINE, FRANCE_OUTLINE, LYON, type GeoPoint } from '@/config/map'

/**
 * Géométrie du morphing de la bannière.
 *
 * Les cinq blocs du visuel ne s'effacent pas pour laisser place à une carte :
 * ce sont eux qui se déforment. Chaque bloc est un tracé SVG qui passe d'un
 * rectangle arrondi à une pièce de la France, et les cinq pièces réassemblées
 * font l'Hexagone.
 *
 * Deux conditions pour que deux formes s'interpolent sans se vriller : même
 * nombre de points, même sens de parcours, point de départ comparable. Tout
 * ce module sert à les réunir.
 *
 *   1. projeter le contour géographique dans le repère de la scène ;
 *   2. le couper en cinq par les rectangles de la mosaïque ;
 *   3. rééchantillonner chaque pièce à pas constant ;
 *   4. faire de même avec le rectangle arrondi de départ ;
 *   5. aligner les deux parcours.
 *
 * Le découpage se fait par intersection exacte (Sutherland-Hodgman) et non
 * par une grille de cellules : les pièces voisines partagent alors exactement
 * la même arête, donc la carte réassemblée ne montre aucune couture.
 */

export type Pt = [number, number]

/** Nombre de points par tracé. Assez pour la Bretagne, pas plus. */
const SAMPLES = 80

/**
 * Repère de la scène.
 *
 * La hauteur reprend les proportions exactes de la mosaïque d'origine : trois
 * colonnes, deux rangées de 8,5 rem et un écart de 1 rem, dans une colonne
 * d'environ 503 px au format bureau — soit un rapport de 1,75. Les blocs
 * retrouvent ainsi leur largeur et leur hauteur d'avant.
 */
export const STAGE_W = 100
export const STAGE_H = 57

/**
 * Pavé réservé à la carte.
 *
 * Entièrement contenu dans la scène : la section est en `overflow-hidden`, et
 * tout débordement se ferait rogner. Décalé vers la droite pour laisser à
 * l'encart UNIS, posé en bas à gauche, la place qu'il occupait dans la
 * composition d'origine.
 */
const MAP_BOX = { x: 30, y: 1, w: 62, h: 55 }

/** Pavé occupé par la mosaïque : toute la scène, comme la grille d'origine. */
const AREA = { x: 0, y: 0, w: 100, h: STAGE_H }
/** 1 rem d'écart, ramené au repère. */
const GAP = 3.18

/* ------------------------------------------------------------------ */
/* Projection                                                          */
/* ------------------------------------------------------------------ */

/**
 * Projection équirectangulaire corrigée en latitude. À l'échelle de la
 * France, elle suffit : une projection conique ne changerait la silhouette
 * que de quelques pixels, pour beaucoup plus de code.
 */
const LAT_REF = (46.5 * Math.PI) / 180
const kx = Math.cos(LAT_REF)

function geoBounds(groups: GeoPoint[][]) {
  const xs = groups.flat().map(([lon]) => lon * kx)
  const ys = groups.flat().map(([, lat]) => -lat)
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}

const bounds = geoBounds([FRANCE_OUTLINE, CORSICA_OUTLINE])
const spanX = bounds.maxX - bounds.minX
const spanY = bounds.maxY - bounds.minY
/** Une seule échelle pour les deux axes : la France ne doit pas être étirée. */
const scale = Math.min(MAP_BOX.w / spanX, MAP_BOX.h / spanY)
const offsetX = MAP_BOX.x + (MAP_BOX.w - spanX * scale) / 2
const offsetY = MAP_BOX.y + (MAP_BOX.h - spanY * scale) / 2

function project([lon, lat]: GeoPoint): Pt {
  return [
    offsetX + (lon * kx - bounds.minX) * scale,
    offsetY + (-lat - bounds.minY) * scale,
  ]
}

const francePoly = FRANCE_OUTLINE.map(project)
const corsicaPoly = CORSICA_OUTLINE.map(project)

/* ------------------------------------------------------------------ */
/* Découpe                                                             */
/* ------------------------------------------------------------------ */

type Rect = { x: number; y: number; w: number; h: number }

/**
 * Sutherland-Hodgman : on coupe le polygone par les quatre demi-plans du
 * rectangle, l'un après l'autre. Les pièces obtenues se partagent exactement
 * l'arête de coupe, ce qui est tout l'intérêt ici.
 */
function clipToRect(polygon: Pt[], rect: Rect): Pt[] {
  const edges: ((p: Pt) => boolean)[] = [
    (p) => p[0] >= rect.x,
    (p) => p[0] <= rect.x + rect.w,
    (p) => p[1] >= rect.y,
    (p) => p[1] <= rect.y + rect.h,
  ]
  const intersect: ((a: Pt, b: Pt) => Pt)[] = [
    (a, b) => [rect.x, a[1] + ((b[1] - a[1]) * (rect.x - a[0])) / (b[0] - a[0] || 1e-9)],
    (a, b) => [
      rect.x + rect.w,
      a[1] + ((b[1] - a[1]) * (rect.x + rect.w - a[0])) / (b[0] - a[0] || 1e-9),
    ],
    (a, b) => [a[0] + ((b[0] - a[0]) * (rect.y - a[1])) / (b[1] - a[1] || 1e-9), rect.y],
    (a, b) => [
      a[0] + ((b[0] - a[0]) * (rect.y + rect.h - a[1])) / (b[1] - a[1] || 1e-9),
      rect.y + rect.h,
    ],
  ]

  let output = polygon
  for (let e = 0; e < 4; e++) {
    const inside = edges[e] as (p: Pt) => boolean
    const cut = intersect[e] as (a: Pt, b: Pt) => Pt
    const input = output
    output = []
    for (let i = 0; i < input.length; i++) {
      const current = input[i] as Pt
      const previous = input[(i + input.length - 1) % input.length] as Pt
      const currentIn = inside(current)
      const previousIn = inside(previous)
      if (currentIn) {
        if (!previousIn) output.push(cut(previous, current))
        output.push(current)
      } else if (previousIn) {
        output.push(cut(previous, current))
      }
    }
    if (output.length === 0) return []
  }
  return output
}

/* ------------------------------------------------------------------ */
/* Échantillonnage                                                     */
/* ------------------------------------------------------------------ */

function resample(points: Pt[], count: number): Pt[] {
  if (points.length === 0) return []
  const closed = [...points, points[0] as Pt]

  const lengths: number[] = [0]
  let total = 0
  for (let i = 1; i < closed.length; i++) {
    const a = closed[i - 1] as Pt
    const b = closed[i] as Pt
    total += Math.hypot(b[0] - a[0], b[1] - a[1])
    lengths.push(total)
  }
  if (total === 0) return new Array(count).fill(points[0]) as Pt[]

  const out: Pt[] = []
  let cursor = 1
  for (let i = 0; i < count; i++) {
    const target = (i / count) * total
    while (cursor < lengths.length - 1 && (lengths[cursor] as number) < target) cursor++
    const prev = lengths[cursor - 1] as number
    const next = lengths[cursor] as number
    const span = next - prev || 1
    const t = (target - prev) / span
    const a = closed[cursor - 1] as Pt
    const b = closed[cursor] as Pt
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out
}

function signedArea(points: Pt[]): number {
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    const a = points[i] as Pt
    const b = points[(i + 1) % points.length] as Pt
    sum += a[0] * b[1] - b[0] * a[1]
  }
  return sum / 2
}

const clockwise = (points: Pt[]) =>
  signedArea(points) < 0 ? points : [...points].reverse()

function bbox(points: Pt[]) {
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  return { minX, minY, w: Math.max(...xs) - minX || 1, h: Math.max(...ys) - minY || 1 }
}

/**
 * Fait tourner le second parcours pour que son point de départ tombe en face
 * de celui du premier, positions ramenées à la boîte englobante. Sans cela le
 * bloc se vrille sur lui-même au lieu de se déformer.
 */
function align(source: Pt[], target: Pt[]): Pt[] {
  const sb = bbox(source)
  const tb = bbox(target)
  const first = source[0] as Pt
  const su = (first[0] - sb.minX) / sb.w
  const sv = (first[1] - sb.minY) / sb.h

  let bestIndex = 0
  let bestDistance = Infinity
  target.forEach((p, i) => {
    const tu = (p[0] - tb.minX) / tb.w
    const tv = (p[1] - tb.minY) / tb.h
    const d = (tu - su) ** 2 + (tv - sv) ** 2
    if (d < bestDistance) {
      bestDistance = d
      bestIndex = i
    }
  })

  return [...target.slice(bestIndex), ...target.slice(0, bestIndex)]
}

/**
 * Rayons par coin, en unités de scène.
 *
 * Les blocs du visuel ne sont pas de simples rectangles arrondis : trois
 * d'entre eux portent une grande découpe en quart de cercle, l'un en haut à
 * gauche et deux en bas à droite. C'est cette silhouette-là qui doit se
 * déformer en carte, d'où des rayons distincts plutôt qu'un rayon unique.
 */
export type Corners = { tl: number; tr: number; br: number; bl: number }

function roundedRect(rect: Rect, corners: Corners): Pt[] {
  const { x, y, w, h } = rect
  const cap = Math.min(w, h)
  const tl = Math.min(corners.tl, cap)
  const tr = Math.min(corners.tr, cap)
  const br = Math.min(corners.br, cap)
  const bl = Math.min(corners.bl, cap)

  const arc = (cx: number, cy: number, r: number, from: number, to: number): Pt[] => {
    if (r <= 0) return [[cx, cy]]
    const steps = Math.max(6, Math.round(14 * (r / cap)) + 6)
    const pts: Pt[] = []
    for (let i = 0; i <= steps; i++) {
      const a = from + ((to - from) * i) / steps
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
    }
    return pts
  }

  const HALF_PI = Math.PI / 2
  return [
    ...arc(x + tl, y + tl, tl, Math.PI, Math.PI + HALF_PI),
    ...arc(x + w - tr, y + tr, tr, -HALF_PI, 0),
    ...arc(x + w - br, y + h - br, br, 0, HALF_PI),
    ...arc(x + bl, y + h - bl, bl, HALF_PI, Math.PI),
  ]
}

/* ------------------------------------------------------------------ */
/* Assemblage                                                          */
/* ------------------------------------------------------------------ */

/** Rayon ordinaire des blocs : 1 rem, comme `rounded-card`. */
const SOFT = 3.18

/**
 * Les cinq pavés de la mosaïque, avec leurs découpes.
 *
 * Disposition d'origine : une tuile haute à gauche sur toute la hauteur, puis
 * deux colonnes de deux. La tuile de gauche est échancrée en haut à gauche,
 * celles de droite en bas à droite.
 */
function blockRects(): { rect: Rect; corners: Corners }[] {
  const colW = (AREA.w - 2 * GAP) / 3
  const rowH = (AREA.h - GAP) / 2
  const col = (i: number) => AREA.x + i * (colW + GAP)
  const row = (i: number) => AREA.y + i * (rowH + GAP)
  const big = colW

  return [
    {
      rect: { x: col(0), y: row(0), w: colW, h: AREA.h },
      corners: { tl: big, tr: SOFT, br: SOFT, bl: SOFT },
    },
    {
      rect: { x: col(1), y: row(0), w: colW, h: rowH },
      corners: { tl: SOFT, tr: SOFT, br: SOFT, bl: SOFT },
    },
    {
      rect: { x: col(2), y: row(0), w: colW, h: rowH },
      corners: { tl: SOFT, tr: SOFT, br: big, bl: SOFT },
    },
    {
      rect: { x: col(1), y: row(1), w: colW, h: rowH },
      corners: { tl: SOFT, tr: SOFT, br: SOFT, bl: SOFT },
    },
    {
      rect: { x: col(2), y: row(1), w: colW, h: rowH },
      corners: { tl: SOFT, tr: SOFT, br: big, bl: SOFT },
    },
  ]
}

/**
 * Les cinq fenêtres de découpe, calquées sur la mosaïque : une colonne ouest
 * sur toute la hauteur, puis deux colonnes de deux. Une pièce de la carte
 * occupe donc la même place que le bloc dont elle vient, et la transformation
 * se lit comme un dépliage.
 */
function clipRects(): Rect[] {
  const b = bbox(francePoly)
  const colW = b.w / 3
  const rowH = b.h / 2
  return [
    { x: b.minX, y: b.minY, w: colW, h: b.h },
    { x: b.minX + colW, y: b.minY, w: colW, h: rowH },
    { x: b.minX + 2 * colW, y: b.minY, w: colW, h: rowH },
    { x: b.minX + colW, y: b.minY + rowH, w: colW, h: rowH },
    { x: b.minX + 2 * colW, y: b.minY + rowH, w: colW, h: rowH },
  ]
}

/**
 * Le cercle décoratif posé en bas à droite de la composition.
 *
 * Il était jusqu'ici un simple `<div>` arrondi ; il devient la sixième forme
 * qui se déforme, et c'est lui qui donne la Corse. Ses coordonnées reprennent
 * exactement celles de la règle CSS d'origine — `-right-4 -bottom-10 size-20`
 * — ramenées au repère de la scène : 1 rem vaut 3,18 unités.
 */
function decorCircle(): Pt[] {
  const radius = 7.95 // 5 rem de diamètre
  const cx = STAGE_W + 3.18 - radius // débord de 1 rem à droite
  const cy = STAGE_H + 7.95 - radius // débord de 2,5 rem en bas
  const points: Pt[] = []
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2
    points.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius])
  }
  return points
}

/* ------------------------------------------------------------------ */
/* Les figures                                                         */
/* ------------------------------------------------------------------ */

function circleAt(cx: number, cy: number, r: number, steps = 48): Pt[] {
  const points: Pt[] = []
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2
    points.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
  }
  return points
}

/**
 * Le disque et ses pastilles — la gestion locative.
 *
 * Un grand disque au centre : le bien confié. Cinq pastilles rondes posées à
 * cheval sur son bord, une par charge que la maison reprend — locataire,
 * état des lieux, quittances, travaux, fiscalité. La figure dit la même
 * chose que le texte de la vue, et dans le même ordre.
 *
 * Les pastilles chevauchent le disque au lieu de graviter à distance. Deux
 * raisons : la hauteur disponible est de cinquante unités seulement, et une
 * orbite éloignée en ferait sortir le haut et le bas ; et une pastille posée
 * sur le bord se lit comme une charge *du* bien, là où une pastille lointaine
 * se lirait comme un objet qui passe à côté.
 *
 * Les angles ne sont pas réguliers, et aucun n'est posé sur l'axe vertical :
 * un libellé placé plein haut ou plein bas sortirait de la scène.
 */
export const ORBIT = {
  center: { x: 56, y: 25 },
  /**
   * Rayon du disque — et de l'anneau sur lequel se posent les pastilles.
   *
   * Il déborde la scène en haut et en bas, et c'est voulu : le `viewBox` est
   * celui de la mosaïque des blocs, pas celui de cette figure, et le dessin
   * est laissé visible hors cadre. La bannière a la place de l'accueillir.
   */
  r: 24.7,
  badgeR: 5.5,
  /** L'arc doré, juste en dehors du disque. */
  haloR: 27.9,
  angles: [-130, -55, 10, 75, 160].map((deg) => (deg * Math.PI) / 180),
}

/**
 * Les coordonnées sont arrondies au centième.
 *
 * `Math.cos` n'est pas tenu d'être correctement arrondi : Node et le
 * navigateur peuvent différer d'une unité au dernier chiffre, et React
 * signale alors un écart d'hydratation sur l'attribut concerné. Deux
 * décimales suffisent très largement à la figure, et le nombre est le même
 * des deux côtés.
 */
export const round2 = (value: number) => Math.round(value * 100) / 100

export const orbitBadges = ORBIT.angles.map((angle) => ({
  angle,
  x: round2(ORBIT.center.x + ORBIT.r * Math.cos(angle)),
  y: round2(ORBIT.center.y + ORBIT.r * Math.sin(angle)),
  r: ORBIT.badgeR,
}))

function orbitCluster(): Pt[][] {
  return [
    circleAt(ORBIT.center.x, ORBIT.center.y, ORBIT.r, 72),
    ...orbitBadges.map((badge) => circleAt(badge.x, badge.y, badge.r, 48)),
  ]
}

/**
 * Immeuble — le syndic de copropriété.
 *
 * Un vrai dessin plutôt qu'un empilement : corps principal, toiture, aile
 * basse, porte, bandeau de fenêtres et oculus. Les pièces se recouvrent dans
 * l'ordre où elles sont tracées, ce qui suffit à donner la lecture — la porte
 * et les fenêtres passent par-dessus le corps.
 *
 * L'ordre suit la taille des formes de départ : le grand bloc devient le
 * corps, le petit cercle l'oculus.
 */
function buildingDrawing(): Pt[][] {
  const body = roundedRect({ x: 28, y: 15, w: 34, h: 38 }, { tl: 2, tr: 2, br: 0, bl: 0 })
  // Toiture : un trapèze, donc tracé à la main plutôt qu'en rectangle.
  const roof: Pt[] = [
    [24, 15],
    [34, 5],
    [56, 5],
    [66, 15],
  ]
  const wing = roundedRect({ x: 62, y: 30, w: 20, h: 23 }, { tl: 2, tr: 2, br: 0, bl: 0 })
  const door = roundedRect({ x: 40, y: 40, w: 10, h: 13 }, { tl: 5, tr: 5, br: 0, bl: 0 })
  const windows = roundedRect({ x: 32, y: 21, w: 26, h: 7 }, { tl: 1.5, tr: 1.5, br: 1.5, bl: 1.5 })
  const oculus = circleAt(45, 10.5, 3)
  return [body, roof, wing, door, windows, oculus]
}

/**
 * Bouclier — le courtage d'assurances.
 *
 * Découpé comme la France : un seul contour, coupé par les mêmes fenêtres
 * que la mosaïque, donc des pièces qui s'emboîtent sans couture. La sixième
 * forme garde sa rondeur et devient le bouclier central.
 */
const SHIELD_OUTLINE: Pt[] = (() => {
  const cx = STAGE_W / 2
  const top = 3
  const bottom = STAGE_H - 2
  const halfW = 23
  const shoulder = top + 20
  const waist = top + 32
  return [
    [cx, top],
    [cx + halfW * 0.72, top + 2],
    [cx + halfW, top + 7],
    [cx + halfW, shoulder],
    [cx + halfW * 0.92, waist],
    [cx + halfW * 0.6, bottom - 7],
    [cx, bottom],
    [cx - halfW * 0.6, bottom - 7],
    [cx - halfW * 0.92, waist],
    [cx - halfW, shoulder],
    [cx - halfW, top + 7],
    [cx - halfW * 0.72, top + 2],
  ]
})()


/** Découpe un contour en six pièces calquées sur la mosaïque. */
function splitSilhouette(outline: Pt[], sixth: Pt[]): Pt[][] {
  const b = bbox(outline)
  const colW = b.w / 3
  const rowH = b.h / 2
  const windows: Rect[] = [
    { x: b.minX, y: b.minY, w: colW, h: b.h },
    { x: b.minX + colW, y: b.minY, w: colW, h: rowH },
    { x: b.minX + 2 * colW, y: b.minY, w: colW, h: rowH },
    { x: b.minX + colW, y: b.minY + rowH, w: colW, h: rowH },
    { x: b.minX + 2 * colW, y: b.minY + rowH, w: colW, h: rowH },
  ]
  const pieces = windows.map((w) => clipToRect(outline, w))
  return [...pieces, sixth]
}

/* ------------------------------------------------------------------ */
/* Assemblage                                                          */
/* ------------------------------------------------------------------ */

/** Identifiants des vues, dans l'ordre du diaporama. */
export const STAGE_VIEWS = ['blocks', 'map', 'gestion', 'syndic', 'assurances'] as const
export type StageView = (typeof STAGE_VIEWS)[number]

function perimeter(points: Pt[]): number {
  let total = 0
  for (let i = 0; i < points.length; i++) {
    const a = points[i] as Pt
    const b = points[(i + 1) % points.length] as Pt
    total += Math.hypot(b[0] - a[0], b[1] - a[1])
  }
  return total
}

/**
 * Chaque forme connaît sa position dans chacune des cinq vues.
 *
 * Tous les états sont alignés sur le premier — celui des blocs. Deux états
 * quelconques partagent donc le même ordre de points, et l'on peut
 * interpoler de n'importe lequel vers n'importe quel autre sans que la forme
 * se vrille en chemin.
 */
export type ShapeTrack = { states: Pt[][]; perimeters: number[] }

function buildTracks(): ShapeTrack[] {
  const blocks = blockRects()
  const windows = clipRects()

  const base = blocks.map(({ rect, corners }) =>
    clockwise(resample(roundedRect(rect, corners), SAMPLES)),
  )
  const circle = clockwise(resample(decorCircle(), SAMPLES))
  base.push(circle)

  // Vue « carte » : cinq pièces de France, plus la Corse.
  const france = windows.map((w) => clipToRect(francePoly, w))
  france.push(corsicaPoly)

  const cluster = orbitCluster()
  const building = buildingDrawing()
  const shield = splitSilhouette(
    SHIELD_OUTLINE,
    circleAt(STAGE_W / 2, STAGE_H / 2 + 2, 6.5),
  )

  const targets = [france, cluster, building, shield]

  return base.map((from, index) => {
    const all: Pt[][] = [from]

    for (const target of targets) {
      const raw = target[index]
      if (!raw || raw.length < 3) {
        all.push(from)
        continue
      }
      all.push(align(from, clockwise(resample(raw, SAMPLES))))
    }

    return { states: all, perimeters: all.map(perimeter) }
  })
}

export const shapeTracks = buildTracks()

/**
 * Boîte englobante de chaque forme, vue par vue.
 *
 * Elle sert à caler une photographie sur une forme : le motif SVG prend
 * exactement ces dimensions. Comme la boîte change d'une vue à l'autre, le
 * cadrage suit la figure au lieu de rester accroché à celle des blocs.
 */
export const viewFrames = shapeTracks.map(({ states }) =>
  states.map((points) => {
    const xs = points.map((p) => p[0])
    const ys = points.map((p) => p[1])
    const minX = Math.min(...xs)
    const minY = Math.min(...ys)
    return { x: minX, y: minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY }
  }),
)

export function toPath(points: Pt[]): string {
  if (points.length === 0) return ''
  return (
    points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ') +
    ' Z'
  )
}

const lyonProjected = project(LYON)
export const lyonPoint = { x: lyonProjected[0], y: lyonProjected[1] }

/** Interpolation point à point d'un état vers un autre. */
export function interpolate(track: ShapeTrack, from: number, to: number, t: number): string {
  const a = track.states[from] ?? track.states[0] ?? []
  const b = track.states[to] ?? a
  const points: Pt[] = a.map((p, i) => {
    const q = b[i] ?? p
    return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
  })
  return toPath(points)
}
