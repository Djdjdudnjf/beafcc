/* اختبار آلي شامل لـ«الفُتوح» — متصفح حقيقي + لمسٌ حقيقي */
import { chromium } from 'playwright-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const EXE = process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const TARGET = process.argv[2] || path.join(ROOT, 'index.html');
const SHOTS = path.join(ROOT, '.shots');
fs.mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({
  viewport: { width: 1180, height: 820 }, deviceScaleFactor: 2, hasTouch: true
});
const page = await ctx.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')));
page.on('console', (m) => {
  if (m.type() === 'error') {
    const t = m.text();
    if (/favicon|net::ERR|Failed to load resource|fonts\.googleapis/i.test(t)) return;
    errors.push('CONSOLE: ' + t);
  }
});

await page.goto('file://' + TARGET);
await page.waitForFunction(() => window.MAL && window.MAL.Game && window.MAL.UI, null, { timeout: 15000 });

await page.evaluate(() => {
  window.__err = [];
  window.addEventListener('error', (e) => window.__err.push(String(e.message)));
  window.__step = function (n, dt) {
    dt = dt || 1 / 60;
    const M = window.MAL;
    for (let i = 0; i < n; i++) {
      M.Input.update();
      M.FX.update(dt, dt);
      M.Game.update(dt, dt);
      if (i % 7 === 0) M.Game.draw();
    }
  };
  window.__drive = function (dir) {
    const k = window.MAL.Input.keys;
    k['w'] = k['a'] = k['s'] = k['d'] = false;
    if (dir) k[dir] = true;
  };
  window.__wipeFoes = function () {
    const g = window.MAL.Game;
    g.foeQueue.length = 0;
    g.units.forEach((u) => {
      if (!u.dead && u.team === window.MAL.FOE) { try { u.hurt(1e6, {}, g); } catch (e) {} }
    });
  };
});

const results = [];
function ok(name, detail) { results.push({ name, pass: true }); console.log('  ✓', name, detail || ''); }
function bad(name, detail) { results.push({ name, pass: false }); console.log('  ✗', name, detail || ''); }
async function T(name, fn) {
  try {
    const r = await fn();
    if (r && r.error) bad(name, r.error); else ok(name, r && r.info);
  } catch (e) { bad(name, e.message); }
}

console.log('\n=== اختبار الفُتوح ===\n');

/* 1 */
await T('تحميل كل الوحدات', () => page.evaluate(() => {
  const need = ['U', 'Save', 'Audio', 'Input', 'Data', 'FX', 'R', 'Unit', 'Player', 'Commander', 'UI', 'Game'];
  const miss = need.filter((k) => !window.MAL[k]);
  return miss.length ? { error: 'ناقص: ' + miss.join(',') } : { info: need.length + ' وحدة' };
}));

/* 2 */
await T('سلامة المحتوى التاريخي', () => page.evaluate(() => {
  const D = window.MAL.Data, bad = [];
  if (D.total !== 57) bad.push('عدد المراحل ' + D.total + ' وليس ٥٧');
  const chCount = {};
  D.stages.forEach((s, i) => {
    ['n', 'hy', 'ad', 'place', 'foe', 'terr', 'outcome', 'note', 'cmd'].forEach((k) => {
      if (!s[k]) bad.push('المرحلة ' + (i + 1) + ' ينقصها ' + k);
    });
    if (!D.factions[s.foe]) bad.push('خصمٌ مجهول ' + s.foe + ' في ' + s.n);
    if (!D.terrain[s.terr]) bad.push('تضاريس مجهولة ' + s.terr + ' في ' + s.n);
    if (s.ch < 0 || s.ch >= D.chapters.length) bad.push('فصلٌ خاطئ في ' + s.n);
    if (s.note && s.note.length < 40) bad.push('ملاحظةٌ قصيرة في ' + s.n);
    chCount[s.ch] = (chCount[s.ch] || 0) + 1;
  });
  D.chapters.forEach((c, i) => { if (!chCount[i]) bad.push('فصلٌ بلا معارك: ' + c.name); });
  D.armory.forEach((f) => { if (!D.icons[f.i]) bad.push('أيقونة مفقودة ' + f.i); });
  D.rewards.forEach((r) => { if (!D.icons[r.i]) bad.push('أيقونة مكافأة مفقودة ' + r.i); });
  const names = {};
  D.stages.forEach((s) => { names[s.n] = (names[s.n] || 0) + 1; });
  return bad.length ? { error: bad.slice(0, 6).join(' | ') }
    : { info: D.total + ' معركة في ' + D.chapters.length + ' فصول، ' + Object.keys(D.factions).length + ' خصماً' };
}));

