import Image from 'next/image'
import type { ReactNode } from 'react'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Container } from '@/components/ui/Container'
import { LOGO_MARK, markPath } from '@/lib/logoMark'

/**
 * Bandeau d'ouverture des pages intérieures.
 *
 * Il reprend la matière de la bannière d'accueil, en plus calme : une
 * photographie sous la même couche sombre, l'étiquette à point orange, le
 * trait qui descend le long du titre et finit en boule, le fragment de titre
 * en couleur souligné d'or, le monogramme du logo en filigrane et le filet
 * du rail en pied. Une page intérieure s'ouvre ainsi comme l'accueil, sans
 * sa mise en scène : elle situe, puis laisse le contenu commencer.
 *
 * Les titres passent leur fragment en couleur avec `text-brand-500`, comme
 * sur un fond clair ; c'est le bandeau qui le recolore et le souligne, pour
 * que les pages n'aient rien à changer.
 *
 * `children` — filtres, boutons, date d'un article — est posé dans une bande
 * claire sous le bandeau : ces éléments sont dessinés pour le fond du site.
 */

const MARK = (['ink', 'brand'] as const).map((id) => ({
  id,
  d: markPath(LOGO_MARK[id], (point) => point),
}))

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
  image = '/brand/hero-lyon.jpg',
  children,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  breadcrumb?: readonly Crumb[]
  /** Photographie de fond. Par défaut, le Vieux Lyon de la bannière. */
  image?: string
  /** Actions ou encarts posés sous le bandeau. */
  children?: ReactNode
  className?: string
}) {
  return (
    <>
      <header className={`relative isolate overflow-hidden bg-ink-900 text-white ${className ?? ''}`}>
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none -z-20 object-cover opacity-55"
        />
        {/* La couche sombre de la bannière : dense sous le texte, plus
            légère vers la droite, et qui se referme en pied. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(15_13_11/0.93)_0%,rgb(15_13_11/0.84)_42%,rgb(15_13_11/0.6)_100%),linear-gradient(to_bottom,rgb(15_13_11/0.45)_0%,transparent_30%,transparent_70%,rgb(15_13_11/0.6)_100%)]"
        />
        <svg
          aria-hidden="true"
          viewBox="10 19 62 81"
          className="pointer-events-none absolute -right-8 -bottom-20 -z-10 hidden h-[22rem] w-auto md:block"
        >
          {MARK.map((panel, index) => (
            <path
              key={panel.id}
              d={panel.d}
              className="animate-rise"
              style={{ animationDelay: `${150 + index * 160}ms` }}
              fill={panel.id === 'brand' ? 'rgb(229 112 58 / 0.16)' : 'rgb(255 255 255 / 0.05)'}
              stroke={panel.id === 'brand' ? 'rgb(246 199 106 / 0.5)' : 'rgb(255 255 255 / 0.2)'}
              strokeWidth="1.5"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {/* La lueur : un court trait doré fait le tour de chaque panneau,
              en continu, décalé de l'un à l'autre. */}
          <g
            fill="none"
            stroke="#f6c76a"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="[filter:drop-shadow(0_0_4px_rgb(246_199_106/0.95))_drop-shadow(0_0_10px_rgb(229_112_58/0.6))]"
          >
            {MARK.map((panel, index) => (
              <path
                key={panel.id}
                d={panel.d}
                data-mark-glow
                pathLength={100}
                strokeDasharray="14 86"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                style={{ animation: `mark-glow 6s linear ${index * -3}s infinite` }}
              />
            ))}
          </g>
        </svg>

        <Container className="relative pt-7 pb-10 lg:pb-12">
          {breadcrumb ? <Breadcrumb items={breadcrumb} tone="dark" className="mb-8" /> : null}

          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="inline-flex items-center gap-2 rounded-pill bg-white/12 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-brand-200 uppercase ring-1 ring-white/20 ring-inset backdrop-blur">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
                {eyebrow}
              </p>
            ) : null}

            <div className="relative mt-6 pl-5 sm:pl-6">
              <span aria-hidden="true" className="absolute top-2 bottom-1 left-0 w-[3px]">
                <span className="absolute inset-x-0 top-0 bottom-2.5 rounded-full bg-linear-to-b from-brand-400/15 via-brand-400 to-brand-500" />
                <span className="absolute bottom-0 left-1/2 block size-2.5 -translate-x-1/2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/60" />
                  <span className="absolute inset-0 rounded-full bg-brand-400 ring-4 ring-brand-400/15" />
                </span>
              </span>

              <h1 className="animate-rise font-display text-[2rem] leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.45)] sm:text-5xl [&_.text-brand-500]:bg-[linear-gradient(90deg,rgb(229_112_58/0.55),rgb(246_199_106/0.45))] [&_.text-brand-500]:[background-position:0_88%] [&_.text-brand-500]:bg-[length:100%_0.14em] [&_.text-brand-500]:bg-no-repeat [&_.text-brand-500]:text-brand-300 [&_.text-brand-500]:[box-decoration-break:clone]">
                {title}
              </h1>
              {description ? (
                // Un paragraphe quand c'est du texte ; un bloc quand la page
                // y glisse ses propres éléments (adresse et mention d'un bien).
                <Description>{description}</Description>
              ) : null}
            </div>
          </div>
        </Container>

        {/* Le filet du rail, en pied : la pastille dorée va et vient, en
            marquant un temps à chaque bord. */}
        <div aria-hidden="true" className="relative h-px bg-white/12">
          <span
            data-rail-travel
            className="absolute top-1/2 h-[3px] w-14 rounded-full bg-linear-to-r from-brand-500 via-[#f6c76a] to-brand-400 shadow-[0_0_14px_3px_rgb(246_199_106/0.45)]"
            style={{ animation: 'rail-sway 9s var(--ease-out-soft) 300ms infinite both' }}
          />
        </div>
      </header>

      {children ? (
        <div className="border-b border-line bg-surface">
          <Container className="pb-10 [&>*:first-child]:mt-8">{children}</Container>
        </div>
      ) : null}
    </>
  )
}

function Description({ children }: { children: ReactNode }) {
  const Tag = typeof children === 'string' ? 'p' : 'div'
  return (
    <Tag
      className="animate-rise mt-5 text-lg leading-relaxed text-white/75 [&_.text-ink-400]:text-white/55"
      style={{ animationDelay: '120ms' }}
    >
      {children}
    </Tag>
  )
}
