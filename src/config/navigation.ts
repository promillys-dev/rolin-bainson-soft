/**
 * Source unique de vérité pour tous les menus.
 *
 * Les libellés viennent du menu réel du site précédent (table `nos_menu_item`),
 * coquilles corrigées au passage : « Coodronnées » → « Coordonnées »,
 * « Imobilier Vert » → « Immobilier Vert ».
 *
 * Changement d'architecture d'information assumé : le legacy affichait 10 entrées
 * à plat dans la barre principale. Les quatre métiers sont ici regroupés sous
 * « Nos services » et les pages institutionnelles sous « Le groupe », ce qui
 * ramène la barre à 5 entrées. Décision réversible : tout est dans ce fichier.
 */

export type NavLink = {
  label: string
  href: string
  /** Lien sortant : ouvre dans un nouvel onglet avec rel="noreferrer". */
  external?: boolean
  description?: string
}

export type NavItem = NavLink & {
  children?: readonly NavLink[]
}

/** Barre de services, au-dessus du logo. */
export const serviceNav: readonly NavItem[] = [
  { label: 'Contactez-nous', href: '/contact' },
  { label: 'Nous écrire', href: '/nous-ecrire' },
  { label: 'Où nous trouver', href: '/coordonnees-et-acces' },
  { label: 'Être rappelé', href: '/etre-rappele' },
]

/** Navigation principale. */
export const mainNav: readonly NavItem[] = [
  {
    label: 'Nos biens',
    href: '/offres',
    children: [
      {
        label: 'Locations',
        href: '/offres?transaction=location',
        description: 'Appartements, maisons et garages à louer',
      },
      {
        label: 'Ventes',
        href: '/offres?transaction=vente',
        description: 'Biens à vendre sur Lyon et Villeurbanne',
      },
    ],
  },
  {
    label: 'Nos services',
    href: '/nos-services',
    children: [
      {
        label: 'Transaction',
        href: '/transaction',
        description: 'Acheter et vendre accompagné',
      },
      {
        label: 'Gestion immobilière',
        href: '/gestion-immobiliere',
        description: 'Gestion locative pour propriétaires bailleurs',
      },
      {
        label: 'Syndic de copropriété',
        href: '/syndic-de-copropriete',
        description: 'Administration et conseil syndical',
      },
      {
        label: "Courtage d'assurances",
        href: '/courtage-d-assurances',
        description: 'Garanties adaptées à votre bien',
      },
    ],
  },
  { label: 'Agences', href: '/agences' },
  { label: 'Actualités', href: '/actualites' },
  {
    label: 'Le groupe',
    href: '/presentation',
    children: [
      { label: 'Présentation', href: '/presentation' },
      { label: 'Immobilier Vert', href: '/immobilier-vert' },
      { label: 'Recrutement', href: '/recrutement' },
      { label: 'Déposer votre dossier', href: '/deposer-votre-dossier' },
    ],
  },
]

export const footerNav: readonly { title: string; links: readonly NavLink[] }[] = [
  {
    title: 'Nos services',
    links: [
      { label: 'Transaction', href: '/transaction' },
      { label: 'Gestion immobilière', href: '/gestion-immobiliere' },
      { label: 'Syndic de copropriété', href: '/syndic-de-copropriete' },
      { label: "Courtage d'assurances", href: '/courtage-d-assurances' },
      { label: 'Immobilier Vert', href: '/immobilier-vert' },
    ],
  },
  {
    title: 'Nous contacter',
    links: [
      { label: 'Coordonnées et accès', href: '/coordonnees-et-acces' },
      { label: 'Nous écrire', href: '/nous-ecrire' },
      { label: 'Être rappelé', href: '/etre-rappele' },
      { label: 'Candidature', href: '/recrutement' },
    ],
  },
  {
    title: 'Informations',
    links: [
      { label: 'Tarifs', href: '/tarifs' },
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de cookies', href: '/politique-de-cookies' },
      { label: 'Crédits', href: '/credits' },
      { label: 'Plan du site', href: '/plan-du-site' },
      { label: 'Liens utiles', href: '/liens' },
    ],
  },
]
