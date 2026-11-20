import 'server-only'

import tls from 'node:tls'

/**
 * TRANSITOIRE : le serveur de test (*.universe.wf) ne peut pas avoir de vrai
 * certificat (le DNS de universe.wf ne répond pas aux vérifications CAA des
 * autorités).
 *
 * Plutôt que de couper la vérification TLS, on ajoute aux autorités reconnues
 * par Node CE certificat-là, et lui seul, fourni dans `API_CA_CERT`
 * (certificat PUBLIC, au format PEM ; les retours à la ligne peuvent être
 * écrits « \n »). Tout autre certificat auto-signé reste refusé. Sans
 * `API_CA_CERT`, rien ne change.
 *
 * Repris tel quel du front 3 (branche `nouveau-front-3`). À retirer, avec la
 * variable, dès que l'API a un certificat valide.
 */
const PEM = /^-----BEGIN CERTIFICATE-----\n[A-Za-z0-9+/=\n]+\n-----END CERTIFICATE-----$/

/** Node ≥ 22.19 / 24 ; absentes des types @types/node du projet. */
const nodeTls = tls as typeof tls & {
  getCACertificates?: (type?: 'default' | 'system' | 'bundled' | 'extra') => string[]
  setDefaultCACertificates?: (certificates: string[]) => void
}

let applied = false

export const API_CA_CERT = (process.env.API_CA_CERT ?? '').replace(/\\n/g, '\n').replace(/\r/g, '').trim()

export function trustApiCertificate(): void {
  if (applied || !API_CA_CERT) return
  if (!PEM.test(API_CA_CERT)) {
    throw new Error('API_CA_CERT doit contenir un seul certificat PEM (-----BEGIN CERTIFICATE----- ...).')
  }
  if (!nodeTls.getCACertificates || !nodeTls.setDefaultCACertificates) {
    throw new Error('API_CA_CERT demande Node 22.19 ou plus récent (tls.setDefaultCACertificates).')
  }
  nodeTls.setDefaultCACertificates([...nodeTls.getCACertificates('default'), API_CA_CERT])
  applied = true
}
