# BadDev V 1.3 — Imágenes en la vista previa

**CODE WITHOUT MERCY.**

Esta es una actualización visual completa construida a partir de la Etapa G, con Python en el navegador y puente local, 12 lenguajes, Learn Without Mercy, Sandbox y proyectos.

## Novedades

### V 1.3 — Imágenes en la vista previa

- Al **abrir una carpeta** como proyecto, BadDev identifica las imágenes (PNG, JPG/JPEG, GIF, WebP, SVG, BMP, ICO y AVIF) en cualquier subcarpeta, por ejemplo `images/` o `img/`.
- La **vista previa HTML** las muestra desde `<img src>`, `srcset`, `<source>`, `poster`, favicon, `style="background:url(...)"`, bloques `<style>` y hojas `.css` externas (las rutas relativas se resuelven desde cada archivo).
- La **vista previa Markdown** muestra `![texto](images/foto.png)`.
- Si una imagen no existe, aparece un aviso en la consola de la vista previa y se sigue mostrando el resto.
- **Descargar proyecto ZIP** incluye también las imágenes.
- Límites: 3 MB por imagen, 25 MB y 200 imágenes por proyecto. Las imágenes no se editan ni aparecen en el explorador de archivos de código.
- Las imágenes viven en memoria mientras el proyecto está abierto: el respaldo de emergencia solo guarda texto, así que tras restaurarlo vuelve a abrir la carpeta para ver las imágenes.
- La vista previa sigue aislada: sin red; las imágenes se incrustan como `data:` dentro del iframe.


### X para cerrar todo el proyecto

- Abre o crea un proyecto con **Nuevo proyecto** / **Abrir proyecto**.
- Dentro del explorador, al lado del nombre bajo **PROYECTO ACTUAL**, aparece una **X**.
- Al pulsarla, BadDev usa el mismo sistema de cierre que **Cerrar proyecto**: si hay cambios, solicita **Guardar en…**, **Guardar como…** o **No guardar**.
- Si todo está guardado, BadDev te confirma el cierre y regresa al menú. Nunca es necesario cerrar pestañas una por una.
- La X no aparece al trabajar con archivos sueltos; el botón superior **Cerrar proyecto** sigue disponible para cerrar ese espacio de trabajo.

### Temas con personalidad

- **Demon Red:** negro profundo y rojo demoníaco más presente.
- **Inferno Purple:** superficies violetas, selección morada, contornos y hover.
- **Toxic Green:** verdes oscuros, acentos verdes y explorador temático.
- **Dev Slayer:** negro cálido, cobre y naranja intenso.
- **Angelical Water:** se conserva tal como estaba (celeste y marfil pálido).

Los nuevos tonos se ven en el editor, pestañas, explorador, vistas de Python, búsqueda, menús, ventanas, Learn y Sandbox. Los colores de las páginas que programas dentro de la vista previa NO se alteran.

## Instalar en Windows (Sublime Text)

1. Guarda o exporta tus archivos personales antes de cambiar de versión.
2. Extrae **BadDev-V1.3.zip** en una carpeta nueva.
3. Abre la carpeta **BadDev-V1.3** con **File → Open Folder** en Sublime Text.
4. Abre CMD en esa carpeta y ejecuta:

```bat
npm install
npm run dev
```

5. Abre en Chrome la dirección indicada por Vite (habitualmente http://127.0.0.1:5173/).

## Pruebas recomendadas

1. Crea un proyecto y escribe en `index.html` sin guardar.
2. Pulsa la nueva **X** junto a su nombre y comprueba el modal de protección. Usa **Cancelar**: debes conservar tu proyecto y el código.
3. Vuelve a pulsar la X, elige guardar una copia o descartar explícitamente y confirma el regreso al menú.
4. Abre un proyecto guardado para comprobar que la X vuelve a aparecer y que su nombre es correcto.
5. Abre **Configuración** y cambia a cada uno de los cinco temas. Revisa pestañas, panel de Python, vista previa, Learn y Sandbox.
6. Revisa que la función de Python de la Etapa G sigue disponible y que HTML/CSS/JS se visualizan.

## Comandos útiles

```bat
npm test
npm run build
```

## Seguridad del trabajo

Al cerrar el proyecto, **No guardar** descarta los cambios pendientes. La restauración automática de sesiones sigue desactivada, como pediste en la Etapa G. El complemento Python local es opcional y debe iniciarse por separado con `npm run python:bridge` cuando desees usar Python instalado en Windows.

## Límites de verificación

Se ejecutaron pruebas automatizadas Node y se inspeccionaron los estilos en Chromium con HTML/CSS cargados de forma independiente. La compilación completa de Vite y la interacción funcional integral requieren npm instalado y deben comprobarse en Windows.
