import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/config/site'
import { LOGO_MARK, markPath } from '@/lib/logoMark'

/**
 * Le bandeau de contact qui ferme la page.
 *
 * Il rassemble les trois portes d'entrée que l'ancien site éparpillait dans
 * son en-tête — être rappelé, nous écrire, nous appeler — et reprend la
 * matière de la bannière sombre pour fermer la page comme elle s'ouvre : une
 * photographie sous une couche sombre, le fragment de titre souligné d'or,
 * le monogramme du logo et le filet doré du rail.
 *
 * Il ferme l'accueil et les pages de métier ; chacune peut y mettre son
 * propre appel à l'action. Par défaut : « Un projet, une question ? ».
 */

const MARK = (['ink', 'brand'] as const).map((id) => ({
  id,
  d: markPath(LOGO_MARK[id], (point) => point),
}))

export function ContactBand({
  eyebrow = 'Nous contacter',
  title = ['Un projet, ', 'une question', ' ?'],
  description = 'Estimation, mise en gestion, changement de syndic ou simple renseignement : nous vous rappelons au moment qui vous convient.',
  primary = { href: '/etre-rappele', label: 'Être rappelé' },
  secondary = { href: '/nous-ecrire', label: 'Nous écrire' },
  width = 'wide',
}: {
  eyebrow?: string
  /**
   * Trois fragments, dont le second est mis en couleur et souligné d'or ;
   * ou une phrase simple, sans mise en valeur.
   */
  title?: string | readonly [string, string, string]
  description?: string
  primary?: { href: string; label: string }
  secondary?: { href: string; label: string }
  /** `wide` sur l'accueil, aligné sur la bannière ; `default` sur les pages intérieures. */
  width?: 'default' | 'wide'
} = {}) {
  return (
    <section className="bg-surface-warm py-6 lg:py-8">
      <Container width={width}>
        <Reveal>
          <div className="grain relative isolate overflow-hidden rounded-panel bg-ink-900 px-8 py-12 text-white sm:px-12 lg:py-14">
            <Image
              src="/brand/hero-gestion.jpg"
              alt=""
              fill
              sizes="(min-width: 1344px) 84rem, 100vw"
              className="pointer-events-none -z-20 object-cover opacity-45"
            />
            {/* La couche sombre de la bannière : dense sous le texte, plus
                légère vers la droite où la photo respire. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(15_13_11/0.94)_0%,rgb(15_13_11/0.82)_45%,rgb(15_13_11/0.55)_100%)]"
            />

            {/* Le monogramme, à droite, en grand et détouré d'or. */}
            <svg
              aria-hidden="true"
              viewBox="10 19 62 81"
              className="pointer-events-none absolute -right-6 -bottom-16 -z-10 hidden h-[26rem] w-auto lg:block"
            >
              {MARK.map((panel, index) => (
                <path
                  key={panel.id}
                  d={panel.d}
                  data-scene-piece=""
                  style={
                    {
                      '--scene-anim': `scene-drop 1000ms var(--ease-out-soft) ${250 + index * 200}ms both`,
                    } as React.CSSProperties
                  }
                  fill={panel.id === 'brand' ? 'rgb(229 112 58 / 0.22)' : 'rgb(255 255 255 / 0.06)'}
                  stroke={panel.id === 'brand' ? 'rgb(246 199 106 / 0.6)' : 'rgb(255 255 255 / 0.25)'}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            <div className="relative max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-pill bg-white/12 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-brand-200 uppercase ring-1 ring-white/20 ring-inset">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
                {eyebrow}
              </p>

              <div className="relative mt-6 pl-5 sm:pl-6">
                <span aria-hidden="true" className="absolute top-2 bottom-1 left-0 w-[3px]">
                  <span className="absolute inset-x-0 top-0 bottom-2.5 rounded-full bg-linear-to-b from-brand-400/15 via-brand-400 to-brand-500" />
                  <span className="absolute bottom-0 left-1/2 block size-2.5 -translate-x-1/2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/60" />
                    <span className="absolute inset-0 rounded-full bg-brand-400 ring-4 ring-brand-400/15" />
                  </span>
                </span>
                <h2 className="font-display text-[2.1rem] leading-[1.02] font-semibold tracking-[-0.03em] text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.45)] sm:text-[2.75rem]">
                  {typeof title === 'string' ? title : title[0]}
                  {typeof title === 'string' ? null : (
                  <span className="bg-[linear-gradient(90deg,rgb(229_112_58/0.55),rgb(246_199_106/0.45))] [background-position:0_88%] bg-[length:100%_0.16em] bg-no-repeat text-brand-300 [box-decoration-break:clone]">
                    {title[1]}
                  </span>
                  )}
                  {typeof title === 'string' ? null : title[2]}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/75">
                  {description}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 sm:pl-6">
                <ButtonLink
                  href={primary.href}
                  size="lg"
                  variant="accent"
                  className="shadow-[0_10px_30px_-12px_rgb(229_112_58/0.8)]"
                >
                  {primary.label}
                </ButtonLink>
                <ButtonLink
                  href={secondary.href}
                  size="lg"
                  variant="ghost"
                  className="border border-white/35 bg-transparent text-white hover:border-white hover:bg-white/10"
                >
                  {secondary.label}
                </ButtonLink>
                <a
                  href={`tel:${site.phone.replace(/\s/g, '')}`}
                  className="ml-1 text-sm font-medium text-white/75 transition-colors hover:text-white"
                >
                  ou appelez le <span className="font-semibold text-white">{site.phone}</span>
                </a>
              </div>
            </div>

            {/* Le filet du rail, en pied : une pastille dorée le parcourt. */}
            <div aria-hidden="true" className="relative mt-10 h-px bg-white/15">
              <span
                data-rail-travel
                className="absolute top-1/2 h-[3px] w-10 rounded-full bg-linear-to-r from-brand-500 via-[#f6c76a] to-brand-400 shadow-[0_0_14px_3px_rgb(246_199_106/0.45)]"
                style={{ animation: 'rail-travel 3200ms var(--ease-out-soft) 400ms infinite both' }}
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
