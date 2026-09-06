/* محاكاة لاعب متمكّن لقياس توازن الصعوبة عبر الأقاليم */
import { chromium } from 'playwright-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const EXE = process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1180, height: 820 } });
page.on('pageerror', (e) => console.log('ERR:', e.message));
await page.goto('file://' + path.join(ROOT, 'index.html'));
await page.waitForFunction(() => window.MAL && window.MAL.Game);

await page.evaluate(() => {
  const M = window.MAL, U = M.U;
  // نعطّل قراءة الإدخال الحقيقي ونقودها بأنفسنا
  M.Input.update = function () {};

  window.__sim = function (regionIdx, heroId, skill, forge) {
    const g = M.Game;
    M.Save.reset();
    M.Save.data.regionsUnlocked = 8;
    // محاكاة لاعبٍ راكم تطويراتٍ دائمة بقدر تقدّمه
    if (forge) {
      const lv = Math.min(5, forge);
      M.Save.setForge('vitality', Math.min(5, lv));
      M.Save.setForge('edge', Math.min(5, lv));
      M.Save.setForge('guard', Math.min(4, lv));
      M.Save.setForge('swift', Math.min(4, Math.floor(lv / 2)));
      if (lv >= 3) M.Save.setForge('wind', 1);
      if (lv >= 4) M.Save.setForge('revive', 1);
    }
    g.startRun(regionIdx, heroId, false);
    const p = g.player;
    const dt = 1 / 60;
    let frames = 0, dodges = 0;

    while (frames < 60 * 60 * 12) {           // حد أقصى ١٢ دقيقة محاكاة
      if (g.state === 'cards') {
        // اختر بطاقة كما يفعل لاعب: يفضّل الضرر ثم الصحة
        const order = ['edge', 'swift', 'mail', 'crit', 'vamp', 'split'];
        let pick = M.UI.cardChoices.find((c) => order.indexOf(c.id) >= 0) || M.UI.cardChoices[0];
        M.UI.pickCard(pick);
      }
      if (g.state !== 'playing') break;

      // ---- سياسة الحركة: ابتعد عن الأقرب ودُر حوله ----
      const near = g.nearestEnemy(p.x, p.y, 1e9);
      let mx = 0, my = 0;
      if (near) {
        const d = U.dist(p.x, p.y, near.x, near.y);
        const a = U.angleTo(p.x, p.y, near.x, near.y);
        const want = p.hero.weapon === 'bow' ? 210 : 78;
        if (d < want * 0.9) { mx = -Math.cos(a); my = -Math.sin(a); }
        else if (d > want * 1.5) { mx = Math.cos(a); my = Math.sin(a); }
        else { mx = Math.cos(a + Math.PI / 2); my = Math.sin(a + Math.PI / 2); }
        // ابتعد عن حافة الساحة
        const dc = Math.hypot(p.x, p.y);
        if (dc > g.arenaR - 90) {
          const ac = Math.atan2(p.y, p.x);
          mx -= Math.cos(ac) * 1.4; my -= Math.sin(ac) * 1.4;
        }
        const n = U.normalize(mx, my);
        mx = n.x; my = n.y;
        // اندفاع دفاعي
        if (skill > 0.4 && d < 60 && p.dashCharges > 0 && p.dashing <= 0) { M.Input._dash = true; dodges++; }
      }
      M.Input.move.x = mx; M.Input.move.y = my; M.Input.move.mag = 1;
      if (p.ult >= p.ultMax) M.Input._ult = true;

      M.FX.update(dt, dt);
      g.update(dt, dt);
      frames++;
    }
    return {
      wave: g.wave, state: g.state, kills: p.stats.kills,
      time: +(frames / 60).toFixed(0), hp: Math.round(p.hp), dodges,
      upgrades: Object.keys(p.upgrades).length
    };
  };
});

console.log('\n=== توازن الصعوبة (محاكاة لاعب متمكّن) ===\n');
const regions = await page.evaluate(() => window.MAL.Data.regions.map((r) => r.name));
const TRIALS = +(process.env.TRIALS || 3);
for (let i = 0; i < regions.length; i++) {
  const runs = [];
  for (let t = 0; t < TRIALS; t++) runs.push(await page.evaluate(([idx]) => window.__sim(idx, 'faris', 0.8, Math.min(5, idx)), [i]));
  const wins = runs.filter((r) => r.state === 'victory').length;
  const waves = runs.map((r) => r.wave).sort((a, b) => a - b);
  const med = waves[Math.floor(waves.length / 2)];
  const avgT = Math.round(runs.reduce((s, r) => s + r.time, 0) / runs.length);
  console.log(
    `${(i + 1)}. ${regions[i].padEnd(12)} → فَتْح ${wins}/${TRIALS}  الموجة (وسيط) ${med}  ` +
    `الزمن ~${Math.floor(avgT / 60)}:${String(avgT % 60).padStart(2, '0')}  [${waves.join(',')}]`
  );
}

console.log('\n--- بقية الأبطال في جبل طارق ---');
for (const h of ['faris', 'rami', 'dariq', 'ayyar']) {
  const runs = [];
  for (let t = 0; t < TRIALS; t++) runs.push(await page.evaluate(([hero]) => window.__sim(0, hero, 0.8), [h]));
  const wins = runs.filter((r) => r.state === 'victory').length;
  console.log(`  ${h.padEnd(6)} → فَتْح ${wins}/${TRIALS} · الموجات [${runs.map((r) => r.wave).join(',')}]`);
}

await browser.close();
