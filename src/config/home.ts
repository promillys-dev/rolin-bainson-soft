/**
 * Contenu de la page d'accueil qui n'a pas encore de source de données.
 *
 * Tout ce fichier est provisoire par construction : les actualités viendront
 * du CMS, les compteurs de l'API des biens. Il est isolé ici pour que le
 * branchement se fasse en un seul endroit, et pour qu'on voie d'un coup d'œil
 * ce qui est encore en dur.
 */

/**
 * Compteurs de la légende de la carte.
 *
 * L'ancienne page d'accueil affichait ces trois chiffres sous la carte, en les
 * comptant en base à chaque rendu (`count()` sur toute la table, à chaque
 * visite — c'était un des points lents de la page). Les valeurs ci-dessous
 * sont celles du dernier dump legacy ; elles deviendront un appel API mis en
 * cache.
 */
export const coverageStats = {
  rentals: 9,
  sales: 24,
  agencies: 3,
} as const

/** Les quatre métiers, dans l'ordre d'importance pour la maison. */
export const services = [
  {
    title: 'Transaction',
    image: '/brand/hero-trouver.jpg',
    imageAlt: 'Séjour clair d’un appartement ancien, parquet à chevrons',
    href: '/transaction',
    description:
      "Estimation, mise en valeur et accompagnement jusqu'à la signature, pour vendre comme pour acheter.",
    tint: 'bg-tint-clay/80',
    badge: 'Vendre · Acheter',
  },
  {
    title: 'Gestion immobilière',
    image: '/brand/hero-gestion.jpg',
    imageAlt: 'Signature d’un mandat autour d’une table, en agence',
    href: '/gestion-immobiliere',
    description:
      'Gestion locative pour les propriétaires bailleurs : recherche de locataire, quittances, travaux, fiscalité.',
    tint: 'bg-tint-sand/80',
    badge: 'Propriétaires',
  },
  {
    title: 'Syndic de copropriété',
    image: '/brand/hero-syndic.jpg',
    imageAlt: 'Façade d’immeuble ancien et ses balcons en fer forgé',
    href: '/syndic-de-copropriete',
    description:
      'Administration de votre immeuble, conseil syndical, assemblées générales et suivi des charges.',
    tint: 'bg-tint-sage/80',
    badge: 'Copropriétés',
  },
  {
    title: "Courtage d'assurances",
    image: '/brand/hero-assurances.jpg',
    imageAlt: 'Une mère et ses enfants dans leur salon',
    href: '/courtage-d-assurances',
    description:
      "Garanties adaptées au bien et à l'occupant, de l'habitation à la propriétaire non occupant.",
    tint: 'bg-tint-sky/80',
    badge: 'Garanties',
  },
] as const

/**
 * Actualités.
 *
 * Ces quatre entrées sont de véritables publications retrouvées dans la table
 * `nos_news_post` du site précédent. Elles datent — la dernière campagne
 * éditoriale remonte à 2016 — et c'est précisément ce qu'il faut montrer au
 * client : le bloc actualités n'a de sens que s'il est alimenté. À remplacer
 * par le CMS.
 */
export type NewsItem = {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  category: string
  /** Vignette. Provisoire, comme le reste de ces entrées. */
  image: string
}

export const latestNews: readonly NewsItem[] = [
  {
    slug: 'confluence-deja-une-reference',
    image: '/brand/news-1.jpg',
    title: 'Rolin Bainson Confluence, déjà une référence',
    excerpt:
      "Ouverte cours Charlemagne, l'agence Confluence accompagne les acquéreurs et les bailleurs du 2e arrondissement sur un quartier qui se transforme vite.",
    publishedAt: '2016-02-18',
    category: 'La maison',
  },
  {
    slug: 'deposez-votre-dossier-en-ligne',
    image: '/brand/news-2.jpg',
    title: 'Locataires : déposez votre dossier directement en ligne',
    excerpt:
      'Constituez votre dossier à votre rythme, pièce par pièce, et suivez son avancement sans vous déplacer en agence.',
    publishedAt: '2015-12-11',
    category: 'Location',
  },
  {
    slug: 'agence-ouverte-les-samedis',
    image: '/brand/news-3.jpg',
    title: 'Votre agence ouverte tous les samedis cet été',
    excerpt:
      "L'agence des Charpennes vous accueille le samedi de 9h30 à 12h30 pendant la période estivale, sur rendez-vous ou en visite libre.",
    publishedAt: '2015-06-05',
    category: 'Agences',
  },
  {
    slug: 'assurance-pno',
    image: '/brand/news-4.jpg',
    title: "Propriétaires bailleurs : pensez à l'assurance PNO",
    excerpt:
      "L'assurance propriétaire non occupant couvre votre bien entre deux locataires et complète celle de l'occupant. Notre service courtage vous accompagne.",
    publishedAt: '2015-10-09',
    category: 'Assurances',
  },
]

/** Repères de confiance affichés sous le héros. */
export const trustMarkers = [
  { value: '1957', label: 'La maison accompagne Lyon Métropole' },
  { value: '3', label: 'Agences à Villeurbanne et Lyon' },
  { value: '4', label: 'Métiers sous un même toit' },
] as const
