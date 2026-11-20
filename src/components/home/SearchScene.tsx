import { LOGO_MARK, placeMark } from '@/lib/logoMark'
import { cn } from '@/lib/utils'

/**
 * La scène de la recherche : les deux panneaux du logo, devenus les deux
 * portes d'entrée du catalogue.
 *
 * Le panneau sombre, plus bas à gauche, porte la vente ; l'orange, plus haut
 * à droite, la location — la disposition est celle du logo, et l'esquisse
 * l'a reprise. Chacun est rempli d'une photographie, marqué d'un point dont
 * part un trait vers son nom, comme les agences sur la carte de la
 * bannière. Une ligne double serpente derrière eux.
 *
 * Les deux noms sont des `<label>` qui pointent sur les boutons radio du
 * formulaire voisin : cliquer un panneau choisit la recherche, sans une
 * ligne de JavaScript. Et c'est l'état du formulaire qui, par `:has()`,
 * éclaire le panneau choisi et met l'autre en retrait — la scène suit le
 * formulaire au lieu de le doubler.
 *
 * Tout se joue à l'entrée dans le champ (`data-revealed`, posé par
 * `Reveal`) : la ligne se trace, les panneaux descendent se poser l'un après
 * l'autre — ce sont des flèches tournées vers le bas, comme dans la
 * bannière —, puis les traits partent des points et les noms arrivent.
 */

/** Repère de la scène : 100 de large, 84 de haut. */
const W = 100
const H = 84

const PANELS = [
  {
    id: 'vente',
    radio: 'tab-vente',
    mark: placeMark(LOGO_MARK.ink, { x: 23, y: 30, h: 40 }),
    photo: '/brand/block-5.jpg',
    veil: ['rgb(28 25 23 / 0)', 'rgb(28 25 23 / 0.78)'],
    dot: { x: 30, y: 43 },
    leader: 'M30 43 L19 27',
    label: { x: 19, y: 25 },
    title: 'Biens à la vente',
    delay: 250,
  },
  {
    id: 'location',
    radio: 'tab-location',
    mark: placeMark(LOGO_MARK.brand, { x: 47, y: 7, h: 46 }),
    photo: '/brand/block-6.jpg',
    veil: ['rgb(229 112 58 / 0)', 'rgb(229 112 58 / 0.72)'],
    dot: { x: 54, y: 21 },
    leader: 'M54 21 L63 12 L74 12',
    label: { x: 75, y: 12 },
    title: 'Biens en location',
    delay: 420,
  },
] as const

/** La ligne double qui serpente derrière les panneaux. */
const RIBBON =
  'M33 -2 C37 9, 69 2, 76 20 C83 38, 67 55, 48 58 C29 61, 11 63, 3 86'

/** Les deux carrés de l'esquisse : ce qu'on gagne à chercher ici. */
const PROMISES = [
  {
    title: 'Des annonces visitées',
    text: 'Chaque bien publié a été vu par l’une de nos agences.',
    icon: ['M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6z', 'm8.8 12.2 2.2 2.2 4.3-4.6'],
    at: { x: 51, y: 61 },
    side: 'right',
  },
  {
    title: 'Trois agences proches',
    text: 'Villeurbanne et Lyon : une équipe pour organiser vos visites.',
    icon: [
      'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z',
      'M12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z',
    ],
    at: { x: 63, y: 73 },
    side: 'left',
  },
] as const

/** Un morceau de la scène, joué à l'entrée dans le champ. */
const piece = (animation: string) =>
  ({ 'data-scene-piece': '', style: { '--scene-anim': animation } as React.CSSProperties }) as const

const pct = (value: number, total: number) => `${(value / total) * 100}%`


