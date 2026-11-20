import { BackofficeForm } from '@/components/forms/BackofficeForm'
import { site } from '@/config/site'
import { getFormDefinition, type FormSlug } from '@/lib/backofficeForms'

/**
 * Un formulaire géré en back-office : lit sa définition, puis l'affiche.
 *
 * Si le back-office l'a désactivé, la page ne montre pas un formulaire mort
 * mais les deux autres moyens de joindre la maison.
 */
export async function ManagedForm({
  slug,
  defaults,
}: {
  slug: FormSlug
  defaults?: Record<string, string>
}) {
  const definition = await getFormDefinition(slug)

  if (!definition) {
    return (
      <p className="rounded-panel border border-line bg-surface p-6 leading-relaxed text-ink-700">
        Ce formulaire n’est pas disponible pour le moment. Appelez-nous au{' '}
        <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="font-semibold text-brand-700">
          {site.phone}
        </a>{' '}
        ou écrivez à{' '}
        <a href={`mailto:${site.email}`} className="font-semibold text-brand-700">
          {site.email}
        </a>
        .
      </p>
    )
  }

  return <BackofficeForm definition={definition} defaults={defaults} />
}
