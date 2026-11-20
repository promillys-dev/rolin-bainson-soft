import Image from 'next/image'
import Link from 'next/link'
import { getAgencies } from '@/lib/agencies'
import { SECTOR_MAP, projectOnMap } from '@/config/sectorMap'
import { LOGO_MARK, markPath } from '@/lib/logoMark'
import { countByTransaction, displaySector, getAllProperties, propertyTitle } from '@/lib/properties'
import { cn, formatPrice } from '@/lib/utils'

/**
 * La carte du secteur et sa légende-filtre.
 *
 * Reprend le bloc de l'ancienne page d'accueil : une carte des biens et des
 * agences, et sous elle une légende qui servait de filtres — « N biens en
 * location », « N biens en vente », « N agences » — plus un « Reset ». Les
 * trois compteurs étaient de vrais `count()` sur les offres et les agences ;
 * ils le restent, calculés au rendu à partir des mêmes données que la
 * recherche.
 *
 * Les filtres sont des boutons radio, et c'est `:has()` sur la carte qui
 * masque les épingles écartées : aucun JavaScript, comme pour la recherche.
 * « Réinitialiser » est simplement le choix « tout afficher ».
 *
 * Chaque épingle de bien est un lien vers l'annonce, et montre au survol —
 * ou au focus clavier — son titre, son quartier et son prix. Les agences
 * portent le monogramme du logo et leur nom.
 */

type Kind = 'location' | 'vente' | 'agences'

/**
 * Les classes qui retirent une épingle quand un autre filtre est choisi.
 * Écrites en toutes lettres : Tailwind ne voit pas les classes composées.
 */
const HIDDEN_UNLESS: Record<Kind, string> = {
  location:
    'group-has-[#map-vente:checked]/map:pointer-events-none group-has-[#map-vente:checked]/map:scale-0 group-has-[#map-vente:checked]/map:opacity-0 group-has-[#map-agences:checked]/map:pointer-events-none group-has-[#map-agences:checked]/map:scale-0 group-has-[#map-agences:checked]/map:opacity-0',
  vente:
    'group-has-[#map-location:checked]/map:pointer-events-none group-has-[#map-location:checked]/map:scale-0 group-has-[#map-location:checked]/map:opacity-0 group-has-[#map-agences:checked]/map:pointer-events-none group-has-[#map-agences:checked]/map:scale-0 group-has-[#map-agences:checked]/map:opacity-0',
  agences:
    'group-has-[#map-location:checked]/map:pointer-events-none group-has-[#map-location:checked]/map:scale-0 group-has-[#map-location:checked]/map:opacity-0 group-has-[#map-vente:checked]/map:pointer-events-none group-has-[#map-vente:checked]/map:scale-0 group-has-[#map-vente:checked]/map:opacity-0',
}

/** Le monogramme, en tout petit, pour les épingles d'agence. */
const MINI_MARK = (['ink', 'brand'] as const).map((id) => ({
  id,
  d: markPath(LOGO_MARK[id], (point) => point),
}))

/**
 * Le siège et l'agence Charpennes sont à deux cents mètres l'un de l'autre :
 * à cette échelle leurs épingles se recouvrent. On les écarte de quelques
 * pixels, de part et d'autre de leur position réelle, et leurs noms partent
 * chacun de son côté.
 */
const AGENCY_NUDGE: Record<string, { dx: number; dy: number; side: 'left' | 'right' }> = {
  'rolin-bainson-sa': { dx: 16, dy: -14, side: 'right' },
  'agence-charpennes': { dx: -16, dy: 14, side: 'left' },
}

const pinDelay = (index: number) =>
  ({ '--scene-anim': `scene-pop 420ms var(--ease-out-soft) ${250 + index * 45}ms both` }) as React.CSSProperties

