import type { Metadata } from 'next'
import Link from 'next/link'
import { AgencyJsonLd } from '@/components/agencies/AgencyJsonLd'
import { ContactBand } from '@/components/home/ContactBand'
import { ArrowIcon } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { getAgencies } from '@/lib/agencies'

export const metadata: Metadata = {
  title: 'Nos agences à Lyon et Villeurbanne',
  description:
    'Trois agences Rolin Bainson : le siège rue d’Alsace, l’agence Charpennes cours Émile Zola et l’agence Confluence cours Charlemagne. Adresses, horaires et contacts.',
}

/**
 * Liste des agences.
 *
 * Les données viennent de `config/site.ts`, extraites de la table legacy
 * `rb_agences`. Rappel de l'audit : cette table contenait QUATRE lignes dont
 * deux doublons de Charpennes. Il y a bien trois agences ; le front ne
 * reproduira pas le doublon, et c'est au back-end de dédoublonner à l'import.
 */
export default async function AgenciesPage() {
  const agencies = await getAgencies()

  return (
    <>
      <PageHeader
        eyebrow="Nous rencontrer"
        title={
          <>
            Trois agences, <span className="text-brand-500">à deux pas de vos immeubles</span>
          </>
        }
        description="Nos équipes vous reçoivent sans rendez-vous aux horaires d’ouverture. Chaque agence a son métier dominant : la vitrine pour la transaction, le siège pour la gestion et le syndic."
        breadcrumb={[{ label: 'Agences' }]}
      />

      <Container as="section" className="py-8 lg:py-10">
        <ul className="grid gap-6">
          {agencies.map((agency, index) => {
            const content = agency.content

            return (
              <Reveal as="li" key={agency.slug} delay={index * 80}>
                <AgencyJsonLd agency={agency} />

                <article className="group relative grid gap-6 rounded-panel border border-line bg-surface p-6 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-brand-200 hover:shadow-raised lg:grid-cols-[minmax(0,1fr)_18rem] lg:p-8">
                  <div>
                    <ul className="flex flex-wrap gap-1.5">
                      {agency.activities.map((activity) => (
                        <li
                          key={activity}
                          className="rounded-pill bg-surface-sunken px-2.5 py-1 text-[0.6875rem] font-medium text-ink-500"
                        >
                          {activity}
                        </li>
                      ))}
                    </ul>

                    <h2 className="mt-4 text-2xl font-semibold">
                      <Link href={`/agences/${agency.slug}`} className="after:absolute after:inset-0">
                        {agency.name}
                      </Link>
                    </h2>

                    {content ? (
                      <>
                        <p className="mt-1 text-[0.9375rem] font-medium text-brand-700">
                          {content.tagline}
                        </p>
                        <p className="mt-4 leading-relaxed text-ink-500">{content.intro}</p>
                      </>
                    ) : null}

                    <p className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink-900 transition-colors group-hover:text-brand-700">
                      Voir l’agence
                      <ArrowIcon className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1" />
                    </p>
                  </div>

                  <div className="rounded-card bg-surface-muted p-5 text-sm">
                    <address className="leading-relaxed text-ink-700 not-italic">
                      {agency.address}
                      <br />
                      {agency.postalCode} {agency.city}
                    </address>

                    {/* `relative` sort ces liens de sous le lien de carte :
                        appeler l'agence ne doit pas ouvrir sa fiche. */}
                    <div className="relative mt-3 grid gap-1">
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

                    {agency.openingHours.length > 0 ? (
                      <ul className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink-400">
                        {agency.openingHours.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 border-t border-line pt-3 text-xs text-ink-400">
                        Horaires communiqués par téléphone.
                      </p>
                    )}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ul>
      </Container>

      <ContactBand
        eyebrow="Être rappelé"
        title={['Vous préférez ', 'qu’on vous rappelle', ' ?']}
        description="Laissez-nous votre numéro et le motif de votre appel : un interlocuteur de l’agence concernée vous recontacte, sans numéro surtaxé ni serveur vocal."
        primary={{ href: '/etre-rappele', label: 'Être rappelé' }}
        secondary={{ href: '/coordonnees-et-acces', label: 'Coordonnées et accès' }}
        width="default"
      />
    </>
  )
}
