import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Les fichiers de l'API (/storage, /media) passent par les routes du site
  // (src/lib/api/file.ts) : next/image ne charge que des images locales, et
  // l'origine de l'API n'apparaît jamais dans les pages. Même règle que le
  // front 3.
  images: {
    localPatterns: [{ pathname: '/storage/**' }, { pathname: '/media/**' }, { pathname: '/brand/**' }],
  },

  // Liens du menu du back-office qui ne correspondent pas aux adresses du
  // site. Les rediriger garde les deux côtés valides en attendant que le
  // back-office soit corrigé.
  async redirects() {
    return [
      { source: '/courtage-dassurances', destination: '/courtage-d-assurances', permanent: false },
      { source: '/etre-rappele/nous-ecrire', destination: '/nous-ecrire', permanent: false },
      { source: '/cookies', destination: '/cgu', permanent: false },
    ]
  },

  // En-têtes de sécurité : posés dès le squelette, pas en rattrapage.
  // La CSP est volontairement absente tant que la liste des origines
  // (cartographie, analytics) n'est pas arrêtée — une CSP fausse est pire
  // qu'une CSP absente car on finit par la désactiver.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ]
  },
}

export default nextConfig
