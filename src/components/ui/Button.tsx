import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Boutons pilule.
 *
 * La forme vient de cloudacc (pilule noire, chevron qui glisse au survol) ;
 * `accent` reprend le dégradé orange du bouton de recherche de la maquette
 * CityScape, réservé à l'action principale d'une page — en pratique, lancer
 * une recherche de bien.
 */
type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'inverse'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group/btn inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-ink-900 text-white hover:bg-ink-700 hover:shadow-raised',
  accent:
    'bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-card hover:from-brand-600 hover:to-brand-700 hover:shadow-raised',
  outline:
    'border border-line-strong bg-surface text-ink-800 hover:border-ink-900 hover:bg-ink-900 hover:text-white',
  ghost: 'text-ink-800 hover:text-brand-700',
  inverse: 'bg-white text-ink-900 hover:bg-brand-50',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-13 px-7 text-base',
}

function classes(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

/** Chevron qui avance de quelques pixels au survol du bouton parent. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn(
        'size-4 shrink-0 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover/btn:translate-x-1',
        className,
      )}
    >
      <path
        d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ComponentProps<'button'> & { variant?: Variant; size?: Size }) {
  return <button className={classes(variant, size, className)} {...props} />
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  external,
  children,
}: {
  href: string
  variant?: Variant
  size?: Size
  className?: string
  external?: boolean
  children: ReactNode
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={classes(variant, size, className)}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes(variant, size, className)}>
      {children}
    </Link>
  )
}

/** Lien de section discret : libellé souligné à l'apparition du chevron. */
export function ArrowLink({
  href,
  children,
  className,
  external,
  tabIndex,
}: {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
  /** -1 sort le lien du parcours clavier, pour les vues masquées d'un diaporama. */
  tabIndex?: number
}) {
  const content = (
    <>
      <span className="bg-linear-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-400 ease-[var(--ease-out-soft)] group-hover/btn:bg-[length:100%_1px]">
        {children}
      </span>
      <ArrowIcon />
    </>
  )

  const cls = cn(
    'group/btn inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-ink-900 transition-colors hover:text-brand-700',
    className,
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cls} tabIndex={tabIndex}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={cls} tabIndex={tabIndex}>
      {content}
    </Link>
  )
}
