import { articles, type Article } from '@/data/news'
import { apiFind, apiGet, apiGetAll, isApiConfigured, toQuery, warnFixtures } from '@/lib/api/client'
import { mediaPath } from '@/lib/api/media'
import { pickStable } from '@/lib/utils'

/**
 * Accès aux actualités.
 *
 * Elles viennent du back-office (`/api/v1/news`) ; les pages ne lisent
 * jamais l'API ni `data/news.ts` directement. Sans `API_URL`, on
 * retombe sur les articles d'exemple.
 *
 * Le corps d'un article arrive en texte ; s'il contient du HTML hérité de
 * l'ancien éditeur, les balises sont retirées plutôt qu’injectées — le site
 * n'insère jamais de HTML venu de la base (`Prose` suit la même règle).
 * Un article sans image en reçoit une de la maison, toujours la même pour un
 * article donné, en liste comme en page.
 */

export const NEWS_PAGE_SIZE = 6

const FALLBACK_IMAGES = [
  '/brand/news-1.jpg',
  '/brand/news-2.jpg',
  '/brand/news-3.jpg',
  '/brand/news-4.jpg',
]

type ApiCategory = { name?: string | null; label?: string | null; title?: string | null } | string | null

type ApiImage = string | { url?: string | null; variants?: Record<string, string> | null } | null

type ApiNews = {
  slug: string
  title: string
  summary?: string | null
  body?: string | null
  image?: ApiImage
  publishedAt: string
  category?: ApiCategory
}

type ApiNewsPage = {
  data: ApiNews[]
  meta: { current_page: number; last_page: number; total: number }
}

/** Retire les balises et décode les entités courantes : du texte, rien d'autre. */
function plainText(html: string): string {
  return html
    .replace(/<\s*(br|\/p|\/div|\/li|\/h\d)\s*\/?>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, '’')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function paragraphs(body: string | null | undefined): string[] {
  if (!body) return []
  return plainText(body)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function categoryLabel(category: ApiCategory | undefined): string {
  if (!category) return 'Actualité'
  if (typeof category === 'string') return category
  return category.name ?? category.label ?? category.title ?? 'Actualité'
}

function imageUrl(image: ApiImage | undefined): string | undefined {
  if (!image) return undefined
  const url = typeof image === 'string' ? image : (image.variants?.moyenne ?? image.url ?? undefined)
  return mediaPath(url) ?? undefined
}

function mapArticle(api: ApiNews): Article {
  const body = paragraphs(api.body)
  const summary = api.summary?.trim() || ''
  return {
    slug: api.slug,
    title: api.title.trim(),
    excerpt: summary || body[0] || '',
    lead: summary,
    body,
    publishedAt: api.publishedAt,
    category: categoryLabel(api.category),
    image: imageUrl(api.image) ?? pickStable(FALLBACK_IMAGES, api.slug),
  }
}

/** Les plus récentes d'abord — l'ordre du fichier de données n'est pas garanti. */
function sortedFixtures(): readonly Article[] {
  return [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export async function getArticles(page = 1, pageSize = NEWS_PAGE_SIZE) {
  if (!isApiConfigured) {
    warnFixtures()
    const all = sortedFixtures()
    const pageCount = Math.max(1, Math.ceil(all.length / pageSize))
    const current = Math.min(Math.max(page, 1), pageCount)
    const start = (current - 1) * pageSize
    return { items: all.slice(start, start + pageSize), total: all.length, page: current, pageCount }
  }

  const response = await apiGet<ApiNewsPage>(
    `/news${toQuery({ page: Math.max(1, page), perPage: pageSize })}`,
    ['posts'],
  )
  return {
    items: response.data.map(mapArticle),
    total: response.meta.total,
    page: response.meta.current_page,
    pageCount: Math.max(1, response.meta.last_page),
  }
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  if (!isApiConfigured) {
    warnFixtures()
    return articles.find((article) => article.slug === slug)
  }
  const detail = await apiFind<{ data: ApiNews }>(`/news/${encodeURIComponent(slug)}`, ['posts'])
  return detail ? mapArticle(detail.data) : undefined
}

export async function getAllArticles(): Promise<readonly Article[]> {
  if (!isApiConfigured) {
    warnFixtures()
    return sortedFixtures()
  }
  const items = await apiGetAll<ApiNews>('/news', ['posts'])
  return items.map(mapArticle)
}

/** Les derniers articles, pour la colonne d'actualités de l'accueil. */
export async function getLatestArticles(limit = 4): Promise<readonly Article[]> {
  return (await getArticles(1, limit)).items
}

/** Articles proches : même catégorie d'abord, complétés par les plus récents. */
export async function getRelatedArticles(article: Article, limit = 2): Promise<readonly Article[]> {
  const others = (await getAllArticles()).filter((entry) => entry.slug !== article.slug)
  const sameCategory = others.filter((entry) => entry.category === article.category)
  return [...sameCategory, ...others.filter((entry) => entry.category !== article.category)].slice(
    0,
    limit,
  )
}
