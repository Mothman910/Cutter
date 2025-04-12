import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Wlacz mapy źrodel
  },
  server: {
    port: 5174, // Upewnij sie, ze port jest zgodny z konfiguracja debugowania
  },
});
