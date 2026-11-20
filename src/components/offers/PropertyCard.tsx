import Link from 'next/link'
import { featureBadges } from '@/components/offers/PropertyIcons'
import { PropertyPhoto } from '@/components/offers/PropertyPhoto'
import { ArrowIcon } from '@/components/ui/Button'
import {
  displaySector,
  priceMention,
  propertyTitle,
  truncate,
} from '@/lib/properties'
import { formatPrice, formatRent } from '@/lib/utils'
import type { Property } from '@/types/property'

/**
 * Carte d'annonce.
 *
 * Reprend ce que l'ancienne liste affichait — photo, titre, secteur, prix,
 * début du descriptif, surface, pictogrammes — dans la forme des cartes de
 * l'accueil : grand rayon, badge en surimpression, élévation au survol.
 *
 * Le titre est calculé (`propertyTitle`), jamais celui stocké dans le flux.
 * Le prix porte sa mention réglementaire : F.A.I. en vente, C.C. en location.
 */
export function PropertyCard({ property }: { property: Property }) {
  const href = `/offres/${property.reference}/${property.slug}`
  const badges = featureBadges(property.features).slice(0, 5)
  const isRental = property.transaction === 'location'

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-panel border border-line bg-surface transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-brand-200 hover:shadow-raised sm:flex-row">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden sm:aspect-auto sm:w-64 lg:w-72">
        <PropertyPhoto property={property} sizes="(min-width: 640px) 18rem, 100vw" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-pill bg-ink-900/85 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] text-white uppercase backdrop-blur-sm">
            {isRental ? 'Location' : 'Vente'}
          </span>
          {property.isExclusive ? (
            <span className="rounded-pill bg-brand-500 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] text-white uppercase">
              Exclusivité
            </span>
          ) : null}
          {property.isLifeAnnuity ? (
            <span className="rounded-pill bg-white/90 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] text-ink-900 uppercase">
              Viager
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-lg leading-snug font-semibold text-ink-900">
            {/* Le lien couvre toute la carte : le reste du contenu n'est pas
                cliquable séparément, donc un seul point d'entrée au clavier. */}
            <Link href={href} className="after:absolute after:inset-0">
              {propertyTitle(property)}
            </Link>
          </h3>
          <p className="text-right">
            <span className="text-lg font-semibold text-brand-700">
              {isRental ? formatRent(property.price.amount) : formatPrice(property.price.amount)}
            </span>
            <span className="ml-1.5 text-xs text-ink-400">{priceMention(property.transaction)}</span>
          </p>
        </div>

        <p className="mt-1 text-sm text-ink-400">
          {displaySector(property)} · Réf. {property.reference}
        </p>

        {property.description ? (
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-500">
            {truncate(property.description, 170)}
          </p>
        ) : null}

        <ul className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-sm text-ink-500">
          {badges.map(({ key, label, Icon }) => (
            <li key={key} className="inline-flex items-center gap-1.5">
              <Icon className="size-4 shrink-0 text-ink-300" />
              {label}
            </li>
          ))}
        </ul>

        <p className="mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-ink-900 transition-colors group-hover:text-brand-700">
          Voir le bien
          <ArrowIcon className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1" />
        </p>
      </div>
    </article>
  )
}
