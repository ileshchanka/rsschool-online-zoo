/// <reference types="node" />
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        landing: resolve(__dirname, 'online-zoo/pages/landing/index.html'),
        zoos: resolve(__dirname, 'online-zoo/pages/zoos/index.html'),
        'contact-us': resolve(__dirname, 'online-zoo/pages/contact-us/index.html'),
        map: resolve(__dirname, 'online-zoo/pages/map/index.html'),
      },
    },
  },
});
