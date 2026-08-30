/* =============================================================
   app.js — الراوتر والعرض والتقدّم والبحث
   Router, views, progress and search
   ============================================================= */
(function (global) {
  'use strict';

  var h = global.Playground.h;
  var HL = global.Highlight;
  function t(k) { return global.I18N.t(k); }
  function pick(v) { return global.I18N.pick(v); }

  var COURSE = global.COURSE;
  var REF = global.REFERENCE;

  /* =========================================================
     التخزين والتقدّم / storage and progress
     ========================================================= */
  var PKEY = 'etqan.progress';
  var progress = {};

  try { progress = JSON.parse(localStorage.getItem(PKEY) || '{}') || {}; } catch (e) { progress = {}; }

  function saveProgress() {
    try { localStorage.setItem(PKEY, JSON.stringify(progress)); } catch (e) {}
  }
  function isDone(id) { return !!(progress[id] && progress[id].done); }
  function setDone(id, value) {
    progress[id] = progress[id] || {};
    progress[id].done = !!value;
    saveProgress();
    updateProgress();
  }
  function doneCount() {
    var c = 0;
    COURSE.lessons.forEach(function (l) { if (isDone(l.id)) c++; });
    return c;
  }
  function moduleProgress(mod) {
    var d = 0;
    mod.lessons.forEach(function (l) { if (isDone(l.id)) d++; });
    return { done: d, total: mod.lessons.length };
  }

  /* =========================================================
     عناصر الصفحة / page elements
     ========================================================= */
  var view = document.getElementById('view');
  var sideTree = document.getElementById('sideTree');
  var body = document.body;

  /* =========================================================
     رسائل مؤقتة / toast
     ========================================================= */
  var toastTimer = null;
  function toast(msg) {
    var root = document.getElementById('toastRoot');
    root.innerHTML = '';
    var el = h('div', { class: 'toast' }, [h('span', {}, [msg])]);
    root.appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { root.innerHTML = ''; }, 2600);
  }

  /* =========================================================
     الشريط الجانبي / sidebar
     ========================================================= */
  function chevron() {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('class', 'chev');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.innerHTML = '<path d="m9 6 6 6-6 6"></path>';
    return s;
  }

  function renderSidebar(activeLessonId) {
    sideTree.innerHTML = '';
    COURSE.modules.forEach(function (mod, mi) {
      var isOpen = mod.lessons.some(function (l) { return l.id === activeLessonId; });
      if (!activeLessonId && mi === 0) isOpen = true;

      var listItems = mod.lessons.map(function (les) {
        var cls = 'module-link' + (isDone(les.id) ? ' is-done' : '') + (les.id === activeLessonId ? ' is-active' : '');
        var a = h('a', { href: '#/lesson/' + les.id, class: cls }, [
          h('span', { class: 'dot' }),
          h('span', {}, [pick(les.title)])
        ]);
        return h('li', {}, [a]);
      });

      var headBtn = h('button', { class: 'module-head', type: 'button' }, [
        h('span', { class: 'module-num' }, [String(mi + 1)]),
        h('span', {}, [pick(mod.title)]),
        chevron()
      ]);

      var wrap = h('div', { class: 'module' + (isOpen ? ' is-open' : '') }, [
        headBtn,
        h('ul', { class: 'module-list' }, listItems)
      ]);

      headBtn.addEventListener('click', function () { wrap.classList.toggle('is-open'); });
      sideTree.appendChild(wrap);
    });
  }

  function updateProgress() {
    var done = doneCount();
    var total = COURSE.lessons.length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById('progressText').textContent = done + ' / ' + total + ' ' + t('lessonsDone');
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressPct').textContent = pct + '%';

    var links = sideTree.querySelectorAll('a[href^="#/lesson/"]');
    for (var i = 0; i < links.length; i++) {
      var id = links[i].getAttribute('href').replace('#/lesson/', '');
      links[i].classList.toggle('is-done', isDone(id));
    }
  }

  /* =========================================================
     مكوّنات مشتركة / shared components
     ========================================================= */
  function codeBlock(code, fileName) {
    var pre = h('pre', {});
    pre.innerHTML = '<code>' + HL.code(code) + '</code>';
    var copy = h('button', { class: 'copy', type: 'button' }, [t('copy')]);
    copy.addEventListener('click', function () {
      var done = function () {
        copy.textContent = t('copied');
        setTimeout(function () { copy.textContent = t('copy'); }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, done);
      else done();
    });
    return h('div', { class: 'code-block' }, [
      h('div', { class: 'code-bar' }, [
        h('span', { class: 'dots' }, [h('i'), h('i'), h('i')]),
        h('span', {}, [fileName || 'index.html']),
        copy
      ]),
      pre
    ]);
  }

  function playIcon() {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.innerHTML = '<path d="M8 5v14l11-7z"></path>';
    return s;
  }

  function videoCard(lesson) {
    var v = global.VIDEOS.forLesson(lesson.id);
    var query = pick(lesson.title) + ' HTML';
    var searchLink = h('a', {
      href: global.VIDEOS.searchUrl(query),
      target: '_blank',
      rel: 'noopener'
    }, ['🔎 ' + (global.I18N.lang === 'ar' ? 'ابحث عن شروحات أخرى' : 'Find more explanations')]);

    if (!v) {
      return h('div', { class: 'video-card card' }, [
        h('div', { class: 'video-head' }, [h('h4', {}, ['🎬 ' + t('videoTitle')])]),
        h('div', { class: 'video-foot' }, [
          h('span', {}, [global.I18N.lang === 'ar'
            ? 'لا يوجد مقطع مرفق لهذا الدرس — ابحث عن شرح بالفيديو:'
            : 'No clip attached to this lesson — search for a video explanation:']),
          searchLink
        ])
      ]);
    }

    var shell = h('button', { class: 'video-shell', type: 'button', 'aria-label': t('videoPlay') });
    var img = h('img', {
      src: 'https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg',
      alt: v.title,
      loading: 'lazy'
    });
    img.addEventListener('error', function () {
      img.remove();
      shell.style.background = 'linear-gradient(140deg,#241a68,#0b0a26)';
    });
    var play = h('span', { class: 'play' }, [playIcon()]);
    shell.appendChild(img);
    shell.appendChild(play);

    shell.addEventListener('click', function () {
      var url = 'https://www.youtube-nocookie.com/embed/' + v.id + '?autoplay=1&rel=0';
      if (v.start) url += '&start=' + v.start;
      if (v.end) url += '&end=' + v.end;
      var frame = h('iframe', {
        src: url,
        title: v.title,
        allow: 'accelerometer; autoplay; encrypted-media; picture-in-picture',
        allowfullscreen: true,
        loading: 'lazy'
      });
      shell.replaceWith(frame);
    });

    var langChip = v.lang === global.I18N.lang ? null :
      h('span', { class: 'chip' }, [v.lang === 'ar' ? 'بالعربية' : 'In English']);

    return h('div', { class: 'video-card card' }, [
      h('div', { class: 'video-head' }, [
        h('h4', {}, ['🎬 ' + t('videoTitle')]),
        langChip,
        h('span', { class: 'chip chip-brand' }, [pick(v.channel)])
      ]),
      shell,
      h('div', { class: 'video-foot' }, [
        h('span', {}, [v.title]),
        h('a', { href: 'https://www.youtube.com/watch?v=' + v.id, target: '_blank', rel: 'noopener' }, [t('videoOpen')])
      ]),
      h('div', { class: 'video-foot', style: 'padding-top:0' }, [
        h('span', {}, [t('videoNote')]),
        searchLink
      ])
    ]);
  }

  /* =========================================================
     الصفحة الرئيسية / home
     ========================================================= */
  function viewHome() {
    var stats = COURSE.stats();
    var done = doneCount();
    var next = COURSE.lessons.filter(function (l) { return !isDone(l.id); })[0] || COURSE.lessons[0];

    var hero = h('section', { class: 'hero' }, [
      h('span', { class: 'eyebrow' }, ['✨ ' + t('heroEyebrow')]),
      h('h1', {}, [t('heroTitleA'), h('em', {}, [t('heroTitleEm')]), t('heroTitleB')]),
      h('p', {}, [t('heroLede')]),
      h('div', { class: 'hero-actions' }, [
        h('a', { class: 'btn btn-primary', href: '#/lesson/' + next.id }, [
          (done ? '▶ ' + t('heroContinue') : '🚀 ' + t('heroStart'))
        ]),
        h('a', { class: 'btn btn-ghost', href: '#/curriculum' }, [t('heroBrowse')]),
        h('a', { class: 'btn btn-ghost', href: '#/playground' }, ['⌨ ' + t('navPlayground')])
      ]),
      h('div', { class: 'stats' }, [
        h('div', { class: 'stat' }, [h('b', {}, [String(stats.lessons)]), h('span', {}, [t('statLessons')])]),
        h('div', { class: 'stat' }, [h('b', {}, [String(stats.modules)]), h('span', {}, [t('statModules')])]),
        h('div', { class: 'stat' }, [h('b', {}, [String(stats.challenges)]), h('span', {}, [t('statChallenges')])]),
        h('div', { class: 'stat' }, [h('b', {}, [String(stats.questions)]), h('span', {}, [t('statQuestions')])])
      ])
    ]);

    var features = [
      ['⌨️', 'f1t', 'f1d'], ['🎯', 'f2t', 'f2d'], ['🌍', 'f3t', 'f3d'],
      ['📈', 'f4t', 'f4d'], ['📚', 'f5t', 'f5d'], ['🏆', 'f6t', 'f6d']
    ].map(function (f) {
      return h('div', { class: 'feature' }, [
        h('div', { class: 'ic' }, [f[0]]),
        h('h3', {}, [t(f[1])]),
        h('p', {}, [t(f[2])])
      ]);
    });

    var cards = COURSE.modules.map(function (mod, i) {
      var mp = moduleProgress(mod);
      var pct = Math.round((mp.done / mp.total) * 100);
      var bar = h('div', { class: 'mini-bar' }, [h('i')]);
      bar.firstChild.style.width = pct + '%';
      return h('a', { class: 'module-card', href: '#/lesson/' + mod.lessons[0].id }, [
        h('div', { class: 'top' }, [
          h('span', { class: 'badge' }, [String(i + 1)]),
          h('h3', {}, [pick(mod.title)])
        ]),
        h('p', {}, [pick(mod.desc)]),
        h('div', { class: 'foot' }, [
          h('span', {}, [mod.lessons.length + ' ' + t('lessonsCount')]),
          bar,
          h('span', {}, [mp.done + '/' + mp.total])
        ])
      ]);
    });

    return [
      hero,
      h('div', { class: 'section-head' }, [h('h2', {}, [t('featuresTitle')]), h('p', {}, [t('featuresSub')])]),
      h('div', { class: 'feature-grid' }, features),
      h('div', { class: 'section-head' }, [h('h2', {}, [t('modulesTitle')]), h('p', {}, [t('modulesSub')])]),
      h('div', { class: 'module-grid' }, cards)
    ];
  }

  /* =========================================================
     صفحة المنهج / curriculum
     ========================================================= */
  function viewCurriculum() {
    var out = [
      h('div', { class: 'section-head', style: 'margin-top:0' }, [
        h('h2', {}, [t('modulesTitle')]),
        h('p', {}, [t('modulesSub')])
      ])
    ];

    COURSE.modules.forEach(function (mod, mi) {
      var rows = mod.lessons.map(function (les, li) {
        return h('a', {
          class: 'pr-item',
          href: '#/lesson/' + les.id,
          style: 'border:1px solid var(--line);margin-bottom:8px;background:var(--surface)'
        }, [
          h('span', { class: 'ic' }, [isDone(les.id) ? '✓' : String(li + 1)]),
          h('span', { class: 'txt' }, [
            h('b', {}, [pick(les.title)]),
            h('span', {}, [les.minutes + ' ' + t('minutes') + ' · ' + t('level' + les.level.charAt(0).toUpperCase() + les.level.slice(1))])
          ])
        ]);
      });

      out.push(h('section', { style: 'margin-bottom:34px' }, [
        h('h3', { style: 'display:flex;align-items:center;gap:10px;font-size:20px;margin:0 0 14px' }, [
          h('span', { class: 'module-num' }, [String(mi + 1)]),
          pick(mod.title)
        ]),
        h('p', { style: 'color:var(--muted);margin:0 0 14px' }, [pick(mod.desc)]),
        h('div', {}, rows)
      ]));
    });

    return out;
  }

  /* =========================================================
     صفحة الدرس / lesson
     ========================================================= */
  function viewLesson(id) {
    var les = COURSE.lesson(id);
    if (!les) return viewNotFound();

    var mod = COURSE.module(les.moduleId);
    var prev = COURSE.lessons[les.index - 1];
    var next = COURSE.lessons[les.index + 1];

    var out = [];

    out.push(h('nav', { class: 'crumbs' }, [
      h('a', { href: '#/' }, [t('navHome')]),
      h('span', { class: 'sep' }, ['›']),
      h('a', { href: '#/curriculum' }, [pick(mod.title)]),
      h('span', { class: 'sep' }, ['›']),
      h('span', {}, [pick(les.title)])
    ]));

    out.push(h('header', { class: 'lesson-head' }, [
      h('h1', {}, [pick(les.title)]),
      h('p', { class: 'lede' }, [pick(les.lede)]),
      h('div', { class: 'lesson-meta' }, [
        h('span', { class: 'chip chip-brand' }, [t('lessonOf') + ' ' + (les.index + 1) + ' / ' + COURSE.lessons.length]),
        h('span', { class: 'chip' }, ['⏱ ' + les.minutes + ' ' + t('minutes')]),
        h('span', { class: 'chip chip-accent' }, [t('level' + les.level.charAt(0).toUpperCase() + les.level.slice(1))]),
        isDone(les.id) ? h('span', { class: 'chip chip-ok' }, [t('markedDone')]) : null
      ])
    ]));

    out.push(videoCard(les));

    var prose = h('div', { class: 'prose' });
    prose.innerHTML = pick(les.body);
    out.push(prose);

    if (les.example) {
      out.push(h('div', { class: 'section-head', style: 'margin-top:38px' }, [
        h('h2', {}, ['🧪 ' + t('exampleTitle')]),
        h('p', {}, [pick(les.example.note) || t('exampleHint')])
      ]));
      out.push(global.Playground.createDemo({ code: pick(les.example.code) }).el);
    }

    var markBtn = h('button', { class: 'btn ' + (isDone(les.id) ? 'btn-soft' : 'btn-primary'), type: 'button' }, [
      isDone(les.id) ? '✓ ' + t('markedDone') : t('markDone')
    ]);
    markBtn.addEventListener('click', function () {
      var nowDone = !isDone(les.id);
      setDone(les.id, nowDone);
      markBtn.className = 'btn ' + (nowDone ? 'btn-soft' : 'btn-primary');
      markBtn.textContent = nowDone ? '✓ ' + t('markedDone') : t('markDone');
      if (nowDone) toast(t('savedDone'));
    });

    if (les.challenge) {
      out.push(global.Playground.createChallenge(les.challenge, {
        storeKey: 'etqan.code.' + les.id,
        onPass: function () {
          if (!isDone(les.id)) {
            setDone(les.id, true);
            markBtn.className = 'btn btn-soft';
            markBtn.textContent = '✓ ' + t('markedDone');
            toast(t('savedDone'));
          }
        }
      }).el);
    }

    if (les.quiz && les.quiz.length) {
      out.push(global.Quiz.create(les.quiz, {
        onRetry: function () { render(location.hash); }
      }).el);
    }

    var pager = h('div', { class: 'pager' }, [
      prev ? h('a', { href: '#/lesson/' + prev.id }, [
        h('span', {}, ['← ' + t('prevLesson')]), h('b', {}, [pick(prev.title)])
      ]) : h('span'),
      next ? h('a', { class: 'next', href: '#/lesson/' + next.id }, [
        h('span', {}, [t('nextLesson') + ' →']), h('b', {}, [pick(next.title)])
      ]) : h('a', { class: 'next', href: '#/project' }, [
        h('span', {}, [t('nextLesson') + ' →']), h('b', {}, [t('projTitle')])
      ])
    ]);

    out.push(h('footer', { class: 'lesson-foot' }, [
      h('div', { class: 'done-row' }, [markBtn, h('span', { style: 'color:var(--muted);font-size:14px' }, [t('progressHint')])]),
      pager
    ]));

    return out;
  }

  /* =========================================================
     المرجع / reference
     ========================================================= */
  function viewReference() {
    var activeCat = 'all';
    var query = '';

    var tbody = h('tbody', {});
    var table = h('table', { class: 'ref-table' }, [
      h('thead', {}, [h('tr', {}, [
        h('th', { style: 'width:170px' }, [t('colTag')]),
        h('th', {}, [t('colDesc')]),
        h('th', { style: 'width:34%' }, [t('colExample')])
      ])]),
      tbody
    ]);
    var wrap = h('div', { style: 'overflow-x:auto' }, [table]);
    var empty = h('div', { class: 'ref-empty', hidden: true }, [t('refEmpty')]);

    function draw() {
      tbody.innerHTML = '';
      var q = query.trim().toLowerCase();
      var count = 0;
      REF.tags.forEach(function (item) {
        if (activeCat !== 'all' && item.cat !== activeCat) return;
        var hay = (item.tag + ' ' + item.desc.ar + ' ' + item.desc.en + ' ' + item.ex).toLowerCase();
        if (q && hay.indexOf(q) === -1) return;
        count++;
        var exCell = h('td', {});
        exCell.innerHTML = '<code>' + HL.escape(item.ex) + '</code>';
        tbody.appendChild(h('tr', {}, [
          h('td', { class: 'tagcell' }, [h('code', {}, [item.tag])]),
          h('td', {}, [pick(item.desc)]),
          exCell
        ]));
      });
      empty.hidden = count > 0;
      wrap.hidden = count === 0;
    }

    var input = h('input', { type: 'search', placeholder: t('refSearch'), 'aria-label': t('refSearch') });
    input.addEventListener('input', function () { query = input.value; draw(); });

    var searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    searchIcon.setAttribute('viewBox', '0 0 24 24');
    searchIcon.innerHTML = '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>';

    var filterBtns = [];
    function makeFilter(id, label) {
      var b = h('button', { class: 'filter' + (id === 'all' ? ' is-active' : ''), type: 'button' }, [label]);
      b.addEventListener('click', function () {
        activeCat = id;
        filterBtns.forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        draw();
      });
      filterBtns.push(b);
      return b;
    }

    var filters = [makeFilter('all', t('refAll'))].concat(REF.cats.map(function (c) {
      return makeFilter(c.id, pick(c.label));
    }));

    draw();

    return [
      h('div', { class: 'section-head', style: 'margin-top:0' }, [
        h('h2', {}, ['📚 ' + t('refTitle')]),
        h('p', {}, [t('refSub')])
      ]),
      h('div', { class: 'ref-tools' }, [
        h('div', { class: 'field' }, [searchIcon, input]),
        h('div', { class: 'filters' }, filters)
      ]),
      wrap,
      empty
    ];
  }

  /* =========================================================
     المشروع الختامي / final project
     ========================================================= */
  function viewProject() {
    var p = COURSE.project;
    var challenge = {
      brief: p.intro,
      starter: p.starter,
      solution: p.solution,
      checks: p.checks
    };
    var card = global.Playground.createChallenge(challenge, {
      storeKey: 'etqan.project',
      onPass: function () {
        setDone('__project__', true);
        toast(t('challengePass'));
      }
    });

    return [
      h('div', { class: 'section-head', style: 'margin-top:0' }, [
        h('h2', {}, ['🏆 ' + t('projTitle')]),
        h('p', {}, [t('projSub')])
      ]),
      card.el
    ];
  }

  /* =========================================================
     المحرّر الحر / free playground
     ========================================================= */
  function viewPlayground() {
    var starter = global.I18N.lang === 'ar'
      ? '<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="utf-8">\n  <title>تجربتي</title>\n  <style>\n    body { font-family: system-ui; padding: 20px; }\n    h1 { color: #4b3ff0; }\n  </style>\n</head>\n<body>\n  <h1>اكتب ما تشاء هنا</h1>\n  <p>جرّب أي وسم تعلّمته وشاهد النتيجة فوراً.</p>\n</body>\n</html>'
      : '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>My sandbox</title>\n  <style>\n    body { font-family: system-ui; padding: 20px; }\n    h1 { color: #4b3ff0; }\n  </style>\n</head>\n<body>\n  <h1>Write anything here</h1>\n  <p>Try any tag you learned and see the result instantly.</p>\n</body>\n</html>';

    var demo = global.Playground.createDemo({
      code: starter,
      storeKey: 'etqan.playground',
      title: t('pgTitle'),
      icon: '⌨️'
    });
    demo.el.style.minHeight = '60vh';
    demo.editor.style.minHeight = '52vh';
    demo.frame.style.minHeight = '52vh';

    return [
      h('div', { class: 'section-head', style: 'margin-top:0' }, [
        h('h2', {}, ['⌨️ ' + t('pgTitle')]),
        h('p', {}, [t('pgSub')])
      ]),
      demo.el
    ];
  }

  /* =========================================================
     عن المنصة / about
     ========================================================= */
  function viewAbout() {
    var stats = COURSE.stats();
    var prose = h('div', { class: 'prose' });
    prose.innerHTML = global.I18N.lang === 'ar'
      ? '<p><strong>إتقان HTML</strong> منصّة تعليمية مفتوحة تعمل بالكامل داخل متصفحك: لا حساب، ولا اشتراك، ولا خادم. كل تقدّمك وكل ما تكتبه في المحرّر يُحفظ محلياً في جهازك فقط.</p>' +
        '<h2>ماذا تحتوي؟</h2>' +
        '<ul><li>' + stats.modules + ' وحدات دراسية و' + stats.lessons + ' درساً مرتّباً من الصفر.</li>' +
        '<li>' + stats.challenges + ' تحدياً عملياً مع تصحيح آلي بنداً بنداً.</li>' +
        '<li>' + stats.questions + ' سؤال اختبار مع شرح لكل إجابة.</li>' +
        '<li>مرجع لـ ' + REF.tags.length + ' وسماً، ومحرّر حر، ومشروع ختامي.</li></ul>' +
        '<h2>كيف تستفيد منها؟</h2>' +
        '<ol><li>اقرأ الدرس، ثم شاهد الفيديو إن أحببت.</li>' +
        '<li>عدّل المثال الحيّ ولا تكتفِ بقراءته.</li>' +
        '<li>أنجز التحدي بنفسك قبل النظر إلى الحل.</li>' +
        '<li>أجب على الاختبار، ثم انتقل للدرس التالي.</li></ol>' +
        '<h2>التقنيات</h2>' +
        '<p>HTML وCSS وJavaScript خالصة، بلا أي إطار عمل أو مكتبة خارجية. الكود كله مقروء ومفتوح — وهو بحد ذاته مثال لما ستتعلّمه.</p>'
      : '<p><strong>Etqan HTML</strong> is an open learning platform that runs entirely in your browser: no account, no subscription, no server. All your progress and everything you type in the editor is stored locally on your own device.</p>' +
        '<h2>What is inside?</h2>' +
        '<ul><li>' + stats.modules + ' modules and ' + stats.lessons + ' lessons ordered from zero.</li>' +
        '<li>' + stats.challenges + ' hands-on challenges with point-by-point automatic checking.</li>' +
        '<li>' + stats.questions + ' quiz questions, each with an explanation.</li>' +
        '<li>A reference of ' + REF.tags.length + ' tags, a free playground, and a final project.</li></ul>' +
        '<h2>How to get the most from it</h2>' +
        '<ol><li>Read the lesson, then watch the video if you like.</li>' +
        '<li>Edit the live example — do not just read it.</li>' +
        '<li>Finish the challenge yourself before peeking at the solution.</li>' +
        '<li>Answer the quiz, then move to the next lesson.</li></ol>' +
        '<h2>The technology</h2>' +
        '<p>Plain HTML, CSS and JavaScript with no framework or external library. All the code is readable and open — and it is itself an example of what you are learning.</p>';

    return [
      h('div', { class: 'section-head', style: 'margin-top:0' }, [h('h2', {}, ['ℹ️ ' + t('aboutTitle')])]),
      prose
    ];
  }

  function viewNotFound() {
    return [
      h('div', { class: 'section-head', style: 'margin-top:0' }, [h('h2', {}, ['🧭 ' + t('notFound')])]),
      h('a', { class: 'btn btn-primary', href: '#/' }, [t('backHome')])
    ];
  }

  /* =========================================================
     الراوتر / router
     ========================================================= */
  function parseHash(hash) {
    var clean = (hash || '').replace(/^#\/?/, '');
    var parts = clean.split('/').filter(Boolean);
    return { name: parts[0] || 'home', arg: parts[1] || null };
  }

  function render(hash) {
    var r = parseHash(hash);
    var nodes;

    if (r.name === 'home') nodes = viewHome();
    else if (r.name === 'curriculum') nodes = viewCurriculum();
    else if (r.name === 'lesson') nodes = viewLesson(r.arg);
    else if (r.name === 'reference') nodes = viewReference();
    else if (r.name === 'project') nodes = viewProject();
    else if (r.name === 'playground') nodes = viewPlayground();
    else if (r.name === 'about') nodes = viewAbout();
    else nodes = viewNotFound();

    view.innerHTML = '';
    nodes.forEach(function (nd) { if (nd) view.appendChild(nd); });

    var activeLesson = r.name === 'lesson' ? r.arg : null;
    renderSidebar(activeLesson);
    updateProgress();

    var navs = document.querySelectorAll('.topnav a');
    for (var i = 0; i < navs.length; i++) {
      navs[i].classList.toggle('is-active', navs[i].getAttribute('data-nav') === r.name);
    }

    var titleBase = t('brandName');
    if (r.name === 'lesson') {
      var l = COURSE.lesson(r.arg);
      document.title = (l ? pick(l.title) + ' — ' : '') + titleBase;
    } else {
      document.title = titleBase + ' — ' + (r.name === 'home' ? t('brandTag') : t('nav' + r.name.charAt(0).toUpperCase() + r.name.slice(1)) || '');
    }

    body.classList.remove('nav-open');
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', function () { render(location.hash); });

  /* =========================================================
     لوحة البحث / search palette
     ========================================================= */
  var paletteOpen = false;

  function openPalette() {
    if (paletteOpen) return;
    paletteOpen = true;

    var items = [];
    COURSE.lessons.forEach(function (l) {
      items.push({
        icon: '📖',
        title: pick(l.title),
        sub: pick(l.moduleTitle),
        href: '#/lesson/' + l.id,
        hay: (l.title.ar + ' ' + l.title.en + ' ' + l.moduleTitle.ar + ' ' + l.moduleTitle.en + ' ' +
              l.lede.ar + ' ' + l.lede.en + ' ' + (l.tags || []).join(' ')).toLowerCase()
      });
    });
    REF.tags.forEach(function (tag) {
      items.push({
        icon: '</>',
        title: tag.tag,
        sub: pick(tag.desc),
        href: '#/reference',
        hay: (tag.tag + ' ' + tag.desc.ar + ' ' + tag.desc.en).toLowerCase()
      });
    });
    [['🏠', 'navHome', '#/'], ['📋', 'navCurriculum', '#/curriculum'], ['📚', 'navReference', '#/reference'],
     ['🏆', 'navProject', '#/project'], ['⌨️', 'navPlayground', '#/playground'], ['ℹ️', 'navAbout', '#/about']]
      .forEach(function (p) {
        items.push({ icon: p[0], title: t(p[1]), sub: '', href: p[2], hay: t(p[1]).toLowerCase() });
      });

    var results = h('div', { class: 'palette-results' });
    var input = h('input', { type: 'text', placeholder: t('paletteHint'), 'aria-label': t('paletteHint') });
    var selected = 0;
    var current = [];

    function draw() {
      var q = input.value.trim().toLowerCase();
      current = items.filter(function (it) { return !q || it.hay.indexOf(q) !== -1; }).slice(0, 30);
      results.innerHTML = '';
      if (!current.length) {
        results.appendChild(h('div', { class: 'ref-empty' }, [t('paletteEmpty')]));
        return;
      }
      current.forEach(function (it, i) {
        var b = h('button', { class: 'pr-item' + (i === selected ? ' is-sel' : ''), type: 'button' }, [
          h('span', { class: 'ic' }, [it.icon]),
          h('span', { class: 'txt' }, [h('b', {}, [it.title]), h('span', {}, [it.sub])])
        ]);
        b.addEventListener('click', function () { go(it); });
        results.appendChild(b);
      });
    }

    function go(it) { closePalette(); location.hash = it.href; }

    function closePalette() {
      paletteOpen = false;
      document.getElementById('paletteRoot').innerHTML = '';
      document.removeEventListener('keydown', onKey, true);
    }

    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, current.length - 1); draw(); scrollSel(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(selected - 1, 0); draw(); scrollSel(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (current[selected]) go(current[selected]); }
    }

    function scrollSel() {
      var el = results.querySelector('.is-sel');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    }

    input.addEventListener('input', function () { selected = 0; draw(); });

    var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.innerHTML = '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>';

    var panel = h('div', { class: 'palette' }, [
      h('div', { class: 'palette-field' }, [icon, input]),
      results,
      h('div', { class: 'palette-foot' }, [
        h('span', {}, [h('kbd', {}, ['↑↓']), ' ' + t('paletteNav')]),
        h('span', {}, [h('kbd', {}, ['Enter']), ' ' + t('paletteOpen')]),
        h('span', {}, [h('kbd', {}, ['Esc']), ' ' + t('paletteClose')])
      ])
    ]);

    var wrapEl = h('div', { class: 'palette-wrap' }, [panel]);
    wrapEl.addEventListener('click', function (e) { if (e.target === wrapEl) closePalette(); });

    document.getElementById('paletteRoot').appendChild(wrapEl);
    document.addEventListener('keydown', onKey, true);
    draw();
    input.focus();
  }

  /* =========================================================
     الثيم واللغة / theme and language
     ========================================================= */
  var SUN = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>';
  var MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"></path>';

  function applyThemeIcon() {
    var dark = document.documentElement.dataset.theme === 'dark';
    document.getElementById('themeIcon').innerHTML = dark ? SUN : MOON;
  }

  function toggleTheme() {
    var el = document.documentElement;
    var next = el.dataset.theme === 'dark' ? 'light' : 'dark';
    el.dataset.theme = next;
    try { localStorage.setItem('etqan.theme', next); } catch (e) {}
    applyThemeIcon();
  }

  function applyLangButton() {
    document.getElementById('langLabel').textContent = global.I18N.lang === 'ar' ? 'EN' : 'ع';
  }

  function toggleLang() {
    global.I18N.setLang(global.I18N.lang === 'ar' ? 'en' : 'ar');
    global.I18N.apply(document);
    applyLangButton();
    render(location.hash);
  }

  /* =========================================================
     التهيئة / init
     ========================================================= */
  function init() {
    global.I18N.apply(document);
    applyLangButton();
    applyThemeIcon();

    document.getElementById('themeBtn').addEventListener('click', toggleTheme);
    document.getElementById('langBtn').addEventListener('click', toggleLang);
    document.getElementById('searchBtn').addEventListener('click', openPalette);

    var menuToggle = document.getElementById('menuToggle');
    menuToggle.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.getElementById('scrim').addEventListener('click', function () {
      body.classList.remove('nav-open');
    });

    document.getElementById('resetProgress').addEventListener('click', function () {
      if (!confirm(t('resetConfirm'))) return;
      progress = {};
      saveProgress();
      updateProgress();
      render(location.hash);
      toast(t('progressReset'));
    });

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        openPalette();
      }
    });

    if (!location.hash) location.hash = '#/';
    render(location.hash);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
