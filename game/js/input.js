/* ============================================================
   input.js — تحكم بإصبعين (عصا حركة + عصا تصويب) + لوحة مفاتيح
   على أجهزة اللمس نستخدم أحداث اللمس مباشرة (أوثق على سفاري/iOS)
   وعلى غيرها أحداث المؤشر.
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});
  var U = MAL.U;

  var MAX_R = 62;        // أقصى نصف قطر للعصا (بكسل CSS)
  var DEAD = 6;          // منطقة ميتة
  var DBL_TAP = 300;     // نافذة النقر المزدوج للاندفاع

  var TOUCH = ('ontouchstart' in root) || (root.navigator && navigator.maxTouchPoints > 0);

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
    aim: { x: 1, y: 0, mag: 0, angle: 0, active: false, fromMouse: false },
    keys: {},
    mouse: { x: 0, y: 0, down: false, inside: false },
    usingKeyboard: false,
    touchDevice: TOUCH,
    lefty: false,
    enabled: false,
    everTouched: false,
    _dash: false, _ult: false, _pause: false,
    _lastLeftTapAt: 0,
    el: null,

    init: function (el) {
      this.el = el;
      var self = this;

      function local(cx, cy) {
        var r = el.getBoundingClientRect();
        return { x: cx - r.left, y: cy - r.top };
      }
      function isLeftHalf(x) {
        var half = el.clientWidth * 0.5;
        return self.lefty ? x > half : x < half;
      }

      /** بداية لمسة/ضغطة: وزّعها على العصا المناسبة */
      function begin(id, cx, cy) {
        if (!self.enabled) return;
        var p = local(cx, cy), t = performance.now();
        self.usingKeyboard = false;
        self.everTouched = true;
        if (isLeftHalf(p.x)) {
          if (!self.moveStick.active) {
            self.moveStick.begin(id, p.x, p.y, t);
            if (t - self._lastLeftTapAt < DBL_TAP) self._dash = true;
            self._lastLeftTapAt = t;
          } else if (!self.aimStick.active) {
            self.aimStick.begin(id, p.x, p.y, t);
          }
        } else {
          if (!self.aimStick.active) self.aimStick.begin(id, p.x, p.y, t);
          else if (!self.moveStick.active) self.moveStick.begin(id, p.x, p.y, t);
        }
      }
      function moveTo(id, cx, cy) {
        var p = local(cx, cy);
        if (self.moveStick.id === id) self.moveStick.move(p.x, p.y);
        else if (self.aimStick.id === id) self.aimStick.move(p.x, p.y);
        self.mouse.x = p.x; self.mouse.y = p.y; self.mouse.inside = true;
      }
      function finish(id) {
        if (self.moveStick.id === id) self.moveStick.end();
        else if (self.aimStick.id === id) self.aimStick.end();
      }

      if (TOUCH) {
        /* ---------- أحداث اللمس (المسار الموثوق على iOS) ---------- */
        el.addEventListener('touchstart', function (e) {
          if (!self.enabled) return;
          e.preventDefault();
          for (var i = 0; i < e.changedTouches.length; i++) {
            var t = e.changedTouches[i];
            begin(t.identifier, t.clientX, t.clientY);
          }
        }, { passive: false });

        el.addEventListener('touchmove', function (e) {
          if (!self.enabled) return;
          e.preventDefault();
          for (var i = 0; i < e.changedTouches.length; i++) {
            var t = e.changedTouches[i];
            moveTo(t.identifier, t.clientX, t.clientY);
          }
        }, { passive: false });

        function touchDone(e) {
          for (var i = 0; i < e.changedTouches.length; i++) finish(e.changedTouches[i].identifier);
        }
        el.addEventListener('touchend', function (e) { e.preventDefault(); touchDone(e); }, { passive: false });
        el.addEventListener('touchcancel', touchDone, { passive: true });

        // امنع الصفحة الحاضنة من سرقة السحب (سبب توقّف الحركة داخل الإطارات)
        document.addEventListener('touchmove', function (e) {
          if (self.enabled && e.cancelable) e.preventDefault();
        }, { passive: false });
      } else {
        /* ---------- أحداث المؤشر (حاسوب) ---------- */
        el.addEventListener('pointerdown', function (e) {
          if (!self.enabled) return;
          e.preventDefault();
          try { el.setPointerCapture(e.pointerId); } catch (err) {}
          begin(e.pointerId, e.clientX, e.clientY);
        }, { passive: false });

        el.addEventListener('pointermove', function (e) {
          if (!self.enabled) return;
          moveTo(e.pointerId, e.clientX, e.clientY);
        }, { passive: false });

        el.addEventListener('pointerup', function (e) { finish(e.pointerId); });
        el.addEventListener('pointercancel', function (e) { finish(e.pointerId); });
        el.addEventListener('pointerleave', function (e) {
          if (e.pointerType === 'mouse') { self.mouse.inside = false; finish(e.pointerId); }
        });
        el.addEventListener('mousedown', function () { self.mouse.down = true; });
        root.addEventListener('mouseup', function () { self.mouse.down = false; });
      }

      el.addEventListener('contextmenu', function (e) { e.preventDefault(); });

      /* ---------- لوحة المفاتيح ---------- */
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
      root.addEventListener('blur', function () { self.clear(); });

      /* ---------- أزرار اللمس ---------- */
      this.bindPad('padDash', function () { self._dash = true; });
      this.bindPad('padUlt', function () { self._ult = true; });
    },

    bindPad: function (id, fn) {
      var el = document.getElementById(id);
      if (!el) return;
      var self = this;
      var fire = function (e) {
        e.preventDefault(); e.stopPropagation();
        if (!self.enabled) return;
        fn();
      };
      if (TOUCH) el.addEventListener('touchstart', fire, { passive: false });
      else el.addEventListener('pointerdown', fire, { passive: false });
      el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    },

    setLefty: function (v) { this.lefty = !!v; },

    /** موضع المقبض الشبح (دليل للاعب قبل أول لمسة) */
    ghost: function (w, h) {
      var x = this.lefty ? w * 0.80 : w * 0.20;
      return { x: x, y: h * 0.70 };
    },

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
        this.aim.active = true; this.aim.fromMouse = false;
      } else if (this.usingKeyboard && this.mouse.down && this.mouse.inside) {
        this.aim.active = true; this.aim.mag = 1; this.aim.fromMouse = true;
      } else {
        this.aim.active = false; this.aim.mag = 0; this.aim.fromMouse = false;
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
