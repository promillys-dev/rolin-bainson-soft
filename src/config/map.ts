/**
 * Contour de la France, en coordonnées géographiques.
 *
 * Pourquoi de vraies coordonnées plutôt qu'un dessin : la bannière découpe le
 * pays en cinq pièces qui doivent s'emboîter sans joint. En partant d'un
 * tracé unique et en le coupant par des rectangles, les pièces voisines
 * partagent exactement la même arête. Un masque en grille, lui, donnait des
 * marches d'escalier et des fentes entre les morceaux.
 *
 * Les points suivent le littoral et les frontières dans le sens horaire, en
 * partant de Dunkerque. Une cinquantaine de points suffit : à la taille où la
 * carte s'affiche, le détail supplémentaire ne se verrait pas.
 *
 * Note sur la demande initiale : une carte d'Europe avait été évoquée. Les
 * trois agences sont toutes à Lyon et Villeurbanne, à deux kilomètres l'une de
 * l'autre ; à l'échelle du continent elles se confondent en un point, et la
 * carte laisserait entendre une implantation qui n'existe pas. La France dit
 * la même chose en restant exacte. Pour passer à l'Europe, il suffirait de
 * remplacer ce tracé : rien d'autre ne connaît la géographie.
 */

export type GeoPoint = [lon: number, lat: number]

/** France métropolitaine, sens horaire depuis Dunkerque. */
export const FRANCE_OUTLINE: GeoPoint[] = [
  [2.37, 51.03], // Dunkerque
  [1.85, 50.95], // Calais
  [1.61, 50.73], // Boulogne-sur-Mer
  [1.55, 50.2], // Baie de Somme
  [1.08, 49.93], // Dieppe
  [0.11, 49.49], // Le Havre
  [-0.37, 49.34], // Côte de Nacre
  [-1.25, 49.34],
  [-1.62, 49.64], // Pointe du Cotentin
  [-1.82, 49.2],
  [-1.6, 48.84], // Granville
  [-2.02, 48.65], // Saint-Malo
  [-3.05, 48.78], // Paimpol
  [-4.0, 48.73],
  [-4.49, 48.39], // Brest
  [-4.74, 48.04], // Pointe du Raz
  [-4.1, 47.8],
  [-3.37, 47.75], // Lorient
  [-2.76, 47.66], // Vannes
  [-2.21, 47.27], // Saint-Nazaire
  [-1.78, 46.5], // Les Sables-d'Olonne
  [-1.15, 46.16], // La Rochelle
  [-1.03, 45.62], // Royan
  [-1.17, 44.66], // Arcachon
  [-1.42, 43.9],
  [-1.56, 43.48], // Biarritz
  [-0.37, 42.8], // Pyrénées occidentales
  [0.59, 42.7], // Luchon
  [1.52, 42.5], // Andorre
  [2.3, 42.45],
  [3.03, 42.5], // Perpignan
  [3.14, 43.07], // Narbonne
  [3.88, 43.57], // Montpellier
  [4.85, 43.4], // Camargue
  [5.37, 43.3], // Marseille
  [5.93, 43.12], // Toulon
  [6.64, 43.27], // Saint-Tropez
  [7.27, 43.7], // Nice
  [7.5, 43.78], // Menton
  [6.9, 44.36],
  [6.63, 44.9], // Briançon
  [6.87, 45.92], // Mont-Blanc
  [6.14, 46.2], // Genève
  [6.1, 46.9], // Jura
  [7.0, 47.45],
  [7.59, 47.56], // Bâle
  [7.75, 48.58], // Strasbourg
  [8.13, 48.97], // Lauterbourg
  [7.07, 49.11], // Sarreguemines
  [6.17, 49.47], // Thionville
  [5.77, 49.52], // Longwy
  [4.79, 50.13], // Givet
  [3.97, 50.28], // Maubeuge
  [3.06, 50.63], // Lille
]

/** La Corse, tracée à part : elle ne se découpe pas avec le continent. */
export const CORSICA_OUTLINE: GeoPoint[] = [
  [9.36, 43.01], // Cap Corse
  [9.45, 42.7], // Bastia
  [9.55, 42.1], // Aléria
  [9.28, 41.59], // Porto-Vecchio
  [9.16, 41.39], // Bonifacio
  [8.9, 41.68], // Propriano
  [8.74, 41.93], // Ajaccio
  [8.56, 42.26], // Golfe de Porto
  [8.76, 42.57], // Calvi
  [9.0, 42.64], // L'Île-Rousse
]

/** Lyon, pour poser le repère des agences. */
export const LYON: GeoPoint = [4.835, 45.76]

/**
 * Points d'agence, en décalage autour de Lyon.
 *
 * Les trois agences sont distantes de deux à quatre kilomètres : à l'échelle
 * de la France elles occupent le même point. On les écarte légèrement pour
 * qu'elles restent dénombrables — la carte situe, elle ne mesure pas.
 */
export const AGENCY_POINTS = [
  { slug: 'rolin-bainson-sa', label: 'Rolin Bainson SA', dx: -0.5, dy: -0.4 },
  { slug: 'agence-charpennes', label: 'Agence Charpennes', dx: 0.55, dy: 0.05 },
  { slug: 'confluence-rolin-bainson', label: 'Confluence', dx: -0.1, dy: 0.65 },
] as const
