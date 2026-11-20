import 'server-only'

import { trustApiCertificate } from '@/lib/api/ca'

/**
 * Variables serveur du branchement au back-office (voir `.env.example`).
 * Rien ici n'est envoyé au navigateur.
 *
 * Mêmes noms que le front 3 (branche `nouveau-front-3`) et que l'API
 * (`FRONT_INTERNAL_TOKEN` des deux côtés) : la configuration de déploiement
 * déjà en place sert telle quelle.
 *
 * `API_URL` est l'ORIGINE de l'API, sans `/api/v1` : les fichiers publics
 * (`/storage`, `/media`) sont servis à la racine.
 */
export const API_URL = (process.env.API_URL ?? '').replace(/\/+$/, '')
export const FRONT_TOKEN = process.env.FRONT_INTERNAL_TOKEN ?? ''
export const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? ''
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

/** Sans `API_URL`, le site tourne sur ses données d'exemple (`src/data`). */
export const isApiConfigured = API_URL !== ''

// Avant tout appel à l'API : certificat du serveur de test épinglé, si
// API_CA_CERT est fourni.
trustApiCertificate()
