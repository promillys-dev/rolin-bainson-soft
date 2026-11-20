import { site, type Agency } from '@/config/site'

/**
 * Données structurées `RealEstateAgent`.
 *
 * Absentes du site précédent. C'est le balisage qui permet à une agence
 * d'apparaître correctement dans les résultats locaux : adresse, téléphone et
 * horaires lus sans interprétation de la page.
 *
 * Les horaires sont stockés en base legacy sous forme de PHRASES
 * (« Du lundi au jeudi : 9h–11h30 et 13h30–17h30 »), pas de créneaux
 * structurés. On ne peut donc pas produire d'`openingHoursSpecification`
 * fiable sans réinterpréter du texte libre : on publie `openingHours` en
 * clair, et la structuration viendra quand l'API servira des créneaux.
 */
export function AgencyJsonLd({ agency }: { agency: Agency }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: agency.name,
    parentOrganization: { '@type': 'Organization', name: site.legalName },
    address: {
      '@type': 'PostalAddress',
      streetAddress: agency.address,
      postalCode: agency.postalCode,
      addressLocality: agency.city,
      addressCountry: 'FR',
    },
    telephone: agency.phone,
    email: agency.email,
    ...(agency.coordinates
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: agency.coordinates.lat,
            longitude: agency.coordinates.lng,
          },
        }
      : {}),
    ...(agency.openingHours.length > 0 ? { openingHours: agency.openingHours } : {}),
    areaServed: ['Lyon', 'Villeurbanne'],
    knowsLanguage: 'fr',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  )
}
