import { roomOptions } from '@/config/search'
import { getSearchOptions } from '@/lib/referenceData'
import { cn } from '@/lib/utils'

/**
 * Formulaire de recherche.
 *
 * Toujours un `<form method="get">` sans JavaScript : il fonctionne script
 * désactivé et produit une URL partageable et indexable. Les deux
 * interactions — bascule Location / Achat et « plus de critères » — sont
 * obtenues en CSS pur, avec des boutons radio et un `<details>`. Aucun octet
 * de JavaScript sur le composant le plus important de la page.
 *
 * Reprend les critères réellement filtrés par l'ancien site, avec les trois
 * corrections issues de l'audit :
 *  - le nombre de pièces est un MINIMUM (le legacy faisait une égalité stricte,
 *    donc « 3 pièces » excluait un 4 pièces) ;
 *  - le budget s'applique quel que soit le type de transaction (le legacy
 *    l'ignorait silencieusement si vente/location n'était pas choisi) ;
 *  - le secteur est une liste fermée, au lieu d'un `LIKE %…%` sur le nom de
 *    ville qui faisait remonter n'importe quelle chaîne contenante.
 *
 * Forme : une carte d'un blanc franc, cernée du liseré doré de la bannière,
 * le bouton posé au pied sous le filet du rail. Le titre
 * et le compte d'annonces suivent l'onglet coché — toujours sans script, par
 * `:has()` sur la section.
 */

const fieldClass =
  'h-12 w-full rounded-card border border-line bg-surface-warm px-3.5 text-[0.9375rem] text-ink-900 transition-colors duration-200 placeholder:text-ink-300 hover:border-line-strong focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:outline-none'

const labelClass = 'mb-1.5 block text-[0.6875rem] font-semibold tracking-[0.14em] text-ink-400 uppercase'

/** Onglet construit sur un radio : l'état coché pilote le style, sans JS. */
function TransactionTab({
  id,
  value,
  label,
  defaultChecked,
  peer,
}: {
  id: string
  value: string
  label: string
  defaultChecked?: boolean
  peer: string
}) {
  return (
    <>
      <input
        type="radio"
        name="transaction"
        id={id}
        value={value}
        defaultChecked={defaultChecked}
        className={cn('sr-only', peer)}
      />
      <label
        htmlFor={id}
        className={cn(
          'flex-1 cursor-pointer rounded-pill px-5 py-2 text-center text-[0.9375rem] font-medium text-ink-500 transition-all duration-300 ease-[var(--ease-out-soft)] select-none',
          'hover:text-ink-900',
          // L'étiquette suit l'état de son propre radio.
          peer === 'peer/location'
            ? 'peer-checked/location:bg-brand-500 peer-checked/location:text-white peer-checked/location:shadow-card'
            : 'peer-checked/vente:bg-brand-500 peer-checked/vente:text-white peer-checked/vente:shadow-card',
        )}
      >
        {label}
      </label>
    </>
  )
}

