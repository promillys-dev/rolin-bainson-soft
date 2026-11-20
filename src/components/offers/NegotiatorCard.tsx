import Link from 'next/link'
import { getNegotiator } from '@/data/negotiators'
import { isApiConfigured } from '@/lib/api/client'
import { getAgency } from '@/lib/agencies'

/**
 * Interlocuteur rattaché au bien.
 *
 * Le site précédent affichait le négociateur de l'annonce avec son téléphone
 * direct : c'est ce qui transformait une visite en appel. On le garde, en
 * rattachant aussi l'agence — le visiteur veut savoir où se présenter.
 *
 * Pas de portrait : les fiches réelles ne sont pas dans la livraison legacy,
 * et une photo inventée sur une page de prise de contact serait un mensonge
 * visible. Les initiales tiennent la place.
 *
 * Le négociateur est le premier de l'agence en back-office. Une agence sans
 * négociateur saisi présente son propre standard : le visiteur a toujours
 * quelqu'un à appeler.
 */
export async function NegotiatorCard({ agencySlug }: { agencySlug: string | undefined }) {
  const agency = agencySlug ? await getAgency(agencySlug) : undefined
  if (!agency) return null

  const agent = isApiConfigured ? agency.agents[0] : getNegotiator(agencySlug)
  const negotiator = {
    name: agent?.name || `Agence ${agency.shortName}`,
    role: agent?.role ?? (agent ? 'Négociateur' : 'Standard de l’agence'),
    phone: agent?.phone || agency.phone,
    email: agent?.email || agency.email,
  }

  const initials = negotiator.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <div className="rounded-panel border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold">Votre interlocuteur</h2>

      <div className="mt-5 flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-base font-semibold text-brand-700"
        >
          {initials}
        </span>
        <div>
          <p className="font-semibold text-ink-900">{negotiator.name}</p>
          <p className="text-sm text-ink-500">{negotiator.role}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-1.5 border-t border-line pt-4 text-[0.9375rem]">
        <a
          href={`tel:${negotiator.phone.replace(/\s/g, '')}`}
          className="font-medium text-brand-700 transition-colors hover:text-brand-800"
        >
          {negotiator.phone}
        </a>
        <a
          href={`mailto:${negotiator.email}`}
          className="text-ink-500 transition-colors hover:text-ink-900"
        >
          {negotiator.email}
        </a>
      </div>

      <p className="mt-4 text-sm text-ink-400">
        <Link
          href={`/agences/${agency.slug}`}
          className="font-medium text-ink-700 transition-colors hover:text-brand-700"
        >
          {agency.name}
        </Link>
        <br />
        {agency.address}, {agency.postalCode} {agency.city}
      </p>
    </div>
  )
}
