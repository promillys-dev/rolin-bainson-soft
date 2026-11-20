import type { Metadata } from 'next'
import Link from 'next/link'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/config/site'
import { getAgencies } from '@/lib/agencies'

export const metadata: Metadata = {
  title: 'Coordonnées et accès',
  description:
    'Adresses, téléphones, horaires et accès de nos trois agences à Villeurbanne et Lyon, et le standard du groupe.',
}

/**
 * Coordonnées et accès.
 *
 * Page la plus consultée d'un site d'agence après les annonces : quelqu'un
 * qui l'ouvre cherche une adresse, un horaire ou un numéro, souvent debout
 * dans la rue. Tout est donc au-dessus de la ligne de flottaison, sans
 * texte d'introduction à faire défiler.
 */
export default async function ContactDetailsPage() {
  const agencies = await getAgencies()

  return (
    <>
      <PageHeader
        eyebrow="Nous trouver"
        title={
          <>
            Où nous joindre, <span className="text-brand-500">et comment venir</span>
          </>
        }
        description="Trois adresses entre Villeurbanne et Lyon. Le standard du groupe redirige vers l’agence concernée si vous ne savez pas qui appeler."
        breadcrumb={[{ label: 'Coordonnées et accès' }]}
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={`tel:${site.phone.replace(/\s/g, '')}`}
            className="font-display text-2xl font-semibold text-ink-900 transition-colors hover:text-brand-700"
          >
            {site.phone}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="text-[0.9375rem] font-medium text-brand-700 transition-colors hover:text-brand-800"
          >
            {site.email}
          </a>
        </div>
      </PageHeader>

      <Container as="section" className="py-8 lg:py-10">
        <ul className="grid gap-5 lg:grid-cols-3">
          {agencies.map((agency, index) => {
            const content = agency.content

            return (
              <Reveal as="li" key={agency.slug} delay={index * 80} className="h-full">
                <div className="flex h-full flex-col rounded-panel border border-line bg-surface p-6">
                  <h2 className="text-lg leading-snug font-semibold">
                    <Link
                      href={`/agences/${agency.slug}`}
                      className="transition-colors hover:text-brand-700"
                    >
                      {agency.name}
                    </Link>
                  </h2>

                  <address className="mt-3 leading-relaxed text-ink-500 not-italic">
                    {agency.address}
                    <br />
                    {agency.postalCode} {agency.city}
                  </address>

                  <div className="mt-4 grid gap-1 text-[0.9375rem]">
                    <a
                      href={`tel:${agency.phone.replace(/\s/g, '')}`}
                      className="font-medium text-brand-700 transition-colors hover:text-brand-800"
                    >
                      {agency.phone}
                    </a>
                    <a
                      href={`mailto:${agency.email}`}
                      className="text-ink-500 transition-colors hover:text-ink-900"
                    >
                      {agency.email}
                    </a>
                  </div>

                  <h3 className="mt-5 text-xs font-semibold tracking-[0.1em] text-ink-400 uppercase">
                    Horaires
                  </h3>
                  {agency.openingHours.length > 0 ? (
                    <ul className="mt-2 grid gap-1 text-sm leading-relaxed text-ink-500">
                      {agency.openingHours.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-ink-500">Communiqués par téléphone.</p>
                  )}

                  {content ? (
                    <>
                      <h3 className="mt-5 text-xs font-semibold tracking-[0.1em] text-ink-400 uppercase">
                        Accès
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                        {content.access}
                      </p>
                    </>
                  ) : null}
                </div>
              </Reveal>
            )
          })}
        </ul>

        <div className="mt-10 rounded-panel border border-line bg-surface p-6 lg:p-8">
          <h2 className="text-xl font-semibold">Qui appeler ?</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-ink-900">Acheter, vendre ou louer</dt>
              <dd className="mt-1 text-[0.9375rem] leading-relaxed text-ink-500">
                L’agence Charpennes pour Villeurbanne, l’agence Confluence pour Lyon et la
                Presqu’île.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink-900">Locataire ou bailleur en gestion</dt>
              <dd className="mt-1 text-[0.9375rem] leading-relaxed text-ink-500">
                Le siège, rue d’Alsace, qui suit les baux, les quittances et les travaux.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink-900">Copropriétaire ou conseil syndical</dt>
              <dd className="mt-1 text-[0.9375rem] leading-relaxed text-ink-500">
                Le siège également : votre gestionnaire d’immeuble y a une ligne directe.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink-900">Sinistre ou contrat d’assurance</dt>
              <dd className="mt-1 text-[0.9375rem] leading-relaxed text-ink-500">
                Le service courtage, au siège, qui déclare et suit l’expertise pour vous.
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Nous écrire</ButtonLink>
            <ButtonLink href="/etre-rappele" variant="outline">
              Être rappelé
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  )
}
