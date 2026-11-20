import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { site } from '@/config/site'
import { getAgencies } from '@/lib/agencies'
import { getFooterNav } from '@/lib/menus'
import { LOGO_MARK, markPath } from '@/lib/logoMark'

/**
 * Pied de page.
 *
 * Il ferme le site dans la matière qui l'ouvre : le fond sombre de la
 * bannière, le monogramme du logo, le filet doré du rail et ses étiquettes à
 * point orange. Même contenu qu'avant — identité, agences, trois menus,
 * mentions —, mais hiérarchisé : on lit d'abord qui est la maison et comment
 * la joindre, puis où la trouver, puis le reste.
 *
 * Le logo PNG, noir sur blanc, ne se pose pas sur un fond sombre : l'identité
 * est donc composée du monogramme — redessiné à partir du logo, dans sa
 * déclinaison inversée — et du nom de la maison.
 */

const MARK = (['ink', 'brand'] as const).map((id) => ({
  id,
  d: markPath(LOGO_MARK[id], (point) => point),
}))

/** Lien du pied de page : un trait doré se dessine dessous au survol. */
const linkClass =
  'bg-linear-to-r from-[#f6c76a] to-brand-400 bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 text-white/65 transition-[color,background-size] duration-300 ease-[var(--ease-out-soft)] hover:bg-[length:100%_1px] hover:text-white'

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-brand-200 uppercase">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
      {children}
    </h2>
  )
}

