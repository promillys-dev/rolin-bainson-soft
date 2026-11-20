import type { ProseSection } from '@/components/editorial/Prose'

/**
 * Les quatre métiers.
 *
 * CONTENU DE REMPLISSAGE, à faire relire par la maison. Le site précédent
 * avait une page par métier (`transaction.html`, `gestion-immobilière.html`,
 * `syndic-de-copropriété.html`, `courtage-d'assurances.html`) mais leur texte
 * n'était pas dans la livraison : tout ce qui suit est écrit d'après ce que
 * fait une agence lyonnaise de cette taille, pas d'après leurs mots.
 *
 * Ce qui est vrai et ne doit pas être réécrit sans vérification : les quatre
 * métiers sont bien internes, et c'est l'argument central de la maison — un
 * propriétaire n'a qu'un interlocuteur de la mise en location à l'assurance.
 */
export type ServicePage = {
  slug: string
  /** Libellé de l'onglet et du fil d'Ariane. */
  name: string
  eyebrow: string
  /** La fin du titre passe en orange, comme sur l'accueil. */
  titleLead: string
  titleAccent: string
  description: string
  /** Trois ou quatre promesses, en cartes teintées. */
  highlights: readonly { title: string; description: string; tint: string }[]
  /** Le déroulé d'une mission, numéroté. */
  steps: readonly { title: string; description: string }[]
  sections: readonly ProseSection[]
  cta: { title: string; description: string; href: string; label: string }
}

