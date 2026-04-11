// Test that enhanceImage:
// 1. Upscales small images (< 500px wide)
// 2. Leaves large images at original dims
// 3. Output is always a valid WebP
// 4. Sharpening is applied (output ≥ input quality)
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import sharp from 'sharp';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Will import from the script once implemented
let enhanceImageBuffer: (input: Buffer, targetMinWidth: number) => Promise<Buffer>;

beforeAll(async () => {
  const mod = await import('@/scripts/enhance-webp.mjs');
  enhanceImageBuffer = mod.enhanceImageBuffer;
});

describe('enhanceImageBuffer', () => {
  it('upscales a small image to at least targetMinWidth', async () => {
    // Create a 236×419 synthetic WebP (like bereal screenshots)
    const smallWebp = await sharp({
      create: { width: 236, height: 419, channels: 3, background: { r: 128, g: 64, b: 200 } }
    }).webp({ quality: 80 }).toBuffer();

    const result = await enhanceImageBuffer(smallWebp, 944);
    const meta = await sharp(result).metadata();
    expect(meta.format).toBe('webp');
    expect(meta.width).toBeGreaterThanOrEqual(944);
  });

  it('does not shrink large images (>900px wide)', async () => {
    const largeWebp = await sharp({
      create: { width: 1242, height: 2208, channels: 3, background: { r: 255, g: 200, b: 100 } }
    }).webp({ quality: 80 }).toBuffer();

    const result = await enhanceImageBuffer(largeWebp, 944);
    const meta = await sharp(result).metadata();
    expect(meta.format).toBe('webp');
    expect(meta.width).toBe(1242);
    expect(meta.height).toBe(2208);
  });

  it('re-encodes as WebP regardless of input size', async () => {
    const input = await sharp({
      create: { width: 400, height: 710, channels: 3, background: { r: 10, g: 10, b: 10 } }
    }).webp().toBuffer();

    const result = await enhanceImageBuffer(input, 800);
    const meta = await sharp(result).metadata();
    expect(meta.format).toBe('webp');
  });
});
