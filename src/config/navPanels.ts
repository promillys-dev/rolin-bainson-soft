/**
 * Ce que montrent les méga-menus de la barre de navigation.
 *
 * Les entrées viennent du menu codé (`config/navigation.ts`) ou, si on le
 * rebranche, du menu `principal` du back-office ; l'un comme l'autre ne
 * donnent que leur libellé et leur adresse. Ce fichier ajoute, par adresse, ce qu'il faut
 * pour en faire une mini-bannière : une accroche, une phrase, une photo. Les
 * textes reprennent ceux des pages elles-mêmes — le menu promet ce que la
 * page tient.
 *
 * Une entrée absente d'ici s'affiche quand même, avec son seul libellé et une
 * photo par défaut : ajouter une entrée au menu ne casse rien.
 */

export type NavPanelInfo = {
  kicker: string
  text: string
  image: string
  /** Cadrage de la photo dans sa vignette. */
  position?: string
}

const gestion: NavPanelInfo = {
  kicker: 'Propriétaires bailleurs',
  text: 'Gestion locative pour les propriétaires bailleurs : recherche de locataire, quittances, travaux, fiscalité.',
  image: '/brand/hero-gestion.jpg',
  position: '50% 30%',
}

const assurances: NavPanelInfo = {
  kicker: 'Courtage',
  text: 'Garanties adaptées au bien et à l’occupant, de l’habitation à la propriétaire non occupant.',
  image: '/brand/hero-assurances.jpg',
  position: '50% 45%',
}

export const navPanels: Record<string, NavPanelInfo> = {
  '/offres?transaction=location': {
    kicker: 'Louer',
    text: 'Nos annonces sont celles de nos agences : ce que vous voyez est libre, et quelqu’un ici l’a visité.',
    image: '/brand/hero-trouver.jpg',
    position: '50% 60%',
  },
  '/offres?transaction=vente': {
    kicker: 'Acheter',
    text: 'Appartements, garages et parkings à vendre à Lyon et Villeurbanne, suivis par nos agences.',
    image: '/brand/hero-syndic.jpg',
    position: '50% 40%',
  },
  '/transaction': {
    kicker: 'Vendre · Acheter',
    text: 'Estimation, mise en valeur et accompagnement jusqu’à la signature, pour vendre comme pour acheter.',
    image: '/brand/hero-trouver.jpg',
    position: '50% 60%',
  },
  '/gestion-immobiliere': gestion,
  '/syndic-de-copropriete': {
    kicker: 'Copropriétés',
    text: 'Administration de votre immeuble, conseil syndical, assemblées générales et suivi des charges.',
    image: '/brand/hero-syndic.jpg',
    position: '50% 40%',
  },
  '/courtage-d-assurances': assurances,
  // Adresse du menu du back-office, redirigée vers la précédente.
  '/courtage-dassurances': assurances,
  '/presentation': {
    kicker: 'Depuis 1957',
    text: 'Quatre métiers sous un même toit, trois agences entre Villeurbanne et Lyon.',
    image: '/brand/hero-lyon.jpg',
    position: '50% 35%',
  },
  '/immobilier-vert': {
    kicker: 'Rénovation énergétique',
    text: 'Rénover avant que la loi vous y oblige : dans quel ordre, et avec quel financement.',
    image: '/brand/block-3.jpg',
  },
  '/recrutement': {
    kicker: 'Nous rejoindre',
    text: 'Découvrez nos offres d’emploi ou déposez votre candidature spontanée auprès de nos équipes.',
    image: '/brand/agence-2.jpg',
  },
  '/deposer-votre-dossier': {
    kicker: 'Candidats locataires',
    text: 'Constituez votre dossier de locataire en ligne, à votre rythme, avec un accompagnement étape par étape.',
    image: '/brand/news-4.jpg',
  },
}

export const defaultNavPanel: NavPanelInfo = {
  kicker: 'Rolin Bainson',
  text: 'Transaction, gestion, syndic et assurances à Lyon et Villeurbanne, depuis 1957.',
  image: '/brand/hero-lyon.jpg',
  position: '50% 35%',
}
