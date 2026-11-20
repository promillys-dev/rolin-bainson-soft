import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Champs de formulaire.
 *
 * Trois exigences d'accessibilité tenues ici une fois pour toutes, plutôt que
 * répétées dans chaque formulaire :
 *  - chaque champ a un `<label>` relié par `htmlFor`, jamais un `placeholder`
 *    en guise d'étiquette ;
 *  - un champ en erreur porte `aria-invalid` et `aria-describedby` vers le
 *    message, pour qu'un lecteur d'écran l'annonce au lieu de laisser
 *    deviner ;
 *  - les champs obligatoires sont marqués dans le texte du label, pas
 *    seulement par une astérisque rouge.
 *
 * Le site précédent construisait ses formulaires sans rien de tout cela — il
 * montait même son en-tête en `<table>`. On part propre.
 */

export const controlClass =
  'w-full rounded-card border border-line bg-surface-warm px-3.5 py-3 text-[0.9375rem] text-ink-900 transition-colors duration-200 placeholder:text-ink-300 hover:border-line-strong focus:border-brand-500 focus:bg-surface focus:outline-none'

const errorControlClass = 'border-brand-600 bg-brand-50'

function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-900">
        {label}
        {required ? null : <span className="ml-1.5 text-ink-400">(facultatif)</span>}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mb-1.5 text-xs text-ink-400">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-brand-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}

export function TextField({
  id,
  name,
  label,
  type = 'text',
  required,
  hint,
  error,
  autoComplete,
  inputMode,
  defaultValue,
  placeholder,
  className,
}: {
  id: string
  name: string
  label: string
  type?: 'text' | 'email' | 'tel'
  required?: boolean
  hint?: string
  error?: string
  autoComplete?: string
  inputMode?: 'text' | 'email' | 'tel' | 'numeric'
  defaultValue?: string
  placeholder?: string
  className?: string
}) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass, error && errorControlClass)}
      />
    </FieldShell>
  )
}

export function TextAreaField({
  id,
  name,
  label,
  required,
  hint,
  error,
  rows = 6,
  defaultValue,
  className,
}: {
  id: string
  name: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  rows?: number
  defaultValue?: string
  className?: string
}) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass, 'resize-y', error && errorControlClass)}
      />
    </FieldShell>
  )
}

export function SelectField({
  id,
  name,
  label,
  options,
  required,
  hint,
  error,
  defaultValue,
  placeholder = 'Choisir…',
  className,
}: {
  id: string
  name: string
  label: string
  options: readonly string[]
  required?: boolean
  hint?: string
  error?: string
  defaultValue?: string
  placeholder?: string
  className?: string
}) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      {/*
        `key` sur le `<select>` : React 19 réinitialise les champs non
        contrôlés après une action de formulaire. Un `<input>` retrouve alors
        son `defaultValue`, mais un `<select>` revient à sa première option —
        React ne repositionne la sélection qu'au montage. Sans ce remontage,
        une erreur de saisie ailleurs dans le formulaire effacerait l'objet de
        la demande sans que personne ne le remarque avant l'envoi.
      */}
      <select
        key={defaultValue ?? ''}
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ''}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass, error && errorControlClass)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

/**
 * Groupe de boutons radio.
 *
 * Un `<fieldset>` avec sa `<legend>` : c'est la seule structure qu'un lecteur
 * d'écran annonce comme un choix unique. Des `<label>` empilés sans fieldset
 * laissent l'utilisateur sans contexte à partir du deuxième bouton.
 */
export function RadioGroup({
  name,
  legend,
  options,
  required,
  error,
  defaultValue,
  className,
}: {
  name: string
  legend: string
  options: readonly string[]
  required?: boolean
  error?: string
  defaultValue?: string
  className?: string
}) {
  return (
    <fieldset className={className}>
      <legend className="mb-2 text-sm font-medium text-ink-900">
        {legend}
        {required ? null : <span className="ml-1.5 text-ink-400">(facultatif)</span>}
      </legend>
      <div
        className="flex flex-wrap gap-2"
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {options.map((option) => {
          const id = `${name}-${option.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
          return (
            <div key={option}>
              <input
                type="radio"
                id={id}
                name={name}
                value={option}
                defaultChecked={defaultValue === option}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className="inline-flex cursor-pointer items-center rounded-pill border border-line bg-surface px-4 py-2 text-sm text-ink-700 transition-colors select-none hover:border-line-strong peer-checked:border-ink-900 peer-checked:bg-ink-900 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600"
              >
                {option}
              </label>
            </div>
          )
        })}
      </div>
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-brand-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

export function CheckboxField({
  id,
  name,
  error,
  defaultChecked,
  children,
}: {
  id: string
  name: string
  error?: string
  defaultChecked?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <div className="flex gap-3">
        <input
          type="checkbox"
          id={id}
          name={name}
          value="oui"
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 size-4 shrink-0 accent-brand-600"
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-ink-700">
          {children}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 ml-7 text-sm text-brand-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function FileField({
  id,
  name,
  label,
  accept,
  required,
  hint,
  error,
}: {
  id: string
  name: string
  label: string
  accept: string
  required?: boolean
  hint?: string
  error?: string
}) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(
          'w-full rounded-card border border-dashed border-line-strong bg-surface-warm px-3.5 py-3 text-[0.9375rem] text-ink-700',
          'file:mr-4 file:cursor-pointer file:rounded-pill file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-ink-700',
          error && errorControlClass,
        )}
      />
    </FieldShell>
  )
}

/** Bandeau de résultat, annoncé par les lecteurs d'écran dès son apparition. */
export function FormAlert({ status, message }: { status: 'success' | 'error'; message: string }) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        'rounded-card border px-4 py-3 text-[0.9375rem] leading-relaxed',
        status === 'success'
          ? 'border-accent-700/30 bg-accent-700/8 text-accent-700'
          : 'border-brand-300 bg-brand-50 text-brand-800',
      )}
    >
      {message}
    </p>
  )
}

/**
 * Mention RGPD.
 *
 * La case de consentement existait déjà sur les trois formulaires du site
 * précédent — c'était l'un de ses bons points, et elle est conservée. Le
 * texte dit la finalité, la durée et le droit d'accès : une case cochée sans
 * ces trois informations ne vaut pas consentement éclairé.
 */
export function ConsentField({
  error,
  purpose,
  defaultChecked,
}: {
  error?: string
  purpose: string
  defaultChecked?: boolean
}) {
  return (
    <div className="rounded-card bg-surface-muted p-4">
      <CheckboxField
        id="consentement"
        name="consentement"
        error={error}
        defaultChecked={defaultChecked}
      >
        J’accepte que mes informations soient utilisées pour {purpose}. Elles sont conservées trois
        ans, ne sont transmises à personne en dehors du groupe, et je peux demander leur
        rectification ou leur effacement à tout moment en écrivant à contact@rolinbainson.com.
      </CheckboxField>
    </div>
  )
}
