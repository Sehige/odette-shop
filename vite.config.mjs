import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep the env names from the CRA days (REACT_APP_*, set in .env and in Vercel)
  envPrefix: ['VITE_', 'REACT_APP_'],
  // Same output folder as CRA, so the Vercel output setting keeps working
  build: { outDir: 'build' },
  server: { port: 3000 },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
