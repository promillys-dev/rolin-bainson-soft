import type { ProseSection } from '@/components/editorial/Prose'

/**
 * Pages institutionnelles et légales.
 *
 * CONTENU DE REMPLISSAGE. Les pages existaient sur le site précédent
 * (`mentions-légales.html`, `crédits.html`, `liens.html`…) mais leur texte
 * n'était pas dans la livraison. Tout ce qui suit est une trame crédible, pas
 * le texte de la maison.
 *
 * Les mentions légales et la politique de cookies sont des pages JURIDIQUES :
 * elles contiennent des champs qui ne peuvent pas être inventés — numéro de
 * carte professionnelle, RCS, garant financier, assureur, hébergeur. Ils sont
 * écrits en clair sous la forme « À COMPLÉTER » plutôt qu'avec des valeurs
 * plausibles, pour qu'on ne puisse pas les publier par inadvertance.
 */
export type EditorialPage = {
  slug: string
  name: string
  eyebrow?: string
  titleLead: string
  /** Fin du titre, passée en orange. Facultative sur les pages légales. */
  titleAccent?: string
  description?: string
  metaDescription: string
  sections: readonly ProseSection[]
}

export const editorialPages: readonly EditorialPage[] = [
  {
    slug: 'presentation',
    name: 'Présentation',
    eyebrow: 'Le groupe',
    titleLead: 'Une maison lyonnaise',
    titleAccent: 'depuis 1957',
    description:
      "Quatre métiers sous un même toit, trois agences entre Villeurbanne et Lyon, et des immeubles que nous suivons parfois depuis deux générations de propriétaires.",
    metaDescription:
      "Rolin Bainson, groupe immobilier lyonnais fondé en 1957 : transaction, gestion locative, syndic de copropriété et courtage d'assurances à Lyon et Villeurbanne.",
    sections: [
      {
        title: 'Ce que nous faisons',
        paragraphs: [
          "Rolin Bainson est un groupe immobilier indépendant installé à Villeurbanne depuis 1957. Nous exerçons quatre métiers : la transaction, la gestion locative, le syndic de copropriété et le courtage d'assurances.",
          "Ces quatre métiers sont internes, et c'est notre principale différence. Un propriétaire qui nous confie un appartement peut le faire estimer, le mettre en location, l'assurer et voir sa copropriété gérée sans jamais changer d'interlocuteur — et sans que personne ne se renvoie la responsabilité quand quelque chose coince.",
        ],
      },
      {
        title: 'Un périmètre assumé',
        paragraphs: [
          "Nous travaillons sur Villeurbanne, la rive gauche lyonnaise et la Presqu'île. Pas au-delà. Ce choix nous coûte des mandats, mais il nous permet de connaître les immeubles dont nous parlons : leurs charges, leurs travaux votés, leurs syndics, leur réputation auprès des locataires.",
          "C'est ce qui fait qu'une estimation chez nous est argumentée plutôt que calculée, et qu'un acquéreur repart en sachant ce qu'il achète.",
        ],
      },
      {
        title: 'Nos engagements',
        bullets: [
          'Un interlocuteur nommé pour chaque dossier, joignable sur une ligne directe',
          'Des honoraires affichés, détaillés et identiques pour tous',
          'Une réponse sous quarante-huit heures ouvrées, même quand la réponse est « nous cherchons »',
          'Aucune commission occulte sur les travaux ou les contrats que nous proposons',
        ],
      },
      {
        title: 'Nos adhésions',
        paragraphs: [
          "Nous sommes adhérents de l'UNIS, l'Union des syndicats de l'immobilier, qui réunit les professionnels de la gestion, du syndic et de la transaction autour d'un code de déontologie.",
        ],
      },
    ],
  },
  {
    slug: 'immobilier-vert',
    name: 'Immobilier Vert',
    eyebrow: 'Le groupe',
    titleLead: 'Rénover avant',
    titleAccent: 'que la loi vous y oblige',
    description:
      "Les passoires thermiques sortent du marché locatif par paliers. Pour un bailleur lyonnais, la question n'est plus de savoir s'il faut rénover, mais dans quel ordre et avec quel financement.",
    metaDescription:
      "Immobilier Vert : accompagnement des propriétaires et des copropriétés lyonnaises sur la rénovation énergétique, le calendrier réglementaire et les aides mobilisables.",
    sections: [
      {
        title: 'Le calendrier qui s’applique',
        paragraphs: [
          "Les logements classés G sont interdits à la location depuis 2025, les F le seront en 2028 et les E en 2034. Un appartement classé F aujourd'hui a donc trois ans devant lui, pas davantage.",
          "Sur le parc ancien lyonnais — immeubles des années trente, haussmanniens de la rive gauche — ces classes sont fréquentes. Beaucoup de bailleurs découvrent le problème au moment de relouer, c'est-à-dire trop tard pour faire les travaux sans vacance.",
        ],
      },
      {
        title: 'Par où commencer',
        bullets: [
          "Un audit énergétique, qui dit ce qui pèse vraiment dans l'étiquette — souvent les menuiseries et l'absence d'isolation, rarement ce qu'on imagine",
          "Les gestes individuels réalisables sans assemblée générale : menuiseries, ventilation, régulation du chauffage",
          "Les travaux collectifs, qui passent par la copropriété : isolation par l'extérieur, remplacement de chaufferie, toiture",
          'Le plan de financement : MaPrimeRénov’, certificats d’économie d’énergie, éco-prêt à taux zéro, aides de la Métropole de Lyon',
        ],
      },
      {
        title: 'Ce que nous faisons',
        paragraphs: [
          "Pour les bailleurs que nous gérons, nous signalons les biens dont l'étiquette approche d'un seuil et proposons un plan de travaux avant que l'échéance ne devienne contrainte.",
          "Pour les copropriétés dont nous sommes syndic, nous portons les projets de rénovation globale : diagnostic, mise en concurrence, montage des aides et vote en assemblée. Un projet de cette taille se prépare sur deux exercices.",
        ],
      },
    ],
  },
  {
    slug: 'mentions-legales',
    name: 'Mentions légales',
    titleLead: 'Mentions légales',
    metaDescription:
      'Mentions légales du site Rolin Bainson : éditeur, carte professionnelle, garant financier, hébergeur et conditions d’utilisation.',
    sections: [
      {
        title: 'Éditeur du site',
        definitions: [
          { term: 'Raison sociale', description: 'Rolin Bainson' },
          { term: 'Siège social', description: "1 rue d'Alsace, 69100 Villeurbanne" },
          { term: 'Téléphone', description: '04 78 93 97 69' },
          { term: 'Courriel', description: 'contact@rolinbainson.com' },
          { term: 'Forme juridique et capital', description: 'À COMPLÉTER' },
          { term: 'RCS et numéro SIREN', description: 'À COMPLÉTER' },
          { term: 'Numéro de TVA intracommunautaire', description: 'À COMPLÉTER' },
          { term: 'Directeur de la publication', description: 'À COMPLÉTER' },
        ],
      },
      {
        title: 'Activité réglementée',
        paragraphs: [
          "L'activité de transaction et de gestion immobilière est réglementée par la loi n° 70-9 du 2 janvier 1970, dite loi Hoguet, et son décret d'application du 20 juillet 1972.",
        ],
        definitions: [
          { term: 'Carte professionnelle', description: 'À COMPLÉTER — numéro, mentions et CCI délivrante' },
          { term: 'Garant financier', description: 'À COMPLÉTER — nom, adresse et montant de la garantie' },
          { term: 'Assurance de responsabilité civile professionnelle', description: 'À COMPLÉTER — assureur et numéro de police' },
          { term: 'Immatriculation ORIAS (courtage d’assurances)', description: 'À COMPLÉTER' },
        ],
      },
      {
        title: 'Hébergement',
        definitions: [{ term: 'Hébergeur', description: 'À COMPLÉTER — raison sociale, adresse et téléphone' }],
      },
      {
        title: 'Propriété intellectuelle',
        paragraphs: [
          "L'ensemble du site — structure, textes, photographies et éléments graphiques — est protégé par le droit d'auteur. Toute reproduction, même partielle, est soumise à l'autorisation écrite préalable de l'éditeur.",
          "Les descriptifs et photographies des biens proposés à la vente ou à la location ne peuvent être reproduits sur un autre support, notamment sur un autre site d'annonces, sans cette autorisation.",
        ],
      },
      {
        title: 'Responsabilité',
        paragraphs: [
          "Les informations relatives aux biens sont données à titre indicatif et ne constituent pas un élément contractuel. Les surfaces, les montants de charges et les diagnostics sont ceux communiqués par les propriétaires ou établis par des professionnels tiers.",
          "Les liens vers des sites externes sont proposés pour la commodité du visiteur ; leur contenu n'engage que leurs éditeurs.",
        ],
      },
      {
        title: 'Médiation de la consommation',
        paragraphs: [
          "Conformément à l'article L612-1 du code de la consommation, tout consommateur a le droit de recourir gratuitement à un médiateur en vue de la résolution amiable d'un litige.",
        ],
        definitions: [{ term: 'Médiateur compétent', description: 'À COMPLÉTER — nom, adresse postale et site' }],
      },
      {
        title: 'Données personnelles',
        paragraphs: [
          "Les traitements de données réalisés depuis ce site — formulaires de contact, demandes de rappel, candidatures — sont décrits dans notre politique de confidentialité. Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition, exerçable à l'adresse contact@rolinbainson.com.",
          "Vous pouvez introduire une réclamation auprès de la CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.",
        ],
      },
    ],
  },
  {
    slug: 'politique-de-cookies',
    name: 'Politique de cookies',
    titleLead: 'Politique de cookies',
    description:
      'Ce site ne dépose aucun cookie de mesure d’audience ni de publicité. Voici ce qu’il utilise, et pourquoi.',
    metaDescription:
      'Politique de cookies du site Rolin Bainson : cookies strictement nécessaires uniquement, aucun traceur publicitaire ni de mesure d’audience.',
    sections: [
      {
        title: 'Ce que ce site dépose',
        paragraphs: [
          "En l'état, ce site ne dépose aucun cookie de mesure d'audience, de publicité ou de réseau social. Aucun bandeau de consentement n'est donc affiché : il n'y a rien à consentir.",
          "Le site précédent chargeait AddThis, des widgets Facebook et Twitter et un bouton Google+ — soit quatre traceurs tiers pour des services dont deux ont fermé depuis. Ils n'ont pas été repris.",
        ],
      },
      {
        title: 'Cookies strictement nécessaires',
        paragraphs: [
          "Si une fonctionnalité en exige un à l'avenir — la reprise d'un dossier de location en plusieurs fois, par exemple — il s'agira d'un cookie de session, déposé seulement après une action de votre part, limité à la durée de la visite, et sans finalité publicitaire.",
          "Ces cookies ne nécessitent pas votre consentement au sens de l'article 82 de la loi Informatique et Libertés, mais ils figureront ici.",
        ],
      },
      {
        title: 'Mesure d’audience',
        paragraphs: [
          "Si une mesure d'audience est mise en place, elle le sera dans une configuration exemptée de consentement au sens des recommandations de la CNIL : pas de croisement avec d'autres traitements, pas de suivi entre sites, données conservées treize mois au maximum. Cette page sera mise à jour en conséquence.",
        ],
      },
      {
        title: 'Services tiers',
        paragraphs: [
          "L'espace client est hébergé par un prestataire extérieur, sur un autre domaine. Les cookies qui y sont déposés relèvent de sa propre politique, consultable sur son site.",
          "La cartographie reposera sur des tuiles de l'IGN et non sur un service publicitaire : aucun cookie n'est déposé par l'affichage d'une carte.",
        ],
      },
    ],
  },
  {
    slug: 'cgu',
    name: 'Conditions d’utilisation',
    titleLead: 'Conditions d’utilisation',
    description:
      'Les règles d’usage de ce site. Le site précédent les hébergeait sur une page nommée « cookies.html », ce qui ne rendait service à personne.',
    metaDescription:
      'Conditions générales d’utilisation du site Rolin Bainson : objet, accès, usage des annonces et des formulaires.',
    sections: [
      {
        title: 'Objet',
        paragraphs: [
          "Ce site est un site de présentation et d'annonces. Il ne permet ni de réserver un bien, ni de signer un bail, ni d'effectuer un paiement. Toute démarche engageante se fait par écrit, hors du site.",
        ],
      },
      {
        title: 'Accès au site',
        paragraphs: [
          "L'accès est libre et gratuit. Nous nous réservons la possibilité d'interrompre le service pour maintenance, sans préavis et sans indemnité.",
          "Les frais de connexion restent à votre charge.",
        ],
      },
      {
        title: 'Usage des annonces',
        paragraphs: [
          "Les annonces sont destinées à un usage personnel. L'extraction systématique, automatisée ou non, de tout ou partie du catalogue est interdite, de même que la republication des descriptifs et des photographies sur un autre support.",
        ],
      },
      {
        title: 'Formulaires',
        paragraphs: [
          "Les informations que vous transmettez via les formulaires doivent être exactes. Les pièces jointes sont limitées en taille et en format, et ne sont jamais accessibles publiquement.",
          "Nous vous répondons sous quarante-huit heures ouvrées. Une demande de rappel n'est pas un rendez-vous confirmé tant que nous ne vous l'avons pas écrit.",
        ],
      },
      {
        title: 'Droit applicable',
        paragraphs: [
          "Les présentes conditions sont soumises au droit français. En cas de litige, et après recherche d'une solution amiable, les tribunaux français sont seuls compétents.",
        ],
      },
    ],
  },
  {
    slug: 'credits',
    name: 'Crédits',
    titleLead: 'Crédits',
    description: 'Qui a fait quoi sur ce site, et avec quoi.',
    metaDescription: 'Crédits du site Rolin Bainson : conception, développement, photographies et technologies utilisées.',
    sections: [
      {
        title: 'Conception et développement',
        definitions: [
          { term: 'Conception et réalisation', description: 'À COMPLÉTER' },
          { term: 'Direction artistique', description: 'À COMPLÉTER' },
          { term: 'Photographies', description: 'À COMPLÉTER — crédit photo par vue' },
        ],
      },
      {
        title: 'Technologies',
        paragraphs: [
          "Le site est développé avec Next.js et React, en rendu côté serveur. Les typographies Inter, Outfit et Source Serif 4 sont distribuées sous licence SIL Open Font License.",
          "La cartographie reposera sur MapLibre GL et les tuiles vectorielles de l'IGN, diffusées sous licence ouverte.",
        ],
      },
      {
        title: 'Signaler un problème',
        paragraphs: [
          "Un lien cassé, une information erronée, une difficulté d'accès avec un lecteur d'écran : écrivez-nous à contact@rolinbainson.com. Nous corrigeons et nous vous répondons.",
        ],
      },
    ],
  },
]

export function getEditorialPage(slug: string): EditorialPage | undefined {
  return editorialPages.find((page) => page.slug === slug)
}
