import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// BadDev: web multipágina. El mismo resultado (carpeta dist) lo usan Netlify, GitHub Pages y Electron.
export default defineConfig({
  base: './',
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
