# Comprobación manual — BadDev V 1.2, Etapa B

Estas pruebas deben hacerse en Google Chrome después de `npm install` y `npm run dev`.

## JSON

1. Abre `ejemplos-multilenguaje/datos.json`.
2. Selecciona **Editar → Comprobar JSON / XML / YAML**. Debe indicar que es válido.
3. Abre `errores-etapa-b/invalido.json` y vuelve a comprobar. Debe señalar el error.
4. Pulsa el diagnóstico para ir a la línea del editor.
5. Corrige la coma final, comprueba otra vez y usa **Editar → Ordenar código**.
6. Guarda el archivo en Windows, no solo en el respaldo del navegador.

## XML

1. Abre `datos.xml`: debe ser válido.
2. Abre `errores-etapa-b/invalido.xml`: debe señalar etiquetas mal cerradas.
3. Corrige la etiqueta, vuelve a comprobar. El botón no ejecuta XML.

## YAML

1. Abre `config.yaml` o `config-alternativo.yml`: ambos deben comprobarse.
2. Abre `errores-etapa-b/invalido.yaml`: debe señalar claves duplicadas.
3. Elimina la clave duplicada y comprueba de nuevo.
4. Puedes ordenar YAML con Prettier si el documento es válido.

## Comentarios y edición

1. Abre `main.py`, selecciona una línea y pulsa **Editar → Comentar / descomentar**, o Ctrl+/.
2. Repite el mismo comando y comprueba que recupera el contenido original.
3. Prueba `consulta.sql`, `script.js`, `style.scss`, `datos.xml` e `index.html`.
4. En `datos.json`, el comando debe explicar que JSON estándar no admite comentarios.
5. Dentro de un bloque de código, prueba **Editar → Contraer bloque** y **Expandir bloque**.
6. En un archivo Python, escribe `def` y usa **Ctrl+Espacio** para las plantillas. Prueba también SQL y YAML.

## Formateo

Prueba HTML, CSS, JavaScript, TypeScript, JSON, Markdown, SCSS y YAML. El código solo debe actualizarse cuando Prettier termine correctamente; `Ctrl+Z` debe permitir deshacer el cambio.

## Regresiones

Crea un proyecto con HTML, CSS y JavaScript. Comprueba la vista previa, la consola de JavaScript, guardado, pestañas, búsqueda, temas, pantalla de carga, Learn, Manual, Sandbox y regreso al menú.

**No uses el botón de vista previa para PHP, Python, SQL o SCSS:** no se ejecutan en el navegador.
