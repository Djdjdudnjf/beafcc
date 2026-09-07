/* ============================================================
   game.js — إدارة المعركة: نشرُ الجيشين، القتال، النصر والهزيمة
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U, FX = MAL.FX, R = MAL.R, A = MAL.Audio, D = MAL.Data, S = MAL.Save;
  var FRIEND = 1, FOE = 2;

  var MAX_LIVE_FOES = 20;

  var Game = {
    canvas: null, ctx: null,
    w: 0, h: 0, dpr: 1,
    state: 'menu',          // menu | playing | paused | reward | dead | victory
    running: false,
    time: 0, runTime: 0,

    stageIndex: 0, setup: null, player: null,
    units: [], projectiles: [], pickups: [],
    obstacles: [], arena: null, arenaR: R.ARENA_R,

    foeQueue: [], foeSpawnT: 0, foeTotal: 0, foeKilled: 0,
    commander: null, cmdSpawned: false, cmdDeathT: 0,
    gold: 0, deathT: 0,

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
      var s = w / 760;                       // ميدانٌ أوسع قليلاً ليتّسع للجيشين
      if (h / s < 470) s = h / 470;
      this.cam.s = U.clamp(s, 0.65, 3.0);
    },

    /* ====================================================
       بدء المعركة
       ==================================================== */
    startBattle: function (stageIndex) {
      this.stageIndex = U.clamp(stageIndex, 0, D.total - 1);
      var setup = D.stageSetup(this.stageIndex);
      this.setup = setup;

      var region = { id: setup.stage.n + setup.index, pal: this.palOf(setup), props: setup.terrain.props };
      var built = R.buildArena(region, this.stageIndex);
      this.arena = built;
      this.obstacles = built.obstacles;
      this.arenaR = R.ARENA_R;

      this.units = []; this.projectiles = []; this.pickups = [];
      FX.reset();

      this.player = new MAL.Player(D.hero, this);
      this.units.push(this.player);

      // ---- جيشك ----
      var army = this.armySize();
      for (var i = 0; i < army; i++) this.spawnFriend(i, army);

      // ---- جيشُ الخصم ----
      this.foeQueue = this.buildFoeArmy(setup);
      this.foeTotal = this.foeQueue.length;
      this.foeKilled = 0;
      this.foeSpawnT = 0.6;
      this.commander = null; this.cmdSpawned = false; this.cmdDeathT = 0;

      this.gold = 0; this.runTime = 0; this.deathT = 0; this.pressure = 1;
      this.state = 'playing';
      this.running = true;
      this.cam.x = 0; this.cam.y = 120; this.cam.tx = 0; this.cam.ty = 120;

      S.bumpStat('battles', 1);
      S.save();

      A.music.start(this.musicOf(setup));
      A.music.setIntensity(0.4);
      MAL.Input.enabled = true;
      MAL.Input.clear();

      MAL.UI.banner(setup.stage.n, setup.stage.hy + ' · ' + setup.stage.place);
      A.play('wave');
      MAL.UI.updateHUD(this);
    },

    palOf: function (setup) {
      var t = setup.terrain;
      return { sky: t.sky, g1: t.g1, g2: t.g2, stone: t.stone, accent: t.accent,
               enemy: setup.faction.cloth, prop: t.stone, fog: t.accent };
    },

    musicOf: function (setup) {
      var maqams = ['hijaz', 'rast', 'bayati', 'nahawand', 'saba', 'kurd'];
      var rhythms = ['maqsum', 'baladi', 'saidi', 'ayyub', 'war'];
      var i = setup.index;
      return {
        maqam: maqams[setup.stage.ch % maqams.length],
        root: 146.83 * Math.pow(2, (i % 5) / 12),
        tempo: 84 + Math.min(30, i * 0.5),
        rhythm: rhythms[i % rhythms.length]
      };
    },

    armySize: function () {
      return U.clamp(5 + S.armory('levy') * 2 + S.campaign('army'), 3, 34);
    },

    /** تشكيلةُ جيشك حسب ما اشتريتَه من دار السلاح */
    friendType: function (i, total) {
      var archers = S.armory('archers'), cav = S.armory('cavalry');
      var arcShare = archers * 0.09;            // حتى ٢٧٪ رماة
      var cavShare = cav * 0.07;
      var f = i / Math.max(1, total);
      if (f < arcShare) return D.units.rami;
      if (f < arcShare + cavShare) return D.units.faris;
      if (i % 5 === 4) return D.units.rammah;
      return D.units.sayyaf;
    },

    spawnFriend: function (i, total) {
      var cols = Math.ceil(Math.sqrt(total * 1.6));
      var row = Math.floor(i / cols), col = i % cols;
      var x = (col - (cols - 1) / 2) * 46 + U.rand(-6, 6);
      var y = 300 + row * 42 + U.rand(-6, 6);
      var cfg = this.friendType(i, total);
      // جندك أقلُّ عدداً وأجودُ عُدّةً — كما كان حالُ الفاتحين
      var mail = 1 + S.armory('mail') * 0.2;
      var scale = { hp: mail * 1.3, dmg: this.armyDmgMul() * 1.1, speed: 1 };
      var look = {
        cloth: '#1f6f5c', trim: '#e4c46a', metal: '#eceae2', skin: '#c08a5e',
        helm: cfg.id === 'faris' ? 'helmet' : 'turban', blood: '#8a2f2a'
      };
      if (cfg.id === 'rami') { look.cloth = '#2a7a62'; look.helm = 'hood'; }
      if (cfg.id === 'turrass') look.helm = 'helmet';
      var u = new MAL.Unit(cfg, FRIEND, x, y, scale, look);
      this.units.push(u);
      return u;
    },

    armyDmgMul: function () {
      return (1 + S.armory('edge') * 0.08) * (1 + S.campaign('sword') / 100);
    },

    buildFoeArmy: function (setup) {
      var list = [];
      var n = setup.foes;
      var i = setup.index;
      var pool = [D.units.sayyaf, D.units.sayyaf, D.units.rammah];
      if (i >= 4) pool.push(D.units.rami);
      if (i >= 10) pool.push(D.units.turrass);
      if (i >= 16) pool.push(D.units.faris);
      if (i >= 26) pool.push(D.units.rami, D.units.turrass);
      for (var k = 0; k < n; k++) {
        list.push(U.weightedPick(pool, function (c) { return c.w; }));
      }
      return U.shuffle(list);
    },

    spawnFoe: function (cfg) {
      var setup = this.setup, f = setup.faction;
      var a = U.rand(-Math.PI * 0.85, -Math.PI * 0.15);
      var d = this.arenaR - U.rand(30, 90);
      var x = Math.cos(a) * d, y = Math.sin(a) * d;
      var scale = {
        hp: 1 + setup.index * 0.050,
        dmg: 0.85 + setup.index * 0.036,
        speed: Math.min(1.25, 1 + setup.index * 0.006)
      };
      var look = {
        cloth: f.cloth, trim: f.trim, metal: f.metal, skin: '#a8734e',
        helm: f.helm, blood: '#8a2f2a'
      };
      if (cfg.id === 'rami') look.helm = 'hood';
      var u = new MAL.Unit(cfg, FOE, x, y, scale, look);
      this.units.push(u);
      FX.ring(x, y, { r0: 4, r1: 30, color: U.rgba(f.trim, .6), life: 0.35, width: 2 });
      return u;
    },

    reinforce: function (n, x, y) {
      for (var i = 0; i < n; i++) this.foeQueue.push(D.units.sayyaf);
      this.foeTotal += n;
      MAL.UI.toast('جاء الخصمَ مَدَد!');
    },

    /* ====================================================
       أدوات القتال
       ==================================================== */
    liveCount: function (team) {
      var n = 0;
      for (var i = 0; i < this.units.length; i++) {
        var u = this.units[i];
        if (!u.dead && u.team === team && u.kind !== 'player') n++;
      }
      return n;
    },

    /** يوزّع الأهداف على أقرب أربعة خصوم فلا يتكدّس الجيش على واحد */
    pickTarget: function (unit, team) {
      var best = [null, null, null, null];
      var bd = [1e18, 1e18, 1e18, 1e18];
      for (var i = 0; i < this.units.length; i++) {
        var u = this.units[i];
        if (u.dead || u.team !== team || u.spawnT > 0) continue;
        var d = U.dist2(unit.x, unit.y, u.x, u.y);
        for (var k = 0; k < 4; k++) {
          if (d < bd[k]) {
            for (var j = 3; j > k; j--) { bd[j] = bd[j - 1]; best[j] = best[j - 1]; }
            bd[k] = d; best[k] = u;
            break;
          }
        }
      }
      var want = unit.seed % 4;
      for (var w = want; w >= 0; w--) if (best[w]) return best[w];
      return best[0];
    },

    nearestOf: function (x, y, team, maxD, exclude) {
      var best = null, bd = (maxD || 1e9) * (maxD || 1e9);
      for (var i = 0; i < this.units.length; i++) {
        var u = this.units[i];
        if (u.dead || u.team !== team) continue;
        if (u.spawnT > 0) continue;
        if (exclude && exclude.indexOf(u) >= 0) continue;
        var d = U.dist2(x, y, u.x, u.y);
        if (d < bd) { bd = d; best = u; }
      }
      return best;
    },

    /** حلقةُ القتال حول القائد: لا يهجم عليه أكثر من ثلاثةٍ معاً */
    requestAttack: function (unit) {
      if (!unit.target || unit.target.kind !== 'player') return true;
      var n = 0;
      for (var i = 0; i < this.units.length; i++) {
        var o = this.units[i];
        if (o === unit || o.dead) continue;
        if (o.target !== this.player) continue;
        if (o.state === 'windup' || o.state === 'charge' || o.state === 'aim') n++;
        if (n >= 3) return false;
      }
      return true;
    },

    /** المسار الوحيد للضرر — يوحّد الأرقام والصوت والمؤثرات */
    dealDamage: function (src, target, amount, o) {
      if (!target || target.dead) return 0;
      o = o || {};
      var byPlayer = src === this.player;
      var crit = false;
      if (byPlayer) {
        crit = o.crit !== undefined ? o.crit : (Math.random() < this.player.crit);
        if (crit) amount *= this.player.critMul;
      }
      var dealt = target.hurt(amount, {
        ang: o.ang, knock: o.knock, stun: o.stun, slow: o.slow,
        crit: crit, byPlayer: byPlayer, noText: o.noText,
        srcX: src ? src.x : o.srcX, srcY: src ? src.y : o.srcY
      }, this);

      if (dealt > 0 && byPlayer) {
        this.player.onHit(dealt, target, this);
        if (crit) { FX.shake(3.5); FX.hitstop(0.05); }
        else if (o.finisher) FX.hitstop(0.05);
        else FX.hitstop(0.02);
        A.play('hit', (o.finisher || crit) ? 1 : 0);
      }
      return dealt;
    },

    playerMelee: function (x, y, ang, range, halfArc, dmg, finisher) {
      var hits = 0;
      for (var i = 0; i < this.units.length; i++) {
        var u = this.units[i];
        if (u.dead || u.team !== FOE) continue;
        if (U.dist2(x, y, u.x, u.y) > (range + u.r) * (range + u.r)) continue;
        if (Math.abs(U.angDiff(ang, U.angleTo(x, y, u.x, u.y))) > halfArc) continue;
        this.dealDamage(this.player, u, dmg, {
          ang: U.angleTo(x, y, u.x, u.y), knock: finisher ? 440 : 170, finisher: finisher
        });
        hits++;
      }
      return hits;
    },

    /** ضررٌ قوسي من وحدةٍ على خصومها */
    arcDamage: function (src, x, y, ang, range, halfArc, dmg) {
      var foeTeam = src.team === FRIEND ? FOE : FRIEND;
      for (var i = 0; i < this.units.length; i++) {
        var u = this.units[i];
        if (u.dead || u.team !== foeTeam) continue;
        if (U.dist2(x, y, u.x, u.y) > (range + u.r) * (range + u.r)) continue;
        if (Math.abs(U.angDiff(ang, U.angleTo(x, y, u.x, u.y))) > halfArc) continue;
        this.dealDamage(src, u, dmg, { ang: U.angleTo(x, y, u.x, u.y), knock: 240 });
      }
    },

    circleDamage: function (src, x, y, r, dmg, knock) {
      var foeTeam = src.team === FRIEND ? FOE : FRIEND;
      for (var i = 0; i < this.units.length; i++) {
        var u = this.units[i];
        if (u.dead || u.team !== foeTeam) continue;
        if (U.dist(x, y, u.x, u.y) > r + u.r) continue;
        this.dealDamage(src, u, dmg, { ang: U.angleTo(x, y, u.x, u.y), knock: knock || 200 });
      }
    },

    spawnProjectile: function (o) { this.projectiles.push(new MAL.Projectile(o)); },

    /* ====================================================
       الأحداث
       ==================================================== */
    onUnitKilled: function (u) {
      if (u.team === FOE) {
        this.foeKilled++;
        this.player.stats.kills++;
        S.bumpStat('kills', 1);
        this.player.gainUlt(3.5);
        var n = 1 + (Math.random() < 0.3 ? 1 : 0);
        for (var i = 0; i < n; i++) {
          this.pickups.push(new MAL.Pickup(u.x, u.y, 'gold', 3 + Math.round(this.stageIndex * 0.35)));
        }
        if (this.player.hp < this.player.maxHp * 0.55 && Math.random() < 0.10) {
          this.pickups.push(new MAL.Pickup(u.x, u.y, 'heal', Math.round(this.player.maxHp * 0.12)));
        }
      }
    },

    onCommanderKilled: function (c) {
      this.cmdDeathT = 0.001;
      S.bumpStat('commanders', 1);
      A.music.setIntensity(0.2);
      for (var i = 0; i < 12; i++) {
        var a = U.rand(0, U.TAU), d = U.rand(10, 80);
        this.pickups.push(new MAL.Pickup(c.x + Math.cos(a) * d, c.y + Math.sin(a) * d, 'gold', 10));
      }
      this.pickups.push(new MAL.Pickup(c.x, c.y, 'heal', Math.round(this.player.maxHp * 0.3)));
    },

    collect: function (pk) {
      var p = this.player;
      if (pk.kind === 'gold') {
        this.gold += pk.value;
        p.stats.gold += pk.value;
        A.play('coin');
      } else {
        p.heal(pk.value);
        A.play('heal');
        FX.ring(p.x, p.y, { r0: 6, r1: 38, color: '#9ee5b0', life: 0.4, width: 3 });
      }
    },

    /* ====================================================
       التحديث
       ==================================================== */
    update: function (dt, rdt) {
      this.time += rdt;
      if (!this.running || this.state !== 'playing') return;
      var p = this.player, i;
      this.runTime += dt;
      S.bumpStat('timePlayed', dt);

      if (MAL.Input.consumePause()) { MAL.UI.pause(); return; }
      if (MAL.Input.consumeDash()) p.tryDash();
      if (MAL.Input.consumeUlt()) p.useUlt(this);

      // ---- ضغطٌ متأخر: إن طالت المعركة اشتدّ الزحف ----
      this.pressure = 1 + U.clamp((this.runTime - 120) / 180, 0, 0.35);

      // ---- تدفّق جيش الخصم ----
      if (this.foeQueue.length) {
        this.foeSpawnT -= dt;
        if (this.foeSpawnT <= 0 && this.liveCount(FOE) < MAX_LIVE_FOES) {
          this.foeSpawnT = 0.22;
          this.spawnFoe(this.foeQueue.pop());
        }
      }

      // ---- دخول قائد الخصم بعد سقوط نصف جيشه (أو حين لا يبقى منهم أحد) ----
      var halfDown = this.foeKilled >= Math.ceil(this.foeTotal * 0.5);
      var fieldEmpty = !this.foeQueue.length && this.liveCount(FOE) === 0;
      if (!this.cmdSpawned && (halfDown || fieldEmpty)) {
        this.cmdSpawned = true;
        this.commander = new MAL.Commander(this.setup, this);
        this.units.push(this.commander);
        MAL.UI.showCommander(this.commander);
        MAL.UI.banner(this.commander.name, this.setup.faction.name);
        A.play('boss');
        A.music.setIntensity(1);
        FX.flash('#a8372c', 0.3, 0.6);
      }

      // ---- الوحدات ----
      for (i = 0; i < this.units.length; i++) {
        var u = this.units[i];
        if (u.dead && u.kind !== 'commander') continue;
        u.update(dt, this);
      }
      this.separate(dt);

      for (i = 0; i < this.projectiles.length; i++) this.projectiles[i].update(dt, this);
      for (i = 0; i < this.pickups.length; i++) this.pickups[i].update(dt, this);

      U.removeDead(this.units);
      U.removeDead(this.projectiles);
      U.removeDead(this.pickups);

      // ---- نهاية المعركة ----
      if (this.commander && this.commander.dead) {
        this.cmdDeathT += dt;
        if (this.cmdDeathT > 1.0 && !this.commander.remove) this.commander.remove = true;
        if (this.cmdDeathT > 1.6 && this.liveCount(FOE) === 0 && !this.foeQueue.length) { this.victory(); return; }
      }
      if (this.cmdSpawned && this.commander && !this.commander.dead &&
          this.liveCount(FOE) === 0 && !this.foeQueue.length) {
        // بقي القائد وحده — لا شيء يُفعل، القتال معه
      }

      if (p.dead) {
        this.deathT += dt;
        if (this.deathT < 0.05) {
          FX.slow(0.2, 1.2); FX.flash('#a8372c', 0.5, 0.7); FX.shake(20);
          A.play('lose'); A.music.stop(1.2);
        }
        if (this.deathT > 1.2) { this.defeat(); return; }
      }

      // ---- الكاميرا ----
      var lead = 50;
      this.cam.tx = p.x + Math.cos(p.aimAngle) * lead * (MAL.Input.aim.active ? 1 : 0.4);
      this.cam.ty = p.y + Math.sin(p.aimAngle) * lead * (MAL.Input.aim.active ? 1 : 0.4);
      var halfW = this.w / this.cam.s / 2, halfH = this.h / this.cam.s / 2;
      var maxX = Math.max(0, this.arenaR + 50 - halfW), maxY = Math.max(0, this.arenaR + 50 - halfH);
      this.cam.tx = U.clamp(this.cam.tx, -maxX, maxX);
      this.cam.ty = U.clamp(this.cam.ty, -maxY, maxY);
      this.cam.x = U.damp(this.cam.x, this.cam.tx, 9, dt);
      this.cam.y = U.damp(this.cam.y, this.cam.ty, 9, dt);

      MAL.UI.updateHUD(this);
    },

    separate: function (dt) {
      var list = this.units, n = list.length;
      for (var i = 0; i < n; i++) {
        var a = list[i];
        if (a.dead || a.kind === 'commander') continue;
        for (var j = i + 1; j < n; j++) {
          var b = list[j];
          if (b.dead || b.kind === 'commander') continue;
          var dx = b.x - a.x, dy = b.y - a.y;
          var min = a.r + b.r;
          var d2 = dx * dx + dy * dy;
          if (d2 >= min * min || d2 < 0.0001) continue;
          var d = Math.sqrt(d2);
          var push = (min - d) / d * 0.5;
          a.x -= dx * push; a.y -= dy * push;
          b.x += dx * push; b.y += dy * push;
        }
      }
    },

    /* ====================================================
       النهايات
       ==================================================== */
    victory: function () {
      this.state = 'victory';
      this.running = false;
      MAL.Input.enabled = false;
      A.music.stop(1.4);
      A.play('win');
      var first = !S.stageCleared(this.stageIndex);
      S.clearStage(this.stageIndex);
      S.unlockStage(this.stageIndex + 1);
      MAL.UI.showVictory(this, first);
    },

    defeat: function () {
      this.state = 'dead';
      this.running = false;
      MAL.Input.enabled = false;
      var keep = Math.round(this.gold * 0.5);
      S.addGold(keep);
      MAL.UI.showDefeat(this, keep);
    },

    endBattle: function () {
      this.running = false;
      this.state = 'menu';
      MAL.Input.enabled = false;
      MAL.Input.clear();
      A.music.stop();
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
      var c = this.ctx, w = this.w, h = this.h, i;
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      if (!this.setup) return;

      c.save();
      c.translate(w / 2 + FX.shakeX, h / 2 + FX.shakeY);
      c.scale(this.cam.s, this.cam.s);
      c.translate(-this.cam.x, -this.cam.y);

      R.drawArena(c, this.arena);
      FX.drawDecals(c);

      if (this.commander && !this.commander.dead) this.commander.drawTelegraphs(c);
      for (i = 0; i < this.pickups.length; i++) R.pickup(c, this.pickups[i], this.time);

      var list = [];
      for (i = 0; i < this.units.length; i++) {
        var u = this.units[i];
        if (u.dead && u.kind !== 'commander') continue;
        list.push(u);
      }
      list.sort(function (a, b) { return a.y - b.y; });
      for (i = 0; i < list.length; i++) list[i].draw(c, this.time);

      for (i = 0; i < this.projectiles.length; i++) R.projectile(c, this.projectiles[i]);

      FX.draw(c);
      FX.drawText(c);
      c.restore();

      FX.drawFlash(c, w, h);
      if (this.state === 'playing' && MAL.Input.enabled) R.sticks(c, MAL.Input, w, h, this.time);
    }
  };

  MAL.Game = Game;
})(typeof window !== 'undefined' ? window : globalThis);
