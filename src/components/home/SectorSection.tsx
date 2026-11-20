import { NewsColumn } from '@/components/home/NewsColumn'
import { SectorMap } from '@/components/home/SectorMap'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getLatestArticles } from '@/lib/news'

/**
 * La carte et les actualités, côte à côte.
 *
 * C'est la disposition de l'ancienne page d'accueil : la carte sur huit
 * colonnes, sa légende-filtre dessous, et le slider d'actualités sur les
 * quatre colonnes de droite. Sous `lg`, les actualités passent sous la
 * carte.
 *
 * Même largeur que la bannière et la recherche (`wide`) : les trois blocs
 * qui ouvrent la page s'alignent sur les mêmes bords.
 */
export async function SectorSection() {
  const news = await getLatestArticles(4)

  return (
    <section
      id="couverture"
      // Pas de filet en tête : la section des métiers, juste avant, en
      // porte déjà un en pied.
      className="scroll-mt-24 border-b border-line bg-surface-warm py-6 lg:py-8"
    >
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          <div className="lg:col-span-8">
            <Reveal>
              <SectionHeading
                rule
                eyebrow="Notre terrain"
                title="Villeurbanne, la rive gauche et la Confluence"
                description="Un périmètre court, choisi : on ne connaît bien que les immeubles qu’on peut aller voir dans la journée. Survolez une épingle pour voir le bien."
              />
            </Reveal>
            <Reveal delay={120} className="mt-8">
              <SectorMap />
            </Reveal>
          </div>

          <Reveal delay={200} className="flex lg:col-span-4">
            <NewsColumn items={news} className="w-full" />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
