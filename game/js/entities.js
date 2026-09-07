/* ============================================================
   entities.js — نظام الجيشين: وحدةٌ واحدة تخدم الصديق والعدو،
   والقائد الذي تتحكم به، والمقذوفات والغنائم.
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U, FX = MAL.FX, R = MAL.R, A = MAL.Audio;

  var FRIEND = 1, FOE = 2;

  /* =========================================================
     أدوات مشتركة
     ========================================================= */
  function applyKnock(e, ang, force) {
    e.knockX += Math.cos(ang) * force;
    e.knockY += Math.sin(ang) * force;
  }

  function collideObstacles(e, obstacles) {
    for (var i = 0; i < obstacles.length; i++) {
      var o = obstacles[i];
      var dx = e.x - o.x, dy = e.y - o.y;
      var d = Math.hypot(dx, dy), min = o.r + e.r;
      if (d < min && d > 0.001) {
        var k = (min - d) / d;
        e.x += dx * k; e.y += dy * k;
      } else if (d <= 0.001) { e.x += min; }
    }
  }

  function clampArena(e, arenaR) {
    var d = Math.hypot(e.x, e.y), max = arenaR - e.r - 6;
    if (d > max && d > 0.001) { e.x = e.x / d * max; e.y = e.y / d * max; }
  }

  /* =========================================================
     الوحدة — جنديٌّ من أيّ الجيشين
     ========================================================= */
  function Unit(cfg, team, x, y, scale, look) {
    this.kind = 'unit';
    this.cfg = cfg;
    this.type = cfg.id;
    this.team = team;
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.knockX = 0; this.knockY = 0;
    this.r = cfg.r;
    scale = scale || {};
    this.maxHp = Math.round(cfg.hp * (scale.hp || 1));
    this.hp = this.maxHp;
    this.baseSpeed = cfg.speed * (scale.speed || 1);
    this.dmg = cfg.dmg * (scale.dmg || 1);
    this.look = look;                       // ألوان الطرف
    this.facing = team === FRIEND ? -Math.PI / 2 : Math.PI / 2;
    this.walk = Math.random() * 6;
    this.atkCd = cfg.cd;
    this.atkTimer = U.rand(0.2, cfg.cd);
    this.state = 'advance';
    this.stateT = 0;
    this.swing = -1; this.swingT = 0;
    this.hurtT = 0;
    this.dead = false; this.remove = false;
    this.stunT = 0; this.slowT = 0; this.rallyT = 0;
    this.guardHits = 0; this.guardT = 0;
    this.spawnT = 0.4;
    this.target = null; this.retarget = Math.random() * 0.3;
    this.seed = Math.random() * 100;
    this.offset = { x: U.rand(-1, 1), y: U.rand(-1, 1) };
  }

  Unit.prototype.dmgOut = function () {
    return this.dmg * (this.rallyT > 0 ? 2 : 1);
  };

  Unit.prototype.hurt = function (n, o, game) {
    if (this.dead) return 0;
    o = o || {};
    var dmg = n;

    if (this.cfg.block && this.guardT <= 0 && o.ang !== undefined) {
      if (Math.abs(U.angDiff(this.facing, o.ang + Math.PI)) < 1.0) {
        dmg *= (1 - this.cfg.block);
        this.guardHits++;
        A.play('clang');
        FX.spark(this.x, this.y, { a: o.ang + Math.PI, speed: 220, color: '#ffe9b6', life: 0.3, size: 3 });
        if (this.guardHits >= 4) {
          this.guardHits = 0; this.guardT = 2.4;
          this.stunT = Math.max(this.stunT, 0.8);
          FX.shard(this.x, this.y, '#cfd4d8', 6);
        }
      }
    }

    dmg = Math.max(1, dmg);
    this.hp -= dmg;
    this.hurtT = 0.16;
    if (o.knock) applyKnock(this, o.ang === undefined ? U.rand(0, U.TAU) : o.ang, o.knock);
    if (o.stun) this.stunT = Math.max(this.stunT, o.stun);
    if (o.slow) this.slowT = Math.max(this.slowT, o.slow);

    // أرقامُ الضرر تظهر لضربات القائد فقط كي لا تزدحم الشاشة
    if (o.byPlayer && !o.noText) {
      FX.text(this.x + U.rand(-6, 6), this.y - this.r - 6, U.ar(dmg), {
        color: o.crit ? '#ffd166' : '#fff2d4', size: o.crit ? 18 : 14, crit: o.crit
      });
    }
    FX.blood(this.x, this.y, o.ang, o.crit ? 8 : 4, this.look.blood || '#8a2f2a');

    if (this.hp <= 0) this.die(game, o);
    return dmg;
  };

  Unit.prototype.die = function (game, o) {
    if (this.dead) return;
    this.dead = true; this.remove = true;
    FX.blood(this.x, this.y, o && o.ang, 12, this.look.blood || '#8a2f2a');
    FX.decal(this.x, this.y, 10 + Math.random() * 9, U.rgba(this.look.blood || '#8a2f2a', 0.3));
    FX.burst(this.x, this.y, 5, this.look.trim, { min: 50, max: 180 });
    A.play('kill');
    game.onUnitKilled(this);
  };

  Unit.prototype.acquire = function (game, dt) {
    this.retarget -= dt;
    if (this.target && !this.target.dead && this.retarget > 0) return;
    this.retarget = 0.4 + Math.random() * 0.3;
    // كلُّ جنديٍّ يختار من بين أقرب أربعة — فينتشر الصفُّ بدل أن يتكدّس
    this.target = game.pickTarget(this, this.team === FRIEND ? FOE : FRIEND);
  };

  Unit.prototype.update = function (dt, game) {
    if (this.spawnT > 0) this.spawnT -= dt;
    this.hurtT = Math.max(0, this.hurtT - dt);
    this.stunT = Math.max(0, this.stunT - dt);
    this.slowT = Math.max(0, this.slowT - dt);
    this.guardT = Math.max(0, this.guardT - dt);
    this.rallyT = Math.max(0, this.rallyT - dt);

    this.acquire(game, dt);

    var spd = this.baseSpeed * (this.slowT > 0 ? 0.45 : 1) * (this.rallyT > 0 ? 1.2 : 1) *
              (this.team === 2 ? (game.pressure || 1) : 1);
    var mvx = 0, mvy = 0;
    var t = this.target;

    if (this.stunT > 0 || this.spawnT > 0) {
      // مذهول
    } else if (!t) {
      // لا خصم: الأصدقاء يلتفّون حول القائد
      if (this.team === FRIEND && game.player && !game.player.dead) {
        var p = game.player;
        var dx = p.x + this.offset.x * 70 - this.x, dy = p.y + this.offset.y * 70 - this.y;
        var dd = Math.hypot(dx, dy);
        if (dd > 60) { mvx = dx / dd; mvy = dy / dd; }
        this.facing = U.angApproach(this.facing, p.facing, dt * 4);
      }
    } else {
      var d = U.dist(this.x, this.y, t.x, t.y);
      var ang = U.angleTo(this.x, this.y, t.x, t.y);
      this.facing = U.angApproach(this.facing, ang, dt * 7);
      this.atkTimer -= dt;

      if (this.cfg.ranged) {
        var keep = this.cfg.keep || 210;
        if (d < keep * 0.75) { mvx = -Math.cos(ang); mvy = -Math.sin(ang); }
        else if (d > keep * 1.15) { mvx = Math.cos(ang); mvy = Math.sin(ang); }
        else {
          var side = (this.seed % 2 === 0 ? 1 : -1);
          mvx = Math.cos(ang + Math.PI / 2) * side * 0.5;
          mvy = Math.sin(ang + Math.PI / 2) * side * 0.5;
        }
        if (this.state === 'aim') {
          this.stateT -= dt;
          if (this.stateT <= 0) {
            this.state = 'advance';
            this.swing = 0; this.swingT = 0;
            game.spawnProjectile({
              x: this.x + Math.cos(this.facing) * (this.r + 4),
              y: this.y + Math.sin(this.facing) * (this.r + 4),
              ang: this.facing, speed: 430, dmg: this.dmgOut(), team: this.team,
              kind: 'arrow', r: 4, life: 2.4, owner: this,
              color: this.team === FRIEND ? '#f6e6c0' : '#e8c7a0'
            });
            A.play('bow');
          }
        } else if (d < this.cfg.range && this.atkTimer <= 0 && game.requestAttack(this)) {
          this.state = 'aim'; this.stateT = 0.55; this.atkTimer = this.atkCd;
        }
      } else if (this.cfg.charger) {
        if (this.state === 'advance') {
          if (d > 210) { mvx = Math.cos(ang); mvy = Math.sin(ang); }
          else if (this.atkTimer <= 0 && game.requestAttack(this)) {
            this.state = 'windup'; this.stateT = 0.5;
          } else { mvx = Math.cos(ang) * 0.6; mvy = Math.sin(ang) * 0.6; }
        } else if (this.state === 'windup') {
          this.stateT -= dt;
          mvx = -Math.cos(this.facing) * 0.3; mvy = -Math.sin(this.facing) * 0.3;
          if (this.stateT <= 0) {
            this.state = 'charge'; this.stateT = 0.7; this.chargeDir = this.facing;
            this.atkTimer = this.atkCd; A.play('dash');
          }
        } else if (this.state === 'charge') {
          this.stateT -= dt;
          mvx = Math.cos(this.chargeDir) * 2.6; mvy = Math.sin(this.chargeDir) * 2.6;
          if (Math.random() < dt * 24) FX.dust(this.x, this.y, 1);
          if (d < this.r + t.r + 8) {
            game.dealDamage(this, t, this.dmgOut() * 1.2, { ang: ang, knock: 320 });
            this.state = 'recover'; this.stateT = 0.6;
          }
          if (this.stateT <= 0) { this.state = 'recover'; this.stateT = 0.5; }
        } else {
          this.stateT -= dt;
          if (this.stateT <= 0) this.state = 'advance';
        }
      } else {
        var reach = this.cfg.range + t.r;
        if (d > reach * 0.8) {
          var flank = this.offset.x * 0.55;          // ميلٌ جانبيّ يميّز مسار كل جندي
          mvx = Math.cos(ang + flank); mvy = Math.sin(ang + flank);
        }
        if (this.state === 'windup') {
          this.stateT -= dt;
          if (this.stateT <= 0) {
            this.state = 'advance';
            this.swing = 0; this.swingT = 0;
            if (t && !t.dead && U.dist(this.x, this.y, t.x, t.y) <= reach + 10) {
              game.dealDamage(this, t, this.dmgOut(), { ang: ang, knock: 80 });
            }
            A.play('swing');
            FX.slash(this.x, this.y, this.facing, this.cfg.range * 0.9, 1.2,
              this.team === FRIEND ? 'rgba(255,246,223,0.6)' : 'rgba(255,190,170,0.6)', 0.16);
          }
        } else if (d < reach && this.atkTimer <= 0 && game.requestAttack(this)) {
          this.state = 'windup'; this.stateT = 0.42; this.atkTimer = this.atkCd;
        }
      }
    }

    this.vx = U.damp(this.vx, mvx * spd, 12, dt);
    this.vy = U.damp(this.vy, mvy * spd, 12, dt);
    this.x += (this.vx + this.knockX) * dt;
    this.y += (this.vy + this.knockY) * dt;
    this.knockX *= Math.pow(0.0015, dt); this.knockY *= Math.pow(0.0015, dt);
    if (Math.abs(mvx) + Math.abs(mvy) > 0.05) this.walk += dt * 9;

    collideObstacles(this, game.obstacles);
    clampArena(this, game.arenaR);

    if (this.swing >= 0) {
      this.swingT += dt;
      this.swing = this.swingT / 0.24;
      if (this.swing >= 1) { this.swing = -1; this.swingT = 0; }
    }
  };

  Unit.prototype.draw = function (c, time) {
    var L = this.look;
    var scale = this.spawnT > 0 ? U.lerp(0.3, 1, U.easeOutBack(1 - this.spawnT / 0.4)) : 1;

    R.shadow(c, this.x, this.y, this.r * scale, 0.34);

    // شارةُ الفريق تحت القدمين — تفرّق الجيشين في لمحة
    c.save();
    c.globalAlpha = 0.5;
    c.strokeStyle = this.team === FRIEND ? '#4fd39b' : '#e0573f';
    c.lineWidth = 1.6;
    c.beginPath();
    c.ellipse(this.x, this.y + this.r * 0.42, this.r * 1.15, this.r * 0.5, 0, 0, U.TAU);
    c.stroke();
    c.restore();

    if (this.state === 'windup') {
      c.save();
      c.globalAlpha = 0.22;
      c.fillStyle = this.team === FRIEND ? '#9ee5b0' : '#e0573f';
      c.beginPath();
      c.moveTo(this.x, this.y);
      c.arc(this.x, this.y, this.cfg.range + 8, this.facing - 0.6, this.facing + 0.6);
      c.closePath(); c.fill();
      c.restore();
    }
    if (this.rallyT > 0) {
      c.save();
      c.globalAlpha = 0.3 + 0.12 * Math.sin(time * 7 + this.seed);
      c.strokeStyle = '#e4c46a'; c.lineWidth = 2;
      c.beginPath(); c.arc(this.x, this.y, this.r + 7, 0, U.TAU); c.stroke();
      c.restore();
    }

    R.warrior(c, {
      x: this.x, y: this.y, r: this.r * scale, facing: this.facing, walk: this.walk,
      swing: this.swing, cloth: L.cloth, trim: L.trim, metal: L.metal, skin: L.skin,
      weapon: this.cfg.weapon, helm: L.helm, hurt: this.hurtT / 0.16
    });

    if (this.hp < this.maxHp) {
      var w = this.r * 2, hp = U.clamp(this.hp / this.maxHp, 0, 1);
      c.save();
      c.fillStyle = 'rgba(0,0,0,.5)';
      c.fillRect(this.x - w / 2, this.y - this.r - 14, w, 3);
      c.fillStyle = this.team === FRIEND ? '#4fd39b' : '#e0573f';
      c.fillRect(this.x - w / 2, this.y - this.r - 14, w * hp, 3);
      c.restore();
    }
  };

  /* =========================================================
     القائد — الذي تتحكم به
     ========================================================= */
  function Player(hero, game) {
    var S = MAL.Save;
    this.hero = hero;
    this.game = game;
    this.kind = 'player';
    this.team = FRIEND;
    this.x = 0; this.y = 260;
    this.vx = 0; this.vy = 0;
    this.knockX = 0; this.knockY = 0;
    this.r = 22;
    this.facing = -Math.PI / 2;
    this.aimAngle = -Math.PI / 2;
    this.walk = 0;
    this.look = {
      cloth: hero.colors.cloth, trim: hero.colors.trim,
      metal: hero.colors.metal, skin: hero.colors.skin, helm: 'turban', blood: '#8a2f2a'
    };

    var vigor = S.armory('vigor'), edge = S.armory('edge'),
        swift = S.armory('swift'), guard = S.armory('guard'), banner = S.armory('banner');

    this.maxHp = hero.hp + vigor * 25;
    this.hp = this.maxHp;
    this.baseDmg = hero.dmg;
    // قوةُ السيف من غنائم النصر تنطبق على القائد وجيشه معاً
    this.dmgMul = (1 + edge * 0.08) * (1 + S.campaign('sword') / 100);
    this.atkCd = hero.atkCd;
    this.baseSpeed = hero.speed * (1 + swift * 0.05);
    this.range = hero.range;
    this.arc = hero.arc;
    this.dr = Math.pow(0.94, guard);
    this.crit = hero.crit; this.critMul = hero.critMul;
    this.block = hero.block;
    this.ultGain = 1 + banner * 0.25;

    this.dashMax = hero.dashMax;
    this.dashCharges = this.dashMax;
    this.dashCd = hero.dashCd;
    this.dashRegen = 0;
    this.dashing = 0; this.dashDur = 0.19; this.dashDir = 0;
    this.invuln = 0; this.perfectCd = 0;

    this.atkTimer = 0;
    this.swing = -1; this.swingT = 0; this.swingDur = 0.22;
    this.chain = -1; this.chainT = 0;
    this.combo = 0; this.comboT = 0;

    this.ult = 0; this.ultMax = 100;
    this.ultActive = 0;

    this.hurtT = 0;
    this.dead = false; this.remove = false;
    this.stunT = 0; this.slowT = 0; this.rallyT = 0;
    this.spawnT = 0;
    this.revives = S.armory('revive');
    this.stats = { dmgDealt: 0, dmgTaken: 0, kills: 0, gold: 0, perfect: 0, noHit: true };
  }

  Player.prototype.dmgOut = function () {
    return this.baseDmg * this.dmgMul * (this.rallyT > 0 ? 2 : 1);
  };
  Player.prototype.speed = function () { return this.baseSpeed; };

  Player.prototype.heal = function (n) {
    if (this.hp <= 0) return;
    var before = this.hp;
    this.hp = Math.min(this.maxHp, this.hp + n);
    var g = this.hp - before;
    if (g >= 1) FX.text(this.x, this.y - this.r - 14, '+' + U.ar(g), { color: '#9ee5b0', size: 14 });
  };

  Player.prototype.gainUlt = function (n) {
    if (this.ultActive > 0) return;
    this.ult = U.clamp(this.ult + n * this.ultGain, 0, this.ultMax);
  };

  Player.prototype.hurt = function (n, o, game) { return this.takeDamage(n, o && o.srcX, o && o.srcY); };

  Player.prototype.takeDamage = function (n, srcX, srcY) {
    if (this.dead) return 0;
    if (this.invuln > 0 || this.ultActive > 0) {
      if (this.perfectCd <= 0 && this.ultActive <= 0) {
        this.perfectCd = 0.4;
        this.stats.perfect++;
        FX.slow(0.32, 0.28);
        FX.text(this.x, this.y - this.r - 20, 'مُراوغة!', { color: '#9ed3f2', size: 15 });
        FX.ring(this.x, this.y, { r0: this.r, r1: this.r + 46, color: '#9ed3f2', life: 0.32, width: 3 });
        this.gainUlt(9);
        A.play('perfect');
      }
      return 0;
    }

    var dmg = n * this.dr;
    if (this.block > 0 && srcX !== undefined) {
      var a = U.angleTo(this.x, this.y, srcX, srcY);
      if (Math.abs(U.angDiff(this.facing, a)) < 1.05) {
        dmg *= (1 - this.block);
        A.play('clang');
        FX.text(this.x, this.y - this.r - 16, 'صدّ', { color: '#cfd4d8', size: 13 });
      }
    }

    dmg = Math.max(0, dmg);
    if (dmg <= 0) return 0;

    this.hp -= dmg;
    this.stats.dmgTaken += dmg;
    this.stats.noHit = false;
    this.hurtT = 0.3;
    this.invuln = Math.max(this.invuln, 0.58);
    this.gainUlt(dmg * 0.5);
    FX.shake(6 + Math.min(9, dmg * 0.28));
    FX.flash('#a8372c', 0.18, 0.2);
    FX.blood(this.x, this.y, srcX !== undefined ? U.angleTo(srcX, srcY, this.x, this.y) : undefined, 8);
    FX.text(this.x, this.y - this.r - 12, '−' + U.ar(dmg), { color: '#ff8f7a', size: 16 });
    A.play('hurt');
    if (MAL.Save.setting('haptics') && root.navigator && navigator.vibrate) { try { navigator.vibrate(16); } catch (e) {} }

    if (this.hp <= 0) {
      if (this.revives > 0) {
        this.revives--;
        this.hp = this.maxHp * 0.5;
        this.invuln = 2.0;
        FX.flash('#9ee5b0', 0.6, 0.6);
        FX.ring(this.x, this.y, { r0: 10, r1: 250, color: '#9ee5b0', life: 0.8, width: 9 });
        FX.text(this.x, this.y - 40, 'جاءكَ المَدَد!', { color: '#9ee5b0', size: 24 });
        A.play('win');
      } else { this.hp = 0; this.dead = true; }
    }
    return dmg;
  };

  Player.prototype.tryDash = function () {
    if (this.dashCharges <= 0 || this.dashing > 0 || this.dead || this.ultActive > 0) return false;
    var mv = MAL.Input.move;
    var ang = (mv.mag > 0.15) ? Math.atan2(mv.y, mv.x) : this.facing;
    this.dashCharges--;
    this.dashing = this.dashDur;
    this.dashDir = ang; this.facing = ang;
    this.invuln = Math.max(this.invuln, this.dashDur + 0.12);
    FX.dust(this.x, this.y, 8);
    FX.ring(this.x, this.y, { r0: this.r, r1: this.r + 32, color: 'rgba(240,228,200,.6)', life: 0.26, width: 3 });
    A.play('dash');
    return true;
  };

  Player.prototype.attack = function (game) {
    var ang = this.aimAngle;
    this.swing = 0; this.swingT = 0;
    this.chainT = 1.0;
    this.chain = (this.chain + 1) % 3;
    var finisher = this.chain === 2;
    this.swingDur = finisher ? 0.30 : 0.20;
    var reach = this.range * (finisher ? 1.22 : 1);
    var half = this.arc / 2 * (finisher ? 1.3 : 1);
    var dmg = this.dmgOut() * (finisher ? 1.7 : 1);

    var hits = game.playerMelee(this.x, this.y, ang, reach, half, dmg, finisher);

    FX.slash(this.x + Math.cos(ang) * this.r * 0.5, this.y + Math.sin(ang) * this.r * 0.5,
      ang, reach * 0.86, half * 2,
      finisher ? 'rgba(255,214,150,0.95)' : 'rgba(255,246,223,0.8)', finisher ? 0.26 : 0.18);
    A.play('swing', finisher ? 1 : 0);
    if (finisher) {
      FX.shake(3);
      FX.burst(this.x + Math.cos(ang) * reach * 0.5, this.y + Math.sin(ang) * reach * 0.5, 6, '#ffd88a',
        { a: ang, spread: half, min: 90, max: 260 });
    }
    return hits;
  };

  /** الرّاية: يُشفى الجيشُ ويهجم بضعف القوة */
  Player.prototype.useUlt = function (game) {
    if (this.ult < this.ultMax || this.ultActive > 0 || this.dead) return false;
    this.ult = 0;
    this.ultActive = 1.0;
    this.rallyT = 10;
    A.play('ult');
    FX.flash('#f6d489', 0.4, 0.5);
    FX.shake(12);
    FX.ring(this.x, this.y, { r0: 20, r1: 340, color: '#f6d489', life: 0.8, width: 10 });
    FX.text(this.x, this.y - 46, 'اللهُ أكبر!', { color: '#f6d489', size: 26 });

    var n = 0;
    for (var i = 0; i < game.units.length; i++) {
      var u = game.units[i];
      if (u.dead) continue;
      if (u.team === FRIEND) {
        u.rallyT = 10;
        if (u !== this && u.hp < u.maxHp) {
          u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.5);
          FX.spark(u.x, u.y, { a: -Math.PI / 2, speed: 60, color: '#9ee5b0', life: 0.5 });
        }
        n++;
      } else if (U.dist(this.x, this.y, u.x, u.y) < 220) {
        u.stunT = Math.max(u.stunT, 1.5);
        applyKnock(u, U.angleTo(this.x, this.y, u.x, u.y), 380);
      }
    }
    this.heal(this.maxHp * 0.25);
    return true;
  };

  Player.prototype.update = function (dt, game) {
    var I = MAL.Input;
    if (this.dead) return;

    this.hurtT = Math.max(0, this.hurtT - dt);
    this.invuln = Math.max(0, this.invuln - dt);
    this.perfectCd = Math.max(0, this.perfectCd - dt);
    this.atkTimer = Math.max(0, this.atkTimer - dt);
    this.chainT = Math.max(0, this.chainT - dt);
    if (this.chainT <= 0) this.chain = -1;
    this.comboT = Math.max(0, this.comboT - dt);
    if (this.comboT <= 0 && this.combo > 0) this.combo = 0;
    this.rallyT = Math.max(0, this.rallyT - dt);
    this.ultActive = Math.max(0, this.ultActive - dt);

    if (this.dashCharges < this.dashMax) {
      this.dashRegen += dt;
      if (this.dashRegen >= this.dashCd) { this.dashRegen = 0; this.dashCharges++; }
    } else this.dashRegen = 0;

    var spd = this.speed();
    if (this.dashing > 0) {
      this.dashing -= dt;
      this.vx = Math.cos(this.dashDir) * 720;
      this.vy = Math.sin(this.dashDir) * 720;
      if (Math.random() < 0.8) {
        FX.spark(this.x, this.y, { a: this.dashDir + Math.PI + U.rand(-.5, .5), speed: U.rand(40, 130),
          color: 'rgba(240,228,200,.75)', life: 0.28, size: 3, glow: false });
      }
    } else {
      var mv = I.move;
      this.vx = U.damp(this.vx, mv.x * spd * mv.mag, 22, dt);
      this.vy = U.damp(this.vy, mv.y * spd * mv.mag, 22, dt);
      if (mv.mag > 0.12) this.walk += dt * 11 * mv.mag;
    }

    this.x += (this.vx + this.knockX) * dt;
    this.y += (this.vy + this.knockY) * dt;
    this.knockX *= Math.pow(0.001, dt); this.knockY *= Math.pow(0.001, dt);

    collideObstacles(this, game.obstacles);
    clampArena(this, game.arenaR);

    if (Math.hypot(this.vx, this.vy) > 40 && Math.random() < dt * 12) FX.dust(this.x, this.y + this.r * 0.4, 1);

    // ---- التصويب ----
    var target = game.nearestOf(this.x, this.y, FOE, this.range * 2.4);
    if (I.aim.active) {
      if (I.aim.fromMouse) {
        var wp = game.screenToWorld(I.mouse.x, I.mouse.y);
        this.aimAngle = U.angleTo(this.x, this.y, wp.x, wp.y);
      } else this.aimAngle = Math.atan2(I.aim.y, I.aim.x);
    } else if (target) {
      this.aimAngle = U.angApproach(this.aimAngle, U.angleTo(this.x, this.y, target.x, target.y), dt * 14);
    } else if (I.move.mag > 0.15) {
      this.aimAngle = Math.atan2(I.move.y, I.move.x);
    }
    this.facing = this.dashing > 0 ? this.dashDir : U.angApproach(this.facing, this.aimAngle, dt * 18);

    // ---- الهجوم ----
    if (this.dashing <= 0 && this.atkTimer <= 0) {
      var auto = MAL.Save.setting('autoAim') !== 0;
      var want = I.aim.active || (auto && target && U.dist(this.x, this.y, target.x, target.y) <= this.range * 1.15);
      if (want) { this.attack(game); this.atkTimer = this.atkCd; }
    }

    if (this.swing >= 0) {
      this.swingT += dt;
      this.swing = this.swingT / this.swingDur;
      if (this.swing >= 1) { this.swing = -1; this.swingT = 0; }
    }
    if (this.dashing <= 0) this.dashing = 0;
  };

  Player.prototype.onHit = function (dealt, victim, game) {
    this.stats.dmgDealt += dealt;
    this.combo++; this.comboT = 2.4;
    this.gainUlt(dealt * 0.28);
  };

  Player.prototype.draw = function (c, time) {
    var hero = this.hero;
    var blink = this.invuln > 0 && this.dashing <= 0 && Math.floor(time * 22) % 2 === 0;

    // حلقة القائد
    c.save();
    c.globalAlpha = 0.18;
    c.fillStyle = hero.colors.trim;
    c.beginPath();
    c.ellipse(this.x, this.y + this.r * 0.42, this.r * 1.6, this.r * 0.76, 0, 0, U.TAU);
    c.fill();
    c.globalAlpha = 0.6;
    c.strokeStyle = hero.colors.trim; c.lineWidth = 2;
    c.beginPath();
    c.ellipse(this.x, this.y + this.r * 0.42, this.r * 1.5, this.r * 0.70, 0, 0, U.TAU);
    c.stroke();
    c.restore();

    R.shadow(c, this.x, this.y, this.r, 0.42);

    if (!blink) {
      c.save();
      if (this.rallyT > 0) { c.shadowBlur = 20; c.shadowColor = hero.colors.trim; }
      R.warrior(c, {
        x: this.x, y: this.y, r: this.r, facing: this.facing, walk: this.walk,
        swing: this.swing, cloth: hero.colors.cloth, trim: hero.colors.trim,
        metal: hero.colors.metal, skin: hero.colors.skin, weapon: 'sword',
        helm: 'turban', cape: true, banner: true, hurt: this.hurtT / 0.3
      });
      c.restore();
    }

    // سهمٌ فوق رأس القائد ليُعرف في وسط الزحام
    c.save();
    c.globalAlpha = 0.75 + 0.2 * Math.sin(time * 4);
    c.fillStyle = hero.colors.trim;
    var ay = this.y - this.r - 26 + Math.sin(time * 3) * 2;
    c.beginPath();
    c.moveTo(this.x, ay + 9);
    c.lineTo(this.x - 7, ay - 2);
    c.lineTo(this.x + 7, ay - 2);
    c.closePath(); c.fill();
    c.restore();

    if (MAL.Input.aim.active) {
      c.save();
      c.globalAlpha = 0.32;
      c.strokeStyle = hero.colors.trim; c.lineWidth = 2;
      c.setLineDash([6, 8]);
      c.beginPath();
      c.moveTo(this.x + Math.cos(this.aimAngle) * (this.r + 8), this.y + Math.sin(this.aimAngle) * (this.r + 8));
      c.lineTo(this.x + Math.cos(this.aimAngle) * this.range, this.y + Math.sin(this.aimAngle) * this.range);
      c.stroke(); c.setLineDash([]);
      c.restore();
    }
  };

  /* =========================================================
     المقذوفات
     ========================================================= */
  function Projectile(o) {
    this.x = o.x; this.y = o.y;
    this.vx = Math.cos(o.ang) * o.speed;
    this.vy = Math.sin(o.ang) * o.speed;
    this.speed = o.speed;
    this.r = o.r || 4;
    this.dmg = o.dmg;
    this.team = o.team;
    this.kind = o.kind || 'arrow';
    this.life = o.life || 2;
    this.color = o.color;
    this.owner = o.owner || null;
    this.byPlayer = !!o.byPlayer;
    this.remove = false;
  }

  Projectile.prototype.update = function (dt, game) {
    this.life -= dt;
    if (this.life <= 0) { this.remove = true; return; }
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (Math.hypot(this.x, this.y) > game.arenaR + 20) { this.remove = true; return; }
    for (var i = 0; i < game.obstacles.length; i++) {
      var o = game.obstacles[i];
      if (U.dist2(this.x, this.y, o.x, o.y) < (o.r + this.r) * (o.r + this.r)) {
        this.remove = true;
        FX.burst(this.x, this.y, 4, '#d9cdb4', { min: 30, max: 110 });
        return;
      }
    }

    var foeTeam = this.team === FRIEND ? FOE : FRIEND;
    for (var u = 0; u < game.units.length; u++) {
      var t = game.units[u];
      if (t.dead || t.team !== foeTeam) continue;
      if (U.dist2(this.x, this.y, t.x, t.y) < (t.r + this.r) * (t.r + this.r)) {
        var ang = Math.atan2(this.vy, this.vx);
        game.dealDamage(this.owner, t, this.dmg, { ang: ang, knock: 110, byPlayer: this.byPlayer });
        this.remove = true;
        A.play('arrowHit');
        FX.burst(this.x, this.y, 4, '#ffd88a', { a: ang + Math.PI, spread: 1, min: 40, max: 150 });
        return;
      }
    }
  };

  /* =========================================================
     الغنائم
     ========================================================= */
  function Pickup(x, y, kind, value) {
    this.x = x; this.y = y;
    this.vx = U.rand(-90, 90); this.vy = U.rand(-90, 90);
    this.kind = kind; this.value = value;
    this.life = 20; this.remove = false;
    this.seed = Math.random() * 6.28;
    this.t = 0;
  }
  Pickup.prototype.update = function (dt, game) {
    this.t += dt;
    this.life -= dt;
    if (this.life <= 0) { this.remove = true; return; }
    var p = game.player;
    var d = U.dist(this.x, this.y, p.x, p.y);
    var mag = 95 + (this.t > 3 ? 70 : 0);
    if (d < mag) {
      var a = U.angleTo(this.x, this.y, p.x, p.y);
      var pull = U.lerp(720, 200, d / mag);
      this.vx = U.damp(this.vx, Math.cos(a) * pull, 10, dt);
      this.vy = U.damp(this.vy, Math.sin(a) * pull, 10, dt);
    } else {
      this.vx *= Math.pow(0.02, dt); this.vy *= Math.pow(0.02, dt);
    }
    this.x += this.vx * dt; this.y += this.vy * dt;
    clampArena(this, game.arenaR);
    if (d < p.r + 12) { this.remove = true; game.collect(this); }
  };

  MAL.FRIEND = FRIEND;
  MAL.FOE = FOE;
  MAL.Unit = Unit;
  MAL.Player = Player;
  MAL.Projectile = Projectile;
  MAL.Pickup = Pickup;
  MAL.helpers = { applyKnock: applyKnock, collideObstacles: collideObstacles, clampArena: clampArena };
})(typeof window !== 'undefined' ? window : globalThis);
