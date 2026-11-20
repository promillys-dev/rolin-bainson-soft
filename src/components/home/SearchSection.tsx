import { SearchForm } from '@/components/home/SearchForm'
import { SearchScene } from '@/components/home/SearchScene'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { countByTransaction } from '@/lib/properties'

/**
 * La recherche, juste sous la bannière.
 *
 * À gauche, la scène : les deux panneaux du logo, l'un pour la vente,
 * l'autre pour la location. À droite, le bloc de recherche, haut, avec son
 * bouton au pied. Les deux se répondent sans script : la section est le
 * groupe `search`, et tout ce qui dépend de l'onglet coché — panneau
 * éclairé, titre du bloc, compte d'annonces — le lit par `:has()`.
 *
 * Même largeur que la bannière (`wide`) : la recherche s'aligne sur le
 * texte et sur la figure du dessus, au lieu de se resserrer au centre.
 */
export async function SearchSection() {
  const [location, vente] = await Promise.all([
    countByTransaction('location'),
    countByTransaction('vente'),
  ])
  const counts = { location, vente }

  return (
    <section
      aria-label="Rechercher un bien"
      className="group/search relative overflow-hidden border-b border-line bg-surface-warm py-6 lg:py-8"
    >
      {/* Un très grand cercle détouré, en écho au cercle décoratif de la
          bannière : il ancre la scène sans rien dire. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -left-48 size-[44rem] -translate-y-1/2 rounded-full border border-brand-300/30"
      />

      <Container width="wide" className="relative">
        {/* Une seule ligne : la scène à gauche, le formulaire à droite, à la
            même hauteur. Sous `lg`, ils s'empilent, formulaire en second. */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center xl:gap-16">
          <Reveal className="min-w-0 lg:flex-[1.15]">
            <SearchScene counts={counts} />
          </Reveal>

          <Reveal delay={150} className="min-w-0 lg:flex-[0.85]">
            <SearchForm counts={counts} />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
