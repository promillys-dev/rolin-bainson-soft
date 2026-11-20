import { redirect } from 'next/navigation'

/**
 * Ancienne page de travail de la nouvelle accueil.
 *
 * Sa composition est devenue la page d'accueil ; l'adresse renvoie vers `/`
 * pour que les liens partagés pendant la mise au point restent valables.
 */
export default function ApercuBannierePage() {
  redirect('/')
}
