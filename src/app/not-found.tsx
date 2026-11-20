import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-serif text-sm font-semibold tracking-widest text-brand-500 uppercase">
        Erreur 404
      </p>
      <h1 className="mt-4 text-3xl">Cette page n’existe pas</h1>
      <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ink-500">
        Le lien est peut-être ancien, ou le bien que vous cherchiez n’est plus disponible.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/offres">Voir les biens disponibles</ButtonLink>
        <ButtonLink href="/" variant="ghost">
          Retour à l’accueil
        </ButtonLink>
      </div>
    </Container>
  )
}
