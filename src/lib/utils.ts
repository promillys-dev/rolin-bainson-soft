/** Concatène des classes conditionnelles sans dépendance externe. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** 285000 → « 285 000 € » */
export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(value))} €`
}

/** Loyer charges comprises, comme l'affichait le site précédent. */
export function formatRent(value: number): string {
  return `${formatPrice(value)} / mois`
}

export function formatArea(value: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(value)} m²`
}

/**
 * « Qui sommes-nous ? » → « qui-sommes-nous ». Sert d'ancre aux sections de
 * texte : stable, lisible dans l'URL, et identique au serveur et au client.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Choix stable dans une liste à partir d'une clé : la même clé donne
 * toujours le même élément. Sert aux images de repli — un article sans image
 * garde la même d'une page à l'autre, sans avoir à connaître son rang dans
 * la liste complète.
 */
export function pickStable<T>(items: readonly T[], key: string): T {
  let hash = 0
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return items[hash % items.length] as T
}
