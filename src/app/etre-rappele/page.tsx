import type { Metadata } from 'next'
import Link from 'next/link'
import { FormPage } from '@/components/forms/FormPage'
import { ManagedForm } from '@/components/forms/ManagedForm'

export const metadata: Metadata = {
  title: 'Être rappelé',
  description:
    'Laissez-nous votre numéro et le motif de votre appel : un interlocuteur du groupe Rolin Bainson vous recontacte.',
}

/**
 * Demande de rappel.
 *
 * Même traitement que le contact, avec la case « être rappelé(e) » cochée
 * d'avance : c'est la raison pour laquelle on arrive sur cette page. La
 * validation serveur exige alors un numéro — demander un rappel sans laisser
 * de téléphone ne mène nulle part, et le dire tout de suite vaut mieux que de
 * ne jamais rappeler.
 */
export default function CallbackPage() {
  return (
    <FormPage
      eyebrow="Être rappelé"
      title="On vous rappelle,"
      titleAccent="quand ça vous arrange"
      description="Laissez votre numéro et le motif de votre appel. Nous rappelons aux horaires d’ouverture des agences, depuis une ligne fixe non surtaxée."
      breadcrumb={[{ label: 'Être rappelé' }]}
      aside={
        <div className="rounded-panel border border-line bg-surface p-6">
          <h2 className="text-lg font-semibold">Un projet d’achat ou de vente ?</h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
            Le formulaire « projet immobilier » nous permet de préparer l’appel : secteur, budget,
            type de bien. Vous gagnez un aller-retour.
          </p>
          <Link
            href="/etre-rappele/projet-immobilier"
            className="mt-4 inline-block text-[0.9375rem] font-medium text-brand-700 transition-colors hover:text-brand-800"
          >
            Décrire mon projet
          </Link>
        </div>
      }
    >
      <ManagedForm slug="contact" defaults={{ rappel: 'oui' }} />
    </FormPage>
  )
}
