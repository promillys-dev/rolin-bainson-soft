import { ProseWithToc } from '@/components/editorial/Prose'
import { ContactBand } from '@/components/home/ContactBand'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { ServicePage } from '@/data/services'

/**
 * Gabarit commun aux quatre pages de métier.
 *
 * Le site précédent en faisait quatre pages de texte au kilomètre. Le même
 * contenu passe mieux en trois temps : ce que nous faisons (cartes teintées,
 * comme l'accueil), comment ça se passe (déroulé numéroté), puis les
 * questions d'argent et de contrat en prose, avec leur sommaire. Un
 * propriétaire qui hésite ne lit pas un paragraphe de plus, il cherche une
 * réponse précise.
 *
 * Chaque métier s'ouvre sur la photographie qui le porte dans la bannière
 * d'accueil, et se ferme sur le bandeau de contact de l'accueil, avec son
 * propre appel à l'action.
 */

const IMAGES: Record<string, string> = {
  transaction: '/brand/hero-trouver.jpg',
  'gestion-immobiliere': '/brand/hero-gestion.jpg',
  'syndic-de-copropriete': '/brand/hero-syndic.jpg',
  'courtage-d-assurances': '/brand/hero-assurances.jpg',
}

export function ServiceLayout({ page }: { page: ServicePage }) {
  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={
          <>
            {page.titleLead} <span className="text-brand-500">{page.titleAccent}</span>
          </>
        }
        description={page.description}
        image={IMAGES[page.slug]}
        breadcrumb={[{ label: 'Nos services', href: '/nos-services' }, { label: page.name }]}
      />

      <Container as="section" className="py-8 lg:py-10">
        <ul className="grid gap-5 sm:grid-cols-2">
          {page.highlights.map((highlight, index) => (
            <Reveal as="li" key={highlight.title} delay={index * 80} className="h-full">
              <div
                className={`gilt-edge group relative flex h-full flex-col overflow-hidden rounded-panel ${highlight.tint} p-7 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-raised`}
              >
                {/* Le rang, en filigrane, comme les métiers de l'accueil. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-6 -right-2 font-display text-[7rem] leading-none font-semibold text-ink-900/[0.06] transition-transform duration-700 ease-[var(--ease-out-soft)] select-none group-hover:-translate-y-1 group-hover:translate-x-1"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="relative text-xl font-semibold">{highlight.title}</h2>
                <p className="relative mt-3 leading-relaxed text-ink-500">{highlight.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>

      <section className="border-y border-line bg-surface py-8 lg:py-10">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Comment ça se passe" title="Le déroulé d’une mission" />
          </Reveal>

          {/* Le déroulé suit le rail de la bannière : une pastille par étape,
              reliées par un filet qui va de la première à la dernière. */}
          <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {page.steps.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 70}>
                <div className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-ink-900 font-display text-sm font-semibold text-brand-300 ring-4 ring-brand-500/15"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="border-l border-line pl-5">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink-500">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <Container as="section" className="py-8 lg:py-10">
        <ProseWithToc sections={page.sections} />
      </Container>

      <ContactBand
        eyebrow={page.name}
        title={page.cta.title}
        description={page.cta.description}
        primary={{ href: page.cta.href, label: page.cta.label }}
        secondary={{ href: '/tarifs', label: 'Voir nos tarifs' }}
        width="default"
      />
    </>
  )
}
