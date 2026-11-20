import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { feeTables } from '@/data/fees'

export const metadata: Metadata = {
  title: 'Nos tarifs',
  description:
    'Barème des honoraires Rolin Bainson : transaction, location, gestion locative et syndic de copropriété. Tous les montants sont TTC.',
}

/**
 * Barème d'honoraires.
 *
 * Page réglementaire avant d'être commerciale : l'affichage du barème est
 * obligatoire, en agence comme en ligne. Elle est donc construite pour être
 * lue — un tableau par métier, des montants alignés, les plafonds légaux
 * nommés — et non pour vendre.
 *
 * Les montants sont fictifs tant que la maison n'a pas fourni son barème ;
 * l'avertissement en tête de page le dit, et doit sauter au moment de la
 * mise en ligne, pas avant.
 */
export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Informations"
        title={
          <>
            Nos honoraires, <span className="text-brand-500">en entier</span>
          </>
        }
        description="Tous nos honoraires figurent sur cette page, affichés TTC et identiques pour tous. Ils sont également consultables en vitrine de chacune de nos agences, comme la loi l’exige."
        breadcrumb={[{ label: 'Tarifs' }]}
      />

      <Container as="section" className="py-8 lg:py-10">
        {/* Garde-fou de recette : ce bloc doit disparaître avec les montants
            fictifs, et pas avant. */}
        <p className="rounded-panel border border-brand-200 bg-brand-50 p-5 text-[0.9375rem] leading-relaxed text-ink-700">
          <strong className="font-semibold text-ink-900">Barème provisoire.</strong> Les montants
          ci-dessous sont des valeurs d’exemple, en attente du barème réel de la maison. Ils ne
          doivent pas être mis en ligne en l’état.
        </p>

        <div className="mt-10 grid gap-8">
          {feeTables.map((table, index) => (
            <Reveal key={table.id} delay={Math.min(index, 3) * 70}>
              <section className="overflow-hidden rounded-panel border border-line bg-surface">
                <div className="border-b border-line p-6 lg:p-8">
                  <h2 className="text-xl font-semibold sm:text-2xl">{table.title}</h2>
                  <p className="mt-3 max-w-2xl leading-relaxed text-ink-500">{table.intro}</p>
                </div>

                <table className="w-full text-left">
                  <caption className="sr-only">{table.title}</caption>
                  <thead>
                    <tr className="border-b border-line bg-surface-muted">
                      <th scope="col" className="px-6 py-3 text-xs font-semibold tracking-[0.1em] text-ink-400 uppercase lg:px-8">
                        Prestation
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-semibold tracking-[0.1em] text-ink-400 uppercase lg:px-8">
                        Honoraires
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {table.rows.map((row) => (
                      <tr key={row.label}>
                        <th scope="row" className="px-6 py-4 text-[0.9375rem] font-normal text-ink-700 lg:px-8">
                          {row.label}
                          {row.note ? (
                            <span className="mt-0.5 block text-xs text-ink-400">{row.note}</span>
                          ) : null}
                        </th>
                        <td className="px-6 py-4 text-right text-[0.9375rem] font-semibold whitespace-nowrap text-ink-900 lg:px-8">
                          {row.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {table.footnote ? (
                  <p className="border-t border-line bg-surface-muted px-6 py-4 text-xs leading-relaxed text-ink-400 lg:px-8">
                    {table.footnote}
                  </p>
                ) : null}
              </section>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 max-w-2xl text-sm leading-relaxed text-ink-500">
          <p>
            Les honoraires de transaction ne sont dus qu’à la signature de l’acte authentique :
            aucune somme ne vous est demandée en cours de mandat. En gestion, rien n’est prélevé
            sur un loyer qui n’a pas été encaissé.
          </p>
          <p className="mt-4">
            Les montants sont susceptibles d’évoluer ; la version en vigueur est celle affichée
            sur cette page et en vitrine de nos agences à la date de signature du mandat.
          </p>
        </div>
      </Container>
    </>
  )
}
