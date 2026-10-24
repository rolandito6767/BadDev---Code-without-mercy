/* BadDev Etapa E — currículos originales para 12 lenguajes.
 * Los ejemplos son texto educativo; no se ejecutan en el editor ni el manual. */
export const EDUCATION_SOURCE = {
  "html": {
    "intro": "HTML describe la estructura semántica de una página web. El navegador interpreta sus elementos y atributos; no es un lenguaje para hacer cálculos o ejecutar decisiones por sí solo.",
    "practices": [
      "Elige etiquetas según el significado del contenido, no solo por su apariencia.",
      "Usa un encabezado h1 principal y una jerarquía coherente de títulos.",
      "Pon texto alternativo en imágenes significativas y etiquetas en controles de formulario."
    ],
    "mistakes": [
      "Olvidar etiquetas de cierre o anidar elementos incorrectamente.",
      "Usar enlaces con href vacío o botones que parecen funcionar sin código.",
      "Omitir alt en imágenes informativas."
    ],
    "glossary": {
      "elemento": "Unidad HTML delimitada por etiquetas o sintaxis propia.",
      "atributo": "Dato adicional escrito en la etiqueta de apertura.",
      "semántica": "Significado que aporta una etiqueta a la estructura.",
      "DOM": "Representación de elementos que usa el navegador."
    },
    "topics": [
      {
        "title": "Etiquetas y contenido",
        "overview": "Una etiqueta HTML marca un elemento. h1 comunica el título principal; p indica un párrafo.",
        "detail": "La mayoría de elementos tienen apertura y cierre. La extensión .html identifica documentos que el navegador puede mostrar.",
        "code": "<main>\n  <h1>Mi tienda</h1>\n  <p>Productos artesanales.</p>\n</main>",
        "challenge": {
          "type": "choice",
          "question": "¿Qué etiqueta representa un párrafo?",
          "choices": [
            "<style>",
            "<p>",
            "<script>"
          ],
          "answer": 1,
          "hint": "Busca la letra inicial de “párrafo”.",
          "explanation": "La etiqueta p representa texto de párrafo."
        }
      },
      {
        "title": "Enlaces para navegar",
        "overview": "Los enlaces a permiten ir a otra dirección o archivo usando href.",
        "detail": "En un proyecto, acerca.html es una ruta relativa; necesita que ese archivo exista. Para tareas usa button, no a.",
        "code": "<a href=\"acerca.html\">Conócenos</a>",
        "challenge": {
          "type": "code",
          "question": "Escribe un enlace hacia contacto.html con el texto Contacto.",
          "starter": "<a href=\"",
          "task": "html-link",
          "hint": "Recuerda href=\"contacto.html\" y cierra </a>.",
          "explanation": "Un enlace útil necesita un href y texto descriptivo."
        },
        "solution": "<a href=\"contacto.html\">Contacto</a>"
      },
      {
        "title": "Estructura de documento",
        "overview": "Un documento HTML completo declara el tipo de documento y contiene html, head y body.",
        "detail": "head guarda metadatos, como la codificación UTF-8, y body contiene lo que verá el visitante.",
        "code": "<!doctype html>\n<html lang=\"es\">\n<head><meta charset=\"UTF-8\"><title>BadDev</title></head>\n<body><h1>Hola</h1></body>\n</html>",
        "challenge": {
          "type": "choice",
          "question": "¿En cuál sección va el título visible de la página?",
          "choices": [
            "body",
            "head",
            "doctype"
          ],
          "answer": 0,
          "hint": "head contiene metadatos, no el contenido principal.",
          "explanation": "Los elementos visibles normalmente pertenecen a body."
        }
      },
      {
        "title": "Formularios y accesibilidad",
        "overview": "Los formularios capturan datos. Un label asociado con for señala a qué campo se refiere.",
        "detail": "Usa id único en el input y el mismo valor en for; type=\"email\" ofrece ayudas al navegador.",
        "code": "<label for=\"correo\">Correo</label>\n<input id=\"correo\" type=\"email\">",
        "challenge": {
          "type": "code",
          "question": "Crea un label Correo enlazado a un input con id correo.",
          "starter": "<label for=\"",
          "task": "html-label",
          "hint": "Ambos valores deben ser correo: for=\"correo\" e id=\"correo\".",
          "explanation": "Una etiqueta asociada hace el formulario más claro y accesible."
        },
        "solution": "<label for=\"correo\">Correo</label>\n<input id=\"correo\" type=\"email\">"
      }
    ]
  },
  "css": {
    "intro": "CSS controla cómo se presentan los elementos HTML: colores, fuentes, tamaños y distribución. Una declaración tiene una propiedad, dos puntos y un valor.",
    "practices": [
      "Define variables CSS para colores repetidos y mantén consistencia.",
      "Prueba tamaños pequeños para evitar contenido recortado.",
      "Cuida el contraste de texto sobre el fondo y los indicadores de enfoque."
    ],
    "mistakes": [
      "Confundir .clase con #id.",
      "Olvidar unidades cuando se necesitan, como px o rem.",
      "Aplicar width rígidos que producen scroll horizontal en teléfonos."
    ],
    "glossary": {
      "selector": "Patrón que escoge elementos HTML.",
      "propiedad": "Aspecto que se desea cambiar, como color.",
      "declaración": "Pareja propiedad: valor; de una regla.",
      "media query": "Regla condicional según características de pantalla."
    },
    "topics": [
      {
        "title": "Selectores que apuntan bien",
        "overview": "body selecciona la página entera; .tarjeta selecciona elementos con class=\"tarjeta\"; #principal selecciona un id.",
        "detail": "Un selector que no coincide con ningún elemento no hace cambios. Verifica siempre cómo se llama la clase en HTML.",
        "code": ".tarjeta {\n  padding: 1rem;\n  border-radius: 12px;\n}",
        "challenge": {
          "type": "choice",
          "question": "¿Cómo seleccionas class=\"tarjeta\"?",
          "choices": [
            "#tarjeta",
            ".tarjeta",
            "tarjeta()"
          ],
          "answer": 1,
          "hint": "La clase lleva un punto al inicio del selector.",
          "explanation": "Un punto antes del nombre selecciona una clase."
        }
      },
      {
        "title": "Colores y variables",
        "overview": "Las variables CSS guardan valores reutilizables y empiezan con --.",
        "detail": "Se leen mediante var(--nombre). Así puedes actualizar colores desde un lugar central.",
        "code": "body { --acento: #d90b2b; }\nh1 { color: var(--acento); }",
        "challenge": {
          "type": "code",
          "question": "Define --acento con un color y úsalo en color: var(--acento).",
          "starter": "body {\n",
          "task": "css-variable",
          "hint": "Necesitas --acento: y color: var(--acento).",
          "explanation": "La variable personalizada se declara con -- y se utiliza mediante var()."
        },
        "solution": "body { --acento: #d90b2b; }\nh1 { color: var(--acento); }"
      },
      {
        "title": "Modelo de caja",
        "overview": "Todo elemento tiene contenido, padding, borde y margin.",
        "detail": "padding es el espacio interior del borde; margin separa ese elemento de los demás.",
        "code": "section {\n  padding: 20px;\n  border: 1px solid #555;\n  margin: 10px;\n}",
        "challenge": {
          "type": "choice",
          "question": "¿Qué propiedad crea espacio dentro del borde?",
          "choices": [
            "margin",
            "padding",
            "outline"
          ],
          "answer": 1,
          "hint": "Piensa en relleno interior.",
          "explanation": "padding añade espacio entre contenido y borde."
        }
      },
      {
        "title": "Diseño adaptable",
        "overview": "Una media query aplica estilos solo cuando se cumple una condición.",
        "detail": "Puedes cambiar un diseño de dos columnas a una sola en pantallas pequeñas sin duplicar HTML.",
        "code": ".grid { display: grid; grid-template-columns: 1fr 1fr; }\n@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }",
        "challenge": {
          "type": "code",
          "question": "Crea una media query para max-width: 600px que ajuste .grid a una columna.",
          "starter": "@media (",
          "task": "css-media",
          "hint": "Usa @media (max-width: 600px) y grid-template-columns: 1fr.",
          "explanation": "La consulta de medios permite adaptar el diseño al ancho disponible."
        },
        "solution": "@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }"
      }
    ]
  },
  "js": {
    "intro": "JavaScript ejecuta instrucciones en el navegador y puede modificar el DOM. Las variables, condiciones, funciones y eventos son los componentes iniciales para crear interactividad.",
    "practices": [
      "Usa const por defecto y let solo cuando debas reasignar.",
      "Selecciona elementos existentes antes de escuchar sus eventos.",
      "Trata los datos del usuario como información que debe validarse."
    ],
    "mistakes": [
      "Confundir = con ===.",
      "Olvidar que querySelector puede devolver null.",
      "Usar innerHTML con texto no confiable en vez de textContent."
    ],
    "glossary": {
      "variable": "Nombre que apunta a un valor.",
      "función": "Bloque reutilizable de instrucciones.",
      "DOM": "Árbol de nodos de la página.",
      "evento": "Acción como un clic que puede escucharse."
    },
    "topics": [
      {
        "title": "Datos con const y let",
        "overview": "const declara un nombre que no puede reasignarse; let permite asignar otro valor después.",
        "detail": "Ambas declaraciones pueden contener cadenas, números, booleanos u objetos. Usa nombres que indiquen el dato que representan.",
        "code": "const producto = \"Cacao\";\nlet cantidad = 2;\ncantidad += 1;",
        "challenge": {
          "type": "choice",
          "question": "¿Qué palabra usarías para una cantidad que cambia?",
          "choices": [
            "const",
            "let",
            "return"
          ],
          "answer": 1,
          "hint": "Busca la declaración que permite cambiar de valor.",
          "explanation": "let permite reasignar; const no."
        }
      },
      {
        "title": "Funciones con return",
        "overview": "Una función puede recibir parámetros y devolver resultados.",
        "detail": "return termina la llamada actual y entrega su valor al código que la llamó.",
        "code": "function sumar(a, b) {\n  return a + b;\n}\nconsole.log(sumar(2, 3));",
        "challenge": {
          "type": "code",
          "question": "Crea una función sumar(a, b) que retorne la suma.",
          "starter": "function sumar(",
          "task": "js-sum",
          "hint": "Necesitas return a + b; dentro del bloque.",
          "explanation": "La función devuelve la suma sin limitarse a mostrarla."
        },
        "solution": "function sumar(a, b) { return a + b; }"
      },
      {
        "title": "Condiciones seguras",
        "overview": "if ejecuta su bloque solo si una condición es verdadera; else atiende el camino contrario.",
        "detail": "=== compara valor y tipo sin conversiones inesperadas. Las llaves delimitan cada alternativa.",
        "code": "const activo = true;\nif (activo === true) { console.log(\"Listo\"); }",
        "challenge": {
          "type": "choice",
          "question": "¿Qué operador compara igualdad estricta?",
          "choices": [
            "=",
            "==",
            "==="
          ],
          "answer": 2,
          "hint": "Tiene tres signos igual.",
          "explanation": "=== es la comparación estricta."
        }
      },
      {
        "title": "Eventos y botones",
        "overview": "addEventListener conecta una función con un evento sin mezclar código en el atributo HTML.",
        "detail": "Comprueba que el elemento exista y que el script se cargue después del botón.",
        "code": "document.querySelector(\"#boton\").addEventListener(\"click\", () => console.log(\"Hola\"));",
        "challenge": {
          "type": "code",
          "question": "Conecta un clic a #boton usando addEventListener para mostrar Hola en la consola.",
          "starter": "const boton = document.querySelector(",
          "task": "js-click",
          "hint": "Usa querySelector(\"#boton\") y addEventListener(\"click\", ...).",
          "explanation": "El listener se ejecutará cuando se pulse el botón."
        },
        "solution": "const boton = document.querySelector(\"#boton\");\nboton.addEventListener(\"click\", () => console.log(\"Hola\"));"
      }
    ]
  },
  "ts": {
    "intro": "TypeScript amplía JavaScript con tipos que se revisan antes de ejecutar. El navegador necesita JavaScript: por eso una herramienta debe transpilar TypeScript.",
    "practices": [
      "Anota los tipos útiles sin tipar cada valor innecesariamente.",
      "Evita any cuando puedes describir realmente los datos.",
      "Comprueba que el JavaScript generado se comporte igual que esperabas."
    ],
    "mistakes": [
      "Intentar abrir un .ts directamente como script normal del navegador.",
      "Suponer que los tipos validan datos recibidos en tiempo de ejecución.",
      "Usar any para ocultar errores de diseño."
    ],
    "glossary": {
      "type annotation": "Anotación que describe el tipo esperado.",
      "interface": "Contrato para la forma de un objeto.",
      "transpilación": "Transformación de TypeScript a JavaScript.",
      "inferencia": "Deducción automática del tipo a partir de un valor."
    },
    "topics": [
      {
        "title": "Tipos en variables",
        "overview": "Puedes escribir nombre: string o edad: number para documentar los valores admitidos.",
        "detail": "TypeScript suele inferir el tipo a partir de la asignación. El chequeo de tipos ayuda antes de ejecutar, pero no garantiza datos externos correctos.",
        "code": "const nombre: string = \"BadDev\";\nlet edad: number = 15;",
        "challenge": {
          "type": "choice",
          "question": "¿Qué tipo representa verdadero o falso?",
          "choices": [
            "number",
            "boolean",
            "string"
          ],
          "answer": 1,
          "hint": "En inglés significa booleano.",
          "explanation": "boolean expresa true o false."
        }
      },
      {
        "title": "Funciones tipadas",
        "overview": "Especifica tipos de parámetros y, cuando ayude a entender el código, el valor de retorno.",
        "detail": "Por ejemplo sumar(a: number, b: number): number promete recibir números y devolver un número.",
        "code": "function sumar(a: number, b: number): number {\n  return a + b;\n}",
        "challenge": {
          "type": "code",
          "question": "Escribe una función sumar tipada con a y b number y retorno number.",
          "starter": "function sumar(",
          "task": "ts-sum",
          "hint": "Ambos parámetros y el retorno llevan : number.",
          "explanation": "La firma aclara entradas y salida sin cambiar la operación de suma."
        },
        "solution": "function sumar(a: number, b: number): number { return a + b; }"
      },
      {
        "title": "Interfaces y objetos",
        "overview": "Una interface describe las propiedades esperadas en un objeto.",
        "detail": "Un objeto que cumple esa interface debe aportar los campos requeridos con sus tipos.",
        "code": "interface Producto { nombre: string; precio: number; }\nconst cacao: Producto = { nombre: \"Cacao\", precio: 40 };",
        "challenge": {
          "type": "choice",
          "question": "¿Cuál campo pide un valor numérico?",
          "choices": [
            "nombre",
            "precio",
            "Producto"
          ],
          "answer": 1,
          "hint": "Busca : number dentro de la interface.",
          "explanation": "precio fue declarado number."
        }
      },
      {
        "title": "Uniones de tipos",
        "overview": "El operador | permite aceptar más de una clase de valor.",
        "detail": "Úsalo cuando el dato realmente puede adoptar varias formas, como un ID de texto o número.",
        "code": "let id: string | number = 10;\nid = \"A-10\";",
        "challenge": {
          "type": "code",
          "question": "Declara id con tipo string | number y valor inicial 10.",
          "starter": "let id:",
          "task": "ts-union",
          "hint": "Usa string | number y asigna el número 10.",
          "explanation": "La unión limita el dato a dos tipos conocidos."
        },
        "solution": "let id: string | number = 10;"
      }
    ]
  },
  "py": {
    "intro": "Python usa indentación para agrupar bloques y suele facilitar la lectura. Es útil en automatización, análisis de datos y scripts. BadDev permite editar Python y ejecutarlo en su consola: con Pyodide en el navegador o con Python instalado en Windows.",
    "practices": [
      "Usa cuatro espacios por nivel y evita mezclar tabulaciones y espacios.",
      "Pon nombres claros a las variables y divide tareas en funciones.",
      "No confundas print() con una vista previa HTML: escribe en la consola de Python."
    ],
    "mistakes": [
      "Quitar los dos puntos al final de if o def.",
      "Olvidar indentar el cuerpo de una función o condicional.",
      "Esperar que BadDev ejecute .py sin un entorno de Python."
    ],
    "glossary": {
      "indentación": "Espacios que determinan los bloques.",
      "lista": "Colección ordenada y modificable.",
      "def": "Palabra usada para definir funciones.",
      "print": "Función que muestra texto en la salida del programa."
    },
    "topics": [
      {
        "title": "Variables y print",
        "overview": "En Python asignas una variable sin declarar previamente su tipo.",
        "detail": "print() muestra valores en la consola del programa. Los textos suelen escribirse entre comillas.",
        "code": "nombre = \"BadDev\"\nprint(\"Hola, \" + nombre)",
        "challenge": {
          "type": "choice",
          "question": "¿Dónde aparece el resultado de print()?",
          "choices": [
            "En la consola Python",
            "En un div HTML automáticamente",
            "En un archivo CSS"
          ],
          "answer": 0,
          "hint": "No crea una página web.",
          "explanation": "print escribe en la salida estándar."
        }
      },
      {
        "title": "Condiciones e indentación",
        "overview": "Las condiciones terminan con : y el bloque siguiente debe estar indentado.",
        "detail": "Python no necesita llaves alrededor del bloque. Mantén cuatro espacios de indentación para leerlo fácilmente.",
        "code": "edad = 18\nif edad >= 18:\n    print(\"Mayor\")",
        "challenge": {
          "type": "code",
          "question": "Escribe if edad >= 18: y dentro imprime Mayor.",
          "starter": "if edad >= 18:",
          "task": "py-if",
          "hint": "Pon dos puntos y cuatro espacios antes de print.",
          "explanation": "El bloque indentado se ejecuta si la condición se cumple."
        },
        "solution": "if edad >= 18:\n    print(\"Mayor\")"
      },
      {
        "title": "Listas y recorridos",
        "overview": "Una lista almacena varios valores en orden y usa corchetes.",
        "detail": "for item in lista recorre los elementos sin tener que controlar manualmente un índice.",
        "code": "frutas = [\"mango\", \"cacao\"]\nfor fruta in frutas:\n    print(fruta)",
        "challenge": {
          "type": "choice",
          "question": "¿Qué estructura almacena múltiples valores ordenados?",
          "choices": [
            "dict",
            "list",
            "bool"
          ],
          "answer": 1,
          "hint": "Usa [ ] para reconocerla.",
          "explanation": "list guarda elementos en una secuencia."
        }
      },
      {
        "title": "Funciones y return",
        "overview": "def define una función; los paréntesis contienen sus parámetros.",
        "detail": "return entrega el resultado. Si omites return, la función devuelve None de forma implícita.",
        "code": "def doble(n):\n    return n * 2\n\nprint(doble(3))",
        "challenge": {
          "type": "code",
          "question": "Define una función doble(n) que retorne n * 2.",
          "starter": "def doble(",
          "task": "py-double",
          "hint": "Usa def, dos puntos e indentación con return.",
          "explanation": "La función calcula el doble y devuelve el resultado."
        },
        "solution": "def doble(n):\n    return n * 2"
      }
    ]
  },
  "php": {
    "intro": "PHP suele ejecutarse en un servidor web. Puede generar HTML y consultar bases de datos, pero un archivo .php por sí solo no se ejecuta en el navegador.",
    "practices": [
      "Valida y escapa datos antes de insertarlos en HTML.",
      "Usa consultas preparadas para interactuar con bases de datos.",
      "Separa presentación de lógica cuando el archivo crezca."
    ],
    "mistakes": [
      "Olvidar el símbolo $ al referirse a variables.",
      "Confundir concatenación con + en cadenas; PHP usa punto.",
      "Abrir PHP como archivo local y esperar que el navegador lo procese."
    ],
    "glossary": {
      "echo": "Instrucción que envía texto a la salida.",
      "variable": "Nombre iniciado con $.",
      "servidor": "Programa que interpreta PHP para responder solicitudes.",
      "consulta preparada": "Consulta parametrizada para evitar inyección SQL."
    },
    "topics": [
      {
        "title": "PHP y el servidor",
        "overview": "PHP corre en el servidor y puede enviar HTML al navegador.",
        "detail": "Un servidor PHP interpreta <?php ... ?>; BadDev permite editarlo, no ejecutarlo en su iframe actual.",
        "code": "<?php\necho \"Hola desde PHP\";\n?>",
        "challenge": {
          "type": "choice",
          "question": "¿Dónde se ejecuta normalmente PHP?",
          "choices": [
            "En CSS",
            "En el servidor",
            "Directamente como HTML"
          ],
          "answer": 1,
          "hint": "Piensa dónde está instalado PHP.",
          "explanation": "PHP necesita un intérprete del lado del servidor."
        }
      },
      {
        "title": "Variables y echo",
        "overview": "Las variables PHP comienzan por $ y las instrucciones suelen terminar en punto y coma.",
        "detail": "echo envía texto a la respuesta. Para unir cadenas utiliza el operador punto.",
        "code": "<?php\n$nombre = \"BadDev\";\necho \"Hola, \" . $nombre;",
        "challenge": {
          "type": "code",
          "question": "Declara $nombre como \"BadDev\" y usa echo para mostrarlo.",
          "starter": "<?php\n",
          "task": "php-echo",
          "hint": "Necesitas $nombre = \"BadDev\"; y echo $nombre;.",
          "explanation": "La variable se reconoce por $ y echo muestra su valor."
        },
        "solution": "<?php\n$nombre = \"BadDev\";\necho $nombre;"
      },
      {
        "title": "Arreglos asociativos",
        "overview": "Los arreglos asociativos relacionan una clave con su valor mediante =>.",
        "detail": "Puedes recuperar un valor por su nombre, como $producto[\"precio\"].",
        "code": "$producto = [\"nombre\" => \"Cacao\", \"precio\" => 40];\necho $producto[\"nombre\"];",
        "challenge": {
          "type": "choice",
          "question": "¿Qué operador relaciona clave y valor en un arreglo PHP?",
          "choices": [
            "=>",
            "===",
            "::"
          ],
          "answer": 0,
          "hint": "Tiene un signo igual seguido de >.",
          "explanation": "El operador => asocia claves con valores."
        }
      },
      {
        "title": "Condiciones de negocio",
        "overview": "if evalúa una condición y ejecuta instrucciones dentro de llaves.",
        "detail": "En PHP se escribe igual que en muchos lenguajes con llaves, pero las variables usan $.",
        "code": "$total = 50;\nif ($total >= 40) { echo \"Envío gratis\"; }",
        "challenge": {
          "type": "code",
          "question": "Escribe un if que compruebe $total >= 40 e imprima Envío gratis.",
          "starter": "if (",
          "task": "php-if",
          "hint": "Usa if ($total >= 40) y echo con el mensaje.",
          "explanation": "La condición usa $total y una salida dentro del bloque."
        },
        "solution": "if ($total >= 40) { echo \"Envío gratis\"; }"
      }
    ]
  },
  "json": {
    "intro": "JSON es un formato de intercambio de datos, no un lenguaje de programación. Sus documentos representan objetos, arreglos, cadenas, números, booleanos y null.",
    "practices": [
      "Usa siempre comillas dobles en claves y cadenas.",
      "Mantén la estructura simple y nombres de claves consistentes.",
      "Valida el documento en BadDev antes de compartirlo."
    ],
    "mistakes": [
      "Incluir comentarios // dentro del JSON estándar.",
      "Dejar una coma después del último elemento.",
      "Usar comillas simples para claves y valores de texto."
    ],
    "glossary": {
      "objeto": "Mapa de claves a valores encerrado en llaves.",
      "arreglo": "Lista de valores encerrada en corchetes.",
      "null": "Valor especial que representa ausencia de valor.",
      "parser": "Componente que interpreta la estructura JSON."
    },
    "topics": [
      {
        "title": "Objetos y valores",
        "overview": "Un objeto JSON contiene pares \"clave\": valor separados por comas.",
        "detail": "Las claves deben escribirse entre comillas dobles. Los valores pueden ser cadenas, números, booleanos, arreglos, objetos o null.",
        "code": "{ \"nombre\": \"BadDev\", \"version\": 1.2, \"activo\": true }",
        "challenge": {
          "type": "choice",
          "question": "¿Cuál es una clave válida en JSON?",
          "choices": [
            "'nombre'",
            "\"nombre\"",
            "nombre"
          ],
          "answer": 1,
          "hint": "Recuerda el uso estricto de comillas.",
          "explanation": "Las claves JSON siempre llevan comillas dobles."
        }
      },
      {
        "title": "Estructuras simples",
        "overview": "JSON admite objetos con propiedades anidadas y arreglos de valores.",
        "detail": "Procura que cada dato tenga una clave descriptiva para evitar confundir cantidades y nombres.",
        "code": "{ \"producto\": \"Cacao\", \"precio\": 40 }",
        "challenge": {
          "type": "code",
          "question": "Escribe un objeto JSON con producto \"Cacao\" y precio 40.",
          "starter": "{\n",
          "task": "json-product",
          "hint": "Usa las claves \"producto\" y \"precio\".",
          "explanation": "El precio es un número sin comillas y el nombre es texto."
        },
        "solution": "{ \"producto\": \"Cacao\", \"precio\": 40 }"
      },
      {
        "title": "Arreglos y anidación",
        "overview": "Los arreglos usan corchetes y pueden contener objetos.",
        "detail": "En un arreglo los elementos se separan por comas; no se coloca una coma al final.",
        "code": "{ \"etiquetas\": [\"dulce\", \"artesanal\"] }",
        "challenge": {
          "type": "choice",
          "question": "¿Qué símbolo abre un arreglo?",
          "choices": [
            "[",
            "{",
            "("
          ],
          "answer": 0,
          "hint": "Es el mismo símbolo que usa una lista JS.",
          "explanation": "Los arreglos usan [ y ]."
        }
      },
      {
        "title": "Validación sin sorpresas",
        "overview": "JSON no permite comentarios ni comas finales y distingue texto de números.",
        "detail": "BadDev puede formatearlo y señalar problemas de sintaxis antes de que otro programa intente leerlo.",
        "code": "{ \"activo\": true, \"stock\": 3 }",
        "challenge": {
          "type": "code",
          "question": "Crea un JSON válido con \"activo\": true y \"stock\": 3.",
          "starter": "{\n",
          "task": "json-stock",
          "hint": "Escribe true sin comillas y el número 3.",
          "explanation": "Un booleano y un número son valores sin comillas."
        },
        "solution": "{ \"activo\": true, \"stock\": 3 }"
      }
    ]
  },
  "md": {
    "intro": "Markdown convierte texto con marcas sencillas en documentos legibles, ideal para README y notas. La vista previa de BadDev transforma títulos, párrafos, listas y bloques de código.",
    "practices": [
      "Organiza el documento con títulos progresivos.",
      "Escribe texto comprensible para los enlaces.",
      "Usa bloques de código para distinguir comandos del texto normal."
    ],
    "mistakes": [
      "Olvidar el espacio después de # al escribir títulos.",
      "Poner una ruta equivocada en un enlace.",
      "Confundir una marca de Markdown con código ejecutable."
    ],
    "glossary": {
      "encabezado": "Título iniciado por uno o varios #.",
      "lista": "Elementos que empiezan por - o números.",
      "enlace": "Texto enlazado a una ruta o URL.",
      "fence": "Bloque delimitado por tres acentos graves."
    },
    "topics": [
      {
        "title": "Títulos y párrafos",
        "overview": "Markdown usa # para títulos; cuantos más signos, menor es el nivel.",
        "detail": "Después de # deja un espacio. Los párrafos se separan con una línea en blanco para mejorar la lectura.",
        "code": "# Mi documento\n\n## Instalación\nSigue estos pasos.",
        "challenge": {
          "type": "choice",
          "question": "¿Cómo escribes un título de nivel dos?",
          "choices": [
            "#Título",
            "## Título",
            "**Título**"
          ],
          "answer": 1,
          "hint": "Dos # seguidos de espacio.",
          "explanation": "## Título crea un encabezado de nivel 2."
        }
      },
      {
        "title": "Listas útiles",
        "overview": "Las listas sin orden empiezan con - y un espacio por elemento.",
        "detail": "Úsalas para resumir pasos o requisitos. El texto se ve ordenado sin construir HTML a mano.",
        "code": "- Crear archivos\n- Guardar proyecto",
        "challenge": {
          "type": "code",
          "question": "Escribe una lista Markdown con Crear y Guardar.",
          "starter": "- ",
          "task": "md-list",
          "hint": "Usa dos líneas que comiencen por -.",
          "explanation": "Cada línea empieza con un guion y un espacio."
        },
        "solution": "- Crear\n- Guardar"
      },
      {
        "title": "Enlaces y énfasis",
        "overview": "Un enlace utiliza [texto](destino) y negrita emplea **alrededor del texto**.",
        "detail": "Los destinos pueden ser relativos a un archivo local o absolutos a una página web.",
        "code": "[Manual](manual.md)\n\n**Importante:** guarda tu proyecto.",
        "challenge": {
          "type": "choice",
          "question": "¿Qué opción crea un enlace Markdown?",
          "choices": [
            "(Sitio)[url]",
            "[Sitio](url)",
            "<Sitio:url>"
          ],
          "answer": 1,
          "hint": "Primero el texto visible.",
          "explanation": "Los corchetes contienen el texto y los paréntesis el destino."
        }
      },
      {
        "title": "Fragmentos de código",
        "overview": "Usa tres acentos graves para abrir y cerrar un bloque de código.",
        "detail": "Puedes colocar el nombre del lenguaje después de la apertura para indicar qué tipo de código contiene.",
        "code": "```js\nconsole.log(\"Hola\");\n```",
        "challenge": {
          "type": "code",
          "question": "Escribe un bloque Markdown con código JavaScript que muestre Hola.",
          "starter": "```js\n",
          "task": "md-code",
          "hint": "No olvides los tres acentos graves al final.",
          "explanation": "El texto queda dentro de un bloque y es distinto de un párrafo."
        },
        "solution": "```js\nconsole.log(\"Hola\");\n```"
      }
    ]
  },
  "sql": {
    "intro": "SQL expresa consultas y cambios sobre datos almacenados en bases de datos relacionales. BadDev edita archivos .sql, pero no incluye un motor de base de datos para ejecutarlos.",
    "practices": [
      "Prueba consultas SELECT antes de ejecutar cambios.",
      "Usa parámetros en aplicaciones en lugar de concatenar texto del usuario.",
      "Especifica columnas cuando debas mantener consultas claras."
    ],
    "mistakes": [
      "Omitir WHERE en UPDATE o DELETE y modificar todas las filas.",
      "Suponer que SQL tiene el mismo dialecto en todos los motores.",
      "Construir consultas concatenando datos sin parametrizar."
    ],
    "glossary": {
      "tabla": "Conjunto de filas y columnas.",
      "fila": "Registro individual dentro de una tabla.",
      "WHERE": "Cláusula para filtrar filas.",
      "SELECT": "Instrucción que consulta datos."
    },
    "topics": [
      {
        "title": "Tablas y SELECT",
        "overview": "Una tabla guarda filas y columnas relacionadas. SELECT elige columnas y FROM indica de cuál tabla salen.",
        "detail": "El resultado de la consulta depende de la información almacenada; BadDev no puede ejecutarlo sin una base de datos.",
        "code": "SELECT nombre, precio FROM productos;",
        "challenge": {
          "type": "choice",
          "question": "¿Qué palabra SQL selecciona columnas?",
          "choices": [
            "INSERT",
            "SELECT",
            "DELETE"
          ],
          "answer": 1,
          "hint": "Es la palabra del comienzo de la consulta de lectura.",
          "explanation": "SELECT consulta datos existentes."
        }
      },
      {
        "title": "Filtrar con WHERE",
        "overview": "WHERE limita las filas que cumplen una condición.",
        "detail": "Por ejemplo, precio > 20 selecciona productos con un precio mayor que 20.",
        "code": "SELECT nombre FROM productos WHERE precio > 20;",
        "challenge": {
          "type": "code",
          "question": "Consulta nombre de productos con precio mayor a 20.",
          "starter": "SELECT ",
          "task": "sql-filter",
          "hint": "Necesitas SELECT nombre, FROM productos y WHERE precio > 20.",
          "explanation": "La consulta solicita la columna y filtra con WHERE."
        },
        "solution": "SELECT nombre FROM productos WHERE precio > 20;"
      },
      {
        "title": "Orden y límites",
        "overview": "ORDER BY ordena resultados; ASC es ascendente y DESC descendente.",
        "detail": "Según el motor SQL puedes usar LIMIT u otra sintaxis para controlar cuántas filas devuelve.",
        "code": "SELECT nombre FROM productos ORDER BY nombre ASC;",
        "challenge": {
          "type": "choice",
          "question": "¿Qué cláusula se usa para ordenar?",
          "choices": [
            "ORDER BY",
            "GROUP BY",
            "WHERE"
          ],
          "answer": 0,
          "hint": "Tiene la palabra ORDER.",
          "explanation": "ORDER BY ordena los resultados."
        }
      },
      {
        "title": "Insertar datos",
        "overview": "INSERT INTO agrega filas a una tabla y VALUES aporta los valores correspondientes.",
        "detail": "Indicar columnas explícitas evita depender del orden actual de la tabla.",
        "code": "INSERT INTO productos (nombre, precio) VALUES ('Cacao', 40);",
        "challenge": {
          "type": "code",
          "question": "Inserta Cacao, 40 en productos mediante INSERT INTO.",
          "starter": "INSERT INTO ",
          "task": "sql-insert",
          "hint": "Usa INSERT INTO productos ... VALUES (...).",
          "explanation": "El número de columnas coincide con el número de valores."
        },
        "solution": "INSERT INTO productos (nombre, precio) VALUES ('Cacao', 40);"
      }
    ]
  },
  "scss": {
    "intro": "SCSS es una sintaxis de Sass que extiende CSS con variables, anidación y otras herramientas. Debe compilarse a CSS antes de cargarse como hoja de estilos en el navegador.",
    "practices": [
      "Prefiere anidación corta para no generar selectores excesivamente específicos.",
      "Usa variables para decisiones de diseño compartidas.",
      "Compila a CSS y prueba el resultado, no solo el archivo .scss."
    ],
    "mistakes": [
      "Usar directamente SCSS como stylesheet en un HTML sin compilar.",
      "Anidar tantas reglas que sea difícil entender el CSS final.",
      "Confundir variables $scss con custom properties --css."
    ],
    "glossary": {
      "Sass": "Herramienta que procesa SCSS y produce CSS.",
      "variable SCSS": "Valor declarado con $.",
      "anidación": "Regla dentro de otra regla.",
      "mixin": "Bloque de estilos reutilizable con parámetros opcionales."
    },
    "topics": [
      {
        "title": "Variables de Sass",
        "overview": "SCSS admite variables con $, que se resuelven durante la compilación.",
        "detail": "No son iguales a --variable de CSS; las variables de SCSS se convierten en valores de CSS generado.",
        "code": "$acento: #ff1744;\nh1 { color: $acento; }",
        "challenge": {
          "type": "choice",
          "question": "¿Cómo comienza una variable SCSS?",
          "choices": [
            "--",
            "$",
            "@"
          ],
          "answer": 1,
          "hint": "Observa el ejemplo $acento.",
          "explanation": "SCSS usa el signo $ para variables."
        }
      },
      {
        "title": "Reutilizar colores",
        "overview": "Declara una variable con un color y utilízala en distintas reglas.",
        "detail": "Al cambiar el valor en un lugar, el compilador lo sustituye en las reglas que lo utilizan.",
        "code": "$acento: #ff1744;\n.boton { background: $acento; }",
        "challenge": {
          "type": "code",
          "question": "Crea $acento con #ff1744 y úsalo como background de .boton.",
          "starter": "$acento:",
          "task": "scss-color",
          "hint": "Combina $acento: ... y background: $acento.",
          "explanation": "SCSS sustituye $acento por el color en CSS generado."
        },
        "solution": "$acento: #ff1744;\n.boton { background: $acento; }"
      },
      {
        "title": "Anidación legible",
        "overview": "Puedes definir estilos de descendientes dentro del selector padre.",
        "detail": "Esta característica reduce repetición, pero demasiados niveles pueden producir CSS difícil de mantener.",
        "code": ".card {\n  h2 { color: #fff; }\n}",
        "challenge": {
          "type": "choice",
          "question": "¿Qué regla resultará de esa anidación?",
          "choices": [
            "h2 .card",
            ".card h2",
            ".card + h2"
          ],
          "answer": 1,
          "hint": "El hijo queda después del padre.",
          "explanation": "El selector resultante es .card h2."
        }
      },
      {
        "title": "Pseudoestados con &",
        "overview": "El símbolo & representa el selector padre en la regla anidada.",
        "detail": "Es útil para &:hover, que genera un selector hover de ese mismo elemento.",
        "code": ".boton {\n  &:hover { color: white; }\n}",
        "challenge": {
          "type": "code",
          "question": "Crea .boton con &:hover que cambie color a white.",
          "starter": ".boton {",
          "task": "scss-hover",
          "hint": "Anida &:hover dentro de .boton.",
          "explanation": "&:hover compila a .boton:hover."
        },
        "solution": ".boton { &:hover { color: white; } }"
      }
    ]
  },
  "xml": {
    "intro": "XML representa información mediante etiquetas propias y una estructura jerárquica. Se usa para intercambio de datos, configuraciones y documentos.",
    "practices": [
      "Mantén un único elemento raíz.",
      "Cierra cada etiqueta exactamente con el mismo nombre y respetando mayúsculas.",
      "Escapa los símbolos especiales dentro de los textos."
    ],
    "mistakes": [
      "Dejar dos elementos raíz paralelos.",
      "Cerrar <Dato> con </dato> (mayúsculas diferentes).",
      "Escribir un & sin escapar como &amp;."
    ],
    "glossary": {
      "raíz": "Único elemento externo que contiene el documento.",
      "elemento": "Etiqueta con contenido u otros elementos.",
      "atributo": "Par nombre=\"valor\" en una etiqueta.",
      "bien formado": "Documento que cumple las reglas sintácticas XML."
    },
    "topics": [
      {
        "title": "Raíz y elementos",
        "overview": "XML permite inventar etiquetas con significado propio, como <producto> y <precio>.",
        "detail": "Todos los elementos deben estar dentro de una única raíz y correctamente anidados.",
        "code": "<catalogo>\n  <producto>Cacao</producto>\n</catalogo>",
        "challenge": {
          "type": "choice",
          "question": "¿Cuántos elementos raíz debe tener un documento XML?",
          "choices": [
            "Uno",
            "Dos",
            "Los que quieras"
          ],
          "answer": 0,
          "hint": "El elemento exterior contiene a todos los demás.",
          "explanation": "XML exige una sola raíz."
        }
      },
      {
        "title": "Anidación correcta",
        "overview": "Las etiquetas XML se cierran con el mismo nombre y en orden inverso de apertura.",
        "detail": "Los nombres de etiquetas son sensibles a mayúsculas; <Item> no equivale a <item>.",
        "code": "<tienda><nombre>BadDev</nombre></tienda>",
        "challenge": {
          "type": "code",
          "question": "Crea una raíz tienda con un hijo nombre cuyo texto sea BadDev.",
          "starter": "<tienda>",
          "task": "xml-store",
          "hint": "Abre tienda, crea nombre y cierra ambos.",
          "explanation": "La raíz contiene al elemento hijo correctamente cerrado."
        },
        "solution": "<tienda><nombre>BadDev</nombre></tienda>"
      },
      {
        "title": "Atributos y entidades",
        "overview": "Los atributos añaden valores a la etiqueta de apertura.",
        "detail": "Los valores van entre comillas. Para un signo & literal dentro de texto debes usar &amp;.",
        "code": "<producto id=\"p1\">Pan &amp; cacao</producto>",
        "challenge": {
          "type": "choice",
          "question": "¿Cómo representas & dentro de texto XML?",
          "choices": [
            "&",
            "&amp;",
            "&&"
          ],
          "answer": 1,
          "hint": "Empieza con & y termina con punto y coma.",
          "explanation": "&amp; es la entidad XML del símbolo &."
        }
      },
      {
        "title": "Atributos explícitos",
        "overview": "Un atributo se escribe como nombre=\"valor\" dentro de una etiqueta.",
        "detail": "Es útil para identificadores, pero el contenido importante también puede representarse como elementos hijos.",
        "code": "<producto id=\"c1\"><nombre>Cacao</nombre></producto>",
        "challenge": {
          "type": "code",
          "question": "Escribe producto con id=\"c1\" y nombre Cacao como hijo.",
          "starter": "<producto ",
          "task": "xml-product",
          "hint": "Necesitas id=\"c1\" y un hijo <nombre>.",
          "explanation": "El atributo identifica el producto y el elemento hijo nombra el dato."
        },
        "solution": "<producto id=\"c1\"><nombre>Cacao</nombre></producto>"
      }
    ]
  },
  "yaml": {
    "intro": "YAML representa datos y configuraciones mediante pares clave: valor y listas. La indentación con espacios marca la estructura; no es código ejecutable.",
    "practices": [
      "Usa espacios de indentación de forma consistente.",
      "Pon comillas cuando un valor pueda interpretarse como otro tipo.",
      "Valida los archivos antes de usarlos en despliegues o configuraciones."
    ],
    "mistakes": [
      "Mezclar tabulaciones con espacios para indentar.",
      "Repetir claves en el mismo mapa.",
      "Confundir el guion de lista con el signo de resta."
    ],
    "glossary": {
      "mapeo": "Conjunto de claves y valores.",
      "secuencia": "Lista de elementos iniciados por -.",
      "indentación": "Espacios que representan pertenencia.",
      "escalar": "Valor sencillo como texto, número o booleano."
    },
    "topics": [
      {
        "title": "Claves y valores",
        "overview": "YAML escribe datos con clave: valor, sin llaves obligatorias para los mapas comunes.",
        "detail": "La indentación establece qué claves pertenecen a otro elemento. No uses tabulaciones para esa estructura.",
        "code": "proyecto: BadDev\nactivo: true",
        "challenge": {
          "type": "choice",
          "question": "¿Qué marca separa una clave de su valor?",
          "choices": [
            "; ",
            ": ",
            "="
          ],
          "answer": 1,
          "hint": "Observa proyecto: BadDev.",
          "explanation": "Dos puntos seguidos de espacio separan clave y valor."
        }
      },
      {
        "title": "Listas legibles",
        "overview": "Las listas contienen elementos precedidos de un guion y un espacio.",
        "detail": "La lista puede estar asociada a una clave y sus guiones llevan la misma indentación.",
        "code": "lenguajes:\n  - HTML\n  - Python",
        "challenge": {
          "type": "code",
          "question": "Crea lenguajes con una lista de HTML y Python.",
          "starter": "lenguajes:",
          "task": "yaml-languages",
          "hint": "Usa - HTML y - Python, indentados.",
          "explanation": "Una lista agrupada mantiene ambos elementos bajo lenguajes."
        },
        "solution": "lenguajes:\n  - HTML\n  - Python"
      },
      {
        "title": "Tipos y comillas",
        "overview": "YAML puede interpretar true como booleano y 42 como número.",
        "detail": "Para forzar texto ambiguo, escribe el valor entre comillas. Así no dependerás de conversiones automáticas.",
        "code": "activo: true\ncodigo: \"0012\"",
        "challenge": {
          "type": "choice",
          "question": "¿Cuál representa explícitamente texto?",
          "choices": [
            "42",
            "true",
            "\"0012\""
          ],
          "answer": 2,
          "hint": "El valor entre comillas conserva los ceros.",
          "explanation": "Las comillas indican una cadena de texto."
        }
      },
      {
        "title": "Configuraciones anidadas",
        "overview": "Una clave puede contener otro mapa indentando las claves secundarias.",
        "detail": "Es importante que los espacios sean uniformes; BadDev puede comprobar la sintaxis de estos documentos.",
        "code": "servidor:\n  puerto: 3000\n  activo: true",
        "challenge": {
          "type": "code",
          "question": "Crea servidor con puerto 3000 y activo true dentro.",
          "starter": "servidor:",
          "task": "yaml-server",
          "hint": "Indenta puerto y activo dos espacios.",
          "explanation": "Las claves secundarias pertenecen al mapa servidor."
        },
        "solution": "servidor:\n  puerto: 3000\n  activo: true"
      }
    ]
  }
};
