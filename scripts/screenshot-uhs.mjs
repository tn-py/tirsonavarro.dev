/**
 * Captures a screenshot of uhs-hardware.com and saves it to public/screenshots/.
 * Skips capture if the existing screenshot is less than 1 hour old.
 * Run automatically as part of `npm run build` and `npm run dev`.
 */

import puppeteer from 'puppeteer-core';
import Chromium from '@sparticuz/chromium';
import { mkdirSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '../public/screenshots');
const outputPath = join(outputDir, 'uhs-hardware.png');

// Skip if screenshot is less than 1 hour old (avoids re-running on every dev restart)
if (existsSync(outputPath)) {
  const ageMs = Date.now() - statSync(outputPath).mtimeMs;
  if (ageMs < 60 * 60 * 1000) {
    console.log('[screenshot] Skipping – screenshot is less than 1 hour old.');
    process.exit(0);
  }
}

mkdirSync(outputDir, { recursive: true });

console.log('[screenshot] Capturing uhs-hardware.com...');

const executablePath = await Chromium.executablePath();
const browser = await puppeteer.launch({
  args: Chromium.args,
  defaultViewport: { width: 1280, height: 800 },
  executablePath,
  headless: true,
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

try {
  await page.goto('https://uhs-hardware.com', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });
  await page.screenshot({ path: outputPath, type: 'png' });
  console.log(`[screenshot] Saved to ${outputPath}`);
} finally {
  await browser.close();
}
