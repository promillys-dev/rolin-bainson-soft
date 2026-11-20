/**
 * État d'un formulaire entre le navigateur et l'action serveur.
 *
 * Les formulaires sont définis et validés par le back-office (`lib/
 * backofficeForms.ts`, `app/actions.ts`) : le site ne tient plus ni liste
 * de choix ni règle de validation. Restent les deux règles de l'audit
 * (`SPEC §3.7`), que le back-office applique désormais :
 *  - le consentement est une case OBLIGATOIRE sur tous les formulaires ;
 *  - aucune donnée personnelle ne transite par l'URL : tout passe par une
 *    action serveur en POST.
 */

export type FieldErrors = Record<string, string>

export type FormState = {
  status: 'idle' | 'success' | 'error'
  /** Message global, affiché en tête de formulaire. */
  message?: string
  errors?: FieldErrors
  /**
   * Valeurs saisies, renvoyées telles quelles en cas d'erreur.
   *
   * React 19 réinitialise les champs non contrôlés d'un `<form action={…}>`
   * une fois l'action terminée. Sans ce renvoi, un formulaire refusé pour une
   * adresse mal tapée repartirait vide — c'est-à-dire qu'il serait abandonné.
   * Les champs lisent donc `values` comme `defaultValue`, ce qui remplit à
   * nouveau le formulaire au moment même où React le vide.
   */
  values?: Record<string, string>
}

export const idleFormState: FormState = { status: 'idle' }
