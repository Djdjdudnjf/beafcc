/* =============================================================
   lessons.js — محتوى المنهج كاملاً بالعربية والإنجليزية
   Full bilingual curriculum content
   ============================================================= */
(function (global) {
  'use strict';

  /* أدوات مساعدة لفحص كود المتعلّم / helpers for challenge checks */
  function txt(el) { return el ? String(el.textContent || '').trim() : ''; }
  function n(doc, sel) { try { return doc.querySelectorAll(sel).length; } catch (e) { return 0; } }
  function has(doc, sel) { return n(doc, sel) > 0; }
  function filled(doc, sel) {
    var list = doc.querySelectorAll(sel);
    for (var i = 0; i < list.length; i++) { if (txt(list[i]).length > 0) return true; }
    return false;
  }
  function attrFilled(doc, sel, attr) {
    var list = doc.querySelectorAll(sel);
    for (var i = 0; i < list.length; i++) {
      var v = list[i].getAttribute(attr);
      if (v && v.trim().length > 0) return true;
    }
    return false;
  }

  var MODULES = [];

  /* ===========================================================
     الوحدة 1 — البداية / Module 1 — Getting started
     =========================================================== */
  MODULES.push({
    id: 'basics',
    icon: '🚀',
    title: { ar: 'البداية: أول خطوة في عالم الويب', en: 'Getting started: your first step into the web' },
    desc:  { ar: 'ما هي HTML، كيف يقرأها المتصفح، وكيف تكتب أول صفحة كاملة بيديك.',
             en: 'What HTML is, how the browser reads it, and how to write your first complete page.' },
    lessons: [

      {
        id: 'what-is-html',
        minutes: 7, level: 'beginner',
        tags: ['html', 'web', 'أساسيات'],
        title: { ar: 'ما هي لغة HTML؟', en: 'What is HTML?' },
        lede: {
          ar: 'قبل أن تكتب أي سطر، افهم ما الذي تصنعه HTML بالضبط — ولماذا هي أول شيء يتعلمه كل مطوّر ويب.',
          en: 'Before writing a single line, understand exactly what HTML builds — and why every web developer learns it first.'
        },
        body: {
          ar: '<h2>الفكرة في جملة واحدة</h2>' +
              '<p><strong>HTML</strong> هي لغة <em>وصف</em> لا لغة <em>برمجة</em>. أنت لا تعطي الكمبيوتر أوامر ولا تكتب شروطاً وحلقات، بل تصف للمتصفح: هذا عنوان، وهذه فقرة، وهذه صورة، وهذا رابط. المتصفح يقرأ الوصف ويرسم الصفحة.</p>' +
              '<p>الاسم اختصار لـ <strong>HyperText Markup Language</strong> أي «لغة ترميز النص التشعّبي». كلمة «ترميز» تعني أنك تضع علامات حول النص لتوضّح معناه، وكلمة «تشعّبي» تشير إلى الروابط التي تنقلك من صفحة إلى أخرى.</p>' +
              '<h2>الأخوة الثلاثة</h2>' +
              '<p>أي صفحة ويب تقريباً مبنية على ثلاث تقنيات، ولكل واحدة دور واضح:</p>' +
              '<ul>' +
              '<li><strong>HTML</strong> — الهيكل والمحتوى. مثل عظام الجسم: العناوين، النصوص، الصور، الأزرار.</li>' +
              '<li><strong>CSS</strong> — الشكل والتنسيق. الألوان، الخطوط، المسافات، التوزيع.</li>' +
              '<li><strong>JavaScript</strong> — السلوك والتفاعل. ماذا يحدث عند الضغط، وتحميل البيانات، والحركة.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>تشبيه يثبّت الفكرة</b>HTML هي الجدران والغرف، وCSS هي الدهان والأثاث، وJavaScript هي الكهرباء والأبواب الأوتوماتيكية. بيت بلا دهان يظل بيتاً، أما دهان بلا جدران فلا شيء.</div></div>' +
              '<h2>لماذا تبدأ بها؟</h2>' +
              '<ul>' +
              '<li>هي <strong>الأساس</strong>: لا يمكنك تنسيق شيء غير موجود، ولا برمجة عنصر لم تُنشئه.</li>' +
              '<li>هي <strong>الأسهل</strong>: تكتب سطراً وتفتح الملف فترى النتيجة فوراً، بلا تثبيت ولا إعدادات.</li>' +
              '<li>هي <strong>مطلوبة دائماً</strong>: مهما تغيّرت الأدوات والأطر الحديثة، كلها تُنتج في النهاية HTML.</li>' +
              '</ul>' +
              '<h2>ما الذي تحتاجه للبدء؟</h2>' +
              '<p>شيئان فقط: <strong>متصفح</strong> (تملكه الآن) و<strong>محرّر نصوص</strong>. حتى المفكرة تكفي، والأفضل محرّر مثل VS Code. وفي هذه المنصة لا تحتاج حتى ذلك — كل درس فيه محرّر جاهز تكتب فيه مباشرة.</p>',
          en: '<h2>The idea in one sentence</h2>' +
              '<p><strong>HTML</strong> is a <em>description</em> language, not a <em>programming</em> language. You do not give the computer commands, conditions or loops. You describe things to the browser: this is a heading, this is a paragraph, this is an image, this is a link. The browser reads your description and paints the page.</p>' +
              '<p>The name stands for <strong>HyperText Markup Language</strong>. "Markup" means you wrap text in labels that explain its meaning, and "hypertext" refers to the links that carry you from one page to another.</p>' +
              '<h2>The three siblings</h2>' +
              '<p>Almost every web page is built on three technologies, each with a clear job:</p>' +
              '<ul>' +
              '<li><strong>HTML</strong> — structure and content. Like the bones of a body: headings, text, images, buttons.</li>' +
              '<li><strong>CSS</strong> — look and style. Colors, fonts, spacing, layout.</li>' +
              '<li><strong>JavaScript</strong> — behavior and interaction. What happens on click, loading data, animation.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>An analogy that sticks</b>HTML is the walls and rooms, CSS is the paint and furniture, JavaScript is the wiring and automatic doors. A house without paint is still a house; paint without walls is nothing.</div></div>' +
              '<h2>Why start here?</h2>' +
              '<ul>' +
              '<li>It is the <strong>foundation</strong>: you cannot style what does not exist, or script an element you never created.</li>' +
              '<li>It is the <strong>easiest</strong>: write a line, open the file, see the result — no installs, no configuration.</li>' +
              '<li>It is <strong>always required</strong>: however modern the framework, the output is still HTML.</li>' +
              '</ul>' +
              '<h2>What do you need to begin?</h2>' +
              '<p>Two things only: a <strong>browser</strong> (you have one right now) and a <strong>text editor</strong>. Even Notepad works, though an editor like VS Code is far nicer. On this platform you do not even need that — every lesson has an editor built in.</p>'
        },
        example: {
          note: { ar: 'هذه صفحة HTML كاملة. عدّل النص بين الوسوم وشاهد النتيجة تتغيّر فوراً.',
                  en: 'This is a complete HTML page. Edit the text between the tags and watch the result change.' },
          code: {
            ar: '<h1>أهلاً بالعالم!</h1>\n<p>هذه أول فقرة أكتبها بلغة HTML.</p>\n<p>وهذه فقرة ثانية فيها <strong>كلمة مهمة</strong>.</p>',
            en: '<h1>Hello, world!</h1>\n<p>This is my first paragraph written in HTML.</p>\n<p>And here is a second one with an <strong>important word</strong>.</p>'
          }
        },
        challenge: {
          brief: { ar: 'اكتب بطاقة تعريف بسيطة عن نفسك: عنوان رئيسي فيه اسمك، وفقرة تصف نفسك، وكلمة واحدة على الأقل بارزة داخل الفقرة.',
                   en: 'Write a simple intro card about yourself: a main heading with your name, a paragraph describing you, and at least one bold word inside the paragraph.' },
          starter: { ar: '<!-- اكتب هنا -->\n', en: '<!-- write here -->\n' },
          solution: { ar: '<h1>أنا سارة</h1>\n<p>أتعلّم <strong>HTML</strong> لأبني موقعي الأول.</p>',
                      en: '<h1>I am Sara</h1>\n<p>I am learning <strong>HTML</strong> to build my first website.</p>' },
          checks: [
            { label: { ar: 'يوجد عنوان رئيسي <h1>', en: 'There is an <h1> heading' },
              hint:  { ar: 'اكتب <h1>اسمك</h1>', en: 'Write <h1>your name</h1>' },
              test: function (d) { return has(d, 'h1'); } },
            { label: { ar: 'العنوان ليس فارغاً', en: 'The heading is not empty' },
              hint:  { ar: 'ضع نصاً بين <h1> و</h1>', en: 'Put text between <h1> and </h1>' },
              test: function (d) { return filled(d, 'h1'); } },
            { label: { ar: 'توجد فقرة <p> فيها نص', en: 'There is a <p> paragraph with text' },
              hint:  { ar: 'أضف <p>جملة عنك</p>', en: 'Add <p>a sentence about you</p>' },
              test: function (d) { return filled(d, 'p'); } },
            { label: { ar: 'يوجد نص بارز داخل الفقرة <strong>', en: 'There is a <strong> word inside the paragraph' },
              hint:  { ar: 'غلّف كلمة بـ <strong>…</strong>', en: 'Wrap a word in <strong>…</strong>' },
              test: function (d) { return filled(d, 'p strong'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما التصنيف الصحيح للغة HTML؟', en: 'How is HTML correctly classified?' },
            options: [ { ar: 'لغة برمجة كاملة', en: 'A full programming language' },
                       { ar: 'لغة ترميز ووصف', en: 'A markup and description language' },
                       { ar: 'قاعدة بيانات', en: 'A database' },
                       { ar: 'نظام تشغيل', en: 'An operating system' } ],
            answer: 1,
            why: { ar: 'HTML تصف بنية المحتوى للمتصفح، ولا تحتوي على منطق برمجي مثل الشروط والحلقات.',
                   en: 'HTML describes content structure for the browser; it has no programming logic such as conditions or loops.' } },
          { q: { ar: 'أي تقنية مسؤولة عن ألوان الصفحة وخطوطها؟', en: 'Which technology handles page colors and fonts?' },
            options: [ { ar: 'HTML', en: 'HTML' }, { ar: 'CSS', en: 'CSS' }, { ar: 'JavaScript', en: 'JavaScript' }, { ar: 'SQL', en: 'SQL' } ],
            answer: 1,
            why: { ar: 'CSS هي لغة التنسيق: الألوان والخطوط والمسافات والتوزيع.',
                   en: 'CSS is the styling language: colors, fonts, spacing and layout.' } },
          { q: { ar: 'ما الحد الأدنى من الأدوات لتكتب صفحة HTML؟', en: 'What is the minimum you need to write an HTML page?' },
            options: [ { ar: 'خادم ويب مدفوع', en: 'A paid web server' },
                       { ar: 'محرّر نصوص ومتصفح', en: 'A text editor and a browser' },
                       { ar: 'برنامج تصميم احترافي', en: 'Professional design software' },
                       { ar: 'حساب مطوّر معتمد', en: 'A certified developer account' } ],
            answer: 1,
            why: { ar: 'تكفي المفكرة والمتصفح: تحفظ الملف بامتداد ‎.html‎ ثم تفتحه.',
                   en: 'Notepad and a browser are enough: save the file with a .html extension and open it.' } }
        ]
      },

      {
        id: 'how-web-works',
        minutes: 6, level: 'beginner',
        tags: ['المتصفح', 'browser', 'server'],
        title: { ar: 'كيف يعرض المتصفح صفحتك؟', en: 'How does the browser render your page?' },
        lede: { ar: 'رحلة قصيرة من لحظة كتابة العنوان في المتصفح حتى ظهور صفحتك على الشاشة.',
                en: 'A short journey from typing an address to seeing your page on screen.' },
        body: {
          ar: '<h2>الرحلة في خمس خطوات</h2>' +
              '<ol>' +
              '<li><strong>الطلب</strong>: تكتب عنواناً مثل <code>example.com</code> فيرسل المتصفح طلباً عبر الإنترنت.</li>' +
              '<li><strong>الخادم</strong>: جهاز يعمل ليل نهار يستقبل الطلب ويردّ بملف HTML نصّي.</li>' +
              '<li><strong>التحليل</strong>: المتصفح يقرأ النص سطراً سطراً ويبني منه شجرة عناصر تُسمّى <strong>DOM</strong>.</li>' +
              '<li><strong>التنسيق</strong>: يجلب ملفات CSS والصور والخطوط ويطبّقها على الشجرة.</li>' +
              '<li><strong>الرسم</strong>: يحسب مكان كل عنصر ثم يرسمه على الشاشة.</li>' +
              '</ol>' +
              '<div class="callout callout-note"><span class="ic">🌳</span><div><b>ما هو الـ DOM؟</b>هو تمثيل شجري لصفحتك داخل ذاكرة المتصفح: <code>html</code> هو الجذع، و<code>head</code> و<code>body</code> فرعان، وكل وسم تكتبه يصبح غصناً. لاحقاً تستطيع JavaScript تعديل هذه الشجرة فتتغيّر الصفحة أمام المستخدم.</div></div>' +
              '<h2>لا تحتاج خادماً لتتعلّم</h2>' +
              '<p>الخادم ضروري فقط لنشر موقعك للناس. أما أثناء التعلّم فيكفي أن تحفظ ملفاً باسم <code>index.html</code> على جهازك وتفتحه بالمتصفح مباشرة (نقرة مزدوجة). سترى صفحتك تعمل تماماً، ويظهر في شريط العنوان مسار مثل <code>file:///…</code> بدل <code>https://…</code>.</p>' +
              '<h2>أدوات المطوّر: صديقك الدائم</h2>' +
              '<p>اضغط <kbd>F12</kbd> في أي متصفح لتفتح أدوات المطوّر. من تبويب <strong>Elements</strong> ترى شجرة DOM الحيّة لأي موقع في العالم، وتستطيع تعديلها مؤقتاً لتجرّب. هذه أسرع طريقة لفهم كيف بُنيت المواقع التي تعجبك.</p>',
          en: '<h2>The journey in five steps</h2>' +
              '<ol>' +
              '<li><strong>Request</strong>: you type an address such as <code>example.com</code> and the browser sends a request over the internet.</li>' +
              '<li><strong>Server</strong>: a machine running day and night receives the request and replies with a text HTML file.</li>' +
              '<li><strong>Parsing</strong>: the browser reads that text line by line and builds a tree of elements called the <strong>DOM</strong>.</li>' +
              '<li><strong>Styling</strong>: it fetches CSS files, images and fonts, then applies them to the tree.</li>' +
              '<li><strong>Painting</strong>: it calculates where each element goes and draws it on screen.</li>' +
              '</ol>' +
              '<div class="callout callout-note"><span class="ic">🌳</span><div><b>What is the DOM?</b>It is a tree representation of your page inside browser memory: <code>html</code> is the trunk, <code>head</code> and <code>body</code> are two branches, and every tag you write becomes a twig. Later, JavaScript can modify this tree and the page changes in front of the user.</div></div>' +
              '<h2>You do not need a server to learn</h2>' +
              '<p>A server is only needed to publish your site to other people. While learning, save a file named <code>index.html</code> on your machine and open it directly (double click). The page works perfectly, and the address bar shows a path like <code>file:///…</code> instead of <code>https://…</code>.</p>' +
              '<h2>DevTools: your permanent companion</h2>' +
              '<p>Press <kbd>F12</kbd> in any browser to open developer tools. The <strong>Elements</strong> tab shows the live DOM tree of any site in the world, and you can edit it temporarily to experiment. It is the fastest way to understand how the sites you admire are built.</p>'
        },
        example: {
          note: { ar: 'كل وسم تكتبه هنا يتحول إلى عقدة في شجرة DOM على اليسار.',
                  en: 'Every tag you write here becomes a node in the DOM tree shown in the result.' },
          code: {
            ar: '<h1>عنوان الصفحة</h1>\n<div>\n  <p>فقرة داخل صندوق.</p>\n  <p>وفقرة أخرى بجانبها.</p>\n</div>',
            en: '<h1>Page title</h1>\n<div>\n  <p>A paragraph inside a box.</p>\n  <p>And another one next to it.</p>\n</div>'
          }
        },
        challenge: {
          brief: { ar: 'ابنِ شجرة صغيرة: عنصر <div> بداخله عنوان <h2> وفقرتان <p>. لاحظ أن ما بداخل الصندوق يصبح فرعاً منه في شجرة DOM.',
                   en: 'Build a small tree: a <div> containing an <h2> heading and two <p> paragraphs. Notice how everything inside the box becomes a branch of it in the DOM.' },
          starter: { ar: '<div>\n  \n</div>', en: '<div>\n  \n</div>' },
          solution: { ar: '<div>\n  <h2>قسم الأخبار</h2>\n  <p>الخبر الأول.</p>\n  <p>الخبر الثاني.</p>\n</div>',
                      en: '<div>\n  <h2>News section</h2>\n  <p>First story.</p>\n  <p>Second story.</p>\n</div>' },
          checks: [
            { label: { ar: 'يوجد عنصر <div>', en: 'A <div> element exists' },
              hint:  { ar: 'ابدأ بـ <div> وأغلقه بـ </div>', en: 'Start with <div> and close it with </div>' },
              test: function (d) { return has(d, 'div'); } },
            { label: { ar: 'يوجد <h2> داخل الـ <div>', en: 'An <h2> sits inside the <div>' },
              hint:  { ar: 'ضع <h2>…</h2> بين وسمي الـ div', en: 'Put <h2>…</h2> between the div tags' },
              test: function (d) { return filled(d, 'div h2'); } },
            { label: { ar: 'توجد فقرتان <p> داخل الـ <div>', en: 'Two <p> paragraphs are inside the <div>' },
              hint:  { ar: 'أضف فقرتين منفصلتين لا فقرة واحدة', en: 'Add two separate paragraphs, not one' },
              test: function (d) { return n(d, 'div p') >= 2; } }
          ]
        },
        quiz: [
          { q: { ar: 'ماذا يبني المتصفح بعد قراءة ملف HTML؟', en: 'What does the browser build after reading an HTML file?' },
            options: [ { ar: 'قاعدة بيانات', en: 'A database' }, { ar: 'شجرة DOM', en: 'A DOM tree' },
                       { ar: 'ملف صورة', en: 'An image file' }, { ar: 'خادماً جديداً', en: 'A new server' } ],
            answer: 1,
            why: { ar: 'يحوّل المتصفح النص إلى شجرة عناصر في الذاكرة اسمها DOM ثم يرسمها.',
                   en: 'The browser turns the text into an in-memory element tree called the DOM, then paints it.' } },
          { q: { ar: 'هل تحتاج خادم ويب لتجرّب صفحاتك أثناء التعلّم؟', en: 'Do you need a web server to test pages while learning?' },
            options: [ { ar: 'نعم، إجبارياً', en: 'Yes, mandatory' },
                       { ar: 'لا، يكفي فتح الملف بالمتصفح', en: 'No, opening the file in a browser is enough' },
                       { ar: 'نعم، خادم مدفوع', en: 'Yes, a paid server' },
                       { ar: 'لا، لكن يلزم اتصال إنترنت دائم', en: 'No, but a constant internet connection is required' } ],
            answer: 1,
            why: { ar: 'الملف المحلي يُفتح مباشرة عبر بروتوكول file:// ويعمل بالكامل.',
                   en: 'A local file opens directly through the file:// protocol and works fully.' } },
          { q: { ar: 'أي اختصار يفتح أدوات المطوّر في المتصفح؟', en: 'Which shortcut opens the browser developer tools?' },
            options: [ { ar: 'F1', en: 'F1' }, { ar: 'F12', en: 'F12' }, { ar: 'Alt + S', en: 'Alt + S' }, { ar: 'Ctrl + P', en: 'Ctrl + P' } ],
            answer: 1,
            why: { ar: 'F12 يفتح لوحة الأدوات، ومنها تبويب Elements لعرض شجرة DOM.',
                   en: 'F12 opens the tools panel, where the Elements tab shows the DOM tree.' } }
        ]
      },

      {
        id: 'first-page',
        minutes: 8, level: 'beginner',
        tags: ['وسم', 'tag', 'element'],
        title: { ar: 'الوسم والعنصر: قواعد الكتابة', en: 'Tags and elements: the writing rules' },
        lede: { ar: 'قاعدة واحدة تتكرر في كل HTML: وسم فتح، محتوى، وسم إغلاق. أتقِنها الآن ولن تتعثّر لاحقاً.',
                en: 'One rule repeats throughout HTML: opening tag, content, closing tag. Master it now and nothing later will trip you up.' },
        body: {
          ar: '<h2>تشريح العنصر</h2>' +
              '<p>العنصر الواحد يتكوّن من ثلاثة أجزاء:</p>' +
              '<ul>' +
              '<li><strong>وسم الفتح</strong>: اسم بين قوسين زاويين، مثل <code>&lt;p&gt;</code>.</li>' +
              '<li><strong>المحتوى</strong>: النص أو العناصر الموجودة بالداخل.</li>' +
              '<li><strong>وسم الإغلاق</strong>: مثل وسم الفتح لكن بشرطة مائلة، <code>&lt;/p&gt;</code>.</li>' +
              '</ul>' +
              '<p>مجتمعة تُكوِّن: <code>&lt;p&gt;نص الفقرة&lt;/p&gt;</code></p>' +
              '<h2>العناصر الفارغة</h2>' +
              '<p>بعض العناصر لا تحتوي نصاً فلا تحتاج وسم إغلاق، وتُسمّى <strong>عناصر فارغة</strong> (void elements)، أشهرها:</p>' +
              '<ul>' +
              '<li><code>&lt;br&gt;</code> — كسر سطر.</li>' +
              '<li><code>&lt;hr&gt;</code> — خط فاصل أفقي.</li>' +
              '<li><code>&lt;img&gt;</code> — صورة.</li>' +
              '<li><code>&lt;input&gt;</code> — حقل إدخال.</li>' +
              '</ul>' +
              '<h2>التعشيش الصحيح</h2>' +
              '<p>عندما يحتوي عنصر عنصراً آخر يجب أن يُغلق الداخلي أولاً، تماماً كالأقواس في الرياضيات:</p>' +
              '<div class="callout callout-tip"><span class="ic">✅</span><div><b>صحيح</b><code>&lt;p&gt;نص &lt;strong&gt;مهم&lt;/strong&gt;&lt;/p&gt;</code></div></div>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>خطأ</b><code>&lt;p&gt;نص &lt;strong&gt;مهم&lt;/p&gt;&lt;/strong&gt;</code> — الإغلاق متقاطع، وقد يعطي نتيجة غير متوقعة.</div></div>' +
              '<h2>قواعد صغيرة تُريحك</h2>' +
              '<ul>' +
              '<li>اكتب أسماء الوسوم بحروف <strong>صغيرة</strong>: <code>&lt;div&gt;</code> لا <code>&lt;DIV&gt;</code>.</li>' +
              '<li>المسافات والأسطر الزائدة في الكود لا تؤثر على النتيجة، لكنها تجعل الكود مقروءاً.</li>' +
              '<li>اضبط <strong>الإزاحة</strong> (indentation): كل عنصر داخلي يُزاح مسافتين للداخل.</li>' +
              '</ul>',
          en: '<h2>Anatomy of an element</h2>' +
              '<p>A single element has three parts:</p>' +
              '<ul>' +
              '<li><strong>Opening tag</strong>: a name between angle brackets, e.g. <code>&lt;p&gt;</code>.</li>' +
              '<li><strong>Content</strong>: the text or elements inside.</li>' +
              '<li><strong>Closing tag</strong>: same as the opening tag but with a slash, <code>&lt;/p&gt;</code>.</li>' +
              '</ul>' +
              '<p>Together they form: <code>&lt;p&gt;Paragraph text&lt;/p&gt;</code></p>' +
              '<h2>Empty elements</h2>' +
              '<p>Some elements hold no text and need no closing tag. They are called <strong>void elements</strong>. The common ones:</p>' +
              '<ul>' +
              '<li><code>&lt;br&gt;</code> — line break.</li>' +
              '<li><code>&lt;hr&gt;</code> — horizontal rule.</li>' +
              '<li><code>&lt;img&gt;</code> — image.</li>' +
              '<li><code>&lt;input&gt;</code> — input field.</li>' +
              '</ul>' +
              '<h2>Correct nesting</h2>' +
              '<p>When one element contains another, the inner one must close first — exactly like brackets in maths:</p>' +
              '<div class="callout callout-tip"><span class="ic">✅</span><div><b>Correct</b><code>&lt;p&gt;text &lt;strong&gt;important&lt;/strong&gt;&lt;/p&gt;</code></div></div>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>Wrong</b><code>&lt;p&gt;text &lt;strong&gt;important&lt;/p&gt;&lt;/strong&gt;</code> — the tags cross, and the result may surprise you.</div></div>' +
              '<h2>Small rules that save you</h2>' +
              '<ul>' +
              '<li>Write tag names in <strong>lowercase</strong>: <code>&lt;div&gt;</code>, not <code>&lt;DIV&gt;</code>.</li>' +
              '<li>Extra spaces and blank lines do not change the output, but they make code readable.</li>' +
              '<li>Keep your <strong>indentation</strong>: every nested element moves two spaces in.</li>' +
              '</ul>'
        },
        example: {
          note: { ar: 'جرّب حذف وسم الإغلاق </strong> وشاهد كيف يمتد التنسيق على بقية النص.',
                  en: 'Try deleting the closing </strong> tag and see how the styling leaks into the rest of the text.' },
          code: {
            ar: '<h2>عناصر متداخلة</h2>\n<p>هذه فقرة فيها <strong>نص بارز</strong> ثم <em>نص مائل</em>.</p>\n<hr>\n<p>سطر أول<br>سطر ثانٍ بعد كسر السطر.</p>',
            en: '<h2>Nested elements</h2>\n<p>A paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>\n<hr>\n<p>First line<br>Second line after the break.</p>'
          }
        },
        challenge: {
          brief: { ar: 'اكتب فقرة واحدة فيها نص بارز ونص مائل، ثم خطاً فاصلاً <hr>، ثم فقرة ثانية مكوّنة من سطرين باستخدام <br>.',
                   en: 'Write one paragraph containing bold and italic text, then an <hr> rule, then a second paragraph split into two lines using <br>.' },
          starter: { ar: '<p></p>\n', en: '<p></p>\n' },
          solution: { ar: '<p>أنا <strong>أتعلّم</strong> لغة <em>HTML</em>.</p>\n<hr>\n<p>سطر أول<br>سطر ثانٍ</p>',
                      en: '<p>I am <strong>learning</strong> the <em>HTML</em> language.</p>\n<hr>\n<p>First line<br>Second line</p>' },
          checks: [
            { label: { ar: 'يوجد <strong> داخل فقرة', en: 'A <strong> inside a paragraph' },
              hint:  { ar: 'مثال: <p>نص <strong>بارز</strong></p>', en: 'Example: <p>text <strong>bold</strong></p>' },
              test: function (d) { return filled(d, 'p strong'); } },
            { label: { ar: 'يوجد <em> داخل فقرة', en: 'An <em> inside a paragraph' },
              hint:  { ar: 'استخدم <em>…</em> للنص المائل', en: 'Use <em>…</em> for italic text' },
              test: function (d) { return filled(d, 'p em'); } },
            { label: { ar: 'يوجد خط فاصل <hr>', en: 'A horizontal rule <hr> exists' },
              hint:  { ar: '<hr> عنصر فارغ بلا إغلاق', en: '<hr> is a void element with no closing tag' },
              test: function (d) { return has(d, 'hr'); } },
            { label: { ar: 'توجد فقرة ثانية فيها <br>', en: 'A second paragraph contains a <br>' },
              hint:  { ar: 'ضع <br> في منتصف نص الفقرة الثانية', en: 'Put <br> in the middle of the second paragraph text' },
              test: function (d) { return n(d, 'p') >= 2 && has(d, 'p br'); } }
          ]
        },
        quiz: [
          { q: { ar: 'أي مما يلي عنصر فارغ لا يحتاج وسم إغلاق؟', en: 'Which of these is a void element needing no closing tag?' },
            options: [ { ar: '<p>', en: '<p>' }, { ar: '<img>', en: '<img>' }, { ar: '<div>', en: '<div>' }, { ar: '<h1>', en: '<h1>' } ],
            answer: 1,
            why: { ar: '<img> و<br> و<hr> و<input> عناصر فارغة تُكتب بوسم واحد.',
                   en: '<img>, <br>, <hr> and <input> are void elements written as a single tag.' } },
          { q: { ar: 'ما التعشيش الصحيح؟', en: 'Which nesting is correct?' },
            options: [ { ar: '<p>نص <b>مهم</p></b>', en: '<p>text <b>bold</p></b>' },
                       { ar: '<p>نص <b>مهم</b></p>', en: '<p>text <b>bold</b></p>' },
                       { ar: '<b><p>نص</b></p>', en: '<b><p>text</b></p>' },
                       { ar: '<p><b>نص</p>', en: '<p><b>text</p>' } ],
            answer: 1,
            why: { ar: 'العنصر الداخلي يُغلق قبل الخارجي دائماً، كالأقواس المتداخلة.',
                   en: 'The inner element always closes before the outer one, like nested brackets.' } },
          { q: { ar: 'هل تؤثر الأسطر والمسافات الزائدة على شكل الصفحة؟', en: 'Do extra spaces and line breaks change how the page looks?' },
            options: [ { ar: 'نعم دائماً', en: 'Yes, always' },
                       { ar: 'لا، المتصفح يدمجها في مسافة واحدة', en: 'No, the browser collapses them into one space' },
                       { ar: 'تسبب خطأ في الصفحة', en: 'They cause a page error' },
                       { ar: 'تمنع ظهور النص', en: 'They hide the text' } ],
            answer: 1,
            why: { ar: 'المتصفح يدمج المسافات المتتالية، لذلك نستخدم <br> أو عناصر جديدة للفصل.',
                   en: 'The browser collapses consecutive whitespace, so we use <br> or new elements to separate.' } }
        ]
      },

      {
        id: 'document-structure',
        minutes: 9, level: 'beginner',
        tags: ['head', 'body', 'doctype'],
        title: { ar: 'هيكل المستند الكامل', en: 'The complete document skeleton' },
        lede: { ar: 'الأسطر السبعة التي تبدأ بها كل صفحة في العالم — وماذا يفعل كل سطر منها.',
                en: 'The seven lines that begin every page in the world — and what each one does.' },
        body: {
          ar: '<h2>الهيكل الأساسي</h2>' +
              '<p>أي ملف HTML حقيقي يبدأ بهذا القالب:</p>' +
              '<ul>' +
              '<li><code>&lt;!doctype html&gt;</code> — يخبر المتصفح أن هذه صفحة HTML حديثة. يُكتب أول سطر دائماً.</li>' +
              '<li><code>&lt;html&gt;</code> — العنصر الجذر الذي يحوي كل شيء. نضع فيه <code>lang</code> و<code>dir</code>.</li>' +
              '<li><code>&lt;head&gt;</code> — معلومات <strong>عن</strong> الصفحة لا تظهر داخلها: العنوان، الترميز، الروابط.</li>' +
              '<li><code>&lt;body&gt;</code> — كل ما يراه الزائر فعلياً.</li>' +
              '</ul>' +
              '<h2>ماذا يوضع في الـ head؟</h2>' +
              '<ul>' +
              '<li><code>&lt;meta charset="utf-8"&gt;</code> — ضروري جداً للعربية، وبدونه تظهر الحروف كرموز غريبة.</li>' +
              '<li><code>&lt;title&gt;</code> — نص تبويب المتصفح، ويظهر في نتائج البحث.</li>' +
              '<li><code>&lt;meta name="viewport" …&gt;</code> — يجعل الصفحة تتأقلم مع شاشة الجوال.</li>' +
              '<li><code>&lt;link rel="stylesheet"&gt;</code> — لربط ملف تنسيق CSS.</li>' +
              '</ul>' +
              '<h2>العربية واتجاه الصفحة</h2>' +
              '<p>لصفحة عربية سليمة اكتب: <code>&lt;html lang="ar" dir="rtl"&gt;</code>. السمة <code>lang</code> تفيد محركات البحث وقارئات الشاشة، و<code>dir="rtl"</code> تقلب اتجاه النص والتخطيط من اليمين إلى اليسار.</p>' +
              '<div class="callout callout-tip"><span class="ic">💾</span><div><b>الاسم المهم</b>سمِّ صفحتك الرئيسية <code>index.html</code>. هذا الاسم يبحث عنه كل خادم ويب تلقائياً عند فتح المجلد.</div></div>',
          en: '<h2>The core skeleton</h2>' +
              '<p>Every real HTML file starts from this template:</p>' +
              '<ul>' +
              '<li><code>&lt;!doctype html&gt;</code> — tells the browser this is a modern HTML page. Always the first line.</li>' +
              '<li><code>&lt;html&gt;</code> — the root element holding everything. We put <code>lang</code> and <code>dir</code> on it.</li>' +
              '<li><code>&lt;head&gt;</code> — information <strong>about</strong> the page that is not shown in it: title, encoding, links.</li>' +
              '<li><code>&lt;body&gt;</code> — everything the visitor actually sees.</li>' +
              '</ul>' +
              '<h2>What goes in the head?</h2>' +
              '<ul>' +
              '<li><code>&lt;meta charset="utf-8"&gt;</code> — essential for Arabic and any non-English text; without it letters turn into strange symbols.</li>' +
              '<li><code>&lt;title&gt;</code> — the browser tab text, and what search results show.</li>' +
              '<li><code>&lt;meta name="viewport" …&gt;</code> — makes the page adapt to phone screens.</li>' +
              '<li><code>&lt;link rel="stylesheet"&gt;</code> — connects a CSS file.</li>' +
              '</ul>' +
              '<h2>Language and direction</h2>' +
              '<p>For a proper Arabic page write <code>&lt;html lang="ar" dir="rtl"&gt;</code>. The <code>lang</code> attribute helps search engines and screen readers, while <code>dir="rtl"</code> flips text and layout from right to left.</p>' +
              '<div class="callout callout-tip"><span class="ic">💾</span><div><b>The special name</b>Name your main page <code>index.html</code>. Every web server looks for that name automatically when a folder is opened.</div></div>'
        },
        example: {
          note: { ar: 'هذا ملف كامل يمكنك حفظه باسم index.html وفتحه مباشرة على جهازك.',
                  en: 'This is a full file you can save as index.html and open directly on your machine.' },
          code: {
            ar: '<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>صفحتي الأولى</title>\n</head>\n<body>\n  <h1>مرحباً بك</h1>\n  <p>هذه صفحة HTML كاملة.</p>\n</body>\n</html>',
            en: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My first page</title>\n</head>\n<body>\n  <h1>Welcome</h1>\n  <p>This is a complete HTML page.</p>\n</body>\n</html>'
          }
        },
        challenge: {
          brief: { ar: 'اكتب ملف HTML كاملاً: doctype، ووسم html بسمة lang، وhead فيه charset وtitle، وbody فيه عنوان وفقرة.',
                   en: 'Write a complete HTML file: a doctype, an html tag with a lang attribute, a head with charset and title, and a body with a heading and a paragraph.' },
          starter: { ar: '<!doctype html>\n<html>\n\n</html>', en: '<!doctype html>\n<html>\n\n</html>' },
          solution: { ar: '<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="utf-8">\n  <title>مدوّنتي</title>\n</head>\n<body>\n  <h1>أهلاً</h1>\n  <p>أول صفحة أكتبها كاملة.</p>\n</body>\n</html>',
                      en: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>My blog</title>\n</head>\n<body>\n  <h1>Hello</h1>\n  <p>My first complete page.</p>\n</body>\n</html>' },
          checks: [
            { label: { ar: 'السطر الأول هو <!doctype html>', en: 'The first line is <!doctype html>' },
              hint:  { ar: 'ابدأ الملف بـ <!doctype html>', en: 'Start the file with <!doctype html>' },
              test: function (d, raw) { return /^\s*<!doctype\s+html\s*>/i.test(raw); } },
            { label: { ar: 'وسم <html> يحمل سمة lang', en: 'The <html> tag has a lang attribute' },
              hint:  { ar: 'اكتب <html lang="ar" dir="rtl">', en: 'Write <html lang="en">' },
              test: function (d, raw) { return /<html[^>]*\slang\s*=\s*["'][^"']+["']/i.test(raw); } },
            { label: { ar: 'يوجد <meta charset> داخل الصفحة', en: 'A <meta charset> is present' },
              hint:  { ar: 'أضف <meta charset="utf-8"> داخل head', en: 'Add <meta charset="utf-8"> inside head' },
              test: function (d, raw) { return /<meta[^>]*charset/i.test(raw); } },
            { label: { ar: 'يوجد <title> غير فارغ', en: 'A non-empty <title> exists' },
              hint:  { ar: 'اكتب <title>اسم موقعك</title>', en: 'Write <title>your site name</title>' },
              test: function (d, raw) { return /<title>\s*\S[\s\S]*?<\/title>/i.test(raw); } },
            { label: { ar: 'يوجد عنوان وفقرة داخل الصفحة', en: 'A heading and a paragraph exist in the body' },
              hint:  { ar: 'ضع <h1> و<p> بين وسمي body', en: 'Put <h1> and <p> between the body tags' },
              test: function (d) { return filled(d, 'h1') && filled(d, 'p'); } }
          ]
        },
        quiz: [
          { q: { ar: 'أين يوضع وسم <title>؟', en: 'Where does the <title> tag go?' },
            options: [ { ar: 'داخل <body>', en: 'Inside <body>' }, { ar: 'داخل <head>', en: 'Inside <head>' },
                       { ar: 'قبل <!doctype>', en: 'Before <!doctype>' }, { ar: 'داخل <footer>', en: 'Inside <footer>' } ],
            answer: 1,
            why: { ar: '<title> من معلومات الصفحة، فمكانه <head>، ويظهر في تبويب المتصفح.',
                   en: '<title> is page metadata, so it belongs in <head> and appears in the browser tab.' } },
          { q: { ar: 'ما فائدة <meta charset="utf-8">؟', en: 'What does <meta charset="utf-8"> do?' },
            options: [ { ar: 'يغيّر لون الصفحة', en: 'Changes the page color' },
                       { ar: 'يضمن عرض الحروف العربية وغيرها بشكل صحيح', en: 'Ensures Arabic and other characters display correctly' },
                       { ar: 'يسرّع الإنترنت', en: 'Speeds up the internet' },
                       { ar: 'يضيف خطاً جديداً', en: 'Adds a new font' } ],
            answer: 1,
            why: { ar: 'الترميز utf-8 يدعم كل لغات العالم؛ بدونه تتحوّل الحروف إلى رموز.',
                   en: 'The utf-8 encoding supports every language; without it characters turn into garbage symbols.' } },
          { q: { ar: 'ما السمة التي تجعل الصفحة تُقرأ من اليمين إلى اليسار؟', en: 'Which attribute makes a page read right to left?' },
            options: [ { ar: 'align="right"', en: 'align="right"' }, { ar: 'dir="rtl"', en: 'dir="rtl"' },
                       { ar: 'lang="ar"', en: 'lang="ar"' }, { ar: 'style="rtl"', en: 'style="rtl"' } ],
            answer: 1,
            why: { ar: 'dir="rtl" تقلب اتجاه النص والتخطيط، وlang="ar" تحدّد اللغة فقط.',
                   en: 'dir="rtl" flips text and layout direction, while lang="ar" only declares the language.' } }
        ]
      },

      {
        id: 'comments-attributes',
        minutes: 7, level: 'beginner',
        tags: ['comment', 'attribute', 'سمات'],
        title: { ar: 'التعليقات والسمات', en: 'Comments and attributes' },
        lede: { ar: 'كيف تكتب ملاحظات لنفسك داخل الكود، وكيف تضيف معلومات إضافية لأي عنصر.',
                en: 'How to leave notes for yourself inside the code, and how to add extra information to any element.' },
        body: {
          ar: '<h2>التعليقات</h2>' +
              '<p>التعليق نص يراه المطوّر فقط ولا يظهر في الصفحة. صيغته:</p>' +
              '<p><code>&lt;!-- هذا تعليق --&gt;</code></p>' +
              '<p>استخدمه لثلاثة أشياء: شرح جزء معقّد، تقسيم الملف إلى أقسام واضحة، أو تعطيل كود مؤقتاً بدل حذفه.</p>' +
              '<div class="callout callout-warn"><span class="ic">👀</span><div><b>انتبه</b>التعليق مخفي عن الزائر لكنه ليس سرّاً: أي شخص يستطيع عرض مصدر الصفحة وقراءته. لا تكتب فيه كلمات مرور أو ملاحظات خاصة.</div></div>' +
              '<h2>السمات (Attributes)</h2>' +
              '<p>السمة معلومة إضافية تُكتب <strong>داخل وسم الفتح</strong> بصيغة <code>الاسم="القيمة"</code>:</p>' +
              '<ul>' +
              '<li><code>&lt;a href="page.html"&gt;</code> — <code>href</code> تحدّد وجهة الرابط.</li>' +
              '<li><code>&lt;img src="cat.jpg" alt="قطة"&gt;</code> — <code>src</code> مسار الصورة و<code>alt</code> وصفها.</li>' +
              '<li><code>&lt;p id="intro"&gt;</code> — <code>id</code> معرّف فريد للعنصر.</li>' +
              '<li><code>&lt;p class="note"&gt;</code> — <code>class</code> تصنيف يمكن تكراره على عدة عناصر.</li>' +
              '</ul>' +
              '<h2>قواعد كتابة السمات</h2>' +
              '<ul>' +
              '<li>ضع القيمة بين علامتي اقتباس دائماً.</li>' +
              '<li>افصل بين السمات بمسافة واحدة على الأقل.</li>' +
              '<li>لا تكرّر السمة نفسها في العنصر ذاته.</li>' +
              '<li>بعض السمات منطقية بلا قيمة مثل <code>required</code> و<code>disabled</code>.</li>' +
              '</ul>',
          en: '<h2>Comments</h2>' +
              '<p>A comment is text only the developer sees; it never appears on the page. The syntax is:</p>' +
              '<p><code>&lt;!-- this is a comment --&gt;</code></p>' +
              '<p>Use it for three things: explaining a tricky part, splitting the file into clear sections, or temporarily disabling code instead of deleting it.</p>' +
              '<div class="callout callout-warn"><span class="ic">👀</span><div><b>Careful</b>A comment is hidden from the visitor but it is not a secret: anyone can view the page source and read it. Never put passwords or private notes there.</div></div>' +
              '<h2>Attributes</h2>' +
              '<p>An attribute is extra information written <strong>inside the opening tag</strong> as <code>name="value"</code>:</p>' +
              '<ul>' +
              '<li><code>&lt;a href="page.html"&gt;</code> — <code>href</code> sets the link destination.</li>' +
              '<li><code>&lt;img src="cat.jpg" alt="a cat"&gt;</code> — <code>src</code> is the image path, <code>alt</code> its description.</li>' +
              '<li><code>&lt;p id="intro"&gt;</code> — <code>id</code> is a unique identifier.</li>' +
              '<li><code>&lt;p class="note"&gt;</code> — <code>class</code> is a label that can repeat on many elements.</li>' +
              '</ul>' +
              '<h2>Rules for writing attributes</h2>' +
              '<ul>' +
              '<li>Always wrap the value in quotes.</li>' +
              '<li>Separate attributes with at least one space.</li>' +
              '<li>Never repeat the same attribute on one element.</li>' +
              '<li>Some attributes are boolean and take no value, such as <code>required</code> and <code>disabled</code>.</li>' +
              '</ul>'
        },
        example: {
          note: { ar: 'لاحظ أن التعليق لا يظهر في النتيجة أبداً.',
                  en: 'Notice the comment never shows up in the result.' },
          code: {
            ar: '<!-- قسم الترحيب -->\n<h1 id="main-title">مرحباً</h1>\n\n<!-- الفقرة التالية مخفية مؤقتاً\n<p>نص معطّل</p>\n-->\n\n<p class="note" title="مرّر الفأرة فوقي">فقرة لها سمتان.</p>',
            en: '<!-- welcome section -->\n<h1 id="main-title">Hello</h1>\n\n<!-- the next paragraph is temporarily disabled\n<p>disabled text</p>\n-->\n\n<p class="note" title="hover over me">A paragraph with two attributes.</p>'
          }
        },
        challenge: {
          brief: { ar: 'اكتب تعليقاً في أعلى الكود، ثم عنواناً يحمل السمة id، ثم فقرة تحمل السمة class والسمة title.',
                   en: 'Write a comment at the top, then a heading carrying an id attribute, then a paragraph carrying both class and title attributes.' },
          starter: { ar: '<!-- ابدأ بكتابة تعليق هنا -->\n', en: '<!-- start with a comment here -->\n' },
          solution: { ar: '<!-- بطاقة تعريف -->\n<h1 id="name">خالد</h1>\n<p class="bio" title="نبذة قصيرة">مطوّر ويب مبتدئ.</p>',
                      en: '<!-- profile card -->\n<h1 id="name">Khaled</h1>\n<p class="bio" title="short bio">Beginner web developer.</p>' },
          checks: [
            { label: { ar: 'يوجد تعليق HTML', en: 'An HTML comment exists' },
              hint:  { ar: 'الصيغة: <!-- نص التعليق -->', en: 'Syntax: <!-- comment text -->' },
              test: function (d, raw) { return /<!--[\s\S]*?-->/.test(raw); } },
            { label: { ar: 'يوجد عنوان يحمل السمة id', en: 'A heading carries an id attribute' },
              hint:  { ar: 'مثال: <h1 id="name">…</h1>', en: 'Example: <h1 id="name">…</h1>' },
              test: function (d) { return has(d, 'h1[id], h2[id], h3[id]') && attrFilled(d, 'h1[id], h2[id], h3[id]', 'id'); } },
            { label: { ar: 'توجد فقرة تحمل السمة class', en: 'A paragraph carries a class attribute' },
              hint:  { ar: 'مثال: <p class="bio">…</p>', en: 'Example: <p class="bio">…</p>' },
              test: function (d) { return attrFilled(d, 'p[class]', 'class'); } },
            { label: { ar: 'الفقرة نفسها تحمل السمة title أيضاً', en: 'The same paragraph also carries a title attribute' },
              hint:  { ar: 'أضف title="نص" بجانب class', en: 'Add title="text" next to class' },
              test: function (d) { return attrFilled(d, 'p[class][title]', 'title'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما الصيغة الصحيحة للتعليق في HTML؟', en: 'What is the correct HTML comment syntax?' },
            options: [ { ar: '// تعليق', en: '// comment' }, { ar: '<!-- تعليق -->', en: '<!-- comment -->' },
                       { ar: '/* تعليق */', en: '/* comment */' }, { ar: '# تعليق', en: '# comment' } ],
            answer: 1,
            why: { ar: 'الصيغتان الأخريان تخصان JavaScript وCSS ولغات أخرى.',
                   en: 'The other forms belong to JavaScript, CSS and other languages.' } },
          { q: { ar: 'أين تُكتب السمة؟', en: 'Where is an attribute written?' },
            options: [ { ar: 'داخل وسم الفتح', en: 'Inside the opening tag' }, { ar: 'داخل وسم الإغلاق', en: 'Inside the closing tag' },
                       { ar: 'بين العنصرين', en: 'Between the two tags' }, { ar: 'في ملف منفصل', en: 'In a separate file' } ],
            answer: 0,
            why: { ar: 'السمات جزء من وسم الفتح فقط: <p class="x">.',
                   en: 'Attributes live only in the opening tag: <p class="x">.' } },
          { q: { ar: 'ما الفرق بين id وclass؟', en: 'What is the difference between id and class?' },
            options: [ { ar: 'لا فرق بينهما', en: 'No difference' },
                       { ar: 'id فريد لعنصر واحد، وclass يمكن تكراره', en: 'id is unique to one element, class can repeat' },
                       { ar: 'class فريد وid متكرر', en: 'class is unique and id repeats' },
                       { ar: 'id للصور فقط', en: 'id is only for images' } ],
            answer: 1,
            why: { ar: 'يجب ألا يتكرر id في الصفحة، بينما class مصمّم للتكرار على عناصر متشابهة.',
                   en: 'An id must not repeat in a page, while class is designed to repeat across similar elements.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 2 — النصوص / Module 2 — Text
     =========================================================== */
  MODULES.push({
    id: 'text',
    icon: '✍️',
    title: { ar: 'النصوص: قلب أي صفحة', en: 'Text: the heart of any page' },
    desc:  { ar: 'العناوين والفقرات والتشكيل والاقتباسات والرموز — كل ما يخص الكلمة المكتوبة.',
             en: 'Headings, paragraphs, emphasis, quotations and symbols — everything about the written word.' },
    lessons: [

      {
        id: 'headings',
        minutes: 6, level: 'beginner',
        tags: ['h1', 'عناوين', 'headings'],
        title: { ar: 'العناوين من h1 إلى h6', en: 'Headings from h1 to h6' },
        lede: { ar: 'العناوين ليست خطاً كبيراً فحسب، بل خريطة تُرشد القارئ ومحرك البحث وقارئ الشاشة.',
                en: 'Headings are not just big text; they are a map that guides readers, search engines and screen readers.' },
        body: {
          ar: '<h2>ستة مستويات</h2>' +
              '<p>توفّر HTML ستة عناوين: <code>&lt;h1&gt;</code> هو الأهم و<code>&lt;h6&gt;</code> هو الأصغر. الرقم يعبّر عن <strong>الأهمية والترتيب</strong> لا عن الحجم؛ الحجم مجرد تنسيق افتراضي يمكن تغييره بـ CSS.</p>' +
              '<h2>قاعدة الترتيب الهرمي</h2>' +
              '<ul>' +
              '<li><code>h1</code> واحد فقط في الصفحة غالباً، وهو عنوانها الرئيسي.</li>' +
              '<li>الأقسام الكبرى تأخذ <code>h2</code>، وما يتفرع منها <code>h3</code>، وهكذا.</li>' +
              '<li>لا تقفز من <code>h2</code> إلى <code>h4</code> مباشرة؛ الترتيب يشبه فهرس كتاب.</li>' +
              '</ul>' +
              '<div class="callout callout-warn"><span class="ic">🚫</span><div><b>خطأ شائع</b>اختيار <code>h4</code> لأن حجمه أعجبك. الحل الصحيح: اختر المستوى حسب المعنى، ثم غيّر الحجم بـ CSS.</div></div>' +
              '<h2>لماذا يهم هذا؟</h2>' +
              '<ul>' +
              '<li><strong>محركات البحث</strong> تعتمد على العناوين لفهم موضوع الصفحة.</li>' +
              '<li><strong>قارئات الشاشة</strong> تسمح للمكفوفين بالتنقل بين العناوين مباشرة.</li>' +
              '<li><strong>القارئ العادي</strong> يمسح الصفحة بعينه عبر العناوين قبل أن يقرأ.</li>' +
              '</ul>',
          en: '<h2>Six levels</h2>' +
              '<p>HTML gives you six headings: <code>&lt;h1&gt;</code> is the most important and <code>&lt;h6&gt;</code> the least. The number expresses <strong>importance and order</strong>, not size; the size is only a default style you can change with CSS.</p>' +
              '<h2>The hierarchy rule</h2>' +
              '<ul>' +
              '<li>Usually one <code>h1</code> per page — the page title.</li>' +
              '<li>Major sections use <code>h2</code>, their subsections <code>h3</code>, and so on.</li>' +
              '<li>Do not jump from <code>h2</code> straight to <code>h4</code>; think of a book table of contents.</li>' +
              '</ul>' +
              '<div class="callout callout-warn"><span class="ic">🚫</span><div><b>Common mistake</b>Choosing <code>h4</code> because you like its size. The right fix: pick the level by meaning, then change the size with CSS.</div></div>' +
              '<h2>Why does this matter?</h2>' +
              '<ul>' +
              '<li><strong>Search engines</strong> rely on headings to understand the page topic.</li>' +
              '<li><strong>Screen readers</strong> let blind users jump between headings directly.</li>' +
              '<li><strong>Regular readers</strong> scan headings before reading anything.</li>' +
              '</ul>'
        },
        example: {
          note: { ar: 'غيّر الأرقام وشاهد كيف يتدرّج الحجم تلقائياً.',
                  en: 'Change the numbers and watch the size scale automatically.' },
          code: {
            ar: '<h1>كتاب الطبخ</h1>\n<h2>الفصل الأول: المقبلات</h2>\n<h3>سلطة يونانية</h3>\n<p>مكوّنات بسيطة وسريعة.</p>\n<h3>حمّص بالطحينة</h3>\n<p>طبق شرقي مشهور.</p>\n<h2>الفصل الثاني: الحلويات</h2>',
            en: '<h1>The Cookbook</h1>\n<h2>Chapter one: starters</h2>\n<h3>Greek salad</h3>\n<p>Simple and quick ingredients.</p>\n<h3>Hummus</h3>\n<p>A famous eastern dish.</p>\n<h2>Chapter two: desserts</h2>'
          }
        },
        challenge: {
          brief: { ar: 'ابنِ فهرس مقال: عنوان رئيسي واحد h1، وقسمان h2، وتحت أحدهما عنوان فرعي h3، مع فقرة واحدة على الأقل.',
                   en: 'Build an article outline: one h1, two h2 sections, an h3 under one of them, and at least one paragraph.' },
          starter: { ar: '<h1></h1>\n', en: '<h1></h1>\n' },
          solution: { ar: '<h1>رحلتي إلى اليابان</h1>\n<h2>الوصول</h2>\n<p>هبطنا في طوكيو ليلاً.</p>\n<h3>المطار</h3>\n<p>منظّم بشكل مذهل.</p>\n<h2>العودة</h2>',
                      en: '<h1>My trip to Japan</h1>\n<h2>Arrival</h2>\n<p>We landed in Tokyo at night.</p>\n<h3>The airport</h3>\n<p>Incredibly organised.</p>\n<h2>Going home</h2>' },
          checks: [
            { label: { ar: 'يوجد عنوان h1 واحد فقط', en: 'Exactly one h1 exists' },
              hint:  { ar: 'استخدم h1 مرة واحدة للعنوان الرئيسي', en: 'Use h1 once, for the main title' },
              test: function (d) { return n(d, 'h1') === 1 && filled(d, 'h1'); } },
            { label: { ar: 'يوجد عنوانان h2', en: 'Two h2 headings exist' },
              hint:  { ar: 'أضف <h2> لكل قسم رئيسي', en: 'Add an <h2> for each major section' },
              test: function (d) { return n(d, 'h2') >= 2; } },
            { label: { ar: 'يوجد عنوان فرعي h3', en: 'An h3 subheading exists' },
              hint:  { ar: 'ضع <h3> بعد أحد عناوين h2', en: 'Put an <h3> after one of the h2 headings' },
              test: function (d) { return filled(d, 'h3'); } },
            { label: { ar: 'توجد فقرة نصية واحدة على الأقل', en: 'At least one paragraph of text' },
              hint:  { ar: 'أضف <p>نص</p> تحت أحد العناوين', en: 'Add <p>text</p> under one of the headings' },
              test: function (d) { return filled(d, 'p'); } }
          ]
        },
        quiz: [
          { q: { ar: 'كم عدد مستويات العناوين في HTML؟', en: 'How many heading levels does HTML have?' },
            options: [ { ar: 'ثلاثة', en: 'Three' }, { ar: 'ستة', en: 'Six' }, { ar: 'عشرة', en: 'Ten' }, { ar: 'بلا حدود', en: 'Unlimited' } ],
            answer: 1,
            why: { ar: 'من h1 إلى h6 فقط.', en: 'From h1 to h6 only.' } },
          { q: { ar: 'ما الأصح عند اختيار مستوى العنوان؟', en: 'What is the right way to choose a heading level?' },
            options: [ { ar: 'حسب الحجم الذي يعجبني', en: 'By the size I like' },
                       { ar: 'حسب ترتيب المعنى في الصفحة', en: 'By its place in the page hierarchy' },
                       { ar: 'حسب لون النص', en: 'By the text color' },
                       { ar: 'عشوائياً', en: 'Randomly' } ],
            answer: 1,
            why: { ar: 'المستوى يعبّر عن البنية، والحجم يُضبط لاحقاً بـ CSS.',
                   en: 'The level expresses structure; size is adjusted later with CSS.' } },
          { q: { ar: 'من يستفيد من ترتيب العناوين الصحيح؟', en: 'Who benefits from a correct heading order?' },
            options: [ { ar: 'محركات البحث فقط', en: 'Search engines only' }, { ar: 'قارئات الشاشة فقط', en: 'Screen readers only' },
                       { ar: 'القارئ ومحركات البحث وقارئات الشاشة', en: 'Readers, search engines and screen readers' },
                       { ar: 'لا أحد', en: 'Nobody' } ],
            answer: 2,
            why: { ar: 'العناوين خريطة الصفحة للجميع: بشراً وآلات.',
                   en: 'Headings are the page map for everyone: humans and machines.' } }
        ]
      },

      {
        id: 'paragraphs-format',
        minutes: 7, level: 'beginner',
        tags: ['p', 'strong', 'em', 'تنسيق'],
        title: { ar: 'الفقرات وتشكيل النص', en: 'Paragraphs and text emphasis' },
        lede: { ar: 'كيف تكتب نصاً منظّماً، ومتى تستخدم strong بدل b وem بدل i.',
                en: 'How to write organised text, and when to use strong over b and em over i.' },
        body: {
          ar: '<h2>الفقرة</h2>' +
              '<p>كل كتلة نصية توضع في <code>&lt;p&gt;</code>. المتصفح يضيف تلقائياً مسافة قبل الفقرة وبعدها، ويدمج المسافات والأسطر الزائدة داخلها في مسافة واحدة. لذلك للحصول على سطر جديد داخل الفقرة نستخدم <code>&lt;br&gt;</code> — لكن باعتدال، فهو للعناوين البريدية والشعر لا لتباعد الفقرات.</p>' +
              '<h2>البارز والمؤكَّد</h2>' +
              '<ul>' +
              '<li><code>&lt;strong&gt;</code> — أهمية قوية (يظهر عريضاً). قارئ الشاشة يغيّر نبرته.</li>' +
              '<li><code>&lt;em&gt;</code> — تأكيد لفظي (يظهر مائلاً).</li>' +
              '<li><code>&lt;b&gt;</code> و<code>&lt;i&gt;</code> — شكل فقط بلا معنى إضافي: اسم علم، مصطلح أجنبي.</li>' +
              '<li><code>&lt;mark&gt;</code> — تظليل كقلم الفسفوري.</li>' +
              '<li><code>&lt;small&gt;</code> — ملاحظات جانبية وحقوق.</li>' +
              '<li><code>&lt;del&gt;</code> و<code>&lt;ins&gt;</code> — نص محذوف ونص مضاف.</li>' +
              '<li><code>&lt;sub&gt;</code> و<code>&lt;sup&gt;</code> — نص منخفض ومرتفع مثل H<sub>2</sub>O وم<sup>2</sup>.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">🎯</span><div><b>القاعدة الذهبية</b>اسأل نفسك: هل الكلمة <em>مهمة فعلاً</em> أم أريدها عريضة فقط؟ إن كانت مهمة فاستخدم <code>strong</code>، وإلا فالتنسيق مكانه CSS.</div></div>',
          en: '<h2>The paragraph</h2>' +
              '<p>Every block of text goes in a <code>&lt;p&gt;</code>. The browser automatically adds space before and after it, and collapses extra spaces and line breaks inside into a single space. To force a new line inside a paragraph use <code>&lt;br&gt;</code> — but sparingly: it is for addresses and poetry, not for spacing paragraphs apart.</p>' +
              '<h2>Emphasis and importance</h2>' +
              '<ul>' +
              '<li><code>&lt;strong&gt;</code> — strong importance (renders bold). Screen readers change their tone.</li>' +
              '<li><code>&lt;em&gt;</code> — stress emphasis (renders italic).</li>' +
              '<li><code>&lt;b&gt;</code> and <code>&lt;i&gt;</code> — appearance only, no added meaning: a proper name, a foreign term.</li>' +
              '<li><code>&lt;mark&gt;</code> — highlighted like a marker pen.</li>' +
              '<li><code>&lt;small&gt;</code> — side notes and legal text.</li>' +
              '<li><code>&lt;del&gt;</code> and <code>&lt;ins&gt;</code> — removed and added text.</li>' +
              '<li><code>&lt;sub&gt;</code> and <code>&lt;sup&gt;</code> — subscript and superscript, like H<sub>2</sub>O and m<sup>2</sup>.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">🎯</span><div><b>The golden rule</b>Ask yourself: is this word <em>genuinely important</em>, or do I just want it bold? If it is important use <code>strong</code>; otherwise styling belongs in CSS.</div></div>'
        },
        example: {
          note: { ar: 'جرّب استبدال strong بـ b ولاحظ أن الشكل واحد لكن المعنى مختلف.',
                  en: 'Try swapping strong for b: the look is identical but the meaning differs.' },
          code: {
            ar: '<p>تنبيه <strong>مهم جداً</strong>: الموعد <em>غداً</em> صباحاً.</p>\n<p>السعر <del>200</del> <ins>150</ins> ريال <small>(شامل الضريبة)</small>.</p>\n<p>الماء هو H<sub>2</sub>O والمساحة 25م<sup>2</sup>.</p>\n<p>هذه جملة فيها <mark>كلمة مظلّلة</mark>.</p>',
            en: '<p>An <strong>important</strong> notice: the meeting is <em>tomorrow</em> morning.</p>\n<p>Price <del>200</del> <ins>150</ins> <small>(tax included)</small>.</p>\n<p>Water is H<sub>2</sub>O and the area is 25m<sup>2</sup>.</p>\n<p>This sentence has a <mark>highlighted word</mark>.</p>'
          }
        },
        challenge: {
          brief: { ar: 'اكتب إعلان تخفيضات: فقرة فيها كلمة بأهمية قوية، وسعر قديم محذوف وسعر جديد مضاف، وملاحظة صغيرة.',
                   en: 'Write a sale announcement: a paragraph with a strongly important word, an old deleted price and a new inserted price, and a small note.' },
          starter: { ar: '<p></p>\n', en: '<p></p>\n' },
          solution: { ar: '<p>عرض <strong>لفترة محدودة</strong>!</p>\n<p>السعر <del>300</del> <ins>199</ins> ريال <small>لأول 50 طلباً</small>.</p>',
                      en: '<p>A <strong>limited time</strong> offer!</p>\n<p>Price <del>300</del> <ins>199</ins> <small>for the first 50 orders</small>.</p>' },
          checks: [
            { label: { ar: 'يوجد <strong> فيه نص', en: 'A <strong> with text' },
              hint:  { ar: 'غلّف الكلمة المهمة بـ <strong>', en: 'Wrap the important word in <strong>' },
              test: function (d) { return filled(d, 'strong'); } },
            { label: { ar: 'يوجد سعر محذوف <del>', en: 'A deleted price <del>' },
              hint:  { ar: 'استخدم <del>300</del>', en: 'Use <del>300</del>' },
              test: function (d) { return filled(d, 'del'); } },
            { label: { ar: 'يوجد سعر جديد <ins>', en: 'A new price <ins>' },
              hint:  { ar: 'استخدم <ins>199</ins>', en: 'Use <ins>199</ins>' },
              test: function (d) { return filled(d, 'ins'); } },
            { label: { ar: 'توجد ملاحظة <small>', en: 'A <small> note' },
              hint:  { ar: 'أضف <small>ملاحظة</small>', en: 'Add <small>a note</small>' },
              test: function (d) { return filled(d, 'small'); } }
          ]
        },
        quiz: [
          { q: { ar: 'أي وسم يعطي معنى «أهمية قوية» لا مجرد شكل عريض؟', en: 'Which tag conveys strong importance, not just bold looks?' },
            options: [ { ar: '<b>', en: '<b>' }, { ar: '<strong>', en: '<strong>' }, { ar: '<big>', en: '<big>' }, { ar: '<bold>', en: '<bold>' } ],
            answer: 1,
            why: { ar: '<strong> دلالي ويؤثر على قارئات الشاشة، بينما <b> شكلي فقط.',
                   en: '<strong> is semantic and affects screen readers, while <b> is purely visual.' } },
          { q: { ar: 'ماذا يفعل المتصفح بالمسافات الزائدة داخل الفقرة؟', en: 'What does the browser do with extra spaces inside a paragraph?' },
            options: [ { ar: 'يعرضها كما هي', en: 'Shows them as written' }, { ar: 'يدمجها في مسافة واحدة', en: 'Collapses them into one space' },
                       { ar: 'يحذف الفقرة', en: 'Deletes the paragraph' }, { ar: 'يعطي خطأ', en: 'Throws an error' } ],
            answer: 1,
            why: { ar: 'لذلك نستخدم <br> عند الحاجة لسطر جديد فعلي.',
                   en: 'That is why we use <br> when a real new line is needed.' } },
          { q: { ar: 'أي وسم يُستخدم للنص المرتفع مثل التربيع؟', en: 'Which tag is used for superscript, like a square symbol?' },
            options: [ { ar: '<sub>', en: '<sub>' }, { ar: '<sup>', en: '<sup>' }, { ar: '<up>', en: '<up>' }, { ar: '<top>', en: '<top>' } ],
            answer: 1,
            why: { ar: '<sup> للمرتفع و<sub> للمنخفض.', en: '<sup> raises text, <sub> lowers it.' } }
        ]
      },

      {
        id: 'quotes-code',
        minutes: 6, level: 'beginner',
        tags: ['blockquote', 'code', 'pre'],
        title: { ar: 'الاقتباسات وعرض الكود', en: 'Quotations and showing code' },
        lede: { ar: 'كيف تنقل كلام غيرك بأمانة، وكيف تعرض كوداً دون أن يفسّره المتصفح.',
                en: 'How to quote others properly, and how to display code without the browser executing it.' },
        body: {
          ar: '<h2>الاقتباس الطويل والقصير</h2>' +
              '<ul>' +
              '<li><code>&lt;blockquote&gt;</code> — اقتباس كتلة كاملة، يظهر مزاحاً للداخل. تُضاف له سمة <code>cite</code> برابط المصدر.</li>' +
              '<li><code>&lt;q&gt;</code> — اقتباس قصير داخل جملة، والمتصفح يضيف علامتي التنصيص تلقائياً.</li>' +
              '<li><code>&lt;cite&gt;</code> — اسم العمل المقتبس منه (كتاب، فيلم، بحث).</li>' +
              '</ul>' +
              '<h2>عرض الكود</h2>' +
              '<ul>' +
              '<li><code>&lt;code&gt;</code> — قطعة كود قصيرة داخل السطر، تظهر بخط ثابت العرض.</li>' +
              '<li><code>&lt;pre&gt;</code> — نص محفوظ التنسيق: يحترم المسافات والأسطر كما كتبتها تماماً.</li>' +
              '<li>الجمع بينهما <code>&lt;pre&gt;&lt;code&gt;…&lt;/code&gt;&lt;/pre&gt;</code> هو الطريقة القياسية لعرض كتلة كود.</li>' +
              '<li><code>&lt;kbd&gt;</code> — أزرار لوحة المفاتيح، و<code>&lt;samp&gt;</code> — مخرجات البرنامج.</li>' +
              '</ul>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>مشكلة الأقواس الزاوية</b>إذا كتبت <code>&lt;p&gt;</code> داخل <code>&lt;code&gt;</code> فسيفسّرها المتصفح كوسم حقيقي! الحل: استبدل <code>&lt;</code> بـ <code>&amp;lt;</code> و<code>&gt;</code> بـ <code>&amp;gt;</code> — وهذا موضوع الدرس التالي.</div></div>',
          en: '<h2>Long and short quotations</h2>' +
              '<ul>' +
              '<li><code>&lt;blockquote&gt;</code> — a whole quoted block, indented by default. Add a <code>cite</code> attribute with the source URL.</li>' +
              '<li><code>&lt;q&gt;</code> — a short inline quote; the browser adds the quotation marks for you.</li>' +
              '<li><code>&lt;cite&gt;</code> — the title of the quoted work (book, film, paper).</li>' +
              '</ul>' +
              '<h2>Showing code</h2>' +
              '<ul>' +
              '<li><code>&lt;code&gt;</code> — a short inline code snippet, shown in a monospace font.</li>' +
              '<li><code>&lt;pre&gt;</code> — preformatted text: it respects your spaces and line breaks exactly.</li>' +
              '<li>Combining them, <code>&lt;pre&gt;&lt;code&gt;…&lt;/code&gt;&lt;/pre&gt;</code>, is the standard way to show a code block.</li>' +
              '<li><code>&lt;kbd&gt;</code> — keyboard keys, and <code>&lt;samp&gt;</code> — program output.</li>' +
              '</ul>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>The angle bracket problem</b>If you type <code>&lt;p&gt;</code> inside <code>&lt;code&gt;</code> the browser treats it as a real tag! The fix: replace <code>&lt;</code> with <code>&amp;lt;</code> and <code>&gt;</code> with <code>&amp;gt;</code> — the subject of the next lesson.</div></div>'
        },
        example: {
          note: { ar: 'لاحظ كيف يحافظ pre على الإزاحة بينما تدمجها الفقرة.',
                  en: 'Notice how pre keeps the indentation while a paragraph collapses it.' },
          code: {
            ar: '<blockquote cite="https://example.com">\n  العلم في الصغر كالنقش على الحجر.\n</blockquote>\n<p>يقول المثل <q>الوقت من ذهب</q> ويُنسب لكتاب <cite>الحكم</cite>.</p>\n<p>لتشغيل الملف اضغط <kbd>Ctrl</kbd> + <kbd>S</kbd> ثم افتحه.</p>\n<pre><code>مرحبا\n    سطر مُزاح\n        أكثر إزاحة</code></pre>',
            en: '<blockquote cite="https://example.com">\n  Learning in youth is like carving in stone.\n</blockquote>\n<p>The saying goes <q>time is gold</q>, from the book <cite>Proverbs</cite>.</p>\n<p>To save the file press <kbd>Ctrl</kbd> + <kbd>S</kbd> then open it.</p>\n<pre><code>hello\n    indented line\n        deeper indent</code></pre>'
          }
        },
        challenge: {
          brief: { ar: 'اعرض حكمة تعجبك: اقتباس كتلة blockquote، وفقرة فيها اقتباس قصير q، وكتلة كود بـ pre وcode.',
                   en: 'Show a saying you like: a blockquote, a paragraph with a short q quote, and a code block using pre with code.' },
          starter: { ar: '<blockquote>\n  \n</blockquote>', en: '<blockquote>\n  \n</blockquote>' },
          solution: { ar: '<blockquote>من جدّ وجد.</blockquote>\n<p>وقيل أيضاً <q>الصبر مفتاح الفرج</q>.</p>\n<pre><code>سطر أول\n  سطر ثانٍ</code></pre>',
                      en: '<blockquote>Whoever strives, finds.</blockquote>\n<p>It is also said <q>patience is the key to relief</q>.</p>\n<pre><code>first line\n  second line</code></pre>' },
          checks: [
            { label: { ar: 'يوجد <blockquote> فيه نص', en: 'A <blockquote> with text' },
              hint:  { ar: 'ضع الحكمة بين <blockquote> و</blockquote>', en: 'Put the saying between <blockquote> and </blockquote>' },
              test: function (d) { return filled(d, 'blockquote'); } },
            { label: { ar: 'يوجد اقتباس قصير <q> داخل فقرة', en: 'A short <q> quote inside a paragraph' },
              hint:  { ar: 'مثال: <p>قال <q>نص</q></p>', en: 'Example: <p>He said <q>text</q></p>' },
              test: function (d) { return filled(d, 'p q'); } },
            { label: { ar: 'توجد كتلة كود <pre><code>', en: 'A <pre><code> block exists' },
              hint:  { ar: 'الترتيب: pre ثم code بداخله', en: 'Order: pre first, code inside it' },
              test: function (d) { return filled(d, 'pre code'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما الوسم الذي يحافظ على المسافات والأسطر كما كُتبت؟', en: 'Which tag preserves spaces and line breaks exactly?' },
            options: [ { ar: '<p>', en: '<p>' }, { ar: '<pre>', en: '<pre>' }, { ar: '<code>', en: '<code>' }, { ar: '<span>', en: '<span>' } ],
            answer: 1,
            why: { ar: '<pre> اختصار preformatted أي «محفوظ التنسيق».',
                   en: '<pre> stands for preformatted text.' } },
          { q: { ar: 'أي وسم يضيف علامتي التنصيص تلقائياً؟', en: 'Which tag adds quotation marks automatically?' },
            options: [ { ar: '<blockquote>', en: '<blockquote>' }, { ar: '<q>', en: '<q>' }, { ar: '<cite>', en: '<cite>' }, { ar: '<quote>', en: '<quote>' } ],
            answer: 1,
            why: { ar: '<q> للاقتباس القصير داخل السطر ويضيف التنصيص بنفسه.',
                   en: '<q> is for short inline quotes and supplies the marks itself.' } },
          { q: { ar: 'ما فائدة وسم <kbd>؟', en: 'What is <kbd> for?' },
            options: [ { ar: 'عرض مفاتيح لوحة المفاتيح', en: 'Showing keyboard keys' }, { ar: 'تكبير النص', en: 'Enlarging text' },
                       { ar: 'إضافة رابط', en: 'Adding a link' }, { ar: 'إخفاء النص', en: 'Hiding text' } ],
            answer: 0,
            why: { ar: 'يُستخدم لتمثيل ما يضغطه المستخدم مثل Ctrl + S.',
                   en: 'It represents what the user presses, such as Ctrl + S.' } }
        ]
      },

      {
        id: 'entities',
        minutes: 5, level: 'beginner',
        tags: ['entities', 'رموز', 'symbols'],
        title: { ar: 'الرموز والمحارف الخاصة', en: 'Entities and special characters' },
        lede: { ar: 'كيف تكتب < و> و& داخل الصفحة دون أن يظنها المتصفح كوداً.',
                en: 'How to type <, > and & on a page without the browser mistaking them for code.' },
        body: {
          ar: '<h2>المشكلة</h2>' +
              '<p>ثلاثة محارف لها معنى خاص في HTML: <strong>&lt;</strong> تبدأ وسماً، و<strong>&gt;</strong> تنهيه، و<strong>&amp;</strong> تبدأ رمزاً. إذا كتبتها كما هي فقد يختفي جزء من نصك.</p>' +
              '<h2>الحل: الكيانات (Entities)</h2>' +
              '<p>كل كيان يبدأ بـ <code>&amp;</code> وينتهي بـ <code>;</code>:</p>' +
              '<table>' +
              '<tr><th>تريد كتابة</th><th>اكتب</th></tr>' +
              '<tr><td>&lt;</td><td><code>&amp;lt;</code></td></tr>' +
              '<tr><td>&gt;</td><td><code>&amp;gt;</code></td></tr>' +
              '<tr><td>&amp;</td><td><code>&amp;amp;</code></td></tr>' +
              '<tr><td>مسافة غير قابلة للكسر</td><td><code>&amp;nbsp;</code></td></tr>' +
              '<tr><td>&copy;</td><td><code>&amp;copy;</code></td></tr>' +
              '<tr><td>&hellip;</td><td><code>&amp;hellip;</code></td></tr>' +
              '</table>' +
              '<h2>متى تحتاجها فعلاً؟</h2>' +
              '<ul>' +
              '<li>عند شرح HTML داخل صفحة HTML (كما في هذا الدرس بالضبط).</li>' +
              '<li>عند كتابة رموز غير موجودة على لوحة المفاتيح.</li>' +
              '<li>عند منع كسر السطر بين كلمتين مرتبطتين باستخدام <code>&amp;nbsp;</code>.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">😀</span><div><b>والإيموجي؟</b>مع <code>&lt;meta charset="utf-8"&gt;</code> تستطيع لصق الإيموجي والحروف العربية مباشرة بلا أي كيانات. الكيانات ضرورية فقط للمحارف الثلاثة الخاصة.</div></div>',
          en: '<h2>The problem</h2>' +
              '<p>Three characters carry special meaning in HTML: <strong>&lt;</strong> opens a tag, <strong>&gt;</strong> ends it, and <strong>&amp;</strong> starts an entity. Typing them literally can make part of your text vanish.</p>' +
              '<h2>The fix: entities</h2>' +
              '<p>Every entity starts with <code>&amp;</code> and ends with <code>;</code>:</p>' +
              '<table>' +
              '<tr><th>You want</th><th>You write</th></tr>' +
              '<tr><td>&lt;</td><td><code>&amp;lt;</code></td></tr>' +
              '<tr><td>&gt;</td><td><code>&amp;gt;</code></td></tr>' +
              '<tr><td>&amp;</td><td><code>&amp;amp;</code></td></tr>' +
              '<tr><td>non-breaking space</td><td><code>&amp;nbsp;</code></td></tr>' +
              '<tr><td>&copy;</td><td><code>&amp;copy;</code></td></tr>' +
              '<tr><td>&hellip;</td><td><code>&amp;hellip;</code></td></tr>' +
              '</table>' +
              '<h2>When do you actually need them?</h2>' +
              '<ul>' +
              '<li>When explaining HTML inside an HTML page (exactly like this lesson).</li>' +
              '<li>When writing symbols that are not on your keyboard.</li>' +
              '<li>When preventing a line break between two tied words using <code>&amp;nbsp;</code>.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">😀</span><div><b>What about emoji?</b>With <code>&lt;meta charset="utf-8"&gt;</code> you can paste emoji and Arabic letters directly, no entities needed. Entities are only required for the three special characters.</div></div>'
        },
        example: {
          note: { ar: 'احذف &lt; من السطر الأول وشاهد كيف يختفي جزء من النص.',
                  en: 'Delete the &lt; on the first line and watch part of the text disappear.' },
          code: {
            ar: '<p>لكتابة فقرة نستخدم الوسم &lt;p&gt; ثم نغلقه بـ &lt;/p&gt;</p>\n<p>الشركة &amp; شركاؤها &copy; 2026</p>\n<p>السعر&nbsp;100&nbsp;ريال (لا ينكسر السطر بينهما)</p>',
            en: '<p>To write a paragraph we use the &lt;p&gt; tag and close it with &lt;/p&gt;</p>\n<p>The company &amp; partners &copy; 2026</p>\n<p>Price&nbsp;100&nbsp;SAR (no line break between them)</p>'
          }
        },
        challenge: {
          brief: { ar: 'اشرح لصديقك وسم الفقرة: اكتب فقرة تعرض النص &lt;p&gt; حرفياً على الشاشة، وفقرة أخرى فيها رمز الحقوق ©.',
                   en: 'Explain the paragraph tag to a friend: write a paragraph that literally displays &lt;p&gt; on screen, and another containing the © symbol.' },
          starter: { ar: '<p></p>\n', en: '<p></p>\n' },
          solution: { ar: '<p>الوسم &lt;p&gt; يُستخدم للفقرات.</p>\n<p>جميع الحقوق محفوظة &copy; 2026</p>',
                      en: '<p>The &lt;p&gt; tag is used for paragraphs.</p>\n<p>All rights reserved &copy; 2026</p>' },
          checks: [
            { label: { ar: 'استخدمت &lt; أو &gt; ككيان', en: 'You used &lt; or &gt; as an entity' },
              hint:  { ar: 'اكتب &lt;p&gt; بدل <p> مباشرة', en: 'Write &lt;p&gt; instead of a literal <p>' },
              test: function (d, raw) { return /&lt;|&gt;/.test(raw); } },
            { label: { ar: 'يظهر النص <p> حرفياً في النتيجة', en: 'The text <p> shows literally in the result' },
              hint:  { ar: 'تأكد أن الكيان داخل فقرة نصية', en: 'Make sure the entity sits inside a paragraph' },
              test: function (d) { var t = txt(d.body); return t.indexOf('<p') !== -1 || t.indexOf('<P') !== -1; } },
            { label: { ar: 'يوجد رمز الحقوق ©', en: 'The © symbol is present' },
              hint:  { ar: 'استخدم &copy;', en: 'Use &copy;' },
              test: function (d) { return txt(d.body).indexOf('©') !== -1; } }
          ]
        },
        quiz: [
          { q: { ar: 'كيف تكتب علامة أصغر من (<) داخل نص الصفحة؟', en: 'How do you write a less-than sign (<) in page text?' },
            options: [ { ar: '&lt;', en: '&lt;' }, { ar: '&less;', en: '&less;' }, { ar: '\\<', en: '\\<' }, { ar: '[<]', en: '[<]' } ],
            answer: 0,
            why: { ar: 'الكيان &lt; هو البديل الآمن لأنها تبدأ الوسوم.',
                   en: 'The &lt; entity is the safe substitute since the raw character starts tags.' } },
          { q: { ar: 'بم ينتهي كل كيان في HTML؟', en: 'How does every HTML entity end?' },
            options: [ { ar: 'بنقطة .', en: 'With a dot .' }, { ar: 'بفاصلة منقوطة ;', en: 'With a semicolon ;' },
                       { ar: 'بمسافة', en: 'With a space' }, { ar: 'بشرطة -', en: 'With a dash -' } ],
            answer: 1,
            why: { ar: 'الصيغة: يبدأ بـ & وينتهي بـ ; مثل &copy;',
                   en: 'The form is: starts with & and ends with ; such as &copy;' } },
          { q: { ar: 'هل تحتاج كيانات لكتابة الحروف العربية؟', en: 'Do you need entities to write Arabic letters?' },
            options: [ { ar: 'نعم لكل حرف', en: 'Yes, for every letter' },
                       { ar: 'لا، يكفي charset="utf-8"', en: 'No, charset="utf-8" is enough' },
                       { ar: 'نعم للحروف المنقوطة فقط', en: 'Yes, only for dotted letters' },
                       { ar: 'لا يمكن كتابة العربية أصلاً', en: 'Arabic cannot be written at all' } ],
            answer: 1,
            why: { ar: 'ترميز utf-8 يدعم العربية وكل اللغات مباشرة.',
                   en: 'The utf-8 encoding supports Arabic and every language directly.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 3 — الروابط والصور / Module 3 — Links & images
     =========================================================== */
  MODULES.push({
    id: 'links-media',
    icon: '🔗',
    title: { ar: 'الروابط والصور', en: 'Links and images' },
    desc:  { ar: 'ما يجعل الويب «ويباً»: روابط تنقلك، وصور تشرح أكثر من ألف كلمة.',
             en: 'What makes the web a web: links that carry you, and images worth a thousand words.' },
    lessons: [

      {
        id: 'links',
        minutes: 8, level: 'beginner',
        tags: ['a', 'href', 'روابط'],
        title: { ar: 'الروابط: وسم a', en: 'Links: the a tag' },
        lede: { ar: 'الوسم الذي بُني عليه الإنترنت كله — كيف تربط صفحاتك ببعضها وبالعالم.',
                en: 'The tag the whole internet is built on — how to connect your pages to each other and to the world.' },
        body: {
          ar: '<h2>الصيغة الأساسية</h2>' +
              '<p><code>&lt;a href="الوجهة"&gt;النص الظاهر&lt;/a&gt;</code></p>' +
              '<p>السمة <code>href</code> اختصار hypertext reference، وهي وجهة الرابط. النص بين الوسمين هو ما يراه ويضغطه المستخدم.</p>' +
              '<h2>أنواع الوجهات</h2>' +
              '<ul>' +
              '<li><strong>رابط خارجي</strong>: <code>href="https://example.com"</code> — يبدأ بالبروتوكول كاملاً.</li>' +
              '<li><strong>صفحة في موقعك</strong>: <code>href="about.html"</code> — مسار نسبي داخل نفس المجلد.</li>' +
              '<li><strong>مرساة داخل الصفحة</strong>: <code>href="#contact"</code> — ينتقل لعنصر يحمل <code>id="contact"</code>.</li>' +
              '<li><strong>بريد</strong>: <code>href="mailto:me@site.com"</code>.</li>' +
              '<li><strong>هاتف</strong>: <code>href="tel:+966500000000"</code> — يفتح الاتصال على الجوال.</li>' +
              '</ul>' +
              '<h2>فتح في تبويب جديد</h2>' +
              '<p><code>target="_blank"</code> تفتح الرابط في تبويب جديد. أضف معها دائماً <code>rel="noopener"</code> لأسباب أمنية.</p>' +
              '<div class="callout callout-tip"><span class="ic">♿</span><div><b>نص الرابط مهم</b>اكتب نصاً يصف الوجهة: «حمّل دليل المستخدم» أفضل بكثير من «اضغط هنا». المكفوفون يتصفحون قائمة الروابط وحدها، و«اضغط هنا» لا تعني لهم شيئاً.</div></div>',
          en: '<h2>The basic form</h2>' +
              '<p><code>&lt;a href="destination"&gt;visible text&lt;/a&gt;</code></p>' +
              '<p>The <code>href</code> attribute (hypertext reference) is the destination. The text between the tags is what the user sees and clicks.</p>' +
              '<h2>Kinds of destinations</h2>' +
              '<ul>' +
              '<li><strong>External link</strong>: <code>href="https://example.com"</code> — starts with the full protocol.</li>' +
              '<li><strong>A page in your site</strong>: <code>href="about.html"</code> — a relative path in the same folder.</li>' +
              '<li><strong>An anchor in the page</strong>: <code>href="#contact"</code> — jumps to an element with <code>id="contact"</code>.</li>' +
              '<li><strong>Email</strong>: <code>href="mailto:me@site.com"</code>.</li>' +
              '<li><strong>Phone</strong>: <code>href="tel:+966500000000"</code> — starts a call on mobile.</li>' +
              '</ul>' +
              '<h2>Opening a new tab</h2>' +
              '<p><code>target="_blank"</code> opens the link in a new tab. Always pair it with <code>rel="noopener"</code> for security.</p>' +
              '<div class="callout callout-tip"><span class="ic">♿</span><div><b>Link text matters</b>Write text that describes the destination: "Download the user guide" beats "click here". Blind users browse a list of links on its own, and "click here" tells them nothing.</div></div>'
        },
        example: {
          note: { ar: 'الرابط الأخير ينقلك داخل الصفحة نفسها إلى العنصر ذي المعرّف end.',
                  en: 'The last link jumps within the same page to the element with id end.' },
          code: {
            ar: '<p><a href="https://developer.mozilla.org" target="_blank" rel="noopener">توثيق MDN (تبويب جديد)</a></p>\n<p><a href="mailto:hi@example.com">راسلني بالبريد</a></p>\n<p><a href="tel:+966500000000">اتصل بنا</a></p>\n<p><a href="#end">انتقل لنهاية الصفحة</a></p>\n<p style="height:120px"></p>\n<h3 id="end">وصلت! 🎉</h3>',
            en: '<p><a href="https://developer.mozilla.org" target="_blank" rel="noopener">MDN docs (new tab)</a></p>\n<p><a href="mailto:hi@example.com">Email me</a></p>\n<p><a href="tel:+966500000000">Call us</a></p>\n<p><a href="#end">Jump to the end</a></p>\n<p style="height:120px"></p>\n<h3 id="end">You arrived! 🎉</h3>'
          }
        },
        challenge: {
          brief: { ar: 'اصنع قائمة تواصل: رابط لموقع خارجي يفتح في تبويب جديد، ورابط بريد إلكتروني، ورابط داخلي إلى عنصر يحمل id في نفس الصفحة.',
                   en: 'Build a contact list: an external link opening in a new tab, an email link, and an in-page link to an element with an id.' },
          starter: { ar: '<p><a href=""></a></p>\n', en: '<p><a href=""></a></p>\n' },
          solution: { ar: '<p><a href="https://example.com" target="_blank" rel="noopener">موقعي</a></p>\n<p><a href="mailto:me@example.com">بريدي</a></p>\n<p><a href="#bio">نبذة عني</a></p>\n<h3 id="bio">نبذة عني</h3>',
                      en: '<p><a href="https://example.com" target="_blank" rel="noopener">My site</a></p>\n<p><a href="mailto:me@example.com">My email</a></p>\n<p><a href="#bio">About me</a></p>\n<h3 id="bio">About me</h3>' },
          checks: [
            { label: { ar: 'يوجد رابط خارجي يبدأ بـ http', en: 'An external link starting with http' },
              hint:  { ar: 'مثال: href="https://example.com"', en: 'Example: href="https://example.com"' },
              test: function (d) { return has(d, 'a[href^="http"]'); } },
            { label: { ar: 'الرابط الخارجي يفتح في تبويب جديد', en: 'The external link opens in a new tab' },
              hint:  { ar: 'أضف target="_blank" ومعها rel="noopener"', en: 'Add target="_blank" with rel="noopener"' },
              test: function (d) { return has(d, 'a[href^="http"][target="_blank"]'); } },
            { label: { ar: 'يوجد رابط بريد mailto', en: 'A mailto email link exists' },
              hint:  { ar: 'href="mailto:name@site.com"', en: 'href="mailto:name@site.com"' },
              test: function (d) { return has(d, 'a[href^="mailto:"]'); } },
            { label: { ar: 'يوجد رابط داخلي #id مع عنصر يحمل نفس الـ id', en: 'An in-page #id link with a matching element' },
              hint:  { ar: 'اربط href="#bio" بعنصر <h3 id="bio">', en: 'Link href="#bio" to an element <h3 id="bio">' },
              test: function (d) {
                var a = d.querySelector('a[href^="#"]');
                if (!a) return false;
                var id = a.getAttribute('href').slice(1);
                return id.length > 0 && !!d.getElementById(id);
              } },
            { label: { ar: 'نص الروابط واضح وليس فارغاً', en: 'Link text is meaningful and not empty' },
              hint:  { ar: 'اكتب وصفاً بدل «اضغط هنا»', en: 'Describe the destination instead of "click here"' },
              test: function (d) {
                var links = d.querySelectorAll('a');
                if (!links.length) return false;
                for (var i = 0; i < links.length; i++) { if (txt(links[i]).length < 2) return false; }
                return true;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'ما السمة التي تحدّد وجهة الرابط؟', en: 'Which attribute sets a link destination?' },
            options: [ { ar: 'src', en: 'src' }, { ar: 'href', en: 'href' }, { ar: 'link', en: 'link' }, { ar: 'url', en: 'url' } ],
            answer: 1,
            why: { ar: 'href للروابط، وsrc للصور والوسائط.', en: 'href is for links; src is for images and media.' } },
          { q: { ar: 'كيف تنتقل إلى قسم داخل الصفحة نفسها؟', en: 'How do you jump to a section within the same page?' },
            options: [ { ar: 'href="#id-القسم"', en: 'href="#section-id"' }, { ar: 'href="page.html"', en: 'href="page.html"' },
                       { ar: 'href="jump:القسم"', en: 'href="jump:section"' }, { ar: 'target="section"', en: 'target="section"' } ],
            answer: 0,
            why: { ar: 'الرمز # يشير إلى عنصر يحمل نفس الـ id في الصفحة.',
                   en: 'The # symbol points to an element carrying that id in the page.' } },
          { q: { ar: 'ما نص الرابط الأفضل للوصولية؟', en: 'Which link text is best for accessibility?' },
            options: [ { ar: 'اضغط هنا', en: 'Click here' }, { ar: 'هنا', en: 'Here' },
                       { ar: 'حمّل دليل المستخدم PDF', en: 'Download the user guide PDF' }, { ar: 'رابط', en: 'Link' } ],
            answer: 2,
            why: { ar: 'النص الوصفي مفهوم حتى خارج سياق الجملة.',
                   en: 'Descriptive text makes sense even out of context.' } }
        ]
      },

      {
        id: 'paths',
        minutes: 6, level: 'beginner',
        tags: ['paths', 'مسارات', 'folders'],
        title: { ar: 'المسارات: كيف تجد الملفات بعضها؟', en: 'Paths: how files find each other' },
        lede: { ar: 'أشهر سبب لصورة مكسورة أو رابط لا يعمل هو مسار خاطئ. عشر دقائق تنهي المشكلة للأبد.',
                en: 'The most common cause of a broken image or dead link is a wrong path. Ten minutes ends the problem forever.' },
        body: {
          ar: '<h2>مسار مطلق ومسار نسبي</h2>' +
              '<ul>' +
              '<li><strong>مطلق</strong>: عنوان كامل يبدأ بـ <code>https://</code> — يعمل من أي مكان، ويُستخدم للمواقع الخارجية.</li>' +
              '<li><strong>نسبي</strong>: مسار يُحسب من موقع الملف الحالي — وهو ما تستخدمه داخل موقعك.</li>' +
              '</ul>' +
              '<h2>قواعد المسار النسبي</h2>' +
              '<table>' +
              '<tr><th>الصيغة</th><th>المعنى</th></tr>' +
              '<tr><td><code>about.html</code></td><td>ملف بجانبي في نفس المجلد</td></tr>' +
              '<tr><td><code>images/cat.jpg</code></td><td>ادخل مجلد images ثم خذ الملف</td></tr>' +
              '<tr><td><code>../index.html</code></td><td>اصعد مجلداً واحداً للأعلى</td></tr>' +
              '<tr><td><code>../../style.css</code></td><td>اصعد مجلدين</td></tr>' +
              '<tr><td><code>/images/cat.jpg</code></td><td>ابدأ من جذر الموقع</td></tr>' +
              '</table>' +
              '<h2>تنظيم مشروعك</h2>' +
              '<p>البنية الشائعة والمريحة:</p>' +
              '<pre><code>my-site/\n  index.html\n  about.html\n  images/\n    logo.png\n  css/\n    style.css</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">🔤</span><div><b>حرف كبير = ملف مختلف</b>على خوادم الويب <code>Logo.png</code> ليست <code>logo.png</code>. اعتد على الحروف الصغيرة وبلا مسافات في أسماء الملفات: استخدم <code>my-photo.jpg</code> لا <code>My Photo.jpg</code>.</div></div>',
          en: '<h2>Absolute vs relative</h2>' +
              '<ul>' +
              '<li><strong>Absolute</strong>: a full address starting with <code>https://</code> — works from anywhere, used for external sites.</li>' +
              '<li><strong>Relative</strong>: a path calculated from the current file location — what you use inside your own site.</li>' +
              '</ul>' +
              '<h2>Relative path rules</h2>' +
              '<table>' +
              '<tr><th>Form</th><th>Meaning</th></tr>' +
              '<tr><td><code>about.html</code></td><td>a file next to me in the same folder</td></tr>' +
              '<tr><td><code>images/cat.jpg</code></td><td>go into the images folder, take the file</td></tr>' +
              '<tr><td><code>../index.html</code></td><td>go up one folder</td></tr>' +
              '<tr><td><code>../../style.css</code></td><td>go up two folders</td></tr>' +
              '<tr><td><code>/images/cat.jpg</code></td><td>start from the site root</td></tr>' +
              '</table>' +
              '<h2>Organising your project</h2>' +
              '<p>The common, comfortable structure:</p>' +
              '<pre><code>my-site/\n  index.html\n  about.html\n  images/\n    logo.png\n  css/\n    style.css</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">🔤</span><div><b>Capital letter = different file</b>On web servers <code>Logo.png</code> is not <code>logo.png</code>. Get used to lowercase names with no spaces: use <code>my-photo.jpg</code>, not <code>My Photo.jpg</code>.</div></div>'
        },
        example: {
          note: { ar: 'هذه روابط لمسارات وهمية — الفكرة أن تقرأ الصيغة وتفهمها.',
                  en: 'These point to imaginary paths — the point is to read and understand the form.' },
          code: {
            ar: '<h3>روابط داخل الموقع</h3>\n<ul>\n  <li><a href="about.html">صفحة بجانبي</a></li>\n  <li><a href="blog/post-1.html">داخل مجلد فرعي</a></li>\n  <li><a href="../index.html">مجلد للأعلى</a></li>\n  <li><a href="/contact.html">من جذر الموقع</a></li>\n</ul>',
            en: '<h3>Links inside the site</h3>\n<ul>\n  <li><a href="about.html">A page beside me</a></li>\n  <li><a href="blog/post-1.html">Inside a subfolder</a></li>\n  <li><a href="../index.html">One folder up</a></li>\n  <li><a href="/contact.html">From the site root</a></li>\n</ul>'
          }
        },
        challenge: {
          brief: { ar: 'اكتب قائمة تنقّل فيها أربعة روابط: واحد لملف بجانبك، وواحد داخل مجلد فرعي، وواحد يصعد مجلداً بـ ../، وواحد خارجي كامل.',
                   en: 'Write a navigation list with four links: one to a sibling file, one inside a subfolder, one going up with ../, and one full external URL.' },
          starter: { ar: '<ul>\n  <li></li>\n</ul>', en: '<ul>\n  <li></li>\n</ul>' },
          solution: { ar: '<ul>\n  <li><a href="about.html">من نحن</a></li>\n  <li><a href="blog/first.html">المدوّنة</a></li>\n  <li><a href="../index.html">الرئيسية</a></li>\n  <li><a href="https://example.com">موقع خارجي</a></li>\n</ul>',
                      en: '<ul>\n  <li><a href="about.html">About</a></li>\n  <li><a href="blog/first.html">Blog</a></li>\n  <li><a href="../index.html">Home</a></li>\n  <li><a href="https://example.com">External site</a></li>\n</ul>' },
          checks: [
            { label: { ar: 'يوجد رابط لملف .html بجانبك', en: 'A link to a sibling .html file' },
              hint:  { ar: 'مثال: href="about.html"', en: 'Example: href="about.html"' },
              test: function (d) {
                var l = d.querySelectorAll('a[href]');
                for (var i = 0; i < l.length; i++) {
                  var h = l[i].getAttribute('href');
                  if (/^[\w-]+\.html$/i.test(h)) return true;
                }
                return false;
              } },
            { label: { ar: 'يوجد رابط داخل مجلد فرعي (فيه /)', en: 'A link inside a subfolder (contains /)' },
              hint:  { ar: 'مثال: href="blog/post.html"', en: 'Example: href="blog/post.html"' },
              test: function (d) {
                var l = d.querySelectorAll('a[href]');
                for (var i = 0; i < l.length; i++) {
                  var h = l[i].getAttribute('href');
                  if (/^[\w-]+\/[\w.-]+$/i.test(h)) return true;
                }
                return false;
              } },
            { label: { ar: 'يوجد رابط يصعد مجلداً بـ ../', en: 'A link going up with ../' },
              hint:  { ar: 'مثال: href="../index.html"', en: 'Example: href="../index.html"' },
              test: function (d) {
                var l = d.querySelectorAll('a[href]');
                for (var i = 0; i < l.length; i++) { if (l[i].getAttribute('href').indexOf('../') === 0) return true; }
                return false;
              } },
            { label: { ar: 'يوجد رابط خارجي كامل', en: 'A full external link' },
              hint:  { ar: 'يبدأ بـ https://', en: 'Starts with https://' },
              test: function (d) { return has(d, 'a[href^="http"]'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ماذا يعني ../ في بداية المسار؟', en: 'What does ../ at the start of a path mean?' },
            options: [ { ar: 'ادخل مجلداً', en: 'Go into a folder' }, { ar: 'اصعد مجلداً للأعلى', en: 'Go up one folder' },
                       { ar: 'ابدأ من الجذر', en: 'Start from the root' }, { ar: 'أعد التحميل', en: 'Reload' } ],
            answer: 1,
            why: { ar: 'كل ../ تصعد مستوى واحداً في شجرة المجلدات.',
                   en: 'Each ../ climbs one level up the folder tree.' } },
          { q: { ar: 'هل يفرّق الخادم بين logo.png وLogo.png؟', en: 'Does a server distinguish logo.png from Logo.png?' },
            options: [ { ar: 'نعم، ملفان مختلفان', en: 'Yes, two different files' }, { ar: 'لا، متطابقان', en: 'No, identical' },
                       { ar: 'حسب المتصفح', en: 'Depends on the browser' }, { ar: 'حسب حجم الملف', en: 'Depends on file size' } ],
            answer: 0,
            why: { ar: 'معظم خوادم الويب حساسة لحالة الأحرف، وهذا سبب شائع للصور المكسورة.',
                   en: 'Most web servers are case sensitive — a very common cause of broken images.' } },
          { q: { ar: 'متى تستخدم المسار المطلق https://؟', en: 'When do you use an absolute https:// path?' },
            options: [ { ar: 'دائماً', en: 'Always' }, { ar: 'للربط بمواقع خارجية', en: 'To link to external sites' },
                       { ar: 'للصور فقط', en: 'For images only' }, { ar: 'أبداً', en: 'Never' } ],
            answer: 1,
            why: { ar: 'داخل موقعك المسارات النسبية أفضل لأنها تعمل محلياً وبعد النشر.',
                   en: 'Inside your own site relative paths are better: they work locally and after publishing.' } }
        ]
      },

      {
        id: 'images',
        minutes: 8, level: 'beginner',
        tags: ['img', 'alt', 'صور'],
        title: { ar: 'الصور: وسم img', en: 'Images: the img tag' },
        lede: { ar: 'كيف تضيف صورة بشكل صحيح — ولماذا سمة alt ليست اختيارية أبداً.',
                en: 'How to add an image properly — and why the alt attribute is never optional.' },
        body: {
          ar: '<h2>الصيغة</h2>' +
              '<p><code>&lt;img src="photo.jpg" alt="وصف الصورة"&gt;</code></p>' +
              '<p>عنصر فارغ بلا وسم إغلاق، وله سمتان أساسيتان:</p>' +
              '<ul>' +
              '<li><code>src</code> — مسار الصورة (نسبي أو رابط كامل).</li>' +
              '<li><code>alt</code> — نص بديل يصف الصورة.</li>' +
              '</ul>' +
              '<h2>لماذا alt مهمة جداً؟</h2>' +
              '<ul>' +
              '<li>يقرأها المكفوفون عبر قارئ الشاشة، فبدونها تصبح الصورة صمتاً.</li>' +
              '<li>تظهر مكان الصورة إذا فشل تحميلها أو ضاع مسارها.</li>' +
              '<li>تفهمها محركات البحث فتصنّف صورك.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">✍️</span><div><b>كيف تكتب alt جيدة؟</b>صف <em>المعنى</em> لا الشكل: «طالبة تكتب على السبورة» أفضل من «صورة». وإن كانت الصورة زخرفية بحتة فاتركها فارغة <code>alt=""</code> ليتجاهلها قارئ الشاشة.</div></div>' +
              '<h2>الأبعاد والأداء</h2>' +
              '<ul>' +
              '<li>أضف <code>width</code> و<code>height</code> بالأرقام: يحجز المتصفح المساحة فلا تقفز الصفحة أثناء التحميل.</li>' +
              '<li><code>loading="lazy"</code> يؤجّل تحميل الصور البعيدة عن الشاشة فتصبح صفحتك أسرع.</li>' +
              '</ul>' +
              '<h2>صيغ الصور</h2>' +
              '<ul>' +
              '<li><strong>JPG</strong> — للصور الفوتوغرافية.</li>' +
              '<li><strong>PNG</strong> — للشعارات والشفافية.</li>' +
              '<li><strong>SVG</strong> — رسوم متجهة تكبر بلا تشويش.</li>' +
              '<li><strong>WebP</strong> — جودة عالية وحجم أصغر، مدعومة في كل المتصفحات الحديثة.</li>' +
              '</ul>',
          en: '<h2>The form</h2>' +
              '<p><code>&lt;img src="photo.jpg" alt="image description"&gt;</code></p>' +
              '<p>A void element with no closing tag and two essential attributes:</p>' +
              '<ul>' +
              '<li><code>src</code> — the image path (relative or a full URL).</li>' +
              '<li><code>alt</code> — alternative text describing the image.</li>' +
              '</ul>' +
              '<h2>Why is alt so important?</h2>' +
              '<ul>' +
              '<li>Blind users hear it through a screen reader; without it the image is silence.</li>' +
              '<li>It appears in place of the image if loading fails or the path breaks.</li>' +
              '<li>Search engines read it to index your images.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">✍️</span><div><b>How to write good alt text</b>Describe the <em>meaning</em>, not the appearance: "a student writing on a whiteboard" beats "an image". If the image is purely decorative, leave it empty as <code>alt=""</code> so screen readers skip it.</div></div>' +
              '<h2>Dimensions and performance</h2>' +
              '<ul>' +
              '<li>Add numeric <code>width</code> and <code>height</code>: the browser reserves the space so the page does not jump while loading.</li>' +
              '<li><code>loading="lazy"</code> defers off-screen images and makes your page faster.</li>' +
              '</ul>' +
              '<h2>Image formats</h2>' +
              '<ul>' +
              '<li><strong>JPG</strong> — photographs.</li>' +
              '<li><strong>PNG</strong> — logos and transparency.</li>' +
              '<li><strong>SVG</strong> — vector graphics that scale without blur.</li>' +
              '<li><strong>WebP</strong> — high quality at smaller size, supported by every modern browser.</li>' +
              '</ul>'
        },
        example: {
          note: { ar: 'الصورة الثانية مسارها خاطئ عمداً — لاحظ ظهور نص alt مكانها.',
                  en: 'The second image has a deliberately broken path — notice the alt text showing in its place.' },
          code: {
            ar: '<img src="https://picsum.photos/id/1015/420/260" alt="نهر بين الجبال" width="420" height="260">\n<p>صورة تعمل ✅</p>\n\n<img src="missing-file.jpg" alt="هذا هو النص البديل الذي يظهر عند فشل التحميل" width="420">\n<p>صورة مكسورة ❌</p>',
            en: '<img src="https://picsum.photos/id/1015/420/260" alt="A river between mountains" width="420" height="260">\n<p>Working image ✅</p>\n\n<img src="missing-file.jpg" alt="This is the alternative text shown when loading fails" width="420">\n<p>Broken image ❌</p>'
          }
        },
        challenge: {
          brief: { ar: 'أضف صورتين: الأولى صورة حقيقية لها alt وصفي وwidth، والثانية صورة زخرفية بـ alt فارغ. ثم اجعل الأولى رابطاً يفتح موقعاً خارجياً.',
                   en: 'Add two images: a real one with descriptive alt and a width, and a decorative one with an empty alt. Then wrap the first in a link to an external site.' },
          starter: { ar: '<img src="https://picsum.photos/300/200" alt="">\n', en: '<img src="https://picsum.photos/300/200" alt="">\n' },
          solution: { ar: '<a href="https://example.com"><img src="https://picsum.photos/300/200" alt="منظر طبيعي لغابة" width="300"></a>\n<img src="https://picsum.photos/60/60" alt="">',
                      en: '<a href="https://example.com"><img src="https://picsum.photos/300/200" alt="A forest landscape" width="300"></a>\n<img src="https://picsum.photos/60/60" alt="">' },
          checks: [
            { label: { ar: 'توجد صورتان على الأقل', en: 'At least two images' },
              hint:  { ar: 'أضف وسمي <img> منفصلين', en: 'Add two separate <img> tags' },
              test: function (d) { return n(d, 'img') >= 2; } },
            { label: { ar: 'الصورة الأولى لها alt وصفي (3 أحرف فأكثر)', en: 'The first image has descriptive alt (3+ characters)' },
              hint:  { ar: 'مثال: alt="منظر طبيعي لغابة"', en: 'Example: alt="A forest landscape"' },
              test: function (d) {
                var im = d.querySelectorAll('img');
                for (var i = 0; i < im.length; i++) {
                  var a = im[i].getAttribute('alt');
                  if (a && a.trim().length >= 3) return true;
                }
                return false;
              } },
            { label: { ar: 'توجد صورة زخرفية بـ alt="" فارغة', en: 'A decorative image with an empty alt=""' },
              hint:  { ar: 'اكتب alt="" بالضبط بلا نص', en: 'Write alt="" exactly, with no text' },
              test: function (d) {
                var im = d.querySelectorAll('img');
                for (var i = 0; i < im.length; i++) {
                  var a = im[i].getAttribute('alt');
                  if (a !== null && a.trim() === '') return true;
                }
                return false;
              } },
            { label: { ar: 'كل الصور تحمل السمة alt', en: 'Every image carries an alt attribute' },
              hint:  { ar: 'لا تترك أي <img> بلا alt', en: 'Never leave an <img> without alt' },
              test: function (d) {
                var im = d.querySelectorAll('img');
                if (!im.length) return false;
                for (var i = 0; i < im.length; i++) { if (im[i].getAttribute('alt') === null) return false; }
                return true;
              } },
            { label: { ar: 'إحدى الصور داخل رابط <a>', en: 'One image is wrapped in an <a> link' },
              hint:  { ar: 'غلّف <img> بـ <a href="…">…</a>', en: 'Wrap <img> in <a href="…">…</a>' },
              test: function (d) { return has(d, 'a img'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما السمة التي تحدّد مسار الصورة؟', en: 'Which attribute sets the image path?' },
            options: [ { ar: 'href', en: 'href' }, { ar: 'src', en: 'src' }, { ar: 'link', en: 'link' }, { ar: 'path', en: 'path' } ],
            answer: 1,
            why: { ar: 'src للمصدر، وhref للروابط.', en: 'src is the source; href is for links.' } },
          { q: { ar: 'متى تُترك alt فارغة alt=""؟', en: 'When should alt be left empty as alt=""?' },
            options: [ { ar: 'دائماً لتوفير الوقت', en: 'Always, to save time' },
                       { ar: 'عندما تكون الصورة زخرفية بلا معنى', en: 'When the image is purely decorative' },
                       { ar: 'عندما تكون الصورة مهمة', en: 'When the image is important' },
                       { ar: 'لا يجوز تركها فارغة أبداً', en: 'It may never be empty' } ],
            answer: 1,
            why: { ar: 'alt الفارغة تخبر قارئ الشاشة بتجاهل الصورة، أما حذف السمة فيجعله يقرأ اسم الملف.',
                   en: 'An empty alt tells screen readers to skip it; omitting the attribute makes them read the file name.' } },
          { q: { ar: 'ما فائدة loading="lazy"؟', en: 'What does loading="lazy" do?' },
            options: [ { ar: 'يقلّل جودة الصورة', en: 'Lowers image quality' },
                       { ar: 'يؤجّل تحميل الصور خارج الشاشة', en: 'Defers loading of off-screen images' },
                       { ar: 'يخفي الصورة', en: 'Hides the image' },
                       { ar: 'يكبّر الصورة', en: 'Enlarges the image' } ],
            answer: 1,
            why: { ar: 'يحسّن سرعة الصفحة بتأجيل ما لا يراه المستخدم بعد.',
                   en: 'It speeds up the page by deferring what the user cannot see yet.' } }
        ]
      },

      {
        id: 'figure-media',
        minutes: 6, level: 'intermediate',
        tags: ['figure', 'figcaption', 'picture'],
        title: { ar: 'الصور بشرح: figure وfigcaption', en: 'Captioned images: figure and figcaption' },
        lede: { ar: 'اربط الصورة بشرحها ربطاً دلالياً، وتعرّف على الصور المتجاوبة.',
                en: 'Bind an image to its caption semantically, and meet responsive images.' },
        body: {
          ar: '<h2>لماذا figure؟</h2>' +
              '<p>عندما تحتاج الصورة تعليقاً مكتوباً، ضعهما معاً داخل <code>&lt;figure&gt;</code> وضع التعليق في <code>&lt;figcaption&gt;</code>. بذلك يعرف المتصفح وقارئ الشاشة أن هذا النص يخص هذه الصورة تحديداً، لا فقرة عابرة بجوارها.</p>' +
              '<p>و<code>&lt;figure&gt;</code> ليست للصور فقط: تصلح للجداول والرسوم وكتل الكود التي تحتاج عنواناً.</p>' +
              '<h2>الصور المتجاوبة</h2>' +
              '<ul>' +
              '<li><code>srcset</code> — تعطي المتصفح عدة أحجام للصورة نفسها فيختار الأنسب لشاشة المستخدم.</li>' +
              '<li><code>&lt;picture&gt;</code> — تتيح صوراً مختلفة كلياً حسب عرض الشاشة، أو صيغاً بديلة مثل WebP مع بديل JPG.</li>' +
              '</ul>' +
              '<div class="callout callout-note"><span class="ic">📱</span><div><b>لماذا نهتم؟</b>إرسال صورة بعرض 3000 بكسل لجوال صغير يهدر بيانات المستخدم ويبطئ موقعك. الصور المتجاوبة ترسل لكل جهاز ما يناسبه.</div></div>',
          en: '<h2>Why figure?</h2>' +
              '<p>When an image needs a written caption, put both inside <code>&lt;figure&gt;</code> and place the caption in <code>&lt;figcaption&gt;</code>. The browser and screen reader then know this text belongs to that specific image, not a stray paragraph beside it.</p>' +
              '<p>And <code>&lt;figure&gt;</code> is not only for images: it suits tables, charts and code blocks that need a caption.</p>' +
              '<h2>Responsive images</h2>' +
              '<ul>' +
              '<li><code>srcset</code> — offers the browser several sizes of the same image so it picks what fits the screen.</li>' +
              '<li><code>&lt;picture&gt;</code> — allows entirely different images per screen width, or alternative formats such as WebP with a JPG fallback.</li>' +
              '</ul>' +
              '<div class="callout callout-note"><span class="ic">📱</span><div><b>Why care?</b>Sending a 3000px wide image to a small phone wastes the user data and slows your site. Responsive images send each device what suits it.</div></div>'
        },
        example: {
          note: { ar: 'التعليق مرتبط بالصورة دلالياً وليس مجرد فقرة أسفلها.',
                  en: 'The caption is semantically tied to the image, not just a paragraph beneath it.' },
          code: {
            ar: '<figure>\n  <img src="https://picsum.photos/id/1024/420/260" alt="دبّ بنيّ في الغابة" width="420">\n  <figcaption>الشكل 1: دبّ بنيّ صُوّر في كندا عام 2024.</figcaption>\n</figure>\n\n<figure>\n  <blockquote>الكتاب خير جليس.</blockquote>\n  <figcaption>مثل عربي مشهور</figcaption>\n</figure>',
            en: '<figure>\n  <img src="https://picsum.photos/id/1024/420/260" alt="A brown bear in the forest" width="420">\n  <figcaption>Figure 1: a brown bear photographed in Canada, 2024.</figcaption>\n</figure>\n\n<figure>\n  <blockquote>A book is the best companion.</blockquote>\n  <figcaption>A well known proverb</figcaption>\n</figure>'
          }
        },
        challenge: {
          brief: { ar: 'اعرض صورة مع تعليق: عنصر figure بداخله img له alt وfigcaption يشرح الصورة.',
                   en: 'Show a captioned image: a figure containing an img with alt, plus a figcaption explaining it.' },
          starter: { ar: '<figure>\n  \n</figure>', en: '<figure>\n  \n</figure>' },
          solution: { ar: '<figure>\n  <img src="https://picsum.photos/320/200" alt="شاطئ عند الغروب" width="320">\n  <figcaption>الشكل 1: غروب الشمس على الشاطئ.</figcaption>\n</figure>',
                      en: '<figure>\n  <img src="https://picsum.photos/320/200" alt="A beach at sunset" width="320">\n  <figcaption>Figure 1: sunset over the beach.</figcaption>\n</figure>' },
          checks: [
            { label: { ar: 'يوجد عنصر <figure>', en: 'A <figure> element exists' },
              hint:  { ar: 'ابدأ بـ <figure> وأغلقه', en: 'Start with <figure> and close it' },
              test: function (d) { return has(d, 'figure'); } },
            { label: { ar: 'توجد صورة داخل الـ figure', en: 'An image sits inside the figure' },
              hint:  { ar: 'ضع <img> بين وسمي figure', en: 'Put <img> between the figure tags' },
              test: function (d) { return has(d, 'figure img'); } },
            { label: { ar: 'الصورة تحمل alt وصفياً', en: 'The image has descriptive alt' },
              hint:  { ar: 'alt="وصف واضح للصورة"', en: 'alt="a clear description"' },
              test: function (d) {
                var im = d.querySelector('figure img');
                var a = im && im.getAttribute('alt');
                return !!a && a.trim().length >= 3;
              } },
            { label: { ar: 'يوجد <figcaption> فيه نص', en: 'A <figcaption> with text' },
              hint:  { ar: 'ضع التعليق داخل <figcaption>…</figcaption>', en: 'Put the caption inside <figcaption>…</figcaption>' },
              test: function (d) { return filled(d, 'figure figcaption'); } }
          ]
        },
        quiz: [
          { q: { ar: 'أي وسم يحمل تعليق الصورة داخل figure؟', en: 'Which tag holds the caption inside a figure?' },
            options: [ { ar: '<caption>', en: '<caption>' }, { ar: '<figcaption>', en: '<figcaption>' },
                       { ar: '<label>', en: '<label>' }, { ar: '<title>', en: '<title>' } ],
            answer: 1,
            why: { ar: '<caption> خاص بالجداول، أما figure فتستخدم figcaption.',
                   en: '<caption> belongs to tables; figure uses figcaption.' } },
          { q: { ar: 'هل تصلح figure لغير الصور؟', en: 'Is figure usable for things other than images?' },
            options: [ { ar: 'لا، للصور فقط', en: 'No, images only' },
                       { ar: 'نعم: جداول ورسوم وكتل كود', en: 'Yes: tables, charts and code blocks' },
                       { ar: 'نعم لكن للفيديو فقط', en: 'Yes, but only for video' },
                       { ar: 'لا تُستخدم إطلاقاً', en: 'It is never used' } ],
            answer: 1,
            why: { ar: 'أي محتوى مستقل يحتاج تعليقاً يمكن وضعه في figure.',
                   en: 'Any self-contained content that needs a caption fits in a figure.' } },
          { q: { ar: 'ما الغرض من srcset؟', en: 'What is srcset for?' },
            options: [ { ar: 'إضافة إطار للصورة', en: 'Adding a border' },
                       { ar: 'تقديم عدة أحجام ليختار المتصفح الأنسب', en: 'Offering several sizes so the browser picks the best' },
                       { ar: 'تغيير لون الصورة', en: 'Changing the color' },
                       { ar: 'حماية الصورة من النسخ', en: 'Preventing copying' } ],
            answer: 1,
            why: { ar: 'يوفّر البيانات ويسرّع التحميل على الأجهزة الصغيرة.',
                   en: 'It saves data and speeds up loading on small devices.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 4 — القوائم والجداول / Module 4 — Lists & tables
     =========================================================== */
  MODULES.push({
    id: 'lists-tables',
    icon: '📋',
    title: { ar: 'القوائم والجداول', en: 'Lists and tables' },
    desc:  { ar: 'تنظيم المعلومات: قوائم مرتّبة وغير مرتّبة، وجداول بيانات صحيحة البناء.',
             en: 'Organising information: ordered and unordered lists, and correctly built data tables.' },
    lessons: [

      {
        id: 'lists',
        minutes: 7, level: 'beginner',
        tags: ['ul', 'ol', 'li'],
        title: { ar: 'القوائم المرتّبة وغير المرتّبة', en: 'Ordered and unordered lists' },
        lede: { ar: 'ثلاثة وسوم فقط تنظّم لك أي مجموعة عناصر — ومعها تُبنى كل قوائم التنقّل في العالم.',
                en: 'Three tags organise any group of items — and every navigation menu in the world is built from them.' },
        body: {
          ar: '<h2>النوعان</h2>' +
              '<ul>' +
              '<li><code>&lt;ul&gt;</code> — قائمة <strong>غير مرتّبة</strong> بنقاط، عندما لا يهم الترتيب: مكوّنات، مميزات، روابط.</li>' +
              '<li><code>&lt;ol&gt;</code> — قائمة <strong>مرتّبة</strong> بأرقام، عندما يهم الترتيب: خطوات، ترتيب فائزين.</li>' +
              '<li><code>&lt;li&gt;</code> — عنصر واحد داخل أي منهما (list item).</li>' +
              '</ul>' +
              '<div class="callout callout-warn"><span class="ic">📌</span><div><b>قاعدة صارمة</b>الابن المباشر لـ <code>ul</code> أو <code>ol</code> يجب أن يكون <code>li</code> فقط. أي نص أو وسم آخر مباشرة بالداخل يُعدّ خطأ.</div></div>' +
              '<h2>قوائم متداخلة</h2>' +
              '<p>لعمل قائمة فرعية، ضع القائمة الجديدة <strong>داخل</strong> الـ <code>li</code> الأب وليس بين عناصر القائمة:</p>' +
              '<pre><code>&lt;ul&gt;\n  &lt;li&gt;فواكه\n    &lt;ul&gt;\n      &lt;li&gt;تفاح&lt;/li&gt;\n    &lt;/ul&gt;\n  &lt;/li&gt;\n&lt;/ul&gt;</code></pre>' +
              '<h2>سمات مفيدة لـ ol</h2>' +
              '<ul>' +
              '<li><code>start="5"</code> — ابدأ الترقيم من رقم معيّن.</li>' +
              '<li><code>reversed</code> — عدّ تنازلياً.</li>' +
              '<li><code>type="A"</code> — رقّم بالحروف بدل الأرقام.</li>' +
              '</ul>' +
              '<h2>الاستخدام الأشهر: قائمة التنقّل</h2>' +
              '<p>قوائم المواقع كلها تقريباً <code>ul</code> فيها روابط، داخل <code>&lt;nav&gt;</code>. الشكل الأفقي الجميل يأتي من CSS لاحقاً.</p>',
          en: '<h2>The two kinds</h2>' +
              '<ul>' +
              '<li><code>&lt;ul&gt;</code> — an <strong>unordered</strong> bulleted list, when order does not matter: ingredients, features, links.</li>' +
              '<li><code>&lt;ol&gt;</code> — an <strong>ordered</strong> numbered list, when order matters: steps, rankings.</li>' +
              '<li><code>&lt;li&gt;</code> — one item inside either (list item).</li>' +
              '</ul>' +
              '<div class="callout callout-warn"><span class="ic">📌</span><div><b>A strict rule</b>The direct child of <code>ul</code> or <code>ol</code> must be <code>li</code> only. Any loose text or other tag placed directly inside is invalid.</div></div>' +
              '<h2>Nested lists</h2>' +
              '<p>To make a sub-list, put the new list <strong>inside</strong> the parent <code>li</code>, not between items:</p>' +
              '<pre><code>&lt;ul&gt;\n  &lt;li&gt;Fruit\n    &lt;ul&gt;\n      &lt;li&gt;Apple&lt;/li&gt;\n    &lt;/ul&gt;\n  &lt;/li&gt;\n&lt;/ul&gt;</code></pre>' +
              '<h2>Handy ol attributes</h2>' +
              '<ul>' +
              '<li><code>start="5"</code> — begin numbering at a given value.</li>' +
              '<li><code>reversed</code> — count downwards.</li>' +
              '<li><code>type="A"</code> — number with letters instead of digits.</li>' +
              '</ul>' +
              '<h2>The most common use: navigation</h2>' +
              '<p>Almost every site menu is a <code>ul</code> of links inside a <code>&lt;nav&gt;</code>. The pretty horizontal look comes later from CSS.</p>'
        },
        example: {
          note: { ar: 'جرّب تغيير ul إلى ol وشاهد النقاط تتحول إلى أرقام.',
                  en: 'Try changing ul to ol and watch the bullets turn into numbers.' },
          code: {
            ar: '<h3>مكوّنات الكيك</h3>\n<ul>\n  <li>دقيق</li>\n  <li>سكر</li>\n  <li>بيض\n    <ul>\n      <li>ثلاث بيضات كبيرة</li>\n    </ul>\n  </li>\n</ul>\n\n<h3>خطوات التحضير</h3>\n<ol>\n  <li>سخّن الفرن.</li>\n  <li>اخلط المكوّنات.</li>\n  <li>اخبز 30 دقيقة.</li>\n</ol>',
            en: '<h3>Cake ingredients</h3>\n<ul>\n  <li>Flour</li>\n  <li>Sugar</li>\n  <li>Eggs\n    <ul>\n      <li>Three large eggs</li>\n    </ul>\n  </li>\n</ul>\n\n<h3>Steps</h3>\n<ol>\n  <li>Heat the oven.</li>\n  <li>Mix the ingredients.</li>\n  <li>Bake for 30 minutes.</li>\n</ol>'
          }
        },
        challenge: {
          brief: { ar: 'اصنع صفحة وصفة: قائمة غير مرتّبة للمكوّنات فيها ثلاثة عناصر على الأقل وقائمة فرعية داخل أحدها، ثم قائمة مرتّبة للخطوات.',
                   en: 'Build a recipe page: an unordered ingredients list with at least three items and a nested sub-list inside one of them, then an ordered list of steps.' },
          starter: { ar: '<ul>\n  <li></li>\n</ul>', en: '<ul>\n  <li></li>\n</ul>' },
          solution: { ar: '<ul>\n  <li>ماء</li>\n  <li>طحين</li>\n  <li>توابل\n    <ul><li>ملح</li><li>فلفل</li></ul>\n  </li>\n</ul>\n<ol>\n  <li>اعجن</li>\n  <li>اترك العجين</li>\n  <li>اخبز</li>\n</ol>',
                      en: '<ul>\n  <li>Water</li>\n  <li>Flour</li>\n  <li>Spices\n    <ul><li>Salt</li><li>Pepper</li></ul>\n  </li>\n</ul>\n<ol>\n  <li>Knead</li>\n  <li>Rest the dough</li>\n  <li>Bake</li>\n</ol>' },
          checks: [
            { label: { ar: 'توجد قائمة <ul> فيها 3 عناصر على الأقل', en: 'A <ul> with at least three items' },
              hint:  { ar: 'كل عنصر داخل <li>…</li>', en: 'Each item goes in <li>…</li>' },
              test: function (d) {
                var uls = d.querySelectorAll('ul');
                for (var i = 0; i < uls.length; i++) {
                  var direct = 0, kids = uls[i].children;
                  for (var j = 0; j < kids.length; j++) { if (kids[j].tagName === 'LI') direct++; }
                  if (direct >= 3) return true;
                }
                return false;
              } },
            { label: { ar: 'توجد قائمة فرعية داخل عنصر <li>', en: 'A nested list inside an <li>' },
              hint:  { ar: 'ضع <ul> جديدة داخل <li> الأب', en: 'Put a new <ul> inside the parent <li>' },
              test: function (d) { return has(d, 'li ul, li ol'); } },
            { label: { ar: 'توجد قائمة مرتّبة <ol> للخطوات', en: 'An ordered <ol> list of steps' },
              hint:  { ar: 'استخدم <ol> للترتيب الرقمي', en: 'Use <ol> for numbered order' },
              test: function (d) { return n(d, 'ol > li') >= 2; } },
            { label: { ar: 'كل عناصر القوائم فيها نص', en: 'Every list item has text' },
              hint:  { ar: 'لا تترك <li></li> فارغاً', en: 'Do not leave an empty <li></li>' },
              test: function (d) {
                var li = d.querySelectorAll('li');
                if (!li.length) return false;
                for (var i = 0; i < li.length; i++) { if (txt(li[i]).length === 0) return false; }
                return true;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'أي قائمة تستخدم للخطوات المرتّبة؟', en: 'Which list is used for ordered steps?' },
            options: [ { ar: '<ul>', en: '<ul>' }, { ar: '<ol>', en: '<ol>' }, { ar: '<dl>', en: '<dl>' }, { ar: '<list>', en: '<list>' } ],
            answer: 1,
            why: { ar: 'ol اختصار ordered list أي مرتّبة بالأرقام.',
                   en: 'ol stands for ordered list, numbered by default.' } },
          { q: { ar: 'ما الابن المسموح مباشرة داخل ul؟', en: 'What is the only allowed direct child of ul?' },
            options: [ { ar: '<p>', en: '<p>' }, { ar: '<li>', en: '<li>' }, { ar: '<div>', en: '<div>' }, { ar: 'أي وسم', en: 'Any tag' } ],
            answer: 1,
            why: { ar: 'li فقط؛ وأي شيء آخر يوضع داخل li.',
                   en: 'Only li; anything else must live inside an li.' } },
          { q: { ar: 'أين توضع القائمة الفرعية؟', en: 'Where does a nested list go?' },
            options: [ { ar: 'داخل عنصر li الأب', en: 'Inside the parent li' }, { ar: 'بين عنصري li', en: 'Between two li items' },
                       { ar: 'قبل ul', en: 'Before the ul' }, { ar: 'داخل head', en: 'Inside head' } ],
            answer: 0,
            why: { ar: 'التداخل الصحيح يجعل الفرع تابعاً لعنصره.',
                   en: 'Correct nesting keeps the branch attached to its item.' } }
        ]
      },

      {
        id: 'description-lists',
        minutes: 5, level: 'intermediate',
        tags: ['dl', 'dt', 'dd'],
        title: { ar: 'قوائم التعريف: dl', en: 'Description lists: dl' },
        lede: { ar: 'القائمة المنسيّة التي تناسب المصطلحات والأسئلة الشائعة وبطاقات المواصفات.',
                en: 'The forgotten list, perfect for glossaries, FAQs and spec sheets.' },
        body: {
          ar: '<h2>ثلاثة وسوم</h2>' +
              '<ul>' +
              '<li><code>&lt;dl&gt;</code> — الحاوية (description list).</li>' +
              '<li><code>&lt;dt&gt;</code> — المصطلح أو السؤال (term).</li>' +
              '<li><code>&lt;dd&gt;</code> — الوصف أو الجواب (description).</li>' +
              '</ul>' +
              '<h2>متى تستخدمها؟</h2>' +
              '<ul>' +
              '<li>قاموس مصطلحات: المصطلح ثم تعريفه.</li>' +
              '<li>أسئلة شائعة: السؤال ثم الجواب.</li>' +
              '<li>مواصفات منتج: «المعالج» ثم قيمته.</li>' +
              '</ul>' +
              '<p>يمكن أن يتبع الـ <code>dt</code> الواحد أكثر من <code>dd</code> (تعريفات متعددة)، والعكس صحيح أيضاً.</p>' +
              '<div class="callout callout-tip"><span class="ic">🧠</span><div><b>لماذا لا نستخدم فقرات عادية؟</b>لأن الربط الدلالي بين المصطلح ووصفه يساعد قارئات الشاشة ومحركات البحث على فهم العلاقة، والفقرات لا تعبّر عن أي علاقة.</div></div>',
          en: '<h2>Three tags</h2>' +
              '<ul>' +
              '<li><code>&lt;dl&gt;</code> — the container (description list).</li>' +
              '<li><code>&lt;dt&gt;</code> — the term or question.</li>' +
              '<li><code>&lt;dd&gt;</code> — the description or answer.</li>' +
              '</ul>' +
              '<h2>When to use it</h2>' +
              '<ul>' +
              '<li>A glossary: a term followed by its definition.</li>' +
              '<li>An FAQ: a question followed by its answer.</li>' +
              '<li>Product specs: "Processor" followed by its value.</li>' +
              '</ul>' +
              '<p>One <code>dt</code> may be followed by several <code>dd</code> items (multiple definitions), and the reverse works too.</p>' +
              '<div class="callout callout-tip"><span class="ic">🧠</span><div><b>Why not plain paragraphs?</b>Because the semantic bond between term and description helps screen readers and search engines understand the relationship. Paragraphs express no relationship at all.</div></div>'
        },
        example: {
          note: { ar: 'لاحظ الإزاحة التلقائية للوصف تحت كل مصطلح.',
                  en: 'Notice the automatic indentation of each description under its term.' },
          code: {
            ar: '<dl>\n  <dt>HTML</dt>\n  <dd>لغة ترميز لبناء هيكل الصفحة.</dd>\n\n  <dt>CSS</dt>\n  <dd>لغة تنسيق تتحكم في الشكل والألوان.</dd>\n\n  <dt>المتصفح</dt>\n  <dd>برنامج يقرأ الكود ويعرض الصفحة.</dd>\n  <dd>أمثلة: كروم، فايرفوكس، سفاري.</dd>\n</dl>',
            en: '<dl>\n  <dt>HTML</dt>\n  <dd>A markup language that builds page structure.</dd>\n\n  <dt>CSS</dt>\n  <dd>A style language controlling looks and colors.</dd>\n\n  <dt>Browser</dt>\n  <dd>A program that reads the code and shows the page.</dd>\n  <dd>Examples: Chrome, Firefox, Safari.</dd>\n</dl>'
          }
        },
        challenge: {
          brief: { ar: 'اكتب قسم أسئلة شائعة: قائمة dl فيها سؤالان (dt) وجوابان (dd) على الأقل.',
                   en: 'Write an FAQ section: a dl with at least two questions (dt) and two answers (dd).' },
          starter: { ar: '<dl>\n  \n</dl>', en: '<dl>\n  \n</dl>' },
          solution: { ar: '<dl>\n  <dt>ما هي HTML؟</dt>\n  <dd>لغة ترميز لبناء صفحات الويب.</dd>\n  <dt>هل أحتاج خادماً؟</dt>\n  <dd>لا، يكفي متصفح ومحرّر نصوص.</dd>\n</dl>',
                      en: '<dl>\n  <dt>What is HTML?</dt>\n  <dd>A markup language for building web pages.</dd>\n  <dt>Do I need a server?</dt>\n  <dd>No, a browser and a text editor are enough.</dd>\n</dl>' },
          checks: [
            { label: { ar: 'يوجد عنصر <dl>', en: 'A <dl> element exists' },
              hint:  { ar: 'ابدأ بـ <dl> وأغلقه', en: 'Start with <dl> and close it' },
              test: function (d) { return has(d, 'dl'); } },
            { label: { ar: 'يوجد سؤالان <dt> على الأقل', en: 'At least two <dt> terms' },
              hint:  { ar: 'كل سؤال في <dt>…</dt>', en: 'Each question in <dt>…</dt>' },
              test: function (d) { return n(d, 'dl dt') >= 2 && filled(d, 'dl dt'); } },
            { label: { ar: 'يوجد جوابان <dd> على الأقل', en: 'At least two <dd> descriptions' },
              hint:  { ar: 'كل جواب في <dd>…</dd>', en: 'Each answer in <dd>…</dd>' },
              test: function (d) { return n(d, 'dl dd') >= 2 && filled(d, 'dl dd'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ماذا يمثّل الوسم dt؟', en: 'What does the dt tag represent?' },
            options: [ { ar: 'الوصف', en: 'The description' }, { ar: 'المصطلح أو السؤال', en: 'The term or question' },
                       { ar: 'العنوان الرئيسي', en: 'The main heading' }, { ar: 'الجدول', en: 'The table' } ],
            answer: 1,
            why: { ar: 'dt للمصطلح وdd لوصفه.', en: 'dt is the term, dd its description.' } },
          { q: { ar: 'أي حالة تناسبها dl أكثر من ul؟', en: 'Which case suits dl better than ul?' },
            options: [ { ar: 'قائمة روابط', en: 'A list of links' }, { ar: 'قاموس مصطلحات وتعريفاتها', en: 'A glossary of terms and definitions' },
                       { ar: 'خطوات مرتّبة', en: 'Ordered steps' }, { ar: 'صور متتالية', en: 'A row of images' } ],
            answer: 1,
            why: { ar: 'لأن كل عنصر مكوّن من زوج مرتبط: مصطلح ووصف.',
                   en: 'Because each entry is a bound pair: a term and its description.' } },
          { q: { ar: 'هل يمكن لـ dt واحد أن يتبعه أكثر من dd؟', en: 'Can one dt be followed by several dd items?' },
            options: [ { ar: 'نعم', en: 'Yes' }, { ar: 'لا أبداً', en: 'Never' }, { ar: 'فقط في الجداول', en: 'Only in tables' }, { ar: 'فقط مع ol', en: 'Only with ol' } ],
            answer: 0,
            why: { ar: 'تعدد الأوصاف للمصطلح الواحد مسموح ومفيد.',
                   en: 'Multiple descriptions for one term are allowed and useful.' } }
        ]
      },

      {
        id: 'tables',
        minutes: 9, level: 'intermediate',
        tags: ['table', 'tr', 'td', 'th'],
        title: { ar: 'الجداول: عرض البيانات', en: 'Tables: displaying data' },
        lede: { ar: 'الجداول للبيانات لا للتصميم. تعلّم بناءها بشكل صحيح ومقروء للجميع.',
                en: 'Tables are for data, not layout. Learn to build them correctly and accessibly.' },
        body: {
          ar: '<h2>الوسوم الأساسية</h2>' +
              '<ul>' +
              '<li><code>&lt;table&gt;</code> — الجدول كله.</li>' +
              '<li><code>&lt;tr&gt;</code> — صف (table row).</li>' +
              '<li><code>&lt;th&gt;</code> — خلية عنوان (header)، تظهر عريضة ووسطية.</li>' +
              '<li><code>&lt;td&gt;</code> — خلية بيانات (data).</li>' +
              '</ul>' +
              '<h2>الأقسام الثلاثة</h2>' +
              '<p>الجدول المحترف يُقسّم إلى:</p>' +
              '<ul>' +
              '<li><code>&lt;thead&gt;</code> — صف العناوين.</li>' +
              '<li><code>&lt;tbody&gt;</code> — صفوف البيانات.</li>' +
              '<li><code>&lt;tfoot&gt;</code> — صف المجاميع.</li>' +
              '</ul>' +
              '<p>وأضف <code>&lt;caption&gt;</code> كأول عنصر داخل الجدول ليكون عنوانه.</p>' +
              '<h2>الوصولية</h2>' +
              '<p>استخدم <code>&lt;th scope="col"&gt;</code> لعناوين الأعمدة و<code>scope="row"</code> لعناوين الصفوف. بهذا يعرف قارئ الشاشة أن هذه القيمة تخص «مبيعات» في «يناير» بدل أن يقرأ أرقاماً متناثرة.</p>' +
              '<div class="callout callout-warn"><span class="ic">🚫</span><div><b>لا تستخدم الجداول للتصميم</b>قبل عشرين سنة كانت المواقع تُبنى بجداول متداخلة. اليوم التخطيط مهمة CSS (Grid وFlexbox). الجدول للبيانات المترابطة فقط: أسعار، نتائج، جداول مواعيد.</div></div>',
          en: '<h2>The core tags</h2>' +
              '<ul>' +
              '<li><code>&lt;table&gt;</code> — the whole table.</li>' +
              '<li><code>&lt;tr&gt;</code> — a table row.</li>' +
              '<li><code>&lt;th&gt;</code> — a header cell, bold and centered by default.</li>' +
              '<li><code>&lt;td&gt;</code> — a data cell.</li>' +
              '</ul>' +
              '<h2>The three sections</h2>' +
              '<p>A professional table is split into:</p>' +
              '<ul>' +
              '<li><code>&lt;thead&gt;</code> — the header row.</li>' +
              '<li><code>&lt;tbody&gt;</code> — the data rows.</li>' +
              '<li><code>&lt;tfoot&gt;</code> — the totals row.</li>' +
              '</ul>' +
              '<p>And add a <code>&lt;caption&gt;</code> as the first element inside the table to title it.</p>' +
              '<h2>Accessibility</h2>' +
              '<p>Use <code>&lt;th scope="col"&gt;</code> for column headers and <code>scope="row"</code> for row headers. A screen reader can then say this value is "Sales" for "January" instead of reading scattered numbers.</p>' +
              '<div class="callout callout-warn"><span class="ic">🚫</span><div><b>Never use tables for layout</b>Twenty years ago sites were built from nested tables. Today layout is CSS work (Grid and Flexbox). Tables are only for related data: prices, results, schedules.</div></div>'
        },
        example: {
          note: { ar: 'احذف thead ولاحظ أن الجدول يعمل لكنه يفقد معناه للقارئ الآلي.',
                  en: 'Remove thead and notice the table still works but loses meaning for machines.' },
          code: {
            ar: '<table border="1" cellpadding="6">\n  <caption>نتائج الفصل الأول</caption>\n  <thead>\n    <tr><th scope="col">الطالب</th><th scope="col">الرياضيات</th><th scope="col">العلوم</th></tr>\n  </thead>\n  <tbody>\n    <tr><th scope="row">سارة</th><td>95</td><td>88</td></tr>\n    <tr><th scope="row">أحمد</th><td>82</td><td>91</td></tr>\n  </tbody>\n  <tfoot>\n    <tr><th scope="row">المتوسط</th><td>88.5</td><td>89.5</td></tr>\n  </tfoot>\n</table>',
            en: '<table border="1" cellpadding="6">\n  <caption>First term results</caption>\n  <thead>\n    <tr><th scope="col">Student</th><th scope="col">Maths</th><th scope="col">Science</th></tr>\n  </thead>\n  <tbody>\n    <tr><th scope="row">Sara</th><td>95</td><td>88</td></tr>\n    <tr><th scope="row">Ahmed</th><td>82</td><td>91</td></tr>\n  </tbody>\n  <tfoot>\n    <tr><th scope="row">Average</th><td>88.5</td><td>89.5</td></tr>\n  </tfoot>\n</table>'
          }
        },
        challenge: {
          brief: { ar: 'ابنِ جدول أسعار: عنوان caption، وthead فيه ثلاث خلايا th، وtbody فيه صفّان على الأقل من خلايا td.',
                   en: 'Build a price table: a caption, a thead with three th cells, and a tbody with at least two rows of td cells.' },
          starter: { ar: '<table border="1" cellpadding="6">\n  \n</table>', en: '<table border="1" cellpadding="6">\n  \n</table>' },
          solution: { ar: '<table border="1" cellpadding="6">\n  <caption>باقات الاشتراك</caption>\n  <thead>\n    <tr><th>الباقة</th><th>السعر</th><th>المدة</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>أساسية</td><td>50</td><td>شهر</td></tr>\n    <tr><td>مميزة</td><td>120</td><td>3 أشهر</td></tr>\n  </tbody>\n</table>',
                      en: '<table border="1" cellpadding="6">\n  <caption>Subscription plans</caption>\n  <thead>\n    <tr><th>Plan</th><th>Price</th><th>Duration</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Basic</td><td>50</td><td>1 month</td></tr>\n    <tr><td>Premium</td><td>120</td><td>3 months</td></tr>\n  </tbody>\n</table>' },
          checks: [
            { label: { ar: 'يوجد جدول <table> فيه <caption>', en: 'A <table> with a <caption>' },
              hint:  { ar: 'ضع <caption> أول عنصر داخل الجدول', en: 'Put <caption> as the first element inside the table' },
              test: function (d) { return filled(d, 'table caption'); } },
            { label: { ar: 'يوجد <thead> فيه ثلاث خلايا <th>', en: 'A <thead> with three <th> cells' },
              hint:  { ar: '<thead><tr><th>…</th>×3</tr></thead>', en: '<thead><tr><th>…</th> ×3</tr></thead>' },
              test: function (d) { return n(d, 'thead th') >= 3; } },
            { label: { ar: 'يوجد <tbody> فيه صفّان <tr> على الأقل', en: 'A <tbody> with at least two <tr> rows' },
              hint:  { ar: 'كل صف بيانات داخل <tr>', en: 'Each data row goes in a <tr>' },
              test: function (d) { return n(d, 'tbody tr') >= 2; } },
            { label: { ar: 'خلايا البيانات مكتوبة بـ <td> وفيها نص', en: 'Data cells use <td> and contain text' },
              hint:  { ar: 'استخدم td للبيانات وth للعناوين فقط', en: 'Use td for data, th only for headers' },
              test: function (d) { return n(d, 'tbody td') >= 4 && filled(d, 'tbody td'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما الوسم الذي يمثّل صفاً في الجدول؟', en: 'Which tag represents a table row?' },
            options: [ { ar: '<td>', en: '<td>' }, { ar: '<tr>', en: '<tr>' }, { ar: '<th>', en: '<th>' }, { ar: '<row>', en: '<row>' } ],
            answer: 1,
            why: { ar: 'tr اختصار table row، وداخله توضع الخلايا.',
                   en: 'tr stands for table row; cells live inside it.' } },
          { q: { ar: 'ما الفرق بين th وtd؟', en: 'What is the difference between th and td?' },
            options: [ { ar: 'لا فرق', en: 'None' }, { ar: 'th خلية عنوان وtd خلية بيانات', en: 'th is a header cell, td a data cell' },
                       { ar: 'th للأرقام فقط', en: 'th is only for numbers' }, { ar: 'td للصور فقط', en: 'td is only for images' } ],
            answer: 1,
            why: { ar: 'th تعطي معنى «هذا عنوان العمود أو الصف» ويستفيد منه قارئ الشاشة.',
                   en: 'th says "this labels a column or row", which screen readers use.' } },
          { q: { ar: 'هل يصحّ استخدام الجداول لتصميم تخطيط الصفحة؟', en: 'Is it right to use tables for page layout?' },
            options: [ { ar: 'نعم، الطريقة الأفضل', en: 'Yes, the best way' }, { ar: 'لا، التخطيط مهمة CSS', en: 'No, layout is a CSS job' },
                       { ar: 'نعم للجوال فقط', en: 'Yes, on mobile only' }, { ar: 'نعم إذا كانت متداخلة', en: 'Yes, if nested' } ],
            answer: 1,
            why: { ar: 'الجداول للبيانات؛ التخطيط يُبنى بـ Grid وFlexbox.',
                   en: 'Tables are for data; layout is built with Grid and Flexbox.' } }
        ]
      },

      {
        id: 'tables-advanced',
        minutes: 6, level: 'intermediate',
        tags: ['colspan', 'rowspan'],
        title: { ar: 'دمج الخلايا: colspan وrowspan', en: 'Merging cells: colspan and rowspan' },
        lede: { ar: 'عندما تحتاج خلية تمتد على عمودين أو صفّين — كيف تفعلها دون أن ينكسر الجدول.',
                en: 'When a cell must span two columns or rows — how to do it without breaking the table.' },
        body: {
          ar: '<h2>السمتان</h2>' +
              '<ul>' +
              '<li><code>colspan="2"</code> — تجعل الخلية تمتد أفقياً على عمودين.</li>' +
              '<li><code>rowspan="3"</code> — تجعلها تمتد عمودياً على ثلاثة صفوف.</li>' +
              '</ul>' +
              '<h2>قاعدة الحساب</h2>' +
              '<p>عدد الخلايا في كل صف يجب أن يبقى متساوياً بعد حساب الدمج. إذا كان جدولك من ثلاثة أعمدة ووضعت خلية بـ <code>colspan="2"</code>، فالصف يحتاج خلية واحدة إضافية فقط (2 + 1 = 3).</p>' +
              '<p>ومع <code>rowspan</code> تذكّر أن الصف التالي «فقد» خلية لأن الخلية العلوية تشغلها، فلا تضِف خلية مكانها.</p>' +
              '<div class="callout callout-tip"><span class="ic">📐</span><div><b>نصيحة عملية</b>ارسم الجدول على ورقة أولاً وعُدّ الخلايا في كل صف. أغلب مشاكل الجداول المكسورة سببها خلية زائدة أو ناقصة.</div></div>' +
              '<h2>جداول تتجاوب مع الجوال</h2>' +
              '<p>الجداول العريضة تكسر تصميم الجوال. الحل الشائع: ضع الجدول داخل عنصر يمرّر أفقياً — <code>&lt;div style="overflow-x:auto"&gt;</code> — فيبقى الجدول كاملاً ويمرّره المستخدم بإصبعه.</p>',
          en: '<h2>The two attributes</h2>' +
              '<ul>' +
              '<li><code>colspan="2"</code> — makes a cell stretch across two columns.</li>' +
              '<li><code>rowspan="3"</code> — makes it stretch down three rows.</li>' +
              '</ul>' +
              '<h2>The counting rule</h2>' +
              '<p>The cell count of every row must stay equal once spans are counted. In a three-column table, a cell with <code>colspan="2"</code> leaves room for exactly one more cell (2 + 1 = 3).</p>' +
              '<p>With <code>rowspan</code>, remember the next row has "lost" a cell because the one above occupies it — do not add a replacement.</p>' +
              '<div class="callout callout-tip"><span class="ic">📐</span><div><b>Practical tip</b>Sketch the table on paper first and count cells per row. Most broken tables come from one extra or one missing cell.</div></div>' +
              '<h2>Tables on mobile</h2>' +
              '<p>Wide tables break phone layouts. The common fix: put the table inside a horizontally scrolling box — <code>&lt;div style="overflow-x:auto"&gt;</code> — so the table stays whole and the user swipes it.</p>'
        },
        example: {
          note: { ar: 'عُدّ الخلايا في كل صف: المجموع دائماً ثلاثة.',
                  en: 'Count the cells per row: the total is always three.' },
          code: {
            ar: '<table border="1" cellpadding="6">\n  <tr>\n    <th colspan="3">جدول الحصص</th>\n  </tr>\n  <tr>\n    <th>اليوم</th><th>الحصة 1</th><th>الحصة 2</th>\n  </tr>\n  <tr>\n    <td rowspan="2">الأحد</td><td>رياضيات</td><td>علوم</td>\n  </tr>\n  <tr>\n    <td>لغة</td><td>رياضة</td>\n  </tr>\n</table>',
            en: '<table border="1" cellpadding="6">\n  <tr>\n    <th colspan="3">Class schedule</th>\n  </tr>\n  <tr>\n    <th>Day</th><th>Period 1</th><th>Period 2</th>\n  </tr>\n  <tr>\n    <td rowspan="2">Sunday</td><td>Maths</td><td>Science</td>\n  </tr>\n  <tr>\n    <td>Language</td><td>Sports</td>\n  </tr>\n</table>'
          }
        },
        challenge: {
          brief: { ar: 'ابنِ جدولاً من ثلاثة أعمدة: الصف الأول خلية واحدة بـ colspan="3" كعنوان، ثم صفوف بيانات، مع خلية واحدة على الأقل تستخدم rowspan.',
                   en: 'Build a three-column table: the first row is a single cell with colspan="3" as a title, then data rows, with at least one cell using rowspan.' },
          starter: { ar: '<table border="1" cellpadding="6">\n  <tr>\n    \n  </tr>\n</table>', en: '<table border="1" cellpadding="6">\n  <tr>\n    \n  </tr>\n</table>' },
          solution: { ar: '<table border="1" cellpadding="6">\n  <tr><th colspan="3">الميزانية</th></tr>\n  <tr><th>البند</th><th>الشهر</th><th>المبلغ</th></tr>\n  <tr><td rowspan="2">سكن</td><td>يناير</td><td>1000</td></tr>\n  <tr><td>فبراير</td><td>1000</td></tr>\n</table>',
                      en: '<table border="1" cellpadding="6">\n  <tr><th colspan="3">Budget</th></tr>\n  <tr><th>Item</th><th>Month</th><th>Amount</th></tr>\n  <tr><td rowspan="2">Rent</td><td>January</td><td>1000</td></tr>\n  <tr><td>February</td><td>1000</td></tr>\n</table>' },
          checks: [
            { label: { ar: 'توجد خلية بـ colspan="3"', en: 'A cell with colspan="3"' },
              hint:  { ar: 'مثال: <th colspan="3">العنوان</th>', en: 'Example: <th colspan="3">Title</th>' },
              test: function (d) { return has(d, '[colspan="3"]'); } },
            { label: { ar: 'توجد خلية تستخدم rowspan', en: 'A cell uses rowspan' },
              hint:  { ar: 'مثال: <td rowspan="2">…</td>', en: 'Example: <td rowspan="2">…</td>' },
              test: function (d) { return has(d, '[rowspan]'); } },
            { label: { ar: 'الجدول يحوي أربعة صفوف على الأقل', en: 'The table has at least four rows' },
              hint:  { ar: 'عنوان + عناوين أعمدة + صفّا بيانات', en: 'Title + column headers + two data rows' },
              test: function (d) { return n(d, 'tr') >= 4; } },
            { label: { ar: 'عدد الأعمدة في صف العناوين ثلاثة', en: 'The header row has three columns' },
              hint:  { ar: 'ثلاث خلايا th في صف واحد', en: 'Three th cells in one row' },
              test: function (d) {
                var rows = d.querySelectorAll('tr');
                for (var i = 0; i < rows.length; i++) {
                  var cells = rows[i].querySelectorAll('th');
                  if (cells.length === 3) return true;
                }
                return false;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'ماذا تفعل colspan="2"؟', en: 'What does colspan="2" do?' },
            options: [ { ar: 'تمدّ الخلية على عمودين', en: 'Stretches the cell across two columns' },
                       { ar: 'تمدّها على صفّين', en: 'Stretches it across two rows' },
                       { ar: 'تكرّر الخلية مرتين', en: 'Repeats the cell twice' },
                       { ar: 'تلوّن الخلية', en: 'Colors the cell' } ],
            answer: 0,
            why: { ar: 'col = عمود، وrow = صف.', en: 'col means column, row means row.' } },
          { q: { ar: 'في جدول من 3 أعمدة، خلية بـ colspan="2" تحتاج كم خلية إضافية في صفها؟', en: 'In a 3-column table, a cell with colspan="2" needs how many more cells in its row?' },
            options: [ { ar: 'صفر', en: 'Zero' }, { ar: 'واحدة', en: 'One' }, { ar: 'اثنتان', en: 'Two' }, { ar: 'ثلاث', en: 'Three' } ],
            answer: 1,
            why: { ar: '2 + 1 = 3 وهو عدد الأعمدة.', en: '2 + 1 = 3, matching the column count.' } },
          { q: { ar: 'كيف تجعل جدولاً عريضاً صالحاً للجوال؟', en: 'How do you make a wide table usable on mobile?' },
            options: [ { ar: 'تحذف أعمدة', en: 'Delete columns' },
                       { ar: 'تضعه في حاوية تمرّر أفقياً', en: 'Put it in a horizontally scrolling container' },
                       { ar: 'تصغّر الخط إلى 5px', en: 'Shrink the font to 5px' },
                       { ar: 'تحوّله إلى صورة', en: 'Convert it to an image' } ],
            answer: 1,
            why: { ar: 'overflow-x:auto يبقي البيانات كاملة ويسمح بالتمرير.',
                   en: 'overflow-x:auto keeps all the data and lets the user scroll.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 5 — النماذج / Module 5 — Forms
     =========================================================== */
  MODULES.push({
    id: 'forms',
    icon: '🧾',
    title: { ar: 'النماذج: التفاعل مع المستخدم', en: 'Forms: talking to your user' },
    desc:  { ar: 'حقول الإدخال والتسميات والقوائم والتحقق — كل ما يحوّل صفحتك من عرض إلى حوار.',
             en: 'Inputs, labels, selects and validation — everything that turns a page into a conversation.' },
    lessons: [

      {
        id: 'forms-basics',
        minutes: 8, level: 'intermediate',
        tags: ['form', 'input', 'label'],
        title: { ar: 'بناء نموذج: form وlabel', en: 'Building a form: form and label' },
        lede: { ar: 'أول نموذج تسجيل لك، ولماذا يجب ألا يبقى حقل بلا تسمية أبداً.',
                en: 'Your first sign-up form, and why no field should ever be left unlabelled.' },
        body: {
          ar: '<h2>الحاوية: form</h2>' +
              '<p><code>&lt;form&gt;</code> تجمع الحقول وترسلها. لها سمتان مهمتان:</p>' +
              '<ul>' +
              '<li><code>action</code> — عنوان الصفحة أو الخدمة التي تستقبل البيانات.</li>' +
              '<li><code>method</code> — طريقة الإرسال: <code>get</code> (تظهر البيانات في الرابط، للبحث) أو <code>post</code> (مخفية، للتسجيل والبيانات الحساسة).</li>' +
              '</ul>' +
              '<h2>الحقل: input</h2>' +
              '<p>عنصر فارغ يتغيّر شكله حسب <code>type</code>، وأهم سماته:</p>' +
              '<ul>' +
              '<li><code>type</code> — نوع الحقل (نص، بريد، كلمة مرور…).</li>' +
              '<li><code>name</code> — اسم الحقل عند الإرسال. <strong>بدونه لا تُرسل القيمة إطلاقاً.</strong></li>' +
              '<li><code>id</code> — معرّف لربط التسمية به.</li>' +
              '<li><code>placeholder</code> — نص إرشادي باهت داخل الحقل.</li>' +
              '<li><code>value</code> — قيمة ابتدائية.</li>' +
              '</ul>' +
              '<h2>التسمية: label</h2>' +
              '<p>اربط كل حقل بتسمية عبر <code>&lt;label for="اسم-الـid"&gt;</code>. الفائدة مزدوجة: قارئ الشاشة ينطق التسمية عند الوصول للحقل، والضغط على النص ينقل المؤشر للحقل مباشرة (مساحة نقر أكبر على الجوال).</p>' +
              '<div class="callout callout-warn"><span class="ic">🚫</span><div><b>placeholder ليست تسمية</b>النص الباهت يختفي فور الكتابة، فينسى المستخدم ما المطلوب، وقارئات الشاشة قد تتجاهله. استخدم <code>label</code> دائماً، وplaceholder للتوضيح الإضافي فقط.</div></div>' +
              '<h2>زر الإرسال</h2>' +
              '<p><code>&lt;button type="submit"&gt;إرسال&lt;/button&gt;</code> — النوع submit هو الافتراضي داخل النموذج. استخدم <code>type="button"</code> لزر لا يُرسل شيئاً.</p>',
          en: '<h2>The container: form</h2>' +
              '<p><code>&lt;form&gt;</code> groups fields and submits them. Two attributes matter most:</p>' +
              '<ul>' +
              '<li><code>action</code> — the page or service that receives the data.</li>' +
              '<li><code>method</code> — how it is sent: <code>get</code> (data appears in the URL, good for search) or <code>post</code> (hidden, for sign-ups and sensitive data).</li>' +
              '</ul>' +
              '<h2>The field: input</h2>' +
              '<p>A void element whose appearance changes with <code>type</code>. Its key attributes:</p>' +
              '<ul>' +
              '<li><code>type</code> — the field kind (text, email, password…).</li>' +
              '<li><code>name</code> — the field name on submit. <strong>Without it the value is never sent.</strong></li>' +
              '<li><code>id</code> — an identifier so a label can bind to it.</li>' +
              '<li><code>placeholder</code> — faint hint text inside the field.</li>' +
              '<li><code>value</code> — an initial value.</li>' +
              '</ul>' +
              '<h2>The label</h2>' +
              '<p>Bind every field to a label with <code>&lt;label for="the-id"&gt;</code>. The benefit is double: screen readers announce the label when reaching the field, and clicking the text focuses the field (a much bigger tap target on phones).</p>' +
              '<div class="callout callout-warn"><span class="ic">🚫</span><div><b>placeholder is not a label</b>Faint text disappears the moment typing starts, so the user forgets what was asked, and screen readers may ignore it. Always use a <code>label</code>; keep placeholder for extra hints only.</div></div>' +
              '<h2>The submit button</h2>' +
              '<p><code>&lt;button type="submit"&gt;Send&lt;/button&gt;</code> — submit is the default type inside a form. Use <code>type="button"</code> for a button that submits nothing.</p>'
        },
        example: {
          note: { ar: 'اضغط على كلمة «الاسم» ولاحظ انتقال المؤشر إلى الحقل — هذه فائدة label.',
                  en: 'Click the word "Name" and watch the cursor jump into the field — that is the label at work.' },
          code: {
            ar: '<form action="#" method="post">\n  <p>\n    <label for="name">الاسم الكامل</label><br>\n    <input type="text" id="name" name="name" placeholder="مثال: سارة العتيبي">\n  </p>\n  <p>\n    <label for="mail">البريد الإلكتروني</label><br>\n    <input type="email" id="mail" name="email" placeholder="you@example.com">\n  </p>\n  <button type="submit">أرسل</button>\n</form>',
            en: '<form action="#" method="post">\n  <p>\n    <label for="name">Full name</label><br>\n    <input type="text" id="name" name="name" placeholder="e.g. Sara Ahmed">\n  </p>\n  <p>\n    <label for="mail">Email address</label><br>\n    <input type="email" id="mail" name="email" placeholder="you@example.com">\n  </p>\n  <button type="submit">Send</button>\n</form>'
          }
        },
        challenge: {
          brief: { ar: 'اصنع نموذج تسجيل: حقل نص للاسم وحقل بريد، لكل منهما label مرتبطة بـ for، وكل حقل له name، وزر إرسال.',
                   en: 'Create a sign-up form: a text field for the name and an email field, each with a label bound via for, each with a name attribute, plus a submit button.' },
          starter: { ar: '<form>\n  \n</form>', en: '<form>\n  \n</form>' },
          solution: { ar: '<form action="#" method="post">\n  <label for="n">الاسم</label>\n  <input type="text" id="n" name="name"><br>\n  <label for="e">البريد</label>\n  <input type="email" id="e" name="email"><br>\n  <button type="submit">تسجيل</button>\n</form>',
                      en: '<form action="#" method="post">\n  <label for="n">Name</label>\n  <input type="text" id="n" name="name"><br>\n  <label for="e">Email</label>\n  <input type="email" id="e" name="email"><br>\n  <button type="submit">Sign up</button>\n</form>' },
          checks: [
            { label: { ar: 'يوجد عنصر <form>', en: 'A <form> element exists' },
              hint:  { ar: 'ضع كل الحقول داخل <form>…</form>', en: 'Put all fields inside <form>…</form>' },
              test: function (d) { return has(d, 'form'); } },
            { label: { ar: 'يوجد حقل نص وحقل بريد', en: 'A text field and an email field' },
              hint:  { ar: 'type="text" وtype="email"', en: 'type="text" and type="email"' },
              test: function (d) { return has(d, 'input[type="text"]') && has(d, 'input[type="email"]'); } },
            { label: { ar: 'كل حقل يحمل السمة name', en: 'Every field carries a name attribute' },
              hint:  { ar: 'بدون name لا تُرسل القيمة', en: 'Without name the value is never sent' },
              test: function (d) {
                var ins = d.querySelectorAll('input');
                if (ins.length < 2) return false;
                for (var i = 0; i < ins.length; i++) {
                  var v = ins[i].getAttribute('name');
                  if (!v || !v.trim()) return false;
                }
                return true;
              } },
            { label: { ar: 'توجد تسميتان <label> مرتبطتان بـ for', en: 'Two <label> elements bound with for' },
              hint:  { ar: 'قيمة for يجب أن تساوي id الحقل', en: 'The for value must equal the field id' },
              test: function (d) {
                var labels = d.querySelectorAll('label[for]');
                var ok = 0;
                for (var i = 0; i < labels.length; i++) {
                  var id = labels[i].getAttribute('for');
                  if (id && d.getElementById(id)) ok++;
                }
                return ok >= 2;
              } },
            { label: { ar: 'يوجد زر إرسال', en: 'A submit button exists' },
              hint:  { ar: '<button type="submit">…</button>', en: '<button type="submit">…</button>' },
              test: function (d) { return has(d, 'button[type="submit"], button:not([type]), input[type="submit"]'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما السمة التي بدونها لا تُرسل قيمة الحقل؟', en: 'Without which attribute is a field value never submitted?' },
            options: [ { ar: 'id', en: 'id' }, { ar: 'name', en: 'name' }, { ar: 'class', en: 'class' }, { ar: 'placeholder', en: 'placeholder' } ],
            answer: 1,
            why: { ar: 'name هو مفتاح القيمة عند الإرسال، وid للربط بالتسمية فقط.',
                   en: 'name is the key of the submitted value; id only binds the label.' } },
          { q: { ar: 'ما الذي يربط label بالحقل؟', en: 'What binds a label to its field?' },
            options: [ { ar: 'السمة for تساوي id الحقل', en: 'The for attribute equals the field id' },
                       { ar: 'السمة name', en: 'The name attribute' },
                       { ar: 'الترتيب في الصفحة', en: 'Their order on the page' },
                       { ar: 'لون النص', en: 'The text color' } ],
            answer: 0,
            why: { ar: 'for="x" مع id="x" يجعل الضغط على التسمية يركّز الحقل.',
                   en: 'for="x" with id="x" makes clicking the label focus the field.' } },
          { q: { ar: 'متى تستخدم method="post"؟', en: 'When do you use method="post"?' },
            options: [ { ar: 'للبحث فقط', en: 'For search only' }, { ar: 'للبيانات الحساسة والتسجيل', en: 'For sensitive data and sign-ups' },
                       { ar: 'دائماً وأبداً', en: 'Always, without exception' }, { ar: 'للصور فقط', en: 'For images only' } ],
            answer: 1,
            why: { ar: 'post لا يعرض البيانات في الرابط، بعكس get.',
                   en: 'post keeps data out of the URL, unlike get.' } }
        ]
      },

      {
        id: 'input-types',
        minutes: 7, level: 'intermediate',
        tags: ['input', 'type', 'أنواع'],
        title: { ar: 'أنواع الحقول', en: 'Input types' },
        lede: { ar: 'اختيار النوع الصحيح يفتح لوحة المفاتيح المناسبة ويتحقق من البيانات مجاناً.',
                en: 'The right type opens the right keyboard and validates data for free.' },
        body: {
          ar: '<h2>الأنواع الأكثر استخداماً</h2>' +
              '<table>' +
              '<tr><th>النوع</th><th>الاستخدام</th></tr>' +
              '<tr><td><code>text</code></td><td>نص عادي قصير</td></tr>' +
              '<tr><td><code>email</code></td><td>بريد إلكتروني، ويتحقق من وجود @</td></tr>' +
              '<tr><td><code>password</code></td><td>يخفي الحروف بنقاط</td></tr>' +
              '<tr><td><code>number</code></td><td>أرقام فقط مع أسهم زيادة ونقصان</td></tr>' +
              '<tr><td><code>tel</code></td><td>هاتف — يفتح لوحة أرقام على الجوال</td></tr>' +
              '<tr><td><code>url</code></td><td>عنوان موقع</td></tr>' +
              '<tr><td><code>date</code></td><td>منتقي تاريخ جاهز</td></tr>' +
              '<tr><td><code>time</code></td><td>منتقي وقت</td></tr>' +
              '<tr><td><code>color</code></td><td>منتقي ألوان</td></tr>' +
              '<tr><td><code>range</code></td><td>شريط تمرير</td></tr>' +
              '<tr><td><code>file</code></td><td>رفع ملف</td></tr>' +
              '<tr><td><code>search</code></td><td>حقل بحث بزر مسح</td></tr>' +
              '</table>' +
              '<h2>سمات مساعدة</h2>' +
              '<ul>' +
              '<li><code>min</code> و<code>max</code> و<code>step</code> — لحقول الأرقام والتواريخ.</li>' +
              '<li><code>maxlength</code> — أقصى عدد حروف.</li>' +
              '<li><code>autocomplete</code> — يساعد المتصفح على ملء البيانات المحفوظة.</li>' +
              '<li><code>readonly</code> — للعرض بلا تعديل، و<code>disabled</code> — معطّل ولا يُرسل.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">📱</span><div><b>مكسب مجاني على الجوال</b>حقل <code>type="tel"</code> يفتح لوحة الأرقام، و<code>type="email"</code> يضيف زر @. مجرد اختيار النوع الصحيح يحسّن تجربة المستخدم كثيراً.</div></div>',
          en: '<h2>The most used types</h2>' +
              '<table>' +
              '<tr><th>Type</th><th>Use</th></tr>' +
              '<tr><td><code>text</code></td><td>short plain text</td></tr>' +
              '<tr><td><code>email</code></td><td>an email address, checks for @</td></tr>' +
              '<tr><td><code>password</code></td><td>masks characters with dots</td></tr>' +
              '<tr><td><code>number</code></td><td>digits only, with up and down arrows</td></tr>' +
              '<tr><td><code>tel</code></td><td>phone — opens a numeric keypad on mobile</td></tr>' +
              '<tr><td><code>url</code></td><td>a web address</td></tr>' +
              '<tr><td><code>date</code></td><td>a ready-made date picker</td></tr>' +
              '<tr><td><code>time</code></td><td>a time picker</td></tr>' +
              '<tr><td><code>color</code></td><td>a color picker</td></tr>' +
              '<tr><td><code>range</code></td><td>a slider</td></tr>' +
              '<tr><td><code>file</code></td><td>file upload</td></tr>' +
              '<tr><td><code>search</code></td><td>a search box with a clear button</td></tr>' +
              '</table>' +
              '<h2>Helper attributes</h2>' +
              '<ul>' +
              '<li><code>min</code>, <code>max</code> and <code>step</code> — for number and date fields.</li>' +
              '<li><code>maxlength</code> — the character limit.</li>' +
              '<li><code>autocomplete</code> — helps the browser fill saved data.</li>' +
              '<li><code>readonly</code> — visible but not editable; <code>disabled</code> — inactive and not submitted.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">📱</span><div><b>A free win on mobile</b><code>type="tel"</code> opens the numeric keypad and <code>type="email"</code> adds an @ key. Simply choosing the right type improves the experience a lot.</div></div>'
        },
        example: {
          note: { ar: 'جرّب كل حقل بنفسك — لاحظ كيف يتغيّر شكله وسلوكه.',
                  en: 'Try each field yourself — notice how the look and behaviour change.' },
          code: {
            ar: '<form>\n  <p><label>رقم الجوال <input type="tel" name="tel"></label></p>\n  <p><label>العمر <input type="number" name="age" min="1" max="120"></label></p>\n  <p><label>تاريخ الميلاد <input type="date" name="dob"></label></p>\n  <p><label>اللون المفضل <input type="color" name="c" value="#4b3ff0"></label></p>\n  <p><label>التقييم <input type="range" name="r" min="0" max="10"></label></p>\n  <p><label>كلمة المرور <input type="password" name="p"></label></p>\n</form>',
            en: '<form>\n  <p><label>Phone <input type="tel" name="tel"></label></p>\n  <p><label>Age <input type="number" name="age" min="1" max="120"></label></p>\n  <p><label>Date of birth <input type="date" name="dob"></label></p>\n  <p><label>Favourite color <input type="color" name="c" value="#4b3ff0"></label></p>\n  <p><label>Rating <input type="range" name="r" min="0" max="10"></label></p>\n  <p><label>Password <input type="password" name="p"></label></p>\n</form>'
          }
        },
        challenge: {
          brief: { ar: 'اصنع نموذج حجز: حقل تاريخ، وحقل رقم له min وmax، وحقل هاتف، وحقل كلمة مرور — كل واحد داخل label.',
                   en: 'Build a booking form: a date field, a number field with min and max, a phone field, and a password field — each inside a label.' },
          starter: { ar: '<form>\n  \n</form>', en: '<form>\n  \n</form>' },
          solution: { ar: '<form>\n  <p><label>التاريخ <input type="date" name="d"></label></p>\n  <p><label>عدد الأشخاص <input type="number" name="q" min="1" max="10"></label></p>\n  <p><label>الجوال <input type="tel" name="t"></label></p>\n  <p><label>كلمة المرور <input type="password" name="p"></label></p>\n</form>',
                      en: '<form>\n  <p><label>Date <input type="date" name="d"></label></p>\n  <p><label>Guests <input type="number" name="q" min="1" max="10"></label></p>\n  <p><label>Phone <input type="tel" name="t"></label></p>\n  <p><label>Password <input type="password" name="p"></label></p>\n</form>' },
          checks: [
            { label: { ar: 'يوجد حقل تاريخ type="date"', en: 'A date field type="date"' },
              hint:  { ar: '<input type="date" name="d">', en: '<input type="date" name="d">' },
              test: function (d) { return has(d, 'input[type="date"]'); } },
            { label: { ar: 'يوجد حقل رقم بـ min وmax', en: 'A number field with min and max' },
              hint:  { ar: '<input type="number" min="1" max="10">', en: '<input type="number" min="1" max="10">' },
              test: function (d) { return has(d, 'input[type="number"][min][max]'); } },
            { label: { ar: 'يوجد حقل هاتف type="tel"', en: 'A phone field type="tel"' },
              hint:  { ar: '<input type="tel">', en: '<input type="tel">' },
              test: function (d) { return has(d, 'input[type="tel"]'); } },
            { label: { ar: 'يوجد حقل كلمة مرور', en: 'A password field' },
              hint:  { ar: '<input type="password">', en: '<input type="password">' },
              test: function (d) { return has(d, 'input[type="password"]'); } },
            { label: { ar: 'كل الحقول داخل <label>', en: 'All fields sit inside a <label>' },
              hint:  { ar: 'غلّف كل حقل بـ <label>النص <input></label>', en: 'Wrap each field: <label>text <input></label>' },
              test: function (d) {
                var ins = d.querySelectorAll('input');
                if (ins.length < 4) return false;
                for (var i = 0; i < ins.length; i++) { if (!ins[i].closest('label')) return false; }
                return true;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'أي نوع يخفي ما يكتبه المستخدم؟', en: 'Which type masks what the user types?' },
            options: [ { ar: 'text', en: 'text' }, { ar: 'password', en: 'password' }, { ar: 'hidden', en: 'hidden' }, { ar: 'secret', en: 'secret' } ],
            answer: 1,
            why: { ar: 'type="password" يعرض نقاطاً بدل الحروف.',
                   en: 'type="password" shows dots instead of characters.' } },
          { q: { ar: 'ما فائدة type="tel" على الجوال؟', en: 'What does type="tel" give you on mobile?' },
            options: [ { ar: 'يفتح لوحة الأرقام', en: 'It opens the numeric keypad' }, { ar: 'يجري اتصالاً', en: 'It places a call' },
                       { ar: 'يرسل رسالة', en: 'It sends a message' }, { ar: 'لا شيء', en: 'Nothing' } ],
            answer: 0,
            why: { ar: 'النوع الصحيح يحسّن الإدخال دون أي كود إضافي.',
                   en: 'The right type improves input with no extra code.' } },
          { q: { ar: 'أي سمتين تحدّدان أصغر وأكبر قيمة لحقل رقمي؟', en: 'Which two attributes set the smallest and largest value of a number field?' },
            options: [ { ar: 'small وbig', en: 'small and big' }, { ar: 'min وmax', en: 'min and max' },
                       { ar: 'start وend', en: 'start and end' }, { ar: 'from وto', en: 'from and to' } ],
            answer: 1,
            why: { ar: 'min وmax، ويمكن ضبط الزيادة بـ step.',
                   en: 'min and max, with step controlling the increment.' } }
        ]
      },

      {
        id: 'form-controls',
        minutes: 8, level: 'intermediate',
        tags: ['select', 'textarea', 'checkbox', 'radio'],
        title: { ar: 'الاختيارات: select وcheckbox وradio', en: 'Choices: select, checkbox and radio' },
        lede: { ar: 'متى تعطي المستخدم قائمة منسدلة، ومتى مربعات اختيار، ومتى أزرار دائرية.',
                en: 'When to give the user a dropdown, when checkboxes, and when radio buttons.' },
        body: {
          ar: '<h2>النص الطويل: textarea</h2>' +
              '<p><code>&lt;textarea rows="4"&gt;&lt;/textarea&gt;</code> — حقل متعدد الأسطر. له وسم إغلاق، والقيمة الابتدائية تُكتب بين الوسمين لا في <code>value</code>.</p>' +
              '<h2>القائمة المنسدلة: select</h2>' +
              '<p>تتكوّن من <code>&lt;select&gt;</code> وبداخلها <code>&lt;option&gt;</code> لكل خيار، ويمكن تجميع الخيارات بـ <code>&lt;optgroup&gt;</code>. أضف <code>selected</code> للخيار الافتراضي، و<code>multiple</code> للسماح باختيار أكثر من قيمة.</p>' +
              '<h2>مربع الاختيار: checkbox</h2>' +
              '<p>للاختيارات المستقلة (يمكن اختيار أكثر من واحد). أعطِ كل مربع <code>value</code> مختلفة، ويمكن أن تشترك في نفس <code>name</code> لتصل كمجموعة.</p>' +
              '<h2>الزر الدائري: radio</h2>' +
              '<p>للاختيار الواحد من مجموعة. <strong>السرّ</strong>: كل الأزرار في المجموعة يجب أن تحمل <em>نفس</em> قيمة <code>name</code> — بذلك يعرف المتصفح أنها بديلة عن بعضها فيسمح بواحد فقط.</p>' +
              '<div class="callout callout-warn"><span class="ic">🔑</span><div><b>أشهر خطأ</b>إعطاء كل radio اسماً مختلفاً، فيستطيع المستخدم اختيارها كلها معاً. الاسم الموحّد هو ما يجعلها مجموعة واحدة.</div></div>' +
              '<h2>التجميع البصري: fieldset</h2>' +
              '<p><code>&lt;fieldset&gt;</code> مع <code>&lt;legend&gt;</code> يضعان إطاراً وعنواناً حول مجموعة حقول مترابطة — مفيد جداً لمجموعات الـ radio.</p>',
          en: '<h2>Long text: textarea</h2>' +
              '<p><code>&lt;textarea rows="4"&gt;&lt;/textarea&gt;</code> — a multi-line field. It has a closing tag, and its initial value goes between the tags, not in <code>value</code>.</p>' +
              '<h2>The dropdown: select</h2>' +
              '<p>Made of <code>&lt;select&gt;</code> containing an <code>&lt;option&gt;</code> per choice, and options can be grouped with <code>&lt;optgroup&gt;</code>. Add <code>selected</code> for the default, and <code>multiple</code> to allow several values.</p>' +
              '<h2>The checkbox</h2>' +
              '<p>For independent choices (several can be picked). Give each box a distinct <code>value</code>; they may share one <code>name</code> to arrive as a group.</p>' +
              '<h2>The radio button</h2>' +
              '<p>For picking exactly one from a set. <strong>The secret</strong>: every button in the group must carry the <em>same</em> <code>name</code> — that is how the browser knows they are alternatives and allows only one.</p>' +
              '<div class="callout callout-warn"><span class="ic">🔑</span><div><b>The classic mistake</b>Giving each radio a different name, which lets the user select them all. The shared name is what makes them one group.</div></div>' +
              '<h2>Visual grouping: fieldset</h2>' +
              '<p><code>&lt;fieldset&gt;</code> with <code>&lt;legend&gt;</code> draws a border and title around a set of related fields — especially useful for radio groups.</p>'
        },
        example: {
          note: { ar: 'جرّب اختيار أكثر من زر دائري — لن تستطيع، لأنها تشترك في نفس name.',
                  en: 'Try selecting more than one radio — you cannot, because they share one name.' },
          code: {
            ar: '<form>\n  <fieldset>\n    <legend>نوع الاشتراك</legend>\n    <label><input type="radio" name="plan" value="basic" checked> أساسي</label>\n    <label><input type="radio" name="plan" value="pro"> مميّز</label>\n  </fieldset>\n\n  <p>\n    <label for="city">المدينة</label>\n    <select id="city" name="city">\n      <option value="">اختر…</option>\n      <option value="ryd" selected>الرياض</option>\n      <option value="jed">جدة</option>\n    </select>\n  </p>\n\n  <p>\n    <label><input type="checkbox" name="tags" value="news"> النشرة البريدية</label>\n    <label><input type="checkbox" name="tags" value="offers"> العروض</label>\n  </p>\n\n  <p>\n    <label for="msg">ملاحظاتك</label><br>\n    <textarea id="msg" name="msg" rows="3" cols="30">اكتب هنا…</textarea>\n  </p>\n</form>',
            en: '<form>\n  <fieldset>\n    <legend>Plan type</legend>\n    <label><input type="radio" name="plan" value="basic" checked> Basic</label>\n    <label><input type="radio" name="plan" value="pro"> Premium</label>\n  </fieldset>\n\n  <p>\n    <label for="city">City</label>\n    <select id="city" name="city">\n      <option value="">Choose…</option>\n      <option value="ldn" selected>London</option>\n      <option value="par">Paris</option>\n    </select>\n  </p>\n\n  <p>\n    <label><input type="checkbox" name="tags" value="news"> Newsletter</label>\n    <label><input type="checkbox" name="tags" value="offers"> Offers</label>\n  </p>\n\n  <p>\n    <label for="msg">Your notes</label><br>\n    <textarea id="msg" name="msg" rows="3" cols="30">Write here…</textarea>\n  </p>\n</form>'
          }
        },
        challenge: {
          brief: { ar: 'اصنع نموذج استبيان: قائمة منسدلة فيها ثلاثة خيارات، ومجموعة أزرار دائرية باسم واحد، ومربعا اختيار، وحقل نص طويل.',
                   en: 'Build a survey form: a dropdown with three options, a radio group sharing one name, two checkboxes, and a textarea.' },
          starter: { ar: '<form>\n  \n</form>', en: '<form>\n  \n</form>' },
          solution: { ar: '<form>\n  <select name="city">\n    <option>الرياض</option><option>جدة</option><option>الدمام</option>\n  </select>\n  <label><input type="radio" name="g" value="1"> نعم</label>\n  <label><input type="radio" name="g" value="2"> لا</label>\n  <label><input type="checkbox" name="t" value="a"> خيار أ</label>\n  <label><input type="checkbox" name="t" value="b"> خيار ب</label>\n  <textarea name="note" rows="3"></textarea>\n</form>',
                      en: '<form>\n  <select name="city">\n    <option>London</option><option>Paris</option><option>Rome</option>\n  </select>\n  <label><input type="radio" name="g" value="1"> Yes</label>\n  <label><input type="radio" name="g" value="2"> No</label>\n  <label><input type="checkbox" name="t" value="a"> Option A</label>\n  <label><input type="checkbox" name="t" value="b"> Option B</label>\n  <textarea name="note" rows="3"></textarea>\n</form>' },
          checks: [
            { label: { ar: 'توجد قائمة <select> فيها 3 خيارات', en: 'A <select> with three options' },
              hint:  { ar: 'كل خيار داخل <option>…</option>', en: 'Each choice in <option>…</option>' },
              test: function (d) { return has(d, 'select') && n(d, 'select option') >= 3; } },
            { label: { ar: 'يوجد زرّان radio يشتركان في نفس name', en: 'Two radios share the same name' },
              hint:  { ar: 'name="g" على الاثنين معاً', en: 'name="g" on both of them' },
              test: function (d) {
                var r = d.querySelectorAll('input[type="radio"]');
                if (r.length < 2) return false;
                var first = r[0].getAttribute('name');
                if (!first) return false;
                for (var i = 1; i < r.length; i++) { if (r[i].getAttribute('name') === first) return true; }
                return false;
              } },
            { label: { ar: 'يوجد مربّعا اختيار checkbox', en: 'Two checkboxes exist' },
              hint:  { ar: '<input type="checkbox">', en: '<input type="checkbox">' },
              test: function (d) { return n(d, 'input[type="checkbox"]') >= 2; } },
            { label: { ar: 'يوجد حقل نص طويل <textarea>', en: 'A <textarea> exists' },
              hint:  { ar: '<textarea name="note" rows="3"></textarea>', en: '<textarea name="note" rows="3"></textarea>' },
              test: function (d) { return has(d, 'textarea'); } }
          ]
        },
        quiz: [
          { q: { ar: 'كيف تجعل أزرار radio مجموعة واحدة؟', en: 'How do you make radio buttons one group?' },
            options: [ { ar: 'بنفس السمة name', en: 'By sharing the same name' }, { ar: 'بنفس id', en: 'By sharing an id' },
                       { ar: 'بوضعها في div', en: 'By putting them in a div' }, { ar: 'بنفس اللون', en: 'By using one color' } ],
            answer: 0,
            why: { ar: 'الاسم الموحّد يجعل المتصفح يعاملها كبدائل ويسمح بواحد فقط.',
                   en: 'A shared name makes the browser treat them as alternatives, allowing only one.' } },
          { q: { ar: 'أين تُكتب القيمة الابتدائية لـ textarea؟', en: 'Where does a textarea initial value go?' },
            options: [ { ar: 'في السمة value', en: 'In the value attribute' }, { ar: 'بين وسمي الفتح والإغلاق', en: 'Between the opening and closing tags' },
                       { ar: 'في placeholder', en: 'In placeholder' }, { ar: 'لا يمكن', en: 'It is impossible' } ],
            answer: 1,
            why: { ar: 'textarea عنصر ذو محتوى، وليس عنصراً فارغاً مثل input.',
                   en: 'A textarea has content; it is not a void element like input.' } },
          { q: { ar: 'متى تستخدم checkbox بدل radio؟', en: 'When do you use a checkbox instead of a radio?' },
            options: [ { ar: 'عند السماح بأكثر من اختيار', en: 'When several choices are allowed' },
                       { ar: 'عند اختيار واحد فقط', en: 'When only one is allowed' },
                       { ar: 'للنصوص الطويلة', en: 'For long text' }, { ar: 'للصور', en: 'For images' } ],
            answer: 0,
            why: { ar: 'checkbox اختيارات مستقلة، وradio بديل واحد من مجموعة.',
                   en: 'Checkboxes are independent; radios are one-of-a-set.' } }
        ]
      },

      {
        id: 'form-validation',
        minutes: 7, level: 'intermediate',
        tags: ['required', 'pattern', 'validation'],
        title: { ar: 'التحقق من المدخلات', en: 'Input validation' },
        lede: { ar: 'اجعل المتصفح يمنع الأخطاء قبل الإرسال — بلا سطر JavaScript واحد.',
                en: 'Let the browser block mistakes before submission — without a single line of JavaScript.' },
        body: {
          ar: '<h2>سمات التحقق</h2>' +
              '<ul>' +
              '<li><code>required</code> — لا يمكن الإرسال والحقل فارغ.</li>' +
              '<li><code>minlength</code> و<code>maxlength</code> — أقل وأكثر عدد حروف.</li>' +
              '<li><code>min</code> و<code>max</code> — أقل وأكبر قيمة رقمية أو تاريخ.</li>' +
              '<li><code>pattern</code> — نمط تعبير نمطي يجب أن تطابقه القيمة.</li>' +
              '<li><code>type</code> نفسه تحقّق: <code>email</code> يرفض نصاً بلا @، و<code>url</code> يطلب عنواناً صحيحاً.</li>' +
              '</ul>' +
              '<h2>رسائل أوضح</h2>' +
              '<p>أضف <code>title="صف الشكل المطلوب"</code> بجانب <code>pattern</code> ليعرض المتصفح تلميحاً مفهوماً بدل رسالة عامة.</p>' +
              '<div class="callout callout-warn"><span class="ic">🛡️</span><div><b>تحذير أمني مهم</b>تحقّق المتصفح لراحة المستخدم فقط، ويمكن تجاوزه بسهولة. أي بيانات تصل إلى خادمك <strong>يجب</strong> أن يُعاد التحقق منها هناك. اعتبر تحقّق الواجهة تجربة استخدام، لا حماية.</div></div>' +
              '<h2>أمثلة أنماط جاهزة</h2>' +
              '<ul>' +
              '<li>أرقام فقط بطول 10: <code>pattern="[0-9]{10}"</code></li>' +
              '<li>حروف عربية ومسافات: <code>pattern="[\\u0621-\\u064A ]+"</code></li>' +
              '<li>رمز بريدي من 5 أرقام: <code>pattern="\\d{5}"</code></li>' +
              '</ul>',
          en: '<h2>Validation attributes</h2>' +
              '<ul>' +
              '<li><code>required</code> — the form cannot submit while the field is empty.</li>' +
              '<li><code>minlength</code> and <code>maxlength</code> — fewest and most characters.</li>' +
              '<li><code>min</code> and <code>max</code> — smallest and largest number or date.</li>' +
              '<li><code>pattern</code> — a regular expression the value must match.</li>' +
              '<li>The <code>type</code> itself validates: <code>email</code> rejects text without @, and <code>url</code> demands a valid address.</li>' +
              '</ul>' +
              '<h2>Clearer messages</h2>' +
              '<p>Add <code>title="describe the expected format"</code> next to <code>pattern</code> so the browser shows a helpful hint instead of a generic message.</p>' +
              '<div class="callout callout-warn"><span class="ic">🛡️</span><div><b>An important security note</b>Browser validation is a convenience and is trivially bypassed. Any data reaching your server <strong>must</strong> be validated again there. Treat front-end validation as user experience, not protection.</div></div>' +
              '<h2>Ready-made patterns</h2>' +
              '<ul>' +
              '<li>Exactly 10 digits: <code>pattern="[0-9]{10}"</code></li>' +
              '<li>Latin letters and spaces: <code>pattern="[A-Za-z ]+"</code></li>' +
              '<li>A 5-digit postcode: <code>pattern="\\d{5}"</code></li>' +
              '</ul>'
        },
        example: {
          note: { ar: 'اضغط «إرسال» وهو فارغ ولاحظ رسالة المتصفح التلقائية.',
                  en: 'Press Submit while empty and watch the browser message appear.' },
          code: {
            ar: '<form>\n  <p><label>الاسم (3 أحرف فأكثر)<br>\n    <input type="text" name="n" required minlength="3"></label></p>\n  <p><label>البريد<br>\n    <input type="email" name="e" required></label></p>\n  <p><label>الجوال (10 أرقام)<br>\n    <input type="tel" name="t" pattern="[0-9]{10}" title="اكتب 10 أرقام بلا مسافات" required></label></p>\n  <button type="submit">إرسال</button>\n</form>',
            en: '<form>\n  <p><label>Name (3+ characters)<br>\n    <input type="text" name="n" required minlength="3"></label></p>\n  <p><label>Email<br>\n    <input type="email" name="e" required></label></p>\n  <p><label>Phone (10 digits)<br>\n    <input type="tel" name="t" pattern="[0-9]{10}" title="Type 10 digits, no spaces" required></label></p>\n  <button type="submit">Submit</button>\n</form>'
          }
        },
        challenge: {
          brief: { ar: 'اصنع نموذج اتصال محمياً: حقل اسم مطلوب بطول 3 أحرف على الأقل، وحقل بريد مطلوب، وحقل رقم يقبل 10 أرقام فقط عبر pattern، وزر إرسال.',
                   en: 'Build a guarded contact form: a required name field of at least 3 characters, a required email field, a phone field accepting exactly 10 digits via pattern, and a submit button.' },
          starter: { ar: '<form>\n  \n</form>', en: '<form>\n  \n</form>' },
          solution: { ar: '<form>\n  <input type="text" name="n" required minlength="3">\n  <input type="email" name="e" required>\n  <input type="tel" name="t" pattern="[0-9]{10}" title="10 أرقام">\n  <button type="submit">إرسال</button>\n</form>',
                      en: '<form>\n  <input type="text" name="n" required minlength="3">\n  <input type="email" name="e" required>\n  <input type="tel" name="t" pattern="[0-9]{10}" title="10 digits">\n  <button type="submit">Submit</button>\n</form>' },
          checks: [
            { label: { ar: 'يوجد حقل نص مطلوب بـ required', en: 'A required text field' },
              hint:  { ar: 'أضف كلمة required داخل الوسم', en: 'Add the word required inside the tag' },
              test: function (d) { return has(d, 'input[type="text"][required]'); } },
            { label: { ar: 'حقل الاسم له minlength="3" أو أكثر', en: 'The name field has minlength of 3 or more' },
              hint:  { ar: 'minlength="3"', en: 'minlength="3"' },
              test: function (d) {
                var el = d.querySelector('input[type="text"][minlength]');
                return !!el && parseInt(el.getAttribute('minlength'), 10) >= 3;
              } },
            { label: { ar: 'يوجد حقل بريد مطلوب', en: 'A required email field' },
              hint:  { ar: '<input type="email" required>', en: '<input type="email" required>' },
              test: function (d) { return has(d, 'input[type="email"][required]'); } },
            { label: { ar: 'يوجد حقل بـ pattern لعشرة أرقام', en: 'A field with a 10-digit pattern' },
              hint:  { ar: 'pattern="[0-9]{10}"', en: 'pattern="[0-9]{10}"' },
              test: function (d) {
                var el = d.querySelector('input[pattern]');
                if (!el) return false;
                var p = el.getAttribute('pattern') || '';
                return p.indexOf('10') !== -1 || /\{10\}/.test(p);
              } },
            { label: { ar: 'يوجد زر إرسال', en: 'A submit button exists' },
              hint:  { ar: '<button type="submit">إرسال</button>', en: '<button type="submit">Submit</button>' },
              test: function (d) { return has(d, 'button, input[type="submit"]'); } }
          ]
        },
        quiz: [
          { q: { ar: 'أي سمة تمنع إرسال النموذج والحقل فارغ؟', en: 'Which attribute blocks submission while a field is empty?' },
            options: [ { ar: 'needed', en: 'needed' }, { ar: 'required', en: 'required' }, { ar: 'must', en: 'must' }, { ar: 'validate', en: 'validate' } ],
            answer: 1,
            why: { ar: 'required سمة منطقية تُكتب بلا قيمة.',
                   en: 'required is a boolean attribute written with no value.' } },
          { q: { ar: 'هل تحقّق المتصفح كافٍ لحماية بياناتك؟', en: 'Is browser validation enough to protect your data?' },
            options: [ { ar: 'نعم تماماً', en: 'Yes, completely' },
                       { ar: 'لا، يجب التحقق في الخادم أيضاً', en: 'No, the server must validate too' },
                       { ar: 'نعم إذا استخدمت pattern', en: 'Yes, if you use pattern' },
                       { ar: 'نعم على الجوال فقط', en: 'Yes, on mobile only' } ],
            answer: 1,
            why: { ar: 'يمكن تعطيل تحقّق المتصفح بسهولة، فالخادم هو خط الدفاع الحقيقي.',
                   en: 'Browser checks are easily disabled; the server is the real line of defence.' } },
          { q: { ar: 'ما فائدة السمة title مع pattern؟', en: 'What does title add alongside pattern?' },
            options: [ { ar: 'تغيّر عنوان الصفحة', en: 'It changes the page title' },
                       { ar: 'تعرض تلميحاً يشرح الشكل المطلوب', en: 'It shows a hint explaining the expected format' },
                       { ar: 'تلغي التحقق', en: 'It disables validation' },
                       { ar: 'تكبّر الحقل', en: 'It enlarges the field' } ],
            answer: 1,
            why: { ar: 'رسالة واضحة أفضل بكثير من رسالة المتصفح العامة.',
                   en: 'A clear message beats the generic browser one.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 6 — البنية الدلالية / Module 6 — Semantic structure
     =========================================================== */
  MODULES.push({
    id: 'semantics',
    icon: '🏗️',
    title: { ar: 'البنية الدلالية للصفحة', en: 'Semantic page structure' },
    desc:  { ar: 'كيف تقسّم صفحتك بوسوم ذات معنى بدل بحر من div، وكيف تجعلها في متناول الجميع.',
             en: 'How to split your page with meaningful tags instead of a sea of divs, and make it reachable by everyone.' },
    lessons: [

      {
        id: 'div-span',
        minutes: 6, level: 'beginner',
        tags: ['div', 'span', 'block', 'inline'],
        title: { ar: 'div وspan: الفرق بين الكتلة والسطر', en: 'div and span: block vs inline' },
        lede: { ar: 'الوسمان الأكثر استخداماً في الويب — وقاعدة بسيطة تحدّد أيهما تختار.',
                en: 'The two most-used tags on the web — and a simple rule for choosing between them.' },
        body: {
          ar: '<h2>عنصر كتلة وعنصر سطري</h2>' +
              '<ul>' +
              '<li><strong>الكتلة (block)</strong> — تأخذ عرض السطر كاملاً وتبدأ في سطر جديد: <code>div</code>, <code>p</code>, <code>h1</code>, <code>ul</code>, <code>section</code>.</li>' +
              '<li><strong>السطري (inline)</strong> — يأخذ عرض محتواه فقط ويبقى في نفس السطر: <code>span</code>, <code>a</code>, <code>strong</code>, <code>img</code>.</li>' +
              '</ul>' +
              '<h2>لماذا نستخدمهما؟</h2>' +
              '<p><code>div</code> و<code>span</code> <strong>لا معنى لهما</strong> إطلاقاً — وهذه ميزتهما. نستخدمهما كحاويات محايدة لتجميع عناصر ثم تنسيقها بـ CSS أو التعامل معها بـ JavaScript.</p>' +
              '<ul>' +
              '<li><code>&lt;div&gt;</code> — لتجميع كتلة كاملة: بطاقة، شريط جانبي، صف.</li>' +
              '<li><code>&lt;span&gt;</code> — لتمييز جزء من نص داخل جملة: كلمة ملوّنة، سعر، أيقونة.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">🧭</span><div><b>القاعدة الذهبية</b>اسأل أولاً: هل يوجد وسم <em>يصف المعنى</em>؟ إن كان النص فقرة فاستخدم <code>p</code>، وإن كان قائمة تنقّل فاستخدم <code>nav</code>. لا تلجأ إلى <code>div</code> إلا حين لا يوجد وسم دلالي مناسب.</div></div>' +
              '<h2>مرض «حساء الـ div»</h2>' +
              '<p>صفحة مكوّنة من عشرات الـ <code>div</code> المتداخلة تعمل بصرياً، لكنها بلا معنى لمحركات البحث وقارئات الشاشة، وصيانتها كابوس. الدرس التالي هو العلاج.</p>',
          en: '<h2>Block and inline</h2>' +
              '<ul>' +
              '<li><strong>Block</strong> — takes the full line width and starts on a new line: <code>div</code>, <code>p</code>, <code>h1</code>, <code>ul</code>, <code>section</code>.</li>' +
              '<li><strong>Inline</strong> — takes only the width of its content and stays on the same line: <code>span</code>, <code>a</code>, <code>strong</code>, <code>img</code>.</li>' +
              '</ul>' +
              '<h2>Why use them?</h2>' +
              '<p><code>div</code> and <code>span</code> carry <strong>no meaning at all</strong> — and that is their advantage. They are neutral containers for grouping elements so you can style them with CSS or target them with JavaScript.</p>' +
              '<ul>' +
              '<li><code>&lt;div&gt;</code> — to group a whole block: a card, a sidebar, a row.</li>' +
              '<li><code>&lt;span&gt;</code> — to mark part of a sentence: a colored word, a price, an icon.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">🧭</span><div><b>The golden rule</b>Ask first: is there a tag that <em>describes the meaning</em>? If the text is a paragraph use <code>p</code>; if it is a navigation menu use <code>nav</code>. Reach for <code>div</code> only when no semantic tag fits.</div></div>' +
              '<h2>The "div soup" disease</h2>' +
              '<p>A page built from dozens of nested <code>div</code> elements works visually but means nothing to search engines and screen readers, and maintaining it is a nightmare. The next lesson is the cure.</p>'
        },
        example: {
          note: { ar: 'لاحظ: الـ div ينزل سطراً جديداً، والـ span يبقى داخل الجملة.',
                  en: 'Notice: the div drops to a new line while the span stays inside the sentence.' },
          code: {
            ar: '<div style="border:1px solid #999;padding:10px">\n  <h3>بطاقة منتج</h3>\n  <p>السعر: <span style="color:#c00;font-weight:bold">150 ريال</span> فقط</p>\n</div>\n<div style="border:1px solid #999;padding:10px;margin-top:8px">\n  <p>صندوق ثانٍ في سطر جديد.</p>\n</div>',
            en: '<div style="border:1px solid #999;padding:10px">\n  <h3>Product card</h3>\n  <p>Price: <span style="color:#c00;font-weight:bold">150 SAR</span> only</p>\n</div>\n<div style="border:1px solid #999;padding:10px;margin-top:8px">\n  <p>A second box on a new line.</p>\n</div>'
          }
        },
        challenge: {
          brief: { ar: 'اصنع بطاقتي منتج: كل بطاقة عنصر div فيه عنوان وفقرة، وداخل الفقرة span يميّز السعر.',
                   en: 'Create two product cards: each is a div holding a heading and a paragraph, with a span marking the price inside the paragraph.' },
          starter: { ar: '<div>\n  \n</div>', en: '<div>\n  \n</div>' },
          solution: { ar: '<div>\n  <h3>ساعة</h3>\n  <p>السعر: <span>200</span> ريال</p>\n</div>\n<div>\n  <h3>حقيبة</h3>\n  <p>السعر: <span>350</span> ريال</p>\n</div>',
                      en: '<div>\n  <h3>Watch</h3>\n  <p>Price: <span>200</span></p>\n</div>\n<div>\n  <h3>Bag</h3>\n  <p>Price: <span>350</span></p>\n</div>' },
          checks: [
            { label: { ar: 'يوجد عنصرا div', en: 'Two div elements exist' },
              hint:  { ar: 'كل بطاقة في <div> مستقل', en: 'Each card in its own <div>' },
              test: function (d) { return n(d, 'div') >= 2; } },
            { label: { ar: 'كل div فيه عنوان', en: 'Each div contains a heading' },
              hint:  { ar: 'ضع <h3> داخل كل بطاقة', en: 'Put an <h3> inside every card' },
              test: function (d) { return n(d, 'div h1, div h2, div h3, div h4') >= 2; } },
            { label: { ar: 'يوجد <span> داخل فقرة', en: 'A <span> inside a paragraph' },
              hint:  { ar: 'مثال: <p>السعر: <span>200</span></p>', en: 'Example: <p>Price: <span>200</span></p>' },
              test: function (d) { return filled(d, 'p span'); } }
          ]
        },
        quiz: [
          { q: { ar: 'أي عنصر يبدأ في سطر جديد ويأخذ العرض كاملاً؟', en: 'Which element starts a new line and takes the full width?' },
            options: [ { ar: 'span', en: 'span' }, { ar: 'div', en: 'div' }, { ar: 'a', en: 'a' }, { ar: 'strong', en: 'strong' } ],
            answer: 1,
            why: { ar: 'div عنصر كتلة، وspan عنصر سطري.',
                   en: 'div is a block element; span is inline.' } },
          { q: { ar: 'ما المعنى الدلالي لـ div؟', en: 'What is the semantic meaning of div?' },
            options: [ { ar: 'قسم رئيسي', en: 'A main section' }, { ar: 'لا معنى له، حاوية محايدة', en: 'None — a neutral container' },
                       { ar: 'عنوان', en: 'A heading' }, { ar: 'قائمة', en: 'A list' } ],
            answer: 1,
            why: { ar: 'لهذا نفضّل الوسوم الدلالية عليه متى وُجدت.',
                   en: 'That is why we prefer semantic tags whenever one fits.' } },
          { q: { ar: 'لتمييز كلمة داخل جملة، أيهما تستخدم؟', en: 'To mark a word inside a sentence, which do you use?' },
            options: [ { ar: 'div', en: 'div' }, { ar: 'span', en: 'span' }, { ar: 'section', en: 'section' }, { ar: 'article', en: 'article' } ],
            answer: 1,
            why: { ar: 'span سطري فلا يكسر تدفق الجملة.',
                   en: 'span is inline, so it does not break the sentence flow.' } }
        ]
      },

      {
        id: 'semantic-layout',
        minutes: 9, level: 'intermediate',
        tags: ['header', 'nav', 'main', 'footer', 'section'],
        title: { ar: 'وسوم التخطيط الدلالية', en: 'Semantic layout tags' },
        lede: { ar: 'header وnav وmain وsection وarticle وaside وfooter — خريطة صفحتك التي يفهمها الجميع.',
                en: 'header, nav, main, section, article, aside and footer — the page map everyone understands.' },
        body: {
          ar: '<h2>الوسوم السبعة</h2>' +
              '<ul>' +
              '<li><code>&lt;header&gt;</code> — رأس الصفحة أو القسم: الشعار والعنوان.</li>' +
              '<li><code>&lt;nav&gt;</code> — مجموعة روابط التنقّل الرئيسية.</li>' +
              '<li><code>&lt;main&gt;</code> — المحتوى الأساسي الفريد للصفحة. <strong>مرة واحدة فقط</strong> في كل صفحة.</li>' +
              '<li><code>&lt;section&gt;</code> — قسم موضوعي له عنوان.</li>' +
              '<li><code>&lt;article&gt;</code> — محتوى مستقل بذاته يمكن نشره وحده: مقال، تدوينة، تعليق، بطاقة منتج.</li>' +
              '<li><code>&lt;aside&gt;</code> — محتوى جانبي مكمّل: إعلان، روابط ذات صلة.</li>' +
              '<li><code>&lt;footer&gt;</code> — تذييل: حقوق، روابط سفلية، تواصل.</li>' +
              '</ul>' +
              '<h2>section أم article؟</h2>' +
              '<p>اسأل: <em>هل يبقى هذا المحتوى مفهوماً لو اقتطعته ونشرته وحده؟</em> إن كان الجواب نعم فهو <code>article</code>، وإلا فهو <code>section</code>. تدوينة كاملة = article، وقسم «آراء العملاء» داخل الصفحة = section.</p>' +
              '<h2>الفوائد الحقيقية</h2>' +
              '<ul>' +
              '<li><strong>الوصولية</strong>: قارئ الشاشة يتيح القفز مباشرة إلى <code>main</code> أو <code>nav</code>.</li>' +
              '<li><strong>SEO</strong>: محرك البحث يميّز المحتوى الأساسي من التذييل والإعلانات.</li>' +
              '<li><strong>الصيانة</strong>: تفتح ملفاً بعد سنة فتفهم بنيته من أول نظرة.</li>' +
              '</ul>' +
              '<div class="callout callout-note"><span class="ic">📄</span><div><b>الترتيب النموذجي</b><code>header</code> ← <code>nav</code> ← <code>main</code> (وبداخله <code>section</code> و<code>article</code>) ← <code>aside</code> ← <code>footer</code>.</div></div>',
          en: '<h2>The seven tags</h2>' +
              '<ul>' +
              '<li><code>&lt;header&gt;</code> — the top of a page or section: logo and title.</li>' +
              '<li><code>&lt;nav&gt;</code> — the main navigation links.</li>' +
              '<li><code>&lt;main&gt;</code> — the unique primary content. <strong>Only once</strong> per page.</li>' +
              '<li><code>&lt;section&gt;</code> — a thematic section with a heading.</li>' +
              '<li><code>&lt;article&gt;</code> — self-contained content publishable on its own: an article, a post, a comment, a product card.</li>' +
              '<li><code>&lt;aside&gt;</code> — complementary side content: an ad, related links.</li>' +
              '<li><code>&lt;footer&gt;</code> — the footer: copyright, bottom links, contact.</li>' +
              '</ul>' +
              '<h2>section or article?</h2>' +
              '<p>Ask: <em>would this still make sense if I cut it out and published it alone?</em> If yes it is an <code>article</code>; otherwise a <code>section</code>. A full blog post = article; a "customer reviews" block inside a page = section.</p>' +
              '<h2>The real benefits</h2>' +
              '<ul>' +
              '<li><strong>Accessibility</strong>: screen readers let users jump straight to <code>main</code> or <code>nav</code>.</li>' +
              '<li><strong>SEO</strong>: search engines separate primary content from footers and ads.</li>' +
              '<li><strong>Maintenance</strong>: open the file a year later and grasp its structure at a glance.</li>' +
              '</ul>' +
              '<div class="callout callout-note"><span class="ic">📄</span><div><b>The typical order</b><code>header</code> → <code>nav</code> → <code>main</code> (containing <code>section</code> and <code>article</code>) → <code>aside</code> → <code>footer</code>.</div></div>'
        },
        example: {
          note: { ar: 'نفس الشكل يمكن بناؤه بـ div، لكن هذا البناء يفهمه الجميع.',
                  en: 'The same look could be built with divs, but this structure is understood by everyone.' },
          code: {
            ar: '<header>\n  <h1>مدوّنتي</h1>\n  <nav>\n    <a href="#a">الرئيسية</a> |\n    <a href="#b">المقالات</a>\n  </nav>\n</header>\n\n<main>\n  <article>\n    <h2>أول مقال</h2>\n    <p>نص المقال الكامل هنا.</p>\n  </article>\n\n  <section>\n    <h2>آراء القرّاء</h2>\n    <p>ثلاثة تعليقات جديدة.</p>\n  </section>\n</main>\n\n<aside>\n  <h3>روابط مفيدة</h3>\n  <p>توثيق MDN</p>\n</aside>\n\n<footer>\n  <p>جميع الحقوق محفوظة © 2026</p>\n</footer>',
            en: '<header>\n  <h1>My blog</h1>\n  <nav>\n    <a href="#a">Home</a> |\n    <a href="#b">Posts</a>\n  </nav>\n</header>\n\n<main>\n  <article>\n    <h2>First post</h2>\n    <p>The full article text goes here.</p>\n  </article>\n\n  <section>\n    <h2>Reader comments</h2>\n    <p>Three new comments.</p>\n  </section>\n</main>\n\n<aside>\n  <h3>Useful links</h3>\n  <p>MDN documentation</p>\n</aside>\n\n<footer>\n  <p>All rights reserved © 2026</p>\n</footer>'
          }
        },
        challenge: {
          brief: { ar: 'ابنِ هيكل مدوّنة كامل: header فيه عنوان وnav بروابط، ثم main فيه article له عنوان وفقرة، ثم footer.',
                   en: 'Build a complete blog skeleton: a header with a title and a nav with links, then a main containing an article with a heading and paragraph, then a footer.' },
          starter: { ar: '<header>\n  \n</header>\n', en: '<header>\n  \n</header>\n' },
          solution: { ar: '<header>\n  <h1>مدوّنتي</h1>\n  <nav><a href="#h">الرئيسية</a></nav>\n</header>\n<main>\n  <article>\n    <h2>مقالي الأول</h2>\n    <p>نص المقال.</p>\n  </article>\n</main>\n<footer><p>© 2026</p></footer>',
                      en: '<header>\n  <h1>My blog</h1>\n  <nav><a href="#h">Home</a></nav>\n</header>\n<main>\n  <article>\n    <h2>My first post</h2>\n    <p>Post text.</p>\n  </article>\n</main>\n<footer><p>© 2026</p></footer>' },
          checks: [
            { label: { ar: 'يوجد <header> فيه عنوان', en: 'A <header> containing a heading' },
              hint:  { ar: 'ضع <h1> داخل <header>', en: 'Put an <h1> inside <header>' },
              test: function (d) { return filled(d, 'header h1, header h2'); } },
            { label: { ar: 'يوجد <nav> فيه رابط واحد على الأقل', en: 'A <nav> with at least one link' },
              hint:  { ar: '<nav><a href="#">الرئيسية</a></nav>', en: '<nav><a href="#">Home</a></nav>' },
              test: function (d) { return has(d, 'nav a'); } },
            { label: { ar: 'يوجد <main> مرة واحدة فقط', en: 'Exactly one <main>' },
              hint:  { ar: 'main لا يتكرر في الصفحة', en: 'main must not repeat in a page' },
              test: function (d) { return n(d, 'main') === 1; } },
            { label: { ar: 'يوجد <article> فيه عنوان وفقرة', en: 'An <article> with a heading and a paragraph' },
              hint:  { ar: 'ضع article داخل main', en: 'Put the article inside main' },
              test: function (d) { return filled(d, 'article h2, article h1, article h3') && filled(d, 'article p'); } },
            { label: { ar: 'يوجد <footer> فيه نص', en: 'A <footer> with text' },
              hint:  { ar: '<footer><p>© 2026</p></footer>', en: '<footer><p>© 2026</p></footer>' },
              test: function (d) { return filled(d, 'footer'); } }
          ]
        },
        quiz: [
          { q: { ar: 'كم مرة يجوز استخدام <main> في الصفحة؟', en: 'How many times may <main> appear in a page?' },
            options: [ { ar: 'مرة واحدة', en: 'Once' }, { ar: 'مرتان', en: 'Twice' }, { ar: 'بلا حدود', en: 'Unlimited' }, { ar: 'ثلاث مرات', en: 'Three times' } ],
            answer: 0,
            why: { ar: 'main يمثّل المحتوى الأساسي الفريد، فلا يتكرر.',
                   en: 'main represents the unique primary content, so it never repeats.' } },
          { q: { ar: 'ما الفرق الجوهري بين article وsection؟', en: 'What is the core difference between article and section?' },
            options: [ { ar: 'الحجم', en: 'Size' },
                       { ar: 'article مستقل بذاته وقابل للنشر وحده', en: 'article is self-contained and publishable alone' },
                       { ar: 'اللون', en: 'Color' }, { ar: 'لا فرق', en: 'No difference' } ],
            answer: 1,
            why: { ar: 'اختبر بسؤال: هل يبقى مفهوماً منشوراً وحده؟',
                   en: 'Test it: would it still make sense published on its own?' } },
          { q: { ar: 'أين توضع روابط التنقّل الرئيسية؟', en: 'Where do the main navigation links go?' },
            options: [ { ar: 'داخل <nav>', en: 'Inside <nav>' }, { ar: 'داخل <aside>', en: 'Inside <aside>' },
                       { ar: 'داخل <article>', en: 'Inside <article>' }, { ar: 'داخل <head>', en: 'Inside <head>' } ],
            answer: 0,
            why: { ar: 'nav وسم مخصّص لمجموعات روابط التنقّل.',
                   en: 'nav is the dedicated tag for navigation link groups.' } }
        ]
      },

      {
        id: 'global-attributes',
        minutes: 6, level: 'intermediate',
        tags: ['id', 'class', 'style', 'data'],
        title: { ar: 'السمات العامة', en: 'Global attributes' },
        lede: { ar: 'سمات تعمل مع أي عنصر: id وclass وstyle وtitle وhidden وdata-*.',
                en: 'Attributes that work on any element: id, class, style, title, hidden and data-*.' },
        body: {
          ar: '<h2>id وclass</h2>' +
              '<ul>' +
              '<li><code>id</code> — معرّف <strong>فريد</strong> لا يتكرر في الصفحة. يُستخدم للروابط الداخلية <code>#id</code> ولربط <code>label</code> بالحقول.</li>' +
              '<li><code>class</code> — تصنيف يمكن أن يتكرر على مئات العناصر، وهو الأساس في تنسيق CSS. يمكن للعنصر حمل عدة أصناف مفصولة بمسافة: <code>class="card card-large"</code>.</li>' +
              '</ul>' +
              '<h2>سمات عامة أخرى</h2>' +
              '<ul>' +
              '<li><code>style</code> — تنسيق مباشر على العنصر. مفيد للتجربة السريعة، ويُفضّل نقله لملف CSS في المشاريع الحقيقية.</li>' +
              '<li><code>title</code> — تلميح يظهر عند مرور الفأرة.</li>' +
              '<li><code>hidden</code> — يخفي العنصر تماماً.</li>' +
              '<li><code>lang</code> و<code>dir</code> — لغة واتجاه جزء معيّن (مفيد لاقتباس أجنبي داخل نص عربي).</li>' +
              '<li><code>tabindex</code> — يتحكم بترتيب التنقّل بمفتاح Tab.</li>' +
              '<li><code>contenteditable</code> — يجعل أي عنصر قابلاً للتحرير مباشرة في المتصفح!</li>' +
              '</ul>' +
              '<h2>سمات البيانات data-*</h2>' +
              '<p>تستطيع اختراع سماتك الخاصة إذا بدأتها بـ <code>data-</code>، مثل <code>data-price="150"</code> أو <code>data-user-id="7"</code>. تُخزّن معلومة على العنصر تقرأها JavaScript لاحقاً، وهي طريقة صحيحة ومعتمدة رسمياً.</p>' +
              '<div class="callout callout-tip"><span class="ic">🏷️</span><div><b>تسمية جيدة للأصناف</b>سمِّ الصنف حسب <em>الوظيفة</em> لا الشكل: <code>class="warning"</code> أفضل من <code>class="red"</code>، لأنك قد تغيّر اللون غداً فيصبح الاسم كاذباً.</div></div>',
          en: '<h2>id and class</h2>' +
              '<ul>' +
              '<li><code>id</code> — a <strong>unique</strong> identifier that never repeats in a page. Used for in-page links <code>#id</code> and to bind a <code>label</code> to a field.</li>' +
              '<li><code>class</code> — a label that may repeat on hundreds of elements, and the backbone of CSS styling. An element can carry several classes separated by spaces: <code>class="card card-large"</code>.</li>' +
              '</ul>' +
              '<h2>Other global attributes</h2>' +
              '<ul>' +
              '<li><code>style</code> — inline styling on the element. Handy for quick tests; move it to a CSS file in real projects.</li>' +
              '<li><code>title</code> — a tooltip on hover.</li>' +
              '<li><code>hidden</code> — hides the element completely.</li>' +
              '<li><code>lang</code> and <code>dir</code> — language and direction of a specific part (useful for a foreign quote inside Arabic text).</li>' +
              '<li><code>tabindex</code> — controls the Tab key order.</li>' +
              '<li><code>contenteditable</code> — makes any element editable right in the browser!</li>' +
              '</ul>' +
              '<h2>Data attributes: data-*</h2>' +
              '<p>You may invent your own attributes as long as they start with <code>data-</code>, such as <code>data-price="150"</code> or <code>data-user-id="7"</code>. They store information on the element for JavaScript to read later, and they are officially valid HTML.</p>' +
              '<div class="callout callout-tip"><span class="ic">🏷️</span><div><b>Naming classes well</b>Name a class after its <em>role</em>, not its looks: <code>class="warning"</code> beats <code>class="red"</code>, because you may change the color tomorrow and the name becomes a lie.</div></div>'
        },
        example: {
          note: { ar: 'جرّب الكتابة داخل الفقرة الأخيرة مباشرة — contenteditable تسمح بذلك.',
                  en: 'Try typing directly inside the last paragraph — contenteditable allows it.' },
          code: {
            ar: '<p id="intro" class="lead" title="مرّر الفأرة">فقرة لها id وclass وtitle.</p>\n<p hidden>لن تراني أبداً.</p>\n<p data-price="150" data-currency="SAR">منتج عليه بيانات مخفية.</p>\n<p lang="en" dir="ltr">This part is English inside an Arabic page.</p>\n<p contenteditable="true" style="border:1px dashed #888;padding:8px">اضغط هنا واكتب!</p>',
            en: '<p id="intro" class="lead" title="hover me">A paragraph with id, class and title.</p>\n<p hidden>You will never see me.</p>\n<p data-price="150" data-currency="SAR">A product carrying hidden data.</p>\n<p lang="ar" dir="rtl">هذا الجزء عربي داخل صفحة إنجليزية.</p>\n<p contenteditable="true" style="border:1px dashed #888;padding:8px">Click here and type!</p>'
          }
        },
        challenge: {
          brief: { ar: 'اصنع بطاقة منتج: عنصر يحمل id فريداً وclass، وعنصر يحمل سمة data- من اختيارك، وعنصر مخفي بـ hidden.',
                   en: 'Create a product card: an element with a unique id and a class, an element carrying a data- attribute of your choice, and an element hidden with hidden.' },
          starter: { ar: '<div>\n  \n</div>', en: '<div>\n  \n</div>' },
          solution: { ar: '<div id="p1" class="card">\n  <h3>سماعات</h3>\n  <p data-price="299">السعر معروض في البيانات</p>\n  <p hidden>ملاحظة داخلية</p>\n</div>',
                      en: '<div id="p1" class="card">\n  <h3>Headphones</h3>\n  <p data-price="299">The price lives in the data</p>\n  <p hidden>Internal note</p>\n</div>' },
          checks: [
            { label: { ar: 'يوجد عنصر يحمل id وclass معاً', en: 'An element carries both id and class' },
              hint:  { ar: 'مثال: <div id="p1" class="card">', en: 'Example: <div id="p1" class="card">' },
              test: function (d) { return has(d, '[id][class]'); } },
            { label: { ar: 'يوجد عنصر يحمل سمة تبدأ بـ data-', en: 'An element carries a data- attribute' },
              hint:  { ar: 'مثال: data-price="299"', en: 'Example: data-price="299"' },
              test: function (d, raw) { return /\sdata-[a-z-]+\s*=/.test(raw); } },
            { label: { ar: 'يوجد عنصر مخفي بـ hidden', en: 'An element is hidden with hidden' },
              hint:  { ar: 'اكتب hidden داخل الوسم بلا قيمة', en: 'Write hidden inside the tag with no value' },
              test: function (d) { return has(d, '[hidden]'); } },
            { label: { ar: 'قيمة الـ id غير مكررة في الصفحة', en: 'The id value is not duplicated' },
              hint:  { ar: 'كل id يجب أن يكون فريداً', en: 'Every id must be unique' },
              test: function (d) {
                var els = d.querySelectorAll('[id]'), seen = {};
                for (var i = 0; i < els.length; i++) {
                  var v = els[i].getAttribute('id');
                  if (seen[v]) return false;
                  seen[v] = true;
                }
                return els.length > 0;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'أي سمة يجب ألا تتكرر في الصفحة؟', en: 'Which attribute value must never repeat in a page?' },
            options: [ { ar: 'class', en: 'class' }, { ar: 'id', en: 'id' }, { ar: 'style', en: 'style' }, { ar: 'title', en: 'title' } ],
            answer: 1,
            why: { ar: 'id فريد؛ التكرار يكسر الروابط الداخلية وربط التسميات.',
                   en: 'id is unique; duplicates break in-page links and label binding.' } },
          { q: { ar: 'كيف تخزّن بياناتك الخاصة على عنصر بشكل صحيح؟', en: 'How do you correctly store custom data on an element?' },
            options: [ { ar: 'بسمة عشوائية مثل price="1"', en: 'A random attribute like price="1"' },
                       { ar: 'بسمة تبدأ بـ data- مثل data-price="1"', en: 'An attribute starting with data-, like data-price="1"' },
                       { ar: 'في تعليق HTML', en: 'In an HTML comment' }, { ar: 'في السمة id', en: 'In the id attribute' } ],
            answer: 1,
            why: { ar: 'سمات data-* معتمدة رسمياً وتقرأها JavaScript بسهولة.',
                   en: 'data-* attributes are officially valid and easy to read from JavaScript.' } },
          { q: { ar: 'ما الاسم الأفضل لصنف تحذير؟', en: 'What is the better class name for a warning?' },
            options: [ { ar: 'class="red"', en: 'class="red"' }, { ar: 'class="warning"', en: 'class="warning"' },
                       { ar: 'class="c1"', en: 'class="c1"' }, { ar: 'class="x"', en: 'class="x"' } ],
            answer: 1,
            why: { ar: 'التسمية بالوظيفة تبقى صحيحة حتى لو تغيّر اللون.',
                   en: 'Naming by role stays true even when the color changes.' } }
        ]
      },

      {
        id: 'accessibility',
        minutes: 8, level: 'advanced',
        tags: ['a11y', 'وصولية', 'aria'],
        title: { ar: 'الوصولية: موقع للجميع', en: 'Accessibility: a site for everyone' },
        lede: { ar: 'كيف تجعل صفحتك قابلة للاستخدام لمن لا يرى الشاشة أو لا يستطيع استخدام الفأرة.',
                en: 'How to make your page usable for people who cannot see the screen or use a mouse.' },
        body: {
          ar: '<h2>لماذا؟</h2>' +
              '<p>ملايين المستخدمين يتصفّحون بقارئ شاشة، أو بلوحة المفاتيح وحدها، أو بتكبير كبير للخط. الوصولية ليست ميزة إضافية بل جزء من إتقان العمل — وغالباً تحسّن التجربة للجميع.</p>' +
              '<h2>ستة مكاسب سريعة</h2>' +
              '<ol>' +
              '<li><strong>وسوم دلالية</strong>: استخدم <code>nav</code> و<code>main</code> و<code>button</code> بدل <code>div</code> قابلة للنقر. الوسم الصحيح يأتي بسلوك لوحة المفاتيح مجاناً.</li>' +
              '<li><strong>alt لكل صورة</strong>: وصف مفيد، أو <code>alt=""</code> للصور الزخرفية.</li>' +
              '<li><strong>label لكل حقل</strong>: بلا استثناء.</li>' +
              '<li><strong>ترتيب العناوين</strong>: h1 ثم h2 ثم h3 بلا قفز.</li>' +
              '<li><strong>نص رابط واضح</strong>: يصف الوجهة لا «اضغط هنا».</li>' +
              '<li><strong>lang صحيحة</strong>: لينطق قارئ الشاشة الكلمات بلغتها.</li>' +
              '</ol>' +
              '<h2>عندما لا يكفي HTML: ARIA</h2>' +
              '<ul>' +
              '<li><code>aria-label</code> — اسم بديل لعنصر بلا نص ظاهر (زر أيقونة مثلاً).</li>' +
              '<li><code>aria-hidden="true"</code> — أخفِ عنصراً زخرفياً عن قارئ الشاشة.</li>' +
              '<li><code>role</code> — يعطي دوراً لعنصر لا يملكه.</li>' +
              '</ul>' +
              '<div class="callout callout-warn"><span class="ic">⚖️</span><div><b>القاعدة الأولى في ARIA</b>لا تستخدم ARIA إن كان هناك وسم HTML يؤدي الغرض. <code>&lt;button&gt;</code> حقيقي أفضل دائماً من <code>&lt;div role="button"&gt;</code>، لأنه يعمل بلوحة المفاتيح ويستجيب لـ Enter وSpace تلقائياً.</div></div>' +
              '<h2>اختبار سريع بلا أدوات</h2>' +
              '<p>ضع الفأرة جانباً وتنقّل في صفحتك بمفتاح <kbd>Tab</kbd> وحده. هل تصل لكل زر ورابط؟ هل ترى إطار التركيز بوضوح؟ إن كان الجواب لا، فأمامك عمل.</p>',
          en: '<h2>Why?</h2>' +
              '<p>Millions of people browse with a screen reader, with the keyboard alone, or with large text zoom. Accessibility is not a bonus feature but part of doing the job well — and it usually improves the experience for everyone.</p>' +
              '<h2>Six quick wins</h2>' +
              '<ol>' +
              '<li><strong>Semantic tags</strong>: use <code>nav</code>, <code>main</code> and <code>button</code> instead of clickable <code>div</code> elements. The right tag brings keyboard behaviour for free.</li>' +
              '<li><strong>alt on every image</strong>: a useful description, or <code>alt=""</code> for decorative ones.</li>' +
              '<li><strong>A label on every field</strong>: no exceptions.</li>' +
              '<li><strong>Ordered headings</strong>: h1 then h2 then h3, with no jumps.</li>' +
              '<li><strong>Clear link text</strong>: describe the destination, never "click here".</li>' +
              '<li><strong>Correct lang</strong>: so the screen reader pronounces words in their language.</li>' +
              '</ol>' +
              '<h2>When HTML is not enough: ARIA</h2>' +
              '<ul>' +
              '<li><code>aria-label</code> — an alternative name for an element with no visible text (an icon button, say).</li>' +
              '<li><code>aria-hidden="true"</code> — hide a decorative element from screen readers.</li>' +
              '<li><code>role</code> — gives an element a role it does not natively have.</li>' +
              '</ul>' +
              '<div class="callout callout-warn"><span class="ic">⚖️</span><div><b>The first rule of ARIA</b>Do not use ARIA if an HTML tag already does the job. A real <code>&lt;button&gt;</code> always beats <code>&lt;div role="button"&gt;</code>, because it works with the keyboard and responds to Enter and Space automatically.</div></div>' +
              '<h2>A quick test with no tools</h2>' +
              '<p>Put the mouse aside and move through your page with <kbd>Tab</kbd> alone. Can you reach every button and link? Is the focus ring clearly visible? If not, you have work to do.</p>'
        },
        example: {
          note: { ar: 'استخدم مفتاح Tab داخل المعاينة ولاحظ ترتيب التنقل وإطار التركيز.',
                  en: 'Press Tab inside the preview and watch the focus order and focus ring.' },
          code: {
            ar: '<nav aria-label="التنقّل الرئيسي">\n  <a href="#a">الرئيسية</a>\n  <a href="#b">من نحن</a>\n</nav>\n\n<button aria-label="إغلاق النافذة">✕</button>\n\n<img src="https://picsum.photos/120/80" alt="فريق العمل في اجتماع">\n<span aria-hidden="true">🎨</span> رمز زخرفي يتجاهله قارئ الشاشة\n\n<p><label for="q">ابحث</label>\n<input id="q" type="search" name="q"></p>',
            en: '<nav aria-label="Main navigation">\n  <a href="#a">Home</a>\n  <a href="#b">About</a>\n</nav>\n\n<button aria-label="Close dialog">✕</button>\n\n<img src="https://picsum.photos/120/80" alt="The team in a meeting">\n<span aria-hidden="true">🎨</span> a decorative icon screen readers skip\n\n<p><label for="q">Search</label>\n<input id="q" type="search" name="q"></p>'
          }
        },
        challenge: {
          brief: { ar: 'اصنع شريط أدوات متاحاً: زر أيقونة له aria-label، وصورة لها alt وصفي، وحقل بحث مرتبط بـ label، ورمز زخرفي بـ aria-hidden.',
                   en: 'Build an accessible toolbar: an icon button with aria-label, an image with descriptive alt, a search field bound to a label, and a decorative icon with aria-hidden.' },
          starter: { ar: '<nav>\n  \n</nav>', en: '<nav>\n  \n</nav>' },
          solution: { ar: '<nav aria-label="أدوات">\n  <button aria-label="بحث">🔍</button>\n  <img src="https://picsum.photos/80/60" alt="شعار الموقع">\n  <label for="s">ابحث</label>\n  <input id="s" type="search">\n  <span aria-hidden="true">★</span>\n</nav>',
                      en: '<nav aria-label="Tools">\n  <button aria-label="Search">🔍</button>\n  <img src="https://picsum.photos/80/60" alt="Site logo">\n  <label for="s">Search</label>\n  <input id="s" type="search">\n  <span aria-hidden="true">★</span>\n</nav>' },
          checks: [
            { label: { ar: 'يوجد زر <button> له aria-label', en: 'A <button> with an aria-label' },
              hint:  { ar: '<button aria-label="بحث">🔍</button>', en: '<button aria-label="Search">🔍</button>' },
              test: function (d) { return attrFilled(d, 'button[aria-label]', 'aria-label'); } },
            { label: { ar: 'توجد صورة لها alt وصفي', en: 'An image with descriptive alt' },
              hint:  { ar: 'alt="وصف واضح"', en: 'alt="a clear description"' },
              test: function (d) {
                var im = d.querySelectorAll('img');
                for (var i = 0; i < im.length; i++) {
                  var a = im[i].getAttribute('alt');
                  if (a && a.trim().length >= 3) return true;
                }
                return false;
              } },
            { label: { ar: 'حقل الإدخال مرتبط بـ label عبر for/id', en: 'The input is bound to a label via for/id' },
              hint:  { ar: 'label for="s" مع input id="s"', en: 'label for="s" with input id="s"' },
              test: function (d) {
                var l = d.querySelectorAll('label[for]');
                for (var i = 0; i < l.length; i++) {
                  var el = d.getElementById(l[i].getAttribute('for'));
                  if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return true;
                }
                return false;
              } },
            { label: { ar: 'يوجد عنصر زخرفي بـ aria-hidden="true"', en: 'A decorative element with aria-hidden="true"' },
              hint:  { ar: '<span aria-hidden="true">★</span>', en: '<span aria-hidden="true">★</span>' },
              test: function (d) { return has(d, '[aria-hidden="true"]'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما القاعدة الأولى في استخدام ARIA؟', en: 'What is the first rule of ARIA?' },
            options: [ { ar: 'استخدمها في كل عنصر', en: 'Use it on every element' },
                       { ar: 'لا تستخدمها إن وُجد وسم HTML مناسب', en: 'Do not use it if a suitable HTML tag exists' },
                       { ar: 'استخدمها للصور فقط', en: 'Use it only for images' },
                       { ar: 'لا تستخدمها أبداً', en: 'Never use it' } ],
            answer: 1,
            why: { ar: 'الوسم الأصلي يأتي بسلوك لوحة المفاتيح والدلالة جاهزين.',
                   en: 'A native tag brings keyboard behaviour and semantics ready-made.' } },
          { q: { ar: 'كيف تختبر الوصولية بسرعة بلا أدوات؟', en: 'How do you quickly test accessibility with no tools?' },
            options: [ { ar: 'تكبّر الخط', en: 'Enlarge the font' }, { ar: 'تتنقّل بمفتاح Tab وحده', en: 'Navigate with the Tab key alone' },
                       { ar: 'تغيّر اللون', en: 'Change the colors' }, { ar: 'تحذف الصور', en: 'Delete the images' } ],
            answer: 1,
            why: { ar: 'التنقل بلوحة المفاتيح يكشف العناصر غير القابلة للوصول فوراً.',
                   en: 'Keyboard navigation immediately reveals unreachable elements.' } },
          { q: { ar: 'ما وظيفة aria-hidden="true"؟', en: 'What does aria-hidden="true" do?' },
            options: [ { ar: 'يخفي العنصر بصرياً', en: 'Hides the element visually' },
                       { ar: 'يخفيه عن قارئ الشاشة فقط', en: 'Hides it from screen readers only' },
                       { ar: 'يحذف العنصر', en: 'Deletes the element' }, { ar: 'يلوّن العنصر', en: 'Colors the element' } ],
            answer: 1,
            why: { ar: 'يبقى مرئياً للعين لكن يتجاهله قارئ الشاشة — مناسب للزخارف.',
                   en: 'It stays visible to the eye but screen readers skip it — ideal for decoration.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 7 — الوسائط / Module 7 — Media & embedding
     =========================================================== */
  MODULES.push({
    id: 'media',
    icon: '🎬',
    title: { ar: 'الوسائط والتضمين', en: 'Media and embedding' },
    desc:  { ar: 'فيديو وصوت وخرائط وصور متجاوبة — كيف تُدخل العالم كله داخل صفحتك.',
             en: 'Video, audio, maps and responsive images — how to bring the whole world into your page.' },
    lessons: [

      {
        id: 'video-audio',
        minutes: 7, level: 'intermediate',
        tags: ['video', 'audio', 'source'],
        title: { ar: 'الفيديو والصوت', en: 'Video and audio' },
        lede: { ar: 'مشغّل وسائط كامل بسطر واحد — بلا أي إضافات أو مكتبات.',
                en: 'A complete media player in one line — no plugins, no libraries.' },
        body: {
          ar: '<h2>الفيديو</h2>' +
              '<p><code>&lt;video src="clip.mp4" controls&gt;&lt;/video&gt;</code></p>' +
              '<p>أهم السمات:</p>' +
              '<ul>' +
              '<li><code>controls</code> — يعرض أزرار التشغيل والصوت. بدونها لا يستطيع المستخدم فعل شيء.</li>' +
              '<li><code>poster</code> — صورة تظهر قبل التشغيل.</li>' +
              '<li><code>autoplay</code> — تشغيل تلقائي. المتصفحات ترفضه <strong>إلا</strong> مع <code>muted</code>.</li>' +
              '<li><code>loop</code> — إعادة لا نهائية.</li>' +
              '<li><code>preload="none"</code> — لا تحمّل الفيديو حتى يطلبه المستخدم (أسرع للصفحة).</li>' +
              '<li><code>width</code> — العرض بالبكسل.</li>' +
              '</ul>' +
              '<h2>عدة مصادر</h2>' +
              '<p>ضع أكثر من <code>&lt;source&gt;</code> بداخل الفيديو بصيغ مختلفة، فيختار المتصفح أول صيغة يدعمها، ويعرض النص الاحتياطي إن فشل الجميع.</p>' +
              '<h2>الصوت</h2>' +
              '<p><code>&lt;audio src="song.mp3" controls&gt;&lt;/audio&gt;</code> — نفس المنطق تماماً وبنفس السمات.</p>' +
              '<h2>الترجمة والوصولية</h2>' +
              '<p><code>&lt;track kind="captions" src="ar.vtt" srclang="ar" label="العربية"&gt;</code> يضيف ترجمة نصية داخل الفيديو — ضرورية لضعاف السمع ومفيدة لمن يشاهد بلا صوت.</p>' +
              '<div class="callout callout-warn"><span class="ic">🔇</span><div><b>لا تشغّل الصوت تلقائياً</b>التشغيل التلقائي بصوت مزعج للمستخدم وترفضه المتصفحات أصلاً. إن أردت خلفية متحركة فاجمع <code>autoplay muted loop playsinline</code>.</div></div>',
          en: '<h2>Video</h2>' +
              '<p><code>&lt;video src="clip.mp4" controls&gt;&lt;/video&gt;</code></p>' +
              '<p>The key attributes:</p>' +
              '<ul>' +
              '<li><code>controls</code> — shows play and volume buttons. Without it the user can do nothing.</li>' +
              '<li><code>poster</code> — an image shown before playback.</li>' +
              '<li><code>autoplay</code> — auto play. Browsers block it <strong>unless</strong> combined with <code>muted</code>.</li>' +
              '<li><code>loop</code> — endless repeat.</li>' +
              '<li><code>preload="none"</code> — do not download until the user asks (faster page).</li>' +
              '<li><code>width</code> — width in pixels.</li>' +
              '</ul>' +
              '<h2>Multiple sources</h2>' +
              '<p>Put several <code>&lt;source&gt;</code> tags inside the video with different formats; the browser picks the first it supports and shows the fallback text if none work.</p>' +
              '<h2>Audio</h2>' +
              '<p><code>&lt;audio src="song.mp3" controls&gt;&lt;/audio&gt;</code> — exactly the same logic and attributes.</p>' +
              '<h2>Captions and accessibility</h2>' +
              '<p><code>&lt;track kind="captions" src="en.vtt" srclang="en" label="English"&gt;</code> adds captions inside the video — essential for deaf users and handy for anyone watching without sound.</p>' +
              '<div class="callout callout-warn"><span class="ic">🔇</span><div><b>Never autoplay with sound</b>Autoplaying audio annoys users and browsers block it anyway. For a moving background, combine <code>autoplay muted loop playsinline</code>.</div></div>'
        },
        example: {
          note: { ar: 'الفيديو هنا من مصدر مفتوح للتجربة. لاحظ صورة الـ poster قبل التشغيل.',
                  en: 'The video here is an open sample. Notice the poster image before playback.' },
          code: {
            ar: '<video controls width="420" poster="https://picsum.photos/id/1043/420/236" preload="none">\n  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">\n  متصفحك لا يدعم عنصر الفيديو.\n</video>\n\n<p>ملف صوتي:</p>\n<audio controls src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3">\n  متصفحك لا يدعم عنصر الصوت.\n</audio>',
            en: '<video controls width="420" poster="https://picsum.photos/id/1043/420/236" preload="none">\n  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">\n  Your browser does not support the video element.\n</video>\n\n<p>An audio file:</p>\n<audio controls src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3">\n  Your browser does not support the audio element.\n</audio>'
          }
        },
        challenge: {
          brief: { ar: 'أضف مشغّل فيديو فيه controls وposter وعرض محدّد، ومصدر <source>، ونص احتياطي بالداخل، ثم مشغّل صوت بـ controls.',
                   en: 'Add a video player with controls, a poster and a set width, a <source> tag and fallback text inside, then an audio player with controls.' },
          starter: { ar: '<video>\n  \n</video>', en: '<video>\n  \n</video>' },
          solution: { ar: '<video controls width="400" poster="https://picsum.photos/400/220">\n  <source src="movie.mp4" type="video/mp4">\n  متصفحك لا يدعم الفيديو.\n</video>\n<audio controls src="song.mp3"></audio>',
                      en: '<video controls width="400" poster="https://picsum.photos/400/220">\n  <source src="movie.mp4" type="video/mp4">\n  Your browser does not support video.\n</video>\n<audio controls src="song.mp3"></audio>' },
          checks: [
            { label: { ar: 'يوجد <video> بسمة controls', en: 'A <video> with controls' },
              hint:  { ar: 'أضف كلمة controls داخل الوسم', en: 'Add the word controls inside the tag' },
              test: function (d) { return has(d, 'video[controls]'); } },
            { label: { ar: 'الفيديو له poster وwidth', en: 'The video has a poster and a width' },
              hint:  { ar: 'poster="صورة.jpg" width="400"', en: 'poster="image.jpg" width="400"' },
              test: function (d) { return has(d, 'video[poster][width]'); } },
            { label: { ar: 'يوجد <source> داخل الفيديو', en: 'A <source> inside the video' },
              hint:  { ar: '<source src="movie.mp4" type="video/mp4">', en: '<source src="movie.mp4" type="video/mp4">' },
              test: function (d) { return has(d, 'video source[src]'); } },
            { label: { ar: 'يوجد <audio> بسمة controls', en: 'An <audio> with controls' },
              hint:  { ar: '<audio controls src="song.mp3"></audio>', en: '<audio controls src="song.mp3"></audio>' },
              test: function (d) { return has(d, 'audio[controls]'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما السمة التي تُظهر أزرار التحكم في الفيديو؟', en: 'Which attribute shows the video control buttons?' },
            options: [ { ar: 'buttons', en: 'buttons' }, { ar: 'controls', en: 'controls' }, { ar: 'player', en: 'player' }, { ar: 'ui', en: 'ui' } ],
            answer: 1,
            why: { ar: 'بدون controls يظهر الفيديو بلا أي أزرار.',
                   en: 'Without controls the video appears with no buttons at all.' } },
          { q: { ar: 'متى يسمح المتصفح بالتشغيل التلقائي؟', en: 'When does the browser allow autoplay?' },
            options: [ { ar: 'دائماً', en: 'Always' }, { ar: 'عندما يكون الفيديو صامتاً muted', en: 'When the video is muted' },
                       { ar: 'في الوضع الليلي', en: 'In dark mode' }, { ar: 'أبداً', en: 'Never' } ],
            answer: 1,
            why: { ar: 'الصوت التلقائي مزعج، فالمتصفحات تشترط muted.',
                   en: 'Automatic sound is intrusive, so browsers require muted.' } },
          { q: { ar: 'ما فائدة وسم <track>؟', en: 'What is the <track> tag for?' },
            options: [ { ar: 'إضافة ترجمة نصية', en: 'Adding captions or subtitles' }, { ar: 'تسريع الفيديو', en: 'Speeding up the video' },
                       { ar: 'إضافة إعلان', en: 'Adding an advert' }, { ar: 'تغيير الجودة', en: 'Changing quality' } ],
            answer: 0,
            why: { ar: 'الترجمة ضرورية لضعاف السمع ومفيدة للجميع.',
                   en: 'Captions are essential for deaf users and useful for everyone.' } }
        ]
      },

      {
        id: 'iframe',
        minutes: 6, level: 'intermediate',
        tags: ['iframe', 'embed', 'youtube'],
        title: { ar: 'التضمين: iframe', en: 'Embedding: iframe' },
        lede: { ar: 'نافذة داخل صفحتك تعرض موقعاً آخر: خريطة، فيديو يوتيوب، أو نموذجاً خارجياً.',
                en: 'A window inside your page showing another site: a map, a YouTube video, or an external form.' },
        body: {
          ar: '<h2>الفكرة</h2>' +
              '<p><code>&lt;iframe src="https://example.com"&gt;&lt;/iframe&gt;</code> يفتح صفحة كاملة داخل مستطيل في صفحتك. الاستخدام الأشهر: فيديوهات يوتيوب وخرائط جوجل.</p>' +
              '<h2>سمات مهمة</h2>' +
              '<ul>' +
              '<li><code>title</code> — <strong>ضرورية للوصولية</strong>: تصف ما بداخل الإطار لقارئ الشاشة.</li>' +
              '<li><code>width</code> و<code>height</code> — أبعاد الإطار.</li>' +
              '<li><code>loading="lazy"</code> — لا تحمّله حتى يقترب من الشاشة.</li>' +
              '<li><code>allowfullscreen</code> — يسمح بملء الشاشة للفيديو.</li>' +
              '<li><code>sandbox</code> — يقيّد صلاحيات المحتوى المضمَّن (يمنع السكربتات والنوافذ المنبثقة).</li>' +
              '</ul>' +
              '<h2>كيف تضمّن فيديو يوتيوب؟</h2>' +
              '<ol>' +
              '<li>افتح الفيديو على يوتيوب.</li>' +
              '<li>اضغط «مشاركة» ثم «تضمين».</li>' +
              '<li>انسخ كود الـ iframe والصقه في صفحتك.</li>' +
              '</ol>' +
              '<p>الصيغة تكون: <code>https://www.youtube.com/embed/VIDEO_ID</code></p>' +
              '<div class="callout callout-warn"><span class="ic">🔐</span><div><b>انتبه للأمان والأداء</b>لا تضمّن إلا مواقع تثق بها. وكل iframe صفحة كاملة تُحمَّل، فكثرتها تبطئ موقعك بشدة — استخدم <code>loading="lazy"</code> ولا تضع عشرة إطارات في صفحة واحدة.</div></div>' +
              '<div class="callout callout-note"><span class="ic">🚫</span><div><b>لماذا لا تعمل بعض المواقع داخل iframe؟</b>كثير من المواقع (مثل جوجل وفيسبوك) تمنع تضمين نفسها عبر ترويسة <code>X-Frame-Options</code> حمايةً من الاحتيال. سيظهر الإطار فارغاً، وهذا ليس خطأ في كودك.</div></div>',
          en: '<h2>The idea</h2>' +
              '<p><code>&lt;iframe src="https://example.com"&gt;&lt;/iframe&gt;</code> opens a whole page inside a rectangle on your page. The most common uses: YouTube videos and Google Maps.</p>' +
              '<h2>Important attributes</h2>' +
              '<ul>' +
              '<li><code>title</code> — <strong>required for accessibility</strong>: it describes the frame content to screen readers.</li>' +
              '<li><code>width</code> and <code>height</code> — the frame dimensions.</li>' +
              '<li><code>loading="lazy"</code> — do not load until it nears the viewport.</li>' +
              '<li><code>allowfullscreen</code> — lets a video go full screen.</li>' +
              '<li><code>sandbox</code> — restricts what the embedded content may do (blocks scripts and popups).</li>' +
              '</ul>' +
              '<h2>How to embed a YouTube video</h2>' +
              '<ol>' +
              '<li>Open the video on YouTube.</li>' +
              '<li>Click Share, then Embed.</li>' +
              '<li>Copy the iframe code and paste it into your page.</li>' +
              '</ol>' +
              '<p>The form is: <code>https://www.youtube.com/embed/VIDEO_ID</code></p>' +
              '<div class="callout callout-warn"><span class="ic">🔐</span><div><b>Mind security and performance</b>Only embed sites you trust. Every iframe is a full page load, so many of them slow your site badly — use <code>loading="lazy"</code> and never put ten frames on one page.</div></div>' +
              '<div class="callout callout-note"><span class="ic">🚫</span><div><b>Why do some sites refuse to load in an iframe?</b>Many sites (Google and Facebook among them) forbid being framed via the <code>X-Frame-Options</code> header, to prevent click fraud. The frame shows up blank — that is not a bug in your code.</div></div>'
        },
        example: {
          note: { ar: 'المثال يضمّن صفحة تجريبية آمنة. جرّب تغيير الأبعاد.',
                  en: 'The example embeds a safe demo page. Try changing the dimensions.' },
          code: {
            ar: '<iframe\n  src="https://example.com"\n  title="صفحة تجريبية مضمّنة"\n  width="100%"\n  height="220"\n  loading="lazy"\n  style="border:1px solid #ccc;border-radius:8px">\n</iframe>\n\n<p>وهكذا يبدو تضمين فيديو يوتيوب (استبدل المعرّف):</p>\n<pre><code>&lt;iframe width="560" height="315"\n  src="https://www.youtube.com/embed/VIDEO_ID"\n  title="شرح الدرس"\n  allowfullscreen&gt;&lt;/iframe&gt;</code></pre>',
            en: '<iframe\n  src="https://example.com"\n  title="An embedded demo page"\n  width="100%"\n  height="220"\n  loading="lazy"\n  style="border:1px solid #ccc;border-radius:8px">\n</iframe>\n\n<p>And this is how a YouTube embed looks (replace the id):</p>\n<pre><code>&lt;iframe width="560" height="315"\n  src="https://www.youtube.com/embed/VIDEO_ID"\n  title="Lesson explanation"\n  allowfullscreen&gt;&lt;/iframe&gt;</code></pre>'
          }
        },
        challenge: {
          brief: { ar: 'ضمّن صفحة داخل موقعك: iframe له src وtitle وheight وloading="lazy".',
                   en: 'Embed a page in your site: an iframe with src, title, height and loading="lazy".' },
          starter: { ar: '<iframe></iframe>', en: '<iframe></iframe>' },
          solution: { ar: '<iframe src="https://example.com" title="موقع تجريبي" width="100%" height="200" loading="lazy"></iframe>',
                      en: '<iframe src="https://example.com" title="A demo site" width="100%" height="200" loading="lazy"></iframe>' },
          checks: [
            { label: { ar: 'يوجد <iframe> له src', en: 'An <iframe> with src' },
              hint:  { ar: 'src="https://example.com"', en: 'src="https://example.com"' },
              test: function (d) { return has(d, 'iframe[src]'); } },
            { label: { ar: 'الإطار يحمل title وصفياً', en: 'The frame carries a descriptive title' },
              hint:  { ar: 'title مطلوب لقارئ الشاشة', en: 'title is required for screen readers' },
              test: function (d) { return attrFilled(d, 'iframe[title]', 'title'); } },
            { label: { ar: 'الإطار له ارتفاع height', en: 'The frame has a height' },
              hint:  { ar: 'height="200"', en: 'height="200"' },
              test: function (d) { return has(d, 'iframe[height]'); } },
            { label: { ar: 'يستخدم loading="lazy"', en: 'It uses loading="lazy"' },
              hint:  { ar: 'أضف loading="lazy" للأداء', en: 'Add loading="lazy" for performance' },
              test: function (d) { return has(d, 'iframe[loading="lazy"]'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما السمة الضرورية في iframe للوصولية؟', en: 'Which iframe attribute is required for accessibility?' },
            options: [ { ar: 'alt', en: 'alt' }, { ar: 'title', en: 'title' }, { ar: 'label', en: 'label' }, { ar: 'name', en: 'name' } ],
            answer: 1,
            why: { ar: 'title تصف محتوى الإطار لقارئ الشاشة (alt للصور فقط).',
                   en: 'title describes the frame content to screen readers (alt is for images).' } },
          { q: { ar: 'لماذا تظهر بعض المواقع فارغة داخل iframe؟', en: 'Why do some sites appear blank inside an iframe?' },
            options: [ { ar: 'خطأ في كودك', en: 'A bug in your code' },
                       { ar: 'الموقع يمنع التضمين بترويسة X-Frame-Options', en: 'The site blocks framing with X-Frame-Options' },
                       { ar: 'المتصفح قديم', en: 'The browser is old' }, { ar: 'الإنترنت بطيء', en: 'Slow internet' } ],
            answer: 1,
            why: { ar: 'حماية أمنية من جانب الموقع نفسه، لا علاقة لك بها.',
                   en: 'It is a security measure from that site, nothing to do with you.' } },
          { q: { ar: 'ما رابط تضمين فيديو يوتيوب؟', en: 'What is the YouTube embed URL form?' },
            options: [ { ar: 'youtube.com/watch?v=ID', en: 'youtube.com/watch?v=ID' },
                       { ar: 'youtube.com/embed/ID', en: 'youtube.com/embed/ID' },
                       { ar: 'youtube.com/video/ID', en: 'youtube.com/video/ID' },
                       { ar: 'youtube.com/ID', en: 'youtube.com/ID' } ],
            answer: 1,
            why: { ar: 'رابط المشاهدة العادي لا يعمل داخل iframe؛ استخدم صيغة embed.',
                   en: 'The normal watch URL does not work in an iframe; use the embed form.' } }
        ]
      },

      {
        id: 'responsive-media',
        minutes: 7, level: 'advanced',
        tags: ['picture', 'srcset', 'svg'],
        title: { ar: 'صور متجاوبة وSVG', en: 'Responsive images and SVG' },
        lede: { ar: 'أرسل لكل جهاز الصورة التي تناسبه، وتعرّف على الرسوم التي لا تفقد جودتها أبداً.',
                en: 'Send every device the image that fits it, and meet graphics that never lose quality.' },
        body: {
          ar: '<h2>srcset وsizes</h2>' +
              '<p>تعطي المتصفح قائمة أحجام مع عرض كل واحدة، فيختار الأنسب لدقة الشاشة وحجم العرض:</p>' +
              '<pre><code>&lt;img src="small.jpg"\n  srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"\n  sizes="(max-width: 600px) 100vw, 50vw"\n  alt="منظر"&gt;</code></pre>' +
              '<p>القيمة <code>400w</code> تعني «عرض هذه الصورة 400 بكسل»، و<code>sizes</code> تخبر المتصفح كم مساحة ستشغلها الصورة فعلياً في التخطيط.</p>' +
              '<h2>picture: تحكّم كامل</h2>' +
              '<p>عندما تريد صورة <strong>مختلفة تماماً</strong> للجوال (قصّ عمودي مثلاً) أو صيغة حديثة مع بديل:</p>' +
              '<pre><code>&lt;picture&gt;\n  &lt;source media="(max-width:600px)" srcset="mobile.jpg"&gt;\n  &lt;source type="image/webp" srcset="photo.webp"&gt;\n  &lt;img src="photo.jpg" alt="وصف"&gt;\n&lt;/picture&gt;</code></pre>' +
              '<p>المتصفح يقرأ المصادر بالترتيب ويأخذ أول ما يطابق، و<code>&lt;img&gt;</code> في النهاية إجبارية كبديل أخير.</p>' +
              '<h2>SVG</h2>' +
              '<ul>' +
              '<li>رسوم <strong>متجهة</strong>: تُرسم بمعادلات لا بنقاط، فتكبر بلا أي تشويش.</li>' +
              '<li>حجمها صغير جداً للشعارات والأيقونات.</li>' +
              '<li>يمكن كتابتها مباشرة داخل HTML وتلوينها بـ CSS.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">⚡</span><div><b>أسرع تحسين لموقعك</b>غالباً الصور هي أثقل شيء في الصفحة. ضغط الصور واستخدام WebP و<code>loading="lazy"</code> قد يقلّل حجم صفحتك للنصف.</div></div>',
          en: '<h2>srcset and sizes</h2>' +
              '<p>They hand the browser a list of sizes with each width, so it can pick what suits the screen density and layout:</p>' +
              '<pre><code>&lt;img src="small.jpg"\n  srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"\n  sizes="(max-width: 600px) 100vw, 50vw"\n  alt="A view"&gt;</code></pre>' +
              '<p><code>400w</code> means "this image is 400 pixels wide", and <code>sizes</code> tells the browser how much space the image will actually occupy in the layout.</p>' +
              '<h2>picture: full control</h2>' +
              '<p>When you want a <strong>completely different</strong> image on mobile (a vertical crop, say) or a modern format with a fallback:</p>' +
              '<pre><code>&lt;picture&gt;\n  &lt;source media="(max-width:600px)" srcset="mobile.jpg"&gt;\n  &lt;source type="image/webp" srcset="photo.webp"&gt;\n  &lt;img src="photo.jpg" alt="description"&gt;\n&lt;/picture&gt;</code></pre>' +
              '<p>The browser reads the sources in order and takes the first match; the closing <code>&lt;img&gt;</code> is mandatory as the final fallback.</p>' +
              '<h2>SVG</h2>' +
              '<ul>' +
              '<li><strong>Vector</strong> graphics: drawn from equations, not pixels, so they scale with zero blur.</li>' +
              '<li>Tiny file size for logos and icons.</li>' +
              '<li>They can be written directly inside HTML and colored with CSS.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">⚡</span><div><b>The fastest win for your site</b>Images are usually the heaviest thing on a page. Compressing them, using WebP and adding <code>loading="lazy"</code> can halve your page weight.</div></div>'
        },
        example: {
          note: { ar: 'صغّر عرض نافذة المعاينة ولاحظ تغيّر الصورة داخل picture.',
                  en: 'Narrow the preview pane and watch the picture element swap the image.' },
          code: {
            ar: '<picture>\n  <source media="(max-width: 500px)" srcset="https://picsum.photos/id/1025/300/300">\n  <img src="https://picsum.photos/id/1025/500/260" alt="كلب لطيف" width="100%">\n</picture>\n\n<p>شعار SVG مكتوب داخل HTML مباشرة:</p>\n<svg width="90" height="90" viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="45" fill="#4b3ff0"></circle>\n  <text x="50" y="62" font-size="34" fill="white" text-anchor="middle">SVG</text>\n</svg>',
            en: '<picture>\n  <source media="(max-width: 500px)" srcset="https://picsum.photos/id/1025/300/300">\n  <img src="https://picsum.photos/id/1025/500/260" alt="A cute dog" width="100%">\n</picture>\n\n<p>An SVG logo written straight into HTML:</p>\n<svg width="90" height="90" viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="45" fill="#4b3ff0"></circle>\n  <text x="50" y="62" font-size="34" fill="white" text-anchor="middle">SVG</text>\n</svg>'
          }
        },
        challenge: {
          brief: { ar: 'اعرض صورة متجاوبة: عنصر picture فيه source بشرط media وimg بديلة لها alt، ثم أضف شكل SVG بسيطاً (دائرة أو مستطيل).',
                   en: 'Show a responsive image: a picture element with a media-conditioned source and a fallback img with alt, then add a simple SVG shape (a circle or rectangle).' },
          starter: { ar: '<picture>\n  \n</picture>', en: '<picture>\n  \n</picture>' },
          solution: { ar: '<picture>\n  <source media="(max-width:500px)" srcset="https://picsum.photos/300/300">\n  <img src="https://picsum.photos/500/260" alt="منظر طبيعي">\n</picture>\n<svg width="80" height="80"><circle cx="40" cy="40" r="35" fill="#4b3ff0"></circle></svg>',
                      en: '<picture>\n  <source media="(max-width:500px)" srcset="https://picsum.photos/300/300">\n  <img src="https://picsum.photos/500/260" alt="A landscape">\n</picture>\n<svg width="80" height="80"><circle cx="40" cy="40" r="35" fill="#4b3ff0"></circle></svg>' },
          checks: [
            { label: { ar: 'يوجد عنصر <picture>', en: 'A <picture> element exists' },
              hint:  { ar: 'ابدأ بـ <picture> وأغلقه', en: 'Start with <picture> and close it' },
              test: function (d) { return has(d, 'picture'); } },
            { label: { ar: 'يوجد <source> بشرط media وsrcset', en: 'A <source> with media and srcset' },
              hint:  { ar: '<source media="(max-width:500px)" srcset="…">', en: '<source media="(max-width:500px)" srcset="…">' },
              test: function (d) { return has(d, 'picture source[media][srcset]'); } },
            { label: { ar: 'توجد <img> بديلة داخل picture لها alt', en: 'A fallback <img> with alt inside picture' },
              hint:  { ar: 'img الأخيرة إجبارية داخل picture', en: 'The final img is mandatory inside picture' },
              test: function (d) { return attrFilled(d, 'picture img[alt]', 'alt'); } },
            { label: { ar: 'يوجد شكل <svg>', en: 'An <svg> shape exists' },
              hint:  { ar: '<svg><circle cx="40" cy="40" r="35"></circle></svg>', en: '<svg><circle cx="40" cy="40" r="35"></circle></svg>' },
              test: function (d) { return has(d, 'svg'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ماذا تعني 800w داخل srcset؟', en: 'What does 800w mean inside srcset?' },
            options: [ { ar: 'وزن الملف', en: 'The file weight' }, { ar: 'عرض الصورة بالبكسل', en: 'The image width in pixels' },
                       { ar: 'عدد الألوان', en: 'The color count' }, { ar: 'زمن التحميل', en: 'Load time' } ],
            answer: 1,
            why: { ar: 'الحرف w اختصار width، ويصف عرض ذلك الملف.',
                   en: 'The w stands for width and describes that file width.' } },
          { q: { ar: 'ما العنصر الإجباري داخل picture؟', en: 'Which element is mandatory inside picture?' },
            options: [ { ar: '<source>', en: '<source>' }, { ar: '<img>', en: '<img>' }, { ar: '<figure>', en: '<figure>' }, { ar: '<div>', en: '<div>' } ],
            answer: 1,
            why: { ar: 'img هي البديل الأخير وهي التي تحمل alt.',
                   en: 'The img is the final fallback and carries the alt text.' } },
          { q: { ar: 'ما ميزة SVG على PNG للشعارات؟', en: 'What is the SVG advantage over PNG for logos?' },
            options: [ { ar: 'ألوان أكثر', en: 'More colors' }, { ar: 'تكبر بلا فقدان جودة', en: 'It scales with no quality loss' },
                       { ar: 'تحميل أبطأ', en: 'Slower loading' }, { ar: 'لا تحتاج alt', en: 'It needs no alt' } ],
            answer: 1,
            why: { ar: 'الرسوم المتجهة تُحسب رياضياً فتظل حادة في أي حجم.',
                   en: 'Vector graphics are computed mathematically, staying sharp at any size.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 8 — الاحتراف والنشر / Module 8 — Polish & publish
     =========================================================== */
  MODULES.push({
    id: 'pro',
    icon: '🚀',
    title: { ar: 'الاحتراف والنشر', en: 'Polish and publishing' },
    desc:  { ar: 'لمسة CSS، وتحسين الظهور في البحث، وتفادي الأخطاء الشائعة، ونشر موقعك مجاناً.',
             en: 'A touch of CSS, better search visibility, avoiding common mistakes, and publishing your site for free.' },
    lessons: [

      {
        id: 'css-intro',
        minutes: 9, level: 'intermediate',
        tags: ['css', 'style', 'تنسيق'],
        title: { ar: 'أول لقاء مع CSS', en: 'Your first meeting with CSS' },
        lede: { ar: 'صفحتك الآن صحيحة البناء — حان وقت جعلها جميلة أيضاً.',
                en: 'Your page is structurally sound — time to make it beautiful too.' },
        body: {
          ar: '<h2>ثلاث طرق لإضافة CSS</h2>' +
              '<ol>' +
              '<li><strong>سطرية</strong>: <code>&lt;p style="color:red"&gt;</code> — سريعة للتجربة، فوضوية في المشاريع.</li>' +
              '<li><strong>داخلية</strong>: وسم <code>&lt;style&gt;</code> داخل <code>&lt;head&gt;</code> — مناسبة لصفحة واحدة.</li>' +
              '<li><strong>خارجية</strong>: ملف <code>style.css</code> يُربط بـ <code>&lt;link rel="stylesheet" href="style.css"&gt;</code> — <strong>الطريقة المحترفة</strong>: ملف واحد ينسّق موقعك كله.</li>' +
              '</ol>' +
              '<h2>تشريح قاعدة CSS</h2>' +
              '<pre><code>h1 {\n  color: navy;\n  font-size: 32px;\n}</code></pre>' +
              '<ul>' +
              '<li><code>h1</code> — <strong>المُحدِّد</strong>: أي عنصر نستهدف.</li>' +
              '<li><code>color</code> — <strong>الخاصية</strong>.</li>' +
              '<li><code>navy</code> — <strong>القيمة</strong>.</li>' +
              '</ul>' +
              '<h2>المحدِّدات الثلاثة الأساسية</h2>' +
              '<ul>' +
              '<li><code>p</code> — كل عناصر الفقرات.</li>' +
              '<li><code>.card</code> — كل عنصر يحمل <code>class="card"</code> (النقطة للصنف).</li>' +
              '<li><code>#main</code> — العنصر الذي يحمل <code>id="main"</code> (المربّع للمعرّف).</li>' +
              '</ul>' +
              '<h2>خصائص تحتاجها فوراً</h2>' +
              '<ul>' +
              '<li><code>color</code> و<code>background</code> — لون النص والخلفية.</li>' +
              '<li><code>font-size</code> و<code>font-family</code> — حجم الخط ونوعه.</li>' +
              '<li><code>padding</code> — مسافة داخلية، و<code>margin</code> — مسافة خارجية.</li>' +
              '<li><code>border</code> و<code>border-radius</code> — الإطار وتدوير الزوايا.</li>' +
              '<li><code>text-align</code> — محاذاة النص.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">🎨</span><div><b>الخطوة التالية بعد هذا المنهج</b>تعلّم <strong>Flexbox</strong> و<strong>Grid</strong> — بهما تبني أي تخطيط تراه في المواقع الحديثة بسهولة مدهشة.</div></div>',
          en: '<h2>Three ways to add CSS</h2>' +
              '<ol>' +
              '<li><strong>Inline</strong>: <code>&lt;p style="color:red"&gt;</code> — fast for testing, messy in projects.</li>' +
              '<li><strong>Internal</strong>: a <code>&lt;style&gt;</code> tag inside <code>&lt;head&gt;</code> — fine for a single page.</li>' +
              '<li><strong>External</strong>: a <code>style.css</code> file linked with <code>&lt;link rel="stylesheet" href="style.css"&gt;</code> — <strong>the professional way</strong>: one file styles your whole site.</li>' +
              '</ol>' +
              '<h2>Anatomy of a CSS rule</h2>' +
              '<pre><code>h1 {\n  color: navy;\n  font-size: 32px;\n}</code></pre>' +
              '<ul>' +
              '<li><code>h1</code> — the <strong>selector</strong>: which elements we target.</li>' +
              '<li><code>color</code> — the <strong>property</strong>.</li>' +
              '<li><code>navy</code> — the <strong>value</strong>.</li>' +
              '</ul>' +
              '<h2>The three core selectors</h2>' +
              '<ul>' +
              '<li><code>p</code> — every paragraph element.</li>' +
              '<li><code>.card</code> — every element with <code>class="card"</code> (a dot for classes).</li>' +
              '<li><code>#main</code> — the element with <code>id="main"</code> (a hash for ids).</li>' +
              '</ul>' +
              '<h2>Properties you will need immediately</h2>' +
              '<ul>' +
              '<li><code>color</code> and <code>background</code> — text and background color.</li>' +
              '<li><code>font-size</code> and <code>font-family</code> — size and typeface.</li>' +
              '<li><code>padding</code> — inner spacing, and <code>margin</code> — outer spacing.</li>' +
              '<li><code>border</code> and <code>border-radius</code> — borders and rounded corners.</li>' +
              '<li><code>text-align</code> — text alignment.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">🎨</span><div><b>Your next step after this course</b>Learn <strong>Flexbox</strong> and <strong>Grid</strong> — with them you can build any layout you see on modern sites with surprising ease.</div></div>'
        },
        example: {
          note: { ar: 'غيّر الألوان والأرقام في الـ style وشاهد التصميم يتبدّل.',
                  en: 'Change the colors and numbers in the style block and watch the design shift.' },
          code: {
            ar: '<style>\n  body { font-family: system-ui; background: #f5f6fa; }\n  .card {\n    background: white;\n    padding: 18px;\n    border-radius: 12px;\n    border: 1px solid #ddd;\n    max-width: 320px;\n  }\n  .card h3 { color: #4b3ff0; margin: 0 0 6px; }\n  .price { color: #c0392b; font-weight: bold; }\n</style>\n\n<div class="card">\n  <h3>سماعات لاسلكية</h3>\n  <p>جودة صوت ممتازة وبطارية 30 ساعة.</p>\n  <p class="price">299 ريال</p>\n</div>',
            en: '<style>\n  body { font-family: system-ui; background: #f5f6fa; }\n  .card {\n    background: white;\n    padding: 18px;\n    border-radius: 12px;\n    border: 1px solid #ddd;\n    max-width: 320px;\n  }\n  .card h3 { color: #4b3ff0; margin: 0 0 6px; }\n  .price { color: #c0392b; font-weight: bold; }\n</style>\n\n<div class="card">\n  <h3>Wireless headphones</h3>\n  <p>Great sound and a 30-hour battery.</p>\n  <p class="price">299</p>\n</div>'
          }
        },
        challenge: {
          brief: { ar: 'نسّق بطاقتك: أضف وسم style فيه قاعدة لمحدّد صنف (.card) وقاعدة لمحدّد عنصر، ثم عنصر div يحمل class="card" بداخله عنوان وفقرة.',
                   en: 'Style your card: add a style tag with a class selector rule (.card) and an element selector rule, then a div with class="card" holding a heading and a paragraph.' },
          starter: { ar: '<style>\n  \n</style>\n<div class="card">\n  \n</div>', en: '<style>\n  \n</style>\n<div class="card">\n  \n</div>' },
          solution: { ar: '<style>\n  .card { background:#eee; padding:16px; border-radius:10px; }\n  h3 { color:#4b3ff0; }\n</style>\n<div class="card">\n  <h3>بطاقة</h3>\n  <p>محتوى البطاقة.</p>\n</div>',
                      en: '<style>\n  .card { background:#eee; padding:16px; border-radius:10px; }\n  h3 { color:#4b3ff0; }\n</style>\n<div class="card">\n  <h3>Card</h3>\n  <p>Card content.</p>\n</div>' },
          checks: [
            { label: { ar: 'يوجد وسم <style>', en: 'A <style> tag exists' },
              hint:  { ar: 'ضع قواعد CSS بين <style> و</style>', en: 'Put CSS rules between <style> and </style>' },
              test: function (d) { return has(d, 'style'); } },
            { label: { ar: 'توجد قاعدة لمحدّد صنف يبدأ بنقطة', en: 'A class selector rule starting with a dot' },
              hint:  { ar: 'مثال: .card { padding: 16px; }', en: 'Example: .card { padding: 16px; }' },
              test: function (d, raw) { return /\.[a-zA-Z][\w-]*\s*\{[^}]*\}/.test(raw); } },
            { label: { ar: 'توجد قاعدة لمحدّد عنصر (h1/h2/h3/p)', en: 'An element selector rule (h1/h2/h3/p)' },
              hint:  { ar: 'مثال: h3 { color: blue; }', en: 'Example: h3 { color: blue; }' },
              test: function (d, raw) { return /(^|[\s}>])(h[1-6]|p|body|div)\s*\{[^}]*\}/m.test(raw); } },
            { label: { ar: 'يوجد عنصر يحمل class="card" فيه عنوان وفقرة', en: 'An element with class="card" holding a heading and paragraph' },
              hint:  { ar: '<div class="card"><h3>…</h3><p>…</p></div>', en: '<div class="card"><h3>…</h3><p>…</p></div>' },
              test: function (d) { return filled(d, '.card h1, .card h2, .card h3') && filled(d, '.card p'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما رمز محدّد الصنف في CSS؟', en: 'What symbol marks a class selector in CSS?' },
            options: [ { ar: 'المربّع #', en: 'The hash #' }, { ar: 'النقطة .', en: 'The dot .' }, { ar: 'النجمة *', en: 'The star *' }, { ar: 'الشرطة -', en: 'The dash -' } ],
            answer: 1,
            why: { ar: 'النقطة للأصناف والمربّع للمعرّفات.',
                   en: 'A dot targets classes; a hash targets ids.' } },
          { q: { ar: 'ما الطريقة الأنسب لتنسيق موقع من عدة صفحات؟', en: 'What is the best way to style a multi-page site?' },
            options: [ { ar: 'style سطرية في كل عنصر', en: 'Inline style on every element' },
                       { ar: 'ملف CSS خارجي مرتبط بـ link', en: 'An external CSS file linked with link' },
                       { ar: 'style داخل كل صفحة', en: 'A style tag inside every page' },
                       { ar: 'لا تنسّق شيئاً', en: 'Do not style anything' } ],
            answer: 1,
            why: { ar: 'ملف واحد يُعدَّل مرة واحدة فتتغير كل الصفحات.',
                   en: 'One file edited once updates every page.' } },
          { q: { ar: 'ما الفرق بين padding وmargin؟', en: 'What is the difference between padding and margin?' },
            options: [ { ar: 'padding داخلية وmargin خارجية', en: 'padding is inside, margin is outside' },
                       { ar: 'العكس تماماً', en: 'Exactly the opposite' },
                       { ar: 'لا فرق', en: 'No difference' }, { ar: 'padding للنص فقط', en: 'padding is for text only' } ],
            answer: 0,
            why: { ar: 'padding بين المحتوى والإطار، وmargin بين العنصر وجيرانه.',
                   en: 'padding sits between content and border; margin sits between the element and its neighbours.' } }
        ]
      },

      {
        id: 'meta-seo',
        minutes: 7, level: 'intermediate',
        tags: ['meta', 'seo', 'og'],
        title: { ar: 'وسوم meta وتحسين الظهور', en: 'Meta tags and search visibility' },
        lede: { ar: 'كيف تظهر صفحتك في جوجل بشكل جذاب، وكيف تبدو عند مشاركتها في واتساب وتويتر.',
                en: 'How your page appears attractively in Google, and how it looks when shared on WhatsApp and social media.' },
        body: {
          ar: '<h2>الأساسيات في head</h2>' +
              '<ul>' +
              '<li><code>&lt;title&gt;</code> — أهم عنصر لمحركات البحث. اجعله وصفياً (50–60 حرفاً).</li>' +
              '<li><code>&lt;meta name="description"&gt;</code> — الوصف الظاهر تحت العنوان في نتائج البحث (نحو 150 حرفاً).</li>' +
              '<li><code>&lt;meta name="viewport"&gt;</code> — ضروري لعرض سليم على الجوال.</li>' +
              '<li><code>&lt;html lang="ar"&gt;</code> — يخبر جوجل بلغة المحتوى.</li>' +
              '</ul>' +
              '<h2>بطاقة المشاركة: Open Graph</h2>' +
              '<p>عند لصق رابطك في واتساب أو تويتر أو فيسبوك، تقرأ هذه المواقع وسوم <code>og:</code> لتصنع البطاقة:</p>' +
              '<ul>' +
              '<li><code>og:title</code> — عنوان البطاقة.</li>' +
              '<li><code>og:description</code> — وصفها.</li>' +
              '<li><code>og:image</code> — الصورة (يُفضّل 1200×630 بكسل).</li>' +
              '<li><code>og:url</code> — الرابط الرسمي للصفحة.</li>' +
              '</ul>' +
              '<h2>عوامل ترتيب تعتمد على HTML</h2>' +
              '<ul>' +
              '<li>عنوان <code>h1</code> واحد واضح، وترتيب سليم للعناوين.</li>' +
              '<li><code>alt</code> وصفية لكل صورة.</li>' +
              '<li>روابط داخلية بنص واضح.</li>' +
              '<li>وسوم دلالية تميّز المحتوى الأساسي.</li>' +
              '<li>سرعة الصفحة — الصور المضغوطة والتحميل الكسول.</li>' +
              '</ul>' +
              '<div class="callout callout-warn"><span class="ic">🧹</span><div><b>وسم مات</b><code>&lt;meta name="keywords"&gt;</code> لم تعد تؤثر في ترتيب جوجل منذ سنوات طويلة. لا تضيّع وقتك فيها؛ المحتوى الجيد والبنية السليمة هما ما يهم.</div></div>',
          en: '<h2>The essentials in head</h2>' +
              '<ul>' +
              '<li><code>&lt;title&gt;</code> — the single most important element for search. Make it descriptive (50–60 characters).</li>' +
              '<li><code>&lt;meta name="description"&gt;</code> — the text under the title in search results (about 150 characters).</li>' +
              '<li><code>&lt;meta name="viewport"&gt;</code> — required for correct mobile rendering.</li>' +
              '<li><code>&lt;html lang="en"&gt;</code> — tells Google the content language.</li>' +
              '</ul>' +
              '<h2>The share card: Open Graph</h2>' +
              '<p>When your link is pasted into WhatsApp, X or Facebook, those sites read the <code>og:</code> tags to build the preview card:</p>' +
              '<ul>' +
              '<li><code>og:title</code> — the card title.</li>' +
              '<li><code>og:description</code> — its description.</li>' +
              '<li><code>og:image</code> — the image (1200×630 pixels is ideal).</li>' +
              '<li><code>og:url</code> — the canonical page URL.</li>' +
              '</ul>' +
              '<h2>Ranking factors that live in HTML</h2>' +
              '<ul>' +
              '<li>One clear <code>h1</code> and a correct heading order.</li>' +
              '<li>Descriptive <code>alt</code> on every image.</li>' +
              '<li>Internal links with meaningful text.</li>' +
              '<li>Semantic tags marking the primary content.</li>' +
              '<li>Page speed — compressed images and lazy loading.</li>' +
              '</ul>' +
              '<div class="callout callout-warn"><span class="ic">🧹</span><div><b>A dead tag</b><code>&lt;meta name="keywords"&gt;</code> has not affected Google ranking for many years. Do not waste time on it; good content and sound structure are what matter.</div></div>'
        },
        example: {
          note: { ar: 'هذه الوسوم لا تظهر في الصفحة — أثرها في نتائج البحث وبطاقة المشاركة.',
                  en: 'These tags never show on the page — their effect is in search results and share cards.' },
          code: {
            ar: '<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n\n  <title>متجر الحرف اليدوية — منتجات صنعت بحب</title>\n  <meta name="description" content="متجر إلكتروني لبيع الحرف اليدوية المصنوعة محلياً، توصيل لجميع المدن خلال 48 ساعة.">\n\n  <meta property="og:title" content="متجر الحرف اليدوية">\n  <meta property="og:description" content="منتجات يدوية فريدة بأسعار مناسبة.">\n  <meta property="og:image" content="https://picsum.photos/1200/630">\n  <meta property="og:url" content="https://example.com">\n</head>\n<body>\n  <h1>متجر الحرف اليدوية</h1>\n  <p>افتح أدوات المطوّر لترى الوسوم في head.</p>\n</body>\n</html>',
            en: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n\n  <title>Handmade Crafts Store — made with love</title>\n  <meta name="description" content="An online store for locally handmade crafts, delivered to every city within 48 hours.">\n\n  <meta property="og:title" content="Handmade Crafts Store">\n  <meta property="og:description" content="Unique handmade products at fair prices.">\n  <meta property="og:image" content="https://picsum.photos/1200/630">\n  <meta property="og:url" content="https://example.com">\n</head>\n<body>\n  <h1>Handmade Crafts Store</h1>\n  <p>Open DevTools to see the tags in head.</p>\n</body>\n</html>'
          }
        },
        challenge: {
          brief: { ar: 'جهّز صفحة للنشر: head فيه title وصفي، وmeta description، وmeta viewport، ووسمان من Open Graph على الأقل.',
                   en: 'Prepare a page for publishing: a head with a descriptive title, a meta description, a meta viewport, and at least two Open Graph tags.' },
          starter: { ar: '<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="utf-8">\n  \n</head>\n<body>\n  <h1>موقعي</h1>\n</body>\n</html>',
                     en: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  \n</head>\n<body>\n  <h1>My site</h1>\n</body>\n</html>' },
          solution: { ar: '<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>مدوّنتي الشخصية — مقالات تقنية</title>\n  <meta name="description" content="مدوّنة عربية عن تطوير الويب والبرمجة للمبتدئين.">\n  <meta property="og:title" content="مدوّنتي الشخصية">\n  <meta property="og:image" content="https://picsum.photos/1200/630">\n</head>\n<body><h1>مدوّنتي</h1></body>\n</html>',
                      en: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My personal blog — tech articles</title>\n  <meta name="description" content="An English blog about web development and programming for beginners.">\n  <meta property="og:title" content="My personal blog">\n  <meta property="og:image" content="https://picsum.photos/1200/630">\n</head>\n<body><h1>My blog</h1></body>\n</html>' },
          checks: [
            { label: { ar: 'يوجد <title> وصفي (10 أحرف فأكثر)', en: 'A descriptive <title> (10+ characters)' },
              hint:  { ar: 'اكتب عنواناً يشرح موضوع الصفحة', en: 'Write a title that explains the page topic' },
              test: function (d, raw) {
                var m = /<title>([\s\S]*?)<\/title>/i.exec(raw);
                return !!m && m[1].trim().length >= 10;
              } },
            { label: { ar: 'يوجد <meta name="description">', en: 'A <meta name="description"> exists' },
              hint:  { ar: 'صف الصفحة في جملة واحدة', en: 'Describe the page in one sentence' },
              test: function (d, raw) { return /<meta[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["'][^"']{20,}/i.test(raw); } },
            { label: { ar: 'يوجد <meta name="viewport">', en: 'A <meta name="viewport"> exists' },
              hint:  { ar: 'content="width=device-width, initial-scale=1"', en: 'content="width=device-width, initial-scale=1"' },
              test: function (d, raw) { return /<meta[^>]*name\s*=\s*["']viewport["']/i.test(raw); } },
            { label: { ar: 'يوجد وسما Open Graph على الأقل (og:)', en: 'At least two Open Graph (og:) tags' },
              hint:  { ar: 'مثل og:title وog:image', en: 'Such as og:title and og:image' },
              test: function (d, raw) { return (raw.match(/property\s*=\s*["']og:/gi) || []).length >= 2; } }
          ]
        },
        quiz: [
          { q: { ar: 'ما أهم وسم لمحركات البحث؟', en: 'Which tag matters most to search engines?' },
            options: [ { ar: '<meta keywords>', en: '<meta keywords>' }, { ar: '<title>', en: '<title>' },
                       { ar: '<div>', en: '<div>' }, { ar: '<span>', en: '<span>' } ],
            answer: 1,
            why: { ar: 'العنوان هو أول ما يقرأه محرك البحث وأبرز ما يظهر للمستخدم.',
                   en: 'The title is the first thing the engine reads and the most visible line to users.' } },
          { q: { ar: 'ما وظيفة وسوم og:؟', en: 'What do og: tags do?' },
            options: [ { ar: 'تنسيق الصفحة', en: 'Style the page' },
                       { ar: 'تحديد شكل بطاقة المشاركة في الشبكات الاجتماعية', en: 'Define the social share card' },
                       { ar: 'تسريع الموقع', en: 'Speed up the site' }, { ar: 'إضافة روابط', en: 'Add links' } ],
            answer: 1,
            why: { ar: 'تقرأها واتساب وتويتر وفيسبوك لبناء المعاينة.',
                   en: 'WhatsApp, X and Facebook read them to build the preview.' } },
          { q: { ar: 'هل ما زالت meta keywords مؤثرة في ترتيب جوجل؟', en: 'Does meta keywords still affect Google ranking?' },
            options: [ { ar: 'نعم بقوة', en: 'Yes, strongly' }, { ar: 'لا، منذ سنوات', en: 'No, not for years' },
                       { ar: 'نعم للمواقع العربية', en: 'Yes, for non-English sites' }, { ar: 'نعم للمتاجر', en: 'Yes, for stores' } ],
            answer: 1,
            why: { ar: 'أُهملت بسبب إساءة استخدامها؛ المحتوى والبنية هما المعيار.',
                   en: 'It was abandoned after abuse; content and structure are what count.' } }
        ]
      },

      {
        id: 'common-mistakes',
        minutes: 6, level: 'intermediate',
        tags: ['validation', 'أخطاء', 'debug'],
        title: { ar: 'أخطاء شائعة وكيف تتجنّبها', en: 'Common mistakes and how to avoid them' },
        lede: { ar: 'عشرة أخطاء يقع فيها كل مبتدئ — اقرأها مرة واختصر على نفسك شهوراً.',
                en: 'Ten mistakes every beginner makes — read them once and save yourself months.' },
        body: {
          ar: '<h2>العشرة الكبار</h2>' +
              '<ol>' +
              '<li><strong>نسيان وسم الإغلاق</strong> — أشهرها <code>&lt;/div&gt;</code>، فينهار التخطيط كله.</li>' +
              '<li><strong>تعشيش متقاطع</strong> — <code>&lt;p&gt;&lt;b&gt;نص&lt;/p&gt;&lt;/b&gt;</code>.</li>' +
              '<li><strong>تكرار id</strong> — يكسر الروابط الداخلية وربط التسميات.</li>' +
              '<li><strong>صورة بلا alt</strong> — خسارة في الوصولية وفي SEO.</li>' +
              '<li><strong>مسار خاطئ</strong> — حرف كبير أو مجلد ناقص فتظهر صورة مكسورة.</li>' +
              '<li><strong>حقل بلا name</strong> — النموذج يبدو سليماً لكن القيمة لا تصل.</li>' +
              '<li><strong>استخدام div بدل button</strong> — يفقد دعم لوحة المفاتيح.</li>' +
              '<li><strong>عناوين حسب الحجم</strong> لا حسب المعنى.</li>' +
              '<li><strong>جداول للتخطيط</strong> بدل CSS.</li>' +
              '<li><strong>نسيان meta charset</strong> — فتتحوّل العربية إلى رموز غريبة.</li>' +
              '</ol>' +
              '<h2>كيف تكتشف الأخطاء؟</h2>' +
              '<ul>' +
              '<li><strong>مدقّق W3C</strong>: موقع <code>validator.w3.org</code> يفحص صفحتك ويسرد كل خطأ برقم سطره.</li>' +
              '<li><strong>أدوات المطوّر</strong>: تبويب Elements يعرض الشجرة كما فهمها المتصفح فعلاً — إن رأيت وسماً في مكان غريب فهناك خطأ إغلاق.</li>' +
              '<li><strong>الإزاحة المنتظمة</strong>: الكود المرتّب يكشف الوسم الناقص بصرياً قبل أي أداة.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">🔍</span><div><b>حيلة سريعة</b>إذا انهار التخطيط فجأة، ابحث عن آخر عنصر ظهر بشكل صحيح — الخطأ غالباً في السطر الذي يليه مباشرة.</div></div>',
          en: '<h2>The big ten</h2>' +
              '<ol>' +
              '<li><strong>Forgetting a closing tag</strong> — usually <code>&lt;/div&gt;</code>, and the whole layout collapses.</li>' +
              '<li><strong>Crossed nesting</strong> — <code>&lt;p&gt;&lt;b&gt;text&lt;/p&gt;&lt;/b&gt;</code>.</li>' +
              '<li><strong>Duplicate id</strong> — breaks in-page links and label binding.</li>' +
              '<li><strong>An image with no alt</strong> — a loss for accessibility and SEO.</li>' +
              '<li><strong>A wrong path</strong> — one capital letter or a missing folder and the image breaks.</li>' +
              '<li><strong>A field with no name</strong> — the form looks fine but the value never arrives.</li>' +
              '<li><strong>Using div instead of button</strong> — losing keyboard support.</li>' +
              '<li><strong>Headings chosen by size</strong> rather than meaning.</li>' +
              '<li><strong>Tables for layout</strong> instead of CSS.</li>' +
              '<li><strong>Forgetting meta charset</strong> — and non-English text turns to garbage.</li>' +
              '</ol>' +
              '<h2>How do you find mistakes?</h2>' +
              '<ul>' +
              '<li><strong>The W3C validator</strong>: <code>validator.w3.org</code> scans your page and lists every error with its line number.</li>' +
              '<li><strong>DevTools</strong>: the Elements tab shows the tree as the browser actually parsed it — a tag in a strange place means a closing error.</li>' +
              '<li><strong>Consistent indentation</strong>: tidy code reveals the missing tag visually before any tool does.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">🔍</span><div><b>A quick trick</b>If the layout suddenly collapses, find the last element that rendered correctly — the mistake is usually on the very next line.</div></div>'
        },
        example: {
          note: { ar: 'هذا الكود فيه أخطاء مقصودة! افتح أدوات المطوّر وقارن الشجرة بما كتبته.',
                  en: 'This code contains deliberate mistakes! Open DevTools and compare the tree with what you wrote.' },
          code: {
            ar: '<!-- ❌ إغلاق متقاطع -->\n<p>نص <b>بارز</p></b>\n\n<!-- ❌ id مكرر -->\n<p id="x">الأول</p>\n<p id="x">الثاني</p>\n\n<!-- ❌ صورة بلا alt ومسار خاطئ -->\n<img src="Photo.JPG">\n\n<!-- ✅ الصواب -->\n<p>نص <b>بارز</b></p>\n<p id="first">الأول</p>\n<p id="second">الثاني</p>\n<img src="photo.jpg" alt="وصف الصورة">',
            en: '<!-- ❌ crossed closing -->\n<p>text <b>bold</p></b>\n\n<!-- ❌ duplicate id -->\n<p id="x">First</p>\n<p id="x">Second</p>\n\n<!-- ❌ no alt and a wrong path -->\n<img src="Photo.JPG">\n\n<!-- ✅ the fix -->\n<p>text <b>bold</b></p>\n<p id="first">First</p>\n<p id="second">Second</p>\n<img src="photo.jpg" alt="Image description">'
          }
        },
        challenge: {
          brief: { ar: 'اكتب نسخة سليمة: فقرتان بمعرّفين مختلفين، ونص بارز مغلق بشكل صحيح داخل فقرة، وصورة لها alt، وزر <button> حقيقي.',
                   en: 'Write a clean version: two paragraphs with distinct ids, correctly closed bold text inside a paragraph, an image with alt, and a real <button>.' },
          starter: { ar: '<p id=""></p>\n', en: '<p id=""></p>\n' },
          solution: { ar: '<p id="first">نص <b>بارز</b> هنا.</p>\n<p id="second">فقرة ثانية.</p>\n<img src="photo.jpg" alt="وصف الصورة">\n<button type="button">اضغطني</button>',
                      en: '<p id="first">Some <b>bold</b> text.</p>\n<p id="second">A second paragraph.</p>\n<img src="photo.jpg" alt="Image description">\n<button type="button">Click me</button>' },
          checks: [
            { label: { ar: 'توجد فقرتان بمعرّفين مختلفين', en: 'Two paragraphs with different ids' },
              hint:  { ar: 'لا تكرّر نفس قيمة id', en: 'Never repeat an id value' },
              test: function (d) {
                var p = d.querySelectorAll('p[id]');
                if (p.length < 2) return false;
                var seen = {};
                for (var i = 0; i < p.length; i++) {
                  var v = p[i].getAttribute('id');
                  if (!v || seen[v]) return false;
                  seen[v] = true;
                }
                return true;
              } },
            { label: { ar: 'يوجد نص بارز مغلق بشكل صحيح داخل فقرة', en: 'Correctly closed bold text inside a paragraph' },
              hint:  { ar: '<p>نص <b>بارز</b></p>', en: '<p>text <b>bold</b></p>' },
              test: function (d) { return filled(d, 'p b, p strong'); } },
            { label: { ar: 'توجد صورة لها alt', en: 'An image with alt' },
              hint:  { ar: 'لا تترك أي صورة بلا alt', en: 'Never leave an image without alt' },
              test: function (d) { return has(d, 'img[alt]'); } },
            { label: { ar: 'يوجد زر <button> حقيقي وليس div', en: 'A real <button>, not a div' },
              hint:  { ar: '<button type="button">اضغطني</button>', en: '<button type="button">Click me</button>' },
              test: function (d) { return filled(d, 'button'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما الموقع الرسمي لفحص صحة HTML؟', en: 'What is the official HTML validation site?' },
            options: [ { ar: 'validator.w3.org', en: 'validator.w3.org' }, { ar: 'html.com', en: 'html.com' },
                       { ar: 'checkhtml.net', en: 'checkhtml.net' }, { ar: 'w3schools.com', en: 'w3schools.com' } ],
            answer: 0,
            why: { ar: 'مدقّق W3C يفحص الصفحة ويسرد الأخطاء بأرقام أسطرها.',
                   en: 'The W3C validator scans the page and lists errors with line numbers.' } },
          { q: { ar: 'لماذا لا نستخدم div كزر؟', en: 'Why should a div not be used as a button?' },
            options: [ { ar: 'لأنه بطيء', en: 'It is slow' },
                       { ar: 'لأنه لا يعمل بلوحة المفاتيح ولا يفهمه قارئ الشاشة', en: 'It has no keyboard support and screen readers do not announce it' },
                       { ar: 'لأنه كبير', en: 'It is large' }, { ar: 'لا مشكلة فيه', en: 'There is no problem' } ],
            answer: 1,
            why: { ar: '<button> يأتي بالتركيز وEnter وSpace جاهزة.',
                   en: 'A real <button> brings focus, Enter and Space for free.' } },
          { q: { ar: 'ما نتيجة نسيان meta charset في صفحة عربية؟', en: 'What happens if you forget meta charset on a non-English page?' },
            options: [ { ar: 'لا شيء', en: 'Nothing' }, { ar: 'قد تظهر الحروف كرموز غريبة', en: 'Characters may turn into strange symbols' },
                       { ar: 'تتوقف الصفحة', en: 'The page stops working' }, { ar: 'تختفي الصور', en: 'Images disappear' } ],
            answer: 1,
            why: { ar: 'بلا utf-8 قد يخطئ المتصفح في تفسير ترميز الحروف.',
                   en: 'Without utf-8 the browser may guess the encoding wrongly.' } }
        ]
      },

      {
        id: 'publish',
        minutes: 8, level: 'intermediate',
        tags: ['github', 'pages', 'نشر'],
        title: { ar: 'انشر موقعك مجاناً', en: 'Publish your site for free' },
        lede: { ar: 'من ملف على جهازك إلى رابط حقيقي يفتحه أي شخص في العالم — بلا أي تكلفة.',
                en: 'From a file on your machine to a real link anyone in the world can open — at zero cost.' },
        body: {
          ar: '<h2>ما الذي تحتاجه؟</h2>' +
              '<ul>' +
              '<li>مجلد فيه <code>index.html</code> وبقية ملفاتك.</li>' +
              '<li>حساب مجاني على منصة استضافة.</li>' +
              '</ul>' +
              '<h2>GitHub Pages — الأشهر</h2>' +
              '<ol>' +
              '<li>أنشئ حساباً على <code>github.com</code>.</li>' +
              '<li>أنشئ مستودعاً جديداً (Repository) واجعله عاماً (Public).</li>' +
              '<li>ارفع ملفاتك — ويجب أن يكون فيها <code>index.html</code>.</li>' +
              '<li>افتح <strong>Settings</strong> ثم <strong>Pages</strong>.</li>' +
              '<li>اختر الفرع <code>main</code> والمجلد <code>/ (root)</code> ثم احفظ.</li>' +
              '<li>انتظر دقيقة، وسيظهر رابطك بالصيغة <code>username.github.io/repo-name</code>.</li>' +
              '</ol>' +
              '<h2>بدائل ممتازة</h2>' +
              '<ul>' +
              '<li><strong>Netlify</strong> — اسحب مجلدك وأفلته في الصفحة فينشر فوراً.</li>' +
              '<li><strong>Vercel</strong> — سريع ومتكامل مع GitHub.</li>' +
              '<li><strong>Cloudflare Pages</strong> — أداء عالمي ممتاز.</li>' +
              '</ul>' +
              '<h2>قبل النشر: قائمة فحص</h2>' +
              '<ul>' +
              '<li>الملف الرئيسي اسمه <code>index.html</code> بحروف صغيرة.</li>' +
              '<li>كل المسارات نسبية وتعمل (افتح الصفحة محلياً وتأكد).</li>' +
              '<li>لا مسافات ولا حروف كبيرة في أسماء الملفات.</li>' +
              '<li>يوجد <code>title</code> و<code>meta description</code> و<code>viewport</code>.</li>' +
              '<li>جرّبت الصفحة على شاشة جوال.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">🎓</span><div><b>وماذا بعد؟</b>أتممت أساسيات HTML. الخطوة التالية: <strong>CSS</strong> (Flexbox وGrid) ثم <strong>JavaScript</strong>. لكن أهم من كل الدورات: ابنِ مشاريع صغيرة حقيقية — صفحة سيرتك الذاتية، صفحة لمشروع تحبه، مدوّنة بسيطة.</div></div>',
          en: '<h2>What do you need?</h2>' +
              '<ul>' +
              '<li>A folder containing <code>index.html</code> and your other files.</li>' +
              '<li>A free account on a hosting platform.</li>' +
              '</ul>' +
              '<h2>GitHub Pages — the most popular</h2>' +
              '<ol>' +
              '<li>Create an account at <code>github.com</code>.</li>' +
              '<li>Create a new repository and make it Public.</li>' +
              '<li>Upload your files — they must include <code>index.html</code>.</li>' +
              '<li>Open <strong>Settings</strong>, then <strong>Pages</strong>.</li>' +
              '<li>Pick the <code>main</code> branch and the <code>/ (root)</code> folder, then save.</li>' +
              '<li>Wait a minute and your link appears as <code>username.github.io/repo-name</code>.</li>' +
              '</ol>' +
              '<h2>Excellent alternatives</h2>' +
              '<ul>' +
              '<li><strong>Netlify</strong> — drag and drop your folder onto the page and it publishes instantly.</li>' +
              '<li><strong>Vercel</strong> — fast and tightly integrated with GitHub.</li>' +
              '<li><strong>Cloudflare Pages</strong> — excellent global performance.</li>' +
              '</ul>' +
              '<h2>A pre-flight checklist</h2>' +
              '<ul>' +
              '<li>The main file is named <code>index.html</code> in lowercase.</li>' +
              '<li>Every path is relative and works (open the page locally and confirm).</li>' +
              '<li>No spaces or capitals in file names.</li>' +
              '<li>A <code>title</code>, a <code>meta description</code> and a <code>viewport</code> are present.</li>' +
              '<li>You tested the page on a phone-sized screen.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">🎓</span><div><b>And then what?</b>You have finished the HTML fundamentals. Next: <strong>CSS</strong> (Flexbox and Grid), then <strong>JavaScript</strong>. But more important than any course: build small real projects — your CV page, a page for something you love, a simple blog.</div></div>'
        },
        example: {
          note: { ar: 'هذا هيكل مشروع جاهز للنشر — لاحظ أسماء الملفات كلها بحروف صغيرة.',
                  en: 'A project structure ready to publish — notice every file name is lowercase.' },
          code: {
            ar: '<h3>هيكل المشروع الجاهز للنشر</h3>\n<pre><code>my-site/\n  index.html      ← الصفحة الرئيسية (إجباري)\n  about.html\n  css/\n    style.css\n  images/\n    logo.png\n    hero.jpg</code></pre>\n\n<h3>قائمة الفحص</h3>\n<ul>\n  <li>✅ index.html بحروف صغيرة</li>\n  <li>✅ المسارات نسبية</li>\n  <li>✅ بلا مسافات في الأسماء</li>\n  <li>✅ meta viewport موجودة</li>\n</ul>',
            en: '<h3>A publish-ready project structure</h3>\n<pre><code>my-site/\n  index.html      ← the home page (required)\n  about.html\n  css/\n    style.css\n  images/\n    logo.png\n    hero.jpg</code></pre>\n\n<h3>Checklist</h3>\n<ul>\n  <li>✅ index.html in lowercase</li>\n  <li>✅ relative paths</li>\n  <li>✅ no spaces in names</li>\n  <li>✅ meta viewport present</li>\n</ul>'
          }
        },
        challenge: {
          brief: { ar: 'اكتب صفحة جاهزة للنشر: doctype، وhtml بـ lang، وhead فيه charset وviewport وtitle، وbody فيه header بعنوان وmain بفقرة وfooter.',
                   en: 'Write a publish-ready page: a doctype, html with lang, a head with charset, viewport and title, and a body with a header, a main paragraph and a footer.' },
          starter: { ar: '<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n  \n</head>\n<body>\n  \n</body>\n</html>',
                     en: '<!doctype html>\n<html lang="en">\n<head>\n  \n</head>\n<body>\n  \n</body>\n</html>' },
          solution: { ar: '<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>موقعي الشخصي</title>\n</head>\n<body>\n  <header><h1>اسمي</h1></header>\n  <main><p>مرحباً بك في موقعي.</p></main>\n  <footer><p>© 2026</p></footer>\n</body>\n</html>',
                      en: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My personal site</title>\n</head>\n<body>\n  <header><h1>My name</h1></header>\n  <main><p>Welcome to my site.</p></main>\n  <footer><p>© 2026</p></footer>\n</body>\n</html>' },
          checks: [
            { label: { ar: 'يوجد doctype وسمة lang', en: 'A doctype and a lang attribute' },
              hint:  { ar: '<!doctype html> ثم <html lang="ar">', en: '<!doctype html> then <html lang="en">' },
              test: function (d, raw) { return /<!doctype\s+html/i.test(raw) && /<html[^>]*\slang\s*=/i.test(raw); } },
            { label: { ar: 'يوجد charset وviewport وtitle', en: 'charset, viewport and title are present' },
              hint:  { ar: 'ثلاثتها داخل <head>', en: 'All three inside <head>' },
              test: function (d, raw) {
                return /<meta[^>]*charset/i.test(raw) &&
                       /<meta[^>]*viewport/i.test(raw) &&
                       /<title>\s*\S/i.test(raw);
              } },
            { label: { ar: 'يوجد <header> فيه عنوان h1', en: 'A <header> with an h1' },
              hint:  { ar: '<header><h1>اسمك</h1></header>', en: '<header><h1>your name</h1></header>' },
              test: function (d) { return filled(d, 'header h1'); } },
            { label: { ar: 'يوجد <main> فيه فقرة', en: 'A <main> containing a paragraph' },
              hint:  { ar: '<main><p>نص</p></main>', en: '<main><p>text</p></main>' },
              test: function (d) { return filled(d, 'main p'); } },
            { label: { ar: 'يوجد <footer> فيه نص', en: 'A <footer> with text' },
              hint:  { ar: '<footer><p>© 2026</p></footer>', en: '<footer><p>© 2026</p></footer>' },
              test: function (d) { return filled(d, 'footer'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما اسم الملف الذي يبحث عنه الخادم تلقائياً؟', en: 'Which file name does a server look for automatically?' },
            options: [ { ar: 'home.html', en: 'home.html' }, { ar: 'index.html', en: 'index.html' },
                       { ar: 'main.html', en: 'main.html' }, { ar: 'start.html', en: 'start.html' } ],
            answer: 1,
            why: { ar: 'index.html هو الاسم الافتراضي لصفحة أي مجلد.',
                   en: 'index.html is the default page name for any folder.' } },
          { q: { ar: 'أين تُفعّل GitHub Pages؟', en: 'Where do you enable GitHub Pages?' },
            options: [ { ar: 'في Settings ثم Pages', en: 'In Settings, then Pages' }, { ar: 'في Issues', en: 'In Issues' },
                       { ar: 'في Actions', en: 'In Actions' }, { ar: 'في Profile', en: 'In Profile' } ],
            answer: 0,
            why: { ar: 'من إعدادات المستودع، بتحديد الفرع والمجلد.',
                   en: 'From the repository settings, by choosing the branch and folder.' } },
          { q: { ar: 'ما أفضل خطوة بعد إتقان HTML؟', en: 'What is the best step after mastering HTML?' },
            options: [ { ar: 'التوقف', en: 'Stop there' }, { ar: 'تعلّم CSS ثم JavaScript وبناء مشاريع', en: 'Learn CSS then JavaScript and build projects' },
                       { ar: 'حفظ كل الوسوم غيباً', en: 'Memorise every tag' }, { ar: 'شراء دورة مدفوعة', en: 'Buy a paid course' } ],
            answer: 1,
            why: { ar: 'البناء العملي هو ما يثبّت المعرفة فعلاً.',
                   en: 'Building real things is what makes knowledge stick.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     المشروع الختامي / Final project
     =========================================================== */
  var PROJECT = {
    title: { ar: 'صفحتك الشخصية الكاملة', en: 'Your complete personal page' },
    intro: {
      ar: 'حان وقت الجمع بين كل ما تعلّمته. ستبني صفحة شخصية حقيقية صالحة للنشر: هيكل كامل، رأس بقائمة تنقّل، نبذة، مهارات، جدول خبرات، صورة، نموذج تواصل، وتذييل. أنجز الخطوات بالترتيب واضغط «تحقّق» في أي وقت لترى ما أنجزته وما بقي.',
      en: 'Time to combine everything you learned. You will build a real, publish-ready personal page: a full skeleton, a header with navigation, an intro, skills, an experience table, an image, a contact form and a footer. Work through the steps in order and press Check at any time to see what is done and what remains.'
    },
    starter: {
      ar: '<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>صفحتي الشخصية</title>\n</head>\n<body>\n\n  <!-- 1) الرأس: عنوان + قائمة تنقّل -->\n\n  <!-- 2) المحتوى الأساسي: نبذة، مهارات، خبرات، صورة، تواصل -->\n\n  <!-- 3) التذييل -->\n\n</body>\n</html>',
      en: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My personal page</title>\n</head>\n<body>\n\n  <!-- 1) Header: title + navigation -->\n\n  <!-- 2) Main content: intro, skills, experience, image, contact -->\n\n  <!-- 3) Footer -->\n\n</body>\n</html>'
    },
    solution: {
      ar: '<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>سارة العتيبي — مطوّرة ويب</title>\n  <meta name="description" content="صفحة شخصية لمطوّرة ويب مبتدئة: نبذة ومهارات وخبرات وطريقة تواصل.">\n</head>\n<body>\n\n  <header>\n    <h1>سارة العتيبي</h1>\n    <p>مطوّرة واجهات أمامية</p>\n    <nav>\n      <ul>\n        <li><a href="#about">نبذة</a></li>\n        <li><a href="#skills">مهاراتي</a></li>\n        <li><a href="#contact">تواصل</a></li>\n      </ul>\n    </nav>\n  </header>\n\n  <main>\n    <section id="about">\n      <h2>نبذة عني</h2>\n      <p>أتعلّم <strong>HTML</strong> و<strong>CSS</strong> وأبني مشاريع صغيرة كل أسبوع.</p>\n      <figure>\n        <img src="https://picsum.photos/id/1027/280/280" alt="صورة شخصية لسارة" width="280">\n        <figcaption>صورتي الشخصية</figcaption>\n      </figure>\n    </section>\n\n    <section id="skills">\n      <h2>مهاراتي</h2>\n      <ul>\n        <li>بناء صفحات HTML دلالية</li>\n        <li>تنسيق بـ CSS</li>\n        <li>تصميم متجاوب</li>\n      </ul>\n\n      <h3>الخبرات</h3>\n      <table border="1" cellpadding="6">\n        <caption>مشاريعي</caption>\n        <thead>\n          <tr><th>المشروع</th><th>السنة</th><th>الأدوات</th></tr>\n        </thead>\n        <tbody>\n          <tr><td>متجر صغير</td><td>2025</td><td>HTML</td></tr>\n          <tr><td>مدوّنة</td><td>2026</td><td>HTML, CSS</td></tr>\n        </tbody>\n      </table>\n    </section>\n\n    <section id="contact">\n      <h2>تواصل معي</h2>\n      <form action="#" method="post">\n        <p>\n          <label for="name">الاسم</label><br>\n          <input type="text" id="name" name="name" required>\n        </p>\n        <p>\n          <label for="email">البريد</label><br>\n          <input type="email" id="email" name="email" required>\n        </p>\n        <p>\n          <label for="msg">رسالتك</label><br>\n          <textarea id="msg" name="message" rows="4"></textarea>\n        </p>\n        <button type="submit">إرسال</button>\n      </form>\n    </section>\n  </main>\n\n  <footer>\n    <p>جميع الحقوق محفوظة &copy; 2026 — سارة العتيبي</p>\n  </footer>\n\n</body>\n</html>',
      en: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Sara Ahmed — web developer</title>\n  <meta name="description" content="Personal page of a junior web developer: intro, skills, experience and contact.">\n</head>\n<body>\n\n  <header>\n    <h1>Sara Ahmed</h1>\n    <p>Front-end developer</p>\n    <nav>\n      <ul>\n        <li><a href="#about">About</a></li>\n        <li><a href="#skills">Skills</a></li>\n        <li><a href="#contact">Contact</a></li>\n      </ul>\n    </nav>\n  </header>\n\n  <main>\n    <section id="about">\n      <h2>About me</h2>\n      <p>I am learning <strong>HTML</strong> and <strong>CSS</strong> and building a small project every week.</p>\n      <figure>\n        <img src="https://picsum.photos/id/1027/280/280" alt="A portrait of Sara" width="280">\n        <figcaption>My photo</figcaption>\n      </figure>\n    </section>\n\n    <section id="skills">\n      <h2>Skills</h2>\n      <ul>\n        <li>Building semantic HTML pages</li>\n        <li>Styling with CSS</li>\n        <li>Responsive design</li>\n      </ul>\n\n      <h3>Experience</h3>\n      <table border="1" cellpadding="6">\n        <caption>My projects</caption>\n        <thead>\n          <tr><th>Project</th><th>Year</th><th>Tools</th></tr>\n        </thead>\n        <tbody>\n          <tr><td>Small shop</td><td>2025</td><td>HTML</td></tr>\n          <tr><td>Blog</td><td>2026</td><td>HTML, CSS</td></tr>\n        </tbody>\n      </table>\n    </section>\n\n    <section id="contact">\n      <h2>Contact me</h2>\n      <form action="#" method="post">\n        <p>\n          <label for="name">Name</label><br>\n          <input type="text" id="name" name="name" required>\n        </p>\n        <p>\n          <label for="email">Email</label><br>\n          <input type="email" id="email" name="email" required>\n        </p>\n        <p>\n          <label for="msg">Message</label><br>\n          <textarea id="msg" name="message" rows="4"></textarea>\n        </p>\n        <button type="submit">Send</button>\n      </form>\n    </section>\n  </main>\n\n  <footer>\n    <p>All rights reserved &copy; 2026 — Sara Ahmed</p>\n  </footer>\n\n</body>\n</html>'
    },
    checks: [
      { label: { ar: 'هيكل كامل: doctype وlang وcharset وviewport وtitle', en: 'Full skeleton: doctype, lang, charset, viewport and title' },
        hint:  { ar: 'ابدأ من الهيكل الجاهز في المحرر', en: 'Start from the skeleton already in the editor' },
        test: function (d, raw) {
          return /<!doctype\s+html/i.test(raw) && /<html[^>]*\slang\s*=/i.test(raw) &&
                 /<meta[^>]*charset/i.test(raw) && /<meta[^>]*viewport/i.test(raw) && /<title>\s*\S/i.test(raw);
        } },
      { label: { ar: 'رأس <header> فيه <h1> باسمك', en: 'A <header> with an <h1> carrying your name' },
        hint:  { ar: '<header><h1>اسمك</h1></header>', en: '<header><h1>Your name</h1></header>' },
        test: function (d) { return filled(d, 'header h1'); } },
      { label: { ar: 'قائمة تنقّل <nav> فيها قائمة <ul> بثلاثة روابط', en: 'A <nav> with a <ul> of three links' },
        hint:  { ar: 'ثلاثة <li> كل واحد فيه <a href="#...">', en: 'Three <li> items, each with an <a href="#...">' },
        test: function (d) { return n(d, 'nav ul li a') >= 3; } },
      { label: { ar: 'الروابط الداخلية تشير إلى أقسام موجودة فعلاً', en: 'The in-page links point to sections that exist' },
        hint:  { ar: 'href="#about" يحتاج عنصراً id="about"', en: 'href="#about" needs an element with id="about"' },
        test: function (d) {
          var links = d.querySelectorAll('nav a[href^="#"]'), ok = 0;
          for (var i = 0; i < links.length; i++) {
            var id = links[i].getAttribute('href').slice(1);
            if (id && d.getElementById(id)) ok++;
          }
          return ok >= 2;
        } },
      { label: { ar: '<main> واحد فيه ثلاثة أقسام <section> لكل منها عنوان', en: 'One <main> with three <section> blocks, each with a heading' },
        hint:  { ar: 'نبذة، مهارات، تواصل', en: 'About, skills, contact' },
        test: function (d) {
          if (n(d, 'main') !== 1) return false;
          var secs = d.querySelectorAll('main section'), ok = 0;
          for (var i = 0; i < secs.length; i++) { if (secs[i].querySelector('h2, h3')) ok++; }
          return ok >= 3;
        } },
      { label: { ar: 'فقرة نبذة فيها نص بارز <strong>', en: 'An intro paragraph containing <strong> text' },
        hint:  { ar: 'غلّف مهارة أو كلمة مهمة بـ <strong>', en: 'Wrap a key skill or word in <strong>' },
        test: function (d) { return filled(d, 'p strong'); } },
      { label: { ar: 'قائمة مهارات <ul> فيها ثلاثة عناصر', en: 'A skills <ul> with three items' },
        hint:  { ar: 'ثلاثة <li> على الأقل', en: 'At least three <li> items' },
        test: function (d) {
          var uls = d.querySelectorAll('ul');
          for (var i = 0; i < uls.length; i++) {
            if (uls[i].closest('nav')) continue;
            var c = 0, kids = uls[i].children;
            for (var j = 0; j < kids.length; j++) { if (kids[j].tagName === 'LI') c++; }
            if (c >= 3) return true;
          }
          return false;
        } },
      { label: { ar: 'جدول خبرات فيه <caption> و<thead> وصفّا بيانات', en: 'An experience table with <caption>, <thead> and two data rows' },
        hint:  { ar: 'ثلاثة أعمدة: المشروع، السنة، الأدوات', en: 'Three columns: project, year, tools' },
        test: function (d) { return filled(d, 'table caption') && n(d, 'thead th') >= 2 && n(d, 'tbody tr') >= 2; } },
      { label: { ar: 'صورة داخل <figure> لها alt وصفي و<figcaption>', en: 'An image inside a <figure> with descriptive alt and a <figcaption>' },
        hint:  { ar: 'استخدم أي صورة، المهم البنية', en: 'Any image works; the structure is what counts' },
        test: function (d) {
          var im = d.querySelector('figure img');
          var a = im && im.getAttribute('alt');
          return !!a && a.trim().length >= 3 && filled(d, 'figure figcaption');
        } },
      { label: { ar: 'نموذج تواصل فيه حقل اسم وبريد وtextarea', en: 'A contact form with a name field, an email field and a textarea' },
        hint:  { ar: 'ضع الثلاثة داخل <form>', en: 'Put all three inside a <form>' },
        test: function (d) {
          return has(d, 'form input[type="text"]') && has(d, 'form input[type="email"]') && has(d, 'form textarea');
        } },
      { label: { ar: 'كل حقول النموذج لها <label> مرتبطة بـ for/id', en: 'Every form field has a <label> bound via for/id' },
        hint:  { ar: 'label for="name" مع input id="name"', en: 'label for="name" with input id="name"' },
        test: function (d) {
          var fields = d.querySelectorAll('form input, form textarea');
          if (fields.length < 3) return false;
          for (var i = 0; i < fields.length; i++) {
            var id = fields[i].getAttribute('id');
            if (!id || !d.querySelector('label[for="' + id + '"]')) return false;
          }
          return true;
        } },
      { label: { ar: 'زر إرسال، وحقلا الاسم والبريد مطلوبان بـ required', en: 'A submit button, with name and email marked required' },
        hint:  { ar: 'أضف required للحقلين', en: 'Add required to both fields' },
        test: function (d) {
          return has(d, 'form button, form input[type="submit"]') &&
                 has(d, 'input[type="text"][required]') && has(d, 'input[type="email"][required]');
        } },
      { label: { ar: 'تذييل <footer> فيه نص الحقوق', en: 'A <footer> containing a copyright line' },
        hint:  { ar: 'استخدم &copy; لرمز الحقوق', en: 'Use &copy; for the copyright symbol' },
        test: function (d) { return filled(d, 'footer'); } }
    ]
  };

  /* ===========================================================
     التصدير / Export
     =========================================================== */
  var ALL = [];
  for (var mi = 0; mi < MODULES.length; mi++) {
    var mod = MODULES[mi];
    for (var li = 0; li < mod.lessons.length; li++) {
      var les = mod.lessons[li];
      les.moduleId = mod.id;
      les.moduleTitle = mod.title;
      les.moduleIndex = mi;
      les.index = ALL.length;
      ALL.push(les);
    }
  }

  global.COURSE = {
    modules: MODULES,
    lessons: ALL,
    project: PROJECT,

    lesson: function (id) {
      for (var i = 0; i < ALL.length; i++) { if (ALL[i].id === id) return ALL[i]; }
      return null;
    },
    module: function (id) {
      for (var i = 0; i < MODULES.length; i++) { if (MODULES[i].id === id) return MODULES[i]; }
      return null;
    },
    stats: function () {
      var challenges = 0, questions = 0;
      for (var i = 0; i < ALL.length; i++) {
        if (ALL[i].challenge) challenges++;
        if (ALL[i].quiz) questions += ALL[i].quiz.length;
      }
      return { lessons: ALL.length, modules: MODULES.length, challenges: challenges, questions: questions };
    }
  };
})(window);
