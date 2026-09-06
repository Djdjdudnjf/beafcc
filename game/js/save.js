/* ============================================================
   save.js — الحفظ المحلي والتقدّم الدائم
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var KEY = 'andalus.save.v1';

  function defaults() {
    return {
      v: 1,
      gold: 0,
      heroes: { faris: 1, rami: 0, dariq: 0, ayyar: 0 },
      regionsUnlocked: 1,          // عدد الأقاليم المفتوحة
      cleared: {},                 // regionId -> true
      best: {},                    // regionId -> أعلى موجة
      codex: {},                   // codexId -> true
      forge: {},                   // forgeId -> المستوى
      lastHero: 'faris',
      lastRegion: 0,
      settings: { sfx: 1, music: 1, haptics: 1, lefty: 0, quality: 'auto', autoAim: 1 },
      stats: { runs: 0, kills: 0, bosses: 0, bestEndless: 0, timePlayed: 0, goldEarned: 0, perfectWaves: 0 }
    };
  }

  var mem = defaults();      // نسخة احتياطية في الذاكرة لو تعذّر التخزين
  var canStore = true;

  function read() {
    try {
      var raw = root.localStorage.getItem(KEY);
      if (!raw) return defaults();
      var d = JSON.parse(raw);
      if (!d || typeof d !== 'object') return defaults();
      return merge(defaults(), d);
    } catch (e) {
      canStore = false;
      return defaults();
    }
  }

  /** دمج عميق يحافظ على الحقول الجديدة عند تحديث اللعبة */
  function merge(base, over) {
    for (var k in over) {
      if (!Object.prototype.hasOwnProperty.call(over, k)) continue;
      var bv = base[k], ov = over[k];
      if (bv && ov && typeof bv === 'object' && typeof ov === 'object' &&
          !Array.isArray(bv) && !Array.isArray(ov)) {
        merge(bv, ov);
      } else if (ov !== undefined && ov !== null) {
        base[k] = ov;
      }
    }
    return base;
  }

  var Save = {
    data: defaults(),

    load: function () {
      this.data = read();
      mem = this.data;
      return this.data;
    },

    save: function () {
      mem = this.data;
      if (!canStore) return false;
      try {
        root.localStorage.setItem(KEY, JSON.stringify(this.data));
        return true;
      } catch (e) { canStore = false; return false; }
    },

    reset: function () {
      this.data = defaults();
      try { root.localStorage.removeItem(KEY); } catch (e) {}
      return this.data;
    },

    // ---------- مساعدات ----------
    addGold: function (n) {
      n = Math.max(0, Math.round(n));
      this.data.gold += n;
      this.data.stats.goldEarned += n;
      this.save();
    },
    spendGold: function (n) {
      if (this.data.gold < n) return false;
      this.data.gold -= n;
      this.save();
      return true;
    },
    heroUnlocked: function (id) { return !!this.data.heroes[id]; },
    unlockHero: function (id) { this.data.heroes[id] = 1; this.save(); },

    regionUnlocked: function (idx) { return idx < this.data.regionsUnlocked; },
    unlockRegion: function (idx) {
      if (idx + 1 > this.data.regionsUnlocked) {
        this.data.regionsUnlocked = idx + 1;
        this.save();
        return true;
      }
      return false;
    },
    markCleared: function (id) { this.data.cleared[id] = true; this.save(); },
    isCleared: function (id) { return !!this.data.cleared[id]; },

    setBest: function (id, wave) {
      if (!this.data.best[id] || wave > this.data.best[id]) {
        this.data.best[id] = wave;
        this.save();
        return true;
      }
      return false;
    },
    getBest: function (id) { return this.data.best[id] || 0; },

    seeCodex: function (id) {
      if (this.data.codex[id]) return false;
      this.data.codex[id] = true;
      this.save();
      return true;
    },
    hasCodex: function (id) { return !!this.data.codex[id]; },

    forgeLevel: function (id) { return this.data.forge[id] || 0; },
    setForge: function (id, lv) { this.data.forge[id] = lv; this.save(); },

    setting: function (k, v) {
      if (v === undefined) return this.data.settings[k];
      this.data.settings[k] = v;
      this.save();
      return v;
    },

    bumpStat: function (k, n) {
      this.data.stats[k] = (this.data.stats[k] || 0) + (n === undefined ? 1 : n);
    },

    /** أعلى إقليم مفتوح لم يُنجز بعد (لزر "ابدأ المسير") */
    nextRegionIndex: function (regions) {
      for (var i = 0; i < regions.length; i++) {
        if (i >= this.data.regionsUnlocked) break;
        if (!this.isCleared(regions[i].id)) return i;
      }
      return Math.max(0, Math.min(this.data.regionsUnlocked - 1, regions.length - 1));
    }
  };

  MAL.Save = Save;
})(typeof window !== 'undefined' ? window : globalThis);
