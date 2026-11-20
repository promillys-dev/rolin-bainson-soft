/**
 * Négociateurs rattachés aux agences.
 *
 * DONNÉES FICTIVES. La table legacy `rb_agent` existe et est alimentée par
 * l'import (rattachement par `agen_code`), mais la livraison ne contenait pas
 * les ~26 fiches réelles. Un référent par agence suffit au front : la fiche
 * d'annonce n'affiche qu'un interlocuteur.
 *
 * Volontairement sans photo : un portrait inventé serait un mensonge visible
 * sur une page qui sert à prendre contact avec une vraie personne.
 */
export type Negotiator = {
  name: string
  role: string
  phone: string
  email: string
  agencySlug: string
}

export const negotiators: readonly Negotiator[] = [
  {
    name: 'Claire Perrin',
    role: 'Négociatrice transaction',
    phone: '04 78 93 00 45',
    email: 'c.perrin@rolinbainson.com',
    agencySlug: 'agence-charpennes',
  },
  {
    name: 'Mehdi Lahoussine',
    role: 'Négociateur transaction et location',
    phone: '04 26 22 40 80',
    email: 'm.lahoussine@rolinbainson.com',
    agencySlug: 'confluence-rolin-bainson',
  },
  {
    name: 'Sylvie Chabert',
    role: 'Responsable gestion locative',
    phone: '04 78 93 97 69',
    email: 's.chabert@rolinbainson.com',
    agencySlug: 'rolin-bainson-sa',
  },
]

export function getNegotiator(agencySlug: string | undefined): Negotiator | undefined {
  if (!agencySlug) return undefined
  return negotiators.find((negotiator) => negotiator.agencySlug === agencySlug)
}
