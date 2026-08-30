/* =============================================================
   playground.js — المحرّر الحيّ ومُصحِّح التحديات
   Live editor + challenge checker
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

  /* ---------- تغليف كود المتعلّم داخل صفحة معاينة ---------- */
  var PREVIEW_CSS =
    'body{font-family:"Tajawal",system-ui,-apple-system,"Segoe UI",sans-serif;' +
    'line-height:1.7;padding:16px;margin:0;color:#15181f;background:#fff}' +
    'img{max-width:100%;height:auto}' +
    'table{border-collapse:collapse}' +
    'pre{background:#f2f3f7;padding:10px;border-radius:8px;overflow:auto;direction:ltr;text-align:left}' +
    'input,select,textarea,button{font:inherit;padding:6px 8px;border-radius:6px;border:1px solid #b9bfd0}' +
    'button{cursor:pointer}' +
    'label{display:inline-block;margin-block:4px}';

  function wrapDoc(code) {
    var lang = global.I18N.lang;
    var dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (/<html[\s>]/i.test(code)) return code;
    return '<!doctype html><html lang="' + lang + '" dir="' + dir + '"><head><meta charset="utf-8">' +
           '<style>' + PREVIEW_CSS + '</style></head><body>' + code + '</body></html>';
  }

  /* ---------- محرّر + معاينة / editor + preview ---------- */
  function createDemo(options) {
    var opts = options || {};
    var initial = opts.code || '';
    var storeKey = opts.storeKey || null;
    var saved = storeKey ? store(storeKey) : null;
    var startCode = (saved != null && saved !== '') ? saved : initial;

    var frame = h('iframe', {
      class: 'preview-frame',
      sandbox: 'allow-scripts allow-forms allow-modals',
      title: t('panePreview')
    });

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

    var timer = null;
    function render() {
      frame.srcdoc = wrapDoc(editor.value);
      if (storeKey) store(storeKey, editor.value);
      if (typeof opts.onChange === 'function') opts.onChange(editor.value);
    }
    function scheduleRender() {
      clearTimeout(timer);
      timer = setTimeout(render, 320);
    }

    editor.addEventListener('input', scheduleRender);
    editor.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = editor.selectionStart, en = editor.selectionEnd;
        editor.value = editor.value.slice(0, s) + '  ' + editor.value.slice(en);
        editor.selectionStart = editor.selectionEnd = s + 2;
        scheduleRender();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        clearTimeout(timer);
        render();
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

    var runBtn = h('button', { class: 'btn btn-sm btn-soft', type: 'button' }, [t('run')]);
    runBtn.addEventListener('click', function () { clearTimeout(timer); render(); });

    var resetBtn = h('button', { class: 'btn btn-sm btn-ghost', type: 'button' }, [t('reset')]);
    resetBtn.addEventListener('click', function () {
      editor.value = initial;
      clearTimeout(timer);
      render();
      editor.focus();
    });

    var actions = h('div', { class: 'demo-actions' }, [runBtn, resetBtn, copyBtn]);

    var head = h('div', { class: 'demo-head' }, [
      h('h4', {}, [opts.icon || '🧪', ' ' + (opts.title || t('exampleTitle'))]),
      actions
    ]);

    var body = h('div', { class: 'demo-body' }, [
      h('div', { class: 'demo-pane' }, [
        h('div', { class: 'pane-label' }, ['</> ', t('paneCode')]),
        h('div', { class: 'editor-wrap' }, [editor])
      ]),
      h('div', { class: 'demo-pane' }, [
        h('div', { class: 'pane-label' }, ['▶ ', t('panePreview')]),
        frame
      ])
    ]);

    var root = h('div', { class: 'demo' }, [opts.hideHead ? null : head, body]);

    render();

    return {
      el: root,
      editor: editor,
      frame: frame,
      getValue: function () { return editor.value; },
      setValue: function (v) { editor.value = v; clearTimeout(timer); render(); },
      refresh: render
    };
  }

  /* ---------- تشغيل فحوص التحدي / running challenge checks ---------- */
  function runChecks(checks, code) {
    var doc;
    try {
      doc = new DOMParser().parseFromString(code, 'text/html');
    } catch (e) {
      return checks.map(function () { return false; });
    }
    return checks.map(function (c) {
      try { return !!c.test(doc, code); } catch (e) { return false; }
    });
  }

  /* ---------- بناء بطاقة التحدي / building the challenge card ---------- */
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
      var showing = !solutionBox.hidden;
      if (showing) {
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
            h('span', {}, ['solution.html']),
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
      attempts++;
      var results = runChecks(checks, demo.getValue());
      var allPass = true;

      results.forEach(function (ok, i) {
        var li = items[i];
        li.className = ok ? 'pass' : 'fail';
        li.querySelector('.mark').textContent = ok ? '✓' : '✕';
        var hint = li.querySelector('.hint');
        hint.hidden = ok || attempts < 1;
        if (!ok) allPass = false;
      });

      verdict.className = 'verdict ' + (allPass ? 'ok' : 'no');
      verdict.textContent = allPass ? t('challengePass') : t('challengeFail');

      if (allPass && !passedOnce) {
        passedOnce = true;
        if (typeof opts.onPass === 'function') opts.onPass();
      }
      if (!allPass && attempts >= 2) solutionBtn.hidden = false;
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
    wrapDoc: wrapDoc
  };
})(window);
