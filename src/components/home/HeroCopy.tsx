import { ArrowLink } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { HeroSlide } from '@/config/heroSlides'
import type { StageTone } from '@/components/home/HeroStage'
import { cn } from '@/lib/utils'

/**
 * Le texte d'une vue de la bannière.
 *
 * Rendu côté serveur, pour les cinq vues à la fois : elles sont toutes dans
 * le HTML initial et se croisent en opacité. Le référencement y gagne — rien
 * n'attend le script — et le passage d'une vue à l'autre ne coûte qu'un
 * changement de classe.
 *
 * Une seule porte la balise `h1`, la première : une page n'a qu'un titre, et
 * c'est la raison qui amène le visiteur qui doit l'occuper. Les quatre autres
 * reprennent la même typographie sans la sémantique.
 *
 * Trois couches donnent au titre son poids :
 *
 *  - le numéro de la vue, détouré, dans la marge à gauche du trait — il se
 *    lit comme un numéro de chapitre et dit sans un mot qu'il y a une suite ;
 *  - le titre qui monte mot par mot, chacun sortant de sa propre fenêtre, à
 *    chaque bascule : on lit le propos au rythme où il arrive ;
 *  - un surlignage doré sous le fragment en couleur, qui se trace de gauche
 *    à droite comme le filet du rail : l'œil sait où se poser.
 *
 * Le mot à mot ne joue pas au premier affichage. Le titre de la première vue
 * est le plus grand élément visible au chargement ; l'animer retarderait la
 * mesure du LCP et ferait attendre le visiteur pour rien.
 */

/** Chaque mot dans sa fenêtre, prêt à monter. Les espaces restent du texte. */
function Words({ text, from, play }: { text: string; from: number; play: boolean }) {
  let index = from
  return (
    <>
      {text.split(/(\s+)/).map((token, position) => {
        if (!token) return null
        if (/^\s+$/.test(token)) return token
        const delay = 120 + index++ * 70
        return (
          <span
            key={position}
            // La fenêtre est rallongée vers le bas pour ne pas rogner les
            // jambages ; la marge négative rend la place prise.
            className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom"
          >
            <span
              className="inline-block"
              style={
                play
                  ? { animation: `word-rise 780ms var(--ease-out-soft) ${delay}ms both` }
                  : undefined
              }
            >
              {token}
            </span>
          </span>
        )
      })}
    </>
  )
}

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length

