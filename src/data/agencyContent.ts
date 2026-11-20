/**
 * Textes de présentation des agences.
 *
 * CONTENU DE REMPLISSAGE, crédible mais inventé. La colonne
 * `agen_description` existait en base legacy ; la livraison ne contenait pas
 * les textes réels. Les faits qui sont vrais — adresses, téléphones,
 * horaires, activités — restent dans `config/site.ts` et ne sont pas
 * dupliqués ici : ce fichier ne porte que de la prose à faire relire.
 */
export type AgencyContent = {
  tagline: string
  intro: string
  /** Ce que l'agence traite au quotidien, en langage de visiteur. */
  highlights: readonly string[]
  access: string
}

export const agencyContent: Record<string, AgencyContent> = {
  'rolin-bainson-sa': {
    tagline: 'Le siège, et les métiers qui suivent un bien dans la durée',
    intro:
      "C'est ici que sont gérés les immeubles dont nous avons la charge : la gestion locative pour les propriétaires bailleurs, le syndic de copropriété et le courtage d'assurances. Les équipes y travaillent avec les mêmes immeubles depuis des années, ce qui change tout quand il faut décider d'un ravalement ou arbitrer un sinistre.",
    highlights: [
      'Quittancement, révisions de loyer et régularisations de charges',
      'Assemblées générales, conseils syndicaux et suivi des travaux',
      'Assurances propriétaire non occupant, multirisque immeuble et garantie loyers impayés',
    ],
    access:
      "Métro A, arrêt Charpennes, puis cinq minutes à pied. Stationnement payant en voirie rue d'Alsace.",
  },
  'agence-charpennes': {
    tagline: 'La vitrine, pour acheter, vendre ou louer à Villeurbanne',
    intro:
      "Cours Émile Zola, au cœur de Villeurbanne, l'agence couvre les Charpennes, les Gratte-Ciel, la Doua et les communes limitrophes. C'est le point d'entrée pour une estimation, une visite ou un dossier de location : nos négociateurs y reçoivent sans rendez-vous aux horaires d'ouverture.",
    highlights: [
      'Estimation de votre bien sous huit jours, sans engagement',
      'Visites accompagnées, y compris le samedi matin en été',
      'Constitution et étude des dossiers de location',
    ],
    access:
      'Métro A, arrêt République — Villeurbanne, sortie cours Émile Zola. Tramway T1 et T4 à proximité.',
  },
  'confluence-rolin-bainson': {
    tagline: 'Lyon 2e, sur un quartier qui se transforme vite',
    intro:
      "Ouverte cours Charlemagne, l'agence Confluence suit un secteur où le neuf, la réhabilitation et l'ancien se côtoient sur quelques centaines de mètres. Connaître la différence entre deux résidences de la même rue y est une compétence quotidienne, pour un acquéreur comme pour un bailleur.",
    highlights: [
      'Transaction sur le 2e arrondissement et la Presqu’île',
      'Mise en location et recherche de locataires solvables',
      'Accompagnement des investisseurs : rendement, fiscalité, mise en gestion',
    ],
    access:
      'Tramway T1, arrêt Hôtel de Région — Montrochet. Parking du centre commercial à cinq minutes à pied.',
  },
}
