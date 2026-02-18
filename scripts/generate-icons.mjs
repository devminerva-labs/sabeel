#!/usr/bin/env node
// Generate PNG icons from scratch using raw PNG encoding (no dependencies)
// Creates minimal valid PNGs with the Sabeel "س" logo

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pubDir = join(__dirname, '..', 'public');
mkdirSync(join(pubDir, 'icons'), { recursive: true });

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ -1) >>> 0;
}
const crc32Table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  crc32Table[i] = c;
}

function createPNG(width, height, pixels) {
  // pixels is a Uint8Array of RGBA data (width * height * 4)
  // Add filter byte (0 = None) before each row
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0; // filter byte
    pixels.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = deflateSync(raw);

  const chunks = [];

  // Signature
  chunks.push(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

  function addChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeB = Buffer.from(type);
    const crcData = Buffer.concat([typeB, data]);
    const crcB = Buffer.alloc(4);
    crcB.writeUInt32BE(crc32(crcData));
    chunks.push(len, typeB, data, crcB);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  addChunk('IHDR', ihdr);

  // IDAT
  addChunk('IDAT', compressed);

  // IEND
  addChunk('IEND', Buffer.alloc(0));

  return Buffer.concat(chunks);
}

function drawFilledIcon(size, bg, fg) {
  const pixels = Buffer.alloc(size * size * 4);
  const [br, bg2, bb] = bg;
  const [fr, fg2, fb] = fg;

  // Fill with background
  for (let i = 0; i < size * size; i++) {
    pixels[i*4] = br; pixels[i*4+1] = bg2; pixels[i*4+2] = bb; pixels[i*4+3] = 255;
  }

  // Draw a simple "S" shape (stylized) in the center
  const cx = Math.floor(size / 2);
  const cy = Math.floor(size / 2);
  const r = Math.floor(size * 0.3);

  // Draw a circle for the letter placeholder
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < r && dist > r * 0.7) {
        pixels[(y * size + x) * 4] = fr;
        pixels[(y * size + x) * 4 + 1] = fg2;
        pixels[(y * size + x) * 4 + 2] = fb;
        pixels[(y * size + x) * 4 + 3] = 255;
      }
    }
  }

  return createPNG(size, size, pixels);
}

// Generate simple green icons
const green = [26, 71, 42];
const light = [240, 253, 244];

writeFileSync(join(pubDir, 'apple-touch-icon.png'), drawFilledIcon(180, green, light));
writeFileSync(join(pubDir, 'icons/icon-192.png'), drawFilledIcon(192, green, light));
writeFileSync(join(pubDir, 'icons/icon-192-maskable.png'), drawFilledIcon(192, green, light));
writeFileSync(join(pubDir, 'icons/icon-512.png'), drawFilledIcon(512, green, light));
writeFileSync(join(pubDir, 'icons/icon-512-maskable.png'), drawFilledIcon(512, green, light));

// OG image - simple green rect with lighter center
const ogW = 1200, ogH = 630;
const ogPixels = Buffer.alloc(ogW * ogH * 4);
for (let y = 0; y < ogH; y++) {
  for (let x = 0; x < ogW; x++) {
    const i = (y * ogW + x) * 4;
    ogPixels[i] = 26; ogPixels[i+1] = 71; ogPixels[i+2] = 42; ogPixels[i+3] = 255;
  }
}
// Draw gold border
for (let y = 28; y < 602; y++) {
  for (let x = 28; x < 1172; x++) {
    if (y < 33 || y > 597 || x < 33 || x > 1167) {
      const i = (y * ogW + x) * 4;
      ogPixels[i] = 212; ogPixels[i+1] = 160; ogPixels[i+2] = 23;
    }
  }
}
writeFileSync(join(pubDir, 'og-image.png'), createPNG(ogW, ogH, ogPixels));

console.log('Generated all icons and OG image!');
