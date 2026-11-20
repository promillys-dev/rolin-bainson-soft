import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/**
 * Config plate native. On n'utilise pas le pont `FlatCompat` de
 * @eslint/eslintrc : avec ESLint 10 il plante au chargement de
 * eslint-config-next (référence circulaire à la sérialisation du schéma).
 * eslint-config-next 16 exporte déjà des tableaux de config plate.
 */
const eslintConfig = [
  // `.claude/worktrees` contient les copies de travail des sessions
  // parallèles : les linter ici mélangerait leur code en cours avec le nôtre.
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', '.claude/worktrees/**'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
]

export default eslintConfig
