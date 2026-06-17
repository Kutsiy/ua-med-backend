// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import boundaries from 'eslint-plugin-boundaries';

export default defineConfig(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**'],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    files: ['{src,apps,libs,test}/**/*.ts'],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      boundaries,
    },

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },

      'boundaries/include': ['src/**/*.ts'],

      'boundaries/elements': [
        {
          type: 'domain',
          pattern: 'src/modules/*/domain/**',
          mode: 'full',
        },
        {
          type: 'services',
          pattern: 'src/modules/*/services/**',
          mode: 'full',
        },
        {
          type: 'infrastructure',
          pattern: 'src/modules/*/infrastructure/**',
          mode: 'full',
        },
        {
          type: 'presentation',
          pattern: 'src/modules/*/presentation/**',
          mode: 'full',
        },
      ],
    },

    rules: {
      ...boundaries.configs.recommended.rules,
      'boundaries/no-unknown-files': 'error',
      'boundaries/no-unknown': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/common/**', '**/common'],
              message:
                'Do not import from common directly, use the alias instead.',
            },
            {
              group: ['**/src/**', '**/src'],
              message:
                'Do NOT import from src directly, use the alias instead.',
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
  },
);
