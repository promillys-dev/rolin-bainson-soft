import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { footerNav, mainNav, serviceNav } from '@/config/navigation'
import { site } from '@/config/site'
import { getAgencies } from '@/lib/agencies'
import { getAllArticles } from '@/lib/news'
import { getAllProperties, propertyTitle } from '@/lib/properties'

export const metadata: Metadata = {
  title: 'Plan du site',
  description: 'Toutes les pages du site Rolin Bainson, rubrique par rubrique.',
}

/**
 * Plan du site.
 *
 * Le menu du site précédent comportait une entrée « Plan du site » qui ne
 * menait nulle part : la page n'avait jamais été créée. Elle l'est ici, et
 * elle est CONSTRUITE à partir de `config/navigation.ts`, des agences, des
 * annonces et des actualités — pas recopiée à la main. Un plan du site
 * maintenu à la main est faux au premier ajout de page.
 */
function LinkList({ links }: { links: readonly { label: string; href: string }[] }) {
  return (
    <ul className="mt-3 grid gap-1.5">
      {links.map((link) => (
        <li key={`${link.href}-${link.label}`}>
          <Link
            href={link.href}
            className="text-[0.9375rem] text-ink-500 transition-colors hover:text-brand-700"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function Group({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-panel border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

export default async function SitemapPage() {
  const [properties, agencies, articles] = await Promise.all([
    getAllProperties(),
    getAgencies(),
    getAllArticles(),
  ])

  return (
    <>
      <PageHeader
        eyebrow="Informations"
        title="Plan du site"
        description="Toutes les pages, y compris celles qui ne figurent pas dans le menu."
        breadcrumb={[{ label: 'Plan du site' }]}
      />

      <Container as="section" className="py-8 lg:py-10">
        <div className="grid gap-5 md:grid-cols-2">
          {mainNav.map((item) => (
            <Group key={item.href} title={item.label}>
              <LinkList
                links={[
                  { label: `${item.label} — accueil de la rubrique`, href: item.href },
                  ...(item.children ?? []),
                ]}
              />
            </Group>
          ))}

          <Group title="Nous contacter">
            <LinkList links={serviceNav} />
          </Group>

          {footerNav
            .filter((column) => column.title === 'Informations')
            .map((column) => (
              <Group key={column.title} title={column.title}>
                {/* Deux pages ne figurent dans aucun menu : les conditions
                    d'utilisation et le dépôt de dossier, atteint depuis les
                    annonces en location. Le plan du site est précisément là
                    pour qu'elles ne soient pas orphelines. */}
                <LinkList
                  links={[
                    ...column.links,
                    { label: 'Conditions d’utilisation', href: '/cgu' },
                    { label: 'Déposer votre dossier', href: '/deposer-votre-dossier' },
                  ]}
                />
              </Group>
            ))}

          <Group title="Nos agences">
            <LinkList
              links={agencies.map((agency) => ({
                label: agency.name,
                href: `/agences/${agency.slug}`,
              }))}
            />
          </Group>

          <Group title={`Actualités (${articles.length})`}>
            <LinkList
              links={articles.map((article) => ({
                label: article.title,
                href: `/actualites/${article.slug}`,
              }))}
            />
          </Group>
        </div>

        <div className="mt-5 rounded-panel border border-line bg-surface p-6">
          <h2 className="text-lg font-semibold">Nos biens ({properties.length})</h2>
          <ul className="mt-3 grid gap-1.5 md:grid-cols-2">
            {properties.map((property) => (
              <li key={property.reference}>
                <Link
                  href={`/offres/${property.reference}/${property.slug}`}
                  className="text-[0.9375rem] text-ink-500 transition-colors hover:text-brand-700"
                >
                  {propertyTitle(property)} — {property.location.city}
                  <span className="text-ink-300"> · réf. {property.reference}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-400">
            Le catalogue change à chaque import : cette liste reflète les biens disponibles au
            moment de la génération de la page.
          </p>
        </div>

        <p className="mt-8 text-sm text-ink-400">
          L’espace client est hébergé hors de ce site :{' '}
          <a
            href={site.clientAreaUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-brand-700 transition-colors hover:text-brand-800"
          >
            accéder à l’extranet
          </a>
          <span className="sr-only"> (nouvel onglet)</span>.
        </p>
      </Container>
    </>
  )
}
