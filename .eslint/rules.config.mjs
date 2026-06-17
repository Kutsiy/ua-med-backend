import { defineConfig } from 'eslint/config';
import boundaries from 'eslint-plugin-boundaries';

export default defineConfig({
  files: ['{src,apps,libs,test}/**/*.ts'],

  rules: {
    ...boundaries.configs.recommended.rules,
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],

    // * Eslint-Sonar
    'sonarjs/cognitive-complexity': ['warn', 15],
    'sonarjs/no-identical-functions': 'warn',
    'sonarjs/no-duplicated-branches': 'warn',
    'sonarjs/no-identical-expressions': 'warn',
    'sonarjs/no-redundant-boolean': 'warn',
    'sonarjs/no-small-switch': 'warn',
    'sonarjs/no-inverted-boolean-check': 'warn',
    'sonarjs/prefer-single-boolean-return': 'warn',

    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '**/common/**',
              '**/common',
              '!@nestjs/common',
              '!@nestjs/common/**',
              '!@common',
              '!@common/**',
            ],
            message:
              'Do not import from common directly, use the alias instead.',
          },
          {
            group: ['**/src/**', '**/src'],
            message: 'Do NOT import from src directly, use the alias instead.',
          },
        ],
      },
    ],

    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        rules: [
          {
            from: { type: 'domain' },
            allow: { to: { type: 'domain' } },
          },
          {
            from: { type: 'services' },
            allow: { to: { type: ['services', 'domain'] } },
          },
          {
            from: { type: 'infrastructure' },
            allow: {
              to: { type: ['infrastructure', 'services', 'domain'] },
            },
          },
          {
            from: { type: 'presentation' },
            allow: {
              to: { type: ['presentation', 'services', 'domain'] },
            },
          },
        ],
      },
    ],
  },
});
