/* توليد أيقونات التطبيق من نفس شعار اللعبة (بلا صور خارجية) */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'icons');
const EXE = process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setContent('<canvas id="c"></canvas>');
await page.addScriptTag({ path: path.join(ROOT, 'js/util.js') });
await page.addScriptTag({ path: path.join(ROOT, 'js/render.js') });

async function make(file, size, pad) {
  const dataUrl = await page.evaluate(({ size, pad }) => {
    const cv = document.getElementById('c');
    cv.width = size; cv.height = size;
    const c = cv.getContext('2d');
    const U = window.MAL.U, R = window.MAL.R;

    // خلفية
    const g = c.createRadialGradient(size * 0.5, size * 0.36, size * 0.06, size * 0.5, size * 0.5, size * 0.72);
    g.addColorStop(0, '#241a0d');
    g.addColorStop(0.55, '#140e07');
    g.addColorStop(1, '#080604');
    c.fillStyle = g;
    c.fillRect(0, 0, size, size);

    // زخرفة خلفية
    c.save();
    c.globalAlpha = 0.10;
    c.strokeStyle = '#d8a445';
    c.lineWidth = size * 0.006;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      c.beginPath();
      c.moveTo(size / 2, size / 2);
      c.lineTo(size / 2 + Math.cos(a) * size, size / 2 + Math.sin(a) * size);
      c.stroke();
    }
    c.restore();

    // إطار
    c.strokeStyle = 'rgba(216,164,69,.42)';
    c.lineWidth = size * 0.018;
    c.beginPath();
    c.arc(size / 2, size / 2, size * (0.46 - pad), 0, Math.PI * 2);
    c.stroke();

    // الشعار
    const inner = document.createElement('canvas');
    const s = Math.round(size * (1 - pad * 2.2));
    inner.width = s; inner.height = s;
    R.crest(inner, 0);
    c.drawImage(inner, (size - s) / 2, (size - s) / 2);

    return cv.toDataURL('image/png');
  }, { size, pad });

  const b64 = dataUrl.split(',')[1];
  fs.writeFileSync(path.join(OUT, file), Buffer.from(b64, 'base64'));
  console.log('✓', file, size + 'px');
}

await make('icon-192.png', 192, 0.02);
await make('icon-512.png', 512, 0.02);
await make('icon-maskable.png', 512, 0.13);
await make('apple-touch-icon.png', 180, 0.02);
await make('favicon.png', 64, 0.02);

await browser.close();
console.log('تمّ توليد الأيقونات في', OUT);
