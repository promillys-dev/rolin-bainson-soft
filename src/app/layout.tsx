import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Inter, Outfit, Source_Serif_4 } from 'next/font/google'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { PageLoader } from '@/components/layout/PageLoader'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { site } from '@/config/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

/**
 * Typo d'affichage. Le logo de la maison est un bas-de-casse géométrique :
 * Outfit en reprend la construction (o et n circulaires, terminaisons nettes)
 * et rejoint la géométrie des deux références de design.
 */
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

/** Réservée aux accents d'héritage — « depuis 1957 », citations. */
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.baseline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: site.name,
  },
  robots: {
    // Le site n'est pas encore public : on bloque l'indexation jusqu'à la
    // bascule, pour ne pas faire concurrence à l'ancien domaine.
    index: false,
    follow: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${outfit.variable} ${sourceSerif.variable}`}
    >
      <body className="flex min-h-dvh flex-col antialiased">
        <a href="#contenu" className="skip-link rounded-md bg-ink-900 px-4 py-2 text-white">
          Aller au contenu principal
        </a>
        {/* Le menu codé (config/navigation.ts), pas celui du back-office :
            ses entrées mènent toutes à une page du front. Pour revenir au
            menu du back-office : rendre RootLayout async et passer
            nav={await getMainNav()} (lib/menus). */}
        <SiteHeader />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {/* useSearchParams : sous Suspense, pour que les pages restent prérendues. */}
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>
      </body>
    </html>
  )
}
