# Auditoría técnica — BadDev 1.0.2 → Etapa A de 1.2

## Fuente de verdad

Se revisó el archivo **BadDev.zip** cargado por el usuario, bajo la ruta interna `BadDev/BadDevvv/`. El archivo original incluye `node_modules`, dependencias de Windows, `package-lock.json` y archivos fuente de la versión **1.0.2**. Esta entrega parte de esa copia real y no de versiones antiguas generadas en otras conversaciones.

## Arquitectura inspeccionada

| Componente | Archivos existentes | Estado actual |
| --- | --- | --- |
| Punto de entrada y menús | `index.html`, `src/main.js`, `src/styles.css` | Se conservan |
| Editor CodeMirror 6 | `src/editor.js`, `src/completions.js` | Se amplía con `src/language-support.js` |
| Archivos sueltos | `src/files.js` | Se amplía a 12 tecnologías |
| Carpetas y guardado | `src/project.js`, `src/zip.js` | Se amplía selección de extensiones; flujo existente conservado |
| Vista previa aislada | `src/preview.js`, iframe HTML aislado | Sin cambios; sigue siendo para web HTML/CSS/JS |
| Preferencias y sesiones | `src/settings.js`, `src/session.js`, `src/lifecycle.js` | Sin cambios de estructura |
| Escuela de programación | `learn.html`, `lessons.html`, `manual.html`, `sandbox.html`, `src/learn-*`, `src/manual-*` | Se conservan; ampliar en etapas D y E |
| Herramientas de formato | `src/formatter.js` (Prettier) | Sin cambios; ampliar en Etapa B |
| Publicación | `vite.config.js`, `netlify.toml`, `.github/workflows/deploy.yml` | Sin cambios |

## Decisiones para proteger el proyecto

- Se creó un **catálogo único** (`src/languages.js`) para extensiones, nombres, etiquetas, distintivos y plantillas; evita listas contradictorias entre menú, carpetas y archivos.
- El soporte de sintaxis se encapsuló en `src/language-support.js`. TypeScript usa el paquete existente `@codemirror/lang-javascript`. Para los otros ocho lenguajes se añadieron paquetes oficiales CodeMirror 6; se importan **bajo demanda** para no cargar todos los analizadores al abrir BadDev.
- No se reemplazó el motor de edición: continúa usando `Compartment`, historial, pestañas y búsqueda existentes.
- Python utiliza 4 espacios de indentación recomendada. Los demás lenguajes respetan la preferencia de 2 o 4 espacios.
- El selector y el guardado de Windows aceptan las nuevas extensiones; el límite original de **250 archivos** y **5 MB por archivo** permanece.
- Se conserva la compatibilidad con archivos `.txt` como texto simple.
- No se añadieron motores simulados de ejecución ni se modificó el sandbox de la vista previa.
- Las dependencias Windows incluidas en el ZIP original no se distribuyen: se debe realizar `npm install` en la computadora destino para generar `node_modules` y un bloqueo actualizado.

## Riesgos conocidos y tareas futuras

1. **Instalación npm:** estos ocho paquetes no están disponibles en el entorno de pruebas sin acceso al registro. El usuario debe ejecutar `npm install` en Windows y revisar `npm run build`.
2. **Etapa B:** validadores/formateadores, comentarios y herramientas por lenguaje. Prettier actual solo admite HTML, CSS y JS.
3. **Etapa C:** vistas previas Markdown/JSON y posible transpilación TypeScript. Python/PHP/SQL/SCSS no se ejecutan.
4. **Etapas D/E:** nuevo selector flotante de manuales por lenguaje y contenido modular educativo.
5. **Etapa F:** accesibilidad, pruebas reales en Chrome, rendimiento y despliegue final.

## Pruebas verificadas aquí

- **64 pruebas automatizadas Node** superadas; 0 errores.
- Todos los módulos `.js` superaron `node --check`.
- Se añadieron pruebas de reconocimiento de lenguajes, tipos de archivo, importación de carpetas, escritura en carpeta, conexión del editor y selector HTML.
- **Compilación completa de Vite: NO verificada** (`vite: not found`, no fue posible instalar dependencias desde npm por falta de red en este entorno).
- **Prueba visual en Chrome de los 12 resaltados: NO verificada**; debe hacerse con las dependencias instaladas.
