// @ts-check
import { defineConfig } from 'eslint/config';
import pluginsConfig from './.eslint/plugins.config.mjs';
import settingsConfig from './.eslint/settings.config.mjs';
import rulesConfig from './.eslint/rules.config.mjs';

export default defineConfig(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**'],
  },
  ...pluginsConfig,
  ...settingsConfig,
  ...rulesConfig,
);
