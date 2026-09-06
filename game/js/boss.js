/* ============================================================
   boss.js — الزعماء وأنماط هجومهم
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U, FX = MAL.FX, R = MAL.R, A = MAL.Audio;

  function Boss(cfg, game, scale) {
    this.kind = 'boss';
    this.cfg = cfg;
    this.name = cfg.name;
    this.title = cfg.title;
    this.x = 0; this.y = -300;
    this.vx = 0; this.vy = 0;
    this.knockX = 0; this.knockY = 0;
    this.r = cfg.r;
    this.maxHp = Math.round(cfg.hp * (scale || 1));
    this.hp = this.maxHp;
    this.speed = cfg.speed;
    this.dmg = cfg.dmg;
    this.color = cfg.color;
    this.facing = Math.PI / 2;
    this.walk = 0;
    this.swing = -1; this.swingT = 0;
    this.hurtT = 0;
    this.dead = false; this.remove = false;
    this.stunT = 0; this.slowT = 0;
    this.poisonT = 0; this.poisonDps = 0;
    this.phase = 1;
    this.state = 'intro';
    this.stateT = 1.9;
    this.pat = null; this.patT = 0; this.patStep = 0; this.patData = {};
    this.patCd = 1.6;
    this.contactCd = 0;
    this.patterns = cfg.patterns.slice();
    this.patIdx = 0;
    this.game = game;
    this.pal = game.region.pal;
    this.enraged = false;
    this.buffed = 0;
    this.spawnT = 0;
    this.telegraphs = [];   // {type,x,y,r,ang,len,w,t,max,color}
  }

  Boss.prototype.tg = function (o) {
    o.t = 0; o.max = o.max || 0.6;
    this.telegraphs.push(o);
    return o;
  };

  Boss.prototype.hurt = function (n, o, game) {
    if (this.dead) return 0;
    o = o || {};
    var dmg = Math.max(1, n * (this.state === 'intro' ? 0.15 : 1));
    this.hp -= dmg;
    this.hurtT = 0.14;
    if (o.knock) { this.knockX += Math.cos(o.ang || 0) * o.knock * 0.12; this.knockY += Math.sin(o.ang || 0) * o.knock * 0.12; }
    if (!o.noText) {
      FX.text(this.x + U.rand(-10, 10), this.y - this.r - 8, U.ar(dmg), {
        color: o.crit ? '#ffd166' : '#fff2d4', size: o.crit ? 20 : 16, crit: o.crit
      });
    }
    FX.blood(this.x, this.y, o.ang, o.crit ? 8 : 4, this.color);

    if (this.phase === 1 && this.hp <= this.maxHp * 0.5) this.enterPhase2();
    if (this.hp <= 0) this.die(game);
    return dmg;
  };

  Boss.prototype.enterPhase2 = function () {
    this.phase = 2;
    this.enraged = true;
    this.speed *= 1.22;
    this.patCd *= 0.66;
    this.state = 'roar'; this.stateT = 1.1;
    this.pat = null;
    FX.flash('#e0573f', 0.4, 0.5);
    FX.shake(18);
    FX.ring(this.x, this.y, { r0: 20, r1: 340, color: '#e0573f', life: 0.8, width: 10 });
    FX.text(this.x, this.y - this.r - 30, 'غَضِب!', { color: '#ff8f7a', size: 26 });
    A.play('boss');
  };

  Boss.prototype.die = function (game) {
    if (this.dead) return;
    this.dead = true;
    this.hp = 0;
    FX.slow(0.25, 1.5);
    FX.flash('#fff', 0.6, 0.6);
    FX.shake(26);
    for (var i = 0; i < 5; i++) {
      (function (self, k) {
        setTimeout(function () {
          FX.burst(self.x + U.rand(-40, 40), self.y + U.rand(-40, 40), 18, self.color, { min: 90, max: 420 });
          FX.ring(self.x, self.y, { r0: 10, r1: 130 + k * 40, color: '#ffe9b6', life: 0.5, width: 6 });
          A.play('explode');
        }, k * 130);
      })(this, i);
    }
    game.onBossKilled(this);
  };

  Boss.prototype.nextPattern = function () {
    var list = this.patterns;
    this.patIdx = (this.patIdx + 1 + (Math.random() < 0.35 ? 1 : 0)) % list.length;
    this.startPattern(list[this.patIdx]);
  };

  Boss.prototype.startPattern = function (name) {
    this.pat = name; this.patT = 0; this.patStep = 0; this.patData = {};
    this.state = 'pattern';
  };

  Boss.prototype.update = function (dt, game) {
    var p = game.player;
    this.hurtT = Math.max(0, this.hurtT - dt);
    this.stunT = Math.max(0, this.stunT - dt);
    this.slowT = Math.max(0, this.slowT - dt);
    this.contactCd = Math.max(0, this.contactCd - dt);

    if (this.poisonT > 0) {
      this.poisonT -= dt;
      this.hp -= this.poisonDps * dt;
      if (this.hp <= 0) { this.die(game); return; }
    }

    // تحديث دوائر التحذير
    for (var i = this.telegraphs.length - 1; i >= 0; i--) {
      var t = this.telegraphs[i];
      t.t += dt;
      if (t.t >= t.max) this.telegraphs.splice(i, 1);
    }

    var angToP = U.angleTo(this.x, this.y, p.x, p.y);
    var dToP = U.dist(this.x, this.y, p.x, p.y);
    var mvx = 0, mvy = 0;

    if (this.state === 'intro') {
      this.stateT -= dt;
      this.y = U.damp(this.y, -120, 3, dt);
      this.facing = Math.PI / 2;
      if (this.stateT <= 0) { this.state = 'idle'; this.stateT = 1.0; }
    } else if (this.state === 'roar') {
      this.stateT -= dt;
      if (Math.random() < dt * 30) {
        FX.spark(this.x + U.rand(-30, 30), this.y + U.rand(-30, 30),
          { a: -Math.PI / 2, speed: U.rand(60, 200), color: '#ff8f7a', life: 0.5 });
      }
      if (this.stateT <= 0) { this.state = 'idle'; this.stateT = 0.5; }
    } else if (this.state === 'idle') {
      this.stateT -= dt;
      this.facing = U.angApproach(this.facing, angToP, dt * 4);
      if (dToP > 150) { mvx = Math.cos(angToP); mvy = Math.sin(angToP); }
      else if (dToP < 90) { mvx = -Math.cos(angToP) * 0.6; mvy = -Math.sin(angToP) * 0.6; }
      else {
        mvx = Math.cos(angToP + Math.PI / 2) * 0.6;
        mvy = Math.sin(angToP + Math.PI / 2) * 0.6;
      }
      if (this.stateT <= 0) this.nextPattern();
    } else if (this.state === 'pattern') {
      var res = this.updatePattern(dt, game, angToP, dToP);
      mvx = res.mvx; mvy = res.mvy;
    }

    // ---- الحركة ----
    var spd = this.speed * (this.slowT > 0 ? 0.55 : 1) * (this.stunT > 0 ? 0 : 1);
    this.vx = U.damp(this.vx, mvx * spd, 9, dt);
    this.vy = U.damp(this.vy, mvy * spd, 9, dt);
    this.x += (this.vx + this.knockX) * dt;
    this.y += (this.vy + this.knockY) * dt;
    this.knockX *= Math.pow(0.002, dt); this.knockY *= Math.pow(0.002, dt);
    if (Math.abs(mvx) + Math.abs(mvy) > 0.05) this.walk += dt * 7;

    MAL.helpers.clampArena(this, game.arenaR);

    // ضرر التلامس
    if (this.state !== 'intro' && this.contactCd <= 0 && dToP < this.r + p.r + 2) {
      p.takeDamage(this.dmg * 0.45, this.x, this.y);
      MAL.helpers.applyKnock(p, angToP, 320);
      this.contactCd = 0.8;
    }

    if (this.swing >= 0) {
      this.swingT += dt;
      this.swing = this.swingT / 0.3;
      if (this.swing >= 1) { this.swing = -1; this.swingT = 0; }
    }
  };

  /* =========================================================
     أنماط الهجوم
     ========================================================= */
  Boss.prototype.updatePattern = function (dt, game, angToP, dToP) {
    var p = game.player, d = this.patData, out = { mvx: 0, mvy: 0 };
    this.patT += dt;
    var self = this;

    function done() { self.state = 'idle'; self.stateT = self.patCd; self.pat = null; }

    switch (this.pat) {

      // ---------- ضربة أرضية بموجات ----------
      case 'slam': {
        if (d.step === undefined) { d.step = 0; d.t = 0; d.count = this.phase === 2 ? 3 : 2; }
        d.t -= dt;
        if (d.phase === undefined) d.phase = 'aim';
        if (d.phase === 'aim') {
          if (!d.marked) {
            d.tx = p.x; d.ty = p.y;
            d.marked = this.tg({ type: 'circle', x: p.x, y: p.y, r: 150, max: 0.85, color: '#e0573f' });
            d.t = 0.85;
          }
          this.facing = U.angApproach(this.facing, U.angleTo(this.x, this.y, d.tx, d.ty), dt * 5);
          var a2 = U.angleTo(this.x, this.y, d.tx, d.ty);
          if (U.dist(this.x, this.y, d.tx, d.ty) > 60) { out.mvx = Math.cos(a2) * 1.3; out.mvy = Math.sin(a2) * 1.3; }
          if (d.t <= 0) {
            d.phase = 'hit'; d.t = 0.25; d.marked = null;
            this.swing = 0; this.swingT = 0;
            game.areaDamage(d.tx, d.ty, 150, this.dmg, { knock: 620, targetPlayer: true, enemySource: this });
            FX.ring(d.tx, d.ty, { r0: 16, r1: 158, color: '#ffb066', life: 0.45, width: 9 });
            FX.ring(d.tx, d.ty, { r0: 16, r1: 210, color: 'rgba(255,255,255,.5)', life: 0.6, width: 4 });
            FX.dust(d.tx, d.ty, 14);
            FX.shake(15);
            A.play('explode');
          }
        } else {
          if (d.t <= 0) {
            d.step++;
            if (d.step >= d.count) { done(); }
            else { d.phase = 'aim'; d.marked = null; }
          }
        }
        break;
      }

      // ---------- اندفاع مستقيم ----------
      case 'charge': {
        if (d.step === undefined) { d.step = 0; d.phase = 'aim'; d.t = 0.7; d.count = this.phase === 2 ? 4 : 3; }
        d.t -= dt;
        if (d.phase === 'aim') {
          this.facing = U.angApproach(this.facing, angToP, dt * 4);
          if (!d.line) d.line = this.tg({ type: 'line', x: this.x, y: this.y, ang: this.facing, len: 900, w: 66, max: 0.7, color: '#e0573f' });
          d.line.x = this.x; d.line.y = this.y; d.line.ang = this.facing;
          if (d.t <= 0) {
            d.phase = 'go'; d.t = 0.85; d.dir = this.facing; d.line = null;
            A.play('dash'); FX.dust(this.x, this.y, 10);
          }
        } else if (d.phase === 'go') {
          out.mvx = Math.cos(d.dir) * 3.4; out.mvy = Math.sin(d.dir) * 3.4;
          if (Math.random() < dt * 40) FX.dust(this.x, this.y, 1);
          if (dToP < this.r + p.r + 6 && this.contactCd <= 0) {
            p.takeDamage(this.dmg * 1.1, this.x, this.y);
            MAL.helpers.applyKnock(p, angToP, 520);
            this.contactCd = 0.7;
            FX.shake(14);
          }
          if (Math.hypot(this.x, this.y) > game.arenaR - this.r - 14) {
            d.t = 0;
            FX.shake(12); FX.dust(this.x, this.y, 12); A.play('explode');
            game.areaDamage(this.x, this.y, 120, this.dmg * 0.6, { knock: 400, targetPlayer: true, enemySource: this });
            FX.ring(this.x, this.y, { r0: 10, r1: 130, color: '#ffb066', life: 0.4, width: 6 });
          }
          if (d.t <= 0) { d.phase = 'rest'; d.t = 0.55; }
        } else {
          if (d.t <= 0) {
            d.step++;
            if (d.step >= d.count) done();
            else { d.phase = 'aim'; d.t = 0.6; d.line = null; }
          }
        }
        break;
      }

      // ---------- استدعاء أتباع ----------
      case 'summon': {
        if (d.done === undefined) {
          d.done = true;
          var n = 3 + (this.phase === 2 ? 2 : 0);
          for (var i = 0; i < n; i++) {
            var a = (i / n) * U.TAU + U.rand(-.3, .3);
            var rr = 130 + Math.random() * 90;
            game.spawnMinion(this.x + Math.cos(a) * rr, this.y + Math.sin(a) * rr);
          }
          FX.ring(this.x, this.y, { r0: 20, r1: 250, color: this.color, life: 0.6, width: 7 });
          FX.shake(9);
          A.play('boss');
          this.swing = 0; this.swingT = 0;
          d.t = 1.1;
        }
        d.t -= dt;
        if (d.t <= 0) done();
        break;
      }

      // ---------- رشقات دائرية ----------
      case 'radial': {
        if (d.step === undefined) { d.step = 0; d.t = 0.45; d.count = this.phase === 2 ? 5 : 3; d.off = 0; }
        d.t -= dt;
        this.facing = U.angApproach(this.facing, angToP, dt * 3);
        if (d.t <= 0) {
          d.t = 0.42;
          var num = this.phase === 2 ? 14 : 11;
          d.off += 0.22;
          for (var k = 0; k < num; k++) {
            var aa = (k / num) * U.TAU + d.off;
            game.spawnProjectile({
              x: this.x + Math.cos(aa) * (this.r + 8), y: this.y + Math.sin(aa) * (this.r + 8),
              ang: aa, speed: 235, dmg: this.dmg * 0.55, team: 'enemy',
              kind: 'orb', r: 7, life: 4, color: this.color
            });
          }
          FX.ring(this.x, this.y, { r0: this.r, r1: this.r + 40, color: this.color, life: 0.3, width: 4 });
          A.play('swing', 1);
          d.step++;
          if (d.step >= d.count) done();
        }
        break;
      }

      // ---------- ثلاث كرّات سريعة ----------
      case 'dashCombo': {
        if (d.step === undefined) { d.step = 0; d.phase = 'aim'; d.t = 0.42; d.count = this.phase === 2 ? 4 : 3; }
        d.t -= dt;
        if (d.phase === 'aim') {
          this.facing = U.angApproach(this.facing, angToP, dt * 9);
          if (d.t <= 0) { d.phase = 'go'; d.t = 0.22; d.dir = angToP; A.play('dash'); }
        } else if (d.phase === 'go') {
          out.mvx = Math.cos(d.dir) * 4.2; out.mvy = Math.sin(d.dir) * 4.2;
          FX.spark(this.x, this.y, { a: d.dir + Math.PI, speed: 90, color: this.color, life: 0.3, size: 4 });
          if (d.t <= 0) {
            d.phase = 'slash'; d.t = 0.2;
            this.swing = 0; this.swingT = 0;
            game.areaDamageArc(this.x, this.y, this.facing, 130, 1.4, this.dmg * 0.9, this);
            FX.slash(this.x, this.y, this.facing, 120, 2.6, 'rgba(255,200,170,0.9)', 0.22);
            A.play('swing', 1); FX.shake(7);
          }
        } else {
          if (d.t <= 0) {
            d.step++;
            if (d.step >= d.count) done();
            else { d.phase = 'aim'; d.t = 0.32; }
          }
        }
        break;
      }

      // ---------- جدار الرماح ----------
      case 'spearWall': {
        if (d.step === undefined) { d.step = 0; d.t = 0.1; d.count = 3; }
        d.t -= dt;
        if (d.t <= 0) {
          if (d.step < d.count) {
            var base = U.rand(0, U.TAU);
            for (var w = 0; w < 6; w++) {
              var wa = base + (w / 6) * U.TAU;
              (function (self2, wa2) {
                self2.tg({ type: 'line', x: 0, y: 0, ang: wa2, len: game.arenaR, w: 44, max: 0.75, color: '#3fb08f' });
                setTimeout(function () {
                  if (self2.dead || !game.running) return;
                  game.lineDamage(0, 0, wa2, game.arenaR, 44, self2.dmg * 0.8, self2);
                  FX.ring(Math.cos(wa2) * game.arenaR * .5, Math.sin(wa2) * game.arenaR * .5,
                    { r0: 10, r1: 60, color: '#3fb08f', life: 0.3, width: 4 });
                }, 760);
              })(this, wa);
            }
            A.play('swing', 1);
            d.step++; d.t = 1.15;
          } else done();
        }
        break;
      }

      // ---------- رشقات موجهة ----------
      case 'volley': {
        if (d.step === undefined) { d.step = 0; d.t = 0.4; d.count = this.phase === 2 ? 6 : 4; }
        d.t -= dt;
        this.facing = U.angApproach(this.facing, angToP, dt * 7);
        var kd = U.dist(this.x, this.y, p.x, p.y);
        if (kd < 260) { out.mvx = -Math.cos(angToP) * 0.8; out.mvy = -Math.sin(angToP) * 0.8; }
        if (d.t <= 0) {
          d.t = 0.34;
          for (var v = -2; v <= 2; v++) {
            game.spawnProjectile({
              x: this.x + Math.cos(this.facing) * (this.r + 6), y: this.y + Math.sin(this.facing) * (this.r + 6),
              ang: this.facing + v * 0.14, speed: 470, dmg: this.dmg * 0.5, team: 'enemy',
              kind: 'arrow', r: 5, life: 3, color: '#e8c7a0'
            });
          }
          A.play('bow');
          d.step++;
          if (d.step >= d.count) done();
        }
        break;
      }

      // ---------- ألغام ----------
      case 'mines': {
        if (d.step === undefined) { d.step = 0; d.t = 0.15; d.count = 8; }
        d.t -= dt;
        out.mvx = Math.cos(angToP + Math.PI / 2) * 1.1;
        out.mvy = Math.sin(angToP + Math.PI / 2) * 1.1;
        if (d.t <= 0) {
          if (d.step < d.count) {
            var ma = U.rand(0, U.TAU), md = U.rand(60, game.arenaR * 0.78);
            var mx = p.x * 0.4 + Math.cos(ma) * md, my = p.y * 0.4 + Math.sin(ma) * md;
            game.spawnMine(mx, my, this.dmg * 0.8, this);
            d.step++; d.t = 0.16;
          } else done();
        }
        break;
      }

      // ---------- انهيار الأعمدة ----------
      case 'pillars': {
        if (d.step === undefined) { d.step = 0; d.t = 0.2; d.count = this.phase === 2 ? 16 : 11; }
        d.t -= dt;
        if (d.t <= 0) {
          if (d.step < d.count) {
            var pa = U.rand(0, U.TAU), pd2 = Math.sqrt(Math.random()) * game.arenaR * 0.85;
            var px = d.step % 3 === 0 ? p.x + U.rand(-40, 40) : Math.cos(pa) * pd2;
            var py = d.step % 3 === 0 ? p.y + U.rand(-40, 40) : Math.sin(pa) * pd2;
            game.spawnFallingRock(px, py, this.dmg * 0.75, this);
            d.step++; d.t = 0.14;
          } else { d.t = 0.6; if (d.wait) done(); else d.wait = true; }
        }
        break;
      }

      // ---------- دوران قاتل ----------
      case 'spin': {
        if (d.step === undefined) { d.step = 0; d.t = 0.5; d.tick = 0; d.dur = 2.6; }
        if (d.step === 0) {
          d.t -= dt;
          this.facing += dt * 4;
          if (d.t <= 0) { d.step = 1; d.t = d.dur; A.play('swing', 1); }
        } else {
          d.t -= dt;
          this.facing += dt * 15;
          out.mvx = Math.cos(angToP) * 1.15; out.mvy = Math.sin(angToP) * 1.15;
          d.tick -= dt;
          FX.spark(this.x + Math.cos(this.facing) * (this.r + 34), this.y + Math.sin(this.facing) * (this.r + 34),
            { a: this.facing + Math.PI / 2, speed: 140, color: this.color, life: 0.25 });
          if (d.tick <= 0) {
            d.tick = 0.3;
            game.areaDamage(this.x, this.y, this.r + 62, this.dmg * 0.7, { knock: 340, targetPlayer: true, enemySource: this });
            FX.ring(this.x, this.y, { r0: this.r, r1: this.r + 66, color: this.color, life: 0.28, width: 5 });
          }
          if (d.t <= 0) done();
        }
        break;
      }

      default: done();
    }

    return out;
  };

  /* =========================================================
     الرسم
     ========================================================= */
  Boss.prototype.drawTelegraphs = function (c) {
    for (var i = 0; i < this.telegraphs.length; i++) {
      var t = this.telegraphs[i], k = U.clamp(t.t / t.max, 0, 1);
      if (t.type === 'circle') R.telegraph(c, t.x, t.y, t.r, k, t.color);
      else if (t.type === 'line') R.telegraphLine(c, t.x, t.y, t.ang, t.len, t.w, k, t.color);
    }
  };

  Boss.prototype.draw = function (c, time) {
    var scale = this.state === 'intro' ? U.lerp(0.6, 1, U.clamp(1 - this.stateT / 1.9, 0, 1)) : 1;
    R.shadow(c, this.x, this.y, this.r * scale, 0.45);

    // هالة
    c.save();
    c.globalAlpha = 0.16 + 0.06 * Math.sin(time * 3);
    c.fillStyle = this.enraged ? '#e0573f' : this.color;
    c.beginPath(); c.arc(this.x, this.y, this.r * 1.7, 0, U.TAU); c.fill();
    c.restore();

    if (this.enraged && Math.random() < 0.25) {
      FX.spark(this.x + U.rand(-this.r, this.r), this.y + U.rand(-this.r, this.r),
        { a: -Math.PI / 2, speed: U.rand(20, 70), color: '#ff8f7a', life: 0.5, size: 2.5 });
    }

    var weapon = 'sword';
    if (this.cfg.id === 'rubban') weapon = 'spear';
    else if (this.cfg.id === 'thaghr') weapon = 'bow';
    else if (this.cfg.id === 'hajib') weapon = 'axe';
    else if (this.cfg.id === 'sakhra') weapon = 'shield';
    else if (this.cfg.id === 'layth') weapon = 'daggers';

    c.save();
    c.shadowBlur = 18; c.shadowColor = this.enraged ? '#e0573f' : this.color;
    R.warrior(c, {
      x: this.x, y: this.y, r: this.r * scale, facing: this.facing, walk: this.walk,
      swing: this.swing,
      cloth: this.color, trim: this.pal.accent, metal: '#eceff3', skin: '#8a5c3a',
      weapon: weapon, helm: 'crown', cape: true, hurt: this.hurtT / 0.14
    });
    c.restore();

    // تاج الاسم
    if (this.state === 'intro') {
      c.save();
      c.globalAlpha = U.clamp(1 - this.stateT / 1.9, 0, 1);
      c.textAlign = 'center';
      c.font = '700 26px Amiri, Cairo, serif';
      c.lineWidth = 5; c.strokeStyle = 'rgba(8,5,3,.85)'; c.lineJoin = 'round';
      c.strokeText(this.name, this.x, this.y - this.r - 34);
      c.fillStyle = '#ffe0c4';
      c.fillText(this.name, this.x, this.y - this.r - 34);
      c.restore();
    }
  };

  MAL.Boss = Boss;
})(typeof window !== 'undefined' ? window : globalThis);
