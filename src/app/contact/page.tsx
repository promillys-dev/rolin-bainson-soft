import type { Metadata } from 'next'
import Link from 'next/link'
import { FormPage } from '@/components/forms/FormPage'
import { ManagedForm } from '@/components/forms/ManagedForm'
import { getAgencies } from '@/lib/agencies'
import { getProperty, propertyFullTitle } from '@/lib/properties'
import type { RawSearchParams } from '@/lib/searchParams'

export const metadata: Metadata = {
  title: 'Nous contacter',
  description:
    'Écrivez-nous : achat, vente, location, gestion locative, syndic ou assurances. Réponse sous quarante-huit heures ouvrées.',
}

/**
 * Formulaire de contact.
 *
 * Deux pré-remplissages, depuis `?bien=<référence>` et `?agence=<slug>` :
 * une référence d'annonce et un identifiant d'agence ne sont pas des données
 * personnelles, contrairement à ce que le site précédent faisait transiter en
 * GET. Le message est amorcé, pas verrouillé — la personne reste libre de
 * tout réécrire.
 */
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}) {
  const raw = await searchParams
  const single = (key: string) => {
    const value = raw[key]
    return Array.isArray(value) ? value[0] : value
  }

  const property = await getProperty(single('bien') ?? '')
  const agency = (await getAgencies()).find((entry) => entry.slug === single('agence'))

  const defaultMessage = property
    ? `Bonjour,\n\nJe souhaite en savoir plus sur le bien réf. ${property.reference} — ${propertyFullTitle(property)}.\n\n`
    : agency
      ? `Bonjour,\n\nJe souhaite joindre l’agence ${agency.shortName}.\n\n`
      : undefined

  // Valeur du choix « Objet de la demande » du back-office.
  const defaultSubject = property ? 'Transaction' : undefined

  return (
    <FormPage
      eyebrow="Nous contacter"
      title="Dites-nous"
      titleAccent="ce dont vous avez besoin"
      description="Une question sur un bien, un projet à monter, un sinistre à déclarer : décrivez votre demande, nous l’orientons vers le bon interlocuteur."
      breadcrumb={[{ label: 'Nous contacter' }]}
      formTitle="Votre demande"
      formHint="Dites-nous l’essentiel : nous orientons vers le bon interlocuteur avant de vous répondre."
      aside={<AutresVoies />}
    >
      <ManagedForm
        slug="contact"
        defaults={{
          ...(defaultSubject ? { objet: defaultSubject } : {}),
          ...(defaultMessage ? { message: defaultMessage } : {}),
        }}
      />
    </FormPage>
  )
}


/**
 * Les autres façons de nous joindre.
 *
 * Toute demande ne mérite pas un formulaire : certains préfèrent être
 * rappelés, d'autres veulent simplement une adresse. Les proposer ici, en
 * clair, évite qu'on remplisse huit champs pour demander un horaire.
 */
const VOIES = [
  {
    href: '/etre-rappele',
    label: 'Être rappelé',
    hint: 'Vous laissez un numéro, nous appelons.',
  },
  {
    href: '/nous-ecrire',
    label: 'Nous écrire',
    hint: 'Un message libre, sans formulaire guidé.',
  },
  {
    href: '/coordonnees-et-acces',
    label: 'Où nous trouver',
    hint: 'Adresses, horaires et accès des trois agences.',
  },
] as const

function AutresVoies() {
  return (
    <div className="rounded-panel border border-line bg-surface p-6 shadow-float">
      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-ink-400 uppercase">
        Autrement
      </p>
      <ul className="mt-4 grid gap-4">
        {VOIES.map((voie) => (
          <li key={voie.href}>
            <Link
              href={voie.href}
              className="group/voie flex items-start gap-3 transition-colors duration-300"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-400 transition-transform duration-300 group-hover/voie:scale-150"
              />
              <span>
                <span className="block text-[0.9375rem] font-medium text-ink-900 transition-colors duration-300 group-hover/voie:text-brand-600">
                  {voie.label}
                </span>
                <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-ink-500">
                  {voie.hint}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
