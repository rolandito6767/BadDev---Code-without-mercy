# BadDev V 1.4 — Terminal, comandos y consola

**CODE WITHOUT MERCY.**

Esta es una actualización visual completa construida a partir de la Etapa G, con Python en el navegador y puente local, 12 lenguajes, Learn Without Mercy, Sandbox y proyectos.

## Novedades

### V 1.4 — Terminal integrada (Fase 1)

Abre la terminal con **Ver → Terminal**, el botón `>_` de la barra de pestañas o **Ctrl+`**. Tiene dos pestañas:

- **BADDEV** (web y .exe): comandos propios que trabajan sobre los archivos de tu proyecto abierto: `ls`, `tree`, `cd`, `cat`, `head`, `wc`, `abrir`, `nuevo`, `buscar`, `vista`, `python`, `guardar`, `zip`, `tema`, `imagenes`, `proyecto`, `version`, `echo`, `fecha`, `limpiar`, `cmd`, `salir`, `mercy`. Tab completa comandos y archivos; flecha arriba repite; Ctrl+L limpia. `ayuda` lista todo y `ayuda <comando>` explica uso y ejemplo.
- **CMD REAL** (solo app de escritorio): ejecuta comandos reales de Windows (`dir`, `cd`, `git`, `npm`, `node`, `python`…) con tus permisos. Elige la carpeta de trabajo con el botón ▣. Ctrl+C detiene el comando. `ayuda <comando>` explica cualquier comando de Windows (`ayuda dir`, `ayuda del`…). En la versión web esta pestaña solo muestra las explicaciones.
- Límites de CMD REAL: no es una terminal interactiva completa (sin editores ni asistentes que usen teclas especiales).
- Seguridad: solo la ventana principal puede usar la terminal real (no Learn, Sandbox ni la vista previa), con `contextIsolation`, sandbox y un preload que expone únicamente seis funciones.
- El botón **Terminal** (`>_`) está en la barra superior y se ilumina mientras la terminal está abierta.

### V 1.4 — Fase 2: aprender comandos, consola e imágenes

- **Learn → Lecciones y Manual → «Aprender comandos» / «Leer comandos»** (tarjeta extra bajo los 12 lenguajes): 10 lecciones con retos y manual con teoría, puntos clave, buenas prácticas y errores frecuentes. Cubren los comandos propios de BadDev y los de CMD (dir, cd, copy, del, findstr, git, npm, node…). Los textos salen de la misma fuente que el comando `ayuda` de la terminal.
- **Consola de la vista previa mejorada**: cada mensaje lleva hora y etiqueta (ERROR, AVISO, LOG, INFO) con color, filtros Todo / Errores / Avisos / Logs con contador, botón **Copiar** y **Limpiar**, y un mensaje cuando está vacía.
- **Imágenes**: la vista previa ahora permite imágenes de internet (`https://`) además de las de tu carpeta. Los scripts y las conexiones externas siguen bloqueados. Al previsualizar una página con imágenes de internet, el navegador las descarga (hace una conexión).

### V 1.3 — Imágenes en la vista previa

- Al **abrir una carpeta** como proyecto, BadDev identifica las imágenes (PNG, JPG/JPEG, GIF, WebP, SVG, BMP, ICO y AVIF) en cualquier subcarpeta, por ejemplo `images/` o `img/`.
- La **vista previa HTML** las muestra desde `<img src>`, `srcset`, `<source>`, `poster`, favicon, `style="background:url(...)"`, bloques `<style>` y hojas `.css` externas (las rutas relativas se resuelven desde cada archivo).
- La **vista previa Markdown** muestra `![texto](images/foto.png)`.
- Si una imagen no existe, aparece un aviso en la consola de la vista previa y se sigue mostrando el resto.
- **Descargar proyecto ZIP** incluye también las imágenes.
- Límites: 3 MB por imagen, 25 MB y 200 imágenes por proyecto. Las imágenes no se editan ni aparecen en el explorador de archivos de código.
- Las imágenes viven en memoria mientras el proyecto está abierto: el respaldo de emergencia solo guarda texto, así que tras restaurarlo vuelve a abrir la carpeta para ver las imágenes.
- **Enlaces entre páginas:** en la vista previa, un `<a href="menu.html">` abre ese archivo del proyecto (ya no carga la pantalla de BadDev dentro del iframe). Los `#anclas` se desplazan, `window.open('pagina.html')` abre el archivo y los enlaces externos (https://…) se avisan en la consola sin abrirse. Si un script usa `location.href`, la vista previa se restaura con un aviso: usa enlaces `<a>`.
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

## Crear el .exe de escritorio (Windows)

1. `npm install`
2. Prueba la app de escritorio sin empaquetar: `npm run desktop:dev` (abre con las herramientas de desarrollo).
3. Genera los ejecutables: `npm run desktop:build`.
4. Resultado en `dist_desktop`: `BadDev-1.3.0-portable.exe` (un solo archivo, sin instalar) y `BadDev-1.3.0-nsis.exe` (instalador). Pesan decenas de MB porque incluyen Electron.

Si aparece «Cannot create symbolic link» al empaquetar, activa el **Modo de desarrollador** de Windows (Configuración → Para programadores) o abre CMD como administrador y repite el paso 3.

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
