import type { StageView } from '@/lib/heroMorph'

/**
 * Les cinq vues de la bannière, texte compris.
 *
 * Le diaporama ne change pas qu'un visuel : à chaque figure correspond un
 * propos. L'ordre suit celui d'une visite, pas celui de l'organigramme.
 *
 *  1. « Vous recherchez un bien ? » — on commence par la raison qui amène
 *     neuf visiteurs sur dix. On ne se présente pas à quelqu'un qui cherche
 *     un appartement : on lui montre qu'on a compris ce qu'il vient faire.
 *  2. La maison — une fois l'intention reconnue, on dit qui l'accompagne.
 *  3, 4, 5. Les trois métiers qui portent le reste de l'activité, dans
 *     l'ordre où ils engagent le plus : gérer, administrer, assurer.
 *
 * `cta` renvoie vers l'entrée de menu correspondante : chaque vue est une
 * porte, pas une vitrine.
 */

export type HeroSlide = {
  id: StageView
  /** Nom court, affiché sous les pastilles du rail. */
  label: string
  eyebrow: string
  /** Deux fragments : le second est mis en couleur. */
  title: [string, string, string]
  description: string
  cta: { label: string; href: string }
  secondary: { label: string; href: string }
}

export const heroSlides: readonly HeroSlide[] = [
  {
    id: 'blocks',
    label: 'Trouver un bien',
    eyebrow: 'Location et vente à Lyon Métropole',
    title: ['Vous cherchez ', 'un bien', ' à Lyon ou à Villeurbanne ?'],
    description:
      'Nos annonces sont celles de nos agences. Ce que vous voyez est libre, et quelqu’un ici l’a visité.',
    cta: { label: 'Voir les biens disponibles', href: '/offres' },
    secondary: { label: 'Être rappelé', href: '/etre-rappele' },
  },
  {
    id: 'map',
    label: 'La maison',
    eyebrow: 'Depuis 1957 à Lyon Métropole',
    title: ['Votre ', 'expert immobilier', ' à Lyon et Villeurbanne'],
    description:
      'Quatre métiers sous un même toit, depuis 1957. Et des équipes qui connaissent la rue avant de connaître le bien.',
    cta: { label: 'Nos trois agences', href: '/agences' },
    secondary: { label: 'Nous écrire', href: '/nous-ecrire' },
  },
  {
    id: 'gestion',
    label: 'Gestion locative',
    eyebrow: 'Propriétaires bailleurs',
    title: ['Confiez-nous ', 'la gestion', ' de votre bien'],
    description:
      'Locataire, état des lieux, quittances, travaux, fiscalité. Vous gardez la décision, nous prenons le quotidien.',
    cta: { label: 'La gestion immobilière', href: '/gestion-immobiliere' },
    secondary: { label: 'Demander une estimation', href: '/etre-rappele' },
  },
  {
    id: 'syndic',
    label: 'Syndic',
    eyebrow: 'Conseils syndicaux et copropriétaires',
    title: ['Un syndic qui ', 'connaît', ' votre immeuble'],
    description:
      'Nos immeubles sont à moins de quatre kilomètres de nos bureaux. On peut passer voir — et on le fait.',
    cta: { label: 'Le syndic de copropriété', href: '/syndic-de-copropriete' },
    secondary: { label: 'Changer de syndic', href: '/etre-rappele' },
  },
  {
    id: 'assurances',
    label: 'Assurances',
    eyebrow: 'Courtage',
    title: ['Le bien assuré, ', 'et l’occupant', ' aussi'],
    description:
      'Nous comparons pour vous, et nous restons votre interlocuteur le jour du sinistre.',
    cta: { label: 'Le courtage d’assurances', href: '/courtage-d-assurances' },
    secondary: { label: 'Faire le point', href: '/etre-rappele' },
  },
]

/**
 * Les cinq satellites de la vue « gestion locative ».
 *
 * Ils reprennent mot pour mot l'énumération de la description : la figure et
 * le texte disent la même chose, dans le même ordre. Si l'un change, l'autre
 * doit suivre.
 */
export const gestionOrbit = [
  'Locataire',
  'État des lieux',
  'Quittances',
  'Travaux',
  'Fiscalité',
] as const
