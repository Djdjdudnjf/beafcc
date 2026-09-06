/* اختبار آلي شامل: يشغّل اللعبة في متصفح حقيقي ويجرّب كل المسارات */
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
const page = await browser.newPage({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 2 });

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

/* ---------- أدوات داخل الصفحة ---------- */
await page.evaluate(() => {
  window.__err = [];
  window.addEventListener('error', (e) => window.__err.push(String(e.message)));
  window.__step = function (n, dt) {
    dt = dt || 1 / 60;
    const M = window.MAL;
    for (let i = 0; i < n; i++) {
      if (M.Game.state === 'cards') {
        M.UI.pickCard(M.UI.cardChoices && M.UI.cardChoices[0]);
      }
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
});

const results = [];
function ok(name, detail) { results.push({ name, pass: true, detail }); console.log('  ✓', name, detail || ''); }
function bad(name, detail) { results.push({ name, pass: false, detail }); console.log('  ✗', name, detail || ''); }

async function T(name, fn) {
  try {
    const r = await fn();
    if (r && r.error) bad(name, r.error); else ok(name, r && r.info);
  } catch (e) { bad(name, e.message); }
}

console.log('\n=== اختبار أنْدَلُس ===\n');

/* 1) الوحدات */
await T('تحميل كل الوحدات', () => page.evaluate(() => {
  const need = ['U', 'Save', 'Audio', 'Input', 'Data', 'FX', 'R', 'Player', 'Enemy', 'Boss', 'UI', 'Game'];
  const miss = need.filter((k) => !window.MAL[k]);
  return miss.length ? { error: 'ناقص: ' + miss.join(',') } : { info: need.length + ' وحدة' };
}));

/* 2) سلامة البيانات */
await T('سلامة بيانات المحتوى', () => page.evaluate(() => {
  const D = window.MAL.Data, bad = [];
  D.regions.forEach((r) => {
    ['id', 'name', 'pal', 'boss', 'codex', 'roster', 'music'].forEach((k) => { if (!r[k]) bad.push(r.id + '.' + k); });
    r.roster.forEach((e) => { if (!D.enemies[e]) bad.push(r.id + ' عدو مجهول ' + e); });
    if (!r.boss.patterns || !r.boss.patterns.length) bad.push(r.id + ' بلا أنماط زعيم');
  });
  D.heroes.forEach((h) => { if (!h.ult || !h.weapon) bad.push('بطل ' + h.id); });
  D.upgrades.forEach((u) => {
    if (typeof u.ap !== 'function') bad.push('بطاقة ' + u.id);
    if (!D.icons[u.i]) bad.push('أيقونة ' + u.i + ' مفقودة (' + u.id + ')');
  });
  D.forge.forEach((f) => { if (!D.icons[f.i]) bad.push('أيقونة صنعة ' + f.i); });
  const ids = {};
  D.allCodex().forEach((c) => { if (ids[c.id]) bad.push('سجل مكرر ' + c.id); ids[c.id] = 1; });
  return bad.length ? { error: bad.join(' | ') } : {
    info: D.regions.length + ' أقاليم، ' + D.heroes.length + ' أبطال، ' + D.upgrades.length + ' بطاقة، ' + D.allCodex().length + ' صفحة سجل'
  };
}));

/* 3) بناء كل ساحة */
await T('بناء ساحات الأقاليم الثمانية', () => page.evaluate(() => {
  const D = window.MAL.Data, R = window.MAL.R;
  let obs = 0;
  D.regions.forEach((r) => {
    const a = R.buildArena(r, 0);
    if (!a.canvas || !a.canvas.width) throw new Error('فشل بناء ' + r.id);
    obs += a.obstacles.length;
  });
  return { info: obs + ' عائقاً في المجموع' };
}));

/* 4) كل بطاقة ترقية على كل بطل */
await T('تطبيق كل البطاقات على كل بطل', () => page.evaluate(() => {
  const M = window.MAL, D = M.Data;
  const problems = [];
  D.heroes.forEach((h) => {
    M.Game.startRun(0, h.id, false);
    const p = M.Game.player;
    D.upgrades.forEach((u) => {
      for (let i = 0; i < u.max; i++) {
        try { p.addUpgrade(u); } catch (e) { problems.push(h.id + '/' + u.id + ': ' + e.message); }
      }
    });
    if (!isFinite(p.dmg()) || p.dmg() <= 0) problems.push(h.id + ' ضرر غير صالح ' + p.dmg());
    if (!isFinite(p.maxHp) || p.maxHp <= 0) problems.push(h.id + ' صحة غير صالحة');
    if (!isFinite(p.speed())) problems.push(h.id + ' سرعة غير صالحة');
    window.__step(90);
  });
  M.Game.endRun();
  return problems.length ? { error: problems.join(' | ') } : { info: (D.heroes.length * D.upgrades.length) + ' تركيبة' };
}));

/* 5) جولة كاملة لكل إقليم مع كل أنواع الأعداء */
await T('محاكاة قتال في كل إقليم', () => page.evaluate(() => {
  const M = window.MAL, D = M.Data;
  const info = [];
  D.regions.forEach((r, idx) => {
    M.Game.startRun(idx, 'faris', false);
    const g = M.Game;
    // فرّخ نوعاً من كل عدو موجود في اللعبة
    Object.keys(D.enemies).forEach((id) => { g.spawnEnemy(id); g.spawnEnemy(id); });
    let dir = 0;
    const dirs = ['w', 'a', 's', 'd'];
    for (let f = 0; f < 24; f++) {
      window.__drive(dirs[(dir++) % 4]);
      window.__step(25);
    }
    window.__drive(null);
    info.push(r.id + ':' + g.kills);
    g.endRun();
  });
  return { info: 'قتلى لكل إقليم → ' + info.join(' ') };
}));

/* 6) كل نمط زعيم */
await T('تشغيل كل أنماط الزعماء', () => page.evaluate(() => {
  const M = window.MAL, D = M.Data;
  const pats = {};
  D.regions.forEach((r) => r.boss.patterns.forEach((p) => pats[p] = 1));
  const all = Object.keys(pats);
  const problems = [];
  D.regions.forEach((r, idx) => {
    M.Game.startRun(idx, 'rami', false);
    const g = M.Game;
    g.startBoss();
    const b = g.boss;
    b.state = 'idle'; b.stateT = 0.1;
    r.boss.patterns.forEach((name) => {
      try {
        b.startPattern(name);
        window.__step(200);
        b.hp = b.maxHp;            // أعده للحياة لنكمل التجربة
        b.dead = false; b.remove = false; b.phase = 1;
      } catch (e) { problems.push(r.id + '/' + name + ': ' + e.message); }
    });
    // الطور الثاني
    try { b.enterPhase2(); window.__step(120); } catch (e) { problems.push(r.id + '/phase2: ' + e.message); }
    // الموت
    try { b.hurt(999999, {}, g); window.__step(150); } catch (e) { problems.push(r.id + '/death: ' + e.message); }
    g.endRun();
  });
  return problems.length ? { error: problems.join(' | ') } : { info: all.length + ' نمطاً × ' + D.regions.length + ' زعيماً' };
}));

/* 7) الضربات القاضية */
await T('كل الضربات القاضية', () => page.evaluate(() => {
  const M = window.MAL, D = M.Data, problems = [];
  D.heroes.forEach((h) => {
    M.Game.startRun(2, h.id, false);
    const g = M.Game, p = g.player;
    for (let i = 0; i < 10; i++) g.spawnEnemy('bandit');
    window.__step(30);
    p.ult = p.ultMax;
    try {
      if (!p.useUlt(g)) problems.push(h.id + ': لم تنطلق');
      window.__step(180);
    } catch (e) { problems.push(h.id + ': ' + e.message); }
    g.endRun();
  });
  return problems.length ? { error: problems.join(' | ') } : { info: D.heroes.length + ' ضربة' };
}));

/* 8) الموجات المتتابعة واختيار البطاقات */
await T('تسلسل الموجات حتى الزعيم والنصر', () => page.evaluate(() => {
  const M = window.MAL, g = M.Game;
  M.Game.startRun(0, 'ayyar', false);
  let guard = 0;
  while (g.state === 'playing' || g.state === 'cards') {
    // اقتل كل من في الساحة فوراً لتسريع المحاكاة
    if (g.state === 'playing') {
      g.enemies.forEach((e) => { if (!e.dead) { try { e.hurt(1e6, {}, g); } catch (err) {} } });
      g.spawnQueue.length = 0;
    }
    window.__step(20);
    if (++guard > 400) break;
  }
  const st = g.state;
  const cleared = M.Save.isCleared(M.Data.regions[0].id);
  M.UI.overlay('ov-victory', false);
  g.endRun();
  return (st === 'victory' && cleared) ? { info: 'وصلنا للنصر وفُتح الإقليم التالي' } : { error: 'الحالة النهائية: ' + st + ' cleared=' + cleared };
}));

/* 9) الهزيمة */
await T('مسار الهزيمة', () => page.evaluate(() => {
  const M = window.MAL, g = M.Game;
  g.startRun(1, 'faris', false);
  g.player.lastBreath = 0; g.player.revives = 0;
  g.player.hp = 1;
  g.player.takeDamage(9999, 0, 0);
  window.__step(120);
  const st = g.state;
  M.UI.overlay('ov-defeat', false);
  g.endRun();
  return st === 'dead' ? { info: 'ok' } : { error: 'الحالة: ' + st };
}));

/* 10) الوضع اللانهائي */
await T('الوضع اللانهائي', () => page.evaluate(() => {
  const M = window.MAL, g = M.Game;
  g.startRun(0, 'dariq', true);
  for (let w = 0; w < 8; w++) {
    g.enemies.forEach((e) => { if (!e.dead && e.kind !== 'boss') e.hurt(1e6, {}, g); });
    g.spawnQueue.length = 0;
    window.__step(40);
    if (g.state === 'cards') M.UI.pickCard(M.UI.cardChoices[0]);
  }
  const w = g.wave;
  g.endRun();
  return w >= 4 ? { info: 'بلغنا الموجة ' + w } : { error: 'توقف عند ' + w };
}));

/* 11) كل الشاشات */
await T('بناء كل شاشات الواجهة', () => page.evaluate(() => {
  const M = window.MAL;
  M.Save.data.gold = 99999;
  ['heroes', 'regions', 'forge', 'codex', 'settings', 'title'].forEach((s) => M.UI.go(s));
  const counts = {
    heroes: document.getElementById('heroGrid').children.length,
    regions: document.getElementById('regionScroll').children.length,
    forge: document.getElementById('forgeGrid').children.length,
    codex: document.getElementById('codexList').children.length,
    settings: document.getElementById('settingsBody').children.length
  };
  const empty = Object.keys(counts).filter((k) => counts[k] === 0);
  return empty.length ? { error: 'شاشات فارغة: ' + empty.join(',') } : { info: JSON.stringify(counts) };
}));

/* 12) الحفظ */
await T('الحفظ والاسترجاع', () => page.evaluate(() => {
  const S = window.MAL.Save;
  S.reset();
  S.addGold(1234);
  S.unlockHero('rami');
  S.setForge('edge', 3);
  S.seeCodex('cx_gib');
  S.save();
  S.load();
  const okGold = S.data.gold === 1234, okHero = S.heroUnlocked('rami'),
        okForge = S.forgeLevel('edge') === 3, okCodex = S.hasCodex('cx_gib');
  S.reset();
  return (okGold && okHero && okForge && okCodex) ? { info: 'ok' }
    : { error: 'gold=' + okGold + ' hero=' + okHero + ' forge=' + okForge + ' codex=' + okCodex };
}));

/* 13) لعب حقيقي مع لمس + لقطات */
await T('لعب حقيقي بلمس الشاشة', async () => {
  await page.evaluate(() => { window.MAL.Save.reset(); window.MAL.UI.go('title'); });
  await page.click('#tapToStart');
  await page.waitForTimeout(300);
  await page.click('[data-go="play"]');
  await page.waitForTimeout(900);

  // إصبع الحركة (يسار) + إصبع التصويب (يمين)
  await page.mouse.move(220, 560);
  await page.mouse.down();
  for (let i = 0; i < 30; i++) {
    const a = i / 30 * Math.PI * 2;
    await page.mouse.move(220 + Math.cos(a) * 55, 560 + Math.sin(a) * 55);
    await page.waitForTimeout(45);
  }
  await page.mouse.up();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SHOTS, 'play.png') });

  await page.click('#padDash');
  await page.waitForTimeout(400);
  const st = await page.evaluate(() => ({
    state: window.MAL.Game.state,
    wave: window.MAL.Game.wave,
    hp: Math.round(window.MAL.Game.player.hp),
    enemies: window.MAL.Game.enemies.length,
    fps: 1
  }));
  if (st.state !== 'playing') return { error: 'الحالة: ' + st.state };
  return { info: JSON.stringify(st) };
});

