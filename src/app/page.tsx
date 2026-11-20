import { Activities } from '@/components/home/Activities'
import { AgenciesTeaser } from '@/components/home/AgenciesTeaser'
import { ChapterNav } from '@/components/home/ChapterNav'
import { ContactBand } from '@/components/home/ContactBand'
import { HeroExperience } from '@/components/home/HeroExperience'
import { SearchSection } from '@/components/home/SearchSection'
import { SectorSection } from '@/components/home/SectorSection'
import { ServiceCards } from '@/components/home/ServiceCards'
import { homeChapters } from '@/config/homeChapters'

/**
 * Page d'accueil.
 *
 * Bannière sombre, recherche, puis le reste de la page aligné sur leur
 * langage — trait doré à boule sur les titres, monogramme du logo, filet du
 * rail, largeur de la bannière.
 *
 * L'ordre est celui de l'ancienne page, qui était juste : chercher un bien,
 * accéder à son espace ou déposer un dossier, découvrir les métiers, puis la
 * carte et les actualités côte à côte, les agences, et le contact.
 *
 * Chaque section est un chapitre (`config/homeChapters.ts`), et un sommaire
 * vivant suit la lecture : on sait où l'on est, quelle part de la maison est
 * présentée, et ce qui vient ensuite.
 */
export default function HomePage() {
  return (
    <>
      <Chapter id="maison">
        <HeroExperience tone="dark" />
      </Chapter>
      <Chapter id="recherche">
        <SearchSection />
      </Chapter>
      <Chapter id="acces">
        <ServiceCards width="wide" />
      </Chapter>
      <Chapter id="metiers">
        <Activities rule width="wide" />
      </Chapter>
      <Chapter id="terrain">
        <SectorSection />
      </Chapter>
      <Chapter id="agences">
        <AgenciesTeaser rule width="wide" />
      </Chapter>
      <Chapter id="contact">
        <ContactBand />
      </Chapter>

      <ChapterNav chapters={homeChapters} />
    </>
  )
}

/**
 * Un chapitre de la page : l'ancre que suit le sommaire. Il n'ajoute rien à
 * l'affichage — la section qu'il entoure reste telle quelle — sinon la marge
 * de défilement qui l'empêche de passer sous l'en-tête collant.
 */
function Chapter({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-20">
      {children}
    </div>
  )
}
