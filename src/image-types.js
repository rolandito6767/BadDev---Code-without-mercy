// BadDev V 1.3 — tipos de imagen reconocidos en las carpetas de proyecto.
export const IMAGE_MIME = Object.freeze({
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  ico: 'image/x-icon',
  avif: 'image/avif'
});
export const MAX_IMAGE_BYTES = 3_000_000;
export const MAX_TOTAL_IMAGE_BYTES = 25_000_000;
export const MAX_IMAGES = 200;

const extOf = (name = '') => (name.includes('.') ? name.split('.').pop().toLowerCase() : '');
export const isImageName = (name = '') => Object.hasOwn(IMAGE_MIME, extOf(name));
export const imageMime = (name = '') => IMAGE_MIME[extOf(name)] || 'application/octet-stream';
