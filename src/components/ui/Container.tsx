import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Deux largeurs, et pas une de plus.
 *
 * `default` cadre le texte courant : au-delà, les lignes deviennent trop
 * longues pour être lues confortablement. `wide` est réservé aux compositions
 * qui respirent mal dans cette laisse — la bannière, dont le texte et la
 * scène animée se partagent la largeur et se retrouvaient tassés au centre
 * sur un grand écran.
 *
 * La largeur est choisie par une propriété plutôt que par une classe passée
 * de l'extérieur : deux `max-w-*` sur le même élément se départagent dans
 * l'ordre de la feuille de style, pas dans celui du code, et le résultat
 * dépendrait alors du hasard de la compilation.
 */
const widths = {
  default: 'max-w-6xl',
  wide: 'max-w-[84rem]',
} as const

export function Container({
  children,
  className,
  width = 'default',
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  width?: keyof typeof widths
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main'
}) {
  return (
    <Tag className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', widths[width], className)}>
      {children}
    </Tag>
  )
}
