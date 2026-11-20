import { footerNav, mainNav, type NavItem, type NavLink } from '@/config/navigation'
import { apiGet, isApiConfigured, warnFixtures } from '@/lib/api/client'

/**
 * Les menus du site, réglés en back-office (`/api/v1/menus`).
 *
 * Le menu `principal` alimente la barre de navigation ; `footer` et
 * `liens-utiles` alimentent les colonnes du pied de page. Une entrée
 * dépubliée n'apparaît pas ; une entrée dont la page a disparu
 * (`isResolvable` à `false`) non plus — mieux vaut une entrée de moins
 * qu'une adresse morte.
 *
 * La barre de services au-dessus du logo (téléphone, « nous écrire »…) n'a
 * pas d'équivalent en back-office et reste dans `config/navigation.ts`.
 */

type ApiMenuItem = {
  label: string
  target: string | null
  isPublished: boolean
  isResolvable: boolean
  children: ApiMenuItem[]
}

type ApiMenu = { slug: string; label: string; items: ApiMenuItem[] }

const isExternal = (href: string) => /^https?:\/\//i.test(href)

function toLink(item: ApiMenuItem): NavLink | null {
  if (!item.isPublished || !item.isResolvable || !item.target) return null
  return {
    label: item.label,
    href: item.target,
    ...(isExternal(item.target) ? { external: true } : {}),
  }
}

function toItem(item: ApiMenuItem): NavItem | null {
  const link = toLink(item)
  if (!link) return null
  const children = item.children.map(toLink).filter((child): child is NavLink => child !== null)
  return children.length ? { ...link, children } : link
}

async function getMenus(): Promise<ApiMenu[]> {
  const { data } = await apiGet<{ data: ApiMenu[] }>('/menus', ['site'])
  return data
}

/** La navigation principale. */
export async function getMainNav(): Promise<readonly NavItem[]> {
  if (!isApiConfigured) {
    warnFixtures()
    return mainNav
  }
  const menu = (await getMenus()).find((entry) => entry.slug === 'principal')
  if (!menu) return mainNav
  return menu.items.map(toItem).filter((item): item is NavItem => item !== null)
}

/** Les colonnes de liens du pied de page. */
export async function getFooterNav(): Promise<readonly { title: string; links: readonly NavLink[] }[]> {
  if (!isApiConfigured) {
    warnFixtures()
    return footerNav
  }
  const menus = await getMenus()
  const column = (slug: string, title: string) => {
    const menu = menus.find((entry) => entry.slug === slug)
    const links = (menu?.items ?? []).map(toLink).filter((link): link is NavLink => link !== null)
    return links.length ? { title, links } : null
  }
  return [column('footer', 'Nos services'), column('liens-utiles', 'Liens utiles')].filter(
    (group): group is { title: string; links: NavLink[] } => group !== null,
  )
}
