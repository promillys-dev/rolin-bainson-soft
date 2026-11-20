import Image from 'next/image'
import Link from 'next/link'
import { ArrowLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getAgencies } from '@/lib/agencies'

/**
 * Les trois agences, avec leurs coordonnées réelles.
 *
 * L'ancien site les listait déjà en pied de page sur toutes les pages : c'est
 * une information que ses visiteurs cherchent souvent, elle reste donc
 * accessible dès l'accueil.
 */
/** `rule` et `width` : voir `Activities`. */
export async function AgenciesTeaser({
  rule,
  width = 'default',
}: {
  rule?: boolean
  width?: 'default' | 'wide'
} = {}) {
  const agencies = await getAgencies()
  return (
    <Container as="section" width={width} className="py-6 lg:py-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <SectionHeading
            rule={rule}
            eyebrow="Nous rencontrer"
            title="Trois agences, à deux pas de vos immeubles"
            description="Nos équipes vous reçoivent aux horaires d’ouverture, sans rendez-vous."
          />
        </Reveal>
        <Reveal delay={80}>
          <ArrowLink href="/agences">Toutes les agences</ArrowLink>
        </Reveal>
      </div>

      <ul className="mt-10 grid gap-5 lg:grid-cols-3">
        {agencies.map((agency, index) => (
          <Reveal as="li" key={agency.slug} delay={index * 80} className="h-full">
            <div className="gilt-edge group flex h-full flex-col overflow-hidden rounded-panel border border-line bg-surface transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-raised">
              <div className="relative aspect-16/9 overflow-hidden">
                <Image
                  src={agency.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 22rem, 100vw"
                  className="media-zoom object-cover"
                />
                {/* Dégradé en pied : la ville du nom se détache de l'image. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-ink-900/55 to-transparent"
                />
                <span className="absolute bottom-3 left-4 text-xs font-semibold tracking-wide text-white">
                  {agency.city}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg leading-snug font-semibold">
                <Link href={`/agences/${agency.slug}`} className="transition-colors hover:text-brand-700">
                  {agency.name}
                </Link>
              </h3>

              <ul className="mt-3 flex flex-wrap gap-1.5">
                {agency.activities.map((activity) => (
                  <li
                    key={activity}
                    className="rounded-pill bg-surface-sunken px-2.5 py-1 text-[0.6875rem] font-medium text-ink-500"
                  >
                    {activity}
                  </li>
                ))}
              </ul>

              <address className="mt-4 flex-1 text-sm leading-relaxed text-ink-500 not-italic">
                {agency.address}
                <br />
                {agency.postalCode} {agency.city}
              </address>

              {agency.openingHours.length > 0 ? (
                <ul className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink-400">
                  {agency.openingHours.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <a
                  href={`tel:${agency.phone.replace(/\s/g, '')}`}
                  className="font-medium text-brand-700 transition-colors hover:text-brand-800"
                >
                  {agency.phone}
                </a>
                <a
                  href={`mailto:${agency.email}`}
                  className="text-ink-400 transition-colors hover:text-ink-900"
                >
                  {agency.email}
                </a>
              </div>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Container>
  )
}
