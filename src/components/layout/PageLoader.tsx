'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { LOGO_MARK, markPath } from '@/lib/logoMark'
import { PAGE_CHANGE_EVENT, PAGE_LOADER_MIN, type PageChangeDetail } from '@/lib/pageTransition'

/**
 * Le loader de changement de page : un voile blanc, et au milieu le
 * monogramme du logo qui se remplit, le petit panneau sombre puis le grand
 * orange.
 *
 * Il dit au visiteur que la page a changé. Il apparaît dès le départ d'une
 * navigation et reste au moins `PAGE_LOADER_MIN` (1 s) ; si la nouvelle page
 * met plus longtemps, il attend qu'elle soit là. Le monogramme est plein à
 * 1 s, puis se vide et se remplit tant que la page se fait attendre.
 *
 * Les formulaires de recherche sont de vrais `<form method="get">` qui
 * rechargent la page : le loader s'affiche à l'envoi et reste jusqu'à ce que
 * le navigateur montre la page suivante.
 *
 * Pas d'état React : le routeur signale le départ depuis sa propre
 * transition, et un `setState` fait là n'apparaîtrait qu'avec la nouvelle
 * page. Le voile est donc toujours dans le DOM, et c'est un attribut posé
 * sur `<html>` (`data-page-loader`) qui le montre, tout de suite.
 */

const FADE_OUT = 350
/** Filet de sécurité : une navigation abandonnée ne laisse pas le voile en place. */
const GIVE_UP = 8000

const MARK_INK = markPath(LOGO_MARK.ink, (point) => point)
const MARK_BRAND = markPath(LOGO_MARK.brand, (point) => point)

export function PageLoader() {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const startedAt = useRef<number | null>(null)
  const timers = useRef<number[]>([])
  const status = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const clear = () => {
      timers.current.forEach((id) => window.clearTimeout(id))
      timers.current = []
    }
    const reset = () => {
      clear()
      startedAt.current = null
      delete root.dataset.pageLoader
      if (status.current) status.current.textContent = ''
    }
    const show = (giveUp: boolean) => {
      clear()
      startedAt.current = performance.now()
      root.dataset.pageLoader = 'shown'
      if (status.current) status.current.textContent = 'Chargement de la page'
      if (giveUp) timers.current.push(window.setTimeout(reset, GIVE_UP))
    }

    const onPageChange = (event: Event) => {
      const { url } = (event as CustomEvent<PageChangeDetail>).detail
      const target = new URL(url, window.location.href)
      const here = window.location
      // Même page (lien vers la page en cours, ancre) : rien ne change.
      if (target.pathname === here.pathname && target.search === here.search) return
      show(true)
    }

    // Écouté sur `window`, donc après React : un formulaire que React a pris
    // en charge (action serveur) est déjà marqué `defaultPrevented`.
    const onSubmit = (event: SubmitEvent) => {
      const form = event.target
      if (event.defaultPrevented || !(form instanceof HTMLFormElement)) return
      if (form.method !== 'get' || (form.target && form.target !== '_self')) return
      show(false)
    }

    // Retour par le cache du navigateur : la page revient telle qu'on l'a
    // quittée, voile compris.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) reset()
    }

    window.addEventListener(PAGE_CHANGE_EVENT, onPageChange)
    window.addEventListener('submit', onSubmit)
    window.addEventListener('pageshow', onPageShow)
    return () => {
      reset()
      window.removeEventListener(PAGE_CHANGE_EVENT, onPageChange)
      window.removeEventListener('submit', onSubmit)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [])

  // La nouvelle page est là : on lève le voile, pas avant la durée minimale.
  useEffect(() => {
    if (startedAt.current === null) return
    const root = document.documentElement
    const wait = Math.max(0, startedAt.current + PAGE_LOADER_MIN - performance.now())
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = [
      window.setTimeout(() => {
        startedAt.current = null
        root.dataset.pageLoader = 'leaving'
        if (status.current) status.current.textContent = ''
        timers.current = [window.setTimeout(() => delete root.dataset.pageLoader, FADE_OUT)]
      }, wait),
    ]
  }, [pathname, search])

  return (
    <>
      <div
        aria-hidden="true"
        className="page-loader fixed inset-0 z-[90] place-items-center bg-white/85 backdrop-blur-[3px]"
      >
        <div className="flex flex-col items-center gap-4">
          <svg viewBox="10 19 62 81" className="h-16 w-auto overflow-visible">
            <defs>
              <clipPath id="page-loader-ink">
                <rect className="page-loader-fill" x="10" y="19" width="62" height="81" />
              </clipPath>
              <clipPath id="page-loader-brand">
                <rect className="page-loader-fill page-loader-fill-brand" x="10" y="19" width="62" height="81" />
              </clipPath>
            </defs>
            {/* Le logo en creux, puis le logo plein qui monte dedans. */}
            <path d={MARK_INK} className="fill-ink-900/10" />
            <path d={MARK_BRAND} className="fill-brand-500/15" />
            <path d={MARK_INK} clipPath="url(#page-loader-ink)" className="fill-ink-900" />
            <path d={MARK_BRAND} clipPath="url(#page-loader-brand)" className="fill-brand-500" />
          </svg>
          <span className="font-display text-xs font-medium tracking-[0.28em] text-ink-900/70 uppercase">
            Rolin Bainson
          </span>
        </div>
      </div>
      <span ref={status} role="status" aria-live="polite" className="sr-only" />
    </>
  )
}
