// Minimal UTF-8 ZIP writer (stored entries, no third-party library).
// Designed for small web projects; UTF-8 bit is set, CRC32 is verified by unzip tools.
const encoder = new TextEncoder();
const CRC_TABLE = (() => {
  const result = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let value = i;
    for (let j = 0; j < 8; j++) value = value & 1 ? (value >>> 1) ^ 0xedb88320 : value >>> 1;
    result[i] = value >>> 0;
  }
  return result;
})();
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}
function write16(out, at, value) { out.setUint16(at, value, true); }
function write32(out, at, value) { out.setUint32(at, value >>> 0, true); }
function zipEntry(file) {
  const name = encoder.encode(file.name);
  const data = encoder.encode(file.content);
  if (name.length > 65535 || data.length >= 0xffffffff) throw new Error('Archivo ZIP demasiado grande.');
  return { name, data, crc: crc32(data) };
}
export function makeZip(files) {
  if (files.length > 1000) throw new Error('Hay demasiados archivos para el ZIP.');
  const entries = files.map(zipEntry);
  const localChunks = [];
  const centralChunks = [];
  let offset = 0;
  for (const entry of entries) {
    const local = new Uint8Array(30 + entry.name.length + entry.data.length);
    const header = new DataView(local.buffer);
    write32(header, 0, 0x04034b50);
    write16(header, 4, 20);
    write16(header, 6, 0x0800); // UTF-8
    write16(header, 8, 0); // stored
    write32(header, 14, entry.crc);
    write32(header, 18, entry.data.length);
    write32(header, 22, entry.data.length);
    write16(header, 26, entry.name.length);
    local.set(entry.name, 30);
    local.set(entry.data, 30 + entry.name.length);
    localChunks.push(local);

    const central = new Uint8Array(46 + entry.name.length);
    const c = new DataView(central.buffer);
    write32(c, 0, 0x02014b50);
    write16(c, 4, 20);
    write16(c, 6, 20);
    write16(c, 8, 0x0800);
    write32(c, 16, entry.crc);
    write32(c, 20, entry.data.length);
    write32(c, 24, entry.data.length);
    write16(c, 28, entry.name.length);
    write32(c, 42, offset);
    central.set(entry.name, 46);
    centralChunks.push(central);
    offset += local.length;
  }
  const centralSize = centralChunks.reduce((total, chunk) => total + chunk.length, 0);
  const end = new Uint8Array(22);
  const e = new DataView(end.buffer);
  write32(e, 0, 0x06054b50);
  write16(e, 8, entries.length);
  write16(e, 10, entries.length);
  write32(e, 12, centralSize);
  write32(e, 16, offset);
  return new Blob([...localChunks, ...centralChunks, end], { type: 'application/zip' });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
