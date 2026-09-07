/* محاكاة لاعبٍ متمكّن عبر المراحل لقياس منحنى الصعوبة */
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
  M.Input.update = function () {};

  window.__sim = function (stageIdx) {
    const g = M.Game, S = M.Save;
    S.reset();
    S.data.unlocked = 57;
    // تقدّمٌ يوازي عدد المعارك التي خاضها
    S.addCampaign('sword', Math.round(stageIdx * 2.6));
    S.addCampaign('army', Math.round(stageIdx * 0.5));
    S.setArmory('edge', Math.min(6, Math.floor(stageIdx / 10)));
    S.setArmory('vigor', Math.min(6, Math.floor(stageIdx / 9)));
    S.setArmory('mail', Math.min(5, Math.floor(stageIdx / 12)));
    S.setArmory('levy', Math.min(6, Math.floor(stageIdx / 11)));
    S.setArmory('guard', Math.min(4, Math.floor(stageIdx / 15)));

    M.UI.startBattle(stageIdx);
    const p = g.player;
    const dt = 1 / 60;
    let frames = 0;

    while (g.state === 'playing' && frames < 60 * 60 * 8) {
      const near = g.nearestOf(p.x, p.y, M.FOE, 1e9);
      let mx = 0, my = 0;
      if (near) {
        const d = U.dist(p.x, p.y, near.x, near.y);
        const a = U.angleTo(p.x, p.y, near.x, near.y);
        const want = 74;
        if (d < want * 0.9) { mx = -Math.cos(a); my = -Math.sin(a); }
        else if (d > want * 1.4) { mx = Math.cos(a); my = Math.sin(a); }
        else { mx = Math.cos(a + Math.PI / 2); my = Math.sin(a + Math.PI / 2); }
        const dc = Math.hypot(p.x, p.y);
        if (dc > g.arenaR - 90) {
          const ac = Math.atan2(p.y, p.x);
          mx -= Math.cos(ac) * 1.5; my -= Math.sin(ac) * 1.5;
        }
        const n = U.normalize(mx, my); mx = n.x; my = n.y;
        if (d < 58 && p.dashCharges > 0 && p.dashing <= 0) M.Input._dash = true;
      }
      M.Input.move.x = mx; M.Input.move.y = my; M.Input.move.mag = 1;
      if (p.ult >= p.ultMax) M.Input._ult = true;
      M.FX.update(dt, dt);
      g.update(dt, dt);
      frames++;
    }
    const res = {
      state: g.state, time: Math.round(frames / 60),
      kills: p.stats.kills, foeKilled: g.foeKilled, foeTotal: g.foeTotal,
      ours: g.liveCount(M.FRIEND), army: g.armySize(), hp: Math.round(p.hp)
    };
    try { M.UI.overlay('ov-cards', false); M.UI.overlay('ov-victory', false); M.UI.overlay('ov-defeat', false); } catch (e) {}
    g.endBattle();
    return res;
  };
});

console.log('\n=== توازن الفُتوح ===\n');
const names = await page.evaluate(() => window.MAL.Data.stages.map((s) => s.n));
const TRIALS = +(process.env.TRIALS || 2);
const picks = (process.env.STAGES || '0,5,12,20,28,36,44,50,56').split(',').map(Number);

for (const i of picks) {
  const runs = [];
  for (let t = 0; t < TRIALS; t++) runs.push(await page.evaluate(([idx]) => window.__sim(idx), [i]));
  const wins = runs.filter((r) => r.state === 'victory').length;
  const r = runs[0];
  const pct = Math.round(100 * runs.reduce((s, x) => s + x.foeKilled / Math.max(1, x.foeTotal), 0) / runs.length);
  console.log(
    `${String(i + 1).padStart(2)}. ${names[i].padEnd(14)} → نصر ${wins}/${TRIALS}  ` +
    `أسقط ${pct}٪ من الخصم  جيشك ${r.army}  بقي ${r.ours}  زمن ~${r.time}ث`
  );
}
await browser.close();
