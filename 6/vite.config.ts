import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5176,
  },
  build: {
    target: 'es2020',
  },
});