export async function SiteFooter() {
  const year = new Date().getFullYear()
  const [agencies, footerNav] = await Promise.all([getAgencies(), getFooterNav()])

  return (
    <footer className="grain relative isolate overflow-hidden bg-ink-900 text-white">
      {/* Lueur chaude et monogramme en filigrane : le fond a une matière, et
          la marque signe la page une dernière fois. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(229_112_58/0.16),transparent_65%)]"
      />
      <svg
        aria-hidden="true"
        viewBox="10 19 62 81"
        className="pointer-events-none absolute -right-10 -bottom-24 -z-10 hidden h-[34rem] w-auto md:block"
      >
        {MARK.map((panel) => (
          <path
            key={panel.id}
            d={panel.d}
            fill={panel.id === 'brand' ? 'rgb(229 112 58 / 0.1)' : 'rgb(255 255 255 / 0.03)'}
            stroke={panel.id === 'brand' ? 'rgb(246 199 106 / 0.28)' : 'rgb(255 255 255 / 0.1)'}
            strokeWidth="1.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* Le filet du rail, en tête : une pastille dorée le parcourt. */}
      <div aria-hidden="true" className="relative h-px bg-white/10">
        <span
          data-rail-travel
          className="absolute top-1/2 h-[3px] w-16 rounded-full bg-linear-to-r from-brand-500 via-[#f6c76a] to-brand-400 shadow-[0_0_14px_3px_rgb(246_199_106/0.4)]"
          style={{ animation: 'rail-travel 5200ms var(--ease-out-soft) 0ms infinite both' }}
        />
      </div>

      <Container width="wide" className="relative pt-14 pb-8 lg:pt-16">
        {/* Identité et contact : qui est la maison, et comment la joindre. */}
        <div className="flex flex-col gap-10 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Rolin Bainson, retour à l'accueil">
              <svg aria-hidden="true" viewBox="10 19 62 81" className="h-11 w-auto">
                {MARK.map((panel) => (
                  <path
                    key={panel.id}
                    d={panel.d}
                    fill={panel.id === 'brand' ? 'var(--color-brand-500)' : '#f6f0e9'}
                  />
                ))}
              </svg>
              <span className="font-display text-2xl font-semibold tracking-[-0.02em]">
                Rolin Bainson
              </span>
            </Link>

            {/* Le trait à boule de la bannière, devant la phrase d'identité. */}
            <div className="relative mt-6 pl-5">
              <span aria-hidden="true" className="absolute top-1 bottom-0.5 left-0 w-[3px]">
                <span className="absolute inset-x-0 top-0 bottom-2.5 rounded-full bg-linear-to-b from-brand-400/15 via-brand-400 to-brand-500" />
                <span className="absolute bottom-0 left-1/2 block size-2.5 -translate-x-1/2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/60" />
                  <span className="absolute inset-0 rounded-full bg-brand-400 ring-4 ring-brand-400/15" />
                </span>
              </span>
              <p className="font-display text-[1.375rem] leading-snug font-semibold tracking-[-0.01em] sm:text-2xl">
                Administration et gestion d’immeubles à{' '}
                <span className="text-brand-300">Lyon Métropole</span>, depuis 1957.
              </p>
              <p className="mt-2 text-sm text-white/55">
                Transaction · Gestion locative · Syndic de copropriété · Courtage d’assurances
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/etre-rappele"
                className="group/btn inline-flex h-12 items-center gap-2 rounded-pill bg-linear-to-r from-brand-500 to-brand-600 px-6 text-[0.9375rem] font-semibold text-white shadow-[0_10px_30px_-12px_rgb(229_112_58/0.8)] transition-all duration-300 hover:from-brand-400 hover:to-brand-600"
              >
                Être rappelé
                <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">
                  →
                </span>
              </Link>
              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
                className="inline-flex h-12 items-center rounded-pill px-5 text-[0.9375rem] font-semibold text-white ring-1 ring-white/25 transition-colors hover:bg-white/10 hover:ring-white/50"
              >
                {site.phone}
              </a>
            </div>
            <div className="flex items-center gap-3 rounded-panel bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
              <span className="grid size-11 place-items-center rounded-card bg-white">
                <Image src="/brand/unis.png" alt="" width={90} height={90} className="size-9" />
              </span>
              <p className="text-xs leading-snug text-white/60">
                <span className="block font-semibold text-white">Membre UNIS</span>
                Union des syndicats de l’immobilier
              </p>
            </div>
          </div>
        </div>

        {/* Où nous trouver : les trois agences sur toute la largeur, pour
            que leurs coordonnées tiennent sur une ligne chacune. */}
        <div className="border-b border-white/10 py-12">
          <FooterHeading>Nos agences</FooterHeading>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
              {agencies.map((agency) => (
                <li key={agency.slug}>
                  <div className="group h-full rounded-card bg-white/[0.04] p-4 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.07] hover:ring-brand-400/40">
                    <Link
                      href={`/agences/${agency.slug}`}
                      className="flex items-center gap-2 font-display text-[0.9375rem] font-semibold text-white"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 shrink-0 rounded-full bg-brand-400 transition-transform duration-300 group-hover:scale-150"
                      />
                      {agency.shortName}
                    </Link>
                    <address className="mt-2 text-[0.8125rem] leading-relaxed text-white/55 not-italic">
                      {agency.address}
                      <br />
                      {agency.postalCode} {agency.city}
                    </address>
                    <p className="mt-2 flex flex-col gap-0.5 text-[0.8125rem]">
                      <a
                        href={`tel:${agency.phone.replace(/\s/g, '')}`}
                        className="w-fit font-medium text-brand-300 transition-colors hover:text-brand-200"
                      >
                        {agency.phone}
                      </a>
                      <a href={`mailto:${agency.email}`} className={`w-fit ${linkClass}`}>
                        {agency.email}
                      </a>
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* Les menus du back-office, puis l'accès à l'espace client. */}
        <div className="grid gap-12 py-12 sm:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          {footerNav.map((group) => (
            <div
              key={group.title}
              className={footerNav.length > 2 ? 'lg:col-span-2' : 'lg:col-span-3'}
            >
              <FooterHeading>{group.title}</FooterHeading>
              <ul className="mt-5 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={`text-sm ${linkClass}`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className={`text-sm ${linkClass}`}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sm:col-span-3 lg:col-span-5 lg:col-start-8">
            <a
              href={site.clientAreaUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="gilt-edge group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-panel bg-white/[0.05] p-6 ring-1 ring-white/10 transition-colors duration-300 after:opacity-60 hover:bg-white/[0.08] hover:after:opacity-100"
            >
              <span>
                <FooterHeading>Espace client</FooterHeading>
                <span className="mt-3 block font-display text-xl font-semibold">
                  Votre compte, vos documents, vos paiements
                </span>
                <span className="mt-1.5 block text-sm text-white/55">
                  Locataires, propriétaires et copropriétaires : tout est dans votre espace sécurisé.
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
                Accéder à mon espace
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
                <span className="sr-only">(ouvre l’extranet dans un nouvel onglet)</span>
              </span>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. Tous droits réservés.
          </p>
          <p>
            Honoraires et barèmes conformes à l’arrêté du 10 janvier 2017 —{' '}
            <Link href="/tarifs" className="text-white/70 underline underline-offset-2 hover:text-white">
              consulter nos tarifs
            </Link>
          </p>
          <a
            href="#"
            className="group inline-flex items-center gap-2 self-start font-medium text-white/70 transition-colors hover:text-white sm:self-auto"
          >
            Haut de page
            <span className="grid size-7 place-items-center rounded-full ring-1 ring-white/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:ring-brand-400">
              <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current stroke-[1.8]">
                <path d="M8 13V3m-4 4 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </Container>
    </footer>
  )
}
