/**
 * Le passage d'une page à l'autre, entre `instrumentation-client.ts`, qui
 * voit partir chaque navigation, et `PageLoader`, qui l'affiche.
 *
 * Les deux ne partagent pas forcément la même instance de module : ils se
 * parlent par un événement de `window`, pas par une variable commune.
 */

export const PAGE_CHANGE_EVENT = 'rb:page-change'

export type PageChangeDetail = {
  url: string
  navigationType: 'push' | 'replace' | 'traverse'
}

/**
 * Durée minimale du loader, en millisecondes : assez pour qu'on le voie et
 * que le monogramme se remplisse. Une page plus lente l'allonge d'autant.
 */
export const PAGE_LOADER_MIN = 1000
