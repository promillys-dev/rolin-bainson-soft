import Image from 'next/image'
import Link from 'next/link'
import { ArrowIcon } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/config/site'

/**
 * Les trois appels à l'action de l'ancienne page d'accueil : accès client,
 * dépôt de dossier, recrutement. Structure conservée parce qu'elle correspond
 * aux trois demandes réelles des visiteurs, et textes conservés aussi — ce
 * sont ceux que la maison avait écrits dans `lib_textes_parametrables`.
 *
 * Forme : les cartes teintées à badge de cloudacc, une teinte par carte.
 */

type Card = {
  title: string
  description: string
  href: string
  cta: string
  external?: boolean
  tint: string
  badge: string
  icon: 'key' | 'folder' | 'users'
  /** Photographie en fond de carte, estompée vers le texte. */
  image: string
}

const cards: readonly Card[] = [
  {
    title: 'Accès client',
    description:
      'Consultez votre compte, payez en ligne, déclarez un sinistre et retrouvez tous les documents vous concernant dans votre espace sécurisé.',
    href: site.clientAreaUrl,
    cta: 'Ouvrir mon espace',
    external: true,
    tint: 'bg-tint-sand',
    badge: 'Locataires · Copropriétaires',
    icon: 'key',
    image: '/brand/news-2.jpg',
  },
  {
    title: 'Déposer votre dossier',
    description:
      'Constituez votre dossier de locataire en ligne, à votre rythme, avec un accompagnement étape par étape.',
    href: '/deposer-votre-dossier',
    cta: 'En savoir plus',
    tint: 'bg-tint-clay',
    badge: 'Candidats locataires',
    icon: 'folder',
    image: '/brand/news-4.jpg',
  },
  {
    title: 'Recrutement',
    description:
      'Découvrez nos offres d’emploi ou déposez votre candidature spontanée auprès de nos équipes.',
    href: '/recrutement',
    cta: 'Voir les offres',
    tint: 'bg-tint-sage',
    badge: 'Nous rejoindre',
    icon: 'users',
    image: '/brand/agence-1.jpg',
  },
]

const icons: Record<Card['icon'], string> = {
  key: 'M10.5 2a4.5 4.5 0 0 0-4.3 5.9L2 12.1V15h2.9l.9-.9v-1.4h1.4l1-1 .7.1A4.5 4.5 0 1 0 10.5 2m1.3 3.7a1 1 0 1 1 1.4-1.4 1 1 0 0 1-1.4 1.4',
  folder:
    'M2 4.5A1.5 1.5 0 0 1 3.5 3h3l1.4 1.6h4.6A1.5 1.5 0 0 1 14 6.1v6.4a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5z',
  users:
    'M6 8a2.6 2.6 0 1 0 0-5.2A2.6 2.6 0 0 0 6 8m5.2 0a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2M6 9.2c-2 0-4.2 1-4.2 2.6v1.4h8.4v-1.4C10.2 10.2 8 9.2 6 9.2m5.2.3c-.4 0-.8 0-1.2.2.7.6 1.2 1.3 1.2 2.1v1.4h3v-1.3c0-1.4-1.8-2.4-3-2.4',
}

/** `width` : voir `Activities`. */
export function ServiceCards({ width = 'default' }: { width?: 'default' | 'wide' } = {}) {
  return (
    // Peu d'air en haut : ces trois cartes forment un même ensemble avec la
    // recherche qui les précède.
    <section className="bg-surface-warm py-6 lg:py-8">
      <Container width={width}>
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((card, index) => {
            const inner = (
              <>
                {/* La photographie occupe le bas de la carte et s'efface vers
                    le texte : un masque dégradé plutôt qu'un simple voile,
                    pour que le titre garde son contraste quelle que soit
                    l'image. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] overflow-hidden rounded-panel"
                >
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="media-zoom object-cover opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]"
                  />
                </span>

                <div className="relative flex items-start justify-between gap-4">
                  <span className="inline-flex size-11 items-center justify-center rounded-card bg-surface/70 text-ink-900 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5">
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-5 fill-current">
                      <path d={icons[card.icon]} />
                    </svg>
                  </span>
                  <span className="rounded-pill bg-surface/70 px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide text-ink-500">
                    {card.badge}
                  </span>
                </div>

                <h3 className="relative mt-6 text-xl font-semibold">{card.title}</h3>
                <p className="relative mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-ink-500">
                  {card.description}
                </p>

                <span className="relative mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink-900">
                  {card.cta}
                  <ArrowIcon />
                </span>
              </>
            )

            const cardClass = `gilt-edge group/btn group relative flex h-full flex-col overflow-hidden rounded-panel ${card.tint} p-6 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-raised`

            return (
              <Reveal key={card.title} delay={index * 90} className="h-full">
                {card.external ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cardClass}
                  >
                    {inner}
                    <span className="sr-only">(ouvre l’extranet dans un nouvel onglet)</span>
                  </a>
                ) : (
                  <Link href={card.href} className={cardClass}>
                    {inner}
                  </Link>
                )}
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
