/* ============================================================
   entities.js — البطل، الأعداء، المقذوفات، الغنائم، الأخطار
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U, FX = MAL.FX, R = MAL.R, A = MAL.Audio;

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
    if (d > max && d > 0.001) {
      e.x = e.x / d * max; e.y = e.y / d * max;
    }
  }

  /* =========================================================
     البطل
     ========================================================= */
  function Player(hero, game) {
    var S = MAL.Save, D = MAL.Data;
    this.hero = hero;
    this.game = game;
    this.kind = 'player';
    this.x = 0; this.y = 120;
    this.vx = 0; this.vy = 0;
    this.knockX = 0; this.knockY = 0;
    this.r = hero.id === 'dariq' ? 19 : 17;
    this.facing = -Math.PI / 2;
    this.aimAngle = -Math.PI / 2;
    this.walk = 0;

    // ---- إحصاءات أساسية ----
    var fVit = S.forgeLevel('vitality'), fEdge = S.forgeLevel('edge'),
        fSwift = S.forgeLevel('swift'), fGuard = S.forgeLevel('guard'),
        fFort = S.forgeLevel('fortune'), fWind = S.forgeLevel('wind');

    this.maxHp = hero.hp + fVit * 14;
    this.hp = this.maxHp;
    this.baseDmg = hero.dmg;
    this.dmgMul = 1 + fEdge * 0.07;
    this.atkCd = hero.atkCd;
    this.atkSpeedMul = 1;
    this.baseSpeed = hero.speed;
    this.speedMul = 1 + fSwift * 0.04;
    this.range = hero.range;
    this.rangeMul = 1;
    this.arc = hero.arc;
    this.arcBonus = 0;
    this.dr = Math.pow(0.95, fGuard);
    this.goldMul = 1 + fFort * 0.12;

    this.crit = hero.crit || 0.05;
    this.critMul = hero.critMul || 1.9;
    this.lifesteal = 0;
    this.regen = 0;
    this.magnet = 78;
    this.poison = 0;
    this.burnEvery = 0; this.burnDmg = 0; this.burnCount = 0;
    this.ricochet = 0;
    this.thorns = 0;
    this.dashBlade = 0;
    this.dashIfr = 0;
    this.shieldMax = 0; this.shield = 0; this.shieldT = 0;
    this.sandstorm = 0; this.sandT = 0;
    this.comboDmg = 0;
    this.falcons = 0;
    this.thunder = 0; this.thunderCount = 0;
    this.lastBreath = 0;
    this.lowHpDmg = 0;
    this.projExtra = 0;
    this.projSizeMul = 1;
    this.block = hero.block || 0;

    // ---- اندفاع ----
    this.dashMax = hero.dashMax + fWind;
    this.dashCharges = this.dashMax;
    this.dashCd = hero.dashCd;
    this.dashRegen = 0;
    this.dashing = 0; this.dashDur = 0.19; this.dashDir = 0;
    this.invuln = 0;
    this.perfectCd = 0;

    // ---- هجوم ----
    this.atkTimer = 0;
    this.swing = -1; this.swingT = 0; this.swingDur = 0.22;
    this.chain = 0; this.chainT = 0;
    this.combo = 0; this.comboT = 0;

    // ---- الضربة القاضية ----
    this.ult = 0; this.ultMax = 100;
    this.ultActive = 0; this.ultPhase = 0; this.ultData = null;

    this.hurtT = 0;
    this.dead = false;
    this.revives = S.forgeLevel('revive');
    this.upgrades = {};   // id -> عدد
    this.stats = { dmgDealt: 0, dmgTaken: 0, kills: 0, gold: 0, perfect: 0, noHitWave: true };
  }

  Player.prototype.addUpgrade = function (up) {
    this.upgrades[up.id] = (this.upgrades[up.id] || 0) + 1;
    up.ap(this);
    if (this.shieldMax > 0 && this.shield <= 0) this.shield = this.shieldMax;
  };

  Player.prototype.dmg = function () {
    var d = this.baseDmg * this.dmgMul;
    if (this.lowHpDmg && this.hp < this.maxHp * 0.4) d *= (1 + this.lowHpDmg);
    if (this.comboDmg) d *= (1 + Math.min(0.5 * this.comboDmg, this.combo * 0.02 * this.comboDmg));
    return d;
  };

  Player.prototype.speed = function () {
    return this.baseSpeed * this.speedMul;
  };

  Player.prototype.heal = function (n) {
    if (this.hp <= 0) return;
    var before = this.hp;
    this.hp = Math.min(this.maxHp, this.hp + n);
    var gained = this.hp - before;
    if (gained >= 1) FX.text(this.x, this.y - this.r - 14, '+' + U.ar(gained), { color: '#9ee5b0', size: 14 });
  };

  Player.prototype.gainUlt = function (n) {
    if (this.ultActive > 0) return;
    this.ult = U.clamp(this.ult + n, 0, this.ultMax);
  };

  Player.prototype.takeDamage = function (n, srcX, srcY) {
    if (this.dead) return 0;
    if (this.invuln > 0 || this.ultActive > 0) {
      if (this.perfectCd <= 0 && this.ultActive <= 0) {
        this.perfectCd = 0.4;
        this.stats.perfect++;
        FX.slow(0.32, 0.30);
        FX.text(this.x, this.y - this.r - 20, 'مُراوغة!', { color: '#9ed3f2', size: 15 });
        FX.ring(this.x, this.y, { r0: this.r, r1: this.r + 48, color: '#9ed3f2', life: 0.35, width: 3 });
        this.gainUlt(9);
        A.play('perfect');
      }
      return 0;
    }

    // صدّ أمامي لحامل الدرقة
    var dmg = n * this.dr;
    if (this.block > 0 && srcX !== undefined) {
      var a = U.angleTo(this.x, this.y, srcX, srcY);
      if (Math.abs(U.angDiff(this.facing, a)) < 1.05) {
        dmg *= (1 - this.block);
        A.play('clang');
        FX.spark(this.x + Math.cos(a) * this.r, this.y + Math.sin(a) * this.r,
          { a: a + Math.PI, speed: 200, color: '#ffe9b6', life: 0.3 });
        FX.text(this.x, this.y - this.r - 16, 'صدّ', { color: '#cfd4d8', size: 13 });
      }
    }

    if (this.shield > 0) {
      var absorbed = Math.min(this.shield, dmg);
      this.shield -= absorbed; dmg -= absorbed;
      FX.ring(this.x, this.y, { r0: this.r + 6, r1: this.r + 26, color: '#9fd7f2', life: 0.28, width: 3 });
      if (this.shield <= 0) A.play('clang');
    }
    this.shieldT = 0;

    dmg = Math.max(0, dmg);
    if (dmg <= 0) return 0;

    this.hp -= dmg;
    this.stats.dmgTaken += dmg;
    this.stats.noHitWave = false;
    this.hurtT = 0.30;
    this.invuln = Math.max(this.invuln, 0.58);
    this.gainUlt(dmg * 0.55);
    FX.shake(7 + Math.min(10, dmg * 0.3));
    FX.flash('#a8372c', 0.20, 0.20);
    FX.blood(this.x, this.y, srcX !== undefined ? U.angleTo(srcX, srcY, this.x, this.y) : undefined, 9);
    FX.text(this.x, this.y - this.r - 12, '−' + U.ar(dmg), { color: '#ff8f7a', size: 16 });
    A.play('hurt');
    if (MAL.Save.setting('haptics') && root.navigator && navigator.vibrate) { try { navigator.vibrate(18); } catch (e) {} }

    // شوكة الثأر
    if (this.thorns > 0) {
      this.game.areaDamage(this.x, this.y, 128, this.thorns, { knock: 420, color: '#ffb066', source: 'thorns' });
      FX.ring(this.x, this.y, { r0: 10, r1: 128, color: '#ffb066', life: 0.35, width: 5 });
    }

    if (this.hp <= 0) {
      if (this.lastBreath > 0) {
        this.lastBreath--;
        this.hp = this.maxHp * 0.4;
        this.invuln = 1.5;
        FX.flash('#f6d489', 0.6, 0.5);
        FX.ring(this.x, this.y, { r0: 10, r1: 220, color: '#f6d489', life: 0.7, width: 8 });
        FX.text(this.x, this.y - 40, 'نَفَسٌ أخير!', { color: '#f6d489', size: 22 });
        A.play('heal');
      } else if (this.revives > 0) {
        this.revives--;
        this.hp = this.maxHp * 0.5;
        this.invuln = 2.0;
        FX.flash('#9ee5b0', 0.6, 0.6);
        FX.ring(this.x, this.y, { r0: 10, r1: 260, color: '#9ee5b0', life: 0.8, width: 9 });
        FX.text(this.x, this.y - 40, 'نُصِرْت!', { color: '#9ee5b0', size: 24 });
        A.play('win');
      } else {
        this.hp = 0; this.dead = true;
      }
    }
    return dmg;
  };

  Player.prototype.tryDash = function () {
    if (this.dashCharges <= 0 || this.dashing > 0 || this.dead || this.ultActive > 0) return false;
    var mv = MAL.Input.move;
    var ang = (mv.mag > 0.15) ? Math.atan2(mv.y, mv.x) : this.facing;
    this.dashCharges--;
    this.dashing = this.dashDur;
    this.dashDir = ang;
    this.facing = ang;
    this.invuln = Math.max(this.invuln, this.dashDur + 0.10 + this.dashIfr);
    FX.dust(this.x, this.y, 8);
    FX.ring(this.x, this.y, { r0: this.r, r1: this.r + 34, color: 'rgba(240,228,200,.6)', life: 0.28, width: 3 });
    A.play('dash');
    return true;
  };

  Player.prototype.attack = function (game) {
    var ang = this.aimAngle;
    this.swing = 0; this.swingT = 0;
    this.chainT = 1.0;
    var hero = this.hero;

    if (hero.weapon === 'bow') {
      this.swingDur = 0.16;
      var n = 1 + this.projExtra;
      var spread = n > 1 ? 0.16 : 0;
      for (var i = 0; i < n; i++) {
        var a = ang + (i - (n - 1) / 2) * spread;
        game.spawnProjectile({
          x: this.x + Math.cos(a) * (this.r + 6),
          y: this.y + Math.sin(a) * (this.r + 6),
          ang: a, speed: 760, dmg: this.dmg(), team: 'player',
          kind: 'arrow', r: 4.5 * this.projSizeMul, life: (this.range * this.rangeMul) / 760,
          ricochet: this.ricochet, color: '#f6e6c0', owner: this
        });
      }
      A.play('bow');
      return;
    }

    // ---- سلاح تلامسي ----
    this.chain = (this.chain + 1) % 3;
    var finisher = this.chain === 2;
    this.swingDur = finisher ? 0.30 : 0.20;
    var reach = this.range * this.rangeMul * (finisher ? 1.22 : 1);
    var half = (this.arc + this.arcBonus) / 2 * (finisher ? 1.3 : 1);
    var dmg = this.dmg() * (finisher ? 1.65 : 1);

    var hits = game.meleeHit(this.x, this.y, ang, reach, half, dmg, {
      knock: finisher ? 460 : 190, owner: this, finisher: finisher
    });

    FX.slash(this.x + Math.cos(ang) * this.r * 0.5, this.y + Math.sin(ang) * this.r * 0.5,
      ang, reach * 0.86, half * 2, finisher ? 'rgba(255,214,150,0.95)' : 'rgba(255,246,223,0.8)',
      finisher ? 0.26 : 0.18);
    A.play('swing', finisher ? 1 : 0);
    if (finisher) {
      FX.shake(3);
      FX.burst(this.x + Math.cos(ang) * reach * 0.5, this.y + Math.sin(ang) * reach * 0.5, 6, '#ffd88a',
        { a: ang, spread: half, min: 90, max: 260 });
    }
    if (hits === 0 && finisher) FX.dust(this.x + Math.cos(ang) * 30, this.y + Math.sin(ang) * 30, 4);
  };

  Player.prototype.useUlt = function (game) {
    if (this.ult < this.ultMax || this.ultActive > 0 || this.dead) return false;
    this.ult = 0;
    var id = this.hero.ult.id;
    A.play('ult');
    FX.flash('#f6d489', 0.35, 0.4);
    FX.shake(10);

    if (id === 'karra') {                    // دوّامة الفارس
      this.ultActive = 1.15; this.ultPhase = 0;
      this.ultData = { tick: 0, hits: 0 };
    } else if (id === 'wabil') {             // وابل السهام
      this.ultActive = 1.35; this.ultPhase = 0;
      this.ultData = { fired: 0, timer: 0 };
    } else if (id === 'sadma') {             // صدمة الدرقة
      this.ultActive = 0.7;
      this.shield = Math.max(this.shield, 60 + this.shieldMax);
      game.areaDamage(this.x, this.y, 210, this.dmg() * 2.2, { knock: 900, stun: 1.6, color: '#cfd4d8' });
      FX.ring(this.x, this.y, { r0: 20, r1: 230, color: '#e8f0ff', life: 0.5, width: 12 });
      FX.ring(this.x, this.y, { r0: 20, r1: 170, color: '#9fd7f2', life: 0.35, width: 7 });
      FX.shake(16);
      A.play('explode');
    } else if (id === 'tayf') {              // طيف العيّار
      this.ultActive = 1.5; this.ultPhase = 0;
      FX.slow(0.28, 1.3);
      this.ultData = { targets: [], timer: 0, idx: 0 };
      var list = game.enemies.slice().filter(function (e) { return !e.dead; });
      list.sort(function (a, b) {
        return U.dist2(this.x, this.y, a.x, a.y) - U.dist2(this.x, this.y, b.x, b.y);
      }.bind(this));
      this.ultData.targets = list.slice(0, 5);
    }
    return true;
  };

  Player.prototype.updateUlt = function (dt, game) {
    if (this.ultActive <= 0) return;
    this.ultActive -= dt;
    var id = this.hero.ult.id;
    var d = this.ultData;

    if (id === 'karra') {
      this.facing += dt * 22;
      d.tick -= dt;
      FX.spark(this.x + Math.cos(this.facing) * 46, this.y + Math.sin(this.facing) * 46,
        { a: this.facing + Math.PI / 2, speed: 120, color: '#ffe9b6', life: 0.25 });
      if (d.tick <= 0) {
        d.tick = 0.28;
        game.areaDamage(this.x, this.y, 108, this.dmg() * 1.15, { knock: 260, color: '#ffd88a' });
        FX.ring(this.x, this.y, { r0: 24, r1: 112, color: 'rgba(255,214,150,.8)', life: 0.3, width: 6 });
        A.play('swing', 1);
        FX.shake(4);
      }
    } else if (id === 'wabil') {
      d.timer -= dt;
      if (d.timer <= 0) {
        d.timer = 0.075;
        var alive = game.enemies.filter(function (e) { return !e.dead; });
        if (alive.length) {
          var t = alive[(Math.random() * alive.length) | 0];
          var ax = t.x + U.rand(-28, 28), ay = t.y + U.rand(-28, 28);
          game.skyArrow(ax, ay, this.dmg() * 0.85, this);
        } else {
          var aa = U.rand(0, U.TAU), dd = U.rand(0, 260);
          game.skyArrow(this.x + Math.cos(aa) * dd, this.y + Math.sin(aa) * dd, this.dmg() * 0.85, this);
        }
      }
    } else if (id === 'tayf') {
      d.timer -= dt;
      if (d.timer <= 0 && d.idx < d.targets.length) {
        d.timer = 0.18;
        var e = d.targets[d.idx++];
        if (e && !e.dead) {
          var ang = U.angleTo(this.x, this.y, e.x, e.y);
          this.x = e.x - Math.cos(ang) * (e.r + this.r + 4);
          this.y = e.y - Math.sin(ang) * (e.r + this.r + 4);
          this.facing = ang;
          game.hitEnemy(e, this.dmg() * 3.2, { crit: true, knock: 300, ang: ang, owner: this });
          FX.slash(this.x, this.y, ang, 70, 2.4, 'rgba(200,180,255,0.95)', 0.22);
          FX.burst(e.x, e.y, 12, '#c8a2e6', { min: 100, max: 320 });
          A.play('hit', 1);
        }
      }
    }

    if (this.ultActive <= 0) {
      this.ultActive = 0; this.ultData = null;
      if (id === 'tayf') FX.slow(1, 0);
    }
  };

  Player.prototype.update = function (dt, game) {
    var I = MAL.Input;
    if (this.dead) return;

    // ---- عدّادات ----
    this.hurtT = Math.max(0, this.hurtT - dt);
    this.invuln = Math.max(0, this.invuln - dt);
    this.perfectCd = Math.max(0, this.perfectCd - dt);
    this.atkTimer = Math.max(0, this.atkTimer - dt);
    this.chainT = Math.max(0, this.chainT - dt);
    if (this.chainT <= 0) this.chain = -1;
    this.comboT = Math.max(0, this.comboT - dt);
    if (this.comboT <= 0 && this.combo > 0) this.combo = 0;

    if (this.dashCharges < this.dashMax) {
      this.dashRegen += dt;
      if (this.dashRegen >= this.dashCd) { this.dashRegen = 0; this.dashCharges++; }
    } else this.dashRegen = 0;

    if (this.regen > 0) this.heal(this.regen * dt);

    if (this.shieldMax > 0) {
      this.shieldT += dt;
      if (this.shieldT > 5 && this.shield < this.shieldMax) {
        this.shield = Math.min(this.shieldMax, this.shield + this.shieldMax * dt * 0.8);
      }
    }

    if (this.sandstorm > 0) {
      this.sandT -= dt;
      if (this.sandT <= 0) {
        this.sandT = 8;
        game.areaDamage(this.x, this.y, 165, 22 * this.sandstorm, { slow: 2.2, color: '#e0c98a' });
        FX.ring(this.x, this.y, { r0: 18, r1: 170, color: 'rgba(224,201,138,.7)', life: 0.55, width: 8 });
        for (var s = 0; s < 22; s++) {
          FX.spark(this.x, this.y, { a: U.rand(0, U.TAU), speed: U.rand(120, 320), color: '#e0c98a', life: 0.6, drag: 0.94 });
        }
        A.play('dash');
      }
    }

    // ---- الضربة القاضية ----
    if (this.ultActive > 0) { this.updateUlt(dt, game); }

    // ---- الحركة ----
    var spd = this.speed();
    if (this.dashing > 0) {
      this.dashing -= dt;
      var dspeed = 720;
      this.vx = Math.cos(this.dashDir) * dspeed;
      this.vy = Math.sin(this.dashDir) * dspeed;
      if (this.dashBlade > 0) {
        game.areaDamage(this.x, this.y, this.r + 26, this.dashBlade * dt * 6, { noText: true, color: '#c8a2e6' });
      }
      if (Math.random() < 0.8) {
        FX.spark(this.x, this.y, { a: this.dashDir + Math.PI + U.rand(-.5, .5), speed: U.rand(40, 130), color: 'rgba(240,228,200,.75)', life: 0.3, size: 3, glow: false });
      }
    } else if (this.ultActive > 0 && this.hero.ult.id !== 'karra') {
      this.vx *= 0.8; this.vy *= 0.8;
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

    if (this.vx || this.vy) {
      if (Math.hypot(this.vx, this.vy) > 40 && Math.random() < dt * 12) {
        FX.dust(this.x, this.y + this.r * 0.4, 1);
      }
    }

    // ---- الاتجاه والتصويب ----
    var target = game.nearestEnemy(this.x, this.y, this.range * this.rangeMul * 2.4);
    if (I.aim.active) {
      if (I.aim.fromMouse) {
        var wp = game.screenToWorld(I.mouse.x, I.mouse.y);
        this.aimAngle = U.angleTo(this.x, this.y, wp.x, wp.y);
      } else {
        this.aimAngle = Math.atan2(I.aim.y, I.aim.x);
      }
    } else if (target) {
      var lead = this.aimAngle;
      this.aimAngle = U.angApproach(lead, U.angleTo(this.x, this.y, target.x, target.y), dt * 14);
    } else if (I.move.mag > 0.15) {
      this.aimAngle = Math.atan2(I.move.y, I.move.x);
    }

    if (this.dashing > 0) this.facing = this.dashDir;
    else if (this.ultActive > 0 && this.hero.ult.id === 'karra') { /* يدور تلقائياً */ }
    else this.facing = U.angApproach(this.facing, this.aimAngle, dt * 18);

    // ---- الهجوم التلقائي ----
    if (this.ultActive <= 0 && this.dashing <= 0 && this.atkTimer <= 0) {
      var canAuto = MAL.Save.setting('autoAim') !== 0;
      var wantShoot = I.aim.active || (canAuto && target && U.dist(this.x, this.y, target.x, target.y) <= this.range * this.rangeMul * 1.15);
      if (wantShoot) {
        this.attack(game);
        this.atkTimer = this.atkCd / this.atkSpeedMul;
      }
    }

    if (this.swing >= 0) {
      this.swingT += dt;
      this.swing = this.swingT / this.swingDur;
      if (this.swing >= 1) { this.swing = -1; this.swingT = 0; }
    }

    if (this.dashing <= 0) this.dashing = 0;
  };

  Player.prototype.onHitEnemy = function (dmgDealt, e, game) {
    this.stats.dmgDealt += dmgDealt;
    this.combo++; this.comboT = 2.4;
    this.gainUlt(dmgDealt * 0.30);
    if (this.lifesteal > 0) this.heal(dmgDealt * this.lifesteal);

    if (this.poison > 0 && e && !e.dead) {
      e.poisonT = 3; e.poisonDps = this.poison; e.poisonOwner = this;
    }
    if (this.burnEvery > 0) {
      this.burnCount++;
      if (this.burnCount >= this.burnEvery) {
        this.burnCount = 0;
        game.explosion(e ? e.x : this.x, e ? e.y : this.y, 92, this.burnDmg, '#ff8a3a');
      }
    }
    if (this.thunder > 0) {
      this.thunderCount++;
      if (this.thunderCount >= 4) {
        this.thunderCount = 0;
        game.thunderStrike(e ? e.x : this.x, e ? e.y : this.y, 3, this.dmg() * 1.4 * this.thunder);
      }
    }
  };

  Player.prototype.draw = function (c, time) {
    var hero = this.hero;
    var blink = this.invuln > 0 && this.dashing <= 0 && Math.floor(time * 22) % 2 === 0;

    // حلقة البطل — تُبقيه مميّزاً وسط الزحام
    c.save();
    c.globalAlpha = 0.16;
    c.fillStyle = hero.colors.trim;
    c.beginPath();
    c.ellipse(this.x, this.y + this.r * 0.42, this.r * 1.5, this.r * 0.72, 0, 0, U.TAU);
    c.fill();
    c.globalAlpha = 0.5;
    c.strokeStyle = hero.colors.trim;
    c.lineWidth = 1.8;
    c.beginPath();
    c.ellipse(this.x, this.y + this.r * 0.42, this.r * 1.42, this.r * 0.66, 0, 0, U.TAU);
    c.stroke();
    c.restore();

    R.shadow(c, this.x, this.y, this.r, 0.42);

    if (this.shield > 0) {
      c.save();
      c.globalAlpha = 0.22 + 0.12 * Math.sin(time * 5);
      c.fillStyle = '#9fd7f2';
      c.beginPath(); c.arc(this.x, this.y, this.r + 11, 0, U.TAU); c.fill();
      c.globalAlpha = 0.6;
      c.strokeStyle = '#cfeaff'; c.lineWidth = 2;
      c.beginPath(); c.arc(this.x, this.y, this.r + 11, 0, U.TAU); c.stroke();
      c.restore();
    }

    if (!blink) {
      c.save();
      if (this.ultActive > 0) {
        c.shadowBlur = 22; c.shadowColor = hero.colors.trim;
      }
      R.warrior(c, {
        x: this.x, y: this.y, r: this.r, facing: this.facing, walk: this.walk,
        swing: this.swing, cloth: hero.colors.cloth, trim: hero.colors.trim,
        metal: hero.colors.metal, skin: hero.colors.skin, weapon: hero.weapon,
        helm: hero.id === 'ayyar' ? 'hood' : (hero.id === 'dariq' ? 'helmet' : 'turban'),
        cape: hero.id === 'faris', hurt: this.hurtT / 0.3
      });
      c.restore();
    }

    // مؤشر التصويب
    if (MAL.Input.aim.active && this.ultActive <= 0) {
      c.save();
      c.globalAlpha = 0.35;
      c.strokeStyle = hero.colors.trim;
      c.lineWidth = 2; c.setLineDash([6, 8]);
      c.beginPath();
      c.moveTo(this.x + Math.cos(this.aimAngle) * (this.r + 8), this.y + Math.sin(this.aimAngle) * (this.r + 8));
      var far = hero.weapon === 'bow' ? Math.min(260, this.range * this.rangeMul) : this.range * this.rangeMul;
      c.lineTo(this.x + Math.cos(this.aimAngle) * far, this.y + Math.sin(this.aimAngle) * far);
      c.stroke();
      c.setLineDash([]);
      c.restore();
    }
  };

  /* =========================================================
     العدو
     ========================================================= */
  function Enemy(cfg, x, y, scale, game) {
    this.kind = 'enemy';
    this.cfg = cfg;
    this.type = cfg.id;
    this.name = cfg.name;
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.knockX = 0; this.knockY = 0;
    this.r = cfg.r;
    this.maxHp = Math.round(cfg.hp * (scale.hp || 1));
    this.hp = this.maxHp;
    this.speed = cfg.speed * (scale.speed || 1);
    this.dmg = cfg.dmg * (scale.dmg || 1);
    this.gold = cfg.gold;
    this.facing = U.angleTo(x, y, 0, 0);
    this.walk = 0;
    this.atkCd = cfg.atkCd;
    this.atkTimer = U.rand(0.3, cfg.atkCd);
    this.state = 'idle';
    this.stateT = 0;
    this.swing = -1; this.swingT = 0;
    this.hurtT = 0;
    this.dead = false; this.remove = false;
    this.poisonT = 0; this.poisonDps = 0;
    this.slowT = 0; this.stunT = 0;
    this.guardHits = 0; this.guardT = 0;
    this.spawnT = 0.45;
    this.buffed = 0;
    this.pal = game.region.pal;
    this.seed = Math.random() * 100;
  }

  Enemy.prototype.hurt = function (n, o, game) {
    if (this.dead) return 0;
    o = o || {};
    var dmg = n;
    // صدّ التُّرس من الأمام — ويتحطّم إذا توالت عليه الضربات
    if (this.cfg.block && this.guardT <= 0 && o.ang !== undefined) {
      if (Math.abs(U.angDiff(this.facing, o.ang + Math.PI)) < 1.0) {
        dmg *= (1 - this.cfg.block);
        this.guardHits++;
        A.play('clang');
        FX.spark(this.x, this.y, { a: o.ang + Math.PI, speed: 220, color: '#ffe9b6', life: 0.3, size: 3 });
        if (this.guardHits >= 4) {
          this.guardHits = 0;
          this.guardT = 2.4;
          this.stunT = Math.max(this.stunT, 0.9);
          FX.text(this.x, this.y - this.r - 10, 'تحطّم التُّرس!', { color: '#ffd166', size: 14 });
          FX.shard(this.x, this.y, '#cfd4d8', 7);
          FX.ring(this.x, this.y, { r0: 6, r1: 46, color: '#ffd166', life: 0.35, width: 3 });
        } else if (!o.noText) {
          FX.text(this.x, this.y - this.r - 8, 'صدّ', { color: '#cfd4d8', size: 12 });
        }
      }
    }
    dmg = Math.max(1, dmg);
    this.hp -= dmg;
    this.hurtT = 0.18;
    if (o.knock) applyKnock(this, o.ang === undefined ? U.rand(0, U.TAU) : o.ang, o.knock);
    if (o.stun) this.stunT = Math.max(this.stunT, o.stun);
    if (o.slow) this.slowT = Math.max(this.slowT, o.slow);

    if (!o.noText) {
      FX.text(this.x + U.rand(-6, 6), this.y - this.r - 6, U.ar(dmg), {
        color: o.crit ? '#ffd166' : (o.color || '#fff2d4'),
        size: o.crit ? 19 : 15, crit: o.crit
      });
    }
    FX.blood(this.x, this.y, o.ang, o.crit ? 10 : 5, this.pal.enemy);

    if (this.hp <= 0) this.die(game, o);
    return dmg;
  };

  Enemy.prototype.die = function (game, o) {
    if (this.dead) return;
    this.dead = true; this.remove = true;
    FX.blood(this.x, this.y, o && o.ang, 16, this.pal.enemy);
    FX.decal(this.x, this.y, 12 + Math.random() * 10, U.rgba(this.pal.enemy, 0.35));
    FX.burst(this.x, this.y, 8, U.shade(this.pal.enemy, .3), { min: 60, max: 220 });
    FX.shard(this.x, this.y, this.pal.stone, 4);
    A.play('kill');
    game.onEnemyKilled(this);
  };

  Enemy.prototype.attackPlayer = function (game, mult) {
    var p = game.player;
    if (p.dead) return;
    if (U.dist(this.x, this.y, p.x, p.y) <= this.cfg.atkRange + p.r) {
      p.takeDamage(this.dmg * (mult || 1) * (this.buffed ? 1.2 : 1), this.x, this.y);
    }
  };

  Enemy.prototype.update = function (dt, game) {
    var p = game.player;
    if (this.spawnT > 0) { this.spawnT -= dt; }
    this.hurtT = Math.max(0, this.hurtT - dt);
    this.stunT = Math.max(0, this.stunT - dt);
    this.slowT = Math.max(0, this.slowT - dt);
    this.guardT = Math.max(0, this.guardT - dt);
    this.buffed = Math.max(0, this.buffed - dt);

    if (this.poisonT > 0) {
      this.poisonT -= dt;
      var pd = this.poisonDps * dt;
      this.hp -= pd;
      if (Math.random() < dt * 8) {
        FX.spark(this.x + U.rand(-8, 8), this.y + U.rand(-8, 8),
          { a: -Math.PI / 2, speed: 30, color: '#7ad17a', life: 0.4, size: 2 });
      }
      if (this.hp <= 0) { this.die(game, {}); return; }
    }

    var dToP = U.dist(this.x, this.y, p.x, p.y);
    var angToP = U.angleTo(this.x, this.y, p.x, p.y);
    var spd = this.speed * (this.slowT > 0 ? 0.45 : 1) * (this.buffed ? 1.2 : 1) * game.pressure();
    var mvx = 0, mvy = 0;

    if (this.stunT > 0 || this.spawnT > 0) {
      // مذهول
    } else {
      var ai = this.cfg.ai;
      this.atkTimer -= dt;

      if (ai === 'chase' || ai === 'shield' || ai === 'captain') {
        var wantD = this.cfg.atkRange * 0.6;
        if (dToP > wantD) { mvx = Math.cos(angToP); mvy = Math.sin(angToP); }
        this.facing = U.angApproach(this.facing, angToP, dt * 6);
        if (this.state === 'windup') {
          this.stateT -= dt;
          if (this.stateT <= 0) {
            this.state = 'idle';
            this.swing = 0; this.swingT = 0;
            this.attackPlayer(game);
            A.play('swing');
            FX.slash(this.x, this.y, this.facing, this.cfg.atkRange, 1.3, 'rgba(255,180,150,0.7)', 0.18);
            if (ai === 'captain') {
              game.areaDamage(this.x, this.y, 120, this.dmg * 0.8, { knock: 300, targetPlayer: true, enemySource: this });
              FX.ring(this.x, this.y, { r0: 14, r1: 124, color: '#ffb066', life: 0.35, width: 5 });
            }
          }
        } else if (dToP < this.cfg.atkRange + p.r && this.atkTimer <= 0 && game.requestAttack(this)) {
          this.state = 'windup'; this.stateT = 0.46;
          this.atkTimer = this.atkCd;
        }
        if (ai === 'captain') {
          // هالة تقوية للحلفاء
          for (var q = 0; q < game.enemies.length; q++) {
            var e2 = game.enemies[q];
            if (e2 !== this && !e2.dead && U.dist2(this.x, this.y, e2.x, e2.y) < 160 * 160) e2.buffed = 0.5;
          }
        }
      } else if (ai === 'ranged' || ai === 'lob' || ai === 'fire') {
        var keep = this.cfg.keep || 220;
        if (dToP < keep * 0.75) { mvx = -Math.cos(angToP); mvy = -Math.sin(angToP); }
        else if (dToP > keep * 1.15) { mvx = Math.cos(angToP); mvy = Math.sin(angToP); }
        else {
          var side = (this.seed % 2 === 0 ? 1 : -1);
          mvx = Math.cos(angToP + Math.PI / 2) * side * 0.55;
          mvy = Math.sin(angToP + Math.PI / 2) * side * 0.55;
        }
        this.facing = U.angApproach(this.facing, angToP, dt * 7);

        if (this.state === 'aim') {
          this.stateT -= dt;
          if (this.stateT <= 0) {
            this.state = 'idle';
            this.swing = 0; this.swingT = 0;
            if (ai === 'ranged') {
              game.spawnProjectile({
                x: this.x + Math.cos(this.facing) * (this.r + 4),
                y: this.y + Math.sin(this.facing) * (this.r + 4),
                ang: this.facing, speed: 400, dmg: this.dmg, team: 'enemy',
                kind: 'arrow', r: 4, life: 2.4, color: '#e8c7a0'
              });
              A.play('bow');
            } else if (ai === 'lob') {
              game.spawnLob(this.x, this.y, p.x + p.vx * 0.35, p.y + p.vy * 0.35, this.dmg, 'stone');
              A.play('swing');
            } else {
              game.spawnLob(this.x, this.y, p.x + p.vx * 0.3, p.y + p.vy * 0.3, this.dmg, 'fire');
              A.play('fire');
            }
          }
        } else if (dToP < this.cfg.atkRange && this.atkTimer <= 0 && game.requestAttack(this)) {
          this.state = 'aim'; this.stateT = ai === 'ranged' ? 0.62 : 0.82;
          this.atkTimer = this.atkCd;
          if (ai === 'ranged') {
            FX.ring(this.x, this.y, { r0: 4, r1: 20, color: '#ffb066', life: 0.3, width: 2 });
          }
        }
      } else if (ai === 'charge' || ai === 'rider') {
        var trigger = ai === 'rider' ? 340 : 230;
        if (this.state === 'idle') {
          if (dToP > trigger) { mvx = Math.cos(angToP); mvy = Math.sin(angToP); }
          else if (dToP < trigger * 0.55 && ai === 'rider') { mvx = -Math.cos(angToP); mvy = -Math.sin(angToP); }
          else {
            mvx = Math.cos(angToP + Math.PI / 2) * 0.5;
            mvy = Math.sin(angToP + Math.PI / 2) * 0.5;
          }
          this.facing = U.angApproach(this.facing, angToP, dt * 5);
          if (this.atkTimer <= 0 && dToP < trigger && game.requestAttack(this)) {
            this.state = 'windup'; this.stateT = ai === 'rider' ? 0.55 : 0.7;
            this.atkTimer = this.atkCd;
          }
        } else if (this.state === 'windup') {
          this.stateT -= dt;
          this.facing = U.angApproach(this.facing, angToP, dt * 3);
          mvx = -Math.cos(this.facing) * 0.35; mvy = -Math.sin(this.facing) * 0.35;
          if (this.stateT <= 0) {
            this.state = 'charging'; this.stateT = ai === 'rider' ? 0.75 : 0.5;
            this.chargeDir = this.facing;
            A.play('dash');
            FX.dust(this.x, this.y, 6);
          }
        } else if (this.state === 'charging') {
          this.stateT -= dt;
          mvx = Math.cos(this.chargeDir) * (ai === 'rider' ? 3.0 : 2.6);
          mvy = Math.sin(this.chargeDir) * (ai === 'rider' ? 3.0 : 2.6);
          if (Math.random() < dt * 30) FX.dust(this.x, this.y, 1);
          if (dToP < this.r + p.r + 8) {
            p.takeDamage(this.dmg, this.x, this.y);
            applyKnock(p, angToP, 260);
            this.state = 'recover'; this.stateT = 0.7;
            FX.shake(8);
          }
          if (this.stateT <= 0) { this.state = 'recover'; this.stateT = ai === 'rider' ? 0.35 : 0.6; }
        } else if (this.state === 'recover') {
          this.stateT -= dt;
          if (this.stateT <= 0) this.state = 'idle';
        }
      }
    }

    // ---- الحركة والفصل ----
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

  Enemy.prototype.draw = function (c, time) {
    var pal = this.pal, cfg = this.cfg;
    // قاعدة داكنة دائماً كي تنفصل صور الأعداء عن الأرضية مهما كان لون الإقليم
    var base = U.shade(pal.enemy, -.46);
    var cloth = base, trim = pal.accent, metal = '#d5dade';
    var helm = 'turban', weapon = 'sword';

    if (this.type === 'archer') { weapon = 'bow'; cloth = U.shade(base, .16); trim = '#c9b393'; helm = 'hood'; }
    else if (this.type === 'shieldman') { weapon = 'shield'; cloth = U.shade(base, -.25); trim = '#cfd4d8'; helm = 'helmet'; }
    else if (this.type === 'charger') { weapon = 'axe'; cloth = U.mixHex(base, '#8a2f22', .35); trim = '#e0946a'; helm = 'helmet'; }
    else if (this.type === 'slinger') { weapon = 'sling'; cloth = U.shade(base, .26); trim = '#b8a17d'; helm = 'hood'; }
    else if (this.type === 'naffat') { weapon = 'torch'; cloth = U.mixHex(base, '#7a3a12', .4); trim = '#ff9d3a'; helm = 'hood'; }
    else if (this.type === 'horseman') { weapon = 'spear'; cloth = U.shade(base, -.12); trim = '#9ed3f2'; helm = 'helmet'; }
    else if (this.type === 'captain') { weapon = 'sword'; cloth = U.shade(base, -.35); trim = pal.accent; helm = 'crown'; }

    var scale = this.spawnT > 0 ? U.lerp(0.2, 1, U.easeOutBack(1 - this.spawnT / 0.45)) : 1;

    R.shadow(c, this.x, this.y, this.r * scale, 0.36);

    // تحذير الشحن
    if (this.state === 'windup' && (cfg.ai === 'charge' || cfg.ai === 'rider')) {
      R.telegraphLine(c, this.x, this.y, this.facing, 240, 28, 1 - this.stateT / 0.65, '#e0573f');
    }
    if (this.state === 'windup' && (cfg.ai === 'chase' || cfg.ai === 'shield' || cfg.ai === 'captain')) {
      c.save();
      c.globalAlpha = 0.3;
      c.fillStyle = '#e0573f';
      c.beginPath();
      c.moveTo(this.x, this.y);
      c.arc(this.x, this.y, cfg.atkRange, this.facing - 0.7, this.facing + 0.7);
      c.closePath(); c.fill();
      c.restore();
    }
    if (this.state === 'aim') {
      c.save();
      c.globalAlpha = 0.22;
      c.strokeStyle = '#ffb066'; c.lineWidth = 1.5;
      c.setLineDash([4, 9]);
      c.beginPath();
      c.moveTo(this.x, this.y);
      c.lineTo(this.x + Math.cos(this.facing) * 215, this.y + Math.sin(this.facing) * 215);
      c.stroke(); c.setLineDash([]);
      c.restore();
    }

    if (this.buffed > 0) {
      c.save();
      c.globalAlpha = 0.25 + 0.1 * Math.sin(time * 8);
      c.strokeStyle = pal.accent; c.lineWidth = 2;
      c.beginPath(); c.arc(this.x, this.y, this.r + 8, 0, U.TAU); c.stroke();
      c.restore();
    }
    if (this.slowT > 0) {
      c.save();
      c.globalAlpha = 0.3;
      c.fillStyle = '#9ed3f2';
      c.beginPath(); c.arc(this.x, this.y, this.r + 4, 0, U.TAU); c.fill();
      c.restore();
    }

    R.warrior(c, {
      x: this.x, y: this.y, r: this.r * scale, facing: this.facing, walk: this.walk,
      swing: this.swing, cloth: cloth, trim: trim, metal: metal, skin: '#a8734e',
      weapon: weapon, helm: helm, hurt: this.hurtT / 0.18,
      cape: this.type === 'captain'
    });

    // شريط الصحة للأقوياء
    if (this.maxHp > 60 && this.hp < this.maxHp) {
      var w = this.r * 2.2, hp = U.clamp(this.hp / this.maxHp, 0, 1);
      c.save();
      c.fillStyle = 'rgba(0,0,0,.55)';
      c.fillRect(this.x - w / 2, this.y - this.r - 16, w, 4);
      c.fillStyle = this.cfg.elite ? '#f6d489' : '#e0573f';
      c.fillRect(this.x - w / 2, this.y - this.r - 16, w * hp, 4);
      c.restore();
    }
    if (this.poisonT > 0) {
      c.save();
      c.globalAlpha = 0.5;
      c.fillStyle = '#7ad17a';
      c.beginPath(); c.arc(this.x + this.r * .7, this.y - this.r * .9, 3, 0, U.TAU); c.fill();
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
    this.pierce = o.pierce || 0;
    this.ricochet = o.ricochet || 0;
    this.owner = o.owner || null;
    this.hitSet = [];
    this.remove = false;
    this.trail = 0;
  }

  Projectile.prototype.update = function (dt, game) {
    this.life -= dt;
    if (this.life <= 0) { this.remove = true; return; }
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.kind === 'fire' || this.kind === 'orb') {
      this.trail -= dt;
      if (this.trail <= 0) {
        this.trail = 0.03;
        FX.spark(this.x, this.y, { speed: 20, color: this.kind === 'fire' ? '#ff8a3a' : (this.color || '#e0573f'), life: 0.3, size: 2.5 });
      }
    }

    // خارج الساحة
    if (Math.hypot(this.x, this.y) > game.arenaR + 20) {
      this.remove = true;
      FX.spark(this.x, this.y, { speed: 60, color: '#e8dcc3', life: 0.2 });
      return;
    }
    // العوائق
    for (var i = 0; i < game.obstacles.length; i++) {
      var o = game.obstacles[i];
      if (U.dist2(this.x, this.y, o.x, o.y) < (o.r + this.r) * (o.r + this.r)) {
        this.remove = true;
        FX.burst(this.x, this.y, 5, '#d9cdb4', { min: 30, max: 120 });
        A.play('arrowHit');
        return;
      }
    }

    if (this.team === 'player') {
      for (var e = 0; e < game.enemies.length; e++) {
        var en = game.enemies[e];
        if (en.dead || this.hitSet.indexOf(en) >= 0) continue;
        if (U.dist2(this.x, this.y, en.x, en.y) < (en.r + this.r) * (en.r + this.r)) {
          var ang = Math.atan2(this.vy, this.vx);
          game.hitEnemy(en, this.dmg, { ang: ang, knock: 140, owner: this.owner });
          this.hitSet.push(en);
          A.play('arrowHit');
          FX.burst(this.x, this.y, 5, '#ffd88a', { a: ang + Math.PI, spread: 1, min: 40, max: 160 });
          if (this.ricochet > 0) {
            var next = game.nearestEnemy(this.x, this.y, 320, this.hitSet);
            if (next) {
              this.ricochet--;
              var na = U.angleTo(this.x, this.y, next.x, next.y);
              this.vx = Math.cos(na) * this.speed;
              this.vy = Math.sin(na) * this.speed;
              this.life = Math.max(this.life, 0.7);
              continue;
            }
          }
          if (this.pierce > 0) { this.pierce--; continue; }
          this.remove = true;
          return;
        }
      }
    } else {
      var p = game.player;
      if (!p.dead && U.dist2(this.x, this.y, p.x, p.y) < (p.r + this.r) * (p.r + this.r)) {
        p.takeDamage(this.dmg, this.x - this.vx * 0.05, this.y - this.vy * 0.05);
        this.remove = true;
        FX.burst(this.x, this.y, 5, '#ff8f7a', { min: 40, max: 160 });
      }
    }
  };

  /* =========================================================
     المقذوف القوسي (حجر/نار) + دائرة التحذير
     ========================================================= */
  function Lob(x, y, tx, ty, dmg, kind) {
    this.x = x; this.y = y;
    this.sx = x; this.sy = y;
    this.tx = tx; this.ty = ty;
    this.t = 0;
    this.dur = U.clamp(U.dist(x, y, tx, ty) / 340, 0.55, 1.3);
    this.dmg = dmg;
    this.kind = kind;
    this.remove = false;
    this.r = kind === 'fire' ? 9 : 7;
  }
  Lob.prototype.update = function (dt, game) {
    this.t += dt;
    var k = U.clamp(this.t / this.dur, 0, 1);
    this.x = U.lerp(this.sx, this.tx, k);
    this.y = U.lerp(this.sy, this.ty, k) - Math.sin(k * Math.PI) * 90;
    if (k >= 1) {
      this.remove = true;
      if (this.kind === 'fire') {
        game.spawnHazard(this.tx, this.ty, 62, 5.5, this.dmg * 0.5);
        game.explosion(this.tx, this.ty, 62, this.dmg * 0.7, '#ff8a3a', true);
      } else {
        game.explosion(this.tx, this.ty, 58, this.dmg, '#c9b393', true);
      }
    }
  };
  Lob.prototype.draw = function (c) {
    var k = U.clamp(this.t / this.dur, 0, 1);
    // دائرة الهبوط
    R.telegraph(c, this.tx, this.ty, this.r * 6, k, this.kind === 'fire' ? '#ff8a3a' : '#d9cdb4');
    c.save();
    c.translate(this.x, this.y);
    if (this.kind === 'fire') {
      c.shadowBlur = 14; c.shadowColor = '#ff8a3a';
      c.fillStyle = '#ff8a3a';
      c.beginPath(); c.arc(0, 0, this.r, 0, U.TAU); c.fill();
      c.fillStyle = '#ffe08a';
      c.beginPath(); c.arc(0, 0, this.r * .5, 0, U.TAU); c.fill();
      c.shadowBlur = 0;
    } else {
      c.fillStyle = '#8d7154';
      c.beginPath(); c.arc(0, 0, this.r, 0, U.TAU); c.fill();
      c.fillStyle = 'rgba(255,255,255,.2)';
      c.beginPath(); c.arc(-2, -2, this.r * .4, 0, U.TAU); c.fill();
    }
    c.restore();
  };

  /* =========================================================
     سهم من السماء (للضربة القاضية)
     ========================================================= */
  function SkyArrow(x, y, dmg, owner) {
    this.tx = x; this.ty = y;
    this.t = 0; this.dur = 0.42;
    this.dmg = dmg; this.owner = owner;
    this.remove = false;
  }
  SkyArrow.prototype.update = function (dt, game) {
    this.t += dt;
    if (this.t >= this.dur) {
      this.remove = true;
      game.explosion(this.tx, this.ty, 46, this.dmg, '#f6e6c0', true, this.owner);
      FX.spark(this.tx, this.ty, { a: -Math.PI / 2, speed: 200, color: '#fff2d4', life: 0.3 });
    }
  };
  SkyArrow.prototype.draw = function (c) {
    var k = U.clamp(this.t / this.dur, 0, 1);
    R.telegraph(c, this.tx, this.ty, 34, k, '#f6d489');
    var y = this.ty - (1 - k) * 320;
    c.save();
    c.translate(this.tx, y);
    c.fillStyle = '#f6e6c0';
    c.shadowBlur = 8; c.shadowColor = '#f6d489';
    c.beginPath();
    c.moveTo(0, 10); c.lineTo(-3.5, -8); c.lineTo(0, -4); c.lineTo(3.5, -8);
    c.closePath(); c.fill();
    c.restore();
  };

  /* =========================================================
     الأخطار الأرضية (برك النار)
     ========================================================= */
  function Hazard(x, y, r, life, dps) {
    this.x = x; this.y = y; this.r = r;
    this.life = life; this.max = life; this.dps = dps;
    this.remove = false; this.tick = 0; this.seed = Math.random() * 10;
  }
  Hazard.prototype.update = function (dt, game) {
    this.life -= dt;
    if (this.life <= 0) { this.remove = true; return; }
    this.tick -= dt;
    if (Math.random() < dt * 14) {
      FX.spark(this.x + U.rand(-this.r, this.r) * 0.7, this.y + U.rand(-this.r, this.r) * 0.5,
        { a: -Math.PI / 2 + U.rand(-.4, .4), speed: U.rand(30, 90), color: '#ff8a3a', life: 0.5, size: 3, drag: .95 });
    }
    var p = game.player;
    if (this.tick <= 0 && !p.dead && U.dist2(this.x, this.y, p.x, p.y) < (this.r + p.r) * (this.r + p.r)) {
      this.tick = 0.5;
      p.takeDamage(this.dps * 0.5, this.x, this.y);
    }
  };
  Hazard.prototype.draw = function (c, time) {
    var k = U.clamp(this.life / this.max, 0, 1);
    c.save();
    c.globalAlpha = 0.25 * Math.min(1, k * 3);
    c.fillStyle = '#ff6a1f';
    c.beginPath(); c.ellipse(this.x, this.y, this.r, this.r * .6, 0, 0, U.TAU); c.fill();
    c.globalAlpha = 0.4 * Math.min(1, k * 3);
    c.strokeStyle = '#ffb066'; c.lineWidth = 2;
    c.beginPath();
    c.ellipse(this.x, this.y, this.r * (0.92 + Math.sin(time * 4 + this.seed) * 0.06), this.r * .6, 0, 0, U.TAU);
    c.stroke();
    c.restore();
  };

  /* =========================================================
     الغنائم
     ========================================================= */
  function Pickup(x, y, kind, value) {
    this.x = x; this.y = y;
    this.vx = U.rand(-90, 90); this.vy = U.rand(-90, 90);
    this.kind = kind; this.value = value;
    this.life = 22; this.remove = false;
    this.seed = Math.random() * 6.28;
    this.t = 0;
  }
  Pickup.prototype.update = function (dt, game) {
    this.t += dt;
    this.life -= dt;
    if (this.life <= 0) { this.remove = true; return; }
    var p = game.player;
    var d = U.dist(this.x, this.y, p.x, p.y);
    var mag = p.magnet + (this.t > 4 ? 60 : 0);
    if (d < mag) {
      var a = U.angleTo(this.x, this.y, p.x, p.y);
      var pull = U.lerp(700, 190, d / mag);
      this.vx = U.damp(this.vx, Math.cos(a) * pull, 10, dt);
      this.vy = U.damp(this.vy, Math.sin(a) * pull, 10, dt);
    } else {
      this.vx *= Math.pow(0.02, dt); this.vy *= Math.pow(0.02, dt);
    }
    this.x += this.vx * dt; this.y += this.vy * dt;
    clampArena(this, game.arenaR);
    if (d < p.r + 12) {
      this.remove = true;
      game.collect(this);
    }
  };

  /* =========================================================
     الصقر المرافق
     ========================================================= */
  function Falcon(player, idx) {
    this.p = player;
    this.idx = idx;
    this.x = player.x; this.y = player.y - 40;
    this.a = idx * 2.1;
    this.cd = 1.2 + idx * 0.4;
    this.state = 'orbit';
    this.target = null;
    this.t = 0;
  }
  Falcon.prototype.update = function (dt, game) {
    var p = this.p;
    this.t += dt;
    this.cd -= dt;
    if (this.state === 'orbit') {
      this.a += dt * 2.2;
      var ox = p.x + Math.cos(this.a) * 46, oy = p.y + Math.sin(this.a) * 46 - 14;
      this.x = U.damp(this.x, ox, 8, dt);
      this.y = U.damp(this.y, oy, 8, dt);
      if (this.cd <= 0) {
        var t = game.nearestEnemy(p.x, p.y, 420);
        if (t) { this.state = 'dive'; this.target = t; }
      }
    } else {
      var t2 = this.target;
      if (!t2 || t2.dead) { this.state = 'orbit'; this.cd = 1.6; return; }
      var a = U.angleTo(this.x, this.y, t2.x, t2.y);
      this.x += Math.cos(a) * 620 * dt;
      this.y += Math.sin(a) * 620 * dt;
      FX.spark(this.x, this.y, { speed: 20, color: '#e8dcc3', life: 0.2, size: 2, glow: false });
      if (U.dist(this.x, this.y, t2.x, t2.y) < t2.r + 12) {
        game.hitEnemy(t2, p.dmg() * 0.8, { ang: a, knock: 120, owner: p, color: '#e8dcc3' });
        FX.burst(t2.x, t2.y, 7, '#e8dcc3', { min: 60, max: 200 });
        A.play('hit');
        this.state = 'orbit'; this.cd = 1.9; this.target = null;
      }
    }
  };
  Falcon.prototype.draw = function (c, time) {
    var flap = Math.sin(time * 16 + this.idx) * 0.5;
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.state === 'dive' && this.target ? U.angleTo(this.x, this.y, this.target.x, this.target.y) + Math.PI / 2 : 0);
    c.fillStyle = 'rgba(0,0,0,.25)';
    c.beginPath(); c.ellipse(0, 26, 7, 3, 0, 0, U.TAU); c.fill();
    c.fillStyle = '#8a6a48';
    c.beginPath();
    c.moveTo(0, -7);
    c.quadraticCurveTo(-16, -2 + flap * 6, -6, 4);
    c.lineTo(0, 8); c.lineTo(6, 4);
    c.quadraticCurveTo(16, -2 - flap * 6, 0, -7);
    c.fill();
    c.fillStyle = '#e8dcc3';
    c.beginPath(); c.arc(0, -6, 3, 0, U.TAU); c.fill();
    c.fillStyle = '#d8a445';
    c.beginPath(); c.moveTo(0, -9); c.lineTo(3, -6); c.lineTo(0, -4); c.closePath(); c.fill();
    c.restore();
  };

  MAL.Player = Player;
  MAL.Enemy = Enemy;
  MAL.Projectile = Projectile;
  MAL.Lob = Lob;
  MAL.SkyArrow = SkyArrow;
  MAL.Hazard = Hazard;
  MAL.Pickup = Pickup;
  MAL.Falcon = Falcon;
  MAL.helpers = { applyKnock: applyKnock, collideObstacles: collideObstacles, clampArena: clampArena };
})(typeof window !== 'undefined' ? window : globalThis);
