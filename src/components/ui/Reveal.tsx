'use client'

import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Révélation au défilement : fondu + légère montée quand l'élément entre dans
 * le champ.
 *
 * Deux garde-fous délibérés :
 *
 *  1. L'état « caché » n'est posé qu'après l'hydratation, via l'attribut
 *     `data-reveal-ready`. Sans JavaScript, ou le temps que le bundle arrive,
 *     le contenu reste visible. Une animation ne doit jamais être une
 *     condition d'affichage sur un site dont le référencement est le gagne-pain.
 *  2. `prefers-reduced-motion` coupe le mécanisme à la racine : on ne pose même
 *     pas l'état caché, donc rien ne bouge et rien ne clignote.
 *
 * Les deux attributs sont écrits directement sur le nœud plutôt que gérés en
 * état React : ils ne décrivent que de l'apparence, et les passer par un
 * `useState` déclencherait deux rendus en cascade par élément révélé — pour
 * une page qui en compte une vingtaine, ce n'est pas gratuit.
 *
 * L'observateur se débranche après le premier passage : ces sections ne
 * réapparaissent pas, inutile de garder un écouteur actif.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: ReactNode
  /** Décalage en millisecondes, pour les apparitions en cascade. */
  delay?: number
  as?: ElementType
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || typeof IntersectionObserver === 'undefined') return

    node.setAttribute('data-reveal-ready', '')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', '')
            observer.disconnect()
          }
        }
      },
      // Déclenche un peu avant que l'élément touche le bas de l'écran : le
      // mouvement se termine pendant que l'utilisateur arrive dessus.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={cn('reveal', className)}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