export function HeroCopy({
  slide,
  tone,
  primary,
  active,
  number,
  total,
  animate,
}: {
  slide: HeroSlide
  tone: StageTone
  /** La première vue porte le `h1` de la page. */
  primary: boolean
  active: boolean
  /** Rang de la vue et nombre de vues, affichés à gauche du titre. */
  number: number
  total: number
  /** Faut-il jouer le mot à mot quand la vue devient active ? */
  animate: boolean
}) {
  const onDark = tone === 'dark'
  const Title = primary ? 'h1' : 'p'
  const play = active && animate
  const [head, accent, tail] = slide.title

  return (
    <div
      aria-hidden={!active}
      className={cn(
        // Toutes les vues occupent la même cellule : la hauteur est celle de
        // la plus haute, et rien ne saute d'une vue à l'autre.
        'relative isolate [grid-area:1/1] transition-all duration-700 ease-[var(--ease-out-soft)]',
        active
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0 select-none',
      )}
    >
      {onDark ? (
        <p className="inline-flex items-center gap-2 rounded-pill bg-white/12 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-brand-200 uppercase ring-1 ring-white/20 ring-inset backdrop-blur">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
          {slide.eyebrow}
        </p>
      ) : (
        <Eyebrow>{slide.eyebrow}</Eyebrow>
      )}

      {/* Un trait qui descend et se termine par une boule, comme sur
          l'esquisse. La boule porte un écho qui se propage : c'est le seul
          point de la bannière qui respire en continu, et il pointe là où
          commence le propos. */}
      <div className={cn('relative', onDark && 'mt-6 pl-5 sm:pl-6')}>
        {/* Le numéro de la vue, à gauche du trait : il se lit avant le titre,
            comme le numéro d'un chapitre. Il occupe la marge de la page, et
            n'apparaît donc que là où cette marge existe — en deçà, il
            mordrait sur le bord de l'écran. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute top-1 right-full mr-5 hidden flex-col items-end select-none min-[1400px]:flex',
            'transition-all duration-[900ms] ease-[var(--ease-out-soft)]',
            active ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0',
          )}
        >
          <span
            className={cn(
              'font-display text-[4.25rem] leading-[0.85] font-semibold tracking-[-0.05em] text-transparent',
              onDark
                ? '[-webkit-text-stroke:1.5px_rgb(255_255_255/0.42)]'
                : '[-webkit-text-stroke:1.5px_rgb(28_25_23/0.25)]',
            )}
          >
            {String(number).padStart(2, '0')}
          </span>
          <span
            className={cn(
              'mt-2 text-xs font-semibold tracking-[0.18em]',
              onDark ? 'text-brand-300/80' : 'text-brand-600',
            )}
          >
            / {String(total).padStart(2, '0')}
          </span>
        </span>

        {onDark ? (
          <span aria-hidden="true" className="absolute top-2 bottom-0 left-0 w-[3px]">
            <span className="absolute inset-x-0 top-0 bottom-2.5 rounded-full bg-linear-to-b from-brand-400/15 via-brand-400 to-brand-500" />
            <span className="absolute bottom-0 left-1/2 block size-2.5 -translate-x-1/2">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/60" />
              <span className="absolute inset-0 rounded-full bg-brand-400 ring-4 ring-brand-400/15" />
            </span>
          </span>
        ) : null}

        {/* Remonté à chaque activation : une animation CSS ne rejoue pas
            d'elle-même. */}
        <Title
          key={play ? 'play' : 'rest'}
          className={cn(
            'font-display text-[2.6rem] leading-[0.98] font-semibold tracking-[-0.038em] text-balance sm:text-[3.4rem] lg:text-[3.9rem] xl:text-[4.4rem]',
            onDark
              ? 'text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.45),0_10px_34px_rgb(0_0_0/0.3)]'
              : 'mt-6 text-ink-900',
          )}
        >
          <Words text={head} from={0} play={play} />
          <span
            className={cn(
              // Le surlignage est un fond, pas une bordure : il suit le
              // fragment sur plusieurs lignes et se dessine en largeur.
              'bg-no-repeat [box-decoration-break:clone] [background-position:0_88%]',
              onDark
                ? 'text-brand-300 [background-image:linear-gradient(90deg,rgb(229_112_58/0.55),rgb(246_199_106/0.45))]'
                : 'text-brand-500 [background-image:linear-gradient(90deg,rgb(229_112_58/0.28),rgb(246_199_106/0.32))]',
            )}
            style={{
              backgroundSize: '100% 0.16em',
              animation: play
                ? `underline-draw 900ms var(--ease-out-soft) ${180 + countWords(head) * 70}ms both`
                : undefined,
            }}
          >
            <Words text={accent} from={countWords(head)} play={play} />
          </span>
          <Words text={tail} from={countWords(head) + countWords(accent)} play={play} />
        </Title>
      </div>

      <p
        className={cn(
          'mt-6 max-w-xl text-[1.0625rem] leading-relaxed sm:text-lg',
          onDark
            ? 'text-white/85 [text-shadow:0_1px_2px_rgb(0_0_0/0.4)] sm:pl-6'
            : 'text-ink-500',
        )}
      >
        {slide.description}
      </p>

      <div className={cn('mt-8 flex flex-wrap items-center gap-x-8 gap-y-4', onDark && 'sm:pl-6')}>
        <ArrowLink
          href={slide.cta.href}
          className={onDark ? 'text-white hover:text-brand-300' : undefined}
          tabIndex={active ? undefined : -1}
        >
          {slide.cta.label}
        </ArrowLink>
        <ArrowLink
          href={slide.secondary.href}
          className={onDark ? 'text-white/70 hover:text-white' : 'text-ink-500'}
          tabIndex={active ? undefined : -1}
        >
          {slide.secondary.label}
        </ArrowLink>
      </div>
    </div>
  )
}
