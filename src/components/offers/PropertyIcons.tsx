import type { ReactElement, ReactNode } from 'react'
import type { PropertyFeatures } from '@/types/property'

/**
 * Pictogrammes d'équipement.
 *
 * Le site précédent en affichait quatre, construits à la volée dans
 * `getOptions()` : chambres, salles de bain, type de bien, voiture. On garde
 * le principe — un coup d'œil doit suffire — en l'élargissant aux équipements
 * que les visiteurs filtrent le plus (ascenseur, extérieur, cave).
 *
 * Tracés à la main en SVG inline plutôt qu'importés d'une bibliothèque : une
 * dizaine de glyphes de vingt lignes ne justifie pas une dépendance, et ils
 * héritent de `currentColor`.
 */

type IconProps = { className?: string }

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className ?? 'size-4 shrink-0'}>
      {children}
    </svg>
  )
}

export function AreaIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...stroke} d="M3 3v14h14" />
      <path {...stroke} d="M6 14V7h7" />
      <path {...stroke} d="M13 7 6 14" />
    </Svg>
  )
}

export function RoomsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...stroke} d="M3 17V8l7-5 7 5v9" />
      <path {...stroke} d="M3 17h14M10 17v-4M3 11h14" />
    </Svg>
  )
}

export function BedroomsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...stroke} d="M3 15V6M3 10h14v5M17 15v-2" />
      <path {...stroke} d="M3 15h14" />
      <circle {...stroke} cx="7" cy="8" r="1.6" />
    </Svg>
  )
}

export function BathroomsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...stroke} d="M3 11h14v2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" />
      <path {...stroke} d="M6 11V5a1.5 1.5 0 0 1 3 0" />
      <path {...stroke} d="M5.5 16.5 5 18M14.5 16.5 15 18" />
    </Svg>
  )
}

export function ElevatorIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect {...stroke} x="4" y="3" width="12" height="14" rx="1.5" />
      <path {...stroke} d="M10 3v14" />
      <path {...stroke} d="m7 9 1.2-1.5L9.4 9M12.8 11l-1.2 1.5L10.4 11" />
    </Svg>
  )
}

export function OutdoorIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...stroke} d="M3 12h14v5H3z" />
      <path {...stroke} d="M6 12V7h8v5M6 17v-5M10 17v-5M14 17v-5" />
    </Svg>
  )
}

export function CellarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...stroke} d="M4 17V8l6-5 6 5v9z" />
      <path {...stroke} d="M8 17v-4a2 2 0 1 1 4 0v4" />
    </Svg>
  )
}

export function CarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...stroke} d="M3 13h14v3h-2.5M3 16h3M3 13l1.8-4.5A2 2 0 0 1 6.7 7h6.6a2 2 0 0 1 1.9 1.5L17 13" />
      <circle {...stroke} cx="7" cy="16" r="1.4" />
      <circle {...stroke} cx="13" cy="16" r="1.4" />
    </Svg>
  )
}

export function FurnishedIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...stroke} d="M4 14V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6" />
      <path {...stroke} d="M3 14h14v2H3zM5 16v1.5M15 16v1.5" />
      <path {...stroke} d="M7 11h6" />
    </Svg>
  )
}

export function FloorIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...stroke} d="M3 17h3v-3h4V9h4V5h3" />
    </Svg>
  )
}

export type FeatureBadge = {
  key: string
  label: string
  Icon: (props: IconProps) => ReactElement
}

/**
 * Équipements à montrer pour un bien donné, dans l'ordre d'intérêt décroissant
 * pour un visiteur. Les champs absents ne produisent rien plutôt qu'une
 * mention « non renseigné », qui alourdirait la carte sans informer.
 */
export function featureBadges(features: PropertyFeatures): readonly FeatureBadge[] {
  const badges: FeatureBadge[] = []

  if (features.livingArea) {
    badges.push({ key: 'area', label: `${features.livingArea} m²`, Icon: AreaIcon })
  }
  if (features.rooms) {
    badges.push({
      key: 'rooms',
      label: `${features.rooms} ${features.rooms > 1 ? 'pièces' : 'pièce'}`,
      Icon: RoomsIcon,
    })
  }
  if (features.bedrooms) {
    badges.push({
      key: 'bedrooms',
      label: `${features.bedrooms} ch.`,
      Icon: BedroomsIcon,
    })
  }
  if (features.bathrooms) {
    badges.push({
      key: 'bathrooms',
      label: `${features.bathrooms} s. d’eau`,
      Icon: BathroomsIcon,
    })
  }
  if (features.hasElevator) {
    badges.push({ key: 'elevator', label: 'Ascenseur', Icon: ElevatorIcon })
  }
  if (features.hasTerrace || features.hasBalcony) {
    badges.push({
      key: 'outdoor',
      label: features.hasTerrace ? 'Terrasse' : 'Balcon',
      Icon: OutdoorIcon,
    })
  }
  if (features.hasCellar) {
    badges.push({ key: 'cellar', label: 'Cave', Icon: CellarIcon })
  }
  if (features.hasParking || features.hasGarage) {
    badges.push({
      key: 'car',
      label: features.hasGarage ? 'Garage' : 'Parking',
      Icon: CarIcon,
    })
  }
  if (features.isFurnished) {
    badges.push({ key: 'furnished', label: 'Meublé', Icon: FurnishedIcon })
  }

  return badges
}
