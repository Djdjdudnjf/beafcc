/* ============================================================
   ui.js — الشاشات، الـHUD، البطاقات، القوائم
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U, D = MAL.Data, S = MAL.Save, A = MAL.Audio, R = MAL.R, FX = MAL.FX;

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function icon(name) {
    var p = D.icons[name] || D.icons.star;
    return '<svg viewBox="0 0 24 24">' + p.split(/(?=M)/).map(function (d) {
      return '<path d="' + d.trim() + '"/>';
    }).join('') + '</svg>';
  }

  var RAR = {
    common: { n: 'شائعة', w: 62 },
    rare: { n: 'نادرة', w: 26 },
    epic: { n: 'ملحمية', w: 9.5 },
    legend: { n: 'أسطورية', w: 2.5 }
  };

  var UI = {
    game: null,
    screen: 'title',
    selectedHero: 'faris',
    cardChoices: [],
    rerolls: 1,
    _hud: {},
    _toastT: null,

    /* ==================================================== */
    init: function (game) {
      this.game = game;
      var self = this;
      this.selectedHero = S.data.lastHero || 'faris';
      if (!S.heroUnlocked(this.selectedHero)) this.selectedHero = 'faris';

      // أزرار التنقل
      document.addEventListener('click', function (e) {
        var t = e.target.closest ? e.target.closest('[data-go]') : null;
        if (!t) return;
        var to = t.getAttribute('data-go');
        A.play(to === 'title' ? 'uiBack' : 'ui');
        if (to === 'play') self.play();
        else self.go(to);
      });

      $('btnPause').addEventListener('click', function () { self.pause(); });
      $('btnResume').addEventListener('click', function () { A.play('ui'); self.resume(); });
      $('btnPauseSettings').addEventListener('click', function () {
        A.play('ui'); self.overlay('ov-pause', false); self.go('settings'); self._fromPause = true;
      });
      $('btnQuit').addEventListener('click', function () { A.play('uiBack'); self.quit(); });
      $('btnRetry').addEventListener('click', function () {
        A.play('ui'); self.overlay('ov-defeat', false);
        self.startGame(self.game.regionIdx, self.game.hero.id, self.game.endless);
      });
      $('btnDefeatHome').addEventListener('click', function () {
        A.play('uiBack'); self.overlay('ov-defeat', false); self.quit();
      });
      $('btnVictoryHome').addEventListener('click', function () {
        A.play('uiBack'); self.overlay('ov-victory', false); self.quit();
      });
      $('btnNextRegion').addEventListener('click', function () {
        A.play('ui'); self.overlay('ov-victory', false);
        var g = self.game;
        var next = g.endless ? g.regionIdx : Math.min(D.regions.length - 1, g.regionIdx + 1);
        if (!g.endless && next === g.regionIdx) { self.quit(); return; }
        self.startGame(next, g.hero.id, g.endless);
      });
      $('btnReroll').addEventListener('click', function () { self.reroll(); });

      this.buildSettings();
      this.refreshTitle();
    },

    /* ==================================================== */
    go: function (name) {
      var screens = ['title', 'heroes', 'regions', 'forge', 'codex', 'settings'];
      for (var i = 0; i < screens.length; i++) {
        var s = $('screen-' + screens[i]);
        if (s) s.classList.toggle('active', screens[i] === name);
      }
      this.screen = name;
      if (name === 'heroes') this.buildHeroes();
      if (name === 'regions') this.buildRegions();
      if (name === 'forge') this.buildForge();
      if (name === 'codex') this.buildCodex();
      if (name === 'settings') this.buildSettings();
      if (name === 'title') {
        this.refreshTitle();
        if (this._fromPause) {
          this._fromPause = false;
          $('screen-settings').classList.remove('active');
          $('screen-title').classList.remove('active');
          this.overlay('ov-pause', true);
        }
      }
      this.refreshGold();
    },

    hideScreens: function () {
      var screens = ['title', 'heroes', 'regions', 'forge', 'codex', 'settings'];
      for (var i = 0; i < screens.length; i++) {
        var s = $('screen-' + screens[i]);
        if (s) s.classList.remove('active');
      }
    },

    refreshGold: function () {
      var list = document.querySelectorAll('[data-gold]');
      for (var i = 0; i < list.length; i++) list[i].textContent = U.arGroup(S.data.gold);
    },

    refreshTitle: function () {
      var idx = S.nextRegionIndex(D.regions);
      var r = D.regions[idx];
      var hero = D.heroById(this.selectedHero);
      $('titleContinue').textContent = r.name + ' · ' + hero.name;
      var st = S.data.stats;
      $('titleStats').innerHTML =
        'الأقاليم المفتوحة ' + U.frac(S.data.regionsUnlocked, D.regions.length) +
        ' · القتلى ' + U.arGroup(st.kills || 0) +
        ' · الذهب ' + U.arGroup(S.data.gold);
      this.refreshGold();
    },

    /* ==================================================== */
    play: function () {
      var idx = S.nextRegionIndex(D.regions);
      this.startGame(idx, this.selectedHero, false);
    },

    startGame: function (regionIdx, heroId, endless) {
      A.init(); A.resume();
      S.data.lastHero = heroId; S.data.lastRegion = regionIdx; S.save();
      this.hideScreens();
      this.overlay('ov-cards', false);
      this.overlay('ov-pause', false);
      this.overlay('ov-defeat', false);
      this.overlay('ov-victory', false);
      $('hud').classList.remove('hidden');
      $('bossBar').classList.add('hidden');
      $('hud').classList.remove('boss-on');
      this.rerolls = 1;
      this._hud = {};
      this.game.startRun(regionIdx, heroId, endless);
      var hero = D.heroById(heroId);
      $('ultName').textContent = hero.ult.name;
      R.portrait($('portraitCv'), hero, 0);
      this.buildPerks();
      this.updateHUD(this.game);
    },

    quit: function () {
      this.game.endRun();
      $('hud').classList.add('hidden');
      $('bossBar').classList.add('hidden');
      this.overlay('ov-pause', false);
      this.overlay('ov-defeat', false);
      this.overlay('ov-victory', false);
      this.go('title');
    },

    pause: function () {
      var g = this.game;
      if (g.state !== 'playing') return;
      g.state = 'paused';
      MAL.Input.enabled = false;
      MAL.Input.clear();
      A.play('ui');
      $('pauseStats').innerHTML = this.runStats(g);
      this.overlay('ov-pause', true);
    },

    resume: function () {
      var g = this.game;
      if (g.state !== 'paused') return;
      this.overlay('ov-pause', false);
      g.state = 'playing';
      MAL.Input.enabled = true;
      A.resume();
    },

    overlay: function (id, on) {
      var e = $(id);
      if (e) e.classList.toggle('on', !!on);
    },

    toast: function (msg) {
      var t = $('toast');
      t.textContent = msg;
      t.classList.add('on');
      clearTimeout(this._toastT);
      this._toastT = setTimeout(function () { t.classList.remove('on'); }, 1900);
    },

    banner: function (title, sub) {
      var b = $('waveBanner');
      b.querySelector('b').textContent = title;
      b.querySelector('small').textContent = sub || '';
      b.classList.remove('show');
      void b.offsetWidth;
      b.classList.add('show');
    },

    showBoss: function (boss) {
      $('bossName').textContent = boss.name;
      $('bossTitle').textContent = boss.title;
      $('bossFill').style.width = '100%';
      $('bossFillLag').style.width = '100%';
      $('bossBar').classList.remove('hidden');
      $('hud').classList.add('boss-on');
    },

    /* ==================================================== */
    updateHUD: function (g) {
      if (!g.player) return;
      var p = g.player, c = this._hud;

      var hpPct = U.clamp(p.hp / p.maxHp, 0, 1) * 100;
      if (c.hp !== hpPct) {
        c.hp = hpPct;
        $('hpFill').style.width = hpPct + '%';
        $('hpText').textContent = U.frac(Math.ceil(p.hp), Math.round(p.maxHp));
      }
      var shPct = p.shieldMax > 0 ? U.clamp(p.shield / p.maxHp, 0, 1) * 100 : 0;
      if (c.sh !== shPct) { c.sh = shPct; $('hpShield').style.width = shPct + '%'; }

      var ultPct = U.clamp(p.ult / p.ultMax, 0, 1) * 100;
      if (c.ult !== ultPct) {
        c.ult = ultPct;
        $('ultFill').style.width = ultPct + '%';
        var full = ultPct >= 100;
        $('ultFill').parentNode.classList.toggle('full', full);
        $('padUlt').classList.toggle('ready', full);
        $('ultCover').style.clipPath = 'inset(0 0 ' + ultPct + '% 0)';
      }

      if (c.gold !== g.gold) { c.gold = g.gold; $('goldText').textContent = U.arGroup(g.gold); }

      var wl = g.waveState === 'boss' ? 'الزعيم' : ('الموجة ' + (g.endless ? U.ar(g.wave) : U.frac(g.wave, g.totalWaves)));
      if (c.wave !== wl) {
        c.wave = wl;
        $('waveLabel').textContent = wl;
        $('regionLabel').textContent = g.region.name;
      }

      var remain = g.spawnQueue.length + g.enemies.length;
      var total = c.waveTotal || 1;
      if (g.waveState === 'fight' && (c.waveNo !== g.wave)) {
        c.waveNo = g.wave;
        c.waveTotal = Math.max(1, g.spawnQueue.length + g.enemies.length);
        total = c.waveTotal;
      }
      var pct = g.waveState === 'boss' ? 0 : U.clamp(remain / total, 0, 1) * 100;
      if (c.track !== pct) { c.track = pct; $('enemyTrackFill').style.width = pct + '%'; }

      // شحنات الاندفاع
      if (c.dash !== p.dashCharges || c.dashMax !== p.dashMax) {
        c.dash = p.dashCharges; c.dashMax = p.dashMax;
        var html = '';
        for (var i = 0; i < p.dashMax; i++) html += '<u class="' + (i < p.dashCharges ? 'on' : '') + '"></u>';
        $('dashCharges').innerHTML = html;
        $('padDash').classList.toggle('cold', p.dashCharges === 0);
      }

      // المتتالية
      var cb = $('comboBox');
      if (p.combo >= 3) {
        cb.classList.add('on');
        cb.classList.toggle('hot', p.combo >= 15);
        if (c.combo !== p.combo) { c.combo = p.combo; $('comboVal').textContent = U.ar(p.combo); }
      } else cb.classList.remove('on');

      // شريط الزعيم
      if (g.boss && !g.boss.remove) {
        var bp = U.clamp(g.boss.hp / g.boss.maxHp, 0, 1) * 100;
        if (c.boss !== bp) {
          c.boss = bp;
          $('bossFill').style.width = bp + '%';
          $('bossFillLag').style.width = bp + '%';
        }
      } else if (c.bossShown) {
        c.bossShown = false;
        $('bossBar').classList.add('hidden');
        $('hud').classList.remove('boss-on');
      }
      if (g.boss && !g.boss.remove) c.bossShown = true;
    },

    buildPerks: function () {
      var p = this.game.player, strip = $('perkStrip');
      strip.innerHTML = '';
      for (var id in p.upgrades) {
        var up = D.upgradeById(id);
        if (!up) continue;
        var pip = el('div', 'perk-pip', icon(up.i) + (p.upgrades[id] > 1 ? '<u>' + U.ar(p.upgrades[id]) + '</u>' : ''));
        pip.title = up.n;
        strip.appendChild(pip);
      }
    },

    /* ====================================================
       بطاقات الغنيمة
       ==================================================== */
    rollCards: function (n) {
      var p = this.game.player, wave = this.game.wave;
      var pool = D.upgrades.filter(function (u) {
        return (p.upgrades[u.id] || 0) < u.max;
      });
      var out = [];
      var bonus = Math.min(2.4, 1 + wave * 0.09);
      for (var i = 0; i < n && pool.length; i++) {
        var pickIdx = -1;
        var choice = U.weightedPick(pool, function (u) {
          var w = RAR[u.r].w;
          if (u.r === 'epic') w *= bonus;
          if (u.r === 'legend') w *= bonus * 1.2;
          return w;
        });
        pickIdx = pool.indexOf(choice);
        if (pickIdx >= 0) pool.splice(pickIdx, 1);
        out.push(choice);
      }
      return out;
    },

    showCards: function (g) {
      var self = this;
      g.state = 'cards';
      MAL.Input.enabled = false;
      MAL.Input.clear();
      A.play('card');
      $('cardsSub').textContent = 'الموجة ' + U.ar(g.wave) + ' انتهت — اختر واحدة';
      this.cardChoices = this.rollCards(3);
      this.renderCards();
      $('rerollLeft').textContent = U.ar(this.rerolls);
      $('btnReroll').style.display = this.rerolls > 0 ? 'flex' : 'none';
      this.overlay('ov-cards', true);
    },

    renderCards: function () {
      var row = $('cardRow'), self = this;
      row.innerHTML = '';
      if (!this.cardChoices.length) {
        var none = el('div', 'card r-common', '<div class="ci">' + icon('coin') + '</div><b>ذهبٌ إضافي</b><p>لا مزيد من الترقيات — خذ ١٠٠ ذهب.</p>');
        none.addEventListener('click', function () { self.game.gold += 100; self.pickCard(null); });
        row.appendChild(none);
        return;
      }
      this.cardChoices.forEach(function (up, i) {
        var p = self.game.player;
        var have = p.upgrades[up.id] || 0;
        var card = el('div', 'card r-' + up.r);
        card.innerHTML =
          (have ? '<span class="stack">×' + U.ar(have) + '</span>' : '') +
          '<div class="ci">' + icon(up.i) + '</div>' +
          '<span class="rar">' + RAR[up.r].n + '</span>' +
          '<b>' + up.n + '</b>' +
          '<p>' + up.d + '</p>';
        card.addEventListener('click', function () { self.pickCard(up); });
        row.appendChild(card);
      });
    },

    reroll: function () {
      if (this.rerolls <= 0) { A.play('deny'); return; }
      this.rerolls--;
      A.play('card');
      this.cardChoices = this.rollCards(3);
      this.renderCards();
      $('rerollLeft').textContent = U.ar(this.rerolls);
      if (this.rerolls <= 0) $('btnReroll').style.display = 'none';
    },

    pickCard: function (up) {
      var g = this.game;
      if (up) {
        g.player.addUpgrade(up);
        A.play('card');
        this.toast(up.n + ' — ' + up.d);
      }
      this.buildPerks();
      this.overlay('ov-cards', false);
      g.state = 'playing';
      MAL.Input.enabled = true;
      g.waveState = 'idle';
      g.nextWave();
    },

    /* ====================================================
       نهايات الجولة
       ==================================================== */
    runStats: function (g) {
      var p = g.player;
      return '' +
        '<div class="rs"><b>' + U.ar(g.wave) + '</b><span>الموجة</span></div>' +
        '<div class="rs"><b>' + U.arGroup(p.stats.kills) + '</b><span>القتلى</span></div>' +
        '<div class="rs"><b>' + U.arGroup(g.gold) + '</b><span>الذهب</span></div>' +
        '<div class="rs"><b>' + U.arGroup(Math.round(p.stats.dmgDealt)) + '</b><span>الضرر</span></div>' +
        '<div class="rs"><b>' + U.arTime(g.runTime) + '</b><span>الزمن</span></div>';
    },

    showDefeat: function (g, reward) {
      $('defeatStats').innerHTML = this.runStats(g) +
        '<div class="rs"><b>+' + U.arGroup(reward) + '</b><span>ذهب مكتسب</span></div>';
      this.overlay('ov-defeat', true);
      this.checkUnlocks();
      this.refreshTitle();
    },

    showVictory: function (g, reward) {
      var cx = g.region.codex;
      var isNew = S.seeCodex(cx.id);
      $('victoryTitle').textContent = g.endless ? 'صمَدْت!' : 'فَتَحْتَ ' + g.region.name;
      $('victoryCodex').innerHTML =
        '<span class="ck">' + cx.k + (isNew ? ' · جديد' : '') + '</span>' +
        '<h4>' + cx.title + '</h4><p>' + cx.text + '</p>';
      $('victoryStats').innerHTML = this.runStats(g) +
        '<div class="rs"><b>+' + U.arGroup(reward) + '</b><span>ذهب مكتسب</span></div>';
      var last = g.regionIdx >= D.regions.length - 1;
      $('btnNextRegion').style.display = (last && !g.endless) ? 'none' : '';
      this.overlay('ov-victory', true);
      this.checkUnlocks();
      this.refreshTitle();
    },

    checkUnlocks: function () {
      var st = S.data.stats, msgs = [];
      function unlock(id, cond) {
        if (cond && !S.hasCodex(id)) { S.seeCodex(id); msgs.push(id); }
      }
      unlock('cx_zahrawi', (st.bosses || 0) >= 1);
      unlock('cx_firnas', (st.kills || 0) >= 500);
      var cleared = 0;
      for (var i = 0; i < D.regions.length; i++) if (S.isCleared(D.regions[i].id)) cleared++;
      unlock('cx_ziryab', cleared >= 3);
      unlock('cx_hazm', (st.perfectWaves || 0) >= 10);
      unlock('cx_mayrit', cleared >= D.regions.length);
      if (msgs.length) this.toast('فُتحت صفحة جديدة في السجل التاريخي');
    },

    /* ====================================================
       شاشة الأبطال
       ==================================================== */
    buildHeroes: function () {
      var grid = $('heroGrid'), self = this;
      grid.innerHTML = '';
      D.heroes.forEach(function (h) {
        var unlocked = S.heroUnlocked(h.id);
        var card = el('div', 'hero-card' + (h.id === self.selectedHero ? ' sel' : '') + (unlocked ? '' : ' locked'));
        var cv = el('canvas'); cv.width = 104; cv.height = 104;
        card.appendChild(cv);
        var txt = el('div', 'hc-txt', '<b>' + h.name + '</b><small>' + h.title + '</small>');
        card.appendChild(txt);
        if (!unlocked) card.appendChild(el('span', 'lock', U.arGroup(h.cost) + ' ذهب'));
        R.portrait(cv, h, 0);
        card.addEventListener('click', function () {
          A.play('ui');
          if (!unlocked) {
            if (S.spendGold(h.cost)) {
              S.unlockHero(h.id);
              self.selectedHero = h.id;
              self.toast('انضمّ إليك ' + h.name + '!');
              A.play('card');
            } else { A.play('deny'); self.toast('تحتاج ' + U.arGroup(h.cost - S.data.gold) + ' ذهباً إضافياً'); }
          } else {
            self.selectedHero = h.id;
            S.data.lastHero = h.id; S.save();
          }
          self.buildHeroes();
          self.refreshGold();
        });
        grid.appendChild(card);
      });
      this.buildHeroDetail();
    },

    buildHeroDetail: function () {
      var h = D.heroById(this.selectedHero), box = $('heroDetail');
      var statsHtml = '';
      for (var k in h.stats) {
        statsHtml += '<div class="stat-row"><span>' + k + '</span><div class="stat-bar"><i style="width:' +
          (h.stats[k] / 5 * 100) + '%"></i></div></div>';
      }
      box.innerHTML =
        '<div class="hd-head"><canvas width="156" height="156"></canvas><div>' +
        '<h3>' + h.name + '</h3><p>' + h.desc + '</p></div></div>' +
        statsHtml +
        '<div class="ability"><b>الضربة القاضية · ' + h.ult.name + '</b><p>' + h.ult.desc + '</p></div>' +
        '<div class="ability"><b>السلاح</b><p>' +
        (h.weapon === 'bow' ? 'قوسٌ عربي — يرمي من بعيد، ومداه ' + U.ar(h.range) + ' خطوة.' :
         h.weapon === 'shield' ? 'درقةٌ ودبّوس — تصدّ ' + U.ar(h.block * 100) + '٪ من الضرر القادم من أمامك.' :
         h.weapon === 'daggers' ? 'خنجران — أسرع ضربة في الأندلس، وفرصة حرجة ' + U.ar(h.crit * 100) + '٪.' :
         'سيفٌ أندلسي — كل ثالث ضربة قاصمةٌ تدفع الصفوف.') + '</p></div>';
      R.portrait(box.querySelector('canvas'), h, 0);
    },

    /* ====================================================
       شاشة الأقاليم
       ==================================================== */
    buildRegions: function () {
      var wrap = $('regionScroll'), self = this;
      wrap.innerHTML = '';
      D.regions.forEach(function (r, i) {
        var unlocked = S.regionUnlocked(i);
        var cleared = S.isCleared(r.id);
        var card = el('div', 'region-card' + (unlocked ? '' : ' locked') + (cleared ? ' done' : ''));
        var cv = el('canvas'); cv.width = 320; cv.height = 200;
        card.appendChild(cv);
        card.appendChild(el('div', 'rc-sh'));
        card.appendChild(el('div', 'idx', U.ar(i + 1)));
        var body = el('div', 'rc-body',
          '<h3>' + r.name + '</h3><p>' + r.sub + '</p>' +
          (S.getBest(r.id) ? '<div class="best">أفضل موجة: ' + U.ar(S.getBest(r.id)) + (cleared ? ' · فُتح' : '') + '</div>' : ''));
        card.appendChild(body);
        if (!unlocked) card.appendChild(el('div', 'lock-tag', '🔒 أكمل الإقليم السابق'));
        R.regionThumb(cv, r, 0);
        card.addEventListener('click', function () {
          if (!unlocked) { A.play('deny'); self.toast('عليك فتح ' + D.regions[i - 1].name + ' أولاً'); return; }
          A.play('ui');
          self.startGame(i, self.selectedHero, false);
        });
        wrap.appendChild(card);
      });

      // وضع الأبدية
      var anyCleared = S.isCleared(D.regions[0].id);
      var e = el('div', 'region-card' + (anyCleared ? '' : ' locked'));
      var cv2 = el('canvas'); cv2.width = 320; cv2.height = 200;
      e.appendChild(cv2);
      e.appendChild(el('div', 'rc-sh'));
      e.appendChild(el('div', 'idx', '∞'));
      e.appendChild(el('div', 'rc-body',
        '<h3>حِصارٌ لا ينتهي</h3><p>موجاتٌ بلا نهاية · زعيمٌ كل ٦ موجات</p>' +
        (S.data.stats.bestEndless ? '<div class="best">أفضل رقم: ' + U.ar(S.data.stats.bestEndless) + '</div>' : '')));
      if (!anyCleared) e.appendChild(el('div', 'lock-tag', '🔒 أكمل جبل طارق أولاً'));
      R.regionThumb(cv2, D.regions[D.regions.length - 1], 0);
      e.addEventListener('click', function () {
        if (!anyCleared) { A.play('deny'); return; }
        A.play('ui');
        var best = 0;
        for (var i = 0; i < D.regions.length; i++) if (S.regionUnlocked(i)) best = i;
        self.startGame(best, self.selectedHero, true);
      });
      wrap.appendChild(e);
    },

    /* ====================================================
       دار الصنعة
       ==================================================== */
    buildForge: function () {
      var grid = $('forgeGrid'), self = this;
      grid.innerHTML = '';
      D.forge.forEach(function (f) {
        var lv = S.forgeLevel(f.id);
        var maxed = lv >= f.max;
        var cost = maxed ? 0 : f.cost(lv);
        var card = el('div', 'forge-card');
        var pips = '';
        for (var i = 0; i < f.max; i++) pips += '<i class="' + (i < lv ? 'on' : '') + '"></i>';
        card.innerHTML =
          '<div class="fh"><div class="fi">' + icon(f.i) + '</div><div><b>' + f.n + '</b></div></div>' +
          '<p>' + f.d + '</p>' +
          '<div class="pips">' + pips + '</div>';
        var btn = el('button', 'forge-buy' + (maxed ? ' max' : (S.data.gold < cost ? ' poor' : '')),
          maxed ? 'مكتمل ✓' : ('<span class="coin"></span> ' + U.arGroup(cost)));
        btn.addEventListener('click', function () {
          if (maxed) { A.play('deny'); return; }
          if (S.spendGold(cost)) {
            S.setForge(f.id, lv + 1);
            A.play('card');
            self.toast(f.n + ' → ' + U.ar(lv + 1));
            self.buildForge();
            self.refreshGold();
          } else { A.play('deny'); self.toast('تحتاج ' + U.arGroup(cost - S.data.gold) + ' ذهباً إضافياً'); }
        });
        card.appendChild(btn);
        grid.appendChild(card);
      });
    },

    /* ====================================================
       السجل
       ==================================================== */
    buildCodex: function () {
      var list = $('codexList');
      var all = D.allCodex();
      var seen = 0;
      list.innerHTML = '';
      all.forEach(function (cx) {
        var has = S.hasCodex(cx.id);
        if (has) seen++;
        var card = el('div', 'codex-card' + (has ? '' : ' sealed'),
          '<span class="ck">' + cx.k + '</span><h4>' + (has ? cx.title : '؟؟؟') + '</h4>' +
          '<p>' + (has ? cx.text : (cx.how || 'أكمل هذا الإقليم لتفتح صفحته.')) + '</p>');
        list.appendChild(card);
      });
      $('codexCount').textContent = U.frac(seen, all.length);
    },

    /* ====================================================
       الإعدادات
       ==================================================== */
    buildSettings: function () {
      var body = $('settingsBody'), self = this;
      if (!body) return;
      body.innerHTML = '';

      function switchRow(title, sub, key, onChange) {
        var row = el('div', 'set-row', '<div class="st"><b>' + title + '</b><small>' + sub + '</small></div>');
        var sw = el('button', 'switch' + (S.setting(key) ? ' on' : ''));
        sw.addEventListener('click', function () {
          var v = S.setting(key) ? 0 : 1;
          S.setting(key, v);
          sw.classList.toggle('on', !!v);
          A.play('ui');
          if (onChange) onChange(v);
        });
        row.appendChild(sw);
        body.appendChild(row);
      }

      switchRow('المؤثرات الصوتية', 'أصوات السيوف والضربات', 'sfx', function (v) { A.setSfx(v); });
      switchRow('الموسيقى', 'موسيقى أندلسية مولَّدة لحظياً', 'music', function (v) { A.setMusic(v); });
      switchRow('الاهتزاز', 'اهتزاز خفيف عند الإصابة', 'haptics');
      switchRow('وضع الأعسر', 'تبديل جهتَي التحكم', 'lefty', function (v) {
        MAL.Input.setLefty(v);
        document.body.classList.toggle('lefty', !!v);
      });
      switchRow('التصويب التلقائي', 'يهاجم أقرب عدوٍّ تلقائياً', 'autoAim');

      // جودة الرسم
      var qRow = el('div', 'set-row', '<div class="st"><b>جودة الرسم</b><small>خفّضها لو تأخرت اللعبة</small></div>');
      var seg = el('div', 'seg');
      [['auto', 'تلقائي'], ['high', 'عالية'], ['low', 'خفيفة']].forEach(function (o) {
        var b = el('button', S.setting('quality') === o[0] ? 'on' : '', o[1]);
        b.addEventListener('click', function () {
          S.setting('quality', o[0]);
          A.play('ui');
          self.buildSettings();
          MAL.applyQuality();
        });
        seg.appendChild(b);
      });
      qRow.appendChild(seg);
      body.appendChild(qRow);

      // إعادة ضبط
      var rRow = el('div', 'set-row', '<div class="st"><b>محو التقدّم</b><small>يمحو الذهب والأقاليم والسجل — لا رجعة</small></div>');
      var rb = el('button', 'back', 'محو');
      rb.addEventListener('click', function () {
        if (rb.dataset.armed) {
          S.reset();
          A.play('deny');
          self.toast('مُحي كل التقدّم');
          self.selectedHero = 'faris';
          self.buildSettings();
          self.refreshTitle();
        } else {
          rb.dataset.armed = '1';
          rb.textContent = 'متأكد؟ اضغط ثانية';
          A.play('deny');
          setTimeout(function () { delete rb.dataset.armed; rb.textContent = 'محو'; }, 3500);
        }
      });
      rRow.appendChild(rb);
      body.appendChild(rRow);

      var info = el('div', 'set-row',
        '<div class="st"><b>أنْدَلُس — سيفٌ في الغرب</b>' +
        '<small>تحكّم: إصبعٌ يسار للحركة، إصبعٌ يمين للتصويب · على الحاسوب: WASD + الفأرة، مسافة للاندفاع، Shift للقاضية</small></div>');
      body.appendChild(info);
    }
  };

  MAL.UI = UI;
})(typeof window !== 'undefined' ? window : globalThis);
