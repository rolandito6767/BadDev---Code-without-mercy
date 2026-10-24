# Lista de pruebas — BadDev Etapa G

1. Inicia BadDev con `npm install` y `npm run dev`. Comprueba que el menú y los cinco temas funcionan.
2. Crea `main.py`. Debe aparecer el botón `▶ Python`.
3. Pulsa el botón, selecciona **Navegador · Pyodide**, escribe `print("Hola desde Python")`, pulsa Ejecutar. Debe aparecer la salida.
4. Ejecuta un ejemplo de `input()` con datos en el cuadro Entrada y verifica las respuestas.
5. Ejecuta Python erróneo (`if True print(3)`) y comprueba el error.
6. Prueba un bucle largo y detén con `■ Detener`. Debe liberar la interfaz.
7. Abre un segundo CMD, verifica `py -3 --version`, inicia `npm run python:bridge` y selecciona **Windows · Python local**.
8. Repite `print`, `input()` y el error de sintaxis. Prueba cerrar el complemento con Ctrl+C y vuelve a ejecutar: debe indicar que no está disponible.
9. Vuelve a seleccionar `index.html` en Vista previa. HTML/CSS/JS deben seguir funcionando; repite con Markdown, JSON y TypeScript.
10. Guarda o exporta un proyecto, cierra y vuelve a abrirlo. Python no debe ejecutarse automáticamente.
11. Visita Learn, Lecciones y Manual: los 12 lenguajes y Sandbox deben mantenerse.
12. Cambia a Angelical Water: consola Python debe mostrar un fondo azul claro legible.
13. Ejecuta `npm test` y `npm run build`.

**Nota:** el complemento local NO aísla Python del equipo; ejecuta solo código confiable.
