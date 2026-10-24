export const MANUAL_SECTIONS = [
  {
    id: 'empezar', title: 'Empezar en BadDev', group: 'Base', subtitle: 'Qué hace cada parte del editor.',
    theory: [
      'BadDev está pensado para que empieces rápido: el explorador muestra tus archivos, las pestañas te dejan cambiar entre ellos y el editor central es donde escribes.',
      'Si no sabes por dónde comenzar, usa Nuevo proyecto. Eso crea index.html, style.css y script.js listos para trabajar juntos.',
      'La vista previa te deja ver tu página sin salir de BadDev. Guarda o descarga el proyecto cuando quieras conservarlo.'
    ],
    bullets: ['Explorador: archivos abiertos y del proyecto.', 'Editor: escribe y modifica código.', 'Vista previa: muestra HTML, CSS y JS del navegador.'],
    example: { language: 'html', code: `<h1>Hola, BadDev</h1>
<p>Mi primera página.</p>` }
  },
  {
    id: 'atajos', title: 'Atajos principales', group: 'Base', subtitle: 'Los pocos atajos que realmente importan al principio.',
    theory: [
      'No necesitas memorizar veinte atajos de golpe. Empieza con guardar, buscar y deshacer.',
      'Los atajos aceleran tareas repetidas y te ayudan a depender menos del mouse.'
    ],
    bullets: ['Ctrl + S guarda.', 'Ctrl + F busca.', 'Ctrl + H reemplaza.', 'Ctrl + Z deshace y Ctrl + Y rehace.'],
    example: { language: 'text', code: `Ctrl + S  Guardar
Ctrl + F  Buscar
Ctrl + H  Reemplazar
Ctrl + Z  Deshacer` }
  },
  {
    id: 'html', title: 'HTML: estructura', group: 'Web', subtitle: 'Define qué elementos existen en tu página.',
    theory: [
      'HTML usa etiquetas para describir títulos, párrafos, botones e imágenes.',
      'Piensa en HTML como el esqueleto de la página: primero organizas el contenido y después lo decoras con CSS.'
    ],
    bullets: ['<h1> para el título principal.', '<p> para párrafos.', '<button> para botones.'],
    example: { language: 'html', code: `<main>
  <h1>Mi página</h1>
  <p>Estoy aprendiendo HTML.</p>
</main>` }
  },
  {
    id: 'css', title: 'CSS: estilos', group: 'Web', subtitle: 'Cambia colores, espacios y apariencia.',
    theory: [
      'CSS aplica estilos a los elementos del HTML.',
      'Cada regla tiene un selector y propiedades entre llaves. Empieza con fondo, color y tipografía.'
    ],
    bullets: ['background cambia el fondo.', 'color cambia el texto.', 'padding crea espacio interior.'],
    example: { language: 'css', code: `body {
  background: #090909;
  color: #f5f5f5;
  font-family: Arial, sans-serif;
}` }
  },
  {
    id: 'js', title: 'JavaScript: lógica básica', group: 'JavaScript', subtitle: 'Haz que la página piense y responda.',
    theory: [
      'JavaScript te permite guardar datos, tomar decisiones y reaccionar a eventos.',
      'Empieza con variables, luego aprende if/else y después funciones y eventos.'
    ],
    bullets: ['let y const crean variables.', 'if toma decisiones.', 'addEventListener responde a clics.'],
    example: { language: 'js', code: `const edad = 18;
if (edad >= 18) {
  console.log("Mayor de edad");
}` }
  },
  {
    id: 'errores', title: 'Errores y revisión', group: 'JavaScript', subtitle: 'Cómo encontrar problemas sin desesperarte.',
    theory: [
      'Cuando algo falla, revisa nombres de archivo, llaves, comillas y rutas.',
      'Corrige una cosa a la vez. Así sabrás qué cambio resolvió el error.'
    ],
    bullets: ['Guardar antes de probar.', 'Revisar nombres de archivos y rutas.', 'Leer el mensaje de error completo.'],
    example: { language: 'js', code: `const nombre = "BadDev";
console.log(nombre);` }
  }
];
