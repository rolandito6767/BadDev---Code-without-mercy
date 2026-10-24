# Checklist de pruebas — BadDev Etapa D

## A. Portada Learn

1. En BadDev, pulsa **¿Nuevo en esto?**.
2. Verifica que se vean las tarjetas **Lecciones** y **Leer Manual** como antes.
3. Confirma que la animación del splash carga y puede saltarse.

## B. Selector del Manual (12 lenguajes)

1. Pulsa **Leer Manual**.
2. Se mostrarán doce tarjetas: **Leer HTML, Leer CSS, Leer JavaScript, Leer TypeScript, Leer Python, Leer PHP, Leer JSON, Leer Markdown, Leer SQL, Leer SCSS, Leer XML y Leer YAML**.
3. Pulsa **Leer Python**: debería mostrar una introducción y un ejemplo con `def saludar` y `print(...)`.
4. Pulsa **Copiar código** e intenta pegarlo en un `.py` dentro de BadDev.
5. Pulsa **← Elegir lenguaje** y prueba **Leer HTML**. Comprueba que contiene teoría y ejemplos, sin ejercicios.

## C. Lecciones existentes

1. Desde el menú Learn, pulsa **Lecciones** y elige **JavaScript**.
2. Abre la lección de DOM y pulsa **Abrir Sandbox**.
3. Desde Sandbox, pulsa **Regresar a lección**. Debes volver a la misma lección, no al inicio de toda la academia.
4. Resuelve un ejercicio y comprueba el progreso.
5. Vuelve a **Elegir lenguaje** y abre **HTML** o **CSS**. Comprueba que sus lecciones funcionan.

## D. Lecciones nuevas

1. Pulsa **Aprender Python** o **Aprender TypeScript**.
2. Comprueba que aparece una introducción con ejemplo y el aviso de que las lecciones completas llegarán en la Etapa E.
3. No debe aparecer un botón de ejecución falsa para Python.

## E. Interfaz y compatibilidad

1. Prueba el selector en pantalla estrecha o en vista móvil de Chrome.
2. Cambia entre los cinco temas de BadDev; el selector debe mantener legibilidad.
3. Verifica que el editor, guardado, pestañas y vista previa (HTML/Markdown/JSON/TS) funcionan como en la Etapa C.
4. Prueba **Cerrar proyecto** con cambios pendientes: el modal de guardado debe continuar funcionando.

## F. Comandos de prueba

```bat
npm test
npm run build
```

## Limitaciones esperadas

- No se ejecuta Python ni PHP dentro de BadDev.
- Los nuevos idiomas tienen introducciones de navegación, no cursos extensos todavía.
- El manual es solo teoría y ejemplos.
