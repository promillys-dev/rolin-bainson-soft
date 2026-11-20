import Link from 'next/link'
import { roomOptions } from '@/config/search'
import { getSearchOptions } from '@/lib/referenceData'
import { cn } from '@/lib/utils'
import type { PropertySearchParams } from '@/types/property'

/**
 * Formulaire de recherche de la page de résultats.
 *
 * Variante délibérée de `home/SearchForm`, pas une copie : le héros de
 * l'accueil est une carte flottante qui invite à démarrer, ici c'est une barre
 * compacte qui montre et corrige une recherche déjà faite. D'où deux
 * différences de fond — les champs sont pré-remplis depuis l'URL, et les
 * critères avancés s'ouvrent d'eux-mêmes quand ils sont renseignés, pour que
 * l'utilisateur voie ce qui filtre ses résultats.
 *
 * Toujours un `<form method="get">` : la recherche reste utilisable sans
 * JavaScript et chaque état produit une URL partageable.
 *
 * Le tri et la pagination ne sont PAS repris en champs cachés ici : relancer
 * une recherche doit ramener à la première page, et le tri a sa propre barre.
 */

const fieldClass =
  'h-11 w-full rounded-card border border-line bg-surface-warm px-3 text-[0.9375rem] text-ink-900 transition-colors duration-200 placeholder:text-ink-300 hover:border-line-strong focus:border-brand-500 focus:bg-surface focus:outline-none'

const labelClass = 'mb-1.5 block text-xs font-semibold tracking-wide text-ink-500 uppercase'

export async function ResultsFilters({ criteria }: { criteria: PropertySearchParams }) {
  // Types et secteurs : ceux du référentiel du back-office.
  const { kinds: propertyKinds, sectors } = await getSearchOptions()

  const hasAdvanced =
    criteria.budgetMin !== undefined ||
    criteria.bedroomsMin !== undefined ||
    criteria.areaMin !== undefined ||
    criteria.reference !== undefined

  return (
    <form
      method="get"
      action="/offres"
      className="rounded-panel border border-line bg-surface p-5 shadow-card sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label htmlFor="filter-transaction" className={labelClass}>
            Transaction
          </label>
          <select
            id="filter-transaction"
            name="transaction"
            className={fieldClass}
            defaultValue={criteria.transaction ?? ''}
          >
            <option value="">Vente et location</option>
            <option value="location">Location</option>
            <option value="vente">Vente</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-localisation" className={labelClass}>
            Secteur
          </label>
          <select
            id="filter-localisation"
            name="localisation"
            className={fieldClass}
            defaultValue={criteria.localisation ?? ''}
          >
            <option value="">Tous les secteurs</option>
            {sectors.map((sector) => (
              <option key={sector.value} value={sector.value}>
                {sector.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-kind" className={labelClass}>
            Type de bien
          </label>
          <select
            id="filter-kind"
            name="kind"
            className={fieldClass}
            defaultValue={criteria.kind ?? ''}
          >
            <option value="">Tous les types</option>
            {propertyKinds.map((kind) => (
              <option key={kind.value} value={kind.value}>
                {kind.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-pieces" className={labelClass}>
            Pièces (min.)
          </label>
          <select
            id="filter-pieces"
            name="piecesMin"
            className={fieldClass}
            defaultValue={criteria.piecesMin ?? ''}
          >
            <option value="">Indifférent</option>
            {roomOptions.map((n) => (
              <option key={n} value={n}>
                {n} et plus
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-budget" className={labelClass}>
            Budget max.
          </label>
          <div className="relative">
            <input
              id="filter-budget"
              name="budgetMax"
              type="number"
              min={0}
              step={50}
              inputMode="numeric"
              placeholder="Sans limite"
              defaultValue={criteria.budgetMax ?? ''}
              className={cn(fieldClass, 'pr-9')}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-ink-400"
            >
              €
            </span>
          </div>
        </div>
      </div>

      <details className="group mt-4" open={hasAdvanced}>
        <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-brand-700 [&::-webkit-details-marker]:hidden">
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-4 fill-none stroke-current stroke-[1.75] transition-transform duration-300 ease-[var(--ease-out-soft)] group-open:rotate-45"
          >
            <path d="M8 3v10M3 8h10" strokeLinecap="round" />
          </svg>
          Plus de critères
        </summary>

        <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="filter-budget-min" className={labelClass}>
              Budget min.
            </label>
            <input
              id="filter-budget-min"
              name="budgetMin"
              type="number"
              min={0}
              step={50}
              inputMode="numeric"
              placeholder="0 €"
              defaultValue={criteria.budgetMin ?? ''}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="filter-bedrooms" className={labelClass}>
              Chambres (min.)
            </label>
            <select
              id="filter-bedrooms"
              name="bedroomsMin"
              className={fieldClass}
              defaultValue={criteria.bedroomsMin ?? ''}
            >
              <option value="">Indifférent</option>
              {roomOptions.map((n) => (
                <option key={n} value={n}>
                  {n} et plus
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-area" className={labelClass}>
              Surface min.
            </label>
            <div className="relative">
              <input
                id="filter-area"
                name="areaMin"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Indifférente"
                defaultValue={criteria.areaMin ?? ''}
                className={cn(fieldClass, 'pr-10')}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-ink-400"
              >
                m²
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="filter-reference" className={labelClass}>
              Référence
            </label>
            <input
              id="filter-reference"
              name="reference"
              type="text"
              inputMode="numeric"
              placeholder="Ex. 5610382"
              defaultValue={criteria.reference ?? ''}
              className={fieldClass}
            />
          </div>
        </div>
      </details>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="group/btn inline-flex h-12 items-center justify-center gap-2.5 rounded-pill bg-linear-to-r from-brand-500 to-brand-600 px-7 text-[0.9375rem] font-semibold text-white shadow-card transition-all duration-300 ease-[var(--ease-out-soft)] hover:from-brand-600 hover:to-brand-700 hover:shadow-raised"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-4 fill-none stroke-current stroke-[1.8]"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="m10.5 10.5 3 3" strokeLinecap="round" />
          </svg>
          Affiner la recherche
        </button>

        {/* Un lien, pas un `reset` : il faut repartir d'une URL propre, pas
            seulement vider les champs affichés. */}
        <Link
          href="/offres"
          className="text-sm font-medium text-ink-500 transition-colors hover:text-brand-700"
        >
          Effacer les critères
        </Link>
      </div>
    </form>
  )
}