/* 3 */
await T('بناء ميادين كل التضاريس', () => page.evaluate(() => {
  const D = window.MAL.Data, R = window.MAL.R;
  let obs = 0, n = 0;
  Object.keys(D.terrain).forEach((k) => {
    const t = D.terrain[k];
    const a = R.buildArena({ id: 'terr_' + k, props: t.props,
      pal: { sky: t.sky, g1: t.g1, g2: t.g2, stone: t.stone, accent: t.accent, enemy: '#8a4a3a', prop: t.stone, fog: t.accent } }, 1);
    if (!a.canvas.width) throw new Error('فشل ' + k);
    obs += a.obstacles.length; n++;
  });
  return { info: n + ' تضاريس، ' + obs + ' عائقاً' };
}));

/* 4 */
await T('معركة كاملة حتى النصر', () => page.evaluate(() => {
  const M = window.MAL, g = M.Game;
  M.Save.reset();
  M.UI.startBattle(0);
  let guard = 0;
  while ((g.state === 'playing') && guard++ < 900) {
    window.__wipeFoes();
    if (g.commander && !g.commander.dead) g.commander.hurt(1e6, {}, g);
    window.__step(15);
  }
  const st = g.state;
  const rewardOpen = document.getElementById('ov-cards').classList.contains('on');
  return (st === 'victory' && rewardOpen)
    ? { info: 'وصلنا للنصر وظهرت الغنائم' }
    : { error: 'الحالة ' + st + ' · الغنائم ' + rewardOpen };
}));

/* 5 */
await T('أخذ الغنيمة وفتح المرحلة التالية', () => page.evaluate(() => {
  const M = window.MAL;
  const before = { gold: M.Save.data.gold, army: M.Save.campaign('army'), sword: M.Save.campaign('sword') };
  document.getElementById('cardRow').children[2].click();   // عدد الجيش
  const after = { gold: M.Save.data.gold, army: M.Save.campaign('army'), sword: M.Save.campaign('sword') };
  const unlocked = M.Save.stageUnlocked(1);
  const vic = document.getElementById('ov-victory').classList.contains('on');
  M.UI.overlay('ov-victory', false);
  return (after.army > before.army && unlocked && vic)
    ? { info: 'الجيش ' + before.army + '→' + after.army + '، فُتحت المرحلة ٢' }
    : { error: 'army ' + before.army + '→' + after.army + ' unlocked=' + unlocked + ' victory=' + vic };
}));

/* 6 */
await T('محاكاة قتالٍ في عيّنة من المراحل', () => page.evaluate(() => {
  const M = window.MAL, D = M.Data, info = [], problems = [];
  M.Save.data.unlocked = 57;
  [0, 8, 18, 28, 38, 48, 56].forEach((i) => {
    // لاعبٌ وصل هذه المرحلة يكون قد راكم غنائم — نحاكي ذلك
    M.Save.reset();
    M.Save.data.unlocked = 57;
    M.Save.addCampaign('sword', Math.round(i * 2.6));
    M.Save.addCampaign('army', Math.round(i * 0.5));
    M.Save.setArmory('edge', Math.min(6, Math.floor(i / 10)));
    M.Save.setArmory('mail', Math.min(5, Math.floor(i / 12)));
    M.UI.startBattle(i);
    const g = M.Game;
    let dir = 0;
    const dirs = ['w', 'a', 's', 'd'];
    for (let f = 0; f < 20; f++) { window.__drive(dirs[(dir++) % 4]); window.__step(25); }
    window.__drive(null);
    info.push((i + 1) + ':' + g.foeKilled);
    if (g.foeKilled === 0) problems.push('المرحلة ' + (i + 1) + ': لم يسقط أحدٌ من الخصم');
    g.endBattle();
  });
  return problems.length ? { error: problems.join(' | ') } : { info: 'سقطى الخصم → ' + info.join(' ') };
}));

