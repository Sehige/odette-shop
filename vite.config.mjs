import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactRouter } from '@react-router/dev/vite';

export default defineConfig({
  // React Router's plugin builds and prerenders the site (react-router.config.js);
  // Vitest renders components on their own and only needs the React plugin.
  plugins: [process.env.VITEST ? react() : reactRouter()],
  // Keep the env names from the CRA days (REACT_APP_*, set in .env and in Vercel)
  envPrefix: ['VITE_', 'REACT_APP_'],
  server: { port: 3000 },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