export async function SearchForm({
  counts,
  className,
}: {
  counts: { location: number; vente: number }
  className?: string
}) {
  // Types et secteurs : ceux du référentiel du back-office.
  const { kinds: propertyKinds, sectors } = await getSearchOptions()

  return (
    <form
      method="get"
      action="/offres"
      aria-labelledby="search-title"
      className={cn(
        // Le liseré doré est toujours visible ici, pas seulement au survol :
        // c'est lui qui détache la carte blanche du fond crème.
        'gilt-edge relative isolate flex flex-col overflow-hidden rounded-panel bg-white p-6 text-ink-900 shadow-float after:opacity-100 sm:p-8',
        className,
      )}
    >
      <p className="inline-flex items-center gap-2 self-start rounded-pill bg-brand-50 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-brand-700 uppercase ring-1 ring-brand-200 ring-inset">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-500" />
        Recherche
      </p>

      {/* Le titre suit l'onglet coché. */}
      <h2
        id="search-title"
        className="mt-5 font-display text-[2rem] leading-[1.02] font-semibold tracking-[-0.03em] sm:text-[2.35rem]"
      >
        <span className="group-has-[#tab-vente:checked]/search:hidden">
          Trouver une <span className="text-brand-500">location</span>
        </span>
        <span className="hidden group-has-[#tab-vente:checked]/search:inline">
          Trouver un bien <span className="text-brand-500">à acheter</span>
        </span>
      </h2>
      <p className="mt-2 text-sm text-ink-500">
        <span className="group-has-[#tab-vente:checked]/search:hidden">
          {counts.location} appartements et parkings à louer à Lyon et Villeurbanne.
        </span>
        <span className="hidden group-has-[#tab-vente:checked]/search:inline">
          {counts.vente} biens à vendre à Lyon et Villeurbanne.
        </span>
      </p>

      <div className="mt-6 flex items-center gap-1 rounded-pill bg-surface-sunken p-1 ring-1 ring-line">
        <TransactionTab
          id="tab-location"
          value="location"
          label="Location"
          peer="peer/location"
          defaultChecked
        />
        <TransactionTab id="tab-vente" value="vente" label="Achat" peer="peer/vente" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="search-localisation" className={labelClass}>
            Secteur
          </label>
          <select id="search-localisation" name="localisation" className={fieldClass} defaultValue="">
            <option value="">Tous les secteurs</option>
            {sectors.map((sector) => (
              <option key={sector.value} value={sector.value}>
                {sector.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-kind" className={labelClass}>
            Type de bien
          </label>
          <select id="search-kind" name="kind" className={fieldClass} defaultValue="">
            <option value="">Tous les types</option>
            {propertyKinds.map((kind) => (
              <option key={kind.value} value={kind.value}>
                {kind.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-pieces" className={labelClass}>
            Pièces (min.)
          </label>
          <select id="search-pieces" name="piecesMin" className={fieldClass} defaultValue="">
            <option value="">Indifférent</option>
            {roomOptions.map((n) => (
              <option key={n} value={n}>
                {n} et plus
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="search-budget" className={labelClass}>
            Budget max.
          </label>
          <div className="relative">
            <input
              id="search-budget"
              name="budgetMax"
              type="number"
              min={0}
              step={50}
              inputMode="numeric"
              placeholder="Sans limite"
              className={cn(fieldClass, 'pr-9')}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-ink-400"
            >
              €
            </span>
          </div>
        </div>
      </div>

      {/* Critères avancés : un <details> natif, donc dépliable sans JS. */}
      <details className="group mt-4">
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

        <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
          <div>
            <label htmlFor="search-budget-min" className={labelClass}>
              Budget min.
            </label>
            <input
              id="search-budget-min"
              name="budgetMin"
              type="number"
              min={0}
              step={50}
              inputMode="numeric"
              placeholder="0 €"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="search-bedrooms" className={labelClass}>
              Chambres (min.)
            </label>
            <select id="search-bedrooms" name="bedroomsMin" className={fieldClass} defaultValue="">
              <option value="">Indifférent</option>
              {roomOptions.map((n) => (
                <option key={n} value={n}>
                  {n} et plus
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="search-area" className={labelClass}>
              Surface min.
            </label>
            <div className="relative">
              <input
                id="search-area"
                name="areaMin"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Indifférente"
                className={cn(fieldClass, 'pr-10')}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-ink-400"
              >
                m²
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="search-reference" className={labelClass}>
              Référence
            </label>
            <input
              id="search-reference"
              name="reference"
              type="text"
              inputMode="numeric"
              placeholder="Ex. 5610382"
              className={fieldClass}
            />
          </div>
        </div>
      </details>

      {/* Le pied du bloc : le filet du rail de la bannière, puis le bouton.
          `mt-auto` le tient en bas quand le bloc est étiré à la hauteur de la
          scène voisine. */}
      <div className="mt-auto pt-8">
        <div aria-hidden="true" className="relative mb-6 h-px bg-line">
          <span
            data-rail-travel
            className="absolute top-1/2 h-[3px] w-10 rounded-full bg-linear-to-r from-brand-500 via-[#f6c76a] to-brand-400 shadow-[0_0_14px_3px_rgb(246_199_106/0.45)]"
            style={{ animation: 'rail-travel 2600ms var(--ease-out-soft) 600ms infinite both' }}
          />
        </div>

        <button
          type="submit"
          className="group/btn inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-pill bg-linear-to-r from-brand-500 to-brand-600 text-base font-semibold text-white shadow-[0_10px_30px_-12px_rgb(229_112_58/0.8)] transition-all duration-300 ease-[var(--ease-out-soft)] hover:from-brand-400 hover:to-brand-600 hover:shadow-[0_14px_38px_-12px_rgb(229_112_58/0.95)]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-4.5 fill-none stroke-current stroke-[1.8]"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="m10.5 10.5 3 3" strokeLinecap="round" />
          </svg>
          Lancer la recherche
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-4 fill-none stroke-current stroke-[1.8] transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover/btn:translate-x-1"
          >
            <path d="M3 8h10m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </form>
  )
}
