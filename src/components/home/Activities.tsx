import Image from 'next/image'
import Link from 'next/link'
import { ArrowIcon } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { services } from '@/config/home'
import { LOGO_MARK, markPath } from '@/lib/logoMark'

/**
 * Les quatre métiers du groupe, tels qu'ils structuraient le site précédent.
 *
 * C'est l'argument central de la maison : les quatre services sont internes,
 * donc un propriétaire n'a qu'un interlocuteur de la mise en location à
 * l'assurance. Le legacy le disait dans son menu, jamais sur sa page
 * d'accueil ; ici c'est une section à part entière.
 *
 * Le monogramme du logo occupe le fond, en très grand : « un seul
 * interlocuteur », c'est la maison elle-même, et sa marque se tient derrière
 * les quatre métiers comme le toit au-dessus des quatre services.
 */

/** Les deux panneaux du logo, dans leur propre repère. */
const MARK = (['ink', 'brand'] as const).map((id) => ({
  id,
  d: markPath(LOGO_MARK[id], (point) => point),
}))

/**
 * `rule` et `width` servent la page d'accueil :
 * trait doré de la bannière sur le titre, et largeur alignée sur la bannière.
 */
export function Activities({
  rule,
  width = 'default',
}: {
  rule?: boolean
  width?: 'default' | 'wide'
} = {}) {
  return (
    <section className="relative isolate overflow-hidden border-y border-line bg-surface py-6 lg:py-8">
      {/* Le monogramme en filigrane : assez grand pour sortir du cadre,
          assez pâle pour que les cartes restent seules à parler. Calé en
          haut à droite, il occupe le vide laissé par le titre, puis passe
          derrière les cartes, légèrement translucides, qui le laissent
          deviner. Les panneaux descendent se poser à l'entrée dans le champ,
          comme dans la bannière et la recherche. */}
      <Reveal className="pointer-events-none absolute -top-10 right-[-8rem] -z-10 hidden h-[44rem] sm:block lg:right-[-3rem] lg:h-[52rem]">
        <svg viewBox="10 19 62 81" aria-hidden="true" className="h-full w-auto overflow-visible">
          {MARK.map((panel, index) => (
            <path
              key={panel.id}
              d={panel.d}
              data-scene-piece=""
              style={
                {
                  '--scene-anim': `scene-drop 1100ms var(--ease-out-soft) ${200 + index * 220}ms both`,
                } as React.CSSProperties
              }
              fill={panel.id === 'brand' ? 'rgb(229 112 58 / 0.14)' : 'rgb(28 25 23 / 0.07)'}
              stroke={panel.id === 'brand' ? 'rgb(229 112 58 / 0.45)' : 'rgb(28 25 23 / 0.18)'}
              strokeWidth="1.5"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </Reveal>

      <Container width={width}>
        <Reveal>
          <SectionHeading
            rule={rule}
            eyebrow="Nos métiers"
            title="Quatre métiers, un seul interlocuteur"
            description="De la mise en location à l’assemblée générale, tout se traite en interne. C’est ce qui permet de répondre vite, et de connaître vraiment les immeubles dont nous nous occupons."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 80}>
              <Link
                href={service.href}
                className={`gilt-edge group/btn group relative flex h-full flex-col overflow-hidden rounded-panel ${service.tint} backdrop-blur-[3px] transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-raised`}
              >
                {/* La photo du métier, en bandeau. Les quatre cartes étaient
                    identiques à la couleur près : c'est l'image qui les
                    distingue au premier regard. Elle avance au survol,
                    doucement, et le voile clair en pied raccorde la photo à
                    la teinte de la carte plutôt que de la trancher net. */}
                <span className="relative block aspect-[16/7] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/70 to-transparent"
                  />
                  <span className="absolute top-4 left-4 inline-flex rounded-pill bg-surface/85 px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.1em] text-ink-700 uppercase backdrop-blur-sm">
                    {service.badge}
                  </span>
                </span>

                <span className="relative flex flex-1 flex-col p-7 pt-6">
                  {/* Le rang du métier, en filigrane : il rend la série
                      lisible d'un coup d'œil et glisse au survol. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-8 right-1 font-display text-[6rem] leading-none font-semibold text-ink-900/[0.07] transition-transform duration-700 ease-[var(--ease-out-soft)] select-none group-hover:-translate-y-1 group-hover:translate-x-1"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h3 className="relative text-2xl font-semibold">{service.title}</h3>
                  <p className="relative mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-500">
                    {service.description}
                  </p>
                  <span className="relative mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink-900">
                    Découvrir
                    <ArrowIcon />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

      </Container>
    </section>
  )
}
