import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/utils'

/**
 * Titre de section. Grand, serré, avec une étiquette au-dessus — le rythme
 * commun aux deux références de design.
 *
 * Le trait de la bannière — un filet orange qui descend le long du titre et
 * se termine par une boule dont l'écho se propage — accompagne par défaut
 * les titres alignés à gauche. Repris de section en section et de page en
 * page, il relie tout le site à son accueil. `rule={false}` le retire.
 */
export function SectionHeading({
  eyebrow,
  eyebrowVariant = 'pill',
  title,
  description,
  align = 'left',
  rule,
  className,
}: {
  eyebrow?: string
  eyebrowVariant?: 'pill' | 'plain'
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  rule?: boolean
  className?: string
}) {
  const withRule = rule ?? align === 'left'

  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <Eyebrow variant={eyebrowVariant} className="mb-4">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <div className={cn(withRule && 'relative pl-5 sm:pl-6')}>
        {withRule ? (
          <span aria-hidden="true" className="absolute top-1.5 bottom-1 left-0 w-[3px]">
            <span className="absolute inset-x-0 top-0 bottom-2.5 rounded-full bg-linear-to-b from-brand-400/15 via-brand-400 to-brand-500" />
            <span className="absolute bottom-0 left-1/2 block size-2.5 -translate-x-1/2">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/60" />
              <span className="absolute inset-0 rounded-full bg-brand-500 ring-4 ring-brand-400/15" />
            </span>
          </span>
        ) : null}
        <h2 className="text-[1.75rem] leading-[1.1] font-semibold sm:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-ink-500">{description}</p>
        ) : null}
      </div>
    </div>
  )
}
