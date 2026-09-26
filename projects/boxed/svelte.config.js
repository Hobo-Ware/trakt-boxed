import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT = join(__dirname, '../client');

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess({
    style: {
      resolve: {
        alias: {
          $style: join(CLIENT, 'src/style'),
        },
      },
    },
  }),

  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>'],
      },
      platformProxy: {
        configPath: 'wrangler.jsonc',
        environment: undefined,
        experimentalJsonConfig: false,
        persist: false,
      },
    }),
    serviceWorker: {
      register: false,
    },
    paths: {
      relative: false,
    },
    files: {
      lib: join(CLIENT, 'src/lib'),
      assets: join(CLIENT, 'static'),
      hooks: {
        server: join(CLIENT, 'src/hooks.server'),
        client: join(CLIENT, 'src/hooks.client'),
      },
    },
    alias: {
      '$boxed': './src/boxed',
      '$clientRoutes': join(CLIENT, 'src/routes'),
      '$mocks': join(CLIENT, 'src/mocks'),
      '$worker': join(CLIENT, 'src/worker'),
      '$test': join(CLIENT, 'test'),
      '$style': join(CLIENT, 'src/style'),
      '$static': join(CLIENT, 'static'),
      '$e2e': join(CLIENT, 'e2e'),
      '$types': './.svelte-kit/types/src/routes',
    },
  },
};

export default config;
