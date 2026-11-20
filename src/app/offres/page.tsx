import type { Metadata } from 'next'
import { Pagination } from '@/components/offers/Pagination'
import { PropertyCard } from '@/components/offers/PropertyCard'
import { ResultsFilters } from '@/components/offers/ResultsFilters'
import { SortBar } from '@/components/offers/SortBar'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { searchProperties } from '@/lib/properties'
import { parsePageSize, parseSearchParams, type RawSearchParams } from '@/lib/searchParams'
import type { TransactionType } from '@/types/property'

/** Libellé de la transaction en cours, partagé par le titre et les métadonnées. */
function scopeLabel(transaction: TransactionType | undefined): string {
  if (transaction === 'location') return 'à louer'
  if (transaction === 'vente') return 'à vendre'
  return 'à vendre et à louer'
}

/**
 * Les deux entrées de menu « Locations » et « Ventes » pointent sur cette même
 * page avec un paramètre. Sans titre distinct, les moteurs verraient trois
 * URLs pour une seule page ; le titre suit donc la transaction filtrée.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}): Promise<Metadata> {
  const scope = scopeLabel(parseSearchParams(await searchParams).transaction)

  return {
    title: `Nos biens ${scope}`,
    description: `Appartements, garages et places de parking ${scope} à Lyon et Villeurbanne. Recherchez par secteur, type de bien, surface et budget.`,
  }
}

/**
 * Recherche et résultats.
 *
 * `searchParams` est la seule source d'état : la page est entièrement
 * reconstructible depuis son URL, donc partageable, indexable et utilisable
 * sans JavaScript. C'est aussi ce qui permettra de brancher les alertes
 * e-mail sur des critères structurés plutôt que sur une query string stockée
 * telle quelle, comme le faisait le site précédent.
 */
export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}) {
  const raw = await searchParams
  const criteria = parseSearchParams(raw)
  const pageSize = parsePageSize(raw)
  const { items, total, page, pageCount } = await searchProperties(criteria, pageSize)

  const scope = scopeLabel(criteria.transaction)

  return (
    <>
      <PageHeader
        image="/brand/hero-trouver.jpg"
        eyebrow="Nos biens"
        title={
          <>
            Nos biens {scope} à Lyon <span className="text-brand-500">et Villeurbanne</span>
          </>
        }
        description="Le catalogue est alimenté par nos agences de Charpennes et de Confluence. Affinez par secteur, par type de bien ou par budget."
        breadcrumb={[{ label: 'Nos biens' }]}
      >
        <div className="mt-10">
          <ResultsFilters criteria={criteria} />
        </div>
      </PageHeader>

      <Container as="section" className="py-8 lg:py-10">
        <SortBar criteria={criteria} pageSize={pageSize} total={total} />

        {items.length > 0 ? (
          <>
            <ul className="mt-8 grid gap-5">
              {items.map((property, index) => (
                <Reveal as="li" key={property.reference} delay={Math.min(index, 4) * 70}>
                  <PropertyCard property={property} />
                </Reveal>
              ))}
            </ul>

            <div className="mt-12">
              <Pagination
                criteria={criteria}
                page={page}
                pageCount={pageCount}
                pageSize={pageSize}
              />
            </div>
          </>
        ) : (
          <EmptyResults />
        )}
      </Container>
    </>
  )
}

/**
 * État vide.
 *
 * Le legacy affichait une liste vide sans un mot, ce qui laissait croire à une
 * panne. On dit ce qui s'est passé et on propose les deux sorties utiles :
 * relâcher les critères, ou se faire rappeler.
 */
function EmptyResults() {
  return (
    <div className="mt-8 rounded-panel border border-dashed border-line-strong bg-surface p-10 text-center lg:p-16">
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="mx-auto size-12 fill-none stroke-ink-300 stroke-[1.5]"
      >
        <circle cx="21" cy="21" r="13" strokeLinecap="round" />
        <path d="m31 31 10 10" strokeLinecap="round" />
        <path d="m16 16 10 10M26 16 16 26" strokeLinecap="round" />
      </svg>

      <h2 className="mt-6 text-2xl font-semibold">Aucun bien ne correspond à ces critères</h2>
      <p className="mx-auto mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-ink-500">
        Notre catalogue bouge vite : un bien peut être loué ou vendu en quelques jours. Élargissez
        votre recherche, ou dites-nous ce que vous cherchez — nous vous préviendrons dès qu’un bien
        correspond.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/offres">Voir tous les biens</ButtonLink>
        <ButtonLink href="/etre-rappele/projet-immobilier" variant="outline">
          Décrire mon projet
        </ButtonLink>
      </div>
    </div>
  )
}
