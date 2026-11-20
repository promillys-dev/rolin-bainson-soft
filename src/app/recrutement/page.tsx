import type { Metadata } from 'next'
import { FormPage } from '@/components/forms/FormPage'
import { ManagedForm } from '@/components/forms/ManagedForm'

export const metadata: Metadata = {
  title: 'Recrutement',
  description:
    'Rejoindre Rolin Bainson : négociateur, gestionnaire locatif, gestionnaire de copropriété. Envoyez votre candidature et votre CV.',
}

/**
 * Recrutement et candidature spontanée.
 *
 * Le legacy avait une page `candidature.html` qui était uniquement un
 * formulaire. On y ajoute ce qu'un candidat cherche avant de postuler : les
 * métiers de la maison, et ce qui s'y passe une fois le CV envoyé.
 */
export default function RecruitmentPage() {
  return (
    <FormPage
      eyebrow="Le groupe"
      title="Travailler"
      titleAccent="chez nous"
      description="Nous recrutons au fil de l’eau, sur les quatre métiers du groupe. Les candidatures spontanées sont lues : la plupart de nos recrutements viennent de là."
      breadcrumb={[{ label: 'Le groupe', href: '/presentation' }, { label: 'Recrutement' }]}
      aside={
        <div className="rounded-panel border border-line bg-surface p-6">
          <h2 className="text-lg font-semibold">Les métiers de la maison</h2>
          <ul className="mt-3 grid gap-2.5 text-[0.9375rem] leading-relaxed text-ink-500">
            <li>Négociateur transaction et location</li>
            <li>Gestionnaire locatif</li>
            <li>Gestionnaire de copropriété</li>
            <li>Comptable de copropriété</li>
            <li>Assistant commercial et administratif</li>
          </ul>

          <h3 className="mt-6 text-xs font-semibold tracking-[0.1em] text-ink-400 uppercase">
            Après l’envoi
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Nous accusons réception, puis répondons sous trois semaines — que le profil corresponde
            ou non. Les candidatures non retenues sont conservées deux ans, puis effacées.
          </p>
        </div>
      }
    >
      <ManagedForm slug="candidature" />
    </FormPage>
  )
}
