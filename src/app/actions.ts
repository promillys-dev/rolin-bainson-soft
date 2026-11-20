'use server'

import { headers } from 'next/headers'
import { apiPost, isApiConfigured, sanitizeIp } from '@/lib/api/client'
import type { FormSlug } from '@/lib/backofficeForms'
import type { FieldErrors, FormState } from '@/lib/forms'

/**
 * Envoi des formulaires au back-office.
 *
 * Le navigateur poste ici, sur le site ; c'est le serveur du site qui relaie
 * vers `POST /api/v1/forms/{slug}/submissions`. L'adresse du back-office ne
 * quitte jamais le serveur, et le back-office reste seul juge : il valide,
 * enregistre, horodate le consentement, range les pièces jointes hors de la
 * racine web et applique sa limite de débit (5 envois par 10 minutes).
 *
 * Le relais suit le contrat du front 3 (`lib/relay.ts` de la branche
 * `nouveau-front-3`) : jeton interne `X-Front-Token` et adresse du visiteur
 * en `X-Client-Ip`, que le middleware `TrustFrontRelay` de l'API reconnaît
 * — la limite d'envoi vise ainsi le visiteur, pas le serveur du site.
 *
 * Une seule adaptation des valeurs : les cases cochées partent avec « 1 »,
 * ce qu'accepte la règle `accepted` de Laravel, et non « oui ».
 *
 * Aucune valeur saisie n'est journalisée : des données personnelles dans les
 * journaux d'application sont un traitement qui ne dit pas son nom.
 */

/** Les champs ajoutés par React à toute action de formulaire. */
const isTechnical = (key: string) => key.startsWith('$ACTION')

/** Les valeurs repartent avec l'erreur, pour que le formulaire ne se vide pas. */
function echo(data: FormData): Record<string, string> {
  const values: Record<string, string> = {}
  for (const [key, value] of data.entries()) {
    if (isTechnical(key) || typeof value !== 'string' || key.startsWith('_')) continue
    values[key] = value
  }
  return values
}

/** Adresse du visiteur ; sur Vercel, x-forwarded-for est posé par la plateforme. */
async function visitorIp(): Promise<string | null> {
  const list = await headers()
  return sanitizeIp(list.get('x-forwarded-for')) ?? sanitizeIp(list.get('x-real-ip'))
}

export async function submitBackofficeForm(
  slug: FormSlug,
  _previous: FormState,
  data: FormData,
): Promise<FormState> {
  const values = echo(data)

  if (!isApiConfigured) {
    return {
      status: 'error',
      message:
        'Le formulaire n’est pas relié au back-office (API_URL). Votre demande n’a pas été transmise : appelez-nous ou écrivez-nous directement.',
      values,
    }
  }

  const outgoing = new FormData()
  for (const [key, value] of data.entries()) {
    if (isTechnical(key)) continue
    if (typeof value === 'string') {
      outgoing.append(key, value === 'oui' ? '1' : value)
    } else if (value.size > 0) {
      // Un champ fichier laissé vide arrive comme un fichier de taille nulle.
      outgoing.append(key, value, value.name)
    }
  }

  const response = await apiPost(`/forms/${slug}/submissions`, outgoing, await visitorIp())
  const { body } = response

  // 502 / 503 : back-office injoignable, ou réponse qui n'était pas la sienne.
  if (response.status === 502 || response.status === 503) {
    return {
      status: 'error',
      message:
        'Le service d’envoi ne répond pas pour le moment. Votre demande n’a pas été transmise : réessayez dans un instant, ou appelez-nous.',
      values,
    }
  }

  // 201 : enregistrée. 202 : le champ piège était rempli — on répond comme si
  // tout allait bien, exactement comme le back-office.
  if (response.status === 201 || response.status === 202) {
    return { status: 'success', message: body.message ?? 'Votre demande a bien été envoyée.' }
  }

  if (response.status === 422) {
    const errors: FieldErrors = {}
    for (const [key, messages] of Object.entries(body.errors ?? {})) {
      if (messages[0]) errors[key] = messages[0]
    }
    return {
      status: 'error',
      message: 'Votre demande n’a pas pu être envoyée. Merci de vérifier les champs signalés.',
      errors,
      values,
    }
  }

  if (response.status === 429) {
    return {
      status: 'error',
      message:
        'Plusieurs envois viennent d’être faits depuis votre connexion. Merci de patienter quelques minutes avant de réessayer.',
      values,
    }
  }

  return {
    status: 'error',
    message:
      'Votre demande n’a pas pu être transmise. Réessayez dans un instant, ou appelez-nous directement.',
    values,
  }
}
