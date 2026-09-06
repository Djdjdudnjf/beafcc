/* ============================================================
   render.js — كل الرسم: الساحة، الأشخاص، الأسلحة، الواجهة داخل اللوحة
   كل شيء متجهيّ إجرائي — بلا أي صور خارجية.
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U;

  var ARENA_R = 480;          // نصف قطر الساحة
  var OUTLINE = 'rgba(16,10,6,0.85)';

  /* مخزن التدرجات — إنشاء التدرج في كل إطار مكلف جداً */
  var gradCache = new WeakMap();
  function cachedGrad(c, key, y0, y1, stops) {
    var m = gradCache.get(c);
    if (!m) { m = {}; gradCache.set(c, m); }
    var g = m[key];
    if (!g) {
      g = c.createLinearGradient(0, y0, 0, y1);
      for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
      m[key] = g;
    }
    return g;
  }

  /* =========================================================
     بناء أرضية الساحة على لوحة خارج الشاشة (مرة واحدة لكل إقليم)
     ========================================================= */
  function buildArena(region, seed, res) {
    var pad = 90, size = (ARENA_R + pad) * 2;
    res = res || 1.6;                       // دقة أعلى من وحدات العالم لتبقى حادة عند التقريب
    var cv = document.createElement('canvas');
    cv.width = Math.round(size * res); cv.height = Math.round(size * res);
    var c = cv.getContext('2d');
    var pal = region.pal;
    var rng = U.mulberry32(U.hashStr(region.id) + (seed || 0));
    c.translate(cv.width / 2, cv.height / 2);
    c.scale(res, res);

    // ---- ما وراء الساحة ----
    var outer = c.createRadialGradient(0, 0, ARENA_R * 0.9, 0, 0, ARENA_R + pad);
    outer.addColorStop(0, pal.sky);
    outer.addColorStop(1, '#050403');
    c.fillStyle = outer;
    c.fillRect(-size / 2, -size / 2, size, size);

    // ---- أرضية الساحة ----
    c.save();
    c.beginPath(); c.arc(0, 0, ARENA_R, 0, U.TAU); c.clip();

    // نغمّق الأرضية عمداً كي تبرز الشخصيات فوقها
    var G1 = U.shade(pal.g1, -.34), G2 = U.shade(pal.g2, -.42);
    var g = c.createRadialGradient(0, -ARENA_R * .25, 40, 0, 0, ARENA_R);
    g.addColorStop(0, U.shade(G1, .12));
    g.addColorStop(.62, G1);
    g.addColorStop(1, G2);
    c.fillStyle = g;
    c.fillRect(-ARENA_R, -ARENA_R, ARENA_R * 2, ARENA_R * 2);

    // حلقات الزليج المتحدة المركز
    var rings = 7;
    for (var i = rings; i >= 1; i--) {
      var rr = ARENA_R * (i / rings);
      c.beginPath(); c.arc(0, 0, rr, 0, U.TAU);
      c.strokeStyle = U.rgba(i % 2 ? pal.stone : pal.accent, i % 2 ? .10 : .07);
      c.lineWidth = i % 2 ? 2 : 7;
      c.stroke();
    }

    // أشعة قاسمة
    c.save();
    c.strokeStyle = U.rgba(pal.stone, .07);
    c.lineWidth = 1.5;
    for (var s = 0; s < 16; s++) {
      var a = s / 16 * U.TAU;
      c.beginPath();
      c.moveTo(Math.cos(a) * ARENA_R * .18, Math.sin(a) * ARENA_R * .18);
      c.lineTo(Math.cos(a) * ARENA_R, Math.sin(a) * ARENA_R);
      c.stroke();
    }
    c.restore();

    // نجمة ثمانية في المركز
    drawStar8(c, 0, 0, ARENA_R * .16, U.rgba(pal.accent, .07), U.rgba(pal.accent, .14));
    drawStar8(c, 0, 0, ARENA_R * .085, U.rgba(pal.stone, .06), U.rgba(pal.accent, .11));

    // بلاط سداسي خفيف
    c.globalAlpha = .05;
    c.strokeStyle = pal.stone; c.lineWidth = 1;
    for (var y = -ARENA_R; y < ARENA_R; y += 46) {
      for (var x = -ARENA_R; x < ARENA_R; x += 46) {
        if (rng() > .5) continue;
        c.strokeRect(x + (y / 46 % 2 ? 23 : 0), y, 46, 46);
      }
    }
    c.globalAlpha = 1;

    // بقع وتشققات
    for (var k = 0; k < 70; k++) {
      var a2 = rng() * U.TAU, d2 = Math.sqrt(rng()) * ARENA_R * .96;
      var px = Math.cos(a2) * d2, py = Math.sin(a2) * d2;
      c.globalAlpha = .04 + rng() * .07;
      c.fillStyle = rng() > .5 ? '#000' : pal.stone;
      c.beginPath();
      c.ellipse(px, py, 8 + rng() * 34, 5 + rng() * 20, rng() * 3, 0, U.TAU);
      c.fill();
    }
    c.globalAlpha = 1;

    // ظل داخلي عند الحافة
    var edge = c.createRadialGradient(0, 0, ARENA_R * .68, 0, 0, ARENA_R);
    edge.addColorStop(0, 'rgba(0,0,0,0)');
    edge.addColorStop(1, 'rgba(0,0,0,0.55)');
    c.fillStyle = edge;
    c.fillRect(-ARENA_R, -ARENA_R, ARENA_R * 2, ARENA_R * 2);
    c.restore();

    // ---- سور الساحة ----
    c.save();
    c.beginPath(); c.arc(0, 0, ARENA_R + 15, 0, U.TAU);
    c.strokeStyle = U.shade(pal.stone, -.45);
    c.lineWidth = 30; c.stroke();
    c.beginPath(); c.arc(0, 0, ARENA_R + 6, 0, U.TAU);
    c.strokeStyle = U.shade(pal.stone, -.15);
    c.lineWidth = 9; c.stroke();
    c.beginPath(); c.arc(0, 0, ARENA_R + 2, 0, U.TAU);
    c.strokeStyle = U.rgba(pal.accent, .5);
    c.lineWidth = 2.5; c.stroke();

    // شرفات السور
    var merlons = 64;
    for (var m = 0; m < merlons; m++) {
      var ma = m / merlons * U.TAU;
      var mx = Math.cos(ma) * (ARENA_R + 26), my = Math.sin(ma) * (ARENA_R + 26);
      c.save();
      c.translate(mx, my); c.rotate(ma + Math.PI / 2);
      c.fillStyle = U.shade(pal.stone, -.32);
      c.fillRect(-8, -13, 16, 26);
      c.fillStyle = U.shade(pal.stone, -.12);
      c.fillRect(-8, -13, 16, 6);
      c.restore();
    }
    c.restore();

    // ---- عناصر الإقليم ----
    var obstacles = [];
    decorate(c, region, rng, obstacles);

    return { canvas: cv, size: size, res: res, pad: pad, obstacles: obstacles };
  }

  function drawStar8(c, x, y, r, fill, stroke) {
    c.save(); c.translate(x, y);
    c.beginPath();
    for (var i = 0; i < 16; i++) {
      var rr = i % 2 ? r * .58 : r;
      var a = i / 16 * U.TAU - Math.PI / 2;
      var px = Math.cos(a) * rr, py = Math.sin(a) * rr;
      if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.stroke(); }
    c.restore();
  }

  /** عقد حدوة الفرس — أيقونة العمارة الأندلسية */
  function horseshoeArch(c, x, y, w, h, fill, stroke, striped) {
    var r = w / 2;
    c.save(); c.translate(x, y);
    c.beginPath();
    c.moveTo(-r, 0);
    c.lineTo(-r, -h + r * 1.15);
    c.arc(0, -h + r * 1.15, r, Math.PI, 0, false);
    c.lineTo(r, 0);
    c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (striped) {
      c.save(); c.clip();
      for (var i = 0; i < 9; i++) {
        c.fillStyle = i % 2 ? U.rgba('#e8dcc3', .13) : U.rgba('#a8372c', .16);
        c.save();
        c.translate(0, -h + r * 1.15);
        c.rotate(Math.PI + i * (Math.PI / 9));
        c.fillRect(0, -r * .16, r * 1.05, r * .3);
        c.restore();
      }
      c.restore();
    }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2.5; c.stroke(); }
    c.restore();
  }

  function decorate(c, region, rng, obstacles) {
    var pal = region.pal, kind = region.props;
    var ringR = ARENA_R * .70;

    function addObstacle(x, y, r, draw) {
      obstacles.push({ x: x, y: y, r: r });
      draw(x, y);
    }

    function shadowBlob(x, y, r) {
      c.fillStyle = 'rgba(0,0,0,0.42)';
      c.beginPath(); c.ellipse(x, y + r * .34, r * 1.15, r * .55, 0, 0, U.TAU); c.fill();
    }

    var i, a, x, y, n;

    if (kind === 'arches' || kind === 'alhambra') {
      n = 6;
      for (i = 0; i < n; i++) {
        a = i / n * U.TAU + .3;
        x = Math.cos(a) * ringR; y = Math.sin(a) * ringR;
        addObstacle(x, y, 26, function (px, py) {
          shadowBlob(px, py, 26);
          c.save(); c.translate(px, py);
          c.fillStyle = U.shade(pal.stone, -.55);
          c.beginPath(); c.ellipse(0, 6, 26, 13, 0, 0, U.TAU); c.fill();
          horseshoeArch(c, 0, 4, 52, 74, U.shade(pal.stone, -.46), U.rgba(pal.accent, .45), true);
          c.fillStyle = U.rgba(pal.accent, .35);
          c.fillRect(-30, -2, 60, 6);
          c.restore();
        });
      }
      if (kind === 'alhambra') {
        // نافورة الحمراء: حوض رخام وماء
        c.save();
        c.fillStyle = U.rgba(U.shade(pal.stone, -.30), .55);
        c.beginPath(); c.arc(0, 0, 72, 0, U.TAU); c.fill();
        c.strokeStyle = U.rgba(pal.accent, .40); c.lineWidth = 4;
        c.beginPath(); c.arc(0, 0, 72, 0, U.TAU); c.stroke();
        c.fillStyle = 'rgba(58,120,132,.35)';
        c.beginPath(); c.arc(0, 0, 58, 0, U.TAU); c.fill();
        c.strokeStyle = 'rgba(170,230,235,.20)'; c.lineWidth = 2;
        c.beginPath(); c.arc(0, 0, 46, 0, U.TAU); c.stroke();
        drawStar8(c, 0, 0, 24, 'rgba(190,235,240,.18)', U.rgba(pal.accent, .45));
        c.restore();
      }
    } else if (kind === 'columns') {
      n = 8;
      for (i = 0; i < n; i++) {
        a = i / n * U.TAU;
        var rr = i % 2 ? ringR : ringR * .62;
        x = Math.cos(a) * rr; y = Math.sin(a) * rr;
        addObstacle(x, y, 19, function (px, py) {
          shadowBlob(px, py, 19);
          c.save(); c.translate(px, py);
          c.fillStyle = U.shade(pal.stone, -.48);
          c.beginPath(); c.ellipse(0, 0, 19, 14, 0, 0, U.TAU); c.fill();
          c.fillStyle = U.shade(pal.stone, -.22);
          c.beginPath(); c.ellipse(0, -5, 15, 10, 0, 0, U.TAU); c.fill();
          c.strokeStyle = U.rgba(pal.accent, .4); c.lineWidth = 2;
          c.beginPath(); c.ellipse(0, -5, 15, 10, 0, 0, U.TAU); c.stroke();
          c.restore();
        });
      }
    } else if (kind === 'rocks' || kind === 'peaks') {
      n = 7;
      for (i = 0; i < n; i++) {
        a = i / n * U.TAU + .7;
        var d = ringR * (.7 + rng() * .38);
        x = Math.cos(a) * d; y = Math.sin(a) * d;
        var rad = 20 + rng() * 12;
        (function (px, py, rr2) {
          addObstacle(px, py, rr2, function () {
            shadowBlob(px, py, rr2);
            c.save(); c.translate(px, py);
            c.fillStyle = U.shade(pal.stone, -.52);
            c.beginPath();
            for (var q = 0; q < 8; q++) {
              var qa = q / 8 * U.TAU, qr = rr2 * (.78 + rng() * .42);
              var qx = Math.cos(qa) * qr, qy = Math.sin(qa) * qr * .8;
              if (q === 0) c.moveTo(qx, qy); else c.lineTo(qx, qy);
            }
            c.closePath(); c.fill();
            c.fillStyle = U.shade(pal.stone, kind === 'peaks' ? .10 : -.30);
            c.beginPath(); c.ellipse(-rr2 * .18, -rr2 * .3, rr2 * .5, rr2 * .32, -.4, 0, U.TAU); c.fill();
            c.restore();
          });
        })(x, y, rad);
      }
    } else if (kind === 'garden' || kind === 'palms') {
      // قناة ماء تعبر الساحة
      c.save();
      c.beginPath(); c.arc(0, 0, ARENA_R - 4, 0, U.TAU); c.clip();
      c.fillStyle = U.rgba('#7fd4d0', .12);
      c.fillRect(-ARENA_R, -26, ARENA_R * 2, 52);
      c.strokeStyle = U.rgba(pal.accent, .3); c.lineWidth = 3;
      c.strokeRect(-ARENA_R, -26, ARENA_R * 2, 52);
      c.restore();

      n = 6;
      for (i = 0; i < n; i++) {
        a = i / n * U.TAU + .5;
        x = Math.cos(a) * ringR; y = Math.sin(a) * ringR;
        if (Math.abs(y) < 46) y += y >= 0 ? 60 : -60;
        addObstacle(x, y, 17, function (px, py) {
          shadowBlob(px, py, 17);
          c.save(); c.translate(px, py);
          c.fillStyle = '#5a4326';
          c.fillRect(-5, -34, 10, 38);
          c.fillStyle = kind === 'palms' ? '#2f6b45' : '#356b4a';
          for (var f = 0; f < 7; f++) {
            var fa = f / 7 * U.TAU;
            c.save(); c.translate(0, -34); c.rotate(fa);
            c.beginPath(); c.ellipse(0, -16, 7, 20, 0, 0, U.TAU); c.fill();
            c.restore();
          }
          c.fillStyle = U.rgba('#9ee5b0', .25);
          c.beginPath(); c.arc(0, -34, 9, 0, U.TAU); c.fill();
          c.restore();
        });
      }
    } else if (kind === 'walls') {
      n = 5;
      for (i = 0; i < n; i++) {
        a = i / n * U.TAU + .25;
        x = Math.cos(a) * ringR; y = Math.sin(a) * ringR;
        (function (px, py, pa) {
          addObstacle(px, py, 30, function () {
            shadowBlob(px, py, 30);
            c.save(); c.translate(px, py); c.rotate(pa + Math.PI / 2);
            c.fillStyle = U.shade(pal.stone, -.55);
            c.fillRect(-34, -14, 68, 28);
            c.fillStyle = U.shade(pal.stone, -.34);
            c.fillRect(-34, -14, 68, 8);
            for (var q = 0; q < 4; q++) {
              c.fillStyle = U.shade(pal.stone, -.44);
              c.fillRect(-32 + q * 18, -22, 12, 10);
            }
            c.restore();
          });
        })(x, y, a);
      }
    }

    // خطوط زخرفية على الحافة
    c.save();
    c.strokeStyle = U.rgba(pal.accent, .12);
    c.lineWidth = 1.5;
    for (i = 0; i < 32; i++) {
      a = i / 32 * U.TAU;
      c.beginPath();
      c.moveTo(Math.cos(a) * (ARENA_R - 40), Math.sin(a) * (ARENA_R - 40));
      c.lineTo(Math.cos(a + .07) * (ARENA_R - 18), Math.sin(a + .07) * (ARENA_R - 18));
      c.stroke();
    }
    c.restore();
  }

  /* =========================================================
     رسم الأشخاص
     ========================================================= */
  function shadow(c, x, y, r, a) {
    c.fillStyle = 'rgba(0,0,0,' + (a === undefined ? .38 : a) + ')';
    c.beginPath();
    c.ellipse(x, y + r * .42, r * 1.05, r * .45, 0, 0, U.TAU);
    c.fill();
  }

  /**
   * رسم محارب بأسلوب موحّد.
   * o = {x,y,r,facing,walk,swing,cloth,trim,metal,skin,weapon,helm,hurt,scale,cape,shieldUp}
   */
  function warrior(c, o) {
    var r = o.r, f = o.facing || 0;
    var walk = o.walk || 0;
    var bob = Math.sin(walk * 2) * r * .07;
    var sway = Math.cos(walk) * r * .12;
    var hurt = o.hurt || 0;

    c.save();
    c.translate(o.x, o.y + bob);
    if (o.scale) c.scale(o.scale, o.scale);
    c.rotate(f + Math.PI / 2);          // نجعل المحور +Y هو اتجاه النظر

    var cloth = o.cloth, trim = o.trim, metal = o.metal || '#dcd8ce', skin = o.skin || '#c98f63';
    if (hurt > 0) {
      cloth = U.mixHex(cloth, '#ffffff', hurt * .85);
      trim = U.mixHex(trim, '#ffffff', hurt * .85);
      metal = U.mixHex(metal, '#ffffff', hurt * .85);
      skin = U.mixHex(skin, '#ffffff', hurt * .85);
    }

    // ---- عباءة خلفية ----
    if (o.cape) {
      c.fillStyle = U.shade(cloth, -.35);
      c.beginPath();
      c.moveTo(-r * .78, -r * .1);
      c.quadraticCurveTo(0, -r * 1.5 - Math.abs(sway) * 2, r * .78, -r * .1);
      c.quadraticCurveTo(0, r * .2, -r * .78, -r * .1);
      c.fill();
    }

    // ---- الساقان ----
    c.fillStyle = U.shade(cloth, -.45);
    c.beginPath(); c.ellipse(-r * .34, r * .18 + sway * .5, r * .25, r * .34, 0, 0, U.TAU); c.fill();
    c.beginPath(); c.ellipse(r * .34, r * .18 - sway * .5, r * .25, r * .34, 0, 0, U.TAU); c.fill();

    // ---- الكتفان (يعطيان الصورة الظلية وضوحاً من الأعلى) ----
    c.fillStyle = U.shade(cloth, -.22);
    c.strokeStyle = OUTLINE; c.lineWidth = Math.max(1.4, r * .1);
    c.beginPath(); c.ellipse(-r * .58, r * .12, r * .3, r * .34, -.3, 0, U.TAU); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(r * .58, r * .12, r * .3, r * .34, .3, 0, U.TAU); c.fill(); c.stroke();

    // ---- الجذع ----
    c.fillStyle = cloth;
    c.strokeStyle = OUTLINE; c.lineWidth = Math.max(1.5, r * .11);
    c.beginPath();
    c.ellipse(0, 0, r * .74, r * .86, 0, 0, U.TAU);
    c.fill(); c.stroke();
    // إضاءة علوية
    c.fillStyle = U.rgba('#ffffff', .10);
    c.beginPath();
    c.ellipse(-r * .18, -r * .26, r * .38, r * .42, -.35, 0, U.TAU);
    c.fill();

    // حزام / طراز
    c.fillStyle = trim;
    c.beginPath();
    c.ellipse(0, r * .2, r * .68, r * .17, 0, 0, U.TAU);
    c.fill();
    // خط الرداء
    c.strokeStyle = U.rgba(trim, .8); c.lineWidth = Math.max(1, r * .09);
    c.beginPath(); c.moveTo(0, -r * .55); c.lineTo(0, r * .2); c.stroke();

    // ---- الرأس ----
    var hy = r * .48;
    c.fillStyle = skin;
    c.strokeStyle = OUTLINE; c.lineWidth = Math.max(1.2, r * .085);
    c.beginPath(); c.arc(0, hy, r * .40, 0, U.TAU); c.fill(); c.stroke();

    // عمامة / خوذة
    if (o.helm === 'turban') {
      c.fillStyle = U.shade(cloth, .3);
      c.beginPath(); c.arc(0, hy + r * .07, r * .43, Math.PI * 1.02, Math.PI * 1.98); c.fill();
      c.fillStyle = trim;
      c.beginPath(); c.ellipse(0, hy + r * .1, r * .44, r * .16, 0, Math.PI, U.TAU); c.fill();
    } else if (o.helm === 'helmet') {
      c.fillStyle = metal;
      c.beginPath(); c.arc(0, hy + r * .06, r * .44, Math.PI * 1.0, Math.PI * 2.0); c.fill();
      c.fillStyle = U.shade(metal, -.3);
      c.fillRect(-r * .06, hy + r * .06, r * .12, r * .38);   // واقي الأنف
      c.fillStyle = trim;
      c.fillRect(-r * .44, hy + r * .02, r * .88, r * .1);
    } else if (o.helm === 'hood') {
      c.fillStyle = U.shade(cloth, -.15);
      c.beginPath(); c.arc(0, hy + r * .05, r * .46, Math.PI * .95, Math.PI * 2.05); c.fill();
      c.beginPath(); c.ellipse(0, hy + r * .1, r * .46, r * .3, 0, Math.PI * .1, Math.PI * .9); c.fill();
    } else if (o.helm === 'crown') {
      c.fillStyle = trim;
      c.beginPath();
      c.moveTo(-r * .44, hy + r * .06);
      for (var t = 0; t < 5; t++) {
        var tx = -r * .44 + (t + .5) * (r * .88 / 5);
        c.lineTo(tx - r * .06, hy + r * .06);
        c.lineTo(tx, hy + r * .5);
        c.lineTo(tx + r * .06, hy + r * .06);
      }
      c.lineTo(r * .44, hy + r * .06);
      c.closePath(); c.fill();
    }

    // ---- السلاح ----
    var sw = o.swing === undefined ? -1 : o.swing;   // 0..1 خلال الضربة
    drawWeapon(c, o, r, sw, metal, trim, cloth);

    c.restore();
  }

  function drawWeapon(c, o, r, sw, metal, trim, cloth) {
    var w = o.weapon || 'sword';
    var swinging = sw >= 0;
    // زاوية الذراع أثناء الضربة (من الخلف إلى الأمام)
    var t = swinging ? U.easeOutCubic(sw) : 0;
    var armA = swinging ? U.lerp(-1.25, 1.15, t) : -0.35 + Math.sin((o.walk || 0)) * .12;

    c.save();
    c.rotate(armA);

    if (w === 'sword') {
      // ذراع
      c.strokeStyle = o.skin || '#c98f63'; c.lineWidth = r * .22; c.lineCap = 'round';
      c.beginPath(); c.moveTo(0, r * .25); c.lineTo(0, r * .72); c.stroke();
      // مقبض
      c.strokeStyle = '#5a3a1e'; c.lineWidth = r * .16;
      c.beginPath(); c.moveTo(0, r * .68); c.lineTo(0, r * .92); c.stroke();
      // حاجز
      c.fillStyle = trim;
      c.fillRect(-r * .34, r * .88, r * .68, r * .12);
      // نصل منحنٍ قليلاً (سيف أندلسي)
      var bl = r * (swinging ? 2.0 : 1.75);
      c.fillStyle = cachedGrad(c, 'blade|' + metal + '|' + (r | 0) + '|' + (swinging ? 1 : 0), r, bl,
        [[0, U.shade(metal, -.2)], [.5, metal], [1, '#ffffff']]);
      c.beginPath();
      c.moveTo(-r * .13, r * .98);
      c.quadraticCurveTo(-r * .2, bl * .7, 0, bl);
      c.quadraticCurveTo(r * .2, bl * .7, r * .13, r * .98);
      c.closePath(); c.fill();
      c.strokeStyle = U.rgba('#ffffff', .5); c.lineWidth = 1;
      c.beginPath(); c.moveTo(0, r * 1.05); c.lineTo(0, bl * .92); c.stroke();
    } else if (w === 'daggers') {
      for (var s = -1; s <= 1; s += 2) {
        c.save();
        c.rotate(s * .5);
        c.strokeStyle = o.skin || '#c98f63'; c.lineWidth = r * .19; c.lineCap = 'round';
        c.beginPath(); c.moveTo(0, r * .2); c.lineTo(0, r * .62); c.stroke();
        c.fillStyle = trim; c.fillRect(-r * .2, r * .6, r * .4, r * .1);
        c.fillStyle = metal;
        c.beginPath();
        c.moveTo(-r * .11, r * .68); c.lineTo(0, r * 1.35); c.lineTo(r * .11, r * .68);
        c.closePath(); c.fill();
        c.restore();
      }
    } else if (w === 'bow') {
      var pull = swinging ? U.lerp(.35, 0, t) : .12;
      c.strokeStyle = '#6b4a26'; c.lineWidth = r * .13; c.lineCap = 'round';
      c.beginPath();
      c.arc(0, r * .95, r * .78, -Math.PI * .78, Math.PI * .78);
      c.stroke();
      c.strokeStyle = 'rgba(240,230,210,.9)'; c.lineWidth = Math.max(1, r * .05);
      var bx = Math.cos(-Math.PI * .78) * r * .78, by = r * .95 + Math.sin(-Math.PI * .78) * r * .78;
      var ex = Math.cos(Math.PI * .78) * r * .78, ey = r * .95 + Math.sin(Math.PI * .78) * r * .78;
      c.beginPath(); c.moveTo(bx, by);
      c.lineTo(0, r * .95 + r * .78 * (1 - pull * 2.2));
      c.lineTo(ex, ey); c.stroke();
      if (swinging) {
        c.strokeStyle = '#e8dcc3'; c.lineWidth = Math.max(1, r * .07);
        c.beginPath(); c.moveTo(0, r * .95 + r * .3); c.lineTo(0, r * 1.7); c.stroke();
      }
      c.strokeStyle = o.skin || '#c98f63'; c.lineWidth = r * .2;
      c.beginPath(); c.moveTo(0, r * .2); c.lineTo(0, r * .8); c.stroke();
    } else if (w === 'shield') {
      // درقة لمطية (بيضاوية) في اليد الأمامية
      c.save();
      c.rotate(-armA * .5);
      c.fillStyle = U.shade(cloth, -.2);
      c.strokeStyle = trim; c.lineWidth = Math.max(1.6, r * .1);
      c.beginPath();
      c.ellipse(-r * .55, r * .5, r * .42, r * .58, -.25, 0, U.TAU);
      c.fill(); c.stroke();
      c.fillStyle = trim;
      c.beginPath(); c.arc(-r * .55, r * .5, r * .13, 0, U.TAU); c.fill();
      c.restore();
      // دبّوس
      c.strokeStyle = o.skin || '#c98f63'; c.lineWidth = r * .22; c.lineCap = 'round';
      c.beginPath(); c.moveTo(r * .1, r * .25); c.lineTo(r * .22, r * .75); c.stroke();
      c.fillStyle = metal;
      c.beginPath();
      c.ellipse(r * .3, r * 1.12, r * .26, r * .38, .12, 0, U.TAU);
      c.fill();
      c.fillStyle = U.shade(metal, -.3);
      c.beginPath(); c.arc(r * .3, r * 1.12, r * .12, 0, U.TAU); c.fill();
    } else if (w === 'spear') {
      c.strokeStyle = '#6b4a26'; c.lineWidth = r * .13;
      c.beginPath(); c.moveTo(0, -r * .5); c.lineTo(0, r * 1.9); c.stroke();
      c.fillStyle = metal;
      c.beginPath();
      c.moveTo(-r * .14, r * 1.85); c.lineTo(0, r * 2.45); c.lineTo(r * .14, r * 1.85);
      c.closePath(); c.fill();
    } else if (w === 'axe') {
      c.strokeStyle = '#6b4a26'; c.lineWidth = r * .15;
      c.beginPath(); c.moveTo(0, r * .2); c.lineTo(0, r * 1.5); c.stroke();
      c.fillStyle = metal;
      c.beginPath();
      c.moveTo(0, r * 1.1);
      c.quadraticCurveTo(r * .75, r * 1.2, r * .55, r * 1.7);
      c.quadraticCurveTo(r * .2, r * 1.5, 0, r * 1.55);
      c.closePath(); c.fill();
    } else if (w === 'sling') {
      c.strokeStyle = '#7a6144'; c.lineWidth = Math.max(1, r * .06);
      c.beginPath(); c.moveTo(0, r * .3); c.lineTo(r * .5, r * 1.25); c.stroke();
      c.fillStyle = '#5b4530';
      c.beginPath(); c.ellipse(r * .55, r * 1.35, r * .2, r * .12, .5, 0, U.TAU); c.fill();
    } else if (w === 'torch') {
      c.strokeStyle = '#6b4a26'; c.lineWidth = r * .13;
      c.beginPath(); c.moveTo(0, r * .3); c.lineTo(r * .25, r * 1.25); c.stroke();
      c.fillStyle = '#ff9d3a';
      c.beginPath(); c.arc(r * .3, r * 1.4, r * .22, 0, U.TAU); c.fill();
      c.fillStyle = '#ffe08a';
      c.beginPath(); c.arc(r * .3, r * 1.42, r * .11, 0, U.TAU); c.fill();
    }
    c.restore();
  }

  /* =========================================================
     رسم كائنات اللعبة
     ========================================================= */
  var R = {
    ARENA_R: ARENA_R,
    buildArena: buildArena,
    warrior: warrior,
    shadow: shadow,
    star8: drawStar8,
    arch: horseshoeArch,

    drawArena: function (c, arena) {
      var half = arena.size / 2;
      c.drawImage(arena.canvas, -half, -half, arena.size, arena.size);
    },

    /** حلقة تحذير على الأرض (لهجمات الزعماء) */
    telegraph: function (c, x, y, r, k, color) {
      c.save();
      c.globalAlpha = .10 + k * .14;
      c.fillStyle = color || '#e0573f';
      c.beginPath(); c.arc(x, y, r, 0, U.TAU); c.fill();
      c.globalAlpha = .45 + k * .45;
      c.strokeStyle = color || '#e0573f';
      c.lineWidth = 2.5;
      c.beginPath(); c.arc(x, y, r, 0, U.TAU); c.stroke();
      c.globalAlpha = .22;
      c.beginPath(); c.arc(x, y, r * k, 0, U.TAU); c.fill();
      c.restore();
    },

    telegraphLine: function (c, x, y, ang, len, w, k, color) {
      c.save();
      c.translate(x, y); c.rotate(ang);
      c.globalAlpha = .07 + k * .13;
      c.fillStyle = color || '#e0573f';
      c.fillRect(0, -w / 2, len, w);
      c.globalAlpha = .30 + k * .3;
      c.strokeStyle = color || '#e0573f'; c.lineWidth = 2;
      c.beginPath();
      c.moveTo(0, -w / 2); c.lineTo(len, -w / 2);
      c.moveTo(0, w / 2); c.lineTo(len, w / 2);
      c.stroke();
      c.restore();
    },

    /** هالة رخيصة بديلة عن shadowBlur */
    glow: function (c, x, y, r, color, a) {
      c.save();
      c.globalCompositeOperation = 'lighter';
      c.globalAlpha = a === undefined ? 0.30 : a;
      c.fillStyle = color;
      c.beginPath(); c.arc(x, y, r, 0, U.TAU); c.fill();
      c.globalAlpha = (a === undefined ? 0.30 : a) * 0.75;
      c.beginPath(); c.arc(x, y, r * 0.6, 0, U.TAU); c.fill();
      c.restore();
    },

    projectile: function (c, p) {
      var col = p.color || '#f0e4c8';
      c.save();
      c.translate(p.x, p.y);
      if (p.kind === 'arrow') {
        R.glow(c, 0, 0, p.r * 3.2, col, 0.22);
        c.rotate(Math.atan2(p.vy, p.vx));
        c.fillStyle = col;
        c.beginPath();
        c.moveTo(p.r * 2.2, 0); c.lineTo(-p.r * 1.6, p.r * .62); c.lineTo(-p.r * .9, 0); c.lineTo(-p.r * 1.6, -p.r * .62);
        c.closePath(); c.fill();
        c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(-p.r * 2.6, 0); c.lineTo(-p.r * 1.2, 0); c.stroke();
      } else if (p.kind === 'stone') {
        c.fillStyle = p.color || '#8d7154';
        c.beginPath(); c.arc(0, 0, p.r, 0, U.TAU); c.fill();
        c.fillStyle = 'rgba(255,255,255,.18)';
        c.beginPath(); c.arc(-p.r * .3, -p.r * .3, p.r * .45, 0, U.TAU); c.fill();
      } else if (p.kind === 'fire') {
        R.glow(c, 0, 0, p.r * 3.4, '#ff8a3a', 0.4);
        c.fillStyle = '#ff8a3a';
        c.beginPath(); c.arc(0, 0, p.r, 0, U.TAU); c.fill();
        c.fillStyle = '#ffe08a';
        c.beginPath(); c.arc(0, 0, p.r * .5, 0, U.TAU); c.fill();
      } else {   // orb
        R.glow(c, 0, 0, p.r * 3, col, 0.4);
        c.fillStyle = col;
        c.beginPath(); c.arc(0, 0, p.r, 0, U.TAU); c.fill();
        c.fillStyle = 'rgba(255,255,255,.7)';
        c.beginPath(); c.arc(0, 0, p.r * .42, 0, U.TAU); c.fill();
      }
      c.restore();
    },

    pickup: function (c, p, time) {
      var bob = Math.sin(time * 4 + p.seed) * 3;
      c.save();
      c.translate(p.x, p.y + bob);
      shadow(c, 0, -bob + 4, 6, .25);
      if (p.kind === 'gold') {
        R.glow(c, 0, 0, 15, '#f6d489', 0.22);
        c.fillStyle = '#d8a445';
        c.beginPath(); c.ellipse(0, 0, 7, 7, 0, 0, U.TAU); c.fill();
        c.fillStyle = '#f6d489';
        c.beginPath(); c.ellipse(-1.6, -1.6, 3, 3, 0, 0, U.TAU); c.fill();
        c.strokeStyle = '#8a6321'; c.lineWidth = 1.2;
        c.beginPath(); c.arc(0, 0, 7, 0, U.TAU); c.stroke();
      } else if (p.kind === 'heal') {
        R.glow(c, 0, 0, 18, '#5fa86f', 0.3);
        c.fillStyle = '#5fa86f';
        c.beginPath();
        c.moveTo(0, 7);
        c.bezierCurveTo(-11, -1, -5, -9, 0, -3);
        c.bezierCurveTo(5, -9, 11, -1, 0, 7);
        c.fill();
      } else {  // ult orb
        R.glow(c, 0, 0, 18, '#7cc0e8', 0.32);
        drawStar8(c, 0, 0, 8, '#9ed3f2', '#ffffff');
      }
      c.restore();
    },

    /** رسم العصي الافتراضية على الشاشة */
    sticks: function (c, input, dpr) {
      var arr = [input.moveStick, input.aimStick];
      for (var i = 0; i < arr.length; i++) {
        var s = arr[i];
        if (!s.active) continue;
        var isAim = s.kind === 'aim';
        var col = isAim ? 'rgba(246,212,137,' : 'rgba(240,228,200,';
        c.save();
        c.globalAlpha = 1;
        c.strokeStyle = col + '0.28)';
        c.lineWidth = 2;
        c.beginPath(); c.arc(s.ox, s.oy, 60, 0, U.TAU); c.stroke();
        c.strokeStyle = col + '0.14)';
        c.lineWidth = 1;
        c.beginPath(); c.arc(s.ox, s.oy, 34, 0, U.TAU); c.stroke();
        var kx = s.ox + s.x * s.mag * 52, ky = s.oy + s.y * s.mag * 52;
        c.fillStyle = col + '0.35)';
        c.beginPath(); c.arc(kx, ky, 24, 0, U.TAU); c.fill();
        c.strokeStyle = col + '0.75)';
        c.lineWidth = 2;
        c.beginPath(); c.arc(kx, ky, 24, 0, U.TAU); c.stroke();
        if (isAim && s.mag > .1) {
          c.strokeStyle = 'rgba(246,212,137,0.45)';
          c.lineWidth = 2; c.setLineDash([5, 6]);
          c.beginPath(); c.moveTo(s.ox, s.oy); c.lineTo(kx, ky); c.stroke();
          c.setLineDash([]);
        }
        c.restore();
      }
    },

    /* ---------- رسومات الواجهة ---------- */
    portrait: function (canvas, hero, t) {
      if (!canvas) return;
      var c = canvas.getContext('2d');
      var w = canvas.width, h = canvas.height;
      c.clearRect(0, 0, w, h);
      var g = c.createRadialGradient(w / 2, h * .35, 4, w / 2, h / 2, w * .7);
      g.addColorStop(0, U.rgba(hero.colors.trim, .35));
      g.addColorStop(1, 'rgba(8,5,3,0.9)');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.save();
      c.translate(w / 2, h * .62);
      warrior(c, {
        x: 0, y: 0, r: w * .30, facing: -Math.PI / 2, walk: (t || 0) * 2,
        cloth: hero.colors.cloth, trim: hero.colors.trim, metal: hero.colors.metal, skin: hero.colors.skin,
        weapon: hero.weapon, helm: hero.id === 'ayyar' ? 'hood' : (hero.id === 'dariq' ? 'helmet' : 'turban'),
        cape: hero.id === 'faris'
      });
      c.restore();
    },

    crest: function (canvas, t) {
      if (!canvas) return;
      var c = canvas.getContext('2d');
      var w = canvas.width, h = canvas.height;
      c.clearRect(0, 0, w, h);
      c.save();
      c.translate(w / 2, h / 2);
      var pulse = 1 + Math.sin(t * 1.6) * .02;
      c.scale(pulse, pulse);
      c.rotate(Math.sin(t * .35) * .05);

      c.strokeStyle = 'rgba(216,164,69,.35)';
      c.lineWidth = 2;
      c.beginPath(); c.arc(0, 0, w * .44, 0, U.TAU); c.stroke();
      drawStar8(c, 0, 0, w * .40, 'rgba(216,164,69,.08)', 'rgba(246,212,137,.5)');
      drawStar8(c, 0, 0, w * .28, 'rgba(216,164,69,.10)', 'rgba(216,164,69,.4)');

      // سيفان متقاطعان
      for (var s = -1; s <= 1; s += 2) {
        c.save();
        c.rotate(s * Math.PI / 5);
        var grd = c.createLinearGradient(0, -w * .3, 0, w * .3);
        grd.addColorStop(0, '#fff6df'); grd.addColorStop(1, '#8a6321');
        c.fillStyle = grd;
        c.beginPath();
        c.moveTo(-w * .028, w * .1);
        c.quadraticCurveTo(-w * .04, -w * .2, 0, -w * .34);
        c.quadraticCurveTo(w * .04, -w * .2, w * .028, w * .1);
        c.closePath(); c.fill();
        c.fillStyle = '#d8a445';
        c.fillRect(-w * .09, w * .1, w * .18, w * .028);
        c.fillStyle = '#6b4a26';
        c.fillRect(-w * .022, w * .13, w * .044, w * .1);
        c.restore();
      }
      // عقد حدوة الفرس
      c.globalAlpha = .8;
      horseshoeArch(c, 0, w * .26, w * .3, w * .34, 'rgba(10,6,4,.0)', 'rgba(246,212,137,.55)', false);
      c.globalAlpha = 1;
      c.restore();
    },

    regionThumb: function (canvas, region, t) {
      if (!canvas) return;
      var c = canvas.getContext('2d');
      var w = canvas.width, h = canvas.height, pal = region.pal;
      var rng = U.mulberry32(U.hashStr(region.id));
      c.clearRect(0, 0, w, h);
      var sky = c.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, U.shade(pal.sky, .25));
      sky.addColorStop(.55, pal.sky);
      sky.addColorStop(1, pal.g2);
      c.fillStyle = sky; c.fillRect(0, 0, w, h);

      // قرص شمس/قمر
      c.fillStyle = U.rgba(pal.accent, .30);
      c.beginPath(); c.arc(w * .74, h * .28, h * .16, 0, U.TAU); c.fill();

      // تلال خلفية
      for (var L = 0; L < 3; L++) {
        c.fillStyle = U.rgba(U.shade(pal.stone, -.35 - L * .12), .55 + L * .15);
        c.beginPath();
        c.moveTo(0, h);
        var base = h * (.58 + L * .09);
        c.lineTo(0, base);
        for (var x = 0; x <= w; x += w / 7) {
          c.lineTo(x, base - (rng() * h * .16) - L * 2);
        }
        c.lineTo(w, h); c.closePath(); c.fill();
      }

      // معلم الإقليم
      c.save();
      c.translate(w * .30, h * .82);
      var s = h / 132;
      c.scale(s, s);
      var kind = region.props;
      c.fillStyle = U.shade(pal.stone, -.1);
      if (kind === 'arches' || kind === 'alhambra') {
        for (var i = 0; i < 3; i++) horseshoeArch(c, (i - 1) * 34, 0, 30, 46, U.shade(pal.stone, -.05), U.rgba(pal.accent, .6), true);
      } else if (kind === 'columns') {
        for (var j = 0; j < 3; j++) { c.fillRect((j - 1) * 26 - 6, -46, 12, 46); c.fillRect((j - 1) * 26 - 11, -52, 22, 7); }
      } else if (kind === 'walls') {
        c.fillRect(-46, -34, 92, 34);
        for (var k = 0; k < 6; k++) c.fillRect(-46 + k * 16, -44, 10, 12);
      } else if (kind === 'palms' || kind === 'garden') {
        c.fillStyle = '#5a4326'; c.fillRect(-4, -44, 8, 44);
        c.fillStyle = '#2f6b45';
        for (var f = 0; f < 6; f++) {
          c.save(); c.translate(0, -44); c.rotate(f / 6 * U.TAU);
          c.beginPath(); c.ellipse(0, -14, 6, 17, 0, 0, U.TAU); c.fill(); c.restore();
        }
      } else if (kind === 'peaks') {
        c.beginPath(); c.moveTo(-46, 0); c.lineTo(-12, -52); c.lineTo(14, -18); c.lineTo(30, -40); c.lineTo(52, 0);
        c.closePath(); c.fill();
        c.fillStyle = '#eaf2ff';
        c.beginPath(); c.moveTo(-22, -34); c.lineTo(-12, -52); c.lineTo(-2, -34); c.closePath(); c.fill();
      } else {
        c.beginPath(); c.moveTo(-40, 0); c.lineTo(-16, -50); c.lineTo(18, -30); c.lineTo(44, 0);
        c.closePath(); c.fill();
      }
      c.restore();

      // أرضية
      c.fillStyle = U.rgba(pal.g2, .9);
      c.fillRect(0, h * .82, w, h * .18);
      // ضباب
      var fog = c.createLinearGradient(0, h * .5, 0, h);
      fog.addColorStop(0, U.rgba(pal.fog, .0));
      fog.addColorStop(1, U.rgba(pal.fog, .16));
      c.fillStyle = fog; c.fillRect(0, h * .5, w, h * .5);
    }
  };

  MAL.R = R;
})(typeof window !== 'undefined' ? window : globalThis);
