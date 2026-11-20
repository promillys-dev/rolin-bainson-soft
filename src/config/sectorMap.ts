/**
 * La carte du secteur.
 *
 * Le site précédent affichait ici une carte Google en `<iframe>` vers
 * `gmap.html`, avec une clé vide qui la condamnait. Celle-ci est un vrai
 * plan, composé une fois pour toutes à partir des tuiles du Plan IGN v2
 * (Géoplateforme, licence ouverte Etalab 2.0, sans clé), au zoom 15, puis
 * désaturé dans les tons du site. Aucune requête à un tiers au chargement,
 * aucun bandeau de consentement, aucun coût à l'usage.
 *
 * L'emprise couvre tous les biens du catalogue et les trois agences, avec
 * une marge. Les bords sont donnés en degrés : c'est ce qui permet de poser
 * une épingle à sa vraie place, par la projection de Mercator qu'utilisent
 * les tuiles.
 *
 * Pour regénérer l'image (nouvelle emprise, autre zoom), le script qui l'a
 * produite assemble les tuiles WMTS `GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2`,
 * matrice `PM`, et rogne au pixel ; seules ces quatre valeurs en dépendent.
 */
export const SECTOR_MAP = {
  src: '/brand/map-secteur.webp',
  width: 1800,
  height: 1125,
  north: 45.78602066035836,
  south: 45.73068889522789,
  west: 4.782958030700684,
  east: 4.909858703613281,
  attribution: '© IGN — Plan IGN',
} as const

const mercatorY = (lat: number) => {
  const rad = (lat * Math.PI) / 180
  return Math.log(Math.tan(rad) + 1 / Math.cos(rad))
}

/**
 * Position d'un point sur la carte, en pourcentage de sa largeur et de sa
 * hauteur. Arrondi au centième : le même nombre doit sortir du serveur et
 * du navigateur.
 */
export function projectOnMap(lat: number, lng: number) {
  const { north, south, west, east } = SECTOR_MAP
  const x = ((lng - west) / (east - west)) * 100
  const y = ((mercatorY(north) - mercatorY(lat)) / (mercatorY(north) - mercatorY(south))) * 100
  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 }
}
