/**
 * Données de référence du site.
 *
 * Les agences ci-dessous sont les données réelles extraites de la base du site
 * précédent (table `rb_agences`). À terme elles viendront de l'API ; elles sont
 * ici en dur pour que le front soit crédible dès maintenant.
 *
 * Note issue de l'audit : la base legacy contenait 4 lignes d'agences, dont
 * DEUX doublons de l'agence Charpennes (une saisie à la main en 2015, une créée
 * par l'import en 2025 — même adresse, même téléphone, même e-mail). Il y a
 * bien 3 agences, pas 4. À dédoublonner côté back-end.
 */

export const site = {
  name: 'Rolin Bainson',
  legalName: 'Rolin Bainson',
  baseline: 'Transaction · Gestion · Syndic · Assurances à Lyon et Villeurbanne',
  description:
    "Groupe immobilier lyonnais : transaction, gestion locative, syndic de copropriété et courtage d'assurances à Lyon et Villeurbanne.",
  /** L'espace client / extranet est hébergé par H2I, hors de ce site. */
  clientAreaUrl: 'https://rolinbainson.h2i.fr/log_client.php',
  phone: '04 78 93 97 69',
  email: 'contact@rolinbainson.com',
} as const

export type Agency = {
  slug: string
  name: string
  shortName: string
  address: string
  postalCode: string
  city: string
  phone: string
  email: string
  activities: readonly string[]
  openingHours: readonly string[]
  /** Coordonnées GPS. Celles de Confluence, absentes en base, ont été géocodées. */
  coordinates: { lat: number; lng: number } | null
  /** Visuel de l'agence. Provisoire, en attendant les photos de la maison. */
  image: string
}

export const agencies: readonly Agency[] = [
  {
    slug: 'rolin-bainson-sa',
    image: '/brand/agence-1.jpg',
    name: 'Rolin Bainson SA',
    shortName: 'Siège',
    address: "1 rue d'Alsace",
    postalCode: '69100',
    city: 'Villeurbanne',
    phone: '04 78 93 97 69',
    email: 'contact@rolinbainson.com',
    activities: ['Gestion locative', 'Syndic de copropriété', 'Courtage en assurances'],
    openingHours: [
      'Du lundi au jeudi : 9h–11h30 et 13h30–17h30',
      'Le vendredi : 9h–11h30 et 13h30–16h',
    ],
    coordinates: { lat: 45.7716669, lng: 4.8700541 },
  },
  {
    slug: 'agence-charpennes',
    image: '/brand/cta.jpg',
    name: 'Agence Charpennes Rolin Bainson',
    shortName: 'Charpennes',
    address: '52 cours Émile Zola',
    postalCode: '69100',
    city: 'Villeurbanne',
    phone: '04 78 93 00 45',
    email: 'charpennes@rolinbainson.com',
    activities: ['Transaction', 'Location'],
    openingHours: [
      'Du lundi au jeudi : 9h–11h30 et 14h–18h',
      'Le vendredi : 9h–11h30 et 14h–17h',
      "L'été : les samedis de 9h30 à 12h30",
    ],
    coordinates: { lat: 45.7707989, lng: 4.8675167 },
  },
  {
    slug: 'confluence-rolin-bainson',
    // `agence-3.jpg` montrait une façade de bureaux grise et fermée, sans
    // rapport avec le quartier. Celle-ci est Lyon vu d'en haut : les tours
    // de la Part-Dieu au-dessus des toits de tuiles, ciel ouvert. Moderne
    // comme Confluence, et lyonnaise, ce que l'autre n'était pas.
    image: '/brand/coverage.jpg',
    name: 'Confluence Rolin Bainson',
    shortName: 'Confluence',
    address: '7 cours Charlemagne',
    postalCode: '69002',
    city: 'Lyon',
    phone: '04 26 22 40 80',
    email: 'confluence@rolinbainson.com',
    activities: ['Transaction', 'Location'],
    openingHours: [],
    // Géocodé sur la Base Adresse Nationale (score 0,97) : la base legacy
    // n'avait pas de coordonnées pour cette agence.
    coordinates: { lat: 45.746998, lng: 4.824741 },
  },
]
