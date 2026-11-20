import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactBand } from '@/components/home/ContactBand'
import { ArrowIcon } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { servicePages } from '@/data/services'

export const metadata: Metadata = {
  title: 'Nos services',
  description:
    "Transaction, gestion locative, syndic de copropriété et courtage d'assurances : les quatre métiers de Rolin Bainson, tous internes.",
}

/**
 * Page de rubrique des quatre métiers.
 *
 * Le menu principal regroupe les métiers sous « Nos services » et pointe sur
 * cette page : une entrée de menu déroulante doit mener quelque part quand on
 * clique dessus plutôt que de s'ouvrir seulement au survol — c'est la seule
 * façon d'y accéder au clavier ou au doigt sans sous-menu.
 */
export default function ServicesPage() {
  return (
    <>
      <PageHeader
        image="/brand/hero-syndic.jpg"
        eyebrow="Nos services"
        title={
          <>
            Quatre métiers, <span className="text-brand-500">un seul interlocuteur</span>
          </>
        }
        description="De la mise en location à l’assemblée générale, tout se traite en interne. C’est ce qui permet de répondre vite, et de connaître vraiment les immeubles dont nous nous occupons."
        breadcrumb={[{ label: 'Nos services' }]}
      />

      <Container as="section" className="py-8 lg:py-10">
        <ul className="grid gap-5 sm:grid-cols-2">
          {servicePages.map((service, index) => (
            <Reveal as="li" key={service.slug} delay={index * 80} className="h-full">
              <Link
                href={`/${service.slug}`}
                className={`group flex h-full flex-col rounded-panel ${service.highlights[0]?.tint ?? 'bg-tint-sand'} p-7 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-raised`}
              >
                <span className="inline-flex w-fit rounded-pill bg-surface/70 px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.1em] text-ink-500 uppercase">
                  {service.eyebrow}
                </span>
                <h2 className="mt-5 text-2xl font-semibold">{service.name}</h2>
                <p className="mt-3 flex-1 leading-relaxed text-ink-500">{service.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink-900">
                  Découvrir
                  <ArrowIcon className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>

      <ContactBand
        eyebrow="Votre projet"
        title={['Vous ne savez pas ', 'par où commencer', ' ?']}
        description="Décrivez votre situation en quelques lignes : un bien à vendre, un logement à mettre en location, une copropriété à reprendre. Nous vous orientons vers le bon interlocuteur."
        primary={{ href: '/etre-rappele/projet-immobilier', label: 'Décrire mon projet' }}
        secondary={{ href: '/tarifs', label: 'Voir nos tarifs' }}
        width="default"
      />
    </>
  )
}
