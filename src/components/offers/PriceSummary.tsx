import { ButtonLink } from '@/components/ui/Button'
import { formatLongDate } from '@/lib/dates'
import { priceMention } from '@/lib/properties'
import { formatPrice, formatRent } from '@/lib/utils'
import type { Property } from '@/types/property'

/**
 * Encart prix, collant au défilement.
 *
 * Deux détails des encarts du site précédent, repris parce qu'ils répondent à
 * des questions réelles :
 *  - en location, le loyer affiché est le loyer CHARGES COMPRISES — c'est
 *    celui que le visiteur compare et celui sur lequel porte le filtre budget
 *    (règle métier n° 4). Le hors-charges et la provision sont détaillés en
 *    dessous, jamais à la place ;
 *  - en vente, le prix est F.A.I. et le net vendeur est dérivé des honoraires,
 *    pour que l'acquéreur sache ce qu'il paie et à qui.
 */

function Row({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5">
      <dt className="text-sm text-ink-500">
        {label}
        {hint ? <span className="mt-0.5 block text-xs text-ink-400">{hint}</span> : null}
      </dt>
      <dd className="text-[0.9375rem] font-medium text-ink-900">{value}</dd>
    </div>
  )
}

export function PriceSummary({ property }: { property: Property }) {
  const { price, transaction } = property
  const isRental = transaction === 'location'

  const rows: { label: string; value: string; hint?: string }[] = []

  if (isRental) {
    if (price.excludingCharges !== undefined) {
      rows.push({ label: 'Loyer hors charges', value: formatPrice(price.excludingCharges) })
    }
    if (price.charges !== undefined) {
      rows.push({
        label: 'Provision pour charges',
        value: formatPrice(price.charges),
        hint: 'Avec régularisation annuelle',
      })
    }
    if (price.fees !== undefined) {
      rows.push({
        label: 'Honoraires à la charge du locataire',
        value: `${formatPrice(price.fees)} TTC`,
        hint: "Visite, constitution du dossier, rédaction du bail et état des lieux",
      })
    }
    if (price.deposit !== undefined) {
      rows.push({ label: 'Dépôt de garantie', value: formatPrice(price.deposit) })
    }
  } else {
    if (price.fees !== undefined) {
      rows.push({
        label: "Honoraires à la charge de l'acquéreur",
        value: `${formatPrice(price.fees)} TTC`,
      })
      rows.push({
        label: 'Prix net vendeur',
        value: formatPrice(price.amount - price.fees),
      })
    }
  }

  return (
    <div className="rounded-panel border border-line bg-surface p-6 shadow-card">
      <p className="text-xs font-semibold tracking-[0.12em] text-ink-400 uppercase">
        {isRental ? 'Loyer mensuel' : 'Prix de vente'}
      </p>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
        <span className="font-display text-3xl font-semibold tracking-tight text-ink-900">
          {isRental ? formatRent(price.amount) : formatPrice(price.amount)}
        </span>
        <span className="text-sm text-ink-400">{priceMention(transaction)}</span>
      </p>

      {rows.length > 0 ? (
        <dl className="mt-5 divide-y divide-line border-t border-line pt-2">
          {rows.map((row) => (
            <Row key={row.label} {...row} />
          ))}
        </dl>
      ) : null}

      {property.availableAt ? (
        <p className="mt-5 rounded-card bg-surface-muted px-3.5 py-2.5 text-sm text-ink-500">
          Disponible à partir du{' '}
          <strong className="font-semibold text-ink-900">
            {formatLongDate(property.availableAt)}
          </strong>
        </p>
      ) : null}

      <div className="mt-6 grid gap-2.5">
        <ButtonLink href={`/contact?bien=${property.reference}`} className="w-full">
          Demander une visite
        </ButtonLink>
        {isRental ? (
          <ButtonLink href="/deposer-votre-dossier" variant="outline" className="w-full">
            Déposer mon dossier
          </ButtonLink>
        ) : (
          <ButtonLink href="/etre-rappele" variant="outline" className="w-full">
            Être rappelé
          </ButtonLink>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-400">
        Mandat n° {property.mandateNumber ?? property.reference} · Les informations de cette annonce sont données à titre
        indicatif et ne constituent pas un élément contractuel.
      </p>
    </div>
  )
}
