import Image from 'next/image'
import { PropertyPhoto } from '@/components/offers/PropertyPhoto'
import type { Property } from '@/types/property'

/**
 * Galerie d'une annonce.
 *
 * Mosaïque plutôt que diaporama : sans JavaScript, un carrousel n'affiche que
 * sa première vue, alors qu'une mosaïque montre tout de suite ce qu'il y a à
 * voir. Les photos arrivent déjà triées par `ofat_ordre` côté import ; l'ordre
 * du tableau est donc significatif et n'est pas retouché ici.
 *
 * Le jour où la médiathèque sera branchée, c'est le seul endroit à reprendre
 * pour ajouter un agrandissement au clic.
 */
export function Gallery({ property }: { property: Property }) {
  const [cover, ...rest] = property.media
  const extras = rest.slice(0, 4)

  if (!cover) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-panel border border-line">
        <PropertyPhoto property={property} sizes="100vw" priority />
      </div>
    )
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-line sm:col-span-2 sm:aspect-[3/2]">
        <Image
          src={cover.url}
          alt={cover.alt}
          fill
          priority
          sizes="(min-width: 640px) 60vw, 100vw"
          className="object-cover"
        />
      </div>

      {extras.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-1">
          {extras.map((photo) => (
            <li
              key={photo.url}
              className="relative aspect-[4/3] overflow-hidden rounded-card border border-line"
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 20vw, 50vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
