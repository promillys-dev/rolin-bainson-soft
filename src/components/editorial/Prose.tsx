import type { ReactNode } from 'react'
import { ProseToc } from '@/components/editorial/ProseToc'
import { cn, slugify } from '@/lib/utils'

/**
 * Rendu des pages de contenu.
 *
 * Les textes sont stockés en données structurées (titre, paragraphes, listes)
 * et non en HTML. Le CMS du site précédent stockait du WYSIWYG brut — 83 blocs
 * `nos_wysiwyg` — avec le lot de styles en ligne et de balises orphelines que
 * cela suppose. Repartir de structures rend la typographie homogène sur
 * trente pages sans dépendre de ce que chaque rédacteur a collé.
 *
 * `Prose` ne prend donc pas de `dangerouslySetInnerHTML` : c'est volontaire.
 *
 * Chaque section titrée porte une ancre tirée de son titre : c'est ce que
 * suit le sommaire « Sur cette page » (`ProseToc`).
 */

export type ProseSection = {
  title?: string
  paragraphs?: readonly string[]
  bullets?: readonly string[]
  /** Paires terme / définition — barèmes, coordonnées, délais. */
  definitions?: readonly { term: string; description: string }[]
}

export function Prose({
  sections,
  className,
  children,
}: {
  sections: readonly ProseSection[]
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {sections.map((section, index) => (
        <section
          key={section.title ?? index}
          id={section.title ? slugify(section.title) : undefined}
          className="mt-10 scroll-mt-28 first:mt-0"
        >
          {section.title ? (
            <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">{section.title}</h2>
          ) : null}

          {section.paragraphs?.map((paragraph, paragraphIndex) => (
            <p
              key={paragraphIndex}
              className="mt-4 leading-relaxed text-ink-700 first-of-type:mt-4"
            >
              {paragraph}
            </p>
          ))}

          {section.bullets ? (
            <ul className="mt-5 grid gap-2.5">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 leading-relaxed text-ink-700">
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="mt-1.5 size-4 shrink-0 fill-none stroke-brand-600 stroke-[1.8]"
                  >
                    <path d="m3 8.5 3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}

          {section.definitions ? (
            <dl className="mt-5 divide-y divide-line border-y border-line">
              {section.definitions.map((entry) => (
                <div key={entry.term} className="grid gap-1 py-3.5 sm:grid-cols-[14rem_1fr] sm:gap-6">
                  <dt className="font-medium text-ink-900">{entry.term}</dt>
                  <dd className="leading-relaxed text-ink-500">{entry.description}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>
      ))}

      {children}
    </div>
  )
}

/**
 * Le texte et son sommaire « Sur cette page », côte à côte.
 *
 * Le sommaire n'apparaît qu'à partir de trois sections titrées, et sur
 * grand écran : en deçà, il dirait moins que le texte lui-même.
 */
export function ProseWithToc({
  sections,
  className,
}: {
  sections: readonly ProseSection[]
  className?: string
}) {
  const items = sections
    .filter((section): section is ProseSection & { title: string } => Boolean(section.title))
    .map((section) => ({ id: slugify(section.title), label: section.title }))

  if (items.length < 3) return <Prose sections={sections} className={className} />

  return (
    <div className={cn('grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16', className)}>
      <ProseToc items={items} className="hidden lg:sticky lg:top-28 lg:block lg:self-start" />
      <Prose sections={sections} />
    </div>
  )
}
