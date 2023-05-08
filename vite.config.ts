import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

import { createHtmlPlugin } from 'vite-plugin-html';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [wasm(), topLevelAwait(), svelte(), createHtmlPlugin()],
  build: {
    outDir: 'build',
  },
});
