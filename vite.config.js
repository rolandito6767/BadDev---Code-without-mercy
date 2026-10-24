import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

// Configuración unificada para BadDev: Multi-página + Soporte de Electron Desktop
export default defineConfig({
  base: './',
  plugins: [
    electron({
      entry: 'main.js', // Aquí arranca tu archivo de Electron
    }),
    renderer(),
  ],
  build: {
    outDir: 'dist', 
    sourcemap: false,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        learn: fileURLToPath(new URL('./learn.html', import.meta.url)),
        lessons: fileURLToPath(new URL('./lessons.html', import.meta.url)),
        manual: fileURLToPath(new URL('./manual.html', import.meta.url)),
        sandbox: fileURLToPath(new URL('./sandbox.html', import.meta.url))
      }
    }
  }
});
