/* =============================================================
   playground.js — المحرّر ووحدة الإخراج ومُصحِّح التحديات
   Editor + console output + challenge checker

   بايثون لا يُشغَّل مع كل ضغطة مفتاح كما كانت HTML تُعرض:
   التنفيذ يحدث عند الطلب فقط (زر تشغيل أو Ctrl+Enter).
   Unlike HTML preview, Python never runs on keystroke — only
   on demand (Run button or Ctrl+Enter).
   ============================================================= */
(function (global) {
  'use strict';

  var esc = global.Highlight ? global.Highlight.escape : function (s) { return String(s); };

  /* ---------- أدوات DOM صغيرة / tiny DOM helpers ---------- */
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k.indexOf('on') === 0 && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      }
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  function t(key) { return global.I18N.t(key); }
  function pick(v) { return global.I18N.pick(v); }

  /* ---------- تخزين محلي آمن / safe storage ---------- */
  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) {}
    return null;
  }

  /* ---------- هل يحتاج الكود مدخلات؟ / does the code read stdin ---------- */
  function needsInput(code) { return /(^|[^\w.])input\s*\(/.test(code); }

  /* =============================================================
     محرّر + وحدة إخراج / editor + console
     ============================================================= */
  function createDemo(options) {
    var opts = options || {};
    var initial = opts.code || '';
    var storeKey = opts.storeKey || null;
    var saved = storeKey ? store(storeKey) : null;
    var startCode = (saved != null && saved !== '') ? saved : initial;

    var lastResult = null;
    var busy = false;

    /* ---- المحرّر مع مسطرة أرقام الأسطر ---- */
    var gutter = h('div', { class: 'gutter', 'aria-hidden': 'true' });
    var editor = h('textarea', {
      class: 'editor',
      spellcheck: 'false',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      dir: 'ltr',
      'aria-label': t('paneCode')
    });
    editor.value = startCode;

    function syncGutter() {
      var count = editor.value.split('\n').length;
      var want = '';
      for (var i = 1; i <= count; i++) want += i + '\n';
      if (gutter.textContent !== want) gutter.textContent = want;
    }
    editor.addEventListener('scroll', function () { gutter.scrollTop = editor.scrollTop; });

    /* ---- حقل المدخلات لدوال input() ---- */
    var stdinBox = h('textarea', {
      class: 'stdin-box',
      spellcheck: 'false',
      dir: 'ltr',
      rows: '2',
      placeholder: t('stdinPlaceholder'),
      'aria-label': t('stdinLabel')
    });
    var stdinWrap = h('div', { class: 'stdin-wrap', hidden: true }, [
      h('label', { class: 'stdin-label' }, ['⌨ ' + t('stdinLabel')]),
      stdinBox,
      h('p', { class: 'stdin-hint' }, [t('stdinHint')])
    ]);
    if (storeKey) {
      var sIn = store(storeKey + ':stdin');
      if (sIn) stdinBox.value = sIn;
      stdinBox.addEventListener('input', function () { store(storeKey + ':stdin', stdinBox.value); });
    }

    function syncStdinVisibility() {
      stdinWrap.hidden = !needsInput(editor.value);
    }

    /* ---- وحدة الإخراج ----
       الحاوية تتبع اتجاه الواجهة كي تُقرأ الرسائل العربية صحيحة،
       أما مخرجات البرنامج نفسها فتُجبَر على LTR لأنها كود. */
    var out = h('div', { class: 'console', role: 'log', 'aria-live': 'polite' });

    function setConsole(cls, text, sub) {
      out.className = 'console' + (cls ? ' ' + cls : '');
      out.textContent = '';
      if (text) out.appendChild(h('div', { class: 'console-line' }, [text]));
      if (sub) out.appendChild(h('div', { class: 'console-sub' }, [sub]));
    }

    function showIdle() {
      setConsole('is-idle', t('consoleIdle'), t('consoleIdleHint'));
    }

    function showResult(r) {
      lastResult = r;
      if (r.error === '__TIMEOUT__') {
        setConsole('is-error', t('runTimeout'), t('runTimeoutHint'));
        return;
      }
      if (r.error === '__LOADFAIL__') {
        setConsole('is-error', t('runLoadFail'), t('runLoadFailHint'));
        return;
      }
      out.className = 'console';
      out.textContent = '';
      if (r.stdout) {
        out.appendChild(h('pre', { class: 'console-out', dir: 'ltr' }, [r.stdout]));
      }
      if (r.error) {
        out.appendChild(h('pre', { class: 'console-err', dir: 'ltr' }, [r.error]));
      }
      if (!r.stdout && !r.error) {
        out.appendChild(h('div', { class: 'console-line console-muted' }, [t('runNoOutput')]));
        out.appendChild(h('div', { class: 'console-sub' }, [t('runNoOutputHint')]));
      }
    }

    /* ---- التشغيل ---- */
    var runBtn = h('button', { class: 'btn btn-sm btn-soft', type: 'button' }, ['▶ ' + t('run')]);
    var stopBtn = h('button', { class: 'btn btn-sm btn-ghost', type: 'button', hidden: true }, ['■ ' + t('stop')]);

    function run() {
      if (busy) return Promise.resolve(lastResult);
      if (!global.PyRun || !global.PyRun.supported()) {
        setConsole('is-error', t('runUnsupported'), t('runUnsupportedHint'));
        return Promise.resolve(null);
      }
      busy = true;
      runBtn.disabled = true;
      stopBtn.hidden = false;

      var firstBoot = !global.PyRun.isReady();
      setConsole('is-busy',
        firstBoot ? t('pyLoading') : t('runRunning'),
        firstBoot ? t('pyLoadingHint') : '');

      if (storeKey) store(storeKey, editor.value);

      return global.PyRun.run(editor.value, stdinBox.value).then(function (r) {
        busy = false;
        runBtn.disabled = false;
        stopBtn.hidden = true;
        showResult(r);
        if (typeof opts.onRun === 'function') opts.onRun(r);
        return r;
      }, function () {
        busy = false;
        runBtn.disabled = false;
        stopBtn.hidden = true;
        setConsole('is-error', t('runLoadFail'), t('runLoadFailHint'));
        return null;
      });
    }

    runBtn.addEventListener('click', function () { run(); });
    stopBtn.addEventListener('click', function () {
      if (global.PyRun) global.PyRun.stop();
      busy = false;
      runBtn.disabled = false;
      stopBtn.hidden = true;
      setConsole('is-error', t('runStopped'), t('runStoppedHint'));
    });

    /* ---- تعديل الكود ---- */
    editor.addEventListener('input', function () {
      syncGutter();
      syncStdinVisibility();
      if (storeKey) store(storeKey, editor.value);
      if (typeof opts.onChange === 'function') opts.onChange(editor.value);
    });

    editor.addEventListener('keydown', function (e) {
      /* Tab يُدخل أربع مسافات — مسافة بايثون القياسية */
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = editor.selectionStart, en = editor.selectionEnd;
        editor.value = editor.value.slice(0, s) + '    ' + editor.value.slice(en);
        editor.selectionStart = editor.selectionEnd = s + 4;
        syncGutter();
        return;
      }
      /* Ctrl/⌘ + Enter يشغّل */
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        run();
        return;
      }
      /* Enter يحافظ على الإزاحة ويزيدها بعد النقطتين */
      if (e.key === 'Enter' && !e.shiftKey) {
        var pos = editor.selectionStart;
        var before = editor.value.slice(0, pos);
        var lineStart = before.lastIndexOf('\n') + 1;
        var line = before.slice(lineStart);
        var indent = (/^[ \t]*/.exec(line) || [''])[0];
        if (/:\s*$/.test(line)) indent += '    ';
        if (indent) {
          e.preventDefault();
          var rest = editor.value.slice(editor.selectionEnd);
          editor.value = before + '\n' + indent + rest;
          editor.selectionStart = editor.selectionEnd = pos + 1 + indent.length;
          syncGutter();
        }
      }
    });

    var copyBtn = h('button', { class: 'btn btn-sm btn-ghost', type: 'button' }, [t('copy')]);
    copyBtn.addEventListener('click', function () {
      var done = function () {
        copyBtn.textContent = t('copied');
        setTimeout(function () { copyBtn.textContent = t('copy'); }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(editor.value).then(done, done);
      } else {
        editor.select();
        try { document.execCommand('copy'); } catch (e) {}
        done();
      }
    });

    var resetBtn = h('button', { class: 'btn btn-sm btn-ghost', type: 'button' }, [t('reset')]);
    resetBtn.addEventListener('click', function () {
      editor.value = initial;
      syncGutter();
      syncStdinVisibility();
      if (storeKey) store(storeKey, initial);
      showIdle();
      editor.focus();
    });

    var actions = h('div', { class: 'demo-actions' }, [runBtn, stopBtn, resetBtn, copyBtn]);

    var head = h('div', { class: 'demo-head' }, [
      h('h4', {}, [opts.icon || '🐍', ' ' + (opts.title || t('exampleTitle'))]),
      actions
    ]);

    var body = h('div', { class: 'demo-body' }, [
      h('div', { class: 'demo-pane' }, [
        h('div', { class: 'pane-label' }, ['>>> ', t('paneCode')]),
        h('div', { class: 'editor-wrap' }, [gutter, editor]),
        stdinWrap
      ]),
      h('div', { class: 'demo-pane' }, [
        h('div', { class: 'pane-label' }, ['▶ ', t('paneOutput')]),
        out
      ])
    ]);

    var root = h('div', { class: 'demo' }, [opts.hideHead ? null : head, body]);

    syncGutter();
    syncStdinVisibility();
    showIdle();

    return {
      el: root,
      editor: editor,
      console: out,
      getValue: function () { return editor.value; },
      getStdin: function () { return stdinBox.value; },
      setValue: function (v) {
        editor.value = v;
        syncGutter();
        syncStdinVisibility();
        if (storeKey) store(storeKey, v);
        showIdle();
      },
      run: run,
      lastResult: function () { return lastResult; },
      isBusy: function () { return busy; }
    };
  }

  /* =============================================================
     تشغيل فحوص التحدي / running challenge checks
     كل فحص قد يعيد قيمة منطقية أو Promise — نُوحّدها هنا.
     A check may return a boolean or a Promise; both are handled.
     ============================================================= */
  function runChecks(checks, result) {
    return Promise.all(checks.map(function (c) {
      var v;
      try { v = c.test(result); } catch (e) { return false; }
      return Promise.resolve(v).then(
        function (x) { return !!x; },
        function () { return false; }
      );
    }));
  }

  /* =============================================================
     بطاقة التحدي / the challenge card
     ============================================================= */
  function createChallenge(challenge, options) {
    var opts = options || {};
    var checks = challenge.checks || [];
    var attempts = 0;
    var passedOnce = false;

    var items = checks.map(function (c) {
      return h('li', {}, [
        h('span', { class: 'mark' }, ['•']),
        h('span', {}, [
          h('span', {}, [pick(c.label)]),
          h('span', { class: 'hint', hidden: true }, [pick(c.hint)])
        ])
      ]);
    });

    var list = h('ul', { class: 'task-list' }, items);

    var demo = createDemo({
      code: pick(challenge.starter) || '',
      storeKey: opts.storeKey || null,
      title: t('challengeGo'),
      icon: '✍️'
    });

    var verdict = h('span', { class: 'verdict' });

    var solutionBox = h('div', { hidden: true, style: 'padding:0 22px 18px' });
    var solutionBtn = h('button', { class: 'btn btn-sm btn-ghost', type: 'button' }, [t('showSolution')]);
    solutionBtn.addEventListener('click', function () {
      if (!solutionBox.hidden) {
        solutionBox.hidden = true;
        solutionBtn.textContent = t('showSolution');
        return;
      }
      if (!solutionBox.dataset.built) {
        var code = pick(challenge.solution) || '';
        var pre = h('pre', {}, []);
        pre.innerHTML = '<code>' + global.Highlight.code(code) + '</code>';
        var insert = h('button', { class: 'btn btn-sm btn-soft', type: 'button' }, ['⇥ ' + t('paneCode')]);
        insert.addEventListener('click', function () { demo.setValue(code); });
        solutionBox.appendChild(h('div', { class: 'code-block' }, [
          h('div', { class: 'code-bar' }, [
            h('span', { class: 'dots' }, [h('i'), h('i'), h('i')]),
            h('span', {}, ['solution.py']),
            insert
          ]),
          pre
        ]));
        solutionBox.dataset.built = '1';
      }
      solutionBox.hidden = false;
      solutionBtn.textContent = t('hideSolution');
    });

    var checkBtn = h('button', { class: 'btn btn-primary', type: 'button' }, ['✓ ' + t('check')]);

    checkBtn.addEventListener('click', function () {
      if (demo.isBusy()) return;
      attempts++;
      checkBtn.disabled = true;
      verdict.className = 'verdict busy';
      verdict.textContent = t('checkRunning');

      /* نشغّل كود المتعلّم أولاً، ثم نفحص النتيجة */
      demo.run().then(function (result) {
        if (!result) {
          checkBtn.disabled = false;
          verdict.className = 'verdict no';
          verdict.textContent = t('runLoadFail');
          return null;
        }
        return runChecks(checks, result).then(function (results) {
          var allPass = true;
          results.forEach(function (ok, i) {
            var li = items[i];
            li.className = ok ? 'pass' : 'fail';
            li.querySelector('.mark').textContent = ok ? '✓' : '✕';
            li.querySelector('.hint').hidden = ok;
            if (!ok) allPass = false;
          });

          verdict.className = 'verdict ' + (allPass ? 'ok' : 'no');
          verdict.textContent = allPass ? t('challengePass') : t('challengeFail');

          if (allPass && !passedOnce) {
            passedOnce = true;
            if (typeof opts.onPass === 'function') opts.onPass();
          }
          if (!allPass && attempts >= 2) solutionBtn.hidden = false;
          checkBtn.disabled = false;
        });
      }).catch(function () {
        checkBtn.disabled = false;
        verdict.className = 'verdict no';
        verdict.textContent = t('challengeFail');
      });
    });

    solutionBtn.hidden = false;

    var root = h('div', { class: 'challenge' }, [
      h('div', { class: 'challenge-head' }, [
        h('div', { class: 'kicker' }, ['⚡ ' + t('challengeKicker')]),
        h('h3', {}, [t('challengeGo')]),
        h('p', {}, [pick(challenge.brief)]),
        h('div', { class: 'side-title', style: 'padding:0;margin-bottom:8px' }, [t('tasksTitle')]),
        list
      ]),
      demo.el,
      h('div', { class: 'challenge-foot' }, [checkBtn, solutionBtn, verdict]),
      solutionBox
    ]);

    return { el: root, demo: demo, check: function () { checkBtn.click(); } };
  }

  global.Playground = {
    h: h,
    esc: esc,
    createDemo: createDemo,
    createChallenge: createChallenge,
    runChecks: runChecks,
    needsInput: needsInput
  };
})(window);
