import { ProseWithToc } from '@/components/editorial/Prose'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Crumb } from '@/components/ui/Breadcrumb'
import type { EditorialPage } from '@/data/editorial'

/**
 * Gabarit des pages institutionnelles et légales.
 *
 * Une colonne de texte, pas d'illustration : ces pages se lisent quand on y
 * cherche une information précise. Le bandeau situe, le sommaire « Sur cette
 * page » mène à la bonne partie, le texte répond.
 */
export function EditorialLayout({
  page,
  breadcrumb,
  image,
}: {
  page: EditorialPage
  breadcrumb?: readonly Crumb[]
  /** Photographie du bandeau ; à défaut, celle par défaut de `PageHeader`. */
  image?: string
}) {
  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={
          page.titleAccent ? (
            <>
              {page.titleLead} <span className="text-brand-500">{page.titleAccent}</span>
            </>
          ) : (
            page.titleLead
          )
        }
        description={page.description}
        image={image}
        breadcrumb={breadcrumb ?? [{ label: page.name }]}
      />

      <Container as="section" className="py-8 lg:py-10">
        <ProseWithToc sections={page.sections} />
      </Container>
    </>
  )
}