export function SearchScene({ counts }: { counts: { location: number; vente: number } }) {
  return (
    <div className="relative">
      <div className="relative aspect-[100/84]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          aria-hidden="true"
          className="absolute inset-0 size-full overflow-visible"
        >
          <defs>
            {PANELS.map((panel) => (
              <pattern
                key={panel.id}
                id={`search-photo-${panel.id}`}
                patternUnits="userSpaceOnUse"
                x={panel.mark.box.x}
                y={panel.mark.box.y}
                width={panel.mark.box.w}
                height={panel.mark.box.h}
              >
                <image
                  href={panel.photo}
                  width={panel.mark.box.w}
                  height={panel.mark.box.h}
                  preserveAspectRatio="xMidYMid slice"
                />
                <rect
                  width={panel.mark.box.w}
                  height={panel.mark.box.h}
                  fill={`url(#search-veil-${panel.id})`}
                />
              </pattern>
            ))}
            {PANELS.map((panel) => (
              <linearGradient key={panel.id} id={`search-veil-${panel.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="35%" stopColor={panel.veil[0]} />
                <stop offset="100%" stopColor={panel.veil[1]} />
              </linearGradient>
            ))}
            <linearGradient id="search-gilt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f6c76a" />
              <stop offset="50%" stopColor="#e5703a" />
              <stop offset="100%" stopColor="#f6c76a" />
            </linearGradient>
          </defs>

          {/* La ligne double, tracée à l'entrée, puis parcourue en continu
              par un éclat doré — le filet du rail de la bannière. */}
          <g fill="none" strokeLinecap="round">
            <path
              d={RIBBON}
              pathLength={1}
              stroke="url(#search-gilt)"
              strokeWidth="0.45"
              strokeDasharray="1"
              {...piece('scene-draw 1600ms var(--ease-out-soft) 0ms both')}
            />
            <path
              d={RIBBON}
              transform="translate(1.8 1.2)"
              pathLength={1}
              stroke="var(--color-brand-300)"
              strokeOpacity="0.55"
              strokeWidth="0.25"
              strokeDasharray="1"
              {...piece('scene-draw 1600ms var(--ease-out-soft) 160ms both')}
            />
            <path
              d={RIBBON}
              pathLength={100}
              stroke="#f6c76a"
              strokeWidth="0.9"
              strokeDasharray="5 95"
              className="[filter:drop-shadow(0_0_0.8px_rgb(246_199_106/0.9))]"
              {...piece('scene-travel 7s linear 1600ms infinite')}
            />
          </g>

          {PANELS.map((panel) => {
            const chosen = panel.id === 'vente'
            return (
              // Le groupe extérieur porte l'arrivée ; l'intérieur l'état
              // choisi / en retrait. Séparés, sinon la fin de l'animation
              // écraserait l'opacité du retrait.
              <g key={panel.id} {...piece(`scene-drop 900ms var(--ease-out-soft) ${panel.delay}ms both`)}>
                <g
                  className={cn(
                    'transition-[opacity,filter] duration-500 ease-[var(--ease-out-soft)]',
                    chosen
                      ? `opacity-55 [filter:grayscale(0.75)] group-has-[#tab-vente:checked]/search:opacity-100 group-has-[#tab-vente:checked]/search:[filter:none]`
                      : `group-has-[#tab-vente:checked]/search:opacity-55 group-has-[#tab-vente:checked]/search:[filter:grayscale(0.75)]`,
                  )}
                >
                  <path
                    d={panel.mark.d}
                    fill={`url(#search-photo-${panel.id})`}
                    stroke="url(#search-gilt)"
                    strokeWidth="0.45"
                    strokeLinejoin="round"
                    className="[filter:drop-shadow(0_2px_3px_rgb(28_25_23/0.28))]"
                  />
                </g>
              </g>
            )
          })}

          {/* Les traits, du point vers le nom. */}
          {PANELS.map((panel, index) => (
            <path
              key={panel.id}
              d={panel.leader}
              pathLength={1}
              strokeDasharray="1"
              fill="none"
              stroke="var(--color-brand-500)"
              strokeWidth="0.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              {...piece(`scene-draw 650ms var(--ease-out-soft) ${1000 + index * 160}ms both`)}
            />
          ))}
        </svg>

        {/* Les points, en HTML pour porter l'écho du point de la bannière. */}
        {PANELS.map((panel, index) => {
          const forSale = panel.id === 'vente'
          return (
            <span
              key={panel.id}
              aria-hidden="true"
              className="absolute block size-3 -translate-x-1/2 -translate-y-1/2"
              style={{ left: pct(panel.dot.x, W), top: pct(panel.dot.y, H) }}
            >
              <span
                className={cn(
                  'absolute inset-0 animate-ping rounded-full bg-brand-400/60',
                  // L'écho ne bat que sur le panneau choisi.
                  forSale ? `hidden group-has-[#tab-vente:checked]/search:block` : `group-has-[#tab-vente:checked]/search:hidden`,
                )}
              />
              <span
                className="absolute inset-0 rounded-full bg-brand-500 ring-4 ring-white/80"
                {...piece(`scene-pop 420ms var(--ease-out-soft) ${900 + index * 160}ms both`)}
              />
            </span>
          )
        })}

        {/* Les noms : chacun est l'étiquette d'un bouton radio du
            formulaire. Un clic dessus choisit la recherche. */}
        {PANELS.map((panel, index) => {
          const forSale = panel.id === 'vente'
          const count = forSale ? counts.vente : counts.location
          return (
            <label
              key={panel.id}
              htmlFor={panel.radio}
              className={cn(
                'absolute top-(--ly) left-(--lx) flex cursor-pointer flex-col rounded-card px-3.5 py-2 whitespace-nowrap shadow-card ring-1 transition-colors duration-300 select-none max-sm:px-2.5 max-sm:py-1.5',
                // Sur mobile, l'étiquette de droite se cale sur le bord de la
                // scène : à sa place, elle sortirait de l'écran.
                forSale
                  ? '-translate-x-1/2 -translate-y-full'
                  : '-translate-y-1/2 max-sm:right-0 max-sm:left-auto',
                forSale
                  ? `bg-surface text-ink-900 ring-line hover:ring-brand-300 group-has-[#tab-vente:checked]/search:bg-ink-900 group-has-[#tab-vente:checked]/search:text-white group-has-[#tab-vente:checked]/search:ring-ink-900`
                  : `bg-ink-900 text-white ring-ink-900 group-has-[#tab-vente:checked]/search:bg-surface group-has-[#tab-vente:checked]/search:text-ink-900 group-has-[#tab-vente:checked]/search:ring-line hover:ring-brand-300`,
              )}
              data-scene-piece=""
              style={
                {
                  '--lx': pct(panel.label.x, W),
                  '--ly': pct(panel.label.y, H),
                  '--scene-anim': `scene-rise 520ms var(--ease-out-soft) ${1350 + index * 160}ms both`,
                } as React.CSSProperties
              }
            >
              <span className="font-display text-[0.8125rem] font-semibold sm:text-[0.9375rem]">
                {panel.title}
              </span>
              <span
                className={cn(
                  'text-[0.6875rem] sm:text-xs',
                  forSale
                    ? `text-ink-400 group-has-[#tab-vente:checked]/search:text-brand-300`
                    : `text-brand-300 group-has-[#tab-vente:checked]/search:text-ink-400`,
                )}
              >
                {count} annonce{count > 1 ? 's' : ''} en ce moment
              </span>
            </label>
          )
        })}
      </div>

      {/* Les deux carrés de l'esquisse. Posés dans la scène sur grand écran,
          ils passent sous elle, en liste, sur les petits. */}
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:contents">
        {PROMISES.map((promise, index) => (
          <li
            key={promise.title}
            className={cn(
              'flex items-center gap-4 lg:absolute lg:top-(--at-y) lg:left-(--at-x) lg:w-[42%]',
              promise.side === 'left' && 'lg:-translate-x-full lg:flex-row-reverse lg:text-right',
            )}
            data-scene-piece=""
            style={
              {
                // Le carré de gauche se cale par son bord droit.
                '--at-x': pct(promise.at.x + (promise.side === 'left' ? 11 : 0), W),
                '--at-y': pct(promise.at.y, H),
                '--scene-anim': `scene-rise 600ms var(--ease-out-soft) ${1600 + index * 180}ms both`,
              } as React.CSSProperties
            }
          >
            <span className="gilt-edge grid size-16 shrink-0 place-items-center rounded-card bg-surface text-brand-500 shadow-card ring-1 ring-line after:opacity-100 lg:size-[4.25rem]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-7 fill-none stroke-current stroke-[1.7]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {promise.icon.map((d) => (
                  <path key={d} d={d} />
                ))}
              </svg>
            </span>
            <span>
              <span className="block font-display text-[0.9375rem] font-semibold text-ink-900">
                {promise.title}
              </span>
              <span className="mt-0.5 block text-sm leading-snug text-ink-500">{promise.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
