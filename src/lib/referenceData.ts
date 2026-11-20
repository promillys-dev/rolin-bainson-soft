import { propertyKinds, sectors } from '@/config/search'
import { apiGet, isApiConfigured, warnFixtures } from '@/lib/api/client'

/**
 * Les listes du formulaire de recherche : types de bien et secteurs.
 *
 * Elles viennent du référentiel du back-office (`/reference-data`), calculé
 * sur le catalogue réel : on ne propose que des types et des communes où il y
 * a effectivement des biens. Les valeurs sont celles qu'attend le filtre de
 * l'API — le `slug` du type, le nom de la commune.
 */

export type SearchOption = { value: string; label: string }

export type SearchOptions = {
  kinds: readonly SearchOption[]
  sectors: readonly SearchOption[]
}

type ApiReferenceData = {
  data: {
    kinds: { label: string; slug: string }[]
    cities: { city: string; postalCode: string; count: number }[]
  }
}

export async function getSearchOptions(): Promise<SearchOptions> {
  if (!isApiConfigured) {
    warnFixtures()
    return {
      kinds: propertyKinds,
      sectors: sectors.map((sector) => ({ value: sector, label: sector })),
    }
  }

  const { data } = await apiGet<ApiReferenceData>('/reference-data', ['listings'])
  return {
    kinds: data.kinds.map((kind) => ({ value: kind.slug, label: kind.label })),
    sectors: data.cities.map((city) => ({
      value: city.city,
      label: `${city.city} (${city.count})`,
    })),
  }
}
