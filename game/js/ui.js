/* ============================================================
   ui.js — الشاشات، الـHUD، غنائم النصر، القوائم
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U, D = MAL.Data, S = MAL.Save, A = MAL.Audio, R = MAL.R;

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

  var UI = {
    game: null,
    screen: 'title',
    briefIndex: 0,
    _hud: {},
    _toastT: null,

    /* ==================================================== */
    init: function (game) {
      this.game = game;
      var self = this;

      document.addEventListener('click', function (e) {
        var t = e.target.closest ? e.target.closest('[data-go]') : null;
        if (!t) return;
        var to = t.getAttribute('data-go');
        A.play(to === 'title' ? 'uiBack' : 'ui');
        if (to === 'play') self.playNext();
        else self.go(to);
      });

      $('btnPause').addEventListener('click', function () { self.pause(); });
      $('btnResume').addEventListener('click', function () { A.play('ui'); self.resume(); });
      $('btnPauseSettings').addEventListener('click', function () {
        A.play('ui'); self.overlay('ov-pause', false); self._fromPause = true; self.go('settings');
      });
      $('btnQuit').addEventListener('click', function () { A.play('uiBack'); self.quit(); });

      $('btnStartBattle').addEventListener('click', function () {
        A.play('ui'); self.overlay('ov-brief', false); self.startBattle(self.briefIndex);
      });
      $('btnBriefBack').addEventListener('click', function () {
        A.play('uiBack'); self.overlay('ov-brief', false);
      });

      $('btnRetry').addEventListener('click', function () {
        A.play('ui'); self.overlay('ov-defeat', false); self.startBattle(self.game.stageIndex);
      });
      $('btnDefeatArmory').addEventListener('click', function () {
        A.play('ui'); self.overlay('ov-defeat', false); self.quitToMenu(); self.go('armory');
      });
      $('btnDefeatHome').addEventListener('click', function () {
        A.play('uiBack'); self.overlay('ov-defeat', false); self.quit();
      });
      $('btnVictoryHome').addEventListener('click', function () {
        A.play('uiBack'); self.overlay('ov-victory', false); self.quit();
      });
      $('btnNextStage').addEventListener('click', function () {
        A.play('ui'); self.overlay('ov-victory', false);
        var next = self.game.stageIndex + 1;
        if (next >= D.total) { self.quit(); return; }
        self.brief(next);
      });

      this.buildSettings();
      this.refreshTitle();
    },

    /* ==================================================== */
    go: function (name) {
      var screens = ['title', 'stages', 'armory', 'log', 'settings'];
      for (var i = 0; i < screens.length; i++) {
        var s = $('screen-' + screens[i]);
        if (s) s.classList.toggle('active', screens[i] === name);
      }
      this.screen = name;
      if (name === 'stages') this.buildStages();
      if (name === 'armory') this.buildArmory();
      if (name === 'log') this.buildLog();
      if (name === 'settings') this.buildSettings();
      if (name === 'title') {
        this.refreshTitle();
        if (this._fromPause) {
          this._fromPause = false;
          $('screen-title').classList.remove('active');
          this.overlay('ov-pause', true);
        }
      }
      this.refreshGold();
    },

    hideScreens: function () {
      var screens = ['title', 'stages', 'armory', 'log', 'settings'];
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
      var idx = S.nextStage(D.total);
      var st = D.stageAt(idx);
      $('titleContinue').textContent = U.ar(idx + 1) + '. ' + st.n + ' · ' + st.hy;
      var s = S.data.stats;
      $('titleStats').innerHTML =
        'المعارك ' + U.frac(S.clearedCount(), D.total) +
        ' · جيشك ' + U.ar(this.game.armySize()) +
        ' · السيف +' + U.ar(S.campaign('sword')) + '٪' +
        ' · الذهب ' + U.arGroup(S.data.gold);
      this.refreshGold();
    },

    /* ==================================================== */
    playNext: function () { this.brief(S.nextStage(D.total)); },

    /** بطاقةُ تعريفٍ بالمعركة قبل خوضها */
    brief: function (idx) {
      this.briefIndex = idx;
      var setup = D.stageSetup(idx), s = setup.stage;
      $('briefEra').textContent = U.ar(idx + 1) + ' / ' + U.ar(D.total) + ' · ' + setup.chapter.name;
      $('briefName').textContent = s.n;
      $('briefWhen').textContent = s.hy + ' — ' + s.ad + ' · ' + s.place;
      $('briefFoe').textContent = setup.faction.name;
      $('briefOurs').textContent = U.ar(this.game.armySize()) + ' مقاتلاً';
      $('briefTheirs').textContent = U.ar(setup.foes) + ' مقاتلاً';
      $('briefNote').textContent = s.note;
      this.overlay('ov-brief', true);
    },

    startBattle: function (idx) {
      A.init(); A.resume();
      this.hideScreens();
      ['ov-brief', 'ov-cards', 'ov-pause', 'ov-defeat', 'ov-victory'].forEach(function (o) {
        $(o).classList.remove('on');
      });
      $('hud').classList.remove('hidden');
      $('bossBar').classList.add('hidden');
      $('hud').classList.remove('boss-on');
      this._hud = {};
      this.game.startBattle(idx);
      R.portrait($('portraitCv'), D.hero, 0);
      this.updateHUD(this.game);
    },

    quitToMenu: function () {
      this.game.endBattle();
      $('hud').classList.add('hidden');
      $('bossBar').classList.add('hidden');
    },

    quit: function () {
      this.quitToMenu();
      ['ov-brief', 'ov-cards', 'ov-pause', 'ov-defeat', 'ov-victory'].forEach(function (o) {
        $(o).classList.remove('on');
      });
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

    showCommander: function (cmd) {
      $('bossName').textContent = cmd.name;
      $('bossTitle').textContent = cmd.faction;
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

      var name = g.setup ? g.setup.stage.n : '—';
      if (c.name !== name) {
        c.name = name;
        $('waveLabel').textContent = name;
        $('regionLabel').textContent = g.setup.stage.hy + ' · ' + g.setup.stage.place;
      }

      var ours = g.liveCount(MAL.FRIEND), theirs = g.liveCount(MAL.FOE) + g.foeQueue.length;
      if (c.ours !== ours) { c.ours = ours; $('armyOurs').textContent = U.ar(ours); }
      if (c.theirs !== theirs) {
        c.theirs = theirs;
        $('armyTheirs').textContent = U.ar(theirs);
        var pct = U.clamp(theirs / Math.max(1, g.foeTotal), 0, 1) * 100;
        $('enemyTrackFill').style.width = pct + '%';
      }

      if (c.dash !== p.dashCharges || c.dashMax !== p.dashMax) {
        c.dash = p.dashCharges; c.dashMax = p.dashMax;
        var html = '';
        for (var i = 0; i < p.dashMax; i++) html += '<u class="' + (i < p.dashCharges ? 'on' : '') + '"></u>';
        $('dashCharges').innerHTML = html;
        $('padDash').classList.toggle('cold', p.dashCharges === 0);
      }

      var cb = $('comboBox');
      if (p.combo >= 3) {
        cb.classList.add('on');
        cb.classList.toggle('hot', p.combo >= 15);
        if (c.combo !== p.combo) { c.combo = p.combo; $('comboVal').textContent = U.ar(p.combo); }
      } else cb.classList.remove('on');

      if (g.commander && !g.commander.remove) {
        var bp = U.clamp(g.commander.hp / g.commander.maxHp, 0, 1) * 100;
        if (c.boss !== bp) {
          c.boss = bp;
          $('bossFill').style.width = bp + '%';
          $('bossFillLag').style.width = bp + '%';
        }
        c.bossShown = true;
      } else if (c.bossShown) {
        c.bossShown = false;
        $('bossBar').classList.add('hidden');
        $('hud').classList.remove('boss-on');
      }
    },

    /* ====================================================
       غنائم النصر — ذهب / قوة السيف / عدد الجيش
       ==================================================== */
    rewardValues: function (idx) {
      return {
        gold: 70 + idx * 16,
        sword: 7 + Math.floor(idx / 12),
        army: 2 + Math.floor(idx / 14)
      };
    },

    showRewards: function (g) {
      var self = this;
      var idx = g.stageIndex;
      var vals = this.rewardValues(idx);
      $('cardsSub').textContent = 'نُصِرتَ في ' + g.setup.stage.n + ' — اختر غنيمتك';
      var row = $('cardRow');
      row.innerHTML = '';
      D.rewards.forEach(function (rw) {
        var v = vals[rw.id];
        var card = el('div', 'card r-legend');
        card.style.setProperty('--rc', rw.color);
        card.innerHTML =
          '<div class="ci">' + icon(rw.i) + '</div>' +
          '<b>' + rw.n + '</b>' +
          '<p>' + rw.d(v) + '</p>' +
          '<span class="rwv">+' + (rw.id === 'sword' ? U.ar(v) + '٪' : U.arGroup(v)) + '</span>';
        card.addEventListener('click', function () { self.takeReward(rw.id, v, g); });
        row.appendChild(card);
      });
      A.play('card');
      this.overlay('ov-cards', true);
    },

    takeReward: function (id, v, g) {
      if (id === 'gold') { S.addGold(v + g.gold); this.toast('غنمتَ ' + U.arGroup(v + g.gold) + ' ديناراً'); }
      else {
        S.addGold(g.gold);
        if (id === 'sword') { S.addCampaign('sword', v); this.toast('قوةُ سيفك +' + U.ar(v) + '٪'); }
        else { S.addCampaign('army', v); this.toast('انضمّ إليك ' + U.ar(v) + ' من الجند'); }
      }
      A.play('card');
      this.overlay('ov-cards', false);
      this.showVictoryScreen(g);
    },

    /* ====================================================
       نهايات المعركة
       ==================================================== */
    runStats: function (g) {
      var p = g.player;
      return '' +
        '<div class="rs"><b>' + U.arGroup(p.stats.kills) + '</b><span>القتلى</span></div>' +
        '<div class="rs"><b>' + U.ar(g.liveCount(MAL.FRIEND)) + '</b><span>من جيشك</span></div>' +
        '<div class="rs"><b>' + U.arGroup(g.gold) + '</b><span>الغنيمة</span></div>' +
        '<div class="rs"><b>' + U.arTime(g.runTime) + '</b><span>الزمن</span></div>';
    },

    showVictory: function (g, first) {
      this.showRewards(g);
    },

    showVictoryScreen: function (g) {
      var s = g.setup.stage;
      var last = g.stageIndex >= D.total - 1;
      $('victoryTitle').textContent = last ? 'تَمَّ الفَتْح!' : ('فُتِحَت ' + s.n);
      $('victoryNote').innerHTML =
        '<span class="ck">' + s.hy + ' — ' + s.ad + ' · ' + s.place + '</span>' +
        '<h4>' + s.n + ' <em class="oc oc-' + this.outcomeClass(s.outcome) + '">' + s.outcome + ' تاريخياً</em></h4>' +
        '<p>' + s.note + '</p>';
      $('victoryStats').innerHTML = this.runStats(g);
      $('btnNextStage').style.display = last ? 'none' : '';
      this.overlay('ov-victory', true);
      this.refreshTitle();
    },

    outcomeClass: function (o) {
      if (o === 'هزيمة') return 'bad';
      if (o === 'صلح' || o === 'انسحاب') return 'mid';
      return 'good';
    },

    showDefeat: function (g, keep) {
      $('defeatStats').innerHTML = this.runStats(g) +
        '<div class="rs"><b>+' + U.arGroup(keep) + '</b><span>ذهب</span></div>';
      this.overlay('ov-defeat', true);
      S.bumpStat('deaths', 1);
      S.save();
      this.refreshTitle();
    },

    /* ====================================================
       شاشة المعارك (٥٧ مرحلة في ٩ فصول)
       ==================================================== */
    buildStages: function () {
      var wrap = $('stageScroll'), self = this;
      wrap.innerHTML = '';
      D.chapters.forEach(function (ch, ci) {
        var idxs = D.chapterStages(ci);
        var doneN = 0;
        idxs.forEach(function (i) { if (S.stageCleared(i)) doneN++; });

        var head = el('div', 'ch-head',
          '<div><h3>' + ch.name + '</h3><small>' + ch.sub + '</small></div>' +
          '<span class="ch-count">' + U.frac(doneN, idxs.length) + '</span>');
        wrap.appendChild(head);

        var grid = el('div', 'stage-grid');
        idxs.forEach(function (i) {
          var s = D.stageAt(i);
          var t = D.terrain[s.terr];
          var unlocked = S.stageUnlocked(i), cleared = S.stageCleared(i);
          var card = el('div', 'stage-card' + (unlocked ? '' : ' locked') + (cleared ? ' done' : ''));
          card.style.background =
            'linear-gradient(160deg,' + U.rgba(t.accent, .14) + ',' + U.rgba(t.g2, .5) + '), ' +
            'linear-gradient(180deg,' + U.shade(t.g1, -.4) + ',' + U.shade(t.g2, -.55) + ')';
          card.innerHTML =
            '<span class="sn">' + U.ar(i + 1) + '</span>' +
            '<b>' + s.n + '</b>' +
            '<small>' + s.hy + ' · ' + s.place + '</small>' +
            (cleared ? '<span class="tick">✓</span>' : '') +
            (unlocked ? '' : '<span class="lockic">🔒</span>');
          card.addEventListener('click', function () {
            if (!unlocked) { A.play('deny'); self.toast('أكمل المعركة السابقة أولاً'); return; }
            A.play('ui');
            self.brief(i);
          });
          grid.appendChild(card);
        });
        wrap.appendChild(grid);
      });
    },

    /* ====================================================
       دار السلاح
       ==================================================== */
    buildArmory: function () {
      var grid = $('armoryGrid'), self = this;
      $('armoryNote').textContent =
        'تطويراتٌ دائمة تبقى معك. جيشك الآن ' + U.ar(this.game.armySize()) +
        ' مقاتلاً، وقوةُ سيفك +' + U.ar(S.campaign('sword')) + '٪.';
      grid.innerHTML = '';
      D.armory.forEach(function (f) {
        var lv = S.armory(f.id);
        var maxed = lv >= f.max;
        var cost = maxed ? 0 : f.cost(lv);
        var card = el('div', 'forge-card');
        var pips = '';
        for (var i = 0; i < f.max; i++) pips += '<i class="' + (i < lv ? 'on' : '') + '"></i>';
        card.innerHTML =
          '<div class="fh"><div class="fi">' + icon(f.i) + '</div><div><b>' + f.n + '</b></div></div>' +
          '<p>' + f.d + '</p><div class="pips">' + pips + '</div>';
        var btn = el('button', 'forge-buy' + (maxed ? ' max' : (S.data.gold < cost ? ' poor' : '')),
          maxed ? 'مكتمل ✓' : ('<span class="coin"></span> ' + U.arGroup(cost)));
        btn.addEventListener('click', function () {
          if (maxed) { A.play('deny'); return; }
          if (S.spendGold(cost)) {
            S.setArmory(f.id, lv + 1);
            A.play('card');
            self.toast(f.n + ' → ' + U.ar(lv + 1));
            self.buildArmory(); self.refreshGold(); self.refreshTitle();
          } else { A.play('deny'); self.toast('تحتاج ' + U.arGroup(cost - S.data.gold) + ' ديناراً'); }
        });
        card.appendChild(btn);
        grid.appendChild(card);
      });
    },

    /* ====================================================
       سجل المعارك
       ==================================================== */
    buildLog: function () {
      var list = $('logList');
      list.innerHTML = '';
      var seen = 0;
      for (var i = 0; i < D.total; i++) {
        var s = D.stageAt(i);
        var has = S.stageCleared(i);
        if (has) seen++;
        var card = el('div', 'codex-card' + (has ? '' : ' sealed'),
          '<span class="ck">' + U.ar(i + 1) + ' · ' + s.hy + ' — ' + s.ad + ' · ' + s.place + '</span>' +
          '<h4>' + s.n + (has ? ' <em class="oc oc-' + this.outcomeClass(s.outcome) + '">' + s.outcome + '</em>' : '') + '</h4>' +
          '<p>' + (has ? s.note : 'اخُضْ هذه المعركة لتُفتح صفحتُها.') + '</p>');
        list.appendChild(card);
      }
      $('logCount').textContent = U.frac(seen, D.total);
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

      switchRow('المؤثرات الصوتية', 'أصوات السيوف والمعركة', 'sfx', function (v) { A.setSfx(v); });
      switchRow('الموسيقى', 'موسيقى مولَّدة على المقامات العربية', 'music', function (v) { A.setMusic(v); });
      switchRow('الاهتزاز', 'اهتزاز خفيف عند الإصابة', 'haptics');
      switchRow('وضع الأعسر', 'تبديل جهتَي التحكم', 'lefty', function (v) {
        MAL.Input.setLefty(v);
        document.body.classList.toggle('lefty', !!v);
      });
      switchRow('التصويب التلقائي', 'يضرب أقرب عدوٍّ تلقائياً', 'autoAim');

      var qRow = el('div', 'set-row', '<div class="st"><b>جودة الرسم</b><small>خفّضها لو تأخرت اللعبة</small></div>');
      var seg = el('div', 'seg');
      [['auto', 'تلقائي'], ['high', 'عالية'], ['low', 'خفيفة']].forEach(function (o) {
        var b = el('button', S.setting('quality') === o[0] ? 'on' : '', o[1]);
        b.addEventListener('click', function () {
          S.setting('quality', o[0]); A.play('ui');
          self.buildSettings(); MAL.applyQuality();
        });
        seg.appendChild(b);
      });
      qRow.appendChild(seg);
      body.appendChild(qRow);

      var rRow = el('div', 'set-row', '<div class="st"><b>محو التقدّم</b><small>يمحو الذهب والمعارك والتطويرات — لا رجعة</small></div>');
      var rb = el('button', 'back', 'محو');
      rb.addEventListener('click', function () {
        if (rb.dataset.armed) {
          S.reset(); A.play('deny');
          self.toast('مُحي كل التقدّم');
          self.buildSettings(); self.refreshTitle();
        } else {
          rb.dataset.armed = '1';
          rb.textContent = 'متأكد؟ اضغط ثانية';
          A.play('deny');
          setTimeout(function () { delete rb.dataset.armed; rb.textContent = 'محو'; }, 3500);
        }
      });
      rRow.appendChild(rb);
      body.appendChild(rRow);

      body.appendChild(el('div', 'set-row',
        '<div class="st"><b>الفُتوح</b><small>التحكم: إصبعٌ يسار للحركة، إصبعٌ يمين للتصويب · ' +
        'على الحاسوب: WASD والفأرة، مسافة للاندفاع، Shift للراية</small></div>'));
    }
  };

  MAL.UI = UI;
})(typeof window !== 'undefined' ? window : globalThis);
