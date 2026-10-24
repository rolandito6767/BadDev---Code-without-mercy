export const LESSONS = [
  {
    id: 'inicio', group: 'Comienza aquí', title: 'Bienvenido a BadDev', time: '4 min',
    subtitle: 'Aprende a programar sin perderte entre decenas de botones.',
    paragraphs: [
      'BadDev es tu mesa de trabajo. A la izquierda encuentras tus archivos; arriba están las pestañas y los menús; en el centro escribes tu código.',
      'Para empezar elige Nuevo proyecto. BadDev crea tres archivos conectados: index.html para la estructura, style.css para la apariencia y script.js para las acciones.',
      'Abre Vista previa cuando quieras comprobar cómo se ve tu página. Usa Guardar o Descargar proyecto ZIP para tener una copia en Windows.'
    ],
    tips: ['No hace falta memorizar todo. Comienza cambiando una línea y viendo el resultado.', 'La vista previa de BadDev no ejecuta servidores ni aplicaciones Node.js; es para HTML, CSS y JavaScript del navegador.'],
    example: { language: 'html', code: '<h1>¡Mi primera página!</h1>\n<p>Creada con BadDev.</p>', note: 'Un título y un párrafo son suficientes para comenzar.' },
    challenge: { type: 'choice', question: '¿Qué botón crea index.html, style.css y script.js?', choices: ['Nuevo proyecto', 'Buscar', 'Cerrar pestaña'], answer: 0, hint: 'Está en la pantalla de bienvenida.', explanation: 'Nuevo proyecto crea los tres archivos vinculados.' }, sample: 'starter'
  },
  {
    id: 'archivos', group: 'Comienza aquí', title: 'Proyectos, archivos y pestañas', time: '5 min',
    subtitle: 'Entiende dónde está cada cosa y cómo guardar tu trabajo.',
    paragraphs: [
      'Un proyecto es una carpeta que reúne los archivos de una página web. Por ejemplo, index.html puede enlazar a style.css y script.js.',
      'Las pestañas muestran qué archivos tienes abiertos. Un punto rojo significa que el contenido ha cambiado desde el último guardado o descarga.',
      'Ctrl + S guarda. En Chrome, si concediste permiso a una carpeta, BadDev puede guardar allí; en otros casos descarga una copia. Al recargar se muestra el menú: guarda o descarga el proyecto y ábrelo de nuevo desde tu equipo. Los respaldos de emergencia se recuperan desde Archivo.'
    ],
    tips: ['Antes de cerrar Chrome, guarda tu proyecto en una carpeta o expórtalo como ZIP.', 'Si abres un archivo desde el explorador lateral, selecciona la pestaña para editarlo.'],
    example: { language: 'html', code: '<!doctype html>\n<html lang="es">\n  <head>\n    <link rel="stylesheet" href="style.css">\n  </head>\n  <body>\n    <h1>Hola</h1>\n    <script src="script.js"></script>\n  </body>\n</html>', note: 'Fíjate en las rutas de CSS y JS. Deben coincidir con los nombres de tus archivos.' },
    challenge: { type: 'choice', question: '¿Qué indica el punto rojo junto a un archivo?', choices: ['Hay una advertencia de seguridad', 'Hay cambios pendientes de guardar', 'El archivo es JavaScript'], answer: 1, hint: 'Lo verás al modificar código.', explanation: 'El punto rojo indica cambios pendientes de guardar.' }, sample: 'starter'
  },
  {
    id: 'atajos', group: 'Comienza aquí', title: 'Atajos que sí usarás', time: '5 min',
    subtitle: 'Más velocidad, menos clics.',
    paragraphs: [
      'Ctrl + N crea un archivo nuevo; Ctrl + O abre archivos; Ctrl + S guarda; Ctrl + W cierra la pestaña activa.',
      'Para moverte dentro del código usa Ctrl + F para buscar, Ctrl + H para buscar y reemplazar, Ctrl + Espacio para sugerencias, Ctrl + Z para deshacer y Ctrl + Y para rehacer.',
      'Algunos navegadores reservan sus propios atajos. Si Chrome toma uno, utiliza el menú Archivo o Editar de BadDev.'
    ],
    tips: ['Practica primero Ctrl + S, Ctrl + F y Ctrl + Z.', 'Puedes consultar Ayuda → Atajos disponibles en cualquier momento.'],
    example: { language: 'text', code: 'Ctrl + N       Nuevo archivo\nCtrl + O       Abrir archivo\nCtrl + S       Guardar\nCtrl + F       Buscar\nCtrl + H       Reemplazar\nCtrl + Espacio Sugerencias\nCtrl + Z       Deshacer\nCtrl + Y       Rehacer\nCtrl + W       Cerrar pestaña', note: 'Elige dos atajos cada día hasta memorizarlos.' },
    challenge: { type: 'choice', question: 'Quieres reemplazar una palabra repetida. ¿Qué atajo usas?', choices: ['Ctrl + H', 'Ctrl + S', 'Ctrl + W'], answer: 0, hint: 'Se parece a Buscar, pero abre el reemplazo.', explanation: 'Ctrl + H abre buscar y reemplazar.' }, sample: 'starter'
  },
  {
    id: 'algoritmos', group: 'Pensar como programador', title: 'Algoritmos y lógica', time: '6 min',
    subtitle: 'Una computadora sigue pasos, no adivina.',
    paragraphs: [
      'Un algoritmo es una lista ordenada de instrucciones para resolver un problema. No necesita código complicado: una receta de cocina es un algoritmo.',
      'En programación usas entradas (los datos), procesamiento (las reglas) y salidas (el resultado). Si cambia la entrada, puede cambiar el resultado.',
      'Primero escribe el problema con palabras simples. Después identifica qué datos necesitas y qué decisión debe tomar el programa.'
    ],
    tips: ['Ejemplo: entrada = nota 80; decisión = nota >= 70; salida = aprobado.', 'Divide un problema grande en varios pasos pequeños.'],
    example: { language: 'js', code: 'const nota = 80;\nconst aprobado = nota >= 70;\nconsole.log(aprobado ? "Aprobado" : "Inténtalo de nuevo");', note: 'Este algoritmo compara una nota y muestra un mensaje.' },
    challenge: { type: 'choice', question: '¿Cuál es el orden más útil para resolver un problema?', choices: ['Resultado → datos → reglas', 'Datos → reglas → resultado', 'Decoración → resultado → datos'], answer: 1, hint: 'Primero recibes información.', explanation: 'Los datos entran, las reglas los procesan y recibes una salida.' }, sample: 'logic'
  },
  {
    id: 'html', group: 'Construye tu web', title: 'HTML: la estructura', time: '7 min',
    subtitle: 'Pon títulos, párrafos, botones y contenido en tu página.',
    paragraphs: [
      'HTML describe qué elementos tiene una página. Usa etiquetas como <h1> para el título principal, <p> para párrafos y <button> para botones.',
      'La mayoría de etiquetas tienen apertura y cierre. Los atributos añaden información: id sirve para identificar un elemento y class ayuda a aplicar estilos.',
      'Escribe el HTML primero. Después puedes cambiar su apariencia con CSS y darle comportamiento con JavaScript.'
    ],
    tips: ['Pon una etiqueta <main> alrededor del contenido principal.', 'Los botones necesitan un nombre claro para que las personas sepan qué hacen.'],
    example: { language: 'html', code: '<main>\n  <h1>Mi página</h1>\n  <p>Estoy aprendiendo HTML.</p>\n  <button id="saludar">Saludar</button>\n</main>', note: 'El botón tiene un id que JavaScript podrá encontrar.' },
    challenge: { type: 'code', task: 'html-button', question: 'Crea un botón que diga Guardar y tenga un id o una class.', hint: 'Ejemplo: <button class="boton">Guardar</button>', starter: '<button ', explanation: 'El elemento button contiene el texto Guardar y un atributo para identificarlo.' }, sample: 'html'
  },
  {
    id: 'css', group: 'Construye tu web', title: 'CSS: colores y diseño', time: '7 min',
    subtitle: 'Convierte una estructura sencilla en una interfaz agradable.',
    paragraphs: [
      'CSS controla colores, tipografías, márgenes, bordes y distribución. Una regla CSS comienza con un selector (body, .tarjeta o #boton), seguido de propiedades entre llaves.',
      'background cambia el fondo; color cambia el texto; padding separa el contenido del borde; margin separa elementos entre sí.',
      'Si tu archivo se llama style.css, enlázalo desde el head del HTML. Guarda ambos archivos y actualiza la vista previa.'
    ],
    tips: ['Intenta cambiar un solo valor cada vez para ver exactamente qué controla.', 'Un contraste suficiente facilita leer la página.'],
    example: { language: 'css', code: 'body {\n  background: #090909;\n  color: #f5f5f5;\n  font-family: Arial, sans-serif;\n}', note: 'Aquí se define un fondo casi negro y letras claras.' },
    challenge: { type: 'code', task: 'css-body', question: 'Escribe una regla para body con fondo negro o #090909 y letras blancas o #f5f5f5.', hint: 'Usa body { background: ...; color: ...; }', starter: 'body {\n  \n}', explanation: 'Una regla CSS usa un selector y declaraciones separadas por ;.' }, sample: 'css'
  },
  {
    id: 'variables', group: 'JavaScript desde cero', title: 'Variables y tipos de datos', time: '7 min',
    subtitle: 'Guarda información para utilizarla después.',
    paragraphs: [
      'Una variable es un nombre que representa un valor. let permite reasignar; const impide reasignar esa variable. Para empezar, usa const cuando el nombre no cambiará.',
      'JavaScript maneja números (15), textos ("Hola"), valores booleanos (true/false) y otros tipos. Los textos van entre comillas; los números no.',
      'Los operadores +, -, *, / sirven para hacer cálculos. Con console.log puedes observar valores en herramientas de desarrollo del navegador.'
    ],
    tips: ['Un nombre descriptivo como precioTotal explica más que x.', 'No confundas = (asignar) con === (comparar igualdad).'],
    example: { language: 'js', code: 'const producto = "Chocolate";\nlet cantidad = 2;\nconst precio = 30;\nconst total = cantidad * precio;\nconsole.log(producto, total);', note: 'El resultado numérico es 60 porque 2 × 30 = 60.' },
    challenge: { type: 'choice', question: '¿Qué tipo de dato es "Hola mundo"?', choices: ['Número', 'Texto (string)', 'Booleano'], answer: 1, hint: 'Está escrito entre comillas.', explanation: 'Una cadena de texto (string) usa comillas.' }, sample: 'logic'
  },
  {
    id: 'condiciones', group: 'JavaScript desde cero', title: 'Condiciones: if y else', time: '8 min',
    subtitle: 'Toma decisiones según los datos.',
    paragraphs: [
      'Una condición es una pregunta que da true (verdadero) o false (falso). if ejecuta un bloque cuando la pregunta es verdadera. else ofrece otro camino.',
      'Puedes comparar con >, <, >=, <=, === y !==. Para saber si una persona tiene 18 años o más, usa edad >= 18.',
      'Para combinar condiciones usa && (y) o || (o). No intentes memorizarlo todo: primero escribe la pregunta en palabras.'
    ],
    tips: ['Usa === para comparar, no =, porque = asigna un valor.', 'Cuida las llaves { } y los paréntesis ( ).'],
    example: { language: 'js', code: 'const edad = 18;\nif (edad >= 18) {\n  console.log("Mayor de edad");\n} else {\n  console.log("Menor de edad");\n}', note: 'Prueba cambiando 18 por 16 y observa qué mensaje corresponde.' },
    challenge: { type: 'code', task: 'js-if', question: 'Escribe un if que revise edad >= 18 y muestre “Mayor de edad” con console.log.', hint: 'if (edad >= 18) { console.log("Mayor de edad"); }', starter: 'const edad = 18;\nif (', explanation: 'El bloque if solo se ejecuta cuando edad es 18 o más.' }, sample: 'logic'
  },
  {
    id: 'bucles', group: 'JavaScript desde cero', title: 'Bucles: repetir sin copiar', time: '8 min',
    subtitle: 'Automatiza tareas que harías varias veces.',
    paragraphs: [
      'Un bucle for permite repetir un bloque. Tiene tres partes: dónde empieza el contador, cuándo termina y cómo cambia después de cada vuelta.',
      'Por ejemplo, i = 0; i < 3; i++ pasa por 0, 1 y 2. Cuando i llega a 3, la condición deja de cumplirse y termina.',
      'Evita condiciones que nunca cambian: un bucle sin final puede bloquear la ejecución. Practica con tres repeticiones.'
    ],
    tips: ['Si buscas tres repeticiones desde cero, usa i < 3.', 'No uses un bucle cuando una sola instrucción sea suficiente.'],
    example: { language: 'js', code: 'for (let i = 0; i < 3; i++) {\n  console.log(i);\n}', note: 'El resultado es 0, 1 y 2.' },
    challenge: { type: 'code', task: 'js-loop', question: 'Crea un for que repita 3 veces y muestre el contador i con console.log(i).', hint: 'for (let i = 0; i < 3; i++) { console.log(i); }', starter: 'for (let i = 0; ', explanation: 'for repite hasta que la condición deja de cumplirse.' }, sample: 'logic'
  },
  {
    id: 'funciones', group: 'JavaScript desde cero', title: 'Funciones reutilizables', time: '7 min',
    subtitle: 'Agrupa instrucciones para utilizarlas una y otra vez.',
    paragraphs: [
      'Una función es un bloque con nombre. Puedes llamarla varias veces sin copiar todo el código. Los parámetros reciben datos; return devuelve un resultado.',
      'En lugar de escribir diez saludos, crea saludar(nombre) y reutilízala con distintos nombres.',
      'Una función debe tener una responsabilidad clara. Eso facilita entenderla y corregir errores.'
    ],
    tips: ['Una función puede devolver texto, números u otros valores.', 'Si usas return, puedes guardar el resultado en una variable.'],
    example: { language: 'js', code: 'function saludar(nombre) {\n  return "Hola, " + nombre;\n}\n\nconsole.log(saludar("Ana"));', note: 'La función recibe Ana y devuelve Hola, Ana.' },
    challenge: { type: 'choice', question: '¿Para qué sirve return?', choices: ['Para borrar una función', 'Para devolver un valor', 'Para crear CSS'], answer: 1, hint: 'Piensa en entregar el resultado.', explanation: 'return entrega el resultado al lugar desde donde se llamó la función.' }, sample: 'logic'
  },
  {
    id: 'dom', group: 'JavaScript desde cero', title: 'Interactividad: DOM', time: '8 min',
    subtitle: 'Conecta botones y texto de una página con JavaScript.',
    paragraphs: [
      'El DOM es la representación de tu HTML que JavaScript puede leer y modificar. document.getElementById busca un elemento por su id.',
      'addEventListener permite reaccionar cuando sucede algo, como hacer clic en un botón. textContent cambia el texto de un elemento.',
      'Un error común es buscar un id que no existe o ejecutar el script antes de cargar el HTML. Prueba colocando el script al final del body.'
    ],
    tips: ['Los valores de id deben coincidir exactamente entre HTML y JavaScript.', 'En proyectos simples, script.js puede enlazarse antes de cerrar </body>.'],
    example: { language: 'js', code: 'const boton = document.getElementById("saludar");\nconst salida = document.getElementById("resultado");\nboton.addEventListener("click", () => {\n  salida.textContent = "¡Funciona!";\n});', note: 'Requiere un botón con id=saludar y un elemento con id=resultado.' },
    challenge: { type: 'choice', question: '¿Qué hace addEventListener("click", ...)?', choices: ['Escucha un clic para ejecutar código', 'Crea un archivo CSS', 'Guarda el proyecto automáticamente'], answer: 0, hint: 'Listener significa “escuchador”.', explanation: 'Escucha eventos del navegador y permite responder a ellos.' }, sample: 'starter'
  },
  {
    id: 'depuracion', group: 'Crea sin miedo', title: 'Errores y depuración', time: '6 min',
    subtitle: 'Equivocarse es parte de programar: aprende a encontrar la causa.',
    paragraphs: [
      'Cuando algo no funciona, comprueba tres cosas: que guardaste, que los nombres de archivo coinciden y que no faltan comillas, paréntesis o llaves.',
      'La consola de diagnósticos de la vista previa de BadDev muestra errores básicos de JavaScript y avisos sobre referencias CSS o JS faltantes.',
      'Lee el mensaje completo, identifica la línea aproximada, cambia una cosa, actualiza la vista previa y vuelve a probar.'
    ],
    tips: ['No corrijas diez cosas a la vez; así sabrás qué resolvió el problema.', 'Guarda copias del proyecto antes de experimentar con cambios grandes.'],
    example: { language: 'js', code: '// Incorrecto: nombre no está definido\n// console.log(nombre);\n\nconst nombre = "BadDev";\nconsole.log(nombre);', note: 'Definir la variable antes de usarla evita este error.' },
    challenge: { type: 'choice', question: 'Tu CSS no aparece. ¿Qué compruebas primero?', choices: ['Comprar un teclado nuevo', 'Que el enlace href coincida con el archivo CSS', 'Borrar todos los archivos'], answer: 1, hint: 'Piensa en la ruta de style.css.', explanation: 'Las rutas del HTML deben apuntar a archivos reales del proyecto.' }, sample: 'css'
  },
  {
    id: 'miniproyecto', group: 'Crea sin miedo', title: 'Tu primer miniproyecto', time: '12 min',
    subtitle: 'Une estructura, diseño y lógica en una sola página.',
    paragraphs: [
      'Crea un proyecto de práctica. En index.html escribe un título, un párrafo y un botón. En style.css cambia fondo y texto. En script.js programa la respuesta al clic.',
      'Haz una mejora propia: cambia el nombre del botón, personaliza los colores o escribe otro mensaje. La idea es comprobar que entiendes el recorrido HTML → CSS → JavaScript.',
      'En BadDev Sandbox puedes practicar y regresar sin guardar; en el editor principal guarda tu proyecto en Windows o descárgalo como ZIP.'
    ],
    tips: ['Reto extra: añade un contador de clics.', 'Cuando termines, explica en voz alta para qué sirve cada archivo.'],
    example: { language: 'js', code: 'let clics = 0;\nboton.addEventListener("click", () => {\n  clics++;\n  resultado.textContent = `Clics: ${clics}`;\n});', note: 'Esta mejora cuenta las veces que se pulsa el botón.' },
    challenge: { type: 'choice', question: '¿Cuál archivo controla cómo se ve el botón?', choices: ['style.css', 'script.js', 'package.json'], answer: 0, hint: 'Se encarga de los estilos.', explanation: 'CSS define color, tamaño y apariencia; JS define el comportamiento.' }, sample: 'starter'
  }
];

export const GROUPS = [...new Set(LESSONS.map(item => item.group))];
export const LESSON_IDS = LESSONS.map(item => item.id);
