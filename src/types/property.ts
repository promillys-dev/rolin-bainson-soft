/**
 * Modèle d'un bien, côté front.
 *
 * Volontairement normalisé, à l'inverse de la table legacy `rb_offres` et ses
 * 110 colonnes à plat. Ce type est le contrat que l'API devra respecter.
 *
 * Règle non négociable héritée de l'audit : `reference` est l'identifiant du
 * flux ConvertImmo, pas un auto-incrément local. C'est lui qui rend les URLs
 * d'annonces stables d'un import à l'autre — donc tout le référencement.
 */

export type TransactionType = 'vente' | 'location'

export type EnergyRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export type PropertyPrice = {
  /** Prix de vente, ou loyer charges comprises en location. */
  amount: number
  /** Location : loyer hors charges. */
  excludingCharges?: number
  /** Location : provision pour charges. */
  charges?: number
  /** Location : dépôt de garantie. */
  deposit?: number
  /** Honoraires à la charge de l'acquéreur ou du locataire. */
  fees?: number
}

/** Encadrement des loyers — mention obligatoire sur Lyon et Villeurbanne. */
export type RentControl = {
  applies: boolean
  baseRent?: number
  referenceRentIncreased?: number
  supplement?: number
}

/** Diagnostic de performance énergétique — affichage réglementé. */
export type EnergyPerformance = {
  date?: string
  energyClass?: EnergyRating
  energyValue?: number
  gasClass?: EnergyRating
  gasValue?: number
}

export type PropertyLocation = {
  street?: string
  district?: string
  postalCode: string
  city: string
  coordinates?: { lat: number; lng: number }
}

export type PropertyFeatures = {
  rooms?: number
  bedrooms?: number
  bathrooms?: number
  floor?: number
  floors?: number
  livingArea?: number
  landArea?: number
  constructionYear?: number
  hasElevator?: boolean
  hasBalcony?: boolean
  hasTerrace?: boolean
  hasCellar?: boolean
  hasParking?: boolean
  hasGarage?: boolean
  isFurnished?: boolean
}

export type PropertyMedia = {
  url: string
  alt: string
  width?: number
  height?: number
}

export type Property = {
  /** Identifiant ConvertImmo. Sert de segment d'URL. */
  reference: string
  slug: string
  transaction: TransactionType
  /** Vente en viager. */
  isLifeAnnuity?: boolean
  isExclusive?: boolean
  /** Libellé de nature : appartement, maison, garage… */
  kind: string
  /** Libellé de type : T1, T2, T3… */
  category?: string
  title: string
  description?: string
  price: PropertyPrice
  rentControl?: RentControl
  energy?: EnergyPerformance
  location: PropertyLocation
  features: PropertyFeatures
  media: readonly PropertyMedia[]
  virtualTourUrl?: string
  /** Numéro du mandat, distinct de la référence d'annonce. */
  mandateNumber?: string
  agencySlug?: string
  availableAt?: string
  publishedAt: string
}

/** Critères de recherche — noms de paramètres d'URL du nouveau site. */
export type PropertySearchParams = {
  transaction?: TransactionType
  /** Code postal ou nom de commune. */
  localisation?: string
  kind?: string
  /** Minimum, et non égalité : le legacy filtrait en égalité stricte,
   *  ce qui excluait un 4 pièces d'une recherche « 3 pièces ». */
  piecesMin?: number
  bedroomsMin?: number
  areaMin?: number
  budgetMax?: number
  budgetMin?: number
  /** Référence ConvertImmo saisie directement — le legacy l'appelait
   *  « Références » et filtrait dessus en égalité. */
  reference?: string
  sort?: 'prix-asc' | 'prix-desc' | 'surface-asc' | 'surface-desc' | 'recent'
  page?: number
}