/* 7 */
await T('كل أنماط قائد الخصم', () => page.evaluate(() => {
  const M = window.MAL, problems = [];
  M.UI.startBattle(20);
  const g = M.Game;
  const c = new M.Commander(g.setup, g);
  g.commander = c; g.cmdSpawned = true; g.units.push(c);
  c.state = 'idle'; c.stateT = 0.1;
  c.patterns.forEach((p) => {
    try {
      c.pat = p; c.patD = {}; c.state = 'pattern';
      window.__step(150);
      c.hp = c.maxHp; c.dead = false; c.remove = false; c.phase = 1;
    } catch (e) { problems.push(p + ': ' + e.message); }
  });
  try { c.enterPhase2(); window.__step(100); } catch (e) { problems.push('phase2: ' + e.message); }
  try { c.hurt(1e9, {}, g); window.__step(140); } catch (e) { problems.push('death: ' + e.message); }
  g.endBattle();
  return problems.length ? { error: problems.join(' | ') } : { info: c.patterns.length + ' أنماط' };
}));

/* 8 */
await T('الراية (الضربة القاضية)', () => page.evaluate(() => {
  const M = window.MAL;
  M.UI.startBattle(12);
  const g = M.Game, p = g.player;
  window.__step(60);
  p.ult = p.ultMax;
  const before = g.liveCount(M.FRIEND);
  if (!p.useUlt(g)) return { error: 'لم تنطلق' };
  window.__step(90);
  const rallied = g.units.filter((u) => u.team === M.FRIEND && u.rallyT > 0).length;
  g.endBattle();
  return rallied > 0 ? { info: rallied + ' من الجند تحت الراية' } : { error: 'لم يتأثر أحد' };
}));

/* 9 */
await T('مسار الهزيمة', () => page.evaluate(() => {
  const M = window.MAL;
  M.UI.startBattle(3);
  const g = M.Game;
  g.player.revives = 0;
  g.player.hp = 1;
  g.player.takeDamage(9999, 0, 0);
  window.__step(120);
  const st = g.state;
  M.UI.overlay('ov-defeat', false);
  g.endBattle();
  return st === 'dead' ? { info: 'ok' } : { error: 'الحالة ' + st };
}));

/* 10 */
await T('نموّ الجيش بالمكافآت ودار السلاح', () => page.evaluate(() => {
  const M = window.MAL, S = M.Save;
  S.reset();
  const base = M.Game.armySize();
  S.addCampaign('army', 6);
  const afterReward = M.Game.armySize();
  S.setArmory('levy', 3);
  const afterArmory = M.Game.armySize();
  S.reset();
  return (afterReward === base + 6 && afterArmory === base + 12)
    ? { info: base + ' → ' + afterReward + ' → ' + afterArmory }
    : { error: base + '/' + afterReward + '/' + afterArmory };
}));

/* 11 */
await T('بناء كل الشاشات', () => page.evaluate(() => {
  const M = window.MAL;
  M.Save.data.gold = 99999;
  M.Save.data.unlocked = 57;
  ['stages', 'armory', 'log', 'settings', 'title'].forEach((s) => M.UI.go(s));
  const counts = {
    stages: document.getElementById('stageScroll').children.length,
    armory: document.getElementById('armoryGrid').children.length,
    log: document.getElementById('logList').children.length,
    settings: document.getElementById('settingsBody').children.length
  };
  const empty = Object.keys(counts).filter((k) => counts[k] === 0);
  M.Save.reset();
  return empty.length ? { error: 'شاشات فارغة: ' + empty.join(',') } : { info: JSON.stringify(counts) };
}));

/* 12 */
await T('الحفظ والاسترجاع', () => page.evaluate(() => {
  const S = window.MAL.Save;
  S.reset();
  S.addGold(2500); S.clearStage(4); S.unlockStage(5);
  S.addCampaign('sword', 21); S.setArmory('edge', 2);
  S.save(); S.load();
  const okAll = S.data.gold === 2500 && S.stageCleared(4) && S.stageUnlocked(5)
    && S.campaign('sword') === 21 && S.armory('edge') === 2;
  S.reset();
  return okAll ? { info: 'ok' } : { error: 'فشل الاسترجاع' };
}));

