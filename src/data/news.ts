import type { NewsItem } from '@/config/home'

/**
 * Actualités.
 *
 * Les quatre premières entrées sont de VRAIES publications retrouvées dans la
 * table `nos_news_post` du site précédent — titres et sujets authentiques,
 * corps réécrits faute d'avoir le texte d'origine. Les deux dernières sont
 * inventées pour montrer un fil vivant. Toutes datent : la dernière campagne
 * éditoriale de la maison remonte à 2016, et c'est précisément ce qu'il faut
 * montrer au client. Un bloc actualités n'a de sens que s'il est alimenté.
 *
 * Le type vient de `config/home.ts` pour que la vignette de l'accueil et
 * l'article ne puissent pas diverger — `image` y est obligatoire, et les
 * quatre entrées communes reprennent les mêmes fichiers que le carrousel.
 * Les deux ajouts empruntent des photos de marque : provisoires, comme tout
 * le reste de ce fichier. Quand le CMS arrivera, c'est ce fichier
 * qui disparaîtra, et le carrousel de l'accueil lira `lib/news.ts` comme le
 * reste du site.
 */
export type Article = NewsItem & {
  /** Chapeau affiché en tête d'article, sous le titre. */
  lead: string
  /** Corps, un élément par paragraphe. Pas de HTML : le CMS fournira du texte. */
  body: readonly string[]
}