export const servicePages: readonly ServicePage[] = [
  {
    slug: 'transaction',
    name: 'Transaction',
    eyebrow: 'Vendre · Acheter',
    titleLead: 'Vendre ou acheter',
    titleAccent: 'avec quelqu’un qui connaît l’immeuble',
    description:
      "Sur Lyon et Villeurbanne, deux appartements identiques sur le papier peuvent valoir dix pour cent d'écart selon leur immeuble, leurs charges et les travaux déjà votés. C'est cette différence que nous mettons sur la table, à la vente comme à l'achat.",
    highlights: [
      {
        title: 'Estimation argumentée',
        description:
          "Une valeur fondée sur les ventes réellement signées du secteur, pas sur les prix affichés. Vous recevez le raisonnement, pas seulement le chiffre.",
        tint: 'bg-tint-clay',
      },
      {
        title: 'Diffusion maîtrisée',
        description:
          "Photos, descriptif et diagnostics préparés avant la mise en ligne. Une annonce publiée à moitié prête se grille en quinze jours.",
        tint: 'bg-tint-sand',
      },
      {
        title: 'Acquéreurs qualifiés',
        description:
          "Financement vérifié avant la visite. Cela évite les offres qui tombent trois semaines plus tard et font perdre la dynamique.",
        tint: 'bg-tint-sage',
      },
      {
        title: 'Jusqu’à la signature',
        description:
          "Suivi des conditions suspensives, relations avec les notaires et le syndic, préparation du pré-état daté. C'est là que les ventes se perdent.",
        tint: 'bg-tint-sky',
      },
    ],
    steps: [
      {
        title: 'Le rendez-vous d’estimation',
        description:
          "Sur place, une heure environ. Nous regardons le bien, mais aussi la copropriété : charges, travaux votés, procédures en cours. Vous recevez l'estimation écrite sous huit jours.",
      },
      {
        title: 'La préparation du dossier',
        description:
          'Diagnostics, règlement de copropriété, trois derniers procès-verbaux d’assemblée. Un dossier complet dès le premier jour raccourcit la vente de plusieurs semaines.',
      },
      {
        title: 'Les visites',
        description:
          "Toujours accompagnées, jamais groupées. Un acquéreur qui visite seul ne pose pas ses vraies questions, et nous n'entendons pas ses objections.",
      },
      {
        title: 'L’offre et la signature',
        description:
          "Nous vous transmettons les offres par écrit avec le plan de financement en regard, puis suivons le compromis et l'acte jusqu'à la remise des clés.",
      },
    ],
    sections: [
      {
        title: 'Combien ça coûte',
        paragraphs: [
          "Nos honoraires de transaction sont dégressifs et affichés : ils figurent dans notre barème, consultable sur ce site comme en vitrine de nos agences. Ils ne sont dus qu'à la signature de l'acte authentique.",
          "Sauf mention contraire sur l'annonce, les honoraires sont à la charge de l'acquéreur et le prix affiché est F.A.I. — frais d'agence inclus. Le prix net vendeur figure sur chaque fiche de bien.",
        ],
      },
      {
        title: 'Mandat simple ou exclusif',
        paragraphs: [
          "Nous proposons les deux. L'exclusivité n'a d'intérêt que si elle vous apporte quelque chose : en pratique, elle nous permet d'investir sur la préparation du bien et de concentrer les visites sur une période courte, ce qui se voit sur le prix final.",
          "Un mandat exclusif chez nous est de trois mois, non reconduit tacitement. Si le résultat n'est pas là, vous reprenez votre liberté sans discussion.",
        ],
      },
    ],
    cta: {
      title: 'Faire estimer votre bien',
      description:
        'Un rendez-vous sur place, une estimation écrite sous huit jours, sans engagement de mandat.',
      href: '/etre-rappele/projet-immobilier',
      label: 'Demander une estimation',
    },
  },
  {
    slug: 'gestion-immobiliere',
    name: 'Gestion immobilière',
    eyebrow: 'Propriétaires bailleurs',
    titleLead: 'Votre bien géré',
    titleAccent: 'sans que vous ayez à y penser',
    description:
      "Recherche de locataire, quittances, travaux, régularisation de charges, déclaration fiscale : la gestion locative est une suite de petites échéances, dont une seule oubliée coûte cher. Nous les tenons à votre place.",
    highlights: [
      {
        title: 'Locataires sélectionnés',
        description:
          'Dossiers vérifiés pièce par pièce, revenus contrôlés, garants étudiés. Le meilleur rendement est celui qu’on encaisse vraiment.',
        tint: 'bg-tint-sand',
      },
      {
        title: 'Encaissements et quittances',
        description:
          'Appels de loyer, quittancement, relances. Vous recevez votre virement et votre compte-rendu à date fixe.',
        tint: 'bg-tint-sage',
      },
      {
        title: 'Travaux et sinistres',
        description:
          'Artisans que nous connaissons, devis comparés, suivi jusqu’à la réception. Les urgences sont traitées sans vous attendre.',
        tint: 'bg-tint-sky',
      },
      {
        title: 'Fiscalité',
        description:
          'Récapitulatif annuel prêt pour votre déclaration, revenus fonciers ou micro-foncier, avec le détail des charges déductibles.',
        tint: 'bg-tint-clay',
      },
    ],
    steps: [
      {
        title: 'L’état des lieux de départ',
        description:
          "Nous visitons votre bien, évaluons le loyer réellement atteignable compte tenu de l'encadrement, et listons ce qui mérite d'être fait avant la mise en location.",
      },
      {
        title: 'La mise en location',
        description:
          'Diffusion, visites accompagnées, étude des dossiers. Vous validez le candidat retenu avant toute signature.',
      },
      {
        title: 'La vie du bail',
        description:
          'Quittances, révisions annuelles, régularisation des charges, suivi des impayés le cas échéant. Vous êtes informé, pas sollicité.',
      },
      {
        title: 'Le départ et la relocation',
        description:
          "État des lieux de sortie, restitution du dépôt de garantie, remise en état, relocation. L'objectif est de réduire la vacance à quelques jours.",
      },
    ],
    sections: [
      {
        title: 'L’encadrement des loyers, concrètement',
        paragraphs: [
          "Lyon et Villeurbanne sont en zone encadrée depuis novembre 2021. À chaque relocation et à chaque révision, nous vérifions le loyer de référence majoré applicable à votre logement et la justification d'un éventuel complément de loyer.",
          "Ce n'est pas une formalité : un loyer fixé au-dessus du plafond expose à une action en diminution, rétroactive. C'est l'une des raisons pour lesquelles un bailleur a intérêt à déléguer.",
        ],
      },
      {
        title: 'Garantie des loyers impayés',
        paragraphs: [
          "Notre service courtage propose une garantie loyers impayés adossée à la gestion. Elle couvre les loyers, les charges et, selon les contrats, les frais de procédure et les dégradations locatives.",
          "Elle suppose un dossier locataire conforme aux critères de l'assureur — ce qui recoupe exactement notre façon de sélectionner les candidats.",
        ],
      },
    ],
    cta: {
      title: 'Confier votre bien en gestion',
      description:
        'Parlons de votre logement, de son loyer atteignable et de ce que la gestion changerait pour vous.',
      href: '/etre-rappele',
      label: 'Être rappelé',
    },
  },
  {
    slug: 'syndic-de-copropriete',
    name: 'Syndic de copropriété',
    eyebrow: 'Copropriétés',
    titleLead: 'Un syndic qui répond,',
    titleAccent: 'et qui connaît votre immeuble',
    description:
      "La plainte la plus fréquente envers un syndic n'est pas le prix, c'est le silence. Nous gérons un nombre limité de copropriétés, sur un périmètre géographique resserré, pour que chaque immeuble ait un interlocuteur identifié qui l'a déjà visité.",
    highlights: [
      {
        title: 'Un gestionnaire identifié',
        description:
          'Un nom, une ligne directe, une adresse. Pas de plateforme ni de numéro de dossier pour signaler une fuite.',
        tint: 'bg-tint-sage',
      },
      {
        title: 'Comptes lisibles',
        description:
          'Budget prévisionnel, appels de fonds et répartition présentés de façon compréhensible par un copropriétaire, pas seulement par un comptable.',
        tint: 'bg-tint-sand',
      },
      {
        title: 'Assemblées préparées',
        description:
          'Le conseil syndical est reçu avant chaque assemblée. Les résolutions qui échouent sont presque toujours celles découvertes en séance.',
        tint: 'bg-tint-sky',
      },
      {
        title: 'Travaux suivis',
        description:
          'Plusieurs devis, un calendrier, une réception contradictoire. Et un plan pluriannuel pour ne pas subir les gros postes.',
        tint: 'bg-tint-clay',
      },
    ],
    steps: [
      {
        title: 'La reprise de la copropriété',
        description:
          "Récupération des archives, audit des comptes, point sur les impayés et les procédures en cours. Un changement de syndic mal repris se paie pendant deux exercices.",
      },
      {
        title: 'Le quotidien',
        description:
          'Entretien courant, contrats de maintenance, relation avec les prestataires, traitement des demandes des copropriétaires.',
      },
      {
        title: 'L’assemblée générale',
        description:
          'Préparation avec le conseil syndical, convocation dans les délais, tenue de séance, procès-verbal diffusé rapidement.',
      },
      {
        title: 'Les travaux',
        description:
          'Diagnostic, mise en concurrence, financement, suivi de chantier. Les gros postes se préparent sur deux exercices, pas sur une convocation.',
      },
    ],
    sections: [
      {
        title: 'Changer de syndic',
        paragraphs: [
          "La mise en concurrence du syndic est inscrite à l'ordre du jour de l'assemblée tous les trois ans. C'est le moment où un conseil syndical peut comparer sérieusement, à condition de disposer des contrats à l'avance.",
          "Nous établissons une proposition détaillée — forfait de base, prestations particulières tarifées, durée — que le conseil syndical peut comparer ligne à ligne avec son contrat actuel. Nous nous déplaçons pour la présenter.",
        ],
      },
      {
        title: 'Ce qui est au forfait et ce qui ne l’est pas',
        paragraphs: [
          "Le contrat type réglementaire distingue la gestion courante, couverte par le forfait, et une liste limitative de prestations particulières qui peuvent être facturées en plus. Cette liste est fermée : rien d'autre ne peut l'être.",
          "Notre barème détaille les deux. Il est consultable sur ce site et remis avec toute proposition.",
        ],
      },
    ],
    cta: {
      title: 'Recevoir une proposition de syndic',
      description:
        'Donnez-nous la taille de votre copropriété et vos échéances : nous préparons une proposition chiffrée et venons la présenter au conseil syndical.',
      href: '/nous-ecrire',
      label: 'Nous écrire',
    },
  },
  {
    slug: 'courtage-d-assurances',
    name: "Courtage d'assurances",
    eyebrow: 'Garanties',
    titleLead: 'Les bonnes garanties,',
    titleAccent: 'pas le contrat le plus vendu',
    description:
      "Courtier, nous ne vendons pas les produits d'une compagnie : nous comparons ceux du marché et négocions les garanties en fonction du bien, de son occupation et de la copropriété. Pour nos clients en gestion, l'étude se fait sans démarche de leur part.",
    highlights: [
      {
        title: 'Propriétaire non occupant',
        description:
          'Obligatoire en copropriété depuis la loi ALUR. Elle couvre ce que l’assurance du locataire ne couvre pas, y compris quand le logement est vide.',
        tint: 'bg-tint-sky',
      },
      {
        title: 'Loyers impayés',
        description:
          'Loyers, charges et, selon les contrats, frais de procédure et dégradations. Adossée à notre sélection de locataires.',
        tint: 'bg-tint-sand',
      },
      {
        title: 'Multirisque immeuble',
        description:
          'Pour la copropriété : incendie, dégâts des eaux, responsabilité civile, avec une franchise discutée plutôt que subie.',
        tint: 'bg-tint-sage',
      },
      {
        title: 'Habitation',
        description:
          'Pour l’occupant, propriétaire comme locataire. Attestation fournie le jour de la signature du bail.',
        tint: 'bg-tint-clay',
      },
    ],
    steps: [
      {
        title: 'Le point sur l’existant',
        description:
          "Nous lisons vos contrats actuels. Les doublons et les trous se trouvent souvent au même endroit : entre l'assurance de l'occupant, celle du bailleur et celle de la copropriété.",
      },
      {
        title: 'La mise en concurrence',
        description:
          'Plusieurs compagnies sur un cahier des charges identique. Comparer deux primes sans comparer les franchises et les exclusions ne veut rien dire.',
      },
      {
        title: 'La souscription',
        description:
          'Nous rédigeons les déclarations, suivons la mise en place et vous remettons les attestations.',
      },
      {
        title: 'Le sinistre',
        description:
          "C'est le moment qui compte. Nous déclarons, suivons l'expertise et discutons l'indemnisation avec la compagnie — c'est notre rôle de courtier, pas le vôtre.",
      },
    ],
    sections: [
      {
        title: 'Pourquoi passer par un courtier',
        paragraphs: [
          "Un agent général représente une compagnie ; un courtier représente son client. La différence se voit surtout au moment du sinistre, quand il faut discuter une position de l'assureur.",
          "Notre rémunération est une commission versée par la compagnie, intégrée à la prime. Elle vous est communiquée sur demande, et nous ne percevons pas d'honoraires supplémentaires de votre part.",
        ],
      },
      {
        title: 'Simulation d’assurance habitation',
        paragraphs: [
          "Un simulateur en ligne permettait, sur le site précédent, d'obtenir un ordre de prix selon le type de bien et la valeur du mobilier. Il sera reconduit sur ce site.",
          "En attendant, dites-nous le type de logement et sa surface : nous revenons vers vous avec deux ou trois propositions comparables.",
        ],
      },
    ],
    cta: {
      title: 'Faire étudier vos garanties',
      description:
        'Envoyez-nous vos contrats actuels : nous vous disons ce qui est en double, ce qui manque, et ce que cela donnerait ailleurs.',
      href: '/nous-ecrire',
      label: 'Nous écrire',
    },
  },
]

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug)
}
