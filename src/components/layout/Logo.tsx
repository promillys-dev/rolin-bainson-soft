import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Logo de la maison.
 *
 * Le PNG du site précédent (314 × 109), récupéré dans la livraison legacy,
 * portait un trait d'union : « rolin-bainson ». Le domaine retenu est
 * `rolinbainson.com`, sans tiret, et la marque suit. Le tiret a donc été
 * retiré de l'image et « bainson » recollé à distance normale de lettre
 * (298 × 109) — plutôt que de retaper le mot dans une autre police, ce qui
 * aurait changé le dessin des lettres.
 *
 * L'original reste dans `brand/rolin-bainson.png`, au cas où. Il reste à
 * remplacer par le SVG officiel dès que le client nous le fournit : c'est le
 * seul fichier à changer, et la taille affichée est pilotée ici.
 *
 * Le bas-de-casse géométrique noir et orange de ce logo est la source de toute
 * l'identité du nouveau site — typo d'affichage et bichromie en découlent.
 */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        'inline-flex items-center transition-opacity duration-300 hover:opacity-80',
        className,
      )}
      aria-label="Rolin Bainson, retour à l'accueil"
    >
      <Image
        src="/brand/rolinbainson.png"
        alt="Rolin Bainson"
        width={298}
        height={109}
        priority={priority}
        className="h-11 w-auto sm:h-13"
      />
    </Link>
  )
}
