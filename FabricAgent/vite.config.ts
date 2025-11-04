import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'src',
  publicDir: 'src/public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [react()],
});
