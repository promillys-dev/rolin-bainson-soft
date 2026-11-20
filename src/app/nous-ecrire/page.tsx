import type { Metadata } from 'next'
import { FormPage } from '@/components/forms/FormPage'
import { ManagedForm } from '@/components/forms/ManagedForm'

export const metadata: Metadata = {
  title: 'Nous écrire',
  description:
    'Adressez-nous votre demande par écrit : question sur un bien, copropriété, gestion locative ou assurance.',
}

/**
 * « Nous écrire ».
 *
 * Même formulaire que `/contact` — le site précédent en avait déjà deux
 * entrées de menu pour un seul traitement. Les deux routes sont conservées
 * parce qu'elles existent dans le menu et dans les liens entrants ; elles
 * diffèrent par leur cadrage, pas par leurs champs. À fusionner le jour où
 * l'arborescence sera arbitrée avec le client.
 */
export default function WriteToUsPage() {
  return (
    <FormPage
      eyebrow="Nous écrire"
      title="Votre demande,"
      titleAccent="par écrit"
      description="Un écrit laisse une trace, de votre côté comme du nôtre. C’est la bonne voie pour une demande qui engage : un congé, une réclamation, une question sur des charges."
      breadcrumb={[{ label: 'Nous écrire' }]}
    >
      <ManagedForm slug="contact" />
    </FormPage>
  )
}
