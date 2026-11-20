import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { EnergyPerformance } from '@/components/offers/EnergyPerformance'
import { Gallery } from '@/components/offers/Gallery'
import { FeesNotice, GeorisquesNotice, RentControlNotice } from '@/components/offers/LegalNotices'
import { NegotiatorCard } from '@/components/offers/NegotiatorCard'
import { PriceSummary } from '@/components/offers/PriceSummary'
import { PropertyCard } from '@/components/offers/PropertyCard'
import { featureBadges } from '@/components/offers/PropertyIcons'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  displaySector,
  displayStreet,
  getAllProperties,
  getProperty,
  getSimilarProperties,
  propertyFullTitle,
  propertyTitle,
  truncate,
} from '@/lib/properties'
import { formatArea } from '@/lib/utils'
import type { Property } from '@/types/property'

type Params = Promise<{ reference: string; slug: string }>

/**
 * Les annonces sont peu nombreuses et changent à chaque import : on les
 * pré-rend toutes, ce qui donne des fiches servies en HTML statique — le seul
 * point qui compte vraiment pour le référencement d'un catalogue immobilier.
 */
export async function generateStaticParams() {
  return (await getAllProperties()).map((property) => ({
    reference: property.reference,
    slug: property.slug,
  }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { reference } = await params
  const property = await getProperty(reference)

  if (!property) return { title: 'Bien introuvable' }

  const description = property.description
    ? truncate(property.description, 150)
    : `${propertyFullTitle(property)} — réf. ${property.reference}.`

  return {
    title: propertyFullTitle(property),
    description,
    openGraph: {
      title: propertyFullTitle(property),
      description,
      type: 'article',
      // Image Open Graph : la première photo de l'annonce, comme le faisait
      // `Local\Seo::getSeo()`. Absente tant que la médiathèque n'est pas reprise.
      images: property.media[0] ? [{ url: property.media[0].url }] : undefined,
    },
  }
}

export default async function PropertyPage({ params }: { params: Params }) {
  const { reference, slug } = await params
  const property = await getProperty(reference)

  if (!property) notFound()

  // La référence est la clé ; le slug n'est là que pour les humains et les
  // moteurs. Un slug périmé — après reformulation d'un titre, ou depuis une
  // ancienne URL accentuée — redirige plutôt que de renvoyer une 404 ou de
  // servir deux URLs pour la même fiche.
  if (slug !== property.slug) {
    redirect(`/offres/${property.reference}/${property.slug}`)
  }

  const street = displayStreet(property)
  const badges = featureBadges(property.features)
  const similar = await getSimilarProperties(property)

  return (
    <>
      <PageHeader
        image="/brand/hero-trouver.jpg"
        eyebrow={property.transaction === 'location' ? 'À louer' : 'À vendre'}
        title={propertyTitle(property)}
        description={
          <>
            {street ? `${street}, ` : null}
            {displaySector(property)} · {property.location.postalCode} {property.location.city}
            {property.transaction === 'location' && property.location.street ? (
              <span className="mt-1 block text-sm text-ink-400">
                Le numéro de rue est communiqué lors de la prise de rendez-vous.
              </span>
            ) : null}
          </>
        }
        breadcrumb={[
          { label: 'Nos biens', href: '/offres' },
          { label: propertyTitle(property) },
        ]}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-pill bg-ink-900 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-white uppercase">
            Réf. {property.reference}
          </span>
          {property.isExclusive ? (
            <span className="rounded-pill bg-brand-500 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-white uppercase">
              Exclusivité
            </span>
          ) : null}
          {property.isLifeAnnuity ? (
            <span className="rounded-pill border border-line-strong px-3 py-1 text-xs font-semibold tracking-[0.08em] text-ink-700 uppercase">
              Viager
            </span>
          ) : null}
        </div>
      </PageHeader>

      <PropertyJsonLd property={property} />

      <Container as="section" className="py-8 lg:py-10">
        <Gallery property={property} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="grid gap-6">
            {property.description ? (
              <section className="rounded-panel border border-line bg-surface p-6">
                <h2 className="text-lg font-semibold">Descriptif</h2>
                <p className="mt-3 leading-relaxed whitespace-pre-line text-ink-500">
                  {property.description}
                </p>
                {property.virtualTourUrl ? (
                  <a
                    href={property.virtualTourUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-5 inline-flex items-center gap-2 rounded-pill border border-line-strong px-4 py-2 text-sm font-medium text-ink-800 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="size-4 fill-none stroke-current stroke-[1.5]"
                    >
                      <circle cx="8" cy="8" r="6" />
                      <path d="M2 8h12M8 2c3 3 3 9 0 12M8 2C5 5 5 11 8 14" />
                    </svg>
                    Visite virtuelle
                    <span className="sr-only">(nouvel onglet)</span>
                  </a>
                ) : null}
              </section>
            ) : null}

            <Characteristics property={property} />

            {badges.length > 0 ? (
              <section className="rounded-panel border border-line bg-surface p-6">
                <h2 className="text-lg font-semibold">Équipements</h2>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {badges.map(({ key, label, Icon }) => (
                    <li
                      key={key}
                      className="inline-flex items-center gap-2.5 rounded-card bg-surface-muted px-3.5 py-2.5 text-sm text-ink-700"
                    >
                      <Icon className="size-4 shrink-0 text-brand-600" />
                      {label}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <EnergyPerformance energy={property.energy} />
            <RentControlNotice rentControl={property.rentControl} />
            <FeesNotice property={property} />
            <GeorisquesNotice property={property} />
          </div>

          <aside className="grid gap-6 lg:sticky lg:top-24">
            <PriceSummary property={property} />
            <NegotiatorCard agencySlug={property.agencySlug} />
          </aside>
        </div>
      </Container>

      {similar.length > 0 ? (
        <section className="border-t border-line bg-surface py-8 lg:py-10">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="À voir aussi"
                title="Des biens comparables"
                description={`D’autres biens ${property.transaction === 'location' ? 'à louer' : 'à vendre'} à ${property.location.city}, de surface proche.`}
              />
            </Reveal>
            <ul className="mt-10 grid gap-5">
              {similar.map((item, index) => (
                <Reveal as="li" key={item.reference} delay={index * 80}>
                  <PropertyCard property={item} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  )
}

/** Tableau des caractéristiques, chaque ligne omise si la donnée est absente. */
function Characteristics({ property }: { property: Property }) {
  const { features, location } = property

  const rows: readonly { label: string; value: string }[] = [
    { label: 'Nature du bien', value: property.kind },
    ...(property.category ? [{ label: 'Type', value: property.category }] : []),
    ...(features.livingArea ? [{ label: 'Surface habitable', value: formatArea(features.livingArea) }] : []),
    ...(features.landArea ? [{ label: 'Terrain', value: formatArea(features.landArea) }] : []),
    ...(features.rooms ? [{ label: 'Nombre de pièces', value: String(features.rooms) }] : []),
    ...(features.bedrooms ? [{ label: 'Chambres', value: String(features.bedrooms) }] : []),
    ...(features.bathrooms ? [{ label: 'Salles de bain et d’eau', value: String(features.bathrooms) }] : []),
    ...(features.floor !== undefined
      ? [
          {
            label: 'Étage',
            value:
              features.floor === 0
                ? 'Rez-de-chaussée'
                : `${features.floor}${features.floor === 1 ? 'er' : 'e'}${
                    features.floors ? ` sur ${features.floors}` : ''
                  }`,
          },
        ]
      : []),
    ...(features.constructionYear
      ? [{ label: 'Année de construction', value: String(features.constructionYear) }]
      : []),
    { label: 'Secteur', value: `${location.district ?? location.city} (${location.postalCode})` },
  ]

  return (
    <section className="rounded-panel border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold">Caractéristiques</h2>
      <dl className="mt-4 divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-6 py-2.5">
            <dt className="text-sm text-ink-500">{row.label}</dt>
            <dd className="text-[0.9375rem] font-medium text-ink-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/**
 * Données structurées `RealEstateListing`.
 *
 * Absentes du site précédent : c'est le gain SEO le plus direct de la refonte,
 * puisqu'il permet aux moteurs de lire le prix, la surface et la localisation
 * sans interpréter la page.
 *
 * L'adresse publiée suit la même règle que l'affichage : pas de numéro de rue
 * en location. Un balisage plus précis que ce que la page montre serait une
 * contradiction, et trahirait la demande des bailleurs.
 */
function PropertyJsonLd({ property }: { property: Property }) {
  const street = displayStreet(property)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: propertyFullTitle(property),
    description: property.description,
    url: `/offres/${property.reference}/${property.slug}`,
    datePosted: property.publishedAt,
    ...(property.media[0] ? { image: property.media[0].url } : {}),
    offers: {
      '@type': 'Offer',
      price: property.price.amount,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      ...(property.transaction === 'location'
        ? { businessFunction: 'https://schema.org/LeaseOut' }
        : { businessFunction: 'https://schema.org/Sell' }),
    },
    about: {
      '@type': property.transaction === 'location' ? 'Apartment' : 'Accommodation',
      name: propertyTitle(property),
      ...(property.features.livingArea
        ? {
            floorSize: {
              '@type': 'QuantitativeValue',
              value: property.features.livingArea,
              unitCode: 'MTK',
            },
          }
        : {}),
      ...(property.features.rooms ? { numberOfRooms: property.features.rooms } : {}),
      ...(property.features.bedrooms
        ? { numberOfBedrooms: property.features.bedrooms }
        : {}),
      address: {
        '@type': 'PostalAddress',
        ...(street ? { streetAddress: street } : {}),
        addressLocality: property.location.city,
        postalCode: property.location.postalCode,
        addressCountry: 'FR',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  )
}
