/* ============================================================
   game.js — حلقة اللعب، الموجات، التصادم، الكاميرا
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U, FX = MAL.FX, R = MAL.R, A = MAL.Audio, D = MAL.Data, S = MAL.Save;

  var MAX_ALIVE = 18;

  var Game = {
    canvas: null, ctx: null,
    w: 0, h: 0, dpr: 1,
    state: 'menu',           // menu | playing | paused | cards | dead | victory
    running: false,
    time: 0, runTime: 0,

    regionIdx: 0, region: null, hero: null, player: null,
    endless: false,

    enemies: [], projectiles: [], objects: [], pickups: [], hazards: [], falcons: [],
    obstacles: [], arena: null, arenaR: R.ARENA_R,

    wave: 0, totalWaves: 0, waveState: 'idle',
    spawnQueue: [], spawnTimer: 0, waveBannerT: 0,
    boss: null, bossDeathT: 0,
    gold: 0, kills: 0, waveClearT: 0, deathT: 0, waveElapsed: 0,

    cam: { x: 0, y: 0, s: 1, tx: 0, ty: 0 },

    /* ---------------------------------------------------- */
    init: function (canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      return this;
    },

    resize: function (w, h, dpr) {
      this.w = w; this.h = h; this.dpr = dpr;
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      // نريد أن نرى نحو ٧٠٠ وحدة عرضاً — قريبٌ بما يكفي ليقرأ اللاعب كل حركة
      var s = w / 700;
      if (h / s < 440) s = h / 440;
      this.cam.s = U.clamp(s, 0.7, 3.2);
    },

    /* ---------------------------------------------------- */
    startRun: function (regionIdx, heroId, endless) {
      this.regionIdx = U.clamp(regionIdx, 0, D.regions.length - 1);
      this.region = D.regions[this.regionIdx];
      this.hero = D.heroById(heroId);
      this.endless = !!endless;

      var built = R.buildArena(this.region, this.endless ? 7 : 0);
      this.arena = built;
      this.obstacles = built.obstacles;
      this.arenaR = R.ARENA_R;

      this.enemies = []; this.projectiles = []; this.objects = [];
      this.pickups = []; this.hazards = []; this.falcons = [];
      FX.reset();

      this.player = new MAL.Player(this.hero, this);
      this.player.x = 0; this.player.y = 90;

      this.wave = 0;
      this.totalWaves = this.endless ? 999 : this.region.waves;
      this.waveState = 'idle';
      this.spawnQueue = []; this.spawnTimer = 0;
      this.boss = null; this.bossDeathT = 0;
      this.gold = 0; this.kills = 0;
      this.runTime = 0; this.deathT = 0; this.waveClearT = 0; this.waveElapsed = 0;
      this.state = 'playing';
      this.running = true;

      this.cam.x = 0; this.cam.y = 0;
      this.cam.tx = 0; this.cam.ty = 0;

      S.bumpStat('runs', 1);
      S.save();

      // بطاقات البداية من "العزم"
      var resolve = S.forgeLevel('resolve');
      for (var i = 0; i < resolve; i++) {
        var pool = D.upgrades.filter(function (u) { return u.r === 'common' || u.r === 'rare'; });
        this.player.addUpgrade(U.pick(pool));
      }
      this.syncFalcons();

      A.music.start(this.region.music);
      A.music.setIntensity(0.15);
      MAL.Input.enabled = true;
      MAL.Input.clear();

      this.nextWave();
    },

    endRun: function () {
      this.running = false;
      this.state = 'menu';
      MAL.Input.enabled = false;
      MAL.Input.clear();
      A.music.stop();
    },

    syncFalcons: function () {
      var want = this.player ? this.player.falcons : 0;
      while (this.falcons.length < want) this.falcons.push(new MAL.Falcon(this.player, this.falcons.length));
      while (this.falcons.length > want) this.falcons.pop();
    },

    /* ====================================================
       الموجات
       ==================================================== */
    waveScale: function (n) {
      var diff = this.region.diff;
      var extra = this.endless ? Math.pow(1.06, Math.max(0, n - this.region.waves)) : 1;
      return {
        hp: (1 + 0.13 * (n - 1)) * diff * extra,
        dmg: (0.55 + 0.045 * (n - 1)) * (0.80 + diff * 0.22) * Math.min(extra, 2.2),
        speed: Math.min(1.24, 1 + 0.013 * (n - 1))
      };
    },

    buildWave: function (n) {
      var roster = this.region.roster.slice();
      var list = [];
      var count = Math.round((3.4 + n * 1.32) * (0.90 + this.region.diff * 0.13));
      count = Math.min(count, 26);

      // في الموجات الأولى: نوعان فقط لتعليم اللاعب
      var available = roster.slice(0, Math.min(roster.length, 2 + Math.floor(n / 2)));

      for (var i = 0; i < count; i++) {
        var pickId = U.weightedPick(available, function (id) { return D.enemies[id].w; });
        list.push(pickId);
      }
      // عريف نخبة كل ٤ موجات
      if (n >= 4 && n % 4 === 0) list.push('captain');
      if (n >= 8 && n % 8 === 0) list.push('captain');
      return U.shuffle(list);
    },

    nextWave: function () {
      this.wave++;
      this.player.stats.noHitWave = true;

      if (!this.endless && this.wave > this.totalWaves) { this.startBoss(); return; }
      if (this.endless && this.wave % 6 === 0) { this.startBoss(); return; }

      this.waveState = 'fight';
      this.waveElapsed = 0;
      this.spawnQueue = this.buildWave(this.wave);
      this.spawnTimer = 0.5;
      // نَفَسٌ بين الموجات — يجعل الجولة الطويلة ممكنة
      if (this.wave > 1 && this.player.hp < this.player.maxHp) {
        this.player.heal(this.player.maxHp * 0.12);
      }
      this.banner('الموجة ' + U.ar(this.wave), this.region.name);
      if (this.wave === 1 && !this.endless) {
        MAL.UI.toast('إصبعُ اليسار يُحرّك · إصبعُ اليمين يُصوّب · زرُّ الاندفاع يُنجيك');
      }
      A.play('wave');
      A.music.setIntensity(U.clamp(0.15 + this.wave * 0.07, 0, 0.85));
      MAL.UI.updateHUD(this);
    },

    startBoss: function () {
      this.waveState = 'boss';
      this.waveElapsed = 0;
      var cfg = this.region.boss;
      var scale = this.endless ? 1 + Math.floor(this.wave / 6) * 0.55 : 1;
      var b = new MAL.Boss(cfg, this, scale);
      this.boss = b;
      this.enemies.push(b);
      this.banner(cfg.name, cfg.title);
      A.play('boss');
      A.music.setIntensity(1);
      A.music.setTempo((this.region.music.tempo || 92) + 14);
      FX.flash('#a8372c', 0.35, 0.6);
      MAL.UI.showBoss(b);
      MAL.UI.updateHUD(this);
    },

    banner: function (title, sub) {
      MAL.UI.banner(title, sub);
      this.waveBannerT = 2.1;
    },

    spawnEnemy: function (typeId) {
      var cfg = D.enemies[typeId];
      if (!cfg) return;
      var p = this.player;
      var a, x, y, tries = 0;
      do {
        a = U.rand(0, U.TAU);
        var d = this.arenaR - U.rand(26, 70);
        x = Math.cos(a) * d; y = Math.sin(a) * d;
        tries++;
      } while (tries < 12 && U.dist2(x, y, p.x, p.y) < 240 * 240);

      var e = new MAL.Enemy(cfg, x, y, this.waveScale(this.wave), this);
      this.enemies.push(e);
      FX.ring(x, y, { r0: 4, r1: 34, color: U.rgba(this.region.pal.accent, .7), life: 0.4, width: 2.5 });
      FX.dust(x, y, 4);
    },

    spawnMinion: function (x, y) {
      var roster = this.region.roster;
      var cfg = D.enemies[roster[(Math.random() * Math.min(3, roster.length)) | 0]] || D.enemies.bandit;
      var d = Math.hypot(x, y);
      if (d > this.arenaR - 40) { x = x / d * (this.arenaR - 40); y = y / d * (this.arenaR - 40); }
      var e = new MAL.Enemy(cfg, x, y, this.waveScale(Math.max(1, this.wave - 1)), this);
      this.enemies.push(e);
      FX.ring(x, y, { r0: 4, r1: 40, color: '#e0573f', life: 0.4, width: 3 });
    },

    /* ====================================================
       المساعدون القتاليون
       ==================================================== */
    /** حلقة القتال: لا يهجم أكثر من عددٍ محدود في وقتٍ واحد — يجعل الزحام عادلاً */
    maxAttackers: function () {
      return U.clamp(2 + Math.floor(this.wave / 4) + (this.waveElapsed > 45 ? 2 : 0), 2, 6);
    },
    /** ضغطٌ متزايد كلما طالت الموجة — يمنع أي جمود */
    pressure: function () {
      return 1 + U.clamp((this.waveElapsed - 40) / 90, 0, 0.4);
    },
    requestAttack: function (e) {
      var n = 0, cap = this.maxAttackers();
      for (var i = 0; i < this.enemies.length; i++) {
        var o = this.enemies[i];
        if (o === e || o.dead || o.kind === 'boss') continue;
        if (o.state === 'windup' || o.state === 'charging' || o.state === 'aim') n++;
        if (n >= cap) return false;
      }
      return true;
    },

    nearestEnemy: function (x, y, maxD, exclude) {
      var best = null, bd = (maxD || 1e9) * (maxD || 1e9);
      for (var i = 0; i < this.enemies.length; i++) {
        var e = this.enemies[i];
        if (e.dead || (exclude && exclude.indexOf(e) >= 0)) continue;
        if (e.spawnT > 0 && e.kind === 'enemy') continue;
        var d = U.dist2(x, y, e.x, e.y);
        if (d < bd) { bd = d; best = e; }
      }
      return best;
    },

    hitEnemy: function (e, dmg, o) {
      if (!e || e.dead) return 0;
      o = o || {};
      var p = this.player;
      var crit = o.crit;
      if (crit === undefined) crit = Math.random() < p.crit;
      var final = dmg * (crit ? p.critMul : 1);
      var dealt = e.hurt(final, {
        ang: o.ang, knock: o.knock, crit: crit, stun: o.stun, slow: o.slow,
        color: o.color, noText: o.noText
      }, this);

      if (dealt > 0) {
        p.onHitEnemy(dealt, e, this);
        if (crit) { FX.shake(3.5); FX.hitstop(0.05); }
        else if (o.finisher) { FX.hitstop(0.055); }
        else FX.hitstop(0.022);
        A.play('hit', o.finisher || crit ? 1 : 0);
      }
      return dealt;
    },

    meleeHit: function (x, y, ang, range, halfArc, dmg, o) {
      o = o || {};
      var hits = 0;
      for (var i = 0; i < this.enemies.length; i++) {
        var e = this.enemies[i];
        if (e.dead) continue;
        if (U.dist2(x, y, e.x, e.y) > (range + e.r) * (range + e.r)) continue;
        if (Math.abs(U.angDiff(ang, U.angleTo(x, y, e.x, e.y))) > halfArc) continue;
        this.hitEnemy(e, dmg, {
          ang: U.angleTo(x, y, e.x, e.y), knock: o.knock, finisher: o.finisher, owner: o.owner
        });
        hits++;
      }
      return hits;
    },

    /** ضرر دائري: على الأعداء افتراضياً، أو على اللاعب إن targetPlayer */
    areaDamage: function (x, y, r, dmg, o) {
      o = o || {};
      if (o.targetPlayer) {
        var p = this.player;
        if (!p.dead && U.dist(x, y, p.x, p.y) < r + p.r) {
          p.takeDamage(dmg, x, y);
          if (o.knock) MAL.helpers.applyKnock(p, U.angleTo(x, y, p.x, p.y), o.knock);
        }
        return 1;
      }
      var n = 0;
      for (var i = 0; i < this.enemies.length; i++) {
        var e = this.enemies[i];
        if (e.dead) continue;
        if (U.dist(x, y, e.x, e.y) > r + e.r) continue;
        this.hitEnemy(e, dmg, {
          ang: U.angleTo(x, y, e.x, e.y), knock: o.knock, stun: o.stun, slow: o.slow,
          color: o.color, noText: o.noText
        });
        n++;
      }
      return n;
    },

    areaDamageArc: function (x, y, ang, range, halfArc, dmg, source) {
      var p = this.player;
      if (p.dead) return;
      if (U.dist(x, y, p.x, p.y) > range + p.r) return;
      if (Math.abs(U.angDiff(ang, U.angleTo(x, y, p.x, p.y))) > halfArc) return;
      p.takeDamage(dmg, x, y);
      MAL.helpers.applyKnock(p, U.angleTo(x, y, p.x, p.y), 260);
    },

    lineDamage: function (x, y, ang, len, w, dmg, source) {
      var p = this.player;
      if (p.dead) return;
      var dx = p.x - x, dy = p.y - y;
      var proj = dx * Math.cos(ang) + dy * Math.sin(ang);
      if (proj < -w || proj > len) return;
      var perp = Math.abs(-dx * Math.sin(ang) + dy * Math.cos(ang));
      if (perp > w / 2 + p.r) return;
      p.takeDamage(dmg, x, y);
      MAL.helpers.applyKnock(p, ang + Math.PI / 2 * U.sign(-dx * Math.sin(ang) + dy * Math.cos(ang)), 300);
    },

    explosion: function (x, y, r, dmg, color, vsPlayer, owner) {
      FX.ring(x, y, { r0: 6, r1: r, color: color || '#ff8a3a', life: 0.4, width: 6 });
      FX.burst(x, y, 14, color || '#ff8a3a', { min: 80, max: 340 });
      FX.smoke(x, y, 5);
      FX.shake(7);
      A.play('explode');
      if (vsPlayer) {
        var p = this.player;
        if (!p.dead && U.dist(x, y, p.x, p.y) < r + p.r) {
          p.takeDamage(dmg, x, y);
          MAL.helpers.applyKnock(p, U.angleTo(x, y, p.x, p.y), 320);
        }
      } else {
        this.areaDamage(x, y, r, dmg, { knock: 260, color: color });
      }
    },

    thunderStrike: function (x, y, n, dmg) {
      var used = [];
      var sx = x, sy = y;
      for (var i = 0; i < n; i++) {
        var t = this.nearestEnemy(sx, sy, 320, used);
        if (!t) break;
        used.push(t);
        FX.ring(t.x, t.y, { r0: 4, r1: 46, color: '#9ed3f2', life: 0.3, width: 3 });
        FX.burst(t.x, t.y, 9, '#cfeaff', { min: 90, max: 300 });
        this.hitEnemy(t, dmg, { ang: U.angleTo(sx, sy, t.x, t.y), knock: 120, color: '#cfeaff' });
        sx = t.x; sy = t.y;
      }
      if (used.length) { A.play('perfect'); FX.flash('#9ed3f2', 0.12, 0.15); }
    },

    /* ====================================================
       المولّدات
       ==================================================== */
    spawnProjectile: function (o) { this.projectiles.push(new MAL.Projectile(o)); },
    spawnLob: function (x, y, tx, ty, dmg, kind) {
      var d = Math.hypot(tx, ty);
      if (d > this.arenaR - 20) { tx = tx / d * (this.arenaR - 20); ty = ty / d * (this.arenaR - 20); }
      this.objects.push(new MAL.Lob(x, y, tx, ty, dmg, kind));
    },
    skyArrow: function (x, y, dmg, owner) { this.objects.push(new MAL.SkyArrow(x, y, dmg, owner)); },
    spawnHazard: function (x, y, r, life, dps) { this.hazards.push(new MAL.Hazard(x, y, r, life, dps)); },

    spawnMine: function (x, y, dmg, src) {
      var self = this;
      var m = {
        x: x, y: y, t: 0, dur: 1.6, remove: false, dmg: dmg,
        update: function (dt) {
          this.t += dt;
          if (this.t >= this.dur) {
            this.remove = true;
            self.explosion(this.x, this.y, 78, this.dmg, '#e0573f', true);
          }
        },
        draw: function (c) {
          var k = U.clamp(this.t / this.dur, 0, 1);
          R.telegraph(c, this.x, this.y, 78, k, '#e0573f');
          c.save();
          c.fillStyle = k > 0.7 && Math.floor(this.t * 18) % 2 ? '#ffd166' : '#4a2a20';
          c.beginPath(); c.arc(this.x, this.y, 9, 0, U.TAU); c.fill();
          c.strokeStyle = '#e0573f'; c.lineWidth = 2;
          c.beginPath(); c.arc(this.x, this.y, 9, 0, U.TAU); c.stroke();
          c.restore();
        }
      };
      this.objects.push(m);
    },

    spawnFallingRock: function (x, y, dmg, src) {
      var self = this;
      var d = Math.hypot(x, y);
      if (d > this.arenaR - 24) { x = x / d * (this.arenaR - 24); y = y / d * (this.arenaR - 24); }
      var o = {
        x: x, y: y, t: 0, dur: 0.75, remove: false, dmg: dmg,
        update: function (dt) {
          this.t += dt;
          if (this.t >= this.dur) {
            this.remove = true;
            self.explosion(this.x, this.y, 62, this.dmg, '#c9b393', true);
            FX.shard(this.x, this.y, '#a89880', 7);
            FX.dust(this.x, this.y, 8);
          }
        },
        draw: function (c) {
          var k = U.clamp(this.t / this.dur, 0, 1);
          R.telegraph(c, this.x, this.y, 62, k, '#d9cdb4');
          var ry = this.y - (1 - k) * 340;
          c.save();
          c.fillStyle = '#7a6a54';
          c.beginPath();
          c.moveTo(this.x - 15, ry + 12); c.lineTo(this.x - 9, ry - 14);
          c.lineTo(this.x + 12, ry - 10); c.lineTo(this.x + 16, ry + 13);
          c.closePath(); c.fill();
          c.fillStyle = 'rgba(255,255,255,.15)';
          c.beginPath(); c.ellipse(this.x - 4, ry - 4, 6, 4, .3, 0, U.TAU); c.fill();
          c.restore();
        }
      };
      this.objects.push(o);
    },

    /* ====================================================
       الأحداث
       ==================================================== */
    onEnemyKilled: function (e) {
      this.kills++;
      var p = this.player;
      p.stats.kills++;
      S.bumpStat('kills', 1);
      p.gainUlt(3.2);

      var n = 1 + (Math.random() < 0.35 ? 1 : 0) + (e.cfg && e.cfg.elite ? 3 : 0);
      for (var i = 0; i < n; i++) {
        this.pickups.push(new MAL.Pickup(e.x, e.y, 'gold', Math.max(1, Math.round(e.gold / n))));
      }
      if (p.hp < p.maxHp * 0.6 && Math.random() < 0.14) {
        this.pickups.push(new MAL.Pickup(e.x, e.y, 'heal', Math.round(p.maxHp * 0.14)));
      } else if (Math.random() < 0.045) {
        this.pickups.push(new MAL.Pickup(e.x, e.y, 'ult', 22));
      }
    },

    onBossKilled: function (b) {
      S.bumpStat('bosses', 1);
      this.bossDeathT = 0.001;
      A.music.setIntensity(0.2);
      for (var i = 0; i < 14; i++) {
        var a = U.rand(0, U.TAU), d = U.rand(10, 90);
        this.pickups.push(new MAL.Pickup(b.x + Math.cos(a) * d, b.y + Math.sin(a) * d, 'gold', 8));
      }
      this.pickups.push(new MAL.Pickup(b.x, b.y, 'heal', Math.round(this.player.maxHp * 0.35)));
    },

    collect: function (pk) {
      var p = this.player;
      if (pk.kind === 'gold') {
        var g = Math.max(1, Math.round(pk.value * p.goldMul));
        this.gold += g;
        p.stats.gold += g;
        A.play('coin');
        FX.spark(pk.x, pk.y, { speed: 60, color: '#f6d489', life: 0.3 });
      } else if (pk.kind === 'heal') {
        p.heal(pk.value);
        A.play('heal');
        FX.ring(p.x, p.y, { r0: 6, r1: 40, color: '#9ee5b0', life: 0.4, width: 3 });
      } else {
        p.gainUlt(pk.value);
        A.play('coin');
        FX.ring(p.x, p.y, { r0: 6, r1: 40, color: '#9ed3f2', life: 0.4, width: 3 });
      }
    },

    /* ====================================================
       التحديث
       ==================================================== */
    update: function (dt, rdt) {
      this.time += rdt;
      if (!this.running || this.state !== 'playing') return;

      var p = this.player;
      this.runTime += dt;
      if (this.waveState === 'fight' || this.waveState === 'boss') this.waveElapsed += dt;
      S.bumpStat('timePlayed', dt);

      // ---- إدخال ----
      if (MAL.Input.consumePause()) { MAL.UI.pause(); return; }
      if (MAL.Input.consumeDash()) p.tryDash();
      if (MAL.Input.consumeUlt()) p.useUlt(this);

      // ---- تفريخ الموجة ----
      if (this.waveState === 'fight' && this.spawnQueue.length) {
        this.spawnTimer -= dt;
        var aliveNormal = 0;
        for (var q = 0; q < this.enemies.length; q++) if (!this.enemies[q].dead) aliveNormal++;
        if (this.spawnTimer <= 0 && aliveNormal < MAX_ALIVE) {
          this.spawnTimer = U.rand(0.22, 0.45);
          this.spawnEnemy(this.spawnQueue.pop());
        }
      }

      // ---- الكيانات ----
      p.update(dt, this);
      this.syncFalcons();

      var i;
      for (i = 0; i < this.enemies.length; i++) {
        var e = this.enemies[i];
        if (e.dead && e.kind === 'boss') continue;
        if (!e.dead) e.update(dt, this);
      }
      this.separate(dt);

      for (i = 0; i < this.projectiles.length; i++) this.projectiles[i].update(dt, this);
      for (i = 0; i < this.objects.length; i++) this.objects[i].update(dt, this);
      for (i = 0; i < this.hazards.length; i++) this.hazards[i].update(dt, this);
      for (i = 0; i < this.pickups.length; i++) this.pickups[i].update(dt, this);
      for (i = 0; i < this.falcons.length; i++) this.falcons[i].update(dt, this);

      U.removeDead(this.enemies);
      U.removeDead(this.projectiles);
      U.removeDead(this.objects);
      U.removeDead(this.hazards);
      U.removeDead(this.pickups);

      // ---- موت الزعيم ----
      if (this.boss && this.boss.dead) {
        this.bossDeathT += dt;
        if (this.bossDeathT > 1.0 && !this.boss.remove) this.boss.remove = true;
        if (this.bossDeathT > 1.7 && this.state === 'playing') {
          if (this.endless) {
            // في وضع الأبدية: الزعيم مجرد محطة — نكمل المسير
            this.boss = null; this.bossDeathT = 0;
            this.waveState = 'idle';
            this.spawnQueue.length = 0;
            MAL.UI.showCards(this);
          } else this.victory();
          return;
        }
      }

      // ---- انتهاء الموجة ----
      if (this.waveState === 'fight' && !this.spawnQueue.length && this.enemies.length === 0) {
        this.waveClearT += dt;
        if (this.waveClearT > 0.65) {
          this.waveClearT = 0;
          if (p.stats.noHitWave) {
            S.bumpStat('perfectWaves', 1);
            FX.text(p.x, p.y - 42, 'موجةٌ بلا خدش!', { color: '#9ee5b0', size: 18 });
          }
          this.waveState = 'cards';
          MAL.UI.showCards(this);
          return;
        }
      } else this.waveClearT = 0;

      // ---- الموت ----
      if (p.dead) {
        this.deathT += dt;
        if (this.deathT > 1.2) { this.defeat(); return; }
        if (this.deathT < 0.05) {
          FX.slow(0.2, 1.2);
          FX.flash('#a8372c', 0.5, 0.7);
          FX.shake(20);
          A.play('lose');
          A.music.stop(1.2);
        }
      }

      // ---- الكاميرا ----
      var lead = 46;
      this.cam.tx = p.x + Math.cos(p.aimAngle) * lead * (MAL.Input.aim.active ? 1 : 0.45);
      this.cam.ty = p.y + Math.sin(p.aimAngle) * lead * (MAL.Input.aim.active ? 1 : 0.45);
      var halfW = this.w / this.cam.s / 2, halfH = this.h / this.cam.s / 2;
      var maxX = Math.max(0, this.arenaR + 55 - halfW), maxY = Math.max(0, this.arenaR + 55 - halfH);
      this.cam.tx = U.clamp(this.cam.tx, -maxX, maxX);
      this.cam.ty = U.clamp(this.cam.ty, -maxY, maxY);
      this.cam.x = U.damp(this.cam.x, this.cam.tx, 9, dt);
      this.cam.y = U.damp(this.cam.y, this.cam.ty, 9, dt);

      MAL.UI.updateHUD(this);
    },

    /** فصل الأعداء عن بعضهم */
    separate: function (dt) {
      var list = this.enemies, n = list.length;
      for (var i = 0; i < n; i++) {
        var a = list[i];
        if (a.dead || a.kind === 'boss') continue;
        for (var j = i + 1; j < n; j++) {
          var b = list[j];
          if (b.dead) continue;
          var dx = b.x - a.x, dy = b.y - a.y;
          var min = a.r + b.r;
          var d2 = dx * dx + dy * dy;
          if (d2 >= min * min || d2 < 0.0001) continue;
          var d = Math.sqrt(d2);
          var push = (min - d) / d * 0.5;
          var w = b.kind === 'boss' ? 0 : 1;
          a.x -= dx * push; a.y -= dy * push;
          if (w) { b.x += dx * push; b.y += dy * push; }
        }
      }
    },

    /* ====================================================
       نهايات الجولة
       ==================================================== */
    victory: function () {
      this.state = 'victory';
      this.running = false;
      MAL.Input.enabled = false;
      A.music.stop(1.4);
      A.play('win');

      var reward = this.region.reward + this.gold;
      if (!this.endless) {
        if (!S.isCleared(this.region.id)) reward = Math.round(reward * 1.6);
        S.markCleared(this.region.id);
        S.unlockRegion(this.regionIdx + 1);
      }
      S.setBest(this.region.id, this.wave);
      S.addGold(reward);
      S.data.lastRegion = Math.min(D.regions.length - 1, this.regionIdx + (this.endless ? 0 : 1));
      S.save();
      MAL.UI.showVictory(this, reward);
    },

    defeat: function () {
      this.state = 'dead';
      this.running = false;
      MAL.Input.enabled = false;
      var reward = Math.round(this.gold * 0.7) + this.wave * 6;
      S.setBest(this.region.id, Math.max(0, this.wave - 1));
      if (this.endless) {
        if (this.wave - 1 > (S.data.stats.bestEndless || 0)) S.data.stats.bestEndless = this.wave - 1;
      }
      S.addGold(reward);
      S.save();
      MAL.UI.showDefeat(this, reward);
    },

    /* ====================================================
       الرسم
       ==================================================== */
    screenToWorld: function (sx, sy) {
      return {
        x: (sx - this.w / 2) / this.cam.s + this.cam.x,
        y: (sy - this.h / 2) / this.cam.s + this.cam.y
      };
    },

    draw: function () {
      var c = this.ctx, w = this.w, h = this.h;
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      c.clearRect(0, 0, w, h);

      if (!this.region) { return; }

      c.save();
      c.translate(w / 2 + FX.shakeX, h / 2 + FX.shakeY);
      c.scale(this.cam.s, this.cam.s);
      c.translate(-this.cam.x, -this.cam.y);

      R.drawArena(c, this.arena);
      FX.drawDecals(c);

      var i;
      for (i = 0; i < this.hazards.length; i++) this.hazards[i].draw(c, this.time);
      if (this.boss && !this.boss.dead) this.boss.drawTelegraphs(c);
      for (i = 0; i < this.pickups.length; i++) R.pickup(c, this.pickups[i], this.time);

      // ترتيب حسب المحور الرأسي
      var drawList = [];
      for (i = 0; i < this.enemies.length; i++) {
        var e = this.enemies[i];
        if (e.dead && e.kind !== 'boss') continue;
        drawList.push(e);
      }
      if (!this.player.dead) drawList.push(this.player);
      drawList.sort(function (a, b) { return a.y - b.y; });
      for (i = 0; i < drawList.length; i++) {
        var ent = drawList[i];
        if (ent.kind === 'boss' && ent.dead) {
          c.save();
          c.globalAlpha = Math.max(0, 1 - this.bossDeathT);
          ent.draw(c, this.time);
          c.restore();
        } else ent.draw(c, this.time);
      }

      for (i = 0; i < this.objects.length; i++) this.objects[i].draw(c, this.time);
      for (i = 0; i < this.projectiles.length; i++) R.projectile(c, this.projectiles[i]);
      for (i = 0; i < this.falcons.length; i++) this.falcons[i].draw(c, this.time);

      FX.draw(c);
      FX.drawText(c);

      c.restore();

      FX.drawFlash(c, w, h);
      if (this.state === 'playing' && MAL.Input.enabled) R.sticks(c, MAL.Input, this.dpr);
    }
  };

  MAL.Game = Game;
})(typeof window !== 'undefined' ? window : globalThis);
