/**
 * Référentiels de recherche.
 *
 * Valeurs réelles extraites des tables `rb_type_bien`, `rb_nature_bien` et
 * `rb_secteur_bien` du site précédent — ce sont celles que le flux ConvertImmo
 * alimente, donc celles que l'API servira. Elles disent une chose utile sur la
 * maison : son catalogue est lyonnais et urbain (appartements, garages et
 * places de parking), pas de maison ni de terrain.
 */

export const propertyKinds = [
  { value: 't1', label: 'T1' },
  { value: 't2', label: 'T2' },
  { value: 't3', label: 'T3' },
  { value: 't4', label: 'T4' },
  { value: 't5', label: 'T5' },
  { value: 't6-plus', label: 'T6 et +' },
  { value: 'box', label: 'Box' },
  { value: 'garage', label: 'Garage' },
  { value: 'parking', label: 'Parking' },
  { value: 'parking-surface', label: 'Parking en surface' },
] as const

/** Secteurs réellement couverts par le catalogue. */
export const sectors = [
  'Villeurbanne',
  'Lyon 02',
  'Lyon 03',
  'Lyon 05',
  'Lyon 06',
  'Lyon 07',
  'Lyon 08',
  'Lyon 09',
] as const

export const roomOptions = [1, 2, 3, 4, 5, 6] as const
