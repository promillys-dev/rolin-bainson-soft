import { pageSizeOptions, sortOptions } from '@/lib/properties'
import { filterCriteriaEntries } from '@/lib/searchParams'
import type { PropertySearchParams } from '@/types/property'

/**
 * Barre de tri et de densité d'affichage.
 *
 * Le site précédent proposait un tri par prix, un tri par surface et un nombre
 * de résultats par page (`filtre_nbpage`, défaut 10) : les trois sont repris.
 *
 * Un `<form method="get">` doublé de champs cachés qui reconduisent les
 * critères de recherche en cours — sans eux, trier reviendrait à repartir du
 * catalogue entier. Le bouton « Appliquer » est nécessaire : sans JavaScript,
 * changer un `<select>` ne soumet rien. Il disparaît visuellement dès que le
 * formulaire n'a pas le focus, ce qui garde la barre légère sans jamais le
 * retirer du flux ni du parcours clavier.
 */

const selectClass =
  'h-10 rounded-card border border-line bg-surface px-3 text-sm text-ink-900 transition-colors hover:border-line-strong focus:border-brand-500 focus:outline-none'

export function SortBar({
  criteria,
  pageSize,
  total,
}: {
  criteria: PropertySearchParams
  pageSize: number
  total: number
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-[0.9375rem] text-ink-500">
        <strong className="font-semibold text-ink-900">{total}</strong>{' '}
        {total > 1 ? 'biens correspondent' : 'bien correspond'} à votre recherche
      </p>

      <form method="get" action="/offres" className="group flex flex-wrap items-center gap-2">
        {filterCriteriaEntries(criteria).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}

        <label htmlFor="sort" className="text-sm text-ink-500">
          Trier par
        </label>
        <select
          id="sort"
          name="sort"
          className={selectClass}
          defaultValue={criteria.sort ?? 'recent'}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="par-page" className="sr-only">
          Nombre de biens par page
        </label>
        <select id="par-page" name="parPage" className={selectClass} defaultValue={pageSize}>
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} par page
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="h-10 rounded-pill border border-line-strong px-4 text-sm font-medium text-ink-800 opacity-60 transition-all duration-200 hover:border-ink-900 hover:bg-ink-900 hover:text-white hover:opacity-100 focus-visible:opacity-100 group-focus-within:opacity-100"
        >
          Appliquer
        </button>
      </form>
    </div>
  )
}
