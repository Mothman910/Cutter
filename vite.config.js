import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Włącz mapy źródeł
  },
  server: {
    port: 5174, // Upewnij się, że port jest zgodny z konfiguracją debugowania
  },
});
