'use client'

// `useActionState` impose un composant client : c'est lui qui conserve la
// saisie et affiche les erreurs champ par champ après un aller-retour serveur.
// Sans JavaScript, le formulaire reste soumis en POST et le back-office
// valide quand même — l'amélioration progressive est assurée par React.

import { usePathname } from 'next/navigation'
import { useActionState } from 'react'
import { submitBackofficeForm } from '@/app/actions'
import {
  CheckboxField,
  FileField,
  FormAlert,
  RadioGroup,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/forms/fields'
import { Button } from '@/components/ui/Button'
import type { FormDefinition, FormFieldDefinition, FormSlug } from '@/lib/backofficeForms'
import { idleFormState } from '@/lib/forms'

/**
 * Un formulaire tel que le back-office le définit.
 *
 * Les champs, leur ordre, leurs libellés, leurs largeurs et le texte du
 * bouton viennent de la définition ; ce composant ne fait que les dessiner
 * avec les champs du site. La largeur est en quarts de ligne, comme en
 * back-office : deux champs « 2 » se partagent une ligne, et tout s'empile
 * sur mobile.
 *
 * Deux champs techniques partent avec chaque envoi : `_piege`, invisible,
 * que seuls les robots remplissent ; `_source`, la page d'où part la
 * demande, pour que l'agence sache d'où elle vient.
 */

const SPAN: Record<number, string> = {
  1: 'col-span-4 sm:col-span-1',
  2: 'col-span-4 sm:col-span-2',
  3: 'col-span-4 sm:col-span-3',
  4: 'col-span-4',
}

/** Saisie automatique du navigateur, devinée d'après la clé du champ. */
const AUTOCOMPLETE: Record<string, string> = {
  prenom: 'given-name',
  nom: 'family-name',
  email: 'email',
  telephone: 'tel',
  adresse: 'street-address',
  'code-postal': 'postal-code',
  ville: 'address-level2',
}

const ACCEPTED_FILES = '.pdf,.doc,.docx,.odt,.jpg,.jpeg,.png'

/** 365 → « un an », 730 → « deux ans » ; sinon en jours. */
function retention(days: number): string {
  if (days === 365) return 'un an'
  if (days === 730) return 'deux ans'
  if (days % 365 === 0) return `${days / 365} ans`
  return `${days} jours`
}

export function BackofficeForm({
  definition,
  defaults = {},
}: {
  definition: FormDefinition
  /** Valeurs de départ, par clé de champ : un objet pré-rempli, une case pré-cochée. */
  defaults?: Record<string, string>
}) {
  const pathname = usePathname()
  const [state, action, pending] = useActionState(
    submitBackofficeForm.bind(null, definition.slug as FormSlug),
    idleFormState,
  )
  const errors = state.errors ?? {}
  // Reprend la saisie refusée ; à défaut, le pré-remplissage de la page.
  const submitted = state.status === 'error' ? (state.values ?? {}) : defaults

  if (state.status === 'success') {
    return <FormAlert status="success" message={state.message ?? definition.successMessage} />
  }

  const renderField = (field: FormFieldDefinition) => {
    const id = `${definition.slug}-${field.key}`
    const common = {
      id,
      name: field.key,
      label: field.label,
      required: field.isRequired,
      hint: field.help ?? undefined,
      error: errors[field.key],
    }

    switch (field.type) {
      case 'heading':
        return <h3 className="pt-2 text-lg font-semibold text-ink-900">{field.label}</h3>
      case 'text':
      case 'email':
      case 'tel':
        return (
          <TextField
            {...common}
            type={field.type}
            autoComplete={AUTOCOMPLETE[field.key]}
            inputMode={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : undefined}
            placeholder={field.placeholder ?? undefined}
            defaultValue={submitted[field.key]}
          />
        )
      case 'textarea':
        return <TextAreaField {...common} defaultValue={submitted[field.key]} />
      case 'select':
        return (
          <SelectField
            {...common}
            options={field.choices}
            placeholder={field.placeholder ?? undefined}
            defaultValue={submitted[field.key]}
          />
        )
      case 'radio':
        return (
          <RadioGroup
            name={field.key}
            legend={field.label}
            options={field.choices}
            required={field.isRequired}
            error={errors[field.key]}
            defaultValue={submitted[field.key]}
          />
        )
      case 'checkbox':
        return (
          <CheckboxField
            id={id}
            name={field.key}
            error={errors[field.key]}
            defaultChecked={submitted[field.key] === 'oui'}
          >
            {field.label}
            {field.help ? <span className="mt-0.5 block text-sm text-ink-400">{field.help}</span> : null}
          </CheckboxField>
        )
      case 'file':
        return <FileField {...common} accept={ACCEPTED_FILES} />
      case 'consent':
        // La durée de conservation vient du réglage du back-office, pas du
        // libellé : elle reste juste quand le réglage change.
        return (
          <CheckboxField
            id={id}
            name={field.key}
            error={errors[field.key]}
            defaultChecked={submitted[field.key] === 'oui'}
          >
            {field.label}
            {field.isRequired ? <span className="text-brand-600"> *</span> : null}
            <span className="mt-1 block text-sm leading-relaxed text-ink-400">
              Vos données sont conservées {retention(definition.retentionDays)}, puis supprimées.
              {field.help ? ` ${field.help}` : ''}
            </span>
          </CheckboxField>
        )
    }
  }

  return (
    <form action={action} className="relative">
      {state.status === 'error' && state.message ? (
        <div className="mb-6">
          <FormAlert status="error" message={state.message} />
        </div>
      ) : null}

      <div className="grid grid-cols-4 gap-5">
        {definition.fields.map((field) => (
          <div key={field.key} className={SPAN[Math.min(Math.max(field.width, 1), 4)] ?? SPAN[4]}>
            {renderField(field)}
          </div>
        ))}
      </div>

      {/* Le piège à robots : hors de l'écran, hors du parcours clavier. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Ne pas remplir ce champ
          <input type="text" name="_piege" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name="_source" value={pathname} />

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? 'Envoi en cours…' : definition.submitLabel}
        </Button>
        <p className="text-sm text-ink-400">
          Les champs marqués d’un astérisque sont obligatoires.
        </p>
      </div>
    </form>
  )
}
