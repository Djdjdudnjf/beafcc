/* =============================================================
   pyrunner.js — تشغيل بايثون حقيقي داخل المتصفح
   Real CPython in the browser via Pyodide, inside a Web Worker.

   لماذا Worker؟ لأن حلقة لانهائية في كود المتعلّم تُجمّد الصفحة،
   وداخل الـ Worker يمكننا إنهاؤه وإعادة تشغيله بأمان.
   Why a worker? A learner's infinite loop would freeze the page.
   Inside a worker we can terminate and respawn safely.
   ============================================================= */
(function (global) {
  'use strict';

  var PYODIDE_VERSION = '0.26.4';
  var PYODIDE_BASE = 'https://cdn.jsdelivr.net/pyodide/v' + PYODIDE_VERSION + '/full/';
  var RUN_TIMEOUT = 15000;    /* مهلة تنفيذ كود المتعلّم / learner code timeout */
  var BOOT_TIMEOUT = 180000;  /* مهلة تحميل بايثون أول مرة / first-load timeout */

  /* ---------------------------------------------------------------
     مقدّمة بايثون — تُحقن في المفسّر مرة واحدة بعد الإقلاع
     Python prelude, injected once after boot
     --------------------------------------------------------------- */
  var PY_PRELUDE = [
    'import sys, io, json, traceback',
    '',
    '_NS = {}',
    '',
    'def _snapshot():',
    '    g = {}',
    '    for k, v in list(_NS.items()):',
    '        if k.startswith("__"):',
    '            continue',
    '        try:',
    '            t = type(v).__name__',
    '        except Exception:',
    '            t = "unknown"',
    '        if t == "module":',
    '            continue',
    '        try:',
    '            r = repr(v)',
    '        except Exception:',
    '            r = "<unrepresentable>"',
    '        if len(r) > 400:',
    '            r = r[:400] + "..."',
    '        try:',
    '            json.dumps(v)',
    '            j = v',
    '        except Exception:',
    '            j = None',
    '        g[k] = {"type": t, "repr": r, "json": j}',
    '    return g',
    '',
    'def _run(src, stdin_text):',
    '    global _NS',
    '    _NS = {"__name__": "__main__"}',
    '    buf = io.StringIO()',
    '    old = (sys.stdout, sys.stderr, sys.stdin)',
    '    sys.stdout = buf',
    '    sys.stderr = buf',
    '    sys.stdin = io.StringIO(stdin_text or "")',
    '    err = ""',
    '    try:',
    '        exec(compile(src, "<program>", "exec"), _NS)',
    '    except SystemExit:',
    '        pass',
    '    except BaseException:',
    '        et, ev, tb = sys.exc_info()',
    '        err = "".join(traceback.format_exception(et, ev, tb.tb_next))',
    '    finally:',
    '        sys.stdout, sys.stderr, sys.stdin = old',
    '    return json.dumps({"stdout": buf.getvalue(), "error": err, "globals": _snapshot()})',
    '',
    'def _call(name, args_json):',
    '    args = json.loads(args_json)',
    '    fn = _NS.get(name)',
    '    if fn is None:',
    '        return json.dumps({"ok": False, "value": None, "error": "not defined", "stdout": ""})',
    '    buf = io.StringIO()',
    '    old = sys.stdout',
    '    sys.stdout = buf',
    '    try:',
    '        res = fn(*args)',
    '        ok, err = True, ""',
    '    except BaseException as e:',
    '        res, ok, err = None, False, type(e).__name__ + ": " + str(e)',
    '    finally:',
    '        sys.stdout = old',
    '    try:',
    '        json.dumps(res)',
    '    except Exception:',
    '        res = repr(res)',
    '    return json.dumps({"ok": ok, "value": res, "error": err, "stdout": buf.getvalue()})',
    ''
  ].join('\n');

  /* ---------------------------------------------------------------
     كود الـ Worker — يُبنى كنص ثم يتحوّل إلى Blob URL
     Worker source, built as text then turned into a Blob URL
     --------------------------------------------------------------- */
  var WORKER_SRC = [
    'var PYODIDE_BASE = ' + JSON.stringify(PYODIDE_BASE) + ';',
    'var PY_PRELUDE = ' + JSON.stringify(PY_PRELUDE) + ';',
    'var pyodide = null;',
    '',
    'async function boot() {',
    '  if (pyodide) return pyodide;',
    '  importScripts(PYODIDE_BASE + "pyodide.js");',
    '  pyodide = await loadPyodide({ indexURL: PYODIDE_BASE });',
    '  await pyodide.runPythonAsync(PY_PRELUDE);',
    '  return pyodide;',
    '}',
    '',
    'self.onmessage = async function (e) {',
    '  var msg = e.data || {};',
    '  var id = msg.id;',
    '  try {',
    '    if (msg.cmd === "boot") {',
    '      await boot();',
    '      self.postMessage({ id: id, ok: true });',
    '      return;',
    '    }',
    '    if (msg.cmd === "run") {',
    '      var py = await boot();',
    '      var fn = py.globals.get("_run");',
    '      var raw = fn(msg.code || "", msg.stdin || "");',
    '      fn.destroy();',
    '      self.postMessage({ id: id, ok: true, payload: raw });',
    '      return;',
    '    }',
    '    if (msg.cmd === "call") {',
    '      var py2 = await boot();',
    '      var cf = py2.globals.get("_call");',
    '      var raw2 = cf(msg.name || "", JSON.stringify(msg.args || []));',
    '      cf.destroy();',
    '      self.postMessage({ id: id, ok: true, payload: raw2 });',
    '      return;',
    '    }',
    '    self.postMessage({ id: id, ok: false, error: "unknown command" });',
    '  } catch (err) {',
    '    self.postMessage({ id: id, ok: false, error: String((err && err.message) || err) });',
    '  }',
    '};'
  ].join('\n');

  /* ---------------------------------------------------------------
     إدارة الـ Worker / worker lifecycle
     --------------------------------------------------------------- */
  var worker = null;
  var blobUrl = null;
  var seq = 0;
  var pending = {};          /* id -> { resolve, reject, timer } */
  var bootPromise = null;
  var booted = false;

  function supported() {
    return typeof Worker === 'function' && typeof Blob === 'function' &&
           typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function';
  }

  function failAll(err) {
    Object.keys(pending).forEach(function (k) {
      clearTimeout(pending[k].timer);
      pending[k].reject(err);
      delete pending[k];
    });
  }

  function spawn() {
    if (worker) return worker;
    if (!blobUrl) {
      blobUrl = URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' }));
    }
    worker = new Worker(blobUrl);
    worker.onmessage = function (e) {
      var d = e.data || {};
      var slot = pending[d.id];
      if (!slot) return;
      delete pending[d.id];
      clearTimeout(slot.timer);
      if (d.ok) slot.resolve(d);
      else slot.reject(new Error(d.error || 'worker error'));
    };
    worker.onerror = function (e) {
      failAll(new Error((e && e.message) || 'worker crashed'));
    };
    return worker;
  }

  /* إنهاء الـ Worker وإعادة الحالة — للحلقات اللانهائية */
  function hardReset() {
    if (worker) { try { worker.terminate(); } catch (e) {} }
    worker = null;
    booted = false;
    bootPromise = null;
    failAll(new Error('terminated'));
  }

  function send(msg, timeout) {
    return new Promise(function (resolve, reject) {
      if (!supported()) { reject(new Error('unsupported')); return; }
      var w;
      try { w = spawn(); } catch (e) { reject(e); return; }
      var id = ++seq;
      msg.id = id;
      pending[id] = {
        resolve: resolve,
        reject: reject,
        timer: setTimeout(function () {
          delete pending[id];
          hardReset();
          reject(new Error('timeout'));
        }, timeout)
      };
      w.postMessage(msg);
    });
  }

  /* تحميل بايثون مرة واحدة / load Python once */
  function ready() {
    if (booted) return Promise.resolve(true);
    if (bootPromise) return bootPromise;
    bootPromise = send({ cmd: 'boot' }, BOOT_TIMEOUT).then(function () {
      booted = true;
      return true;
    }, function (err) {
      bootPromise = null;
      throw err;
    });
    return bootPromise;
  }

  /* ---------------------------------------------------------------
     كائن النتيجة — تُكتب فحوص التحديات في مقابله
     The run result object that challenge checks are written against
     --------------------------------------------------------------- */
  function makeResult(code, data) {
    var stdout = (data && data.stdout) || '';
    var error = (data && data.error) || '';
    var globals = (data && data.globals) || {};

    var lines = stdout.replace(/\s+$/, '').split('\n');
    if (lines.length === 1 && lines[0] === '') lines = [];

    function norm(s) { return String(s).replace(/\s+/g, ' ').trim().toLowerCase(); }

    return {
      code: code,
      stdout: stdout,
      error: error,
      ok: !error,
      lines: lines,
      globals: globals,

      /* هل عُرِّف اسم؟ / is a name defined */
      has: function (name) { return Object.prototype.hasOwnProperty.call(globals, name); },
      /* نوع القيمة كاسم بايثون: int, str, list, function… */
      type: function (name) { return this.has(name) ? globals[name].type : null; },
      /* القيمة إن كانت قابلة للتمثيل بـ JSON */
      val: function (name) { return this.has(name) ? globals[name].json : undefined; },
      repr: function (name) { return this.has(name) ? globals[name].repr : null; },

      /* هل طُبع نص معيّن؟ يقبل نصاً أو تعبيراً نمطياً */
      prints: function (needle) {
        if (needle instanceof RegExp) return needle.test(stdout);
        return norm(stdout).indexOf(norm(needle)) >= 0;
      },
      lineCount: function () { return lines.length; },
      line: function (i) {
        var idx = i < 0 ? lines.length + i : i;
        return lines[idx] == null ? '' : lines[idx];
      },
      /* فحص النص المصدري — لاشتراط استخدام تركيب بعينه */
      src: function (re) { return re instanceof RegExp ? re.test(code) : code.indexOf(re) >= 0; },

      /* استدعاء دالة عرّفها المتعلّم — يعيد Promise */
      call: function (name, args) {
        return send({ cmd: 'call', name: name, args: args || [] }, RUN_TIMEOUT)
          .then(function (d) {
            var parsed = {};
            try { parsed = JSON.parse(d.payload); } catch (e) {}
            return parsed;
          }, function () {
            return { ok: false, value: null, error: 'timeout', stdout: '' };
          });
      }
    };
  }

  /* ---------------------------------------------------------------
     الواجهة العامة / public API
     --------------------------------------------------------------- */
  global.PyRun = {
    version: PYODIDE_VERSION,
    supported: supported,
    ready: ready,
    isReady: function () { return booted; },

    /* شغّل الكود وأعد كائن النتيجة / run code, resolve with a result */
    run: function (code, stdin) {
      return ready().then(function () {
        return send({ cmd: 'run', code: code, stdin: stdin || '' }, RUN_TIMEOUT);
      }).then(function (d) {
        var parsed = {};
        try { parsed = JSON.parse(d.payload); } catch (e) {}
        return makeResult(code, parsed);
      }, function (err) {
        var msg = String((err && err.message) || err);
        var tag = (msg === 'timeout' || msg === 'terminated') ? '__TIMEOUT__' : '__LOADFAIL__';
        return makeResult(code, { stdout: '', error: tag, globals: {} });
      });
    },

    /* أوقف تنفيذاً جارياً / stop a running program */
    stop: hardReset
  };
})(window);
