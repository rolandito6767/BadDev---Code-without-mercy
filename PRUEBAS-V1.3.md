# Checklist — BadDev V 1.3, imágenes en la vista previa

- [ ] Abrir proyecto → elegir una carpeta con subcarpeta `images/` (PNG/JPG/SVG...). El aviso indica «N imagen(es) disponibles en la vista previa».
- [ ] Vista previa de `index.html` con `<img src="images/foto.png">` muestra la imagen.
- [ ] `background: url("../images/fondo.png")` dentro de un `.css` en subcarpeta se muestra.
- [ ] `style="background-image:url(images/foto.png)"` en línea se muestra.
- [ ] Una imagen inexistente genera «No se encontró la imagen: …» y no rompe el resto.
- [ ] En un `README.md`, `![texto](images/foto.png)` se muestra; si falta, aparece un marcador.
- [ ] Descargar proyecto ZIP incluye las imágenes (ábrelo y compruébalo).
- [ ] Las URLs externas (https://…) siguen bloqueadas.
- [ ] Cerrar el proyecto y abrir otro no mezcla imágenes del anterior.
- [ ] El menú, el manual y la barra de estado indican V 1.3.

Diagnóstico en CMD: `npm install`, `npm run dev`, `node --test tests/*.test.js`, `npm run build`.

## Enlaces entre páginas (corrección)
- [ ] En un proyecto con varias páginas, un botón `<a href="menu.html">` abre ese archivo en la vista previa y el selector cambia a él.
- [ ] Un `<a href="#seccion">` se desplaza dentro de la misma página.
- [ ] Un enlace a https://… no abre nada y deja un aviso en la consola.
- [ ] Un enlace a un archivo que no existe muestra «No se encontró el archivo enlazado».
