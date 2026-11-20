import type { Metadata } from 'next'
import { FormPage } from '@/components/forms/FormPage'
import { ManagedForm } from '@/components/forms/ManagedForm'

export const metadata: Metadata = {
  title: 'Décrire mon projet immobilier',
  description:
    'Achat, vente, location ou investissement à Lyon et Villeurbanne : décrivez votre projet, nous préparons une première réponse argumentée.',
}

export default function ProjectPage() {
  return (
    <FormPage
      eyebrow="Projet immobilier"
      title="Votre projet,"
      titleAccent="en quelques questions"
      description="Plus votre projet est précis, plus notre première réponse l’est aussi. Secteur, budget, type de bien : rien n’est engageant, tout nous fait gagner du temps."
      breadcrumb={[
        { label: 'Être rappelé', href: '/etre-rappele' },
        { label: 'Projet immobilier' },
      ]}
    >
      <ManagedForm slug="projet-immobilier" />
    </FormPage>
  )
}
