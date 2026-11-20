import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Property } from '@/types/property'

/**
 * Visuel d'une annonce, avec son substitut.
 *
 * La médiathèque du site précédent — 9 237 JPEG, certains de 6 à 7 Mo — n'est
 * pas encore triée ni recompressée, et le flux ConvertImmo n'est pas branché :
 * aucune annonce n'a de photo aujourd'hui. Plutôt qu'une image d'illustration
 * qui ferait croire le chantier terminé, on affiche un substitut explicite.
 *
 * Sa teinte est dérivée de la référence, donc stable d'un rendu à l'autre : une
 * grille de résultats ne doit pas ressembler à un damier aléatoire qui change
 * à chaque visite.
 */

const tints = ['bg-tint-sand', 'bg-tint-sage', 'bg-tint-sky', 'bg-tint-clay'] as const

function tintFor(reference: string): string {
  let sum = 0
  for (const char of reference) sum += char.charCodeAt(0)
  return tints[sum % tints.length] ?? tints[0]
}

export function PropertyPhoto({
  property,
  className,
  sizes,
  priority,
}: {
  property: Property
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const photo = property.media[0]

  if (photo) {
    return (
      <Image
        src={photo.url}
        alt={photo.alt}
        fill
        sizes={sizes ?? '(min-width: 1024px) 24rem, 100vw'}
        priority={priority}
        className={cn('object-cover', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-2',
        tintFor(property.reference),
        className,
      )}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true" className="size-9 text-ink-900/25">
        <path
          d="M6 42V20L24 7l18 13v22z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M18 42V28h12v14M14 24h4M30 24h4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[0.6875rem] font-medium tracking-[0.1em] text-ink-400 uppercase">
        Photo à venir
      </span>
    </div>
  )
}
