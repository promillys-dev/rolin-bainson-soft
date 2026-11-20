'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { Logo } from '@/components/layout/Logo'
import { Container } from '@/components/ui/Container'
import { mainNav, serviceNav, type NavItem, type NavLink } from '@/config/navigation'
import { defaultNavPanel, navPanels } from '@/config/navPanels'
import { site } from '@/config/site'
import { LOGO_MARK, markPath } from '@/lib/logoMark'
import { cn } from '@/lib/utils'

/**
 * L'en-tête du site.
 *
 * Inspiré de la barre de Meta Energy (liens posés sur un rail, méga-menus en
 * « mini-bannières », menu mobile qui s'ouvre en cercle depuis son bouton),
 * mais redessiné sur le logo de la maison : ses deux panneaux dressés — le
 * petit sombre, le grand orange, chacun coupé en biais par le haut — donnent
 * la forme des vignettes, la page en cours est marquée par le monogramme
 * lui-même, et chaque filet est bicolore, noir puis orange, comme le logo.
 *
 * Fond blanc : le logo est dessiné pour lui.
 *
 * `nav` : la navigation principale. Par défaut, le menu codé de
 * `config/navigation.ts` — celui qu'affiche le site ; la mise en page peut lui
 * passer à la place celui du back-office (`getMainNav`, `lib/menus`).
 */

const CLOSE_DELAY = 160
const PHONE_HREF = `tel:${site.phone.replace(/\s/g, '')}`

/** Le coin haut coupé en biais, montant vers la droite, comme les panneaux du logo. */
const SLANT = 'polygon(0 9%, 100% 0, 100% 100%, 0 100%)'

/** Défilement de la page, sans état React : la barre se resserre passé 24 px. */
function subscribeScroll(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true })
  return () => window.removeEventListener('scroll', callback)
}
const getScrolled = () => window.scrollY > 24
const getScrolledOnServer = () => false

const MARK_INK = markPath(LOGO_MARK.ink, (point) => point)
const MARK_BRAND = markPath(LOGO_MARK.brand, (point) => point)

/** Le monogramme du logo, en petit. */
function Monogram({ className, tone = 'brand' }: { className?: string; tone?: 'brand' | 'mono' }) {
  return (
    <svg aria-hidden="true" viewBox="10 19 62 81" className={className}>
      <path d={MARK_INK} className={tone === 'brand' ? 'fill-ink-900' : 'fill-current'} />
      <path d={MARK_BRAND} className={tone === 'brand' ? 'fill-brand-500' : 'fill-current'} />
    </svg>
  )
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={cn('fill-none stroke-current stroke-[1.6]', className)}>
      <path d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Buste et épaules : l'espace client est un compte, pas une page. */
function Person({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={cn('fill-none stroke-current stroke-[1.5]', className)}>
      <circle cx="8" cy="5" r="2.6" />
      <path d="M2.8 13.4a5.2 5.2 0 0 1 10.4 0" strokeLinecap="round" />
    </svg>
  )
}

function Chevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn(
        'fill-none stroke-current stroke-[1.75] transition-transform duration-300',
        open && 'rotate-180',
        className,
      )}
    >
      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Le filet bicolore du logo : un court segment noir, puis l'orange. */
function BrandRule({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('flex h-[3px] w-full', className)}>
      <span className="w-[22%] bg-ink-900" />
      <span className="flex-1 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300" />
    </span>
  )
}

const panelOf = (link: NavLink) => navPanels[link.href] ?? defaultNavPanel
const pad = (index: number) => String(index + 1).padStart(2, '0')

/* -------------------------------------------------------------------------- */
/* Méga-menu                                                                  */
/* -------------------------------------------------------------------------- */

