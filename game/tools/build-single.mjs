/* بناء نسخة "ملف واحد" — للتشغيل بلا خادم أو للنشر كصفحة واحدة */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
fs.mkdirSync(DIST, { recursive: true });

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8');

const JS_ORDER = [
  'util.js', 'save.js', 'audio.js', 'input.js', 'data.js',
  'fx.js', 'render.js', 'entities.js', 'boss.js', 'ui.js', 'game.js', 'main.js'
];
const js = JS_ORDER
  .map((f) => '/* ===== ' + f + ' ===== */\n' + fs.readFileSync(path.join(ROOT, 'js', f), 'utf8'))
  .join('\n');

const start = html.indexOf('<!-- ==================== BODY:START ==================== -->');
const end = html.indexOf('<!-- ==================== BODY:END ==================== -->');
if (start < 0 || end < 0) throw new Error('لم أجد علامات BODY في index.html');
let body = html.slice(start, end);
// إزالة وسوم <script src> الخارجية
body = body.replace(/<script src="js\/[^"]+"><\/script>\s*/g, '');
body = body.replace('<!-- ==================== BODY:START ==================== -->', '').trim();

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;800;900&display=swap">';

const TITLE = 'الفُتوح — ٥٧ معركة';
const ARTIFACT_TITLE = 'الفُتوح';

/* ---------- 1) نسخة الصفحة الكاملة (تعمل بفتح الملف مباشرة) ---------- */
const full = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="الفتوح">
<meta name="theme-color" content="#0a0806">
<title>${TITLE}</title>
${FONTS}
<style>
${css}
</style>
</head>
<body>
<script>window.__ANDALUS_SINGLE__=true;</script>
${body}
<script>
${js}
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(DIST, 'futuh.html'), full);

/* ---------- 2) نسخة Artifact (بلا doctype/html/head/body) ---------- */
const artifact = `<title>${ARTIFACT_TITLE}</title>
<script>document.documentElement.setAttribute('dir','rtl');document.documentElement.setAttribute('lang','ar');</script>
${FONTS}
<style>
${css}
</style>
<script>window.__ANDALUS_SINGLE__=true;</script>
${body}
<script>
${js}
</script>
`;
fs.writeFileSync(path.join(DIST, 'artifact.html'), artifact);

const kb = (s) => (Buffer.byteLength(s, 'utf8') / 1024).toFixed(0) + ' KB';
console.log('✓ dist/futuh.html    ', kb(full));
console.log('✓ dist/artifact.html ', kb(artifact));
