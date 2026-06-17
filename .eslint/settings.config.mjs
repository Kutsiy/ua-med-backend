import { defineConfig } from 'eslint/config';

export default defineConfig({
  files: ['{src,apps,libs,test}/**/*.ts'],
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
});
