/* ============================================================
   main.js — الإقلاع، تغيير الحجم، الحلقة الرئيسية
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL;
  var U = MAL.U, FX = MAL.FX, S = MAL.Save, A = MAL.Audio, R = MAL.R, G = MAL.Game, UI = MAL.UI;

  var canvas, started = false, lastT = 0, raf = 0;
  var frameAcc = 0, frameCount = 0, autoQualityDone = false;
  var dprCap = 2;

  function applyQuality() {
    var q = S.setting('quality');
    if (q === 'low') { FX.quality = 0.45; dprCap = 1.25; }
    else if (q === 'high') { FX.quality = 1; dprCap = 2; }
    else { FX.quality = 1; dprCap = 1.75; autoQualityDone = false; frameAcc = 0; frameCount = 0; }
    resize();
  }
  MAL.applyQuality = applyQuality;

  function viewport() {
    var vv = root.visualViewport;
    var w = Math.round((vv && vv.width) || root.innerWidth || document.documentElement.clientWidth);
    var h = Math.round((vv && vv.height) || root.innerHeight || document.documentElement.clientHeight);
    return { w: Math.max(320, w), h: Math.max(240, h) };
  }

  function resize() {
    var v = viewport();
    var dpr = Math.min(root.devicePixelRatio || 1, dprCap);
    G.resize(v.w, v.h, dpr);
  }

  /* ---------------- حلقة الرسم ---------------- */
  function loop(t) {
    raf = requestAnimationFrame(loop);
    if (!lastT) lastT = t;
    var rdt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;

    // قياس الأداء لضبط الجودة تلقائياً
    if (!autoQualityDone && S.setting('quality') === 'auto' && G.state === 'playing') {
      frameAcc += rdt; frameCount++;
      if (frameAcc > 3) {
        var avg = frameAcc / frameCount;
        if (avg > 0.024) { FX.quality = 0.5; dprCap = 1.3; resize(); }
        autoQualityDone = true;
      }
    }

    MAL.Input.update();
    var scale = FX.timeScale();
    var dt = rdt * scale;

    FX.update(dt, rdt);
    G.update(dt, rdt);
    G.draw();

    // رسوم الشاشات المتحركة
    if (UI.screen === 'title' && !G.running) {
      R.crest(document.getElementById('crestCv'), t / 1000);
    }

    document.body.classList.toggle('needs-landscape', G.state === 'playing' || G.state === 'paused');
  }

  /* ---------------- الإقلاع ---------------- */
  function boot() {
    canvas = document.getElementById('stage');
    S.load();

    G.init(canvas);
    MAL.Input.init(canvas);
    MAL.Input.setLefty(S.setting('lefty'));
    document.body.classList.toggle('lefty', !!S.setting('lefty'));

    UI.init(G);
    UI.go('title');

    applyQuality();
    resize();

    root.addEventListener('resize', resize);
    root.addEventListener('orientationchange', function () { setTimeout(resize, 250); });
    if (root.visualViewport) root.visualViewport.addEventListener('resize', resize);

    // أول لمسة: تفعيل الصوت
    var tts = document.getElementById('tapToStart');
    function begin() {
      if (started) return;
      started = true;
      A.init();
      A.setSfx(S.setting('sfx'));
      A.setMusic(S.setting('music'));
      A.resume();
      A.music.start({ maqam: 'hijaz', root: 146.83, tempo: 74, rhythm: 'ayyub' });
      A.music.setIntensity(0.05);
      tts.classList.add('gone');
      A.play('card');
    }
    tts.addEventListener('pointerdown', begin);
    tts.addEventListener('click', begin);
    root.addEventListener('keydown', begin, { once: true });

    document.getElementById('rotateHint').addEventListener('click', function () {
      document.body.classList.add('no-rotate-hint');
    });

    // إيقاف عند إخفاء الصفحة
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (G.state === 'playing') UI.pause();
        A.suspend();
      } else {
        if (started) A.resume();
        lastT = 0;
      }
    });

    // منع التكبير بالنقر المزدوج على iOS
    var lastTouch = 0;
    document.addEventListener('touchend', function (e) {
      var now = Date.now();
      if (now - lastTouch < 320) e.preventDefault();
      lastTouch = now;
    }, { passive: false });
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); });

    raf = requestAnimationFrame(loop);

    // عامل الخدمة (يعمل أوفلاين) — يُتجاهل عند فتح الملف محلياً
    if ('serviceWorker' in navigator && !root.__ANDALUS_SINGLE__ && location.protocol.indexOf('http') === 0) {
      root.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () {});
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(typeof window !== 'undefined' ? window : globalThis);
