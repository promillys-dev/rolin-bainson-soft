import type { Metadata } from 'next'
import { Prose } from '@/components/editorial/Prose'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Déposer votre dossier de location',
  description:
    'Les pièces attendues pour un dossier de location à Lyon et Villeurbanne, et comment nous le transmettre.',
}

/**
 * Dépôt de dossier locataire.
 *
 * Fonctionnalité fantôme du site précédent (`SPEC §3.8`) : il en restait une
 * option de back-office, une vue, un script et un endpoint public, mais le
 * modèle et la table n'existaient nulle part — l'endpoint levait une erreur
 * fatale. Le parcours multi-étapes avec pièces justificatives et reprise par
 * e-mail reste à arbitrer avec le client, car il porte des données sensibles.
 *
 * En attendant, cette page fait ce que le legacy faisait en pratique : elle
 * dit quelles pièces préparer et renvoie vers le contact. Mieux vaut une page
 * honnête qu'un formulaire en trompe-l'œil.
 */
const sections = [
  {
    title: 'Les pièces attendues',
    paragraphs: [
      "La liste des pièces qu'un bailleur peut exiger est fixée par décret : rien d'autre ne peut vous être demandé. Un dossier complet dès le premier envoi vous place devant les candidatures incomplètes, sur un marché où les biens partent en quelques jours.",
    ],
    bullets: [
      'Une pièce d’identité en cours de validité',
      'Un justificatif de domicile actuel : quittance, facture ou attestation d’hébergement',
      'Un justificatif de situation professionnelle : contrat de travail ou attestation d’employeur',
      'Vos trois derniers bulletins de salaire et votre dernier avis d’imposition',
      'Les mêmes pièces pour chaque garant, avec son acte de cautionnement',
    ],
  },
  {
    title: 'Comment nous le transmettre',
    paragraphs: [
      "Le dépôt en ligne en plusieurs fois est en cours de refonte. En attendant, envoyez vos pièces en un seul message depuis le formulaire de contact, ou remettez-les à l'agence lors de la visite.",
      "Précisez la référence du bien qui vous intéresse : elle figure sur chaque annonce et nous permet de rattacher votre dossier au bon logement.",
    ],
  },
  {
    title: 'Ce que nous en faisons',
    paragraphs: [
      "Vos pièces ne sont jamais accessibles publiquement. Elles sont transmises au bailleur dans le cadre de l'examen de votre candidature, et effacées une fois le logement attribué si vous n'êtes pas retenu.",
      "Nous ne demandons jamais de versement avant la signature du bail, ni de frais de dossier en dehors des honoraires affichés sur notre barème.",
    ],
  },
] as const

export default function TenantFilePage() {
  return (
    <>
      <PageHeader
        image="/brand/hero-gestion.jpg"
        eyebrow="Location"
        title={
          <>
            Votre dossier, <span className="text-brand-500">complet du premier coup</span>
          </>
        }
        description="Ce qu’il faut réunir pour candidater à une location, et ce que nous en faisons. Rien de plus que ce que le décret autorise."
        breadcrumb={[{ label: 'Déposer votre dossier' }]}
      />

      <Container as="section" className="py-8 lg:py-10">
        <p className="max-w-2xl rounded-panel border border-brand-200 bg-brand-50 p-5 text-[0.9375rem] leading-relaxed text-ink-700">
          <strong className="font-semibold text-ink-900">Dépôt en ligne en refonte.</strong> Le
          parcours en plusieurs étapes n’est pas encore disponible. Envoyez-nous vos pièces par le
          formulaire de contact : nous les traitons de la même façon.
        </p>

        <Prose sections={sections} className="mt-10" />

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/contact">Envoyer mon dossier</ButtonLink>
          <ButtonLink href="/offres?transaction=location" variant="outline">
            Voir les logements à louer
          </ButtonLink>
        </div>
      </Container>
    </>
  )
}
