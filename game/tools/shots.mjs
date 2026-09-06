/* لقطات مراجعة بصرية سريعة */
import { chromium } from 'playwright-core';
import path from 'node:path'; import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '.shots'); fs.mkdirSync(OUT, { recursive: true });
const EXE = process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 2 });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + path.join(ROOT, 'index.html'));
await p.waitForFunction(() => window.MAL && window.MAL.Game);
await p.evaluate(() => document.getElementById('tapToStart').classList.add('gone'));

const which = process.argv[2] || 'all';

async function shot(name, setup, wait = 900, arg) {
  await p.evaluate(setup, arg);
  await p.waitForTimeout(wait);
  await p.screenshot({ path: path.join(OUT, name + '.png') });
  console.log('✓', name);
}

if (which === 'all' || which === 'combat') {
  await shot('s_combat', () => {
    const M = window.MAL; M.Save.reset(); M.Save.data.regionsUnlocked = 8;
    M.UI.startGame(6, 'faris', false);
    const g = M.Game;
    ['bandit','archer','shieldman','charger','slinger','naffat','horseman','captain'].forEach(t => { g.spawnEnemy(t); g.spawnEnemy(t); });
    g.player.x = 0; g.player.y = 0;
  }, 2500);

  await shot('s_boss', () => {
    const M = window.MAL, g = M.Game;
    g.startBoss(); g.boss.state = 'idle';
    for (let i = 0; i < 6; i++) g.spawnEnemy('archer');
  }, 2200);
}

if (which === 'arena') {
  await shot('s_arena', () => {
    const M = window.MAL;
    M.Save.reset(); M.Save.data.regionsUnlocked = 8;
    M.UI.startGame(6, 'faris', false);
    const g = M.Game;
    g.spawnQueue.length = 0;
    g.enemies.length = 0;
    g.waveState = 'boss';
    g.player.x = 0; g.player.y = 0;
  }, 1500);
}

if (which === 'all' || which === 'regions') {
  for (const i of [0, 1, 3, 5, 7]) {
    await shot('s_region_' + i, (idx) => {
      const M = window.MAL;
      M.UI.startGame(idx, 'rami', false);
      const g = M.Game;
      const r = M.Data.regions[idx];
      r.roster.forEach(t => { g.spawnEnemy(t); g.spawnEnemy(t); });
    }, 1800, i);
  }
}
await b.close();
