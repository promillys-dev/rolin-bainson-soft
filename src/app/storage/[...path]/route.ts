import { relayApiFile } from '@/lib/api/file'

/** Fichiers publics de l'API servis depuis l'origine du site (voir lib/api/file.ts). */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return relayApiFile('storage', (await params).path)
}
