import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { Environment } from '@trakt/api';
import { execSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { unwasm } from 'unwasm/plugin';
import { defineConfig } from 'vite';

const MONOREPO_ROOT = path.resolve(import.meta.dirname, '../..');
const CLIENT = path.resolve(import.meta.dirname, '../client');

function getGitCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}

const TRAKT_TARGET_ENVIRONMENT = (() => {
  if (process.env.IS_CONTRIB) return Environment.production;
  if (process.env.IS_STAGING) return Environment.staging;

  return Environment.production_private;
})();

const TRAKT_API_PROXY_TARGET = process.env.IS_LOCAL
  ? 'http://localhost:8787'
  : TRAKT_TARGET_ENVIRONMENT;

export default defineConfig(({ mode }) => ({
  define: {
    'TRAKT_CLIENT_ID': `"${process.env.TRAKT_CLIENT_ID}"`,
    'KLIPY_API_KEY': `"${process.env.KLIPY_API_KEY}"`,
    'TRAKT_MODE': `"${mode}"`,
    'TRAKT_TARGET_ENVIRONMENT': `"${TRAKT_TARGET_ENVIRONMENT}"`,
    'TRAKT_GIT_SHA': `"${getGitCommitHash()}"`,
  },

  server: {
    fs: {
      allow: [MONOREPO_ROOT],
    },
    proxy: {
      '/api/trakt': {
        target: TRAKT_API_PROXY_TARGET,
        changeOrigin: true,
        rewrite: (url) => url.replace(/^\/api\/trakt/, ''),
      },
    },
    host: '0.0.0.0',
  },

  plugins: [
    sveltekit(),
    {
      name: 'vite-plugin-unwasm',
      config: () => ({
        build: {
          rollupOptions: {
            plugins: [unwasm({ esmImport: true, lazy: true })],
          },
        },
      }),
    },
    svelteTesting(),
  ],

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    setupFiles: [path.join(CLIENT, 'vitest-setup.ts')],
    reporters: ['dot'],
  },

  resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
}));
