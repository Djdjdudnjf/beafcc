/* ============================================================
   audio.js — محرك صوت مولَّد بالكامل (بدون أي ملفات صوتية)
   مؤثرات + موسيقى إجرائية على مقامات عربية (حجاز/نهاوند/رست/بياتي)
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U;

  var ctx = null, master = null, sfxBus = null, musBus = null, comp = null;
  var noiseBuf = null, ready = false, failed = false;
  var sfxVol = 0.55, musVol = 0.34;
  var lastSfxAt = {};   // للحد من تكرار نفس المؤثر في نفس الإطار

  function now() { return ctx ? ctx.currentTime : 0; }

  function makeNoise() {
    var len = Math.floor(ctx.sampleRate * 1.2);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  function init() {
    if (ready || failed) return ready;
    try {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) { failed = true; return false; }
      ctx = new AC();
      comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.knee.value = 22;
      comp.ratio.value = 8; comp.attack.value = 0.004; comp.release.value = 0.22;

      master = ctx.createGain(); master.gain.value = 0.9;
      sfxBus = ctx.createGain(); sfxBus.gain.value = sfxVol;
      musBus = ctx.createGain(); musBus.gain.value = 0;

      sfxBus.connect(comp); musBus.connect(comp);
      comp.connect(master); master.connect(ctx.destination);

      noiseBuf = makeNoise();
      ready = true;
      return true;
    } catch (e) { failed = true; return false; }
  }

  function resume() {
    if (!ready) init();
    if (ctx && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
  }
  function suspend() { if (ctx && ctx.state === 'running') { try { ctx.suspend(); } catch (e) {} } }

  // ---------------- لبنات أساسية ----------------
  function env(node, t0, a, d, peak, sus, rel) {
    var g = node.gain;
    g.cancelScheduledValues(t0);
    g.setValueAtTime(0.0001, t0);
    g.exponentialRampToValueAtTime(Math.max(0.0001, peak), t0 + a);
    if (sus !== undefined && rel !== undefined) {
      g.exponentialRampToValueAtTime(Math.max(0.0001, sus), t0 + a + d);
      g.exponentialRampToValueAtTime(0.0001, t0 + a + d + rel);
    } else {
      g.exponentialRampToValueAtTime(0.0001, t0 + a + d);
    }
  }

  function tone(opts) {
    if (!ready) return null;
    var t0 = opts.at || now();
    var o = ctx.createOscillator();
    o.type = opts.type || 'sine';
    o.frequency.setValueAtTime(opts.f0, t0);
    if (opts.f1 !== undefined) {
      if (opts.f1 > 0) o.frequency.exponentialRampToValueAtTime(opts.f1, t0 + (opts.slide || opts.dur || 0.2));
    }
    if (opts.detune) o.detune.setValueAtTime(opts.detune, t0);

    var g = ctx.createGain();
    var out = g;
    if (opts.filter) {
      var f = ctx.createBiquadFilter();
      f.type = opts.filter.type || 'lowpass';
      f.frequency.setValueAtTime(opts.filter.f0, t0);
      if (opts.filter.f1) f.frequency.exponentialRampToValueAtTime(opts.filter.f1, t0 + (opts.dur || 0.2));
      f.Q.value = opts.filter.q || 1;
      g.connect(f); out = f;
    }
    o.connect(g);
    out.connect(opts.bus || sfxBus);

    var dur = opts.dur || 0.2;
    env(g, t0, opts.a || 0.004, dur, (opts.vol === undefined ? 0.4 : opts.vol));
    o.start(t0);
    o.stop(t0 + dur + (opts.a || 0.004) + 0.06);
    return o;
  }

  function noise(opts) {
    if (!ready) return null;
    var t0 = opts.at || now();
    var s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    if (opts.rate) s.playbackRate.value = opts.rate;

    var f = ctx.createBiquadFilter();
    f.type = opts.type || 'bandpass';
    f.frequency.setValueAtTime(opts.f0, t0);
    if (opts.f1) f.frequency.exponentialRampToValueAtTime(Math.max(30, opts.f1), t0 + (opts.dur || 0.2));
    f.Q.value = opts.q === undefined ? 1.2 : opts.q;

    var g = ctx.createGain();
    s.connect(f); f.connect(g); g.connect(opts.bus || sfxBus);

    var dur = opts.dur || 0.2;
    env(g, t0, opts.a || 0.003, dur, (opts.vol === undefined ? 0.3 : opts.vol));
    s.start(t0);
    s.stop(t0 + dur + 0.08);
    return s;
  }

  // ---------------- مكتبة المؤثرات ----------------
  var SFX = {
    swing: function (p) {
      var v = 0.20 + (p || 0) * 0.06;
      noise({ f0: 1100 + (p || 0) * 400, f1: 320, dur: 0.16, q: 0.9, vol: v, type: 'bandpass' });
      tone({ type: 'triangle', f0: 420 + (p || 0) * 90, f1: 150, dur: 0.11, vol: 0.05 });
    },
    hit: function (heavy) {
      var t0 = now();
      noise({ at: t0, f0: heavy ? 2200 : 3000, f1: 500, dur: heavy ? 0.13 : 0.08, q: 0.6, vol: heavy ? 0.34 : 0.22 });
      tone({ at: t0, type: 'square', f0: heavy ? 180 : 260, f1: 60, dur: heavy ? 0.14 : 0.08, vol: heavy ? 0.24 : 0.14 });
      if (heavy) tone({ at: t0 + 0.01, type: 'sawtooth', f0: 900, f1: 300, dur: 0.1, vol: 0.08 });
    },
    clang: function () {
      var t0 = now();
      [1, 1.51, 2.13, 2.71].forEach(function (m, i) {
        tone({ at: t0, type: 'triangle', f0: 780 * m, dur: 0.28 - i * 0.04, vol: 0.11 / (i + 1) });
      });
      noise({ at: t0, f0: 4200, f1: 1400, dur: 0.09, q: 0.8, vol: 0.16 });
    },
    hurt: function () {
      var t0 = now();
      tone({ at: t0, type: 'sawtooth', f0: 240, f1: 70, dur: 0.28, vol: 0.26, filter: { type: 'lowpass', f0: 1400, f1: 300 } });
      noise({ at: t0, f0: 900, f1: 200, dur: 0.2, q: 0.5, vol: 0.18, type: 'lowpass' });
    },
    dash: function () {
      noise({ f0: 260, f1: 2600, dur: 0.2, q: 1.6, vol: 0.2 });
      tone({ type: 'sine', f0: 180, f1: 520, dur: 0.16, vol: 0.08 });
    },
    perfect: function () {
      var t0 = now();
      tone({ at: t0, type: 'sine', f0: 1760, dur: 0.5, vol: 0.16 });
      tone({ at: t0 + 0.02, type: 'sine', f0: 2640, dur: 0.42, vol: 0.10 });
      noise({ at: t0, f0: 6000, f1: 2000, dur: 0.18, q: 2, vol: 0.09 });
    },
    kill: function () {
      var t0 = now();
      noise({ at: t0, f0: 1600, f1: 180, dur: 0.26, q: 0.5, vol: 0.26, type: 'lowpass' });
      tone({ at: t0, type: 'square', f0: 150, f1: 45, dur: 0.24, vol: 0.15 });
    },
    bow: function () {
      var t0 = now();
      noise({ at: t0, f0: 2600, f1: 900, dur: 0.07, q: 1.4, vol: 0.16 });
      tone({ at: t0, type: 'triangle', f0: 620, f1: 240, dur: 0.1, vol: 0.10 });
    },
    arrowHit: function () {
      noise({ f0: 2400, f1: 700, dur: 0.07, q: 1.1, vol: 0.15 });
      tone({ type: 'square', f0: 300, f1: 110, dur: 0.07, vol: 0.09 });
    },
    coin: function () {
      var t0 = now();
      tone({ at: t0, type: 'square', f0: 1180, dur: 0.05, vol: 0.10 });
      tone({ at: t0 + 0.055, type: 'square', f0: 1760, dur: 0.09, vol: 0.09 });
    },
    heal: function () {
      var t0 = now();
      [523, 659, 784, 1046].forEach(function (f, i) {
        tone({ at: t0 + i * 0.05, type: 'sine', f0: f, dur: 0.22, vol: 0.11 });
      });
    },
    ui: function () { tone({ type: 'sine', f0: 660, f1: 880, dur: 0.05, vol: 0.10 }); },
    uiBack: function () { tone({ type: 'sine', f0: 620, f1: 380, dur: 0.07, vol: 0.09 }); },
    deny: function () { tone({ type: 'square', f0: 180, f1: 110, dur: 0.15, vol: 0.12 }); },
    card: function () {
      var t0 = now();
      [880, 1108, 1318, 1760].forEach(function (f, i) {
        tone({ at: t0 + i * 0.045, type: 'triangle', f0: f, dur: 0.3, vol: 0.10 });
      });
      noise({ at: t0, f0: 5200, f1: 2400, dur: 0.32, q: 2.2, vol: 0.05 });
    },
    wave: function () {
      var t0 = now();
      tone({ at: t0, type: 'sawtooth', f0: 196, dur: 0.7, vol: 0.13, a: 0.06, filter: { type: 'lowpass', f0: 700, f1: 2200 } });
      tone({ at: t0, type: 'sawtooth', f0: 294, dur: 0.7, vol: 0.10, a: 0.08, filter: { type: 'lowpass', f0: 800, f1: 2400 } });
      noise({ at: t0 + 0.02, f0: 200, f1: 90, dur: 0.5, q: 0.4, vol: 0.16, type: 'lowpass' });
    },
    boss: function () {
      var t0 = now();
      tone({ at: t0, type: 'sawtooth', f0: 70, f1: 48, dur: 1.5, vol: 0.3, a: 0.08, filter: { type: 'lowpass', f0: 500, f1: 160 } });
      tone({ at: t0, type: 'sawtooth', f0: 104, f1: 72, dur: 1.4, vol: 0.18, a: 0.1, detune: 14 });
      noise({ at: t0, f0: 420, f1: 120, dur: 1.3, q: 0.4, vol: 0.2, type: 'lowpass' });
    },
    explode: function () {
      var t0 = now();
      noise({ at: t0, f0: 1400, f1: 90, dur: 0.55, q: 0.35, vol: 0.34, type: 'lowpass' });
      tone({ at: t0, type: 'sawtooth', f0: 130, f1: 34, dur: 0.5, vol: 0.24, filter: { type: 'lowpass', f0: 900, f1: 120 } });
    },
    ult: function () {
      var t0 = now();
      noise({ at: t0, f0: 200, f1: 5200, dur: 0.6, q: 2.4, vol: 0.2 });
      tone({ at: t0 + 0.45, type: 'sawtooth', f0: 330, f1: 110, dur: 0.7, vol: 0.24, filter: { type: 'lowpass', f0: 2600, f1: 400 } });
      tone({ at: t0 + 0.45, type: 'square', f0: 82, f1: 41, dur: 0.6, vol: 0.18 });
    },
    fire: function () {
      noise({ f0: 700, f1: 260, dur: 0.4, q: 0.6, vol: 0.10, type: 'lowpass' });
    },
    win: function () {
      var t0 = now();
      [392, 523, 659, 784, 1046].forEach(function (f, i) {
        tone({ at: t0 + i * 0.12, type: 'triangle', f0: f, dur: 0.5, vol: 0.14 });
      });
    },
    lose: function () {
      var t0 = now();
      [330, 262, 220, 165].forEach(function (f, i) {
        tone({ at: t0 + i * 0.17, type: 'sawtooth', f0: f, dur: 0.7, vol: 0.14, filter: { type: 'lowpass', f0: 900, f1: 300 } });
      });
    }
  };

  function play(name, arg) {
    if (!ready || !SFX[name]) return;
    if (ctx.state === 'suspended') return;
    // منع التكديس: نفس المؤثر مرتين خلال 25ms
    var t = now();
    if (lastSfxAt[name] !== undefined && t - lastSfxAt[name] < 0.025) return;
    lastSfxAt[name] = t;
    try { SFX[name](arg); } catch (e) {}
  }

  // ---------------- الموسيقى الإجرائية ----------------
  // المقامات بأنصاف/أرباع الأصوات (بالنسبة للدرجة الأساس)
  var MAQAM = {
    hijaz:   [0, 1, 4, 5, 7, 8, 11],
    nahawand:[0, 2, 3, 5, 7, 8, 10],
    rast:    [0, 2, 3.5, 5, 7, 9, 10.5],
    bayati:  [0, 1.5, 3, 5, 7, 8, 10],
    saba:    [0, 1.5, 3, 4, 7, 8, 10],
    kurd:    [0, 1, 3, 5, 7, 8, 10]
  };

  var music = {
    on: false, cfg: null, timer: null,
    step: 0, nextTime: 0, tempo: 92, intensity: 0, targetIntensity: 0,
    scale: MAQAM.hijaz, rootHz: 146.83, drone: null, droneGain: null, phrase: [], phraseAt: 0
  };

  function hz(semi) { return music.rootHz * Math.pow(2, semi / 12); }
  function scaleNote(deg, oct) {
    var s = music.scale, n = s.length;
    var i = ((deg % n) + n) % n;
    var o = Math.floor(deg / n) + (oct || 0);
    return hz(s[i] + o * 12);
  }

  function startDrone() {
    stopDrone();
    if (!ready) return;
    var g = ctx.createGain();
    g.gain.value = 0.0001;
    var f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 460; f.Q.value = 0.8;
    var oscs = [];
    [[0, 0], [0, 7], [-7, 0]].forEach(function (pair, i) {
      var o = ctx.createOscillator();
      o.type = i === 2 ? 'sine' : 'sawtooth';
      o.frequency.value = hz(pair[1]) * (i === 2 ? 0.5 : 1);
      o.detune.value = (i - 1) * 7;
      var og = ctx.createGain();
      og.gain.value = i === 2 ? 0.5 : 0.18;
      o.connect(og); og.connect(f);
      o.start();
      oscs.push(o);
    });
    // اهتزاز بطيء يعطي حياة للدرون
    var lfo = ctx.createOscillator(); lfo.frequency.value = 0.13;
    var lg = ctx.createGain(); lg.gain.value = 90;
    lfo.connect(lg); lg.connect(f.frequency); lfo.start();
    oscs.push(lfo);

    f.connect(g); g.connect(musBus);
    g.gain.exponentialRampToValueAtTime(0.16, now() + 2.2);
    music.drone = oscs; music.droneGain = g;
  }
  function stopDrone() {
    if (!music.drone) return;
    var t = now(), g = music.droneGain, oscs = music.drone;
    try {
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    } catch (e) {}
    oscs.forEach(function (o) { try { o.stop(t + 0.8); } catch (e) {} });
    music.drone = null; music.droneGain = null;
  }

  function dum(t, v) {
    var o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.14);
    var g = ctx.createGain();
    o.connect(g); g.connect(musBus);
    env(g, t, 0.003, 0.19, v);
    o.start(t); o.stop(t + 0.24);
  }
  function tak(t, v) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 1.4;
    var g = ctx.createGain();
    s.connect(f); f.connect(g); g.connect(musBus);
    env(g, t, 0.002, 0.055, v);
    s.start(t); s.stop(t + 0.1);
  }
  function riq(t, v) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6200;
    var g = ctx.createGain();
    s.connect(f); f.connect(g); g.connect(musBus);
    env(g, t, 0.002, 0.04, v);
    s.start(t); s.stop(t + 0.08);
  }
  function oud(t, freq, v, dur) {
    var o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(freq, t);
    var f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(freq * 6, t);
    f.frequency.exponentialRampToValueAtTime(freq * 1.6, t + (dur || 0.5));
    f.Q.value = 2.2;
    var g = ctx.createGain();
    o.connect(f); f.connect(g); g.connect(musBus);
    env(g, t, 0.006, dur || 0.5, v);
    o.start(t); o.stop(t + (dur || 0.5) + 0.1);
  }
  function nay(t, freq, v, dur) {
    var o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(freq, t);
    var vib = ctx.createOscillator(); vib.frequency.value = 5.2;
    var vg = ctx.createGain(); vg.gain.value = freq * 0.011;
    vib.connect(vg); vg.connect(o.frequency); vib.start(t);
    var br = ctx.createBufferSource(); br.buffer = noiseBuf; br.loop = true;
    var bf = ctx.createBiquadFilter(); bf.type = 'bandpass'; bf.frequency.value = freq * 2.4; bf.Q.value = 3;
    var bg = ctx.createGain(); bg.gain.value = v * 0.12;
    br.connect(bf); bf.connect(bg); bg.connect(musBus); br.start(t); br.stop(t + dur + 0.1);
    var g = ctx.createGain();
    o.connect(g); g.connect(musBus);
    env(g, t, 0.09, dur, v * 0.75);
    o.start(t); o.stop(t + dur + 0.15);
    vib.stop(t + dur + 0.15);
  }

  // أنماط إيقاعية عربية (مقسّمة على ١٦ خطوة)
  var PATTERNS = {
    maqsum: { d: [0, 6, 8], t: [3, 10, 12, 14] },      // مقسوم
    baladi: { d: [0, 2, 8], t: [4, 6, 12, 14] },       // بلدي
    saidi:  { d: [0, 6, 8, 10], t: [3, 13, 14] },      // صعيدي
    ayyub:  { d: [0, 5, 8], t: [3, 11, 13] },          // أيوب
    war:    { d: [0, 4, 8, 12], t: [2, 6, 10, 14, 15] }// إيقاع الزحف
  };

  function makePhrase() {
    var p = [], len = 8, deg = U.randInt(0, 3);
    for (var i = 0; i < len; i++) {
      if (U.chance(0.26)) { p.push(null); continue; }
      deg += U.pick([-2, -1, -1, 0, 1, 1, 2, 3]);
      deg = U.clamp(deg, -3, 9);
      p.push(deg);
    }
    return p;
  }

  function schedule() {
    if (!ready || !music.on) return;
    var spb = 60 / music.tempo;            // ثانية لكل نبضة
    var sps = spb / 4;                     // ثانية لكل خطوة (١٦ خطوة)
    var horizon = now() + 0.22;

    music.intensity += (music.targetIntensity - music.intensity) * 0.06;

    while (music.nextTime < horizon) {
      var t = music.nextTime, s = music.step % 16, bar = Math.floor(music.step / 16);
      var pat = PATTERNS[music.cfg && music.cfg.rhythm ? music.cfg.rhythm : 'maqsum'];
      var inten = music.intensity;

      if (pat.d.indexOf(s) >= 0) dum(t, 0.30 + inten * 0.16);
      if (pat.t.indexOf(s) >= 0) tak(t, 0.16 + inten * 0.12);
      if (inten > 0.35 && (s % 2 === 1)) riq(t, 0.035 + inten * 0.05);
      if (inten > 0.72 && s === 15 && U.chance(0.5)) { tak(t + sps * 0.5, 0.2); }

      // لحن العود كل نصف مازورة
      if (s % 2 === 0) {
        var idx = ((bar * 8) + s / 2) % 8;
        if (idx === 0 && U.chance(0.45)) music.phrase = makePhrase();
        if (!music.phrase.length) music.phrase = makePhrase();
        var deg = music.phrase[idx];
        if (deg !== null && deg !== undefined && U.chance(0.82)) {
          oud(t, scaleNote(deg, 0), 0.075 + inten * 0.05, 0.42);
          if (U.chance(0.22)) oud(t + sps * 0.5, scaleNote(deg + 2, 0), 0.05, 0.3);
        }
      }
      // الناي في بداية كل مازورتين
      if (s === 0 && bar % 2 === 0 && U.chance(0.55)) {
        nay(t, scaleNote(U.pick([0, 3, 4, 7]), 1), 0.09 + inten * 0.03, spb * 2.4);
      }

      music.step++;
      music.nextTime += sps;
    }
  }

  var Music = {
    start: function (cfg) {
      if (!ready) return;
      music.cfg = cfg || {};
      music.scale = MAQAM[cfg && cfg.maqam ? cfg.maqam : 'hijaz'] || MAQAM.hijaz;
      music.rootHz = (cfg && cfg.root) || 146.83;
      music.tempo = (cfg && cfg.tempo) || 92;
      music.step = 0;
      music.phrase = makePhrase();
      music.nextTime = now() + 0.1;
      music.on = true;
      startDrone();
      if (music.timer) clearInterval(music.timer);
      music.timer = setInterval(schedule, 40);
      var t = now();
      musBus.gain.cancelScheduledValues(t);
      musBus.gain.setValueAtTime(Math.max(0.0001, musBus.gain.value), t);
      musBus.gain.linearRampToValueAtTime(MAL.Audio.musicEnabled ? musVol : 0, t + 1.6);
    },
    stop: function (fade) {
      if (!ready) return;
      var t = now();
      try {
        musBus.gain.cancelScheduledValues(t);
        musBus.gain.setValueAtTime(Math.max(0.0001, musBus.gain.value), t);
        musBus.gain.linearRampToValueAtTime(0, t + (fade === undefined ? 0.6 : fade));
      } catch (e) {}
      setTimeout(function () {
        music.on = false;
        if (music.timer) { clearInterval(music.timer); music.timer = null; }
        stopDrone();
      }, (fade === undefined ? 0.6 : fade) * 1000 + 60);
    },
    setIntensity: function (v) { music.targetIntensity = U.clamp(v, 0, 1); },
    setTempo: function (v) { music.tempo = U.clamp(v, 50, 190); },
    isOn: function () { return music.on; }
  };

  MAL.Audio = {
    musicEnabled: true,
    sfxEnabled: true,
    init: init,
    resume: resume,
    suspend: suspend,
    isReady: function () { return ready; },
    play: play,
    music: Music,
    setSfx: function (on) {
      this.sfxEnabled = !!on;
      if (ready) sfxBus.gain.setTargetAtTime(on ? sfxVol : 0, now(), 0.05);
    },
    setMusic: function (on) {
      this.musicEnabled = !!on;
      if (ready) musBus.gain.setTargetAtTime(on && music.on ? musVol : 0, now(), 0.12);
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
