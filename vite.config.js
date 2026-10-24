import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// Multi-página: BadDev publica editor, menú Learn, lecciones, manual y Sandbox.
// Base relativa compatible con Netlify y GitHub Pages en subcarpetas.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist', sourcemap: false,
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
