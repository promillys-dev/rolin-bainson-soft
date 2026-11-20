import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { serviceNav } from '@/config/navigation'
import { site } from '@/config/site'

/**
 * Barre de services.
 *
 * Reprend la rangée de boutons que l'ancien site affichait au-dessus du logo
 * (Contactez-nous, Nous écrire, Où nous trouver, Être rappelé, Accès client),
 * dans la forme des deux références : coordonnées à gauche, services et accès
 * client à droite, sur un bandeau sombre qui sert de socle au logo.
 *
 * Masquée sur mobile : les mêmes entrées sont reprises dans le tiroir.
 */
export function TopBar() {
  return (
    <div className="hidden bg-ink-900 text-white lg:block">
      <Container width="wide" className="flex h-11 items-center justify-between gap-6">
        <p className="flex items-center gap-4 text-[0.8125rem] text-white/70">
          <a
            href={`tel:${site.phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-current">
              <path d="M5.2 2.3a1 1 0 0 0-1.3-.2l-1 .7a2 2 0 0 0-.7 2.4 15 15 0 0 0 8.6 8.6 2 2 0 0 0 2.4-.7l.7-1a1 1 0 0 0-.2-1.3l-2-1.5a1 1 0 0 0-1.2 0l-.8.6a10.6 10.6 0 0 1-3.6-3.6l.6-.8a1 1 0 0 0 0-1.2z" />
            </svg>
            {site.phone}
          </a>
          <span aria-hidden="true" className="h-3.5 w-px bg-white/20" />
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-current">
              <path d="M1.5 4.3V12a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V4.3l-6.2 4a1.5 1.5 0 0 1-1.6 0zM14.4 3H1.6l6.1 3.9a.5.5 0 0 0 .6 0z" />
            </svg>
            {site.email}
          </a>
        </p>

        <nav aria-label="Liens de service" className="flex items-center gap-1">
          {serviceNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-pill px-3 py-1.5 text-[0.8125rem] text-white/70 transition-colors duration-300 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.clientAreaUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="group/btn ml-2 inline-flex items-center gap-1.5 rounded-pill bg-brand-500 px-4 py-1.5 text-[0.8125rem] font-medium text-white transition-colors duration-300 hover:bg-brand-600"
          >
            Accès client
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-3 fill-none stroke-current stroke-[1.75] transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            >
              <path d="M6 3h7v7M13 3 5 11" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only">(ouvre l’extranet dans un nouvel onglet)</span>
          </a>
        </nav>
      </Container>
    </div>
  )
}
