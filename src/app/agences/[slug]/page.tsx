import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AgencyJsonLd } from '@/components/agencies/AgencyJsonLd'
import { PropertyCard } from '@/components/offers/PropertyCard'
import { ArrowLink, ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getAgencies, getAgency } from '@/lib/agencies'
import { getAllProperties } from '@/lib/properties'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  return (await getAgencies()).map((agency) => ({ slug: agency.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const agency = await getAgency(slug)

  if (!agency) return { title: 'Agence introuvable' }

  return {
    // Le gabarit de titre ajoute déjà « — Rolin Bainson » : on prend le nom
    // court, sinon la marque apparaît deux fois dans l'onglet.
    title: `Agence ${agency.shortName} — ${agency.city}`,
    description: `${agency.name}, ${agency.address}, ${agency.postalCode} ${agency.city}.${agency.activities.length ? ` ${agency.activities.join(', ')}.` : ''} Téléphone ${agency.phone}.`,
  }
}

/**
 * Fiche d'une agence.
 *
 * Deux choses que le site précédent ne faisait pas :
 *  - le formulaire de contact est atteint avec l'agence PRÉ-SÉLECTIONNÉE,
 *    pour que le message arrive au bon endroit sans que le visiteur ait à
 *    choisir dans une liste ;
 *  - les biens gérés par l'agence sont montrés ici. Une fiche d'agence qui ne
 *    mène nulle part est une impasse.
 */
export default async function AgencyPage({ params }: { params: Params }) {
  const { slug } = await params
  const agency = await getAgency(slug)

  if (!agency) notFound()

  const content = agency.content
  const listings = (await getAllProperties())
    .filter((property) => property.agencySlug === agency.slug)
    .slice(0, 3)

  return (
    <>
      <AgencyJsonLd agency={agency} />

      <PageHeader
        eyebrow={`Agence · ${agency.city}`}
        title={agency.name}
        description={content?.tagline}
        breadcrumb={[{ label: 'Agences', href: '/agences' }, { label: agency.shortName }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/contact?agence=${agency.slug}`}>Écrire à cette agence</ButtonLink>
          {/* Un `<a>` brut et non `ButtonLink` : `tel:` n'est pas une route,
              il n'a rien à faire dans le routeur client. */}
          <a
            href={`tel:${agency.phone.replace(/\s/g, '')}`}
            className="inline-flex h-11 items-center justify-center rounded-pill border border-line-strong bg-surface px-5 text-[0.9375rem] font-medium text-ink-800 transition-colors duration-300 ease-[var(--ease-out-soft)] hover:border-ink-900 hover:bg-ink-900 hover:text-white"
          >
            Appeler le {agency.phone}
          </a>
        </div>
      </PageHeader>

      <Container as="section" className="py-8 lg:py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="grid gap-6">
            {content ? (
              <section className="rounded-panel border border-line bg-surface p-6 lg:p-8">
                <h2 className="text-xl font-semibold">L’agence</h2>
                <p className="mt-4 leading-relaxed text-ink-500">{content.intro}</p>

                <h3 className="mt-8 text-sm font-semibold tracking-[0.1em] text-ink-400 uppercase">
                  Ce que nous y traitons
                </h3>
                <ul className="mt-4 grid gap-2.5">
                  {content.highlights.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-700">
                      <svg
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        className="mt-1 size-4 shrink-0 fill-none stroke-brand-600 stroke-[1.8]"
                      >
                        <path d="m3 8.5 3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="rounded-panel border border-line bg-surface p-6 lg:p-8">
              <h2 className="text-xl font-semibold">Venir nous voir</h2>
              {content ? (
                <p className="mt-4 leading-relaxed text-ink-500">{content.access}</p>
              ) : null}

              {/*
                La cartographie est un lot à part (MapLibre et tuiles IGN, pas
                Google Maps : la clé du legacy était vide et la facturation à
                la charge est un piège). En attendant, un lien vers un service
                d'itinéraire vaut mieux qu'un cadre vide.
              */}
              <a
                href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(
                  `${agency.address}, ${agency.postalCode} ${agency.city}`,
                )}`}
                target="_blank"
                rel="noreferrer noopener"
                className="group/btn mt-5 inline-flex items-center gap-2 rounded-pill border border-line-strong px-4 py-2 text-sm font-medium text-ink-800 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 fill-current">
                  <path d="M8 1a5 5 0 0 0-5 5c0 3.6 4.3 8.4 4.5 8.6a.7.7 0 0 0 1 0C8.7 14.4 13 9.6 13 6a5 5 0 0 0-5-5m0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4" />
                </svg>
                Ouvrir le plan
                <span className="sr-only">(nouvel onglet)</span>
              </a>
            </section>
          </div>

          <aside className="grid gap-6 lg:sticky lg:top-24">
            <div className="rounded-panel border border-line bg-surface p-6 shadow-card">
              <h2 className="text-lg font-semibold">Coordonnées</h2>

              <address className="mt-4 leading-relaxed text-ink-700 not-italic">
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

              <h3 className="mt-6 text-sm font-semibold tracking-[0.1em] text-ink-400 uppercase">
                Horaires
              </h3>
              {agency.openingHours.length > 0 ? (
                <ul className="mt-2 grid gap-1 text-sm leading-relaxed text-ink-500">
                  {agency.openingHours.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-ink-500">
                  Horaires communiqués par téléphone — l’information manque dans nos données.
                </p>
              )}

              <h3 className="mt-6 text-sm font-semibold tracking-[0.1em] text-ink-400 uppercase">
                Activités
              </h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {agency.activities.map((activity) => (
                  <li
                    key={activity}
                    className="rounded-pill bg-surface-sunken px-2.5 py-1 text-xs font-medium text-ink-500"
                  >
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>

      {listings.length > 0 ? (
        <section className="border-t border-line bg-surface py-8 lg:py-10">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <SectionHeading
                  eyebrow="Au catalogue"
                  title={`Des biens suivis par ${agency.shortName}`}
                />
              </Reveal>
              <Reveal delay={80}>
                <ArrowLink href="/offres">Tous nos biens</ArrowLink>
              </Reveal>
            </div>

            <ul className="mt-10 grid gap-5">
              {listings.map((property, index) => (
                <Reveal as="li" key={property.reference} delay={index * 80}>
                  <PropertyCard property={property} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  )
}
