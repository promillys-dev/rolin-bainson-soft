/**
 * Formatage des dates, en français.
 *
 * `Intl` écrit « 1 décembre » là où le français écrit « 1er décembre ». La
 * correction est faite ici une fois pour toutes plutôt que page par page :
 * ces dates apparaissent sur les annonces, les diagnostics et les actualités,
 * et une date mal écrite sur une annonce immobilière se remarque.
 */

const longDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })
const shortDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' })

function ordinalise(value: string): string {
  return value.replace(/^1 /, '1er ')
}

/** « 1er décembre 2026 » */
export function formatLongDate(iso: string): string {
  return ordinalise(longDate.format(new Date(iso)))
}

/** « 1er déc. 2026 » — pour les listes, où la place manque. */
export function formatShortDate(iso: string): string {
  return ordinalise(shortDate.format(new Date(iso)))
}