export async function SectorMap() {
  const [all, rentals, sales, agencies] = await Promise.all([
    getAllProperties(),
    countByTransaction('location'),
    countByTransaction('vente'),
    getAgencies(),
  ])
  const properties = all.filter((property) => property.location.coordinates)
  const placedAgencies = agencies.filter((agency) => agency.coordinates)

  const filters: { id: string; kind: Kind; count: number; label: string }[] = [
    {
      id: 'map-location',
      kind: 'location',
      count: rentals,
      label: 'biens en location',
    },
    {
      id: 'map-vente',
      kind: 'vente',
      count: sales,
      label: 'biens en vente',
    },
    {
      id: 'map-agences',
      kind: 'agences',
      count: agencies.length,
      label: 'agences',
    },
  ]

  return (
    <div className="group/map">
      <div className="gilt-edge relative overflow-hidden rounded-panel border border-line bg-[#f6efe6] shadow-float after:opacity-100">
        <div className="relative aspect-[1800/1125]">
          <Image
            src={SECTOR_MAP.src}
            alt="Plan de Lyon et Villeurbanne"
            fill
            sizes="(min-width: 1024px) 56rem, 100vw"
            className="object-cover"
          />

          {/* Un voile sur les bords : le plan se fond dans la carte au lieu
              de s'arrêter net, et le regard reste au centre du secteur. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_45%,transparent_55%,rgb(246_239_230/0.85)_100%)]"
          />

          <p className="pointer-events-none absolute top-4 left-4 inline-flex items-center gap-2 rounded-pill bg-white/85 px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-700 shadow-card backdrop-blur">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-500" />
            Lyon · Villeurbanne
          </p>

          {properties.map((property, index) => {
            const { lat, lng } = property.location.coordinates!
            const at = projectOnMap(lat, lng)
            const forRent = property.transaction === 'location'
            // L'étiquette passe sous l'épingle quand celle-ci est trop près
            // du haut : au-dessus, elle sortirait de la carte.
            const below = at.y < 28
            return (
              <Link
                key={property.reference}
                href={`/offres/${property.reference}/${property.slug}`}
                className={cn(
                  'group/pin absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] duration-300 ease-[var(--ease-out-soft)] hover:z-30 focus-visible:z-30 focus-visible:outline-none',
                  HIDDEN_UNLESS[property.transaction],
                )}
                style={{ left: `${at.x}%`, top: `${at.y}%` }}
              >
                <span
                  data-scene-piece=""
                  style={pinDelay(index)}
                  className={cn(
                    'block size-3.5 rounded-full shadow-[0_2px_6px_rgb(28_25_23/0.35)] ring-[3px] ring-white transition-transform duration-300 group-hover/pin:scale-125 group-focus-visible/pin:scale-125',
                    forRent ? 'bg-brand-500' : 'bg-ink-900',
                  )}
                />
                <span
                  className={cn(
                    'pointer-events-none absolute left-1/2 w-max max-w-56 -translate-x-1/2 rounded-card bg-white px-3 py-2 text-left opacity-0 shadow-raised ring-1 ring-line transition-all duration-300 ease-[var(--ease-out-soft)] group-hover/pin:opacity-100 group-focus-visible/pin:opacity-100',
                    below
                      ? 'top-full mt-2.5 -translate-y-1 group-hover/pin:translate-y-0 group-focus-visible/pin:translate-y-0'
                      : 'bottom-full mb-2.5 translate-y-1 group-hover/pin:translate-y-0 group-focus-visible/pin:translate-y-0',
                  )}
                >
                  <span className="block text-[0.6875rem] font-semibold tracking-wide text-brand-700 uppercase">
                    {forRent ? 'Location' : 'Vente'} · {displaySector(property)}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold text-ink-900">
                    {propertyTitle(property)}
                  </span>
                  <span className="block text-xs text-ink-500">
                    {formatPrice(property.price.amount)}
                    {forRent ? ' / mois' : ''}
                  </span>
                </span>
              </Link>
            )
          })}

          {placedAgencies.map((agency, index) => {
            const at = projectOnMap(agency.coordinates!.lat, agency.coordinates!.lng)
            const nudge = AGENCY_NUDGE[agency.slug] ?? { dx: 0, dy: 0, side: 'right' }
            return (
              <Link
                key={agency.slug}
                href={`/agences/${agency.slug}`}
                className={cn(
                  'group/pin absolute z-20 transition-[opacity,scale] duration-300 ease-[var(--ease-out-soft)] focus-visible:outline-none',
                  HIDDEN_UNLESS.agences,
                )}
                style={{
                  left: `${at.x}%`,
                  top: `${at.y}%`,
                  translate: `calc(-50% + ${nudge.dx}px) calc(-50% + ${nudge.dy}px)`,
                }}
              >
                <span
                  data-scene-piece=""
                  style={pinDelay(properties.length + index)}
                  className="relative grid size-8 place-items-center rounded-[0.6rem] bg-white shadow-raised ring-1 ring-brand-300 transition-transform duration-300 group-hover/pin:-translate-y-0.5"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -inset-1 animate-ping rounded-[0.8rem] bg-brand-400/25"
                  />
                  <svg aria-hidden="true" viewBox="10 19 62 81" className="relative h-5 w-auto">
                    {MINI_MARK.map((panel) => (
                      <path
                        key={panel.id}
                        d={panel.d}
                        fill={panel.id === 'brand' ? 'var(--color-brand-500)' : 'var(--color-ink-900)'}
                      />
                    ))}
                  </svg>
                </span>
                {/* Le nom de l'agence est toujours affiché : il n'y en a que
                    trois, et ce sont elles qui situent le reste. */}
                <span
                  className={cn(
                    'pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-pill bg-ink-900 px-2.5 py-1 text-[0.6875rem] font-semibold whitespace-nowrap text-white shadow-card',
                    nudge.side === 'right' ? 'left-full ml-2' : 'right-full mr-2',
                  )}
                >
                  {agency.shortName}
                </span>
              </Link>
            )
          })}

          <p className="pointer-events-none absolute right-3 bottom-2 text-[0.625rem] text-ink-400">
            {SECTOR_MAP.attribution}
          </p>
        </div>
      </div>

      {/* La légende-filtre, sous la carte comme sur l'ancien site. */}
      <fieldset className="mt-4 flex flex-wrap items-center gap-2.5">
        <legend className="sr-only">Filtrer la carte</legend>
        {filters.map((filter) => (
          <label
            key={filter.id}
            className="inline-flex cursor-pointer items-center gap-2.5 rounded-pill bg-white px-4 py-2 text-sm text-ink-500 shadow-card ring-1 ring-line transition-colors duration-300 select-none hover:ring-brand-300 has-[:checked]:bg-ink-900 has-[:checked]:text-white has-[:checked]:ring-ink-900 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500"
          >
            <input type="radio" name="map-filter" id={filter.id} className="sr-only" />
            <Dot kind={filter.kind} />
            <span>
              <strong className="font-display text-base font-semibold">{filter.count}</strong>{' '}
              {filter.label}
            </span>
          </label>
        ))}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-pill px-3.5 py-2 text-sm font-medium text-brand-700 transition-colors duration-300 select-none hover:text-brand-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500 group-has-[#map-all:checked]/map:text-ink-300">
          <input type="radio" name="map-filter" id="map-all" defaultChecked className="sr-only" />
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-4 fill-none stroke-current stroke-[1.7]"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9M2.5 2.5v2.8h2.8" />
          </svg>
          Réinitialiser
        </label>
      </fieldset>
    </div>
  )
}

function Dot({ kind }: { kind: Kind }) {
  if (kind === 'agences') {
    return (
      <svg aria-hidden="true" viewBox="10 19 62 81" className="h-3.5 w-auto">
        {MINI_MARK.map((panel) => (
          <path
            key={panel.id}
            d={panel.d}
            fill={panel.id === 'brand' ? 'var(--color-brand-500)' : 'currentColor'}
          />
        ))}
      </svg>
    )
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'size-2.5 rounded-full ring-2 ring-white',
        kind === 'location' ? 'bg-brand-500' : 'bg-ink-900',
      )}
    />
  )
}
