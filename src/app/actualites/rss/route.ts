import { headers } from 'next/headers'
import { site } from '@/config/site'
import { getAllArticles } from '@/lib/news'

/**
 * Flux RSS des actualités.
 *
 * Le site précédent en servait un sur `/actualité/rss` : il est repris ici
 * parce qu'un flux public a des abonnés qu'on ne voit pas, et qu'en perdre un
 * à la refonte est une régression silencieuse. L'ancienne URL devra être
 * redirigée en 301 vers celle-ci, au même titre que les autres URLs
 * accentuées du legacy.
 *
 * L'origine est lue dans les en-têtes de la requête plutôt que dans une
 * variable d'environnement : un flux doit porter des URLs absolues, et une
 * variable mal renseignée en préproduction publie des liens qui pointent vers
 * la production. Les en-têtes, eux, disent toujours où l'on est.
 */

/** Échappe les cinq caractères que XML ne tolère pas en contenu d'élément. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const headerList = await headers()
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? 'localhost'
  const protocol = headerList.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  const origin = `${protocol}://${host}`

  const articles = await getAllArticles()
  const lastBuild = articles[0]?.publishedAt

  const items = articles
    .map((article) => {
      const url = `${origin}/actualites/${article.slug}`

      return [
        '    <item>',
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        // `isPermaLink="false"` : le slug peut changer, l'identifiant ne doit
        // pas. Sans cela, un article renommé réapparaît comme une nouveauté
        // chez tous les abonnés.
        `      <guid isPermaLink="false">${escapeXml(article.slug)}</guid>`,
        `      <category>${escapeXml(article.category)}</category>`,
        `      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(article.excerpt)}</description>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(`${site.name} — Actualités`)}</title>`,
    `    <link>${origin}/actualites</link>`,
    `    <description>${escapeXml(site.description)}</description>`,
    '    <language>fr-FR</language>',
    `    <atom:link href="${origin}/actualites/rss" rel="self" type="application/rss+xml" />`,
    ...(lastBuild ? [`    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>`] : []),
    items,
    '  </channel>',
    '</rss>',
  ].join('\n')

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // Une heure : les actualités d'une agence immobilière ne changent pas
      // plus vite, et cela évite de recalculer le flux à chaque passage d'un
      // agrégateur.
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
