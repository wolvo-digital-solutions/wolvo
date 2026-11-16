import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Standalone Vite configuration for the Admin Application
// Runs on port 5175 by default, deployable to admin.yourdomain.com
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5175,
    strictPort: false,
  },
  preview: {
    port: 5175,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
