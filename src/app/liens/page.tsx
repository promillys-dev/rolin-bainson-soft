import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Liens utiles',
  description:
    'Les services publics et les organismes utiles aux propriétaires, locataires et copropriétaires lyonnais.',
}

/**
 * Liens utiles.
 *
 * Le legacy avait une page `liens.html` alimentée par un quatrième menu en
 * base. On la reprend en ne gardant que des sources officielles et pérennes :
 * une page de liens qui pourrit est pire que pas de page du tout.
 *
 * Chaque lien dit à quoi il sert. « ANIL » ne veut rien dire pour un
 * locataire qui cherche à contester une régularisation de charges.
 */
const linkGroups: readonly {
  title: string
  links: readonly { label: string; href: string; description: string }[]
}[] = [
  {
    title: 'Se loger et connaître ses droits',
    links: [
      {
        label: 'ADIL du Rhône',
        href: 'https://www.adil69.org/',
        description:
          'Conseil juridique gratuit sur le logement : bail, congé, charges, travaux. Le premier réflexe en cas de désaccord avec un bailleur ou un locataire.',
      },
      {
        label: 'Service-public.fr — Logement',
        href: 'https://www.service-public.fr/particuliers/vosdroits/N19808',
        description:
          'Les démarches officielles : préavis, état des lieux, dépôt de garantie, aides au logement.',
      },
      {
        label: 'Encadrement des loyers — Métropole de Lyon',
        href: 'https://www.grandlyon.com/services/lencadrement-des-loyers',
        description:
          'Les loyers de référence en vigueur à Lyon et Villeurbanne, par secteur et par type de logement.',
      },
    ],
  },
  {
    title: 'Avant d’acheter',
    links: [
      {
        label: 'Géorisques',
        href: 'https://www.georisques.gouv.fr/',
        description:
          'Les risques naturels, miniers, technologiques et la pollution des sols à une adresse donnée. L’état des risques est obligatoire dès l’annonce.',
      },
      {
        label: 'Demandes de valeurs foncières',
        href: 'https://app.dvf.etalab.gouv.fr/',
        description:
          'Les prix réellement signés, par parcelle et par date. La source la plus honnête pour se faire une idée d’un secteur.',
      },
      {
        label: 'Chambre des notaires du Rhône',
        href: 'https://www.notaires.fr/',
        description: 'Trouver un notaire, comprendre les frais d’acte et les délais.',
      },
    ],
  },
  {
    title: 'Rénover et financer',
    links: [
      {
        label: 'France Rénov’',
        href: 'https://france-renov.gouv.fr/',
        description:
          'Le service public de la rénovation de l’habitat : audit, aides, artisans qualifiés RGE.',
      },
      {
        label: 'MaPrimeRénov’',
        href: 'https://www.maprimerenov.gouv.fr/',
        description: 'Dépôt et suivi des demandes d’aide à la rénovation énergétique.',
      },
      {
        label: 'Observatoire des DPE — ADEME',
        href: 'https://observatoire-dpe-audit.ademe.fr/',
        description: 'Vérifier le diagnostic d’un logement à partir de son numéro.',
      },
    ],
  },
  {
    title: 'La profession',
    links: [
      {
        label: 'UNIS — Union des syndicats de l’immobilier',
        href: 'https://www.unis-immo.fr/',
        description: 'Le syndicat professionnel dont nous sommes adhérents, et son code de déontologie.',
      },
      {
        label: 'CNIL',
        href: 'https://www.cnil.fr/',
        description:
          'Vos droits sur vos données personnelles, et le formulaire de réclamation en ligne.',
      },
    ],
  },
]

export default function LinksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Informations"
        title={
          <>
            Liens utiles, <span className="text-brand-500">et seulement utiles</span>
          </>
        }
        description="Des sources officielles pour vérifier par vous-même : vos droits, les prix réellement pratiqués, les aides à la rénovation."
        breadcrumb={[{ label: 'Liens utiles' }]}
      />

      <Container as="section" className="py-8 lg:py-10">
        <div className="grid gap-10">
          {linkGroups.map((group, groupIndex) => (
            <Reveal key={group.title} delay={groupIndex * 70}>
              <section>
                <h2 className="text-xl font-semibold sm:text-2xl">{group.title}</h2>
                <ul className="mt-5 grid gap-4 md:grid-cols-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex h-full flex-col rounded-panel border border-line bg-surface p-5 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-brand-200 hover:shadow-raised"
                      >
                        <span className="inline-flex items-center gap-1.5 font-semibold text-ink-900 transition-colors group-hover:text-brand-700">
                          {link.label}
                          <svg
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                            className="size-3.5 fill-none stroke-current stroke-[1.6]"
                          >
                            <path
                              d="M6 3h7v7M13 3 5 11M11 9v4H3V5h4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="sr-only">(nouvel onglet)</span>
                        </span>
                        <span className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
                          {link.description}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  )
}