function MegaPanel({
  id,
  item,
  focused,
  onFocusChild,
  isActive,
}: {
  id: string
  item: NavItem
  focused: number
  onFocusChild: (index: number) => void
  isActive: (href: string) => boolean
}) {
  const children = item.children ?? []
  const current = children[focused] ?? children[0]
  if (!current) return null
  const info = panelOf(current)
  // « Vue d'ensemble » n'a de sens que si la rubrique a sa propre page.
  const overview = children.some((child) => child.href === item.href) ? null : item.href

  return (
    <div id={id} className="animate-rise absolute inset-x-0 top-full pt-3">
      <Container width="wide">
        <div className="overflow-hidden rounded-panel bg-white shadow-float ring-1 ring-ink-900/5">
          <BrandRule />
          <div className="grid gap-8 p-6 lg:grid-cols-12 xl:p-8">
            {/* Colonne de gauche : l'entrée survolée, en toutes lettres. */}
            <div className="flex flex-col lg:col-span-4">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-ink-400 uppercase">
                <span className="size-1.5 rounded-full bg-brand-500" />
                {item.label}
                <span className="text-ink-300">· {pad(children.length - 1)}</span>
              </p>

              <div key={current.href} className="animate-fade mt-5 flex-1">
                <p className="text-sm font-medium text-brand-600">{info.kicker}</p>
                <h2 className="mt-1 font-display text-[1.75rem] leading-tight font-semibold text-ink-900">
                  {current.label}
                </h2>
                <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-ink-500">{info.text}</p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link
                  href={current.href}
                  className="group/btn inline-flex h-11 items-center gap-2 rounded-pill bg-ink-900 px-5 text-[0.9375rem] font-medium text-white transition-all duration-300 ease-[var(--ease-out-soft)] hover:bg-brand-500 hover:shadow-raised"
                >
                  Découvrir
                  <Arrow className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
                {overview ? (
                  <Link
                    href={overview}
                    className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-ink-700 transition-colors hover:text-brand-600"
                  >
                    Vue d’ensemble
                    <Arrow className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                ) : null}
              </div>
            </div>

            {/* Colonne de droite : les vignettes, dressées en escalier comme les
                panneaux du logo, du plus bas au plus haut. */}
            <ul className="flex h-64 items-end gap-3 lg:col-span-8 xl:h-72">
              {children.map((child, index) => {
                const childInfo = panelOf(child)
                const lit = index === focused
                const active = isActive(child.href)
                const step = children.length - 1 - index
                return (
                  <li
                    key={child.href}
                    className="animate-rise h-full min-w-0 flex-1"
                    style={{ animationDelay: `${60 + index * 70}ms`, paddingTop: `${step * 0.9}rem` }}
                  >
                    <Link
                      href={child.href}
                      onMouseEnter={() => onFocusChild(index)}
                      onFocus={() => onFocusChild(index)}
                      aria-current={active ? 'page' : undefined}
                      className="group/tile relative flex h-full flex-col justify-end overflow-hidden text-white"
                      style={{ clipPath: SLANT }}
                    >
                      <Image
                        src={childInfo.image}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 18rem, 14rem"
                        className={cn(
                          'object-cover transition-transform duration-700 ease-[var(--ease-out-soft)]',
                          lit ? 'scale-105' : 'scale-100',
                        )}
                        style={{ objectPosition: childInfo.position ?? '50% 50%' }}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-0 bg-gradient-to-t transition-opacity duration-500',
                          lit
                            ? 'from-ink-900/90 via-ink-900/35 to-ink-900/0'
                            : 'from-ink-900/85 via-ink-900/55 to-ink-900/30',
                        )}
                      />
                      <span className="absolute top-6 left-4 font-display text-xs font-semibold tracking-[0.2em] text-white/70">
                        {pad(index)}
                      </span>
                      {active ? (
                        <span className="absolute top-5 right-4 rounded-pill bg-white/90 px-2 py-0.5 text-[0.6875rem] font-semibold text-ink-900">
                          Vous êtes ici
                        </span>
                      ) : null}

                      <span className="relative px-4 pb-5">
                        <span className="block text-[0.6875rem] font-semibold tracking-[0.16em] text-brand-300 uppercase">
                          {childInfo.kicker}
                        </span>
                        <span className="mt-1 flex items-end justify-between gap-2">
                          <span className="font-display text-lg leading-snug font-semibold">{child.label}</span>
                          <span
                            className={cn(
                              'inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                              lit ? 'bg-brand-500 text-white' : 'bg-white/15 text-white/80',
                            )}
                          >
                            <Arrow className="size-3.5" />
                          </span>
                        </span>
                      </span>

                      {/* Le pied orange du grand panneau, qui s'allonge au survol. */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-x-0 bottom-0 h-1 origin-left bg-brand-500 transition-transform duration-500 ease-[var(--ease-out-soft)]',
                          lit ? 'scale-x-100' : 'scale-x-0',
                        )}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* En-tête                                                                    */
/* -------------------------------------------------------------------------- */

export function SiteHeader({ nav = mainNav }: { nav?: readonly NavItem[] }) {
  const pathname = usePathname()
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, getScrolledOnServer)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [focused, setFocused] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const railRef = useRef<HTMLUListElement>(null)
  const glideRef = useRef<HTMLSpanElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  const isActive = (href: string) => {
    const path = href.split('?')[0] ?? href
    if (path === '/') return pathname === '/'
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Fermer les menus à chaque changement de page. Ajustement d'état pendant le
  // rendu plutôt qu'un useEffect : pas de rendu en cascade, et le menu n'est
  // jamais affiché ouvert une frame de trop.
  const [renderedPath, setRenderedPath] = useState(pathname)
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setOpenMenu(null)
    setDrawerOpen(false)
  }

  function cancelClose() {
    window.clearTimeout(closeTimer.current)
  }
  function scheduleClose() {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), CLOSE_DELAY)
  }
  function openPanel(item: NavItem) {
    cancelClose()
    if (openMenu === item.label) return
    const children = item.children ?? []
    const activeIndex = children.findIndex((child) => isActive(child.href))
    setFocused(Math.max(0, activeIndex))
    setOpenMenu(item.label)
  }

  /** Le trait orange glisse jusqu'au lien survolé. Pas d'état : du style. */
  function glideTo(target: HTMLElement | null) {
    const rail = railRef.current
    const glide = glideRef.current
    if (!rail || !glide) return
    if (!target) {
      glide.style.opacity = '0'
      return
    }
    const from = rail.getBoundingClientRect()
    const box = target.getBoundingClientRect()
    const width = Math.max(18, box.width - 28)
    glide.style.width = `${width}px`
    glide.style.transform = `translateX(${box.left - from.left + (box.width - width) / 2}px)`
    glide.style.opacity = '1'
  }

  // Échap ferme tout.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpenMenu(null)
      setDrawerOpen((open) => {
        if (open) toggleRef.current?.focus()
        return false
      })
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Menu mobile ouvert : la page dessous ne défile plus.
  useEffect(() => {
    if (!drawerOpen) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [drawerOpen])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  function toggleDrawer() {
    if (!drawerOpen) {
      const box = toggleRef.current?.getBoundingClientRect()
      if (box) setOrigin({ x: box.left + box.width / 2, y: box.top + box.height / 2 })
    }
    setDrawerOpen((open) => !open)
  }

  const openItem = nav.find((item) => item.label === openMenu && item.children?.length)
  const overlayOrigin = origin ? `${origin.x}px ${origin.y}px` : 'calc(100% - 2.25rem) 2rem'

  return (
    <>
      <header
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className={cn(
          'sticky top-0 z-50 bg-white transition-shadow duration-500',
          scrolled || openItem
            ? 'shadow-[0_12px_32px_-20px_rgb(21_18_15/0.35)]'
            : 'shadow-[inset_0_-1px_0_rgb(21_18_15/0.08)]',
        )}
      >
        <Container
          width="wide"
          className={cn(
            'flex items-center justify-between gap-6 transition-[height] duration-500 ease-[var(--ease-out-soft)]',
            scrolled ? 'h-16' : 'h-16 lg:h-[4.75rem]',
          )}
        >
          <div
            className={cn(
              'origin-left transition-transform duration-500 ease-[var(--ease-out-soft)]',
              scrolled && 'lg:scale-90',
            )}
          >
            <Logo priority />
          </div>

          {/* Navigation bureau : les liens posés sur un rail. */}
          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul
              ref={railRef}
              onMouseLeave={() => glideTo(null)}
              className="relative flex items-center gap-1 xl:gap-2"
            >
              <span aria-hidden="true" className="absolute inset-x-3 -bottom-2 h-px bg-ink-900/[0.08]" />
              <span
                ref={glideRef}
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-[3px] w-6 translate-y-px rounded-full bg-brand-500 opacity-0 shadow-[0_0_12px_rgb(229_112_58/0.65)] transition-[transform,width,opacity] duration-500 ease-[var(--ease-out-soft)] motion-reduce:transition-none"
              />

              {nav.map((item) => {
                const hasChildren = Boolean(item.children?.length)
                const open = openMenu === item.label && hasChildren
                const active =
                  isActive(item.href) || Boolean(item.children?.some((child) => isActive(child.href)))
                const label = cn(
                  'relative inline-flex items-center gap-1.5 rounded-pill px-3.5 py-2 text-[0.9375rem] font-medium transition-colors duration-300',
                  open ? 'text-brand-600' : active ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900',
                )
                // Sur le rail : un point par lien, le monogramme sous la page en cours.
                const marker = active ? (
                  <Monogram className="absolute -bottom-2 left-1/2 h-3.5 -translate-x-1/2 translate-y-1/2" />
                ) : (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -bottom-2 left-1/2 size-1 -translate-x-1/2 translate-y-1/2 rounded-full transition-colors duration-300',
                      open ? 'bg-brand-500' : 'bg-ink-300',
                    )}
                  />
                )

                return (
                  <li
                    key={item.label}
                    onMouseEnter={(event) => {
                      glideTo(event.currentTarget)
                      if (hasChildren) openPanel(item)
                      else {
                        cancelClose()
                        setOpenMenu(null)
                      }
                    }}
                  >
                    {hasChildren ? (
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={open ? panelId : undefined}
                        onClick={() => (open ? setOpenMenu(null) : openPanel(item))}
                        className={label}
                      >
                        {item.label}
                        <Chevron open={open} className="size-3.5" />
                        {marker}
                      </button>
                    ) : (
                      <Link href={item.href} aria-current={active ? 'page' : undefined} className={label}>
                        {item.label}
                        {marker}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Accès client : l'extranet H2I, un service tiers. Il vivait dans
              la barre noire au-dessus du logo ; celle-ci retirée, il remonte
              ici. Dessiné en second plan — c'est l'entrée quotidienne des
              copropriétaires, pas l'appel à l'action du site. */}
          <a
            href={site.clientAreaUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden h-11 items-center gap-2 rounded-pill border border-ink-900/15 px-4 text-[0.9375rem] font-medium text-ink-900 transition-colors duration-300 ease-[var(--ease-out-soft)] hover:border-brand-500 hover:text-brand-600 lg:inline-flex"
          >
            <Person className="size-4 shrink-0" />
            Accès client
            <span className="sr-only">(ouvre l’extranet dans un nouvel onglet)</span>
          </a>

          {/* Appel à l'action bureau : le réflexe d'une agence, être joignable. */}
          <Link
            href="/contact"
            className="group/btn hidden h-11 items-center gap-2.5 rounded-pill bg-ink-900 py-1 pr-1.5 pl-5 text-[0.9375rem] font-medium text-white transition-all duration-300 ease-[var(--ease-out-soft)] hover:bg-brand-500 hover:shadow-raised lg:inline-flex"
          >
            Nous contacter
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-500 transition-colors duration-300 group-hover/btn:bg-white group-hover/btn:text-brand-600">
              <Arrow className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </span>
          </Link>

          {/* Bouton du menu mobile */}
          <button
            ref={toggleRef}
            type="button"
            onClick={toggleDrawer}
            aria-expanded={drawerOpen}
            aria-controls="menu-mobile"
            className="inline-flex h-10 items-center gap-2 rounded-pill border border-ink-900/10 pr-1 pl-3.5 text-sm font-medium text-ink-900 transition-colors duration-300 hover:border-ink-900/25 lg:hidden"
          >
            Menu
            <span className="inline-flex size-8 flex-col items-center justify-center gap-[3px] rounded-full bg-ink-900">
              <span className="h-[1.5px] w-3.5 rounded-full bg-white" />
              <span className="h-[1.5px] w-3.5 rounded-full bg-brand-400" />
            </span>
            <span className="sr-only">Ouvrir le menu</span>
          </button>
        </Container>

        {openItem ? (
          <MegaPanel
            id={panelId}
            item={openItem}
            focused={focused}
            onFocusChild={setFocused}
            isActive={isActive}
          />
        ) : null}
      </header>

      {/* Voile sous le méga-menu : y entrer, c'est le fermer. */}
      <div
        aria-hidden="true"
        onMouseEnter={() => setOpenMenu(null)}
        onClick={() => setOpenMenu(null)}
        className={cn(
          'fixed inset-0 z-40 hidden bg-ink-900/25 transition-opacity duration-500 lg:block',
          openItem ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Menu mobile : plein écran, ouvert en cercle depuis son bouton. */}
      <div
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
        className={cn(
          'fixed inset-0 z-[60] overflow-hidden bg-white transition-[clip-path,visibility] duration-700 ease-[var(--ease-out-soft)] motion-reduce:transition-none lg:hidden',
          drawerOpen ? 'visible' : 'invisible',
        )}
        style={
          {
            clipPath: drawerOpen
              ? `circle(150% at ${overlayOrigin})`
              : `circle(0px at ${overlayOrigin})`,
          } as CSSProperties
        }
      >
        {/* Le monogramme en filigrane. */}
        <Monogram
          tone="mono"
          className="pointer-events-none absolute -right-16 -bottom-10 h-[26rem] text-ink-900/[0.04]"
        />
        <BrandRule className="absolute inset-x-0 top-0" />

        <div className="relative flex h-full flex-col">
          <Container width="wide" className="flex h-16 shrink-0 items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={toggleDrawer}
              className="inline-flex h-10 items-center gap-2 rounded-pill border border-ink-900/10 pr-1 pl-3.5 text-sm font-medium text-ink-900"
            >
              Fermer
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-500 text-white">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current stroke-[1.75]">
                  <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
                </svg>
              </span>
            </button>
          </Container>

          <div className="flex-1 overflow-y-auto overscroll-contain pb-10">
            <Container width="wide">
              <nav aria-label="Navigation principale">
                <ul className="divide-y divide-ink-900/[0.07] border-y border-ink-900/[0.07]">
                  {nav.map((item, index) => {
                    const children = item.children ?? []
                    const isOpen = expanded === item.label
                    const active =
                      isActive(item.href) || children.some((child) => isActive(child.href))
                    return (
                      <li
                        key={item.label}
                        className={cn(
                          'transition-[opacity,translate] duration-500 ease-[var(--ease-out-soft)]',
                          drawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                        )}
                        style={{ transitionDelay: drawerOpen ? `${180 + index * 60}ms` : '0ms' }}
                      >
                        <div className="flex items-center gap-4 py-4">
                          <span className="w-6 font-display text-xs font-semibold tracking-[0.15em] text-brand-500">
                            {pad(index)}
                          </span>
                          {children.length ? (
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              onClick={() => setExpanded(isOpen ? null : item.label)}
                              className="flex flex-1 items-center justify-between gap-3 text-left"
                            >
                              <span
                                className={cn(
                                  'font-display text-2xl font-semibold',
                                  active || isOpen ? 'text-ink-900' : 'text-ink-700',
                                )}
                              >
                                {item.label}
                              </span>
                              <span
                                className={cn(
                                  'inline-flex size-9 items-center justify-center rounded-full transition-colors duration-300',
                                  isOpen ? 'bg-ink-900 text-white' : 'bg-ink-900/5 text-ink-700',
                                )}
                              >
                                <Chevron open={isOpen} className="size-4" />
                              </span>
                            </button>
                          ) : (
                            <Link
                              href={item.href}
                              className="flex flex-1 items-center justify-between gap-3"
                            >
                              <span className="font-display text-2xl font-semibold text-ink-700">
                                {item.label}
                              </span>
                              {active ? <Monogram className="h-5" /> : null}
                            </Link>
                          )}
                        </div>

                        {children.length ? (
                          <div
                            className={cn(
                              'grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-soft)]',
                              isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                            )}
                          >
                            <ul className="min-h-0 overflow-hidden">
                              {children.map((child) => {
                                const childInfo = panelOf(child)
                                return (
                                  <li key={child.href} className="pb-3 pl-10">
                                    <Link
                                      href={child.href}
                                      tabIndex={isOpen ? undefined : -1}
                                      className="flex items-center gap-3 rounded-card p-1.5 transition-colors hover:bg-brand-50"
                                    >
                                      <span
                                        className="relative h-12 w-10 shrink-0 overflow-hidden"
                                        style={{ clipPath: SLANT }}
                                      >
                                        <Image
                                          src={childInfo.image}
                                          alt=""
                                          fill
                                          sizes="40px"
                                          className="object-cover"
                                          style={{ objectPosition: childInfo.position ?? '50% 50%' }}
                                        />
                                      </span>
                                      <span className="min-w-0">
                                        <span className="block font-medium text-ink-900">{child.label}</span>
                                        <span className="block truncate text-xs text-ink-400">
                                          {child.description ?? childInfo.kicker}
                                        </span>
                                      </span>
                                      {isActive(child.href) ? (
                                        <Monogram className="ml-auto h-4 shrink-0" />
                                      ) : null}
                                    </Link>
                                  </li>
                                )
                              })}
                              {!children.some((child) => child.href === item.href) ? (
                                <li className="pb-4 pl-10">
                                  <Link
                                    href={item.href}
                                    tabIndex={isOpen ? undefined : -1}
                                    className="inline-flex items-center gap-1.5 px-1.5 text-sm font-medium text-brand-600"
                                  >
                                    Vue d’ensemble
                                    <Arrow className="size-3.5" />
                                  </Link>
                                </li>
                              ) : null}
                            </ul>
                          </div>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <div
                className={cn(
                  'mt-8 transition-[opacity,translate] duration-500 ease-[var(--ease-out-soft)]',
                  drawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                )}
                style={{ transitionDelay: drawerOpen ? `${220 + nav.length * 60}ms` : '0ms' }}
              >
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/contact"
                    className="flex h-12 items-center justify-center gap-2 rounded-pill bg-ink-900 font-medium text-white"
                  >
                    Nous contacter
                    <Arrow className="size-4" />
                  </Link>
                  <a
                    href={site.clientAreaUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex h-12 items-center justify-center rounded-pill bg-brand-500 font-medium text-white"
                  >
                    Accès client
                  </a>
                </div>

                <a
                  href={PHONE_HREF}
                  className="mt-3 flex items-center justify-between rounded-card border border-ink-900/[0.08] px-4 py-3"
                >
                  <span>
                    <span className="block text-xs text-ink-400">Une question ? Appelez-nous</span>
                    <span className="font-display text-lg font-semibold text-ink-900">{site.phone}</span>
                  </span>
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 fill-current">
                      <path d="M5.2 2.3a1 1 0 0 0-1.3-.2l-1 .7a2 2 0 0 0-.7 2.4 15 15 0 0 0 8.6 8.6 2 2 0 0 0 2.4-.7l.7-1a1 1 0 0 0-.2-1.3l-2-1.5a1 1 0 0 0-1.2 0l-.8.6a10.6 10.6 0 0 1-3.6-3.6l.6-.8a1 1 0 0 0 0-1.2z" />
                    </svg>
                  </span>
                </a>

                <ul className="mt-3 grid grid-cols-2 gap-2">
                  {serviceNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 rounded-card bg-surface-muted px-3 py-3 text-sm font-medium text-ink-700"
                      >
                        <span className="size-1.5 rounded-full bg-brand-500" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </>
  )
}
