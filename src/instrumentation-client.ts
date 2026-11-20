import { PAGE_CHANGE_EVENT, type PageChangeDetail } from '@/lib/pageTransition'

/**
 * Chaque navigation du routeur — lien, `router.push`, précédent / suivant —
 * passe ici avant de commencer. On la signale à `PageLoader`.
 */
export function onRouterTransitionStart(url: string, navigationType: PageChangeDetail['navigationType']) {
  window.dispatchEvent(
    new CustomEvent<PageChangeDetail>(PAGE_CHANGE_EVENT, { detail: { url, navigationType } }),
  )
}
