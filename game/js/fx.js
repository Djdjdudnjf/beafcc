/* ============================================================
   fx.js — الجُسيمات، الأرقام الطائرة، اهتزاز الشاشة، توقّف الضربة
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U;

  var MAX_P = 900, MAX_T = 60, MAX_D = 90;

  function P() {
    this.on = false; this.x = 0; this.y = 0; this.vx = 0; this.vy = 0;
    this.life = 0; this.max = 1; this.size = 3; this.color = '#fff';
    this.type = 'spark'; this.drag = 0.9; this.grav = 0; this.rot = 0; this.spin = 0;
    this.r0 = 0; this.r1 = 0; this.lw = 2; this.alpha = 1; this.glow = false;
  }

  var pool = [], texts = [], decals = [];
  for (var i = 0; i < MAX_P; i++) pool.push(new P());
  var head = 0;

  function alloc() {
    for (var n = 0; n < MAX_P; n++) {
      var p = pool[head];
      head = (head + 1) % MAX_P;
      if (!p.on) return p;
    }
    var q = pool[head]; head = (head + 1) % MAX_P; return q;   // إعادة استخدام الأقدم
  }

  /** رسم شرارة واحدة (تُستدعى في مرورَي الرسم) */
  function drawSpark(ctx, p, k) {
    ctx.globalAlpha = Math.min(1, k * 1.6);
    ctx.fillStyle = p.color;
    var sp = Math.hypot(p.vx, p.vy);
    if (sp > 110) {              // شرارة ممدودة باتجاه الحركة
      var ang = Math.atan2(p.vy, p.vx);
      var ln = Math.min(16, sp * 0.035);
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(ang);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * (0.5 + k) + ln * 0.5, p.size * 0.5 * (0.4 + k * 0.7), 0, 0, U.TAU);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.35 + k * 0.85), 0, U.TAU);
      ctx.fill();
    }
  }

  var FX = {
    shakeAmt: 0, shakeX: 0, shakeY: 0,
    hitstopT: 0, slowT: 0, slowScale: 1,
    flashA: 0, flashColor: '#fff', flashDur: 0.2, flashT: 0,
    quality: 1,          // 1 = كامل، 0.5 = مخفّف

    reset: function () {
      for (var i = 0; i < pool.length; i++) pool[i].on = false;
      texts.length = 0; decals.length = 0;
      this.shakeAmt = 0; this.hitstopT = 0; this.slowT = 0; this.slowScale = 1;
      this.flashA = 0; this.flashT = 0;
    },

    /** معامل الزمن الحالي (0 أثناء توقف الضربة) */
    timeScale: function () {
      if (this.hitstopT > 0) return 0;
      return this.slowT > 0 ? this.slowScale : 1;
    },

    // ---------------- المولّدات ----------------
    spark: function (x, y, o) {
      if (this.quality < 1 && Math.random() > this.quality) return;
      var p = alloc();
      p.on = true; p.type = 'spark';
      p.x = x; p.y = y;
      var a = o.a === undefined ? U.rand(0, U.TAU) : o.a;
      var s = o.speed === undefined ? U.rand(60, 260) : o.speed;
      p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
      p.life = p.max = o.life || U.rand(0.24, 0.5);
      p.size = o.size || U.rand(1.6, 3.4);
      p.color = o.color || '#ffd88a';
      p.drag = o.drag === undefined ? 0.86 : o.drag;
      p.grav = o.grav || 0;
      p.glow = o.glow !== false;
      p.alpha = 1;
      return p;
    },

    burst: function (x, y, n, color, o) {
      o = o || {};
      n = Math.round(n * (this.quality < 1 ? 0.55 : 1));
      for (var i = 0; i < n; i++) {
        this.spark(x, y, {
          a: (o.a === undefined ? U.rand(0, U.TAU) : o.a + U.rand(-(o.spread || 0.7), (o.spread || 0.7))),
          speed: U.rand(o.min || 70, o.max || 300),
          life: U.rand(0.2, o.life || 0.5),
          size: U.rand(1.4, o.size || 3.6),
          color: color, drag: o.drag, grav: o.grav, glow: o.glow
        });
      }
    },

    blood: function (x, y, dir, n, color) {
      color = color || '#a8372c';
      n = Math.round((n || 8) * (this.quality < 1 ? 0.5 : 1));
      for (var i = 0; i < n; i++) {
        var p = alloc();
        p.on = true; p.type = 'blood';
        p.x = x; p.y = y;
        var a = (dir === undefined ? U.rand(0, U.TAU) : dir + U.rand(-0.85, 0.85));
        var s = U.rand(90, 340);
        p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
        p.life = p.max = U.rand(0.35, 0.75);
        p.size = U.rand(1.8, 4.2);
        p.color = color; p.drag = 0.9; p.grav = 260; p.glow = false; p.alpha = 1;
      }
    },

    dust: function (x, y, n, color) {
      n = Math.round((n || 5) * (this.quality < 1 ? 0.5 : 1));
      for (var i = 0; i < n; i++) {
        var p = alloc();
        p.on = true; p.type = 'smoke';
        p.x = x + U.rand(-6, 6); p.y = y + U.rand(-4, 4);
        var a = U.rand(0, U.TAU), s = U.rand(10, 60);
        p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s - 12;
        p.life = p.max = U.rand(0.4, 0.95);
        p.size = U.rand(5, 13);
        p.color = color || 'rgba(210,185,145,0.42)';
        p.drag = 0.93; p.grav = -14; p.glow = false; p.alpha = 1;
      }
    },

    smoke: function (x, y, n, color) {
      n = Math.round((n || 4) * (this.quality < 1 ? 0.5 : 1));
      for (var i = 0; i < n; i++) {
        var p = alloc();
        p.on = true; p.type = 'smoke';
        p.x = x + U.rand(-5, 5); p.y = y + U.rand(-5, 5);
        p.vx = U.rand(-24, 24); p.vy = U.rand(-56, -18);
        p.life = p.max = U.rand(0.6, 1.3);
        p.size = U.rand(7, 17);
        p.color = color || 'rgba(60,52,44,0.5)';
        p.drag = 0.95; p.grav = -22; p.glow = false; p.alpha = 1;
      }
    },

    ring: function (x, y, o) {
      var p = alloc();
      p.on = true; p.type = 'ring';
      p.x = x; p.y = y; p.vx = 0; p.vy = 0;
      p.r0 = o.r0 === undefined ? 4 : o.r0;
      p.r1 = o.r1 === undefined ? 60 : o.r1;
      p.life = p.max = o.life || 0.4;
      p.color = o.color || '#ffe9b6';
      p.lw = o.width || 3;
      p.glow = o.glow !== false;
      p.alpha = o.alpha === undefined ? 1 : o.alpha;
      p.spin = o.fill ? 1 : 0;    // نعيد استخدام spin كعلم للتعبئة
      return p;
    },

    slash: function (x, y, angle, radius, arc, color, life) {
      var p = alloc();
      p.on = true; p.type = 'slash';
      p.x = x; p.y = y; p.rot = angle; p.r0 = radius; p.r1 = arc;
      p.life = p.max = life || 0.2;
      p.color = color || 'rgba(255,240,210,0.85)';
      p.lw = 0; p.glow = true; p.alpha = 1;
      return p;
    },

    shard: function (x, y, color, n) {
      n = n || 6;
      for (var i = 0; i < n; i++) {
        var p = alloc();
        p.on = true; p.type = 'shard';
        p.x = x; p.y = y;
        var a = U.rand(0, U.TAU), s = U.rand(80, 250);
        p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
        p.life = p.max = U.rand(0.4, 0.8);
        p.size = U.rand(3, 7);
        p.color = color; p.drag = 0.9; p.grav = 320;
        p.rot = U.rand(0, U.TAU); p.spin = U.rand(-14, 14); p.glow = false; p.alpha = 1;
      }
    },

    decal: function (x, y, r, color) {
      if (this.quality < 1) return;
      decals.push({ x: x, y: y, r: r, color: color, a: 0.5, t: 0 });
      if (decals.length > MAX_D) decals.shift();
    },

    text: function (x, y, str, o) {
      o = o || {};
      if (texts.length >= MAX_T) texts.shift();
      texts.push({
        x: x, y: y, vy: o.vy === undefined ? -58 : o.vy, vx: o.vx || U.rand(-16, 16),
        t: 0, life: o.life || 0.85, s: str,
        color: o.color || '#fff2d4', size: o.size || 15,
        crit: !!o.crit, bold: o.bold !== false
      });
    },

    shake: function (m) { this.shakeAmt = Math.min(34, this.shakeAmt + m); },
    hitstop: function (t) { this.hitstopT = Math.max(this.hitstopT, t); },
    slow: function (scale, dur) { this.slowScale = scale; this.slowT = Math.max(this.slowT, dur); },
    flash: function (color, a, dur) {
      this.flashColor = color || '#fff';
      this.flashA = Math.max(this.flashA, a === undefined ? 0.4 : a);
      this.flashDur = dur || 0.22; this.flashT = this.flashDur;
    },

    // ---------------- التحديث ----------------
    update: function (dt, rdt) {
      var i, p;
      // توقّف الضربة والبطء يعملان بالزمن الحقيقي
      if (this.hitstopT > 0) this.hitstopT -= rdt;
      if (this.slowT > 0) { this.slowT -= rdt; if (this.slowT <= 0) this.slowScale = 1; }

      for (i = 0; i < MAX_P; i++) {
        p = pool[i];
        if (!p.on) continue;
        p.life -= dt;
        if (p.life <= 0) { p.on = false; continue; }
        if (p.type === 'ring' || p.type === 'slash') continue;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vy += p.grav * dt;
        var d = Math.pow(p.drag, dt * 60);
        p.vx *= d; p.vy *= d;
        if (p.spin) p.rot += p.spin * dt;
      }

      for (i = texts.length - 1; i >= 0; i--) {
        var t = texts[i];
        t.t += dt;
        if (t.t >= t.life) { texts.splice(i, 1); continue; }
        t.x += t.vx * dt;
        t.y += t.vy * dt;
        t.vy += 120 * dt;
        t.vx *= 0.94;
      }

      for (i = decals.length - 1; i >= 0; i--) {
        decals[i].t += dt;
        if (decals[i].t > 9) { decals[i].a -= dt * 0.35; if (decals[i].a <= 0) decals.splice(i, 1); }
      }

      // الاهتزاز
      if (this.shakeAmt > 0) {
        this.shakeAmt = Math.max(0, this.shakeAmt - rdt * 46);
        var a = U.rand(0, U.TAU), m = this.shakeAmt;
        this.shakeX = Math.cos(a) * m; this.shakeY = Math.sin(a) * m;
      } else { this.shakeX = 0; this.shakeY = 0; }

      if (this.flashT > 0) {
        this.flashT -= rdt;
        this.flashA = Math.max(0, this.flashA * (this.flashT / this.flashDur));
        if (this.flashT <= 0) this.flashA = 0;
      }
    },

    // ---------------- الرسم ----------------
    drawDecals: function (ctx) {
      for (var i = 0; i < decals.length; i++) {
        var d = decals[i];
        ctx.globalAlpha = Math.max(0, d.a);
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r, d.r * 0.55, 0, 0, U.TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },

    draw: function (ctx) {
      var i, p, k;
      ctx.save();
      // ---- المرور الأول: كل ما لا يتوهج ----
      for (i = 0; i < MAX_P; i++) {
        p = pool[i];
        if (!p.on) continue;
        k = p.life / p.max;

        if (p.type === 'ring') {
          var rr = U.lerp(p.r0, p.r1, U.easeOutCubic(1 - k));
          ctx.globalAlpha = k * p.alpha;
          if (p.spin) {
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, U.TAU); ctx.fill();
          } else {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.lw * k;
            ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, U.TAU); ctx.stroke();
          }
          continue;
        }

        if (p.type === 'slash') {
          ctx.globalAlpha = k * 0.9;
          ctx.strokeStyle = p.color;
          ctx.lineCap = 'round';
          var grow = U.lerp(0.72, 1.06, 1 - k);
          ctx.lineWidth = 7 * k + 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r0 * grow, p.rot - p.r1 / 2, p.rot + p.r1 / 2);
          ctx.stroke();
          continue;
        }

        if (p.type === 'shard') {
          ctx.globalAlpha = Math.min(1, k * 1.5);
          ctx.fillStyle = p.color;
          ctx.save();
          ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
          continue;
        }

        if (p.type === 'smoke') {
          ctx.globalAlpha = k * 0.6;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1.6 - k * 0.6), 0, U.TAU);
          ctx.fill();
          continue;
        }

        if (p.glow) continue;              // يُرسم في المرور الثاني
        drawSpark(ctx, p, k);
      }

      // ---- المرور الثاني: الشرر المتوهج بدمج إضافي (أسرع بكثير من shadowBlur) ----
      ctx.globalCompositeOperation = 'lighter';
      for (i = 0; i < MAX_P; i++) {
        p = pool[i];
        if (!p.on || !p.glow) continue;
        if (p.type === 'ring' || p.type === 'slash' || p.type === 'shard' || p.type === 'smoke') continue;
        drawSpark(ctx, p, p.life / p.max);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();
      ctx.globalAlpha = 1;
    },

    drawText: function (ctx) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (var i = 0; i < texts.length; i++) {
        var t = texts[i], k = 1 - t.t / t.life;
        var pop = t.t < 0.1 ? U.lerp(1.5, 1, t.t / 0.1) : 1;
        ctx.globalAlpha = Math.min(1, k * 2.2);
        var size = t.size * pop * (t.crit ? 1.35 : 1);
        ctx.font = '900 ' + size.toFixed(1) + 'px Cairo, system-ui, sans-serif';
        ctx.lineWidth = Math.max(2, size * 0.22);
        ctx.strokeStyle = 'rgba(10,6,4,0.85)';
        ctx.lineJoin = 'round';
        ctx.strokeText(t.s, t.x, t.y);
        ctx.fillStyle = t.color;
        ctx.fillText(t.s, t.x, t.y);
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    },

    drawFlash: function (ctx, w, h) {
      if (this.flashA <= 0.002) return;
      ctx.save();
      ctx.globalAlpha = this.flashA;
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
      ctx.globalAlpha = 1;
    },

    count: function () {
      var n = 0;
      for (var i = 0; i < MAX_P; i++) if (pool[i].on) n++;
      return n;
    }
  };

  MAL.FX = FX;
})(typeof window !== 'undefined' ? window : globalThis);
