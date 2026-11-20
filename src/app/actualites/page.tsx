import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowIcon } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { formatLongDate } from '@/lib/dates'
import { getArticles } from '@/lib/news'
import { cn } from '@/lib/utils'
import type { RawSearchParams } from '@/lib/searchParams'

export const metadata: Metadata = {
  title: 'Actualités',
  description:
    'Les actualités de Rolin Bainson : la vie des agences, la location, le syndic de copropriété et les assurances à Lyon et Villeurbanne.',
  alternates: {
    // Le flux existait en production sur `/actualité/rss` ; le déclarer ici le
    // rend détectable par les agrégateurs sans que l'utilisateur ait à le
    // chercher.
    types: { 'application/rss+xml': '/actualites/rss' },
  },
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}) {
  const raw = await searchParams
  const requested = Number.parseInt(Array.isArray(raw.page) ? (raw.page[0] ?? '') : (raw.page ?? ''), 10)
  const { items, page, pageCount } = await getArticles(Number.isFinite(requested) ? requested : 1)

  return (
    <>
      <PageHeader
        eyebrow="Actualités"
        title={
          <>
            La vie de la maison, <span className="text-brand-500">et ce qui change pour vous</span>
          </>
        }
        description="Ce que nous observons sur le marché lyonnais, les évolutions réglementaires qui touchent les bailleurs et les copropriétaires, et la vie de nos agences."
        breadcrumb={[{ label: 'Actualités' }]}
      >
        {/* Le flux n'est pas une page mais un gestionnaire de route : il n'a
            rien à faire dans le routeur client, qui tenterait d'en faire une
            navigation React. La règle ESLint ne distingue pas les deux. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/actualites/rss"
          type="application/rss+xml"
          className="group/btn mt-8 inline-flex items-center gap-2 rounded-pill border border-line-strong px-4 py-2 text-sm font-medium text-ink-800 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 fill-current">
            <circle cx="4" cy="12" r="1.6" />
            <path d="M2.5 7.2a6.3 6.3 0 0 1 6.3 6.3h2.2A8.5 8.5 0 0 0 2.5 5zM2.5 3a10.5 10.5 0 0 1 10.5 10.5h2.2A12.7 12.7 0 0 0 2.5 0.8z" />
          </svg>
          S’abonner au flux RSS
        </a>
      </PageHeader>

      <Container as="section" className="py-8 lg:py-10">
        <ul className="grid gap-5 md:grid-cols-2">
          {items.map((article, index) => (
            <Reveal as="li" key={article.slug} delay={Math.min(index, 4) * 70} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-panel border border-line bg-surface transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-brand-200 hover:shadow-raised">
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* `alt` vide à dessein : la vignette n'ajoute rien au titre
                      qui la suit immédiatement. La décrire ferait entendre deux
                      fois la même carte à un lecteur d'écran. */}
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 32rem, 100vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="rounded-pill bg-brand-100 px-2.5 py-1 font-semibold tracking-[0.08em] text-brand-700 uppercase">
                    {article.category}
                  </span>
                  <time dateTime={article.publishedAt} className="text-ink-400">
                    {formatLongDate(article.publishedAt)}
                  </time>
                </div>

                <h2 className="mt-4 text-xl leading-snug font-semibold">
                  <Link
                    href={`/actualites/${article.slug}`}
                    className="after:absolute after:inset-0"
                  >
                    {article.title}
                  </Link>
                </h2>

                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-500">
                  {article.excerpt}
                </p>

                <p className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink-900 transition-colors group-hover:text-brand-700">
                  Lire l’article
                  <ArrowIcon className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1" />
                </p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        {pageCount > 1 ? (
          <nav aria-label="Pagination des actualités" className="mt-12 flex justify-center gap-1.5">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((target) => (
              <Link
                key={target}
                href={target === 1 ? '/actualites' : `/actualites?page=${target}`}
                aria-current={target === page ? 'page' : undefined}
                className={cn(
                  'inline-flex h-10 min-w-10 items-center justify-center rounded-pill px-3 text-sm font-medium transition-colors',
                  target === page
                    ? 'bg-ink-900 text-white'
                    : 'border border-line bg-surface text-ink-800 hover:border-ink-900',
                )}
              >
                {target}
              </Link>
            ))}
          </nav>
        ) : null}
      </Container>
    </>
  )
}
