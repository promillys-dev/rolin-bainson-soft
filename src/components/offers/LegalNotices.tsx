import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Property, RentControl } from '@/types/property'

/**
 * Mentions obligatoires d'une annonce.
 *
 * Trois obligations distinctes, regroupées ici parce qu'elles partagent la
 * même nature : elles ne sont pas rédactionnelles, elles sont dues. Les
 * omettre expose l'agence, pas le site. Elles sont donc des composants, avec
 * leurs propres données, et non du texte glissé dans la description.
 */

/**
 * Encadrement des loyers.
 *
 * Lyon et Villeurbanne sont en zone encadrée depuis novembre 2021. L'annonce
 * doit afficher le loyer de base, le loyer de référence majoré et, s'il y en
 * a un, le complément de loyer — ce dernier devant être justifié par une
 * caractéristique du logement.
 */
export function RentControlNotice({ rentControl }: { rentControl: RentControl | undefined }) {
  if (!rentControl?.applies) return null

  const rows: readonly { label: string; value: number | undefined; hint?: string }[] = [
    { label: 'Loyer de base mensuel hors charges', value: rentControl.baseRent },
    {
      label: 'Loyer de référence majoré',
      value: rentControl.referenceRentIncreased,
      hint: 'Plafond fixé par arrêté préfectoral pour ce secteur et ce type de logement',
    },
    {
      label: 'Complément de loyer',
      value: rentControl.supplement,
      hint: 'Justifié par les caractéristiques de confort ou de localisation du logement',
    },
  ]

  return (
    <section className="rounded-panel border border-brand-200 bg-brand-50 p-6">
      <h2 className="text-lg font-semibold">Encadrement des loyers</h2>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
        Ce logement est situé en zone d’encadrement des loyers. Les montants ci-dessous sont
        affichés au titre de l’article 140 de la loi ÉLAN.
      </p>

      <dl className="mt-5 divide-y divide-brand-200">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
            <dt className="max-w-sm text-sm text-ink-700">
              {row.label}
              {row.hint ? <span className="mt-0.5 block text-xs text-ink-400">{row.hint}</span> : null}
            </dt>
            <dd className="text-[0.9375rem] font-semibold text-ink-900">
              {row.value !== undefined ? formatPrice(row.value) : 'Non applicable'}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/**
 * Information sur les risques — Géorisques.
 *
 * L'état des risques et pollutions est obligatoire dès l'annonce depuis
 * janvier 2023 : il faut mentionner que l'information est disponible et
 * renvoyer vers le site de l'État. Le lien est générique faute de coordonnées
 * de parcelle ; une fois les biens géocodés, il pourra viser la commune.
 */
export function GeorisquesNotice({ property }: { property: Property }) {
  const { postalCode, city } = property.location

  return (
    <section className="rounded-panel border border-line bg-surface-muted p-6">
      <h2 className="text-lg font-semibold">Information sur les risques</h2>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
        Les informations sur les risques auxquels ce bien est exposé — naturels, miniers,
        technologiques, sismiques, radon et pollution des sols — sont disponibles sur le site
        Géorisques. L’état des risques et pollutions vous sera remis avant toute signature.
      </p>
      <a
        href="https://www.georisques.gouv.fr/"
        target="_blank"
        rel="noreferrer noopener"
        className="group/btn mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-brand-700 transition-colors hover:text-brand-800"
      >
        Consulter georisques.gouv.fr pour {postalCode} {city}
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 fill-none stroke-current stroke-[1.6]">
          <path d="M6 3h7v7M13 3 5 11M11 9v4H3V5h4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="sr-only">(nouvel onglet)</span>
      </a>
    </section>
  )
}

/**
 * Barème d'honoraires.
 *
 * L'arrêté du 10 janvier 2017 impose d'indiquer, sur chaque annonce, à qui
 * incombent les honoraires et leur montant TTC. En location s'y ajoute le
 * plafond réglementaire pour l'état des lieux. Le renvoi vers `/tarifs` est
 * lui aussi obligatoire : le barème complet doit être consultable.
 */
export function FeesNotice({ property }: { property: Property }) {
  const isRental = property.transaction === 'location'
  const fees = property.price.fees

  return (
    <section className="rounded-panel border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold">Honoraires</h2>

      {fees !== undefined ? (
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
          Honoraires à la charge {isRental ? 'du locataire' : "de l'acquéreur"} :{' '}
          <strong className="font-semibold text-ink-900">{formatPrice(fees)} TTC</strong>
          {isRental
            ? ", dont la part relative à l'état des lieux, dans la limite des plafonds réglementaires."
            : ", soit un prix de présentation net vendeur de " +
              `${formatPrice(property.price.amount - fees)}.`}
        </p>
      ) : (
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
          Honoraires à la charge du {isRental ? 'bailleur' : 'vendeur'}.
        </p>
      )}

      <Link
        href="/tarifs"
        className="mt-4 inline-block text-[0.9375rem] font-medium text-brand-700 transition-colors hover:text-brand-800"
      >
        Voir le barème complet des honoraires
      </Link>
    </section>
  )
}
