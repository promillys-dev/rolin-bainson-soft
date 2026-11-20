/**
 * Les chapitres de la page d'accueil.
 *
 * La page se lit comme une présentation de la maison, dans l'ordre où un
 * visiteur la découvre : qui elle est, ce qu'elle propose, comment y
 * accéder, ce qu'elle fait, où elle travaille, où la trouver, comment la
 * joindre. Le sommaire qui suit le défilement affiche ces chapitres ; lu de
 * haut en bas, il dit à lui seul ce qu'est Rolin Bainson.
 *
 * `id` est l'ancre de la section. `caption` dit quelle part de la maison le
 * chapitre présente : c'est elle qui apparaît au survol du sommaire.
 */
export type HomeChapter = {
  id: string
  label: string
  caption: string
}

export const homeChapters: readonly HomeChapter[] = [
  { id: 'maison', label: 'La maison', caption: 'Groupe immobilier lyonnais, depuis 1957' },
  { id: 'recherche', label: 'Trouver un bien', caption: 'Location et vente à Lyon et Villeurbanne' },
  { id: 'acces', label: 'Vos accès', caption: 'Espace client, dossier locataire, recrutement' },
  { id: 'metiers', label: 'Nos métiers', caption: 'Transaction, gestion, syndic, assurances' },
  { id: 'terrain', label: 'Notre terrain', caption: 'La carte des biens et la vie de la maison' },
  { id: 'agences', label: 'Nos agences', caption: 'Trois agences, sans rendez-vous' },
  { id: 'contact', label: 'Nous contacter', caption: 'Être rappelé, écrire ou appeler' },
]
