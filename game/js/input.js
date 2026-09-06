/* ============================================================
   input.js — تحكم بإصبعين (عصا حركة + عصا تصويب) + لوحة مفاتيح
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U;

  var MAX_R = 62;        // أقصى نصف قطر للعصا (بكسل CSS)
  var DEAD = 7;          // منطقة ميتة
  var DBL_TAP = 280;     // نافذة النقر المزدوج للاندفاع

  function Stick(kind) {
    this.kind = kind;
    this.id = -1;
    this.active = false;
    this.ox = 0; this.oy = 0;   // مركز العصا
    this.px = 0; this.py = 0;   // موضع الإصبع
    this.x = 0; this.y = 0;     // اتجاه معياري
    this.mag = 0;
    this.angle = 0;
    this.downAt = 0;
    this.moved = 0;
  }
  Stick.prototype.begin = function (id, x, y, t) {
    this.id = id; this.active = true;
    this.ox = x; this.oy = y; this.px = x; this.py = y;
    this.x = 0; this.y = 0; this.mag = 0; this.downAt = t; this.moved = 0;
  };
  Stick.prototype.move = function (x, y) {
    this.px = x; this.py = y;
    var dx = x - this.ox, dy = y - this.oy;
    var len = Math.hypot(dx, dy);
    this.moved = Math.max(this.moved, len);
    if (len > MAX_R) {                       // اسحب المركز خلف الإصبع
      var k = (len - MAX_R) / len;
      this.ox += dx * k; this.oy += dy * k;
      dx = x - this.ox; dy = y - this.oy;
      len = MAX_R;
    }
    if (len <= DEAD) { this.x = 0; this.y = 0; this.mag = 0; return; }
    var n = (len - DEAD) / (MAX_R - DEAD);
    this.mag = U.clamp(n, 0, 1);
    this.x = dx / len; this.y = dy / len;
    this.angle = Math.atan2(dy, dx);
  };
  Stick.prototype.end = function () {
    this.id = -1; this.active = false;
    this.x = 0; this.y = 0; this.mag = 0;
  };

  var Input = {
    moveStick: new Stick('move'),
    aimStick: new Stick('aim'),
    move: { x: 0, y: 0, mag: 0 },
    aim: { x: 1, y: 0, mag: 0, angle: 0, active: false },
    keys: {},
    mouse: { x: 0, y: 0, down: false, inside: false },
    usingKeyboard: false,
    lefty: false,
    enabled: false,
    _dash: false, _ult: false, _pause: false,
    _lastLeftTapAt: 0,
    el: null,

    init: function (el) {
      this.el = el;
      var self = this;

      function pt(e) {
        var r = el.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      }
      function isLeftHalf(x) {
        var half = el.clientWidth * 0.5;
        return self.lefty ? x > half : x < half;
      }

      el.addEventListener('pointerdown', function (e) {
        if (!self.enabled) return;
        e.preventDefault();
        try { el.setPointerCapture(e.pointerId); } catch (err) {}
        var p = pt(e), t = performance.now();
        self.usingKeyboard = false;
        if (isLeftHalf(p.x)) {
          if (!self.moveStick.active) {
            self.moveStick.begin(e.pointerId, p.x, p.y, t);
            if (t - self._lastLeftTapAt < DBL_TAP) self._dash = true;
            self._lastLeftTapAt = t;
          } else if (!self.aimStick.active) {
            self.aimStick.begin(e.pointerId, p.x, p.y, t);
          }
        } else {
          if (!self.aimStick.active) self.aimStick.begin(e.pointerId, p.x, p.y, t);
          else if (!self.moveStick.active) self.moveStick.begin(e.pointerId, p.x, p.y, t);
        }
      }, { passive: false });

      el.addEventListener('pointermove', function (e) {
        if (!self.enabled) return;
        var p = pt(e);
        if (self.moveStick.id === e.pointerId) self.moveStick.move(p.x, p.y);
        else if (self.aimStick.id === e.pointerId) self.aimStick.move(p.x, p.y);
        self.mouse.x = p.x; self.mouse.y = p.y; self.mouse.inside = true;
      }, { passive: false });

      function up(e) {
        if (self.moveStick.id === e.pointerId) self.moveStick.end();
        else if (self.aimStick.id === e.pointerId) self.aimStick.end();
      }
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      el.addEventListener('pointerleave', function (e) {
        if (e.pointerType === 'mouse') { self.mouse.inside = false; up(e); }
      });

      el.addEventListener('contextmenu', function (e) { e.preventDefault(); });

      // ---------- لوحة المفاتيح ----------
      root.addEventListener('keydown', function (e) {
        var k = e.key.toLowerCase();
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd'].indexOf(k) >= 0) e.preventDefault();
        if (self.keys[k]) return;
        self.keys[k] = true;
        self.usingKeyboard = true;
        if (k === ' ') self._dash = true;
        if (k === 'shift' || k === 'e' || k === 'q') self._ult = true;
        if (k === 'escape' || k === 'p') self._pause = true;
      });
      root.addEventListener('keyup', function (e) { self.keys[e.key.toLowerCase()] = false; });
      root.addEventListener('blur', function () {
        self.keys = {};
        self.moveStick.end(); self.aimStick.end();
        self.mouse.down = false;
      });

      // ---------- الفأرة (للحاسوب) ----------
      el.addEventListener('mousedown', function () { self.mouse.down = true; });
      root.addEventListener('mouseup', function () { self.mouse.down = false; });

      // ---------- أزرار اللمس ----------
      this.bindPad('padDash', function () { self._dash = true; });
      this.bindPad('padUlt', function () { self._ult = true; });
    },

    bindPad: function (id, fn) {
      var el = document.getElementById(id);
      if (!el) return;
      var self = this;
      var down = function (e) {
        e.preventDefault(); e.stopPropagation();
        if (!self.enabled) return;
        fn();
      };
      el.addEventListener('pointerdown', down, { passive: false });
      el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    },

    setLefty: function (v) { this.lefty = !!v; },

    /** يُستدعى كل إطار قبل تحديث اللعبة */
    update: function () {
      var kb = this.keys, mx = 0, my = 0;
      if (kb['a'] || kb['arrowleft']) mx -= 1;
      if (kb['d'] || kb['arrowright']) mx += 1;
      if (kb['w'] || kb['arrowup']) my -= 1;
      if (kb['s'] || kb['arrowdown']) my += 1;

      if (mx || my) {
        var n = U.normalize(mx, my);
        this.move.x = n.x; this.move.y = n.y; this.move.mag = 1;
      } else if (this.moveStick.active) {
        this.move.x = this.moveStick.x;
        this.move.y = this.moveStick.y;
        this.move.mag = this.moveStick.mag;
      } else {
        this.move.x = 0; this.move.y = 0; this.move.mag = 0;
      }

      if (this.aimStick.active && this.aimStick.mag > 0.08) {
        this.aim.x = this.aimStick.x; this.aim.y = this.aimStick.y;
        this.aim.mag = this.aimStick.mag; this.aim.angle = this.aimStick.angle;
        this.aim.active = true;
      } else if (this.usingKeyboard && this.mouse.down && this.mouse.inside) {
        this.aim.active = true; this.aim.mag = 1;
        this.aim.fromMouse = true;
      } else {
        this.aim.active = false; this.aim.mag = 0;
        this.aim.fromMouse = false;
      }
    },

    consumeDash: function () { var v = this._dash; this._dash = false; return v; },
    consumeUlt: function () { var v = this._ult; this._ult = false; return v; },
    consumePause: function () { var v = this._pause; this._pause = false; return v; },
    clear: function () {
      this.moveStick.end(); this.aimStick.end();
      this.keys = {}; this._dash = this._ult = this._pause = false;
      this.move.x = this.move.y = this.move.mag = 0;
      this.aim.active = false; this.aim.mag = 0;
      this.mouse.down = false;
    }
  };

  MAL.Input = Input;
})(typeof window !== 'undefined' ? window : globalThis);
