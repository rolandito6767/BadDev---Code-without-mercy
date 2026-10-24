// BadDev V 1.3 — imágenes del proyecto.
// Las imágenes NO son archivos de texto del editor: se guardan aparte (en memoria) como bytes
// y solo se incrustan como data: URI dentro de la vista previa aislada.
import { resolveProjectReference } from './project.js';
import { IMAGE_MIME, MAX_IMAGE_BYTES, MAX_TOTAL_IMAGE_BYTES, MAX_IMAGES, isImageName, imageMime } from './image-types.js';

export { IMAGE_MIME, MAX_IMAGE_BYTES, MAX_TOTAL_IMAGE_BYTES, MAX_IMAGES, isImageName, imageMime };

// Estado del proyecto actual: clave en minúsculas -> { name, mime, bytes }.
let current = new Map();
export function getAssets() { return current; }
export function clearAssets() { current = new Map(); }
export function assetCount() { return current.size; }
export function assetNames() { return [...current.values()].map(a => a.name).sort((a, b) => a.localeCompare(b, 'es')); }

// Convierte una lista [{ name, bytes }] en el mapa de imágenes respetando los límites.
export function buildAssetMap(list = []) {
  const map = new Map();
  const warnings = [];
  let total = 0;
  for (const item of list) {
    if (!item || !isImageName(item.name) || !(item.bytes instanceof Uint8Array)) continue;
    if (map.size >= MAX_IMAGES) { warnings.push(`Límite de ${MAX_IMAGES} imágenes alcanzado.`); break; }
    if (item.bytes.length > MAX_IMAGE_BYTES) { warnings.push(`${item.name}: la imagen supera 3 MB y se omitió.`); continue; }
    if (total + item.bytes.length > MAX_TOTAL_IMAGE_BYTES) { warnings.push(`${item.name}: se superó el total de 25 MB de imágenes.`); continue; }
    total += item.bytes.length;
    map.set(item.name.toLowerCase(), { name: item.name, mime: imageMime(item.name), bytes: item.bytes });
  }
  return { map, warnings };
}
export function setAssets(map) { current = map instanceof Map ? map : new Map(); }

export function bytesToDataUri(bytes, mime) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return `data:${mime};base64,${btoa(binary)}`;
}

// Resuelve una referencia (relativa al archivo que la usa) y devuelve el data: URI o null.
export function createImageResolver(assets, fromFile, stats = { chars: 0, missing: new Set(), used: new Set() }) {
  const cache = new Map();
  return (reference) => {
    const path = resolveProjectReference(fromFile, reference);
    if (!path) return null;
    const asset = assets.get(path.toLowerCase());
    if (!asset) { stats.missing.add(reference); return null; }
    if (!cache.has(asset.name)) {
      const uri = bytesToDataUri(asset.bytes, asset.mime);
      cache.set(asset.name, uri);
    }
    const uri = cache.get(asset.name);
    stats.used.add(asset.name);
    stats.chars += uri.length;
    return uri;
  };
}

// Sustituye url(...) de un bloque CSS por data URIs de las imágenes del proyecto.
export function inlineCssImages(css, resolve) {
  return css.replace(/url\(\s*(['"]?)([^'")]+?)\1\s*\)/gi, (match, quote, ref) => {
    const uri = resolve(ref);
    return uri ? `url("${uri}")` : match;
  });
}

// Imágenes que ya vienen dentro de un HTML: <img>, <source>, poster, favicon y estilos en línea.
export function inlineHtmlImages(documentHtml, htmlName, assets, warnings, stats) {
  const resolve = createImageResolver(assets, htmlName, stats);
  const swap = (element, attr) => {
    const original = element.getAttribute(attr);
    if (!original) return;
    const uri = resolve(original);
    if (uri) element.setAttribute(attr, uri);
    else if (!/^(?:https?:|\/\/|data:|blob:)/i.test(original.trim())) warnings.push(`No se encontró la imagen: ${original}`);
  };
  documentHtml.querySelectorAll('img[src], source[src], input[type="image"][src], video[poster]').forEach(el => {
    swap(el, el.hasAttribute('src') ? 'src' : 'poster');
  });
  documentHtml.querySelectorAll('link[rel~="icon"][href], link[rel="apple-touch-icon"][href]').forEach(el => swap(el, 'href'));
  documentHtml.querySelectorAll('img[srcset], source[srcset]').forEach(el => {
    const parts = el.getAttribute('srcset').split(',').map(p => p.trim()).filter(Boolean).map(part => {
      const [url, ...rest] = part.split(/\s+/);
      const uri = resolve(url);
      if (!uri) warnings.push(`No se encontró la imagen: ${url}`);
      return [uri || url, ...rest].join(' ');
    });
    el.setAttribute('srcset', parts.join(', '));
  });
  documentHtml.querySelectorAll('[style*="url("]').forEach(el => {
    el.setAttribute('style', inlineCssImages(el.getAttribute('style'), resolve));
  });
  documentHtml.querySelectorAll('style').forEach(style => {
    if (style.dataset.baddevFile) return; // las hojas externas ya se procesaron con su propia ruta
    style.textContent = inlineCssImages(style.textContent, resolve);
  });
}
