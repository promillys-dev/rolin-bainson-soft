import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Petite étiquette au-dessus d'un titre de section.
 *
 * Forme empruntée aux deux références : la pastille teintée de la maquette
 * CityScape (« ABOUT US ») et le libellé discret de cloudacc (« Nos services »).
 * Deux allures, un seul composant, pour ne pas multiplier les variantes.
 */
export function Eyebrow({
  children,
  variant = 'pill',
  className,
}: {
  children: ReactNode
  variant?: 'pill' | 'plain'
  className?: string
}) {
  if (variant === 'plain') {
    return (
      <p
        className={cn(
          'text-xs font-semibold tracking-[0.16em] text-brand-700 uppercase',
          className,
        )}
      >
        {children}
      </p>
    )
  }

  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-pill bg-brand-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-brand-700 uppercase',
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-500" />
      {children}
    </p>
  )
}
