import { defineConfig } from 'vite';

export default defineConfig({
  base: '/GoalSticker26/',
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