/* 13 — الأهم: التحرك بلمسٍ حقيقي */
await T('التحرّك بلمسٍ حقيقي على الشاشة', async () => {
  await page.evaluate(() => {
    window.MAL.Save.reset();
    document.getElementById('tapToStart').classList.add('gone');
    window.MAL.UI.startBattle(0);
  });
  await page.waitForTimeout(600);
  const before = await page.evaluate(() => ({ x: MAL.Game.player.x, y: MAL.Game.player.y }));
  const cdp = await ctx.newCDPSession(page);
  async function touch(type, x, y) {
    await cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
  }
  await touch('touchStart', 250, 600);
  for (let i = 1; i <= 22; i++) { await touch('touchMove', 250 + i * 3, 600 - i * 2); await page.waitForTimeout(28); }
  const mid = await page.evaluate(() => ({
    active: MAL.Input.moveStick.active, mag: MAL.Input.moveStick.mag, mv: MAL.Input.move.mag
  }));
  await touch('touchEnd', 0, 0);
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => ({ x: MAL.Game.player.x, y: MAL.Game.player.y }));
  const moved = Math.hypot(after.x - before.x, after.y - before.y);
  if (!mid.active) return { error: 'عصا الحركة لم تُفعَّل باللمس' };
  if (moved < 25) return { error: 'اللاعب لم يتحرك (' + moved.toFixed(0) + ')' };
  return { info: 'تحرّك ' + moved.toFixed(0) + ' وحدة · قوة العصا ' + mid.mag.toFixed(2) };
});

/* 14 */
await T('زرّا الاندفاع والراية باللمس', async () => {
  const cdp = await ctx.newCDPSession(page);
  const box = await page.evaluate(() => {
    const r = document.getElementById('padDash').getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  const before = await page.evaluate(() => MAL.Game.player.dashCharges);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x, y: box.y, id: 9 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => MAL.Game.player.dashCharges);
  return after < before ? { info: 'الاندفاع اشتغل' } : { error: 'الاندفاع لم يعمل ' + before + '→' + after };
});

/* 15 */
await T('الإيقاف والاستئناف', async () => {
  await page.click('#btnPause');
  await page.waitForTimeout(250);
  const paused = await page.evaluate(() => MAL.Game.state);
  await page.click('#btnResume');
  await page.waitForTimeout(250);
  const resumed = await page.evaluate(() => MAL.Game.state);
  return (paused === 'paused' && resumed === 'playing') ? { info: 'ok' } : { error: paused + ' → ' + resumed };
});

/* 16 */
await T('الأداء في معركةٍ كبيرة', async () => {
  await page.evaluate(() => {
    const M = window.MAL;
    M.Save.data.unlocked = 57;
    M.Save.setArmory('levy', 6);
    M.Save.addCampaign('army', 14);
    M.UI.startBattle(50);
    window.__f = 0; window.__t = performance.now();
    const tick = () => { window.__f++; requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await page.waitForTimeout(6000);
  const perf = await page.evaluate(() => ({
    fps: +(window.__f / ((performance.now() - window.__t) / 1000)).toFixed(1),
    units: MAL.Game.units.length,
    particles: MAL.FX.count()
  }));
  await page.screenshot({ path: path.join(SHOTS, 'battle.png') });
  if (perf.fps < 32) return { error: 'الإطارات منخفضة: ' + perf.fps };
  return { info: perf.fps + ' إطار/ث · ' + perf.units + ' مقاتلاً · ' + perf.particles + ' جسيماً' };
});

/* 17 */
await T('لقطات الشاشات', async () => {
  await page.evaluate(() => { MAL.UI.quit(); MAL.Save.data.gold = 4000; MAL.Save.data.unlocked = 20; });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SHOTS, 'title.png') });
  await page.evaluate(() => MAL.UI.go('stages'));
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(SHOTS, 'stages.png') });
  await page.evaluate(() => MAL.UI.brief(5));
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(SHOTS, 'brief.png') });
  await page.evaluate(() => { MAL.UI.overlay('ov-brief', false); MAL.UI.go('armory'); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SHOTS, 'armory.png') });
  await page.evaluate(() => MAL.UI.go('log'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SHOTS, 'log.png') });
  return { info: 'حُفظت في .shots' };
});

/* 18 */
await T('أحجام شاشات مختلفة', async () => {
  const sizes = [[1180, 820], [1024, 768], [844, 390], [768, 1024]];
  for (const [w, h] of sizes) { await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(200); }
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.waitForTimeout(200);
  return { info: sizes.length + ' مقاسات' };
});

const inPageErrs = await page.evaluate(() => window.__err || []);
errors.push(...inPageErrs.map((e) => 'WINDOW: ' + e));
await browser.close();

const failed = results.filter((r) => !r.pass);
console.log('\n────────────────────────────');
console.log('نجح: ' + (results.length - failed.length) + '/' + results.length);
if (errors.length) {
  console.log('\n أخطاء المتصفح (' + errors.length + '):');
  [...new Set(errors)].slice(0, 25).forEach((e) => console.log('  ! ' + e));
}
if (failed.length || errors.length) { console.log('\nفشل الاختبار.'); process.exit(1); }
console.log('كل شيء سليم ✓');
