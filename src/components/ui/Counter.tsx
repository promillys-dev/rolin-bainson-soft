'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Compteur qui s'incrémente quand il entre dans le champ.
 *
 * Reprend la légende chiffrée de la carte de l'ancienne page d'accueil
 * (« 12 biens en location », « 9 biens en vente », « 3 agences »), qui était
 * statique.
 *
 * La valeur finale est rendue côté serveur dans le HTML : elle est donc
 * indexable et lisible sans JavaScript. L'animation ne fait que remplacer
 * temporairement ce qui est déjà là.
 */
export function Counter({ value, duration = 1100 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || typeof IntersectionObserver === 'undefined') return

    let frame = 0
    let start: number | null = null

    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // Même courbe que --ease-out-soft : départ rapide, arrivée posée.
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setDisplay(0)
            frame = requestAnimationFrame(step)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}