/* 14) الإيقاف والاستئناف */
await T('الإيقاف والاستئناف', async () => {
  await page.click('#btnPause');
  await page.waitForTimeout(250);
  const paused = await page.evaluate(() => window.MAL.Game.state);
  await page.click('#btnResume');
  await page.waitForTimeout(250);
  const resumed = await page.evaluate(() => window.MAL.Game.state);
  return (paused === 'paused' && resumed === 'playing') ? { info: 'ok' } : { error: paused + ' → ' + resumed };
});

/* 15) قياس الأداء */
await T('قياس الأداء (٦ ثوانٍ لعب مكثف)', async () => {
  await page.evaluate(() => {
    const g = window.MAL.Game;
    for (let i = 0; i < 30; i++) g.spawnEnemy('bandit');
    for (let i = 0; i < 8; i++) g.spawnEnemy('archer');
    window.__frames = 0;
    window.__t0 = performance.now();
    const tick = () => { window.__frames++; requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await page.waitForTimeout(6000);
  const perf = await page.evaluate(() => {
    const dt = (performance.now() - window.__t0) / 1000;
    return { fps: +(window.__frames / dt).toFixed(1), particles: window.MAL.FX.count(), enemies: window.MAL.Game.enemies.length };
  });
  await page.screenshot({ path: path.join(SHOTS, 'combat.png') });
  if (perf.fps < 40) return { error: 'الإطارات منخفضة: ' + perf.fps };
  return { info: perf.fps + ' إطار/ث · ' + perf.particles + ' جسيم · ' + perf.enemies + ' عدو' };
});

/* 16) لقطات القوائم */
await T('لقطات الشاشات', async () => {
  await page.evaluate(() => { window.MAL.UI.quit(); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, 'title.png') });
  await page.evaluate(() => { window.MAL.Save.data.gold = 5000; window.MAL.UI.go('heroes'); });
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(SHOTS, 'heroes.png') });
  await page.evaluate(() => window.MAL.UI.go('regions'));
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(SHOTS, 'regions.png') });
  await page.evaluate(() => window.MAL.UI.go('codex'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SHOTS, 'codex.png') });
  await page.evaluate(() => window.MAL.UI.go('forge'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SHOTS, 'forge.png') });
  return { info: 'حُفظت في .shots' };
});

/* 17) بطاقات الغنيمة */
await T('عرض بطاقات الغنيمة', async () => {
  await page.evaluate(() => {
    const M = window.MAL;
    M.UI.startGame(3, 'rami', false);
    M.Game.wave = 5;
    M.UI.showCards(M.Game);
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SHOTS, 'cards.png') });
  const n = await page.evaluate(() => document.getElementById('cardRow').children.length);
  await page.evaluate(() => { window.MAL.UI.overlay('ov-cards', false); window.MAL.UI.quit(); });
  return n === 3 ? { info: '٣ بطاقات' } : { error: 'عدد البطاقات: ' + n };
});

/* 18) أحجام مختلفة للشاشة */
await T('أحجام شاشات مختلفة', async () => {
  const sizes = [[1180, 820], [1024, 768], [844, 390], [768, 1024]];
  for (const [w, h] of sizes) {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(220);
  }
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.waitForTimeout(200);
  return { info: sizes.length + ' مقاسات' };
});

/* ---------- النتيجة ---------- */
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
if (failed.length || errors.length) {
  console.log('\nفشل الاختبار.');
  process.exit(1);
}
console.log('كل شيء سليم ✓');
