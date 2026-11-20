import { formatLongDate } from '@/lib/dates'
import { cn } from '@/lib/utils'
import type { EnergyPerformance as EnergyPerformanceData, EnergyRating } from '@/types/property'

/**
 * Diagnostic de performance énergétique et émissions de gaz à effet de serre.
 *
 * AFFICHAGE RÉGLEMENTÉ, pas un élément de décoration. Depuis le 1er juillet
 * 2021, toute annonce immobilière doit montrer les deux étiquettes, leur
 * lettre ET leur valeur chiffrée. Ce composant est donc traité comme un
 * livrable à part entière : c'est aussi la raison pour laquelle les couleurs
 * ne sont pas des jetons du site mais la palette officielle de l'arrêté,
 * déclarées ici en clair.
 *
 * Point de vigilance repris de l'audit : l'import legacy était incohérent
 * (`offr_dpe_ce` recevait une ANNÉE, `offr_dpe_ges` une valeur d'émission —
 * `import.php:170-172`). Le contrat de ce composant est explicite : une
 * lettre et une valeur par étiquette, rien d'autre. Le mapping d'import devra
 * s'y conformer.
 *
 * Cas « non soumis » / « non renseigné » : la loi impose alors de l'écrire.
 * On ne masque jamais le bloc en silence.
 */

const ratings: readonly EnergyRating[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

/** Palette de l'étiquette énergie de l'arrêté. À confirmer avant mise en ligne. */
const energyColors: Record<EnergyRating, string> = {
  A: '#319834',
  B: '#33cc31',
  C: '#cbfc34',
  D: '#fbfe06',
  E: '#fbcc05',
  F: '#fc9935',
  G: '#fc0205',
}

/** Palette de l'étiquette climat (GES), du gris clair au violet profond. */
const gasColors: Record<EnergyRating, string> = {
  A: '#f3eef8',
  B: '#ded0ea',
  C: '#c6aedb',
  D: '#ad8ccc',
  E: '#916ab9',
  F: '#7448a4',
  G: '#55287f',
}

/** Au-delà de D, le texte sur fond sombre doit passer en blanc. */
const gasDarkFrom = 4

function Scale({
  title,
  unit,
  legend,
  active,
  value,
  colors,
  lightTextFrom,
}: {
  title: string
  unit: string
  legend: string
  active: EnergyRating | undefined
  value: number | undefined
  colors: Record<EnergyRating, string>
  lightTextFrom?: number
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        {value !== undefined ? (
          <p className="text-sm text-ink-500">
            <span className="font-semibold text-ink-900">{value}</span> {unit}
          </p>
        ) : null}
      </div>
      <p className="mt-0.5 text-xs text-ink-400">{legend}</p>

      <ol className="mt-3 flex gap-1" aria-label={title}>
        {ratings.map((rating, index) => {
          const isActive = rating === active
          const onDark = lightTextFrom !== undefined && index >= lightTextFrom

          return (
            <li
              key={rating}
              style={{ backgroundColor: colors[rating] }}
              className={cn(
                'flex h-9 flex-1 items-center justify-center rounded-sm text-sm font-semibold transition-transform',
                onDark ? 'text-white' : 'text-ink-900',
                isActive
                  ? 'scale-y-125 shadow-card ring-2 ring-ink-900 ring-offset-1'
                  : 'opacity-45',
              )}
              aria-current={isActive ? 'true' : undefined}
            >
              {rating}
              {isActive ? <span className="sr-only"> — classe du bien</span> : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function EnergyPerformance({ energy }: { energy: EnergyPerformanceData | undefined }) {
  // Un bien sans DPE (garage, parking, place de stationnement) n'y est pas
  // soumis : on le dit, plutôt que d'escamoter le bloc.
  if (!energy?.energyClass && !energy?.gasClass) {
    return (
      <div className="rounded-panel border border-line bg-surface p-6">
        <h2 className="text-lg font-semibold">Performance énergétique</h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
          Ce bien n’est pas soumis au diagnostic de performance énergétique.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-panel border border-line bg-surface p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-lg font-semibold">Performance énergétique</h2>
        {energy.date ? (
          <p className="text-xs text-ink-400">
            Diagnostic réalisé le {formatLongDate(energy.date)}
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <Scale
          title="Consommation énergétique"
          unit="kWh/m²/an"
          legend="Logement économe (A) à extrêmement consommateur (G)"
          active={energy.energyClass}
          value={energy.energyValue}
          colors={energyColors}
        />
        <Scale
          title="Émissions de gaz à effet de serre"
          unit="kg CO₂/m²/an"
          legend="Faibles émissions (A) à très fortes émissions (G)"
          active={energy.gasClass}
          value={energy.gasValue}
          colors={gasColors}
          lightTextFrom={gasDarkFrom}
        />
      </div>
    </div>
  )
}
