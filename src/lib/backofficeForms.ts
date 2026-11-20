import { apiFind, isApiConfigured, warnFixtures } from '@/lib/api/client'

/**
 * Les formulaires du site, définis en back-office (`/api/v1/forms/{slug}`).
 *
 * Champs, libellés, ordre, largeurs, bouton, message de remerciement et
 * durée de conservation se règlent dans le back-office ; le site les affiche
 * tels quels. Ajouter un champ « Disponibilités » au formulaire de contact ne
 * demande donc aucune livraison du site.
 *
 * Trois formulaires existent : `contact` (contact, nous écrire, être
 * rappelé), `projet-immobilier` et `candidature`. Sans `API_URL`, le site
 * affiche les définitions d'exemple ci-dessous, recopiées du back-office.
 */

export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'consent'
  | 'heading'

export type FormFieldDefinition = {
  key: string
  type: FormFieldType
  label: string
  help: string | null
  placeholder: string | null
  choices: readonly string[]
  isRequired: boolean
  maxLength: number | null
  /** Largeur en quarts de ligne : 4 pleine largeur, 2 une moitié, 1 un quart. */
  width: number
}

export type FormDefinition = {
  slug: string
  name: string
  submitLabel: string
  successMessage: string
  retentionDays: number
  fields: readonly FormFieldDefinition[]
}

export type FormSlug = 'contact' | 'projet-immobilier' | 'candidature'

const field = (
  key: string,
  type: FormFieldType,
  label: string,
  options: Partial<Omit<FormFieldDefinition, 'key' | 'type' | 'label'>> = {},
): FormFieldDefinition => ({
  key,
  type,
  label,
  help: null,
  placeholder: null,
  choices: [],
  isRequired: false,
  maxLength: null,
  width: 4,
  ...options,
})

const consent = field('consentement', 'consent', 'J’accepte que mes données soient utilisées pour traiter ma demande', {
  isRequired: true,
  help: 'Vous pouvez demander la suppression de vos données à tout moment.',
})

/** Définitions d'exemple, recopiées du back-office, pour travailler sans lui. */
const FIXTURES: Record<FormSlug, FormDefinition> = {
  contact: {
    slug: 'contact',
    name: 'Contact / être rappelé',
    submitLabel: 'Envoyer ma demande',
    successMessage: 'Votre message a bien été envoyé. Nous vous répondons sous 48 heures ouvrées.',
    retentionDays: 365,
    fields: [
      field('prenom', 'text', 'Prénom', { isRequired: true, width: 2 }),
      field('nom', 'text', 'Nom', { isRequired: true, width: 2 }),
      field('email', 'email', 'Adresse e-mail', { isRequired: true, width: 2 }),
      field('telephone', 'tel', 'Téléphone', { width: 2, help: 'Pour vous joindre entre 9 h et 18 h.' }),
      field('adresse', 'text', 'Adresse', { width: 2 }),
      field('objet', 'select', 'Objet de la demande', {
        isRequired: true,
        choices: ['Transaction', 'Gestion locative', 'Syndic de copropriété', 'Assurances', 'Autre'],
      }),
      field('message', 'textarea', 'Votre message', { isRequired: true, maxLength: 4000 }),
      field('rappel', 'checkbox', 'Je souhaite être rappelé(e)'),
      consent,
    ],
  },
  'projet-immobilier': {
    slug: 'projet-immobilier',
    name: 'Projet immobilier',
    submitLabel: 'Envoyer mon projet',
    successMessage: 'Merci. Un conseiller vous contacte pour préciser votre projet.',
    retentionDays: 365,
    fields: [
      field('civilite', 'radio', 'Civilité', { choices: ['Madame', 'Monsieur'] }),
      field('nom', 'text', 'Nom', { isRequired: true, width: 2 }),
      field('email', 'email', 'Adresse e-mail', { isRequired: true, width: 2 }),
      field('telephone', 'tel', 'Téléphone', { width: 2 }),
      field('nature-du-projet', 'select', 'Nature du projet', {
        isRequired: true,
        width: 2,
        choices: ['Achat', 'Vente', 'Location', 'Mise en gestion', 'Estimation'],
      }),
      field('type-de-bien', 'select', 'Type de bien', {
        width: 2,
        choices: ['Appartement', 'Maison', 'Terrain', 'Local commercial', 'Garage', 'Immeuble'],
      }),
      field('pieces', 'text', 'Nombre de pièces', { width: 2 }),
      field('code-postal', 'text', 'Code postal', { width: 2 }),
      field('ville', 'text', 'Ville', { width: 2 }),
      field('message', 'textarea', 'Votre message'),
      field('rappel', 'checkbox', 'Je souhaite être rappelé(e)'),
      consent,
    ],
  },
  candidature: {
    slug: 'candidature',
    name: 'Candidature',
    submitLabel: 'Envoyer ma candidature',
    successMessage:
      'Votre candidature est bien arrivée. Nous revenons vers vous si votre profil correspond à un poste ouvert.',
    retentionDays: 730,
    fields: [
      field('prenom', 'text', 'Prénom', { isRequired: true, width: 2 }),
      field('nom', 'text', 'Nom', { isRequired: true, width: 2 }),
      field('email', 'email', 'Adresse e-mail', { isRequired: true }),
      field('cv', 'file', 'Votre CV', { isRequired: true, help: 'PDF de 10 Mo maximum.' }),
      consent,
    ],
  },
}

/**
 * La définition d'un formulaire. `undefined` si le back-office l'a
 * désactivé : la page affiche alors ses coordonnées, sans formulaire.
 */
export async function getFormDefinition(slug: FormSlug): Promise<FormDefinition | undefined> {
  if (!isApiConfigured) {
    warnFixtures()
    return FIXTURES[slug]
  }
  const response = await apiFind<{ data: FormDefinition }>(`/forms/${slug}`, ['forms'])
  return response?.data
}
