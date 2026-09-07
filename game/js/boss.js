/* ============================================================
   boss.js — قائدُ جيش الخصم: أقوى وحدةٍ في الميدان
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U, FX = MAL.FX, R = MAL.R, A = MAL.Audio;
  var FRIEND = 1, FOE = 2;

  function Commander(setup, game) {
    var s = setup.stage, f = setup.faction;
    this.kind = 'commander';
    this.team = FOE;
    this.name = s.cmd || 'قائِدُ الخَصْم';
    this.faction = f.name;
    this.cfg = { id: 'commander', range: 96, cd: 1.6, weapon: 'sword' };
    this.x = 0; this.y = -300;
    this.vx = 0; this.vy = 0;
    this.knockX = 0; this.knockY = 0;
    this.r = 26;
    this.maxHp = setup.cmdHp;
    this.hp = this.maxHp;
    this.baseSpeed = 112 + setup.index * 0.8;
    this.dmg = 16 + setup.index * 0.85;
    this.look = {
      cloth: U.shade(f.cloth, -.12), trim: f.trim, metal: f.metal,
      skin: '#8a5c3a', helm: 'crown', blood: '#8a2f2a'
    };
    this.facing = Math.PI / 2;
    this.walk = 0;
    this.swing = -1; this.swingT = 0;
    this.hurtT = 0;
    this.dead = false; this.remove = false;
    this.stunT = 0; this.slowT = 0; this.rallyT = 0;
    this.spawnT = 0;
    this.state = 'intro'; this.stateT = 1.7;
    this.pat = null; this.patD = {};
    this.patCd = 1.5;
    this.patterns = ['sweep', 'charge', 'volley', 'rally', 'summon'];
    this.patIdx = 0;
    this.phase = 1;
    this.target = null; this.retarget = 0;
    this.contactCd = 0;
    this.deathT = 0;
    this.telegraphs = [];
    this.game = game;
  }

  Commander.prototype.dmgOut = function () { return this.dmg * (this.phase === 2 ? 1.25 : 1); };

  Commander.prototype.tg = function (o) { o.t = 0; o.max = o.max || 0.6; this.telegraphs.push(o); return o; };

  Commander.prototype.hurt = function (n, o, game) {
    if (this.dead) return 0;
    o = o || {};
    var dmg = Math.max(1, n * (this.state === 'intro' ? 0.2 : 1));
    this.hp -= dmg;
    this.hurtT = 0.13;
    if (o.knock) { this.knockX += Math.cos(o.ang || 0) * o.knock * 0.1; this.knockY += Math.sin(o.ang || 0) * o.knock * 0.1; }
    if (o.byPlayer && !o.noText) {
      FX.text(this.x + U.rand(-10, 10), this.y - this.r - 8, U.ar(dmg), {
        color: o.crit ? '#ffd166' : '#fff2d4', size: o.crit ? 20 : 16, crit: o.crit
      });
    }
    FX.blood(this.x, this.y, o.ang, o.crit ? 8 : 4, '#8a2f2a');
    if (this.phase === 1 && this.hp <= this.maxHp * 0.5) this.enterPhase2();
    if (this.hp <= 0) this.die(game, o);
    return dmg;
  };

  Commander.prototype.enterPhase2 = function () {
    this.phase = 2;
    this.baseSpeed *= 1.2;
    this.patCd *= 0.7;
    this.state = 'roar'; this.stateT = 1.0;
    this.pat = null;
    FX.flash('#e0573f', 0.35, 0.5);
    FX.shake(16);
    FX.ring(this.x, this.y, { r0: 20, r1: 320, color: '#e0573f', life: 0.7, width: 9 });
    FX.text(this.x, this.y - this.r - 30, 'ثَبَتوا!', { color: '#ff8f7a', size: 24 });
    A.play('boss');
  };

  Commander.prototype.die = function (game, o) {
    if (this.dead) return;
    this.dead = true; this.hp = 0;
    FX.slow(0.25, 1.4);
    FX.flash('#fff', 0.55, 0.6);
    FX.shake(24);
    for (var i = 0; i < 4; i++) {
      (function (self, k) {
        setTimeout(function () {
          FX.burst(self.x + U.rand(-36, 36), self.y + U.rand(-36, 36), 16, self.look.trim, { min: 90, max: 400 });
          FX.ring(self.x, self.y, { r0: 10, r1: 120 + k * 40, color: '#ffe9b6', life: 0.5, width: 6 });
          A.play('explode');
        }, k * 130);
      })(this, i);
    }
    game.onCommanderKilled(this);
  };

  Commander.prototype.acquire = function (game, dt) {
    this.retarget -= dt;
    if (this.target && !this.target.dead && this.retarget > 0) return;
    this.retarget = 0.4;
    // يفضّل قائد المسلمين إن كان قريباً، وإلا فأقرب جندي
    var p = game.player;
    if (p && !p.dead && U.dist(this.x, this.y, p.x, p.y) < 340) this.target = p;
    else this.target = game.nearestOf(this.x, this.y, FRIEND, 1e9);
  };

  Commander.prototype.update = function (dt, game) {
    if (this.dead) { this.deathT += dt; return; }
    this.hurtT = Math.max(0, this.hurtT - dt);
    this.stunT = Math.max(0, this.stunT - dt);
    this.slowT = Math.max(0, this.slowT - dt);
    this.contactCd = Math.max(0, this.contactCd - dt);

    for (var i = this.telegraphs.length - 1; i >= 0; i--) {
      var tg = this.telegraphs[i];
      tg.t += dt;
      if (tg.t >= tg.max) this.telegraphs.splice(i, 1);
    }

    this.acquire(game, dt);
    var t = this.target;
    var mvx = 0, mvy = 0;
    var ang = t ? U.angleTo(this.x, this.y, t.x, t.y) : this.facing;
    var d = t ? U.dist(this.x, this.y, t.x, t.y) : 999;

    if (this.state === 'intro') {
      this.stateT -= dt;
      this.y = U.damp(this.y, -160, 3, dt);
      if (this.stateT <= 0) { this.state = 'idle'; this.stateT = 0.8; }
    } else if (this.state === 'roar') {
      this.stateT -= dt;
      if (Math.random() < dt * 26) {
        FX.spark(this.x + U.rand(-28, 28), this.y + U.rand(-28, 28),
          { a: -Math.PI / 2, speed: U.rand(60, 190), color: '#ff8f7a', life: 0.45 });
      }
      if (this.stateT <= 0) { this.state = 'idle'; this.stateT = 0.4; }
    } else if (this.state === 'idle') {
      this.stateT -= dt;
      this.facing = U.angApproach(this.facing, ang, dt * 4);
      if (d > 140) { mvx = Math.cos(ang); mvy = Math.sin(ang); }
      else if (d < 80) { mvx = -Math.cos(ang) * 0.6; mvy = -Math.sin(ang) * 0.6; }
      if (this.stateT <= 0) {
        this.patIdx = (this.patIdx + 1 + (Math.random() < 0.3 ? 1 : 0)) % this.patterns.length;
        this.pat = this.patterns[this.patIdx];
        this.patD = {};
        this.state = 'pattern';
      }
    } else if (this.state === 'pattern') {
      var res = this.runPattern(dt, game, ang, d, t);
      mvx = res.mvx; mvy = res.mvy;
    }

    var spd = this.baseSpeed * (this.slowT > 0 ? 0.55 : 1) * (this.stunT > 0 ? 0 : 1);
    this.vx = U.damp(this.vx, mvx * spd, 9, dt);
    this.vy = U.damp(this.vy, mvy * spd, 9, dt);
    this.x += (this.vx + this.knockX) * dt;
    this.y += (this.vy + this.knockY) * dt;
    this.knockX *= Math.pow(0.002, dt); this.knockY *= Math.pow(0.002, dt);
    if (Math.abs(mvx) + Math.abs(mvy) > 0.05) this.walk += dt * 7;

    MAL.helpers.clampArena(this, game.arenaR);

    if (this.state !== 'intro' && this.contactCd <= 0 && t && d < this.r + t.r + 2) {
      game.dealDamage(this, t, this.dmgOut() * 0.4, { ang: ang, knock: 300 });
      this.contactCd = 0.8;
    }

    if (this.swing >= 0) {
      this.swingT += dt;
      this.swing = this.swingT / 0.3;
      if (this.swing >= 1) { this.swing = -1; this.swingT = 0; }
    }
  };

  Commander.prototype.runPattern = function (dt, game, ang, d, t) {
    var out = { mvx: 0, mvy: 0 }, D = this.patD, self = this;
    function done() { self.state = 'idle'; self.stateT = self.patCd; self.pat = null; }

    switch (this.pat) {
      /* ضربةٌ واسعة */
      case 'sweep': {
        if (D.step === undefined) { D.step = 0; D.t = 0.5; D.count = this.phase === 2 ? 3 : 2; D.ph = 'aim'; }
        D.t -= dt;
        if (D.ph === 'aim') {
          this.facing = U.angApproach(this.facing, ang, dt * 6);
          if (d > 110) { out.mvx = Math.cos(ang) * 1.2; out.mvy = Math.sin(ang) * 1.2; }
          if (D.t <= 0) {
            D.ph = 'hit'; D.t = 0.35;
            this.swing = 0; this.swingT = 0;
            game.arcDamage(this, this.x, this.y, this.facing, 140, 1.5, this.dmgOut());
            FX.slash(this.x, this.y, this.facing, 130, 3.0, 'rgba(255,200,170,0.9)', 0.24);
            A.play('swing', 1); FX.shake(8);
          }
        } else if (D.t <= 0) {
          D.step++;
          if (D.step >= D.count) done(); else { D.ph = 'aim'; D.t = 0.45; }
        }
        break;
      }

      /* اندفاعٌ مستقيم */
      case 'charge': {
        if (D.step === undefined) { D.step = 0; D.ph = 'aim'; D.t = 0.65; D.count = this.phase === 2 ? 3 : 2; }
        D.t -= dt;
        if (D.ph === 'aim') {
          this.facing = U.angApproach(this.facing, ang, dt * 4);
          if (!D.line) D.line = this.tg({ type: 'line', x: this.x, y: this.y, ang: this.facing, len: 640, w: 58, max: 0.65, color: '#e0573f' });
          D.line.x = this.x; D.line.y = this.y; D.line.ang = this.facing;
          if (D.t <= 0) { D.ph = 'go'; D.t = 0.8; D.dir = this.facing; D.line = null; A.play('dash'); FX.dust(this.x, this.y, 9); }
        } else if (D.ph === 'go') {
          out.mvx = Math.cos(D.dir) * 3.2; out.mvy = Math.sin(D.dir) * 3.2;
          if (Math.random() < dt * 35) FX.dust(this.x, this.y, 1);
          if (t && d < this.r + t.r + 6 && this.contactCd <= 0) {
            game.dealDamage(this, t, this.dmgOut(), { ang: ang, knock: 480 });
            this.contactCd = 0.6; FX.shake(12);
          }
          if (Math.hypot(this.x, this.y) > game.arenaR - this.r - 14) {
            D.t = 0; FX.shake(11); FX.dust(this.x, this.y, 10); A.play('explode');
            game.circleDamage(this, this.x, this.y, 120, this.dmgOut() * 0.6, 380);
            FX.ring(this.x, this.y, { r0: 10, r1: 130, color: '#ffb066', life: 0.4, width: 6 });
          }
          if (D.t <= 0) { D.ph = 'rest'; D.t = 0.5; }
        } else if (D.t <= 0) {
          D.step++;
          if (D.step >= D.count) done(); else { D.ph = 'aim'; D.t = 0.55; }
        }
        break;
      }

      /* رشقةُ سهام */
      case 'volley': {
        if (D.step === undefined) { D.step = 0; D.t = 0.4; D.count = this.phase === 2 ? 5 : 3; }
        D.t -= dt;
        this.facing = U.angApproach(this.facing, ang, dt * 7);
        if (d < 220) { out.mvx = -Math.cos(ang) * 0.8; out.mvy = -Math.sin(ang) * 0.8; }
        if (D.t <= 0) {
          D.t = 0.35;
          for (var v = -2; v <= 2; v++) {
            game.spawnProjectile({
              x: this.x + Math.cos(this.facing) * (this.r + 6), y: this.y + Math.sin(this.facing) * (this.r + 6),
              ang: this.facing + v * 0.15, speed: 460, dmg: this.dmgOut() * 0.45, team: FOE,
              kind: 'arrow', r: 5, life: 3, color: '#e8c7a0', owner: this
            });
          }
          A.play('bow');
          D.step++;
          if (D.step >= D.count) done();
        }
        break;
      }

      /* يشدّ من أزر جنده */
      case 'rally': {
        if (D.done === undefined) {
          D.done = true; D.t = 1.1;
          var n = 0;
          for (var i = 0; i < game.units.length; i++) {
            var u = game.units[i];
            if (u.dead || u.team !== FOE || u === this) continue;
            if (U.dist(this.x, this.y, u.x, u.y) < 320) {
              u.rallyT = 6;
              u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.25);
              FX.spark(u.x, u.y, { a: -Math.PI / 2, speed: 60, color: this.look.trim, life: 0.5 });
              n++;
            }
          }
          FX.ring(this.x, this.y, { r0: 20, r1: 330, color: this.look.trim, life: 0.7, width: 7 });
          FX.text(this.x, this.y - this.r - 26, 'اثْبُتوا!', { color: this.look.trim, size: 20 });
          A.play('boss');
          this.swing = 0; this.swingT = 0;
        }
        D.t -= dt;
        if (D.t <= 0) done();
        break;
      }

      /* مَدَدٌ للخصم */
      case 'summon': {
        if (D.done === undefined) {
          D.done = true; D.t = 1.0;
          game.reinforce(this.phase === 2 ? 5 : 3, this.x, this.y);
          FX.ring(this.x, this.y, { r0: 20, r1: 240, color: '#e0573f', life: 0.6, width: 7 });
          FX.shake(8);
          A.play('boss');
        }
        D.t -= dt;
        if (D.t <= 0) done();
        break;
      }

      default: done();
    }
    return out;
  };

  Commander.prototype.drawTelegraphs = function (c) {
    for (var i = 0; i < this.telegraphs.length; i++) {
      var t = this.telegraphs[i], k = U.clamp(t.t / t.max, 0, 1);
      if (t.type === 'circle') R.telegraph(c, t.x, t.y, t.r, k, t.color);
      else if (t.type === 'line') R.telegraphLine(c, t.x, t.y, t.ang, t.len, t.w, k, t.color);
    }
  };

  Commander.prototype.draw = function (c, time) {
    var scale = this.state === 'intro' ? U.lerp(0.6, 1, U.clamp(1 - this.stateT / 1.7, 0, 1)) : 1;
    if (this.dead) { c.save(); c.globalAlpha = Math.max(0, 1 - this.deathT); }

    R.shadow(c, this.x, this.y, this.r * scale, 0.45);

    c.save();
    c.globalAlpha = 0.15 + 0.05 * Math.sin(time * 3);
    c.fillStyle = this.phase === 2 ? '#e0573f' : this.look.trim;
    c.beginPath(); c.arc(this.x, this.y, this.r * 1.7, 0, U.TAU); c.fill();
    c.restore();

    c.save();
    c.globalAlpha = 0.6;
    c.strokeStyle = '#e0573f'; c.lineWidth = 2.5;
    c.beginPath();
    c.ellipse(this.x, this.y + this.r * 0.42, this.r * 1.35, this.r * 0.6, 0, 0, U.TAU);
    c.stroke();
    c.restore();

    c.save();
    c.shadowBlur = 16; c.shadowColor = this.phase === 2 ? '#e0573f' : this.look.trim;
    R.warrior(c, {
      x: this.x, y: this.y, r: this.r * scale, facing: this.facing, walk: this.walk,
      swing: this.swing, cloth: this.look.cloth, trim: this.look.trim,
      metal: this.look.metal, skin: this.look.skin, weapon: 'sword',
      helm: 'crown', cape: true, banner: true, hurt: this.hurtT / 0.13
    });
    c.restore();

    if (this.state === 'intro') {
      c.save();
      c.globalAlpha = U.clamp(1 - this.stateT / 1.7, 0, 1);
      c.textAlign = 'center';
      c.font = '700 26px Amiri, Cairo, serif';
      c.lineWidth = 5; c.strokeStyle = 'rgba(8,5,3,.85)'; c.lineJoin = 'round';
      c.strokeText(this.name, this.x, this.y - this.r - 34);
      c.fillStyle = '#ffe0c4';
      c.fillText(this.name, this.x, this.y - this.r - 34);
      c.restore();
    }

    if (this.dead) c.restore();
  };

  MAL.Commander = Commander;
})(typeof window !== 'undefined' ? window : globalThis);
