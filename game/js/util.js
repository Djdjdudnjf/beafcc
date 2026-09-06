/* ============================================================
   util.js — أدوات عامة (رياضيات، عشوائية، توقيت، تنسيق عربي)
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});

  var TAU = Math.PI * 2;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  /** انتقال ناعم مستقل عن معدل الإطارات */
  function damp(a, b, lambda, dt) { return lerp(a, b, 1 - Math.exp(-lambda * dt)); }
  function rand(a, b) { if (b === undefined) { b = a; a = 0; } return a + Math.random() * (b - a); }
  function randInt(a, b) { return Math.floor(rand(a, b + 1)); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }
  function chance(p) { return Math.random() < p; }
  function sign(v) { return v < 0 ? -1 : (v > 0 ? 1 : 0); }

  function dist2(ax, ay, bx, by) { var dx = bx - ax, dy = by - ay; return dx * dx + dy * dy; }
  function dist(ax, ay, bx, by) { return Math.sqrt(dist2(ax, ay, bx, by)); }
  function angleTo(ax, ay, bx, by) { return Math.atan2(by - ay, bx - ax); }

  /** أقصر فرق زاوي ضمن [-π, π] */
  function angDiff(a, b) {
    var d = (b - a) % TAU;
    if (d > Math.PI) d -= TAU;
    if (d < -Math.PI) d += TAU;
    return d;
  }
  function angApproach(cur, target, maxStep) {
    var d = angDiff(cur, target);
    if (Math.abs(d) <= maxStep) return target;
    return cur + sign(d) * maxStep;
  }

  function normalize(x, y) {
    var l = Math.hypot(x, y);
    if (l < 1e-6) return { x: 0, y: 0, len: 0 };
    return { x: x / l, y: y / l, len: l };
  }

  // ---------- التنعيم ----------
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInCubic(t) { return t * t * t; }
  function easeOutQuad(t) { return 1 - (1 - t) * (1 - t); }
  function easeInOut(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function easeOutBack(t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  function easeOutElastic(t) {
    var c4 = TAU / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * c4) + 1;
  }

  // ---------- عشوائية ذات بذرة ----------
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashStr(s) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  // ---------- ألوان ----------
  /** تحويل hex إلى rgba مع شفافية */
  function rgba(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  /** تفتيح/تغميق لون hex بنسبة (-1..1) */
  function shade(hex, amt) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    if (amt >= 0) { r += (255 - r) * amt; g += (255 - g) * amt; b += (255 - b) * amt; }
    else { r *= (1 + amt); g *= (1 + amt); b *= (1 + amt); }
    return '#' + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
  }
  function mixHex(a, b, t) {
    var pa = a.replace('#', ''), pb = b.replace('#', '');
    if (pa.length === 3) pa = pa[0] + pa[0] + pa[1] + pa[1] + pa[2] + pa[2];
    if (pb.length === 3) pb = pb[0] + pb[0] + pb[1] + pb[1] + pb[2] + pb[2];
    var na = parseInt(pa, 16), nb = parseInt(pb, 16);
    var r = Math.round(lerp((na >> 16) & 255, (nb >> 16) & 255, t));
    var g = Math.round(lerp((na >> 8) & 255, (nb >> 8) & 255, t));
    var bl = Math.round(lerp(na & 255, nb & 255, t));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }

  // ---------- أرقام عربية ----------
  var AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  function ar(n) {
    var s = String(Math.round(n)), out = '', neg = false;
    if (s[0] === '-') { neg = true; s = s.slice(1); }
    for (var i = 0; i < s.length; i++) out += AR_DIGITS[+s[i]] !== undefined ? AR_DIGITS[+s[i]] : s[i];
    return (neg ? '−' : '') + out;
  }
  /** رقم مع فواصل الآلاف بالعربية */
  function arGroup(n) {
    var s = String(Math.round(Math.abs(n))), parts = [];
    while (s.length > 3) { parts.unshift(s.slice(-3)); s = s.slice(0, -3); }
    parts.unshift(s);
    return (n < 0 ? '−' : '') + parts.map(ar).join('٬');
  }
  /** عزل نص كاتجاه LTR — يمنع انقلاب الكسور مثل «٣ / ٨» داخل نص عربي */
  function ltr(s) { return '⁦' + s + '⁩'; }
  function frac(a, b) { return ltr(ar(a) + ' / ' + ar(b)); }

  function arTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return ar(m) + ':' + (s < 10 ? '٠' : '') + ar(s);
  }

  // ---------- تصادم ----------
  function circleHit(ax, ay, ar_, bx, by, br) {
    var r = ar_ + br;
    return dist2(ax, ay, bx, by) <= r * r;
  }
  /** هل النقطة داخل قوس (نصف قطر + زاوية)؟ */
  function inArc(px, py, ox, oy, radius, facing, halfArc) {
    if (dist2(px, py, ox, oy) > radius * radius) return false;
    return Math.abs(angDiff(facing, angleTo(ox, oy, px, py))) <= halfArc;
  }

  // ---------- مصفوفات ----------
  function removeDead(arr) {
    var j = 0;
    for (var i = 0; i < arr.length; i++) if (!arr[i].remove) arr[j++] = arr[i];
    arr.length = j;
    return arr;
  }
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0, t = arr[i];
      arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  /** اختيار n عناصر مختلفة مع أوزان */
  function weightedPick(items, weightFn) {
    var total = 0, i;
    for (i = 0; i < items.length; i++) total += Math.max(0, weightFn(items[i]));
    if (total <= 0) return items.length ? items[(Math.random() * items.length) | 0] : null;
    var r = Math.random() * total;
    for (i = 0; i < items.length; i++) {
      r -= Math.max(0, weightFn(items[i]));
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  MAL.U = {
    TAU: TAU, clamp: clamp, lerp: lerp, damp: damp, rand: rand, randInt: randInt,
    pick: pick, chance: chance, sign: sign,
    dist: dist, dist2: dist2, angleTo: angleTo, angDiff: angDiff, angApproach: angApproach,
    normalize: normalize,
    easeOutCubic: easeOutCubic, easeInCubic: easeInCubic, easeOutQuad: easeOutQuad,
    easeInOut: easeInOut, easeOutBack: easeOutBack, easeOutElastic: easeOutElastic,
    mulberry32: mulberry32, hashStr: hashStr,
    rgba: rgba, shade: shade, mixHex: mixHex,
    ar: ar, arGroup: arGroup, arTime: arTime, ltr: ltr, frac: frac,
    circleHit: circleHit, inArc: inArc,
    removeDead: removeDead, shuffle: shuffle, weightedPick: weightedPick
  };
})(typeof window !== 'undefined' ? window : globalThis);
