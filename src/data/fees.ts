/**
 * Barème d'honoraires.
 *
 * MONTANTS FICTIFS, à remplacer par le barème réel de la maison avant toute
 * mise en ligne. Le site précédent avait une page `tarifs.html` dont le
 * contenu n'était pas dans la livraison.
 *
 * Ce n'est pas une page de communication : l'affichage du barème est une
 * OBLIGATION (arrêté du 10 janvier 2017 pour la transaction et la location,
 * décret du 26 mars 2015 pour le contrat type de syndic). Trois règles en
 * découlent, respectées ici :
 *  - tous les montants sont TTC ;
 *  - en location, les honoraires du locataire sont plafonnés au mètre carré
 *    de surface habitable selon la zone — Lyon et Villeurbanne sont en zone
 *    tendue — et ne peuvent jamais excéder ceux du bailleur ;
 *  - en syndic, la liste des prestations particulières facturables en sus du
 *    forfait est LIMITATIVE : rien d'autre ne peut l'être.
 */

export type FeeRow = { label: string; amount: string; note?: string }

export type FeeTable = {
  id: string
  title: string
  intro: string
  rows: readonly FeeRow[]
  footnote?: string
}

export const feeTables: readonly FeeTable[] = [
  {
    id: 'transaction',
    title: 'Transaction — vente',
    intro:
      "Honoraires à la charge de l'acquéreur sauf mention contraire sur l'annonce, dus à la signature de l'acte authentique. Le prix affiché sur nos annonces est F.A.I., frais d'agence inclus ; le prix net vendeur figure sur chaque fiche de bien.",
    rows: [
      { label: "Jusqu'à 100 000 €", amount: '6 % TTC', note: 'avec un minimum de 4 500 € TTC' },
      { label: 'De 100 001 € à 200 000 €', amount: '5,5 % TTC' },
      { label: 'De 200 001 € à 400 000 €', amount: '4,5 % TTC' },
      { label: 'De 400 001 € à 800 000 €', amount: '4 % TTC' },
      { label: 'Au-delà de 800 000 €', amount: '3,5 % TTC' },
      { label: 'Garage, box et place de parking', amount: '2 400 € TTC', note: 'forfait' },
    ],
    footnote:
      'Pourcentages appliqués au prix net vendeur. Aucun honoraire n’est dû si la vente ne se réalise pas.',
  },
  {
    id: 'location',
    title: 'Location — mise en location',
    intro:
      "Lyon et Villeurbanne sont en zone tendue : les honoraires à la charge du locataire sont plafonnés par mètre carré de surface habitable, et ne peuvent en aucun cas dépasser ceux supportés par le bailleur.",
    rows: [
      {
        label: 'Visite, constitution du dossier et rédaction du bail',
        amount: '10 € TTC / m²',
        note: 'part locataire, plafond de zone tendue',
      },
      {
        label: 'État des lieux d’entrée',
        amount: '3 € TTC / m²',
        note: 'plafond réglementaire, part locataire',
      },
      {
        label: 'Honoraires à la charge du bailleur',
        amount: '13 € TTC / m²',
        note: 'au moins égaux à la part locataire',
      },
      { label: 'Location meublée de courte durée', amount: 'Nous consulter' },
    ],
    footnote:
      'Surface habitable au sens de l’article R156-1 du code de la construction et de l’habitation.',
  },
  {
    id: 'gestion',
    title: 'Gestion locative',
    intro:
      'Honoraires calculés sur les sommes effectivement encaissées pour votre compte — loyers et charges. Rien n’est dû sur un loyer impayé.',
    rows: [
      { label: 'Gestion courante', amount: '7,2 % TTC', note: 'des sommes encaissées' },
      {
        label: 'Garantie loyers impayés et détériorations',
        amount: '2,6 % TTC',
        note: 'option, du quittancement garanti',
      },
      { label: 'Déclaration de revenus fonciers', amount: '96 € TTC / an', note: 'option' },
      { label: 'Suivi de travaux supérieurs à 5 000 € TTC', amount: '3 % TTC', note: 'du montant des travaux' },
    ],
  },
  {
    id: 'syndic',
    title: 'Syndic de copropriété',
    intro:
      "Le forfait annuel couvre l'intégralité de la gestion courante prévue par le contrat type réglementaire. Seules les prestations de la liste limitative ci-dessous peuvent être facturées en sus.",
    rows: [
      {
        label: 'Forfait annuel de gestion courante',
        amount: 'À partir de 185 € TTC / lot principal',
        note: 'une assemblée générale annuelle comprise',
      },
      { label: 'Assemblée générale supplémentaire', amount: '340 € TTC / heure' },
      { label: 'Déplacement pour constat de sinistre', amount: '125 € TTC' },
      { label: 'Suivi de travaux votés', amount: '2 % TTC', note: 'du montant des travaux, plafonné par le vote' },
      { label: 'État daté', amount: '380 € TTC', note: 'plafond réglementaire' },
      { label: 'Mise en demeure de copropriétaire débiteur', amount: '42 € TTC', note: 'à la charge du débiteur' },
    ],
    footnote:
      'Cette liste est limitative : aucune autre prestation ne peut être facturée en dehors du forfait.',
  },
]