export const articles: readonly Article[] = [
  {
    slug: 'confluence-deja-une-reference',
    image: '/brand/news-1.jpg',
    title: 'Rolin Bainson Confluence, déjà une référence',
    category: 'La maison',
    publishedAt: '2016-02-18',
    excerpt:
      "Ouverte cours Charlemagne, l'agence Confluence accompagne les acquéreurs et les bailleurs du 2e arrondissement sur un quartier qui se transforme vite.",
    lead: "Un an après son ouverture, l'agence du cours Charlemagne s'est installée dans le paysage d'un quartier qui change à vue d'œil.",
    body: [
      "Quand nous avons ouvert cours Charlemagne, le quartier de la Confluence sortait à peine de terre. Les premières livraisons de logements venaient de se faire, le centre commercial ouvrait ses portes, et les acquéreurs hésitaient encore à s'engager sur un secteur dont ils ne voyaient que les grues.",
      "Un an plus tard, la question a changé de nature. Elle n'est plus « est-ce que le quartier va prendre », mais « quelle résidence choisir ». Entre deux immeubles de la même rue, les écarts de charges, d'exposition et de qualité de construction sont considérables, et ils ne se lisent pas sur une annonce.",
      "C'est là que notre présence quotidienne sur le secteur change quelque chose. Nous avons visité la plupart de ces immeubles, nous connaissons leurs syndics, et nous savons lesquels ont déjà voté des travaux. Pour un acquéreur comme pour un propriétaire bailleur, cette connaissance vaut plus qu'un argumentaire.",
      "L'agence couvre aujourd'hui l'ensemble du 2e arrondissement et une partie de la Presqu'île, en transaction comme en location.",
    ],
  },
  {
    slug: 'assurance-pno',
    image: '/brand/news-4.jpg',
    title: "Propriétaires bailleurs : pensez à l'assurance PNO",
    category: 'Assurances',
    publishedAt: '2015-10-09',
    excerpt:
      "L'assurance propriétaire non occupant couvre votre bien entre deux locataires et complète celle de l'occupant. Notre service courtage vous accompagne.",
    lead: "Beaucoup de bailleurs croient être couverts par l'assurance de leur locataire. Ce n'est vrai qu'en partie, et la différence se paie au moment du sinistre.",
    body: [
      "L'assurance du locataire couvre sa responsabilité à lui : les dommages qu'il cause au logement et aux voisins. Elle ne couvre ni la vacance entre deux baux, ni les dommages dont l'origine est le bâtiment lui-même, ni la responsabilité du propriétaire en tant que tel.",
      "L'assurance propriétaire non occupant, dite PNO, comble exactement ces trous. Elle est obligatoire en copropriété depuis la loi ALUR, au minimum pour la responsabilité civile, et elle reste la seule protection du bailleur quand le logement est vide.",
      "Son coût est sans commune mesure avec le risque couvert : comptez quelques dizaines d'euros par an pour un appartement lyonnais. C'est moins qu'un mois de charges, et cela évite de découvrir au pire moment que personne n'était assuré.",
      "Notre service courtage compare les contrats du marché et négocie les garanties en fonction du bien, de son occupation et de la copropriété. Si vous nous confiez déjà la gestion de votre logement, l'étude se fait sans démarche de votre part.",
    ],
  },
  {
    slug: 'deposez-votre-dossier-en-ligne',
    image: '/brand/news-2.jpg',
    title: 'Locataires : déposez votre dossier directement en ligne',
    category: 'Location',
    publishedAt: '2015-12-11',
    excerpt:
      'Constituez votre dossier à votre rythme, pièce par pièce, et suivez son avancement sans vous déplacer en agence.',
    lead: "Constituer un dossier de location prend du temps et des allers-retours. Nous avons voulu que ce temps se passe chez vous, pas dans une file d'attente.",
    body: [
      "Un dossier de location complet, c'est une pièce d'identité, trois bulletins de salaire, un avis d'imposition, un justificatif de domicile, et autant de documents pour chaque garant. Réunir tout cela demande rarement une seule soirée.",
      "Le dépôt en ligne vous permet d'ajouter vos pièces au fur et à mesure et de reprendre là où vous en étiez. Vous voyez ce qui manque, vous recevez un accusé quand le dossier est complet, et vous n'avez plus à vous présenter en agence avant la visite.",
      "Pour nous, l'intérêt est le même : un dossier lisible, complet et horodaté permet de répondre vite, et de répondre à tout le monde. Sur un marché aussi tendu que celui de Lyon et de Villeurbanne, la rapidité de traitement fait souvent la différence entre deux candidatures équivalentes.",
      "Vos pièces ne sont jamais accessibles publiquement et sont supprimées une fois le logement attribué.",
    ],
  },
  {
    slug: 'agence-ouverte-les-samedis',
    image: '/brand/news-3.jpg',
    title: 'Votre agence ouverte tous les samedis cet été',
    category: 'Agences',
    publishedAt: '2015-06-05',
    excerpt:
      "L'agence des Charpennes vous accueille le samedi de 9h30 à 12h30 pendant la période estivale, sur rendez-vous ou en visite libre.",
    lead: "De juin à septembre, l'agence du cours Émile Zola ouvre ses portes le samedi matin.",
    body: [
      "L'été est la période où le marché locatif lyonnais bouge le plus : mutations professionnelles, rentrée universitaire, fins de bail. C'est aussi celle où il est le plus difficile de se libérer en semaine.",
      "Du premier samedi de juin au dernier de septembre, l'agence des Charpennes vous accueille donc de 9h30 à 12h30. Avec ou sans rendez-vous, pour une estimation, le dépôt d'un dossier ou simplement pour faire le point sur un projet.",
      "Les visites de biens peuvent également être organisées le samedi matin, dans la limite des disponibilités des occupants actuels.",
    ],
  },
  {
    slug: 'encadrement-des-loyers-ce-qui-change',
    image: '/brand/block-2.jpg',
    title: 'Encadrement des loyers : ce que cela change pour vous',
    category: 'Location',
    publishedAt: '2021-11-08',
    excerpt:
      "Lyon et Villeurbanne sont entrées en zone d'encadrement des loyers. Ce que le dispositif impose au bailleur, et ce qu'il garantit au locataire.",
    lead: "Depuis novembre 2021, les loyers de Lyon et de Villeurbanne sont encadrés. Le dispositif est simple dans son principe, plus subtil dans son application.",
    body: [
      "Chaque année, un arrêté préfectoral fixe pour chaque secteur, chaque type de logement et chaque époque de construction un loyer de référence, un loyer de référence minoré et un loyer de référence majoré. Le loyer d'un bail nouveau ne peut pas dépasser le loyer de référence majoré.",
      "Un complément de loyer reste possible, mais il doit être justifié par une caractéristique objective du logement : une terrasse, une vue exceptionnelle, une hauteur sous plafond inhabituelle. Il ne peut pas servir à rattraper l'écart avec le marché.",
      "Concrètement, toute annonce de location doit afficher le loyer de base, le loyer de référence majoré applicable et, s'il existe, le montant du complément. C'est ce que vous trouverez désormais sur chacune de nos annonces.",
      "Pour les bailleurs que nous accompagnons en gestion, nous vérifions l'applicabilité du plafond à chaque relocation et chaque révision : une erreur expose à une action en diminution de loyer, rétroactive.",
    ],
  },
  {
    slug: 'copropriete-preparer-son-assemblee-generale',
    image: '/brand/agence-1.jpg',
    title: 'Copropriété : bien préparer son assemblée générale',
    category: 'Syndic',
    publishedAt: '2023-03-21',
    excerpt:
      "Une assemblée générale qui se passe bien se joue avant la séance. Quelques repères pour les conseils syndicaux et les copropriétaires.",
    lead: "Une assemblée générale tendue est presque toujours une assemblée mal préparée. Voici ce qui, dans notre expérience, fait la différence.",
    body: [
      "La convocation et ses annexes arrivent au moins vingt et un jours avant la séance. Ce délai n'est pas une formalité : c'est le temps dont vous disposez pour lire les devis, comparer les montants et poser vos questions avant qu'elles ne deviennent des objections en séance.",
      "Les résolutions qui échouent sont rarement de mauvaises idées : ce sont des idées découvertes trop tard. Un projet de ravalement se prépare sur deux exercices, avec un diagnostic, plusieurs devis et un plan de financement discuté en conseil syndical avant d'être porté au vote.",
      "Si vous ne pouvez pas être présent, donnez pouvoir plutôt que de vous abstenir. Un pouvoir nominatif donné à un copropriétaire présent vaut mieux qu'un siège vide : les majorités de l'article 25 se calculent sur l'ensemble des voix, pas sur les présents.",
      "Notre équipe syndic reçoit les conseils syndicaux en amont de chaque assemblée. C'est le moment le plus utile de l'année pour parler des travaux, du budget et des impayés.",
    ],
  },
]
