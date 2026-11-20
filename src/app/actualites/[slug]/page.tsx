import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/config/site'
import type { Article } from '@/data/news'
import { formatLongDate } from '@/lib/dates'
import { getAllArticles, getArticle, getRelatedArticles } from '@/lib/news'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  return (await getAllArticles()).map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) return { title: 'Article introuvable' }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      images: [{ url: article.image }],
    },
  }
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) notFound()

  const related = await getRelatedArticles(article)

  return (
    <>
      <ArticleJsonLd article={article} />

      <PageHeader
        eyebrow={article.category}
        title={article.title}
        description={article.lead}
        breadcrumb={[{ label: 'Actualités', href: '/actualites' }, { label: article.title }]}
      >
        <p className="mt-6 text-sm text-ink-400">
          Publié le{' '}
          <time dateTime={article.publishedAt}>{formatLongDate(article.publishedAt)}</time>
        </p>
      </PageHeader>

      <Container className="py-8 lg:py-10">
        <div className="relative aspect-[21/9] overflow-hidden rounded-panel border border-line">
          <Image
            src={article.image}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="object-cover"
          />
        </div>

        {/* Colonne de lecture étroite : au-delà d'environ 70 signes par ligne,
            l'œil perd le début de la ligne suivante. */}
        <article className="mt-12 max-w-2xl">
          {article.body.map((paragraph, index) => (
            <p key={index} className="mt-5 text-lg leading-relaxed text-ink-700 first:mt-0">
              {paragraph}
            </p>
          ))}

          <div className="mt-12 border-t border-line pt-8">
            <ArrowLink href="/actualites">Toutes les actualités</ArrowLink>
          </div>
        </article>
      </Container>

      {related.length > 0 ? (
        <section className="border-t border-line bg-surface py-8 lg:py-10">
          <Container>
            <h2 className="text-2xl font-semibold sm:text-3xl">À lire également</h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-2">
              {related.map((entry, index) => (
                <Reveal as="li" key={entry.slug} delay={index * 80} className="h-full">
                  <Link
                    href={`/actualites/${entry.slug}`}
                    className="group flex h-full flex-col rounded-panel border border-line bg-surface-warm p-6 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-brand-200 hover:shadow-raised"
                  >
                    <span className="text-xs font-semibold tracking-[0.08em] text-brand-700 uppercase">
                      {entry.category}
                    </span>
                    <span className="mt-3 text-lg leading-snug font-semibold text-ink-900">
                      {entry.title}
                    </span>
                    <span className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-500">
                      {entry.excerpt}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  )
}

/**
 * `NewsArticle` : c'est ce balisage qui permet à un article de remonter dans
 * les résultats d'actualité avec sa date, plutôt que comme une page quelconque.
 */
function ArticleJsonLd({ article }: { article: Article }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    image: article.image,
    articleSection: article.category,
    inLanguage: 'fr-FR',
    author: { '@type': 'Organization', name: site.legalName },
    publisher: { '@type': 'Organization', name: site.legalName },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  )
}
