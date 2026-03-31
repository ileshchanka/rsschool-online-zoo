import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function fromRoot(path: string): string {
  return resolve(process.cwd(), path);
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fromRoot('index.html'),
        landing: fromRoot('online-zoo/pages/landing/index.html'),
        zoos: fromRoot('online-zoo/pages/zoos/index.html'),
        map: fromRoot('online-zoo/pages/map/index.html'),
        contactUs: fromRoot('online-zoo/pages/contact-us/index.html'),
      },
    },
  },
});
