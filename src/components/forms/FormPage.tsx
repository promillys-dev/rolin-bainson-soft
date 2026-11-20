import type { ReactNode } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Crumb } from '@/components/ui/Breadcrumb'
import { site } from '@/config/site'
import { isApiConfigured } from '@/lib/api/client'
import { getAgencies } from '@/lib/agencies'

/**
 * Gabarit des pages de formulaire.
 *
 * Le formulaire occupe la colonne principale, les coordonnées la seconde :
 * une partie des visiteurs ne remplira jamais un formulaire et cherche un
 * numéro. Les leur cacher derrière un envoi ne fait pas gagner un contact,
 * cela en perd un.
 */
export async function FormPage({
  eyebrow,
  title,
  titleAccent,
  description,
  breadcrumb,
  children,
  aside,
  image = '/brand/hero-gestion.jpg',
  formTitle = 'Votre demande',
  formHint = 'Les champs marqués « facultatif » peuvent rester vides.',
}: {
  eyebrow: string
  title: string
  titleAccent?: string
  description: string
  breadcrumb: readonly Crumb[]
  children: ReactNode
  aside?: ReactNode
  /** Tête du panneau du formulaire. */
  formTitle?: string
  formHint?: string
  /** Photographie du bandeau : par défaut, la remise des clés. */
  image?: string
}) {
  const agencies = await getAgencies()

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={
          titleAccent ? (
            <>
              {title} <span className="text-brand-500">{titleAccent}</span>
            </>
          ) : (
            title
          )
        }
        description={description}
        breadcrumb={breadcrumb}
        image={image}
      />

      <Container as="section" className="py-8 lg:py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div>
            {isApiConfigured ? null : <BackendNotice />}

            {/* Le formulaire dans un panneau plutôt que posé nu sur la page :
                une suite de champs sans cadre se lit comme un questionnaire
                administratif. Le bandeau de tête lui donne un début, le pied
                une fin — et dit ce qu'il advient de ce qu'on écrit. */}
            <div
              className={`gilt-edge relative overflow-hidden rounded-panel border border-line bg-surface shadow-float ${isApiConfigured ? '' : 'mt-8'}`}
            >
              <div className="border-b border-line bg-surface-warm px-6 py-5 sm:px-8">
                <h2 className="font-display text-xl font-semibold text-ink-900">{formTitle}</h2>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-500">{formHint}</p>
              </div>

              <div className="px-6 py-7 sm:px-8">{children}</div>

              <p className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line bg-surface-warm px-6 py-4 text-[0.8125rem] text-ink-500 sm:px-8">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
                  Réponse sous 48 heures ouvrées
                </span>
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
                  Vos informations ne servent qu’à traiter votre demande
                </span>
              </p>
            </div>
          </div>

          <aside className="grid gap-6 lg:sticky lg:top-24">
            {aside}

            {/* La seconde porte d'entrée de la page : elle prend la matière
                sombre de la bannière pour qu'on la voie. */}
            <div className="gilt-edge relative overflow-hidden rounded-panel bg-ink-900 p-6 text-white shadow-float after:opacity-80">
              <p className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-brand-200 uppercase">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
                Par téléphone
              </p>
              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
                className="mt-3 block font-display text-[1.75rem] font-semibold text-white transition-colors hover:text-brand-300"
              >
                {site.phone}
              </a>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Le standard du groupe vous oriente vers l’agence concernée.
              </p>

              <h2 className="mt-6 text-[0.6875rem] font-semibold tracking-[0.14em] text-white/45 uppercase">
                Nos agences
              </h2>
              <ul className="mt-3 grid gap-2.5 text-sm">
                {agencies.map((agency) => (
                  <li key={agency.slug} className="flex items-baseline justify-between gap-3">
                    <Link
                      href={`/agences/${agency.slug}`}
                      className="inline-flex items-center gap-2 font-medium text-white transition-colors hover:text-brand-300"
                    >
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
                      {agency.shortName}
                    </Link>
                    <a
                      href={`tel:${agency.phone.replace(/\s/g, '')}`}
                      className="text-white/60 tabular-nums transition-colors hover:text-white"
                    >
                      {agency.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </>
  )
}

/**
 * Avertissement : formulaire non relié au back-office.
 *
 * Les formulaires partent au back-office (`app/actions.ts`). Si `API_URL`
 * n'est pas défini, rien ne peut partir, et le dire est la seule option
 * acceptable : un formulaire qui annonce « message envoyé » sans rien
 * envoyer est une régression invisible — c'est exactement ce que faisait la
 * tâche d'alertes e-mail du site précédent, désactivée en production pendant
 * des années sans que personne ne s'en aperçoive.
 */
function BackendNotice() {
  return (
    <p className="rounded-panel border border-brand-200 bg-brand-50 p-5 text-[0.9375rem] leading-relaxed text-ink-700">
      <strong className="font-semibold text-ink-900">Formulaire non relié au back-office.</strong>{' '}
      Aucune demande ne peut être transmise depuis cette version du site. Appelez-nous ou écrivez
      directement à{' '}
      <a
        href={`mailto:${site.email}`}
        className="font-medium text-brand-700 transition-colors hover:text-brand-800"
      >
        {site.email}
      </a>
      .
    </p>
  )
}
