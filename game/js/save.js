/* ============================================================
   save.js — الحفظ المحلي وتقدّم الحملة
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var KEY = 'futuh.save.v1';

  function defaults() {
    return {
      v: 1,
      gold: 0,
      unlocked: 1,            // عدد المراحل المفتوحة
      cleared: {},            // رقم المرحلة -> true
      campaign: { sword: 0, army: 0 },   // ما اخترته بعد الانتصارات
      armoryLv: {},           // معرّف -> المستوى
      lastStage: 0,
      settings: { sfx: 1, music: 1, haptics: 1, lefty: 0, quality: 'auto', autoAim: 1 },
      stats: { battles: 0, kills: 0, commanders: 0, timePlayed: 0, goldEarned: 0, deaths: 0 }
    };
  }

  var canStore = true;

  function merge(base, over) {
    for (var k in over) {
      if (!Object.prototype.hasOwnProperty.call(over, k)) continue;
      var bv = base[k], ov = over[k];
      if (bv && ov && typeof bv === 'object' && typeof ov === 'object' &&
          !Array.isArray(bv) && !Array.isArray(ov)) merge(bv, ov);
      else if (ov !== undefined && ov !== null) base[k] = ov;
    }
    return base;
  }

  function read() {
    try {
      var raw = root.localStorage.getItem(KEY);
      if (!raw) return defaults();
      var d = JSON.parse(raw);
      if (!d || typeof d !== 'object') return defaults();
      return merge(defaults(), d);
    } catch (e) { canStore = false; return defaults(); }
  }

  var Save = {
    data: defaults(),

    load: function () { this.data = read(); return this.data; },

    save: function () {
      if (!canStore) return false;
      try { root.localStorage.setItem(KEY, JSON.stringify(this.data)); return true; }
      catch (e) { canStore = false; return false; }
    },

    reset: function () {
      this.data = defaults();
      try { root.localStorage.removeItem(KEY); } catch (e) {}
      return this.data;
    },

    // ---------- الذهب ----------
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

    // ---------- المراحل ----------
    stageUnlocked: function (i) { return i < this.data.unlocked; },
    unlockStage: function (i) {
      if (i + 1 > this.data.unlocked) { this.data.unlocked = Math.min(i + 1, 999); this.save(); return true; }
      return false;
    },
    stageCleared: function (i) { return !!this.data.cleared[i]; },
    clearStage: function (i) { this.data.cleared[i] = true; this.data.lastStage = i; this.save(); },
    clearedCount: function () {
      var n = 0;
      for (var k in this.data.cleared) if (this.data.cleared[k]) n++;
      return n;
    },
    nextStage: function (total) {
      for (var i = 0; i < total; i++) {
        if (i >= this.data.unlocked) break;
        if (!this.stageCleared(i)) return i;
      }
      return Math.max(0, Math.min(this.data.unlocked - 1, total - 1));
    },

    // ---------- الحملة (مكافآت الانتصار) ----------
    campaign: function (k) { return this.data.campaign[k] || 0; },
    addCampaign: function (k, v) {
      this.data.campaign[k] = (this.data.campaign[k] || 0) + v;
      this.save();
    },

    // ---------- دار السلاح ----------
    armory: function (id) { return this.data.armoryLv[id] || 0; },
    setArmory: function (id, lv) { this.data.armoryLv[id] = lv; this.save(); },

    // ---------- إعدادات وإحصاءات ----------
    setting: function (k, v) {
      if (v === undefined) return this.data.settings[k];
      this.data.settings[k] = v;
      this.save();
      return v;
    },
    bumpStat: function (k, n) {
      this.data.stats[k] = (this.data.stats[k] || 0) + (n === undefined ? 1 : n);
    }
  };

  MAL.Save = Save;
})(typeof window !== 'undefined' ? window : globalThis);
