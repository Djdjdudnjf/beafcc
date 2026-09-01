/* =============================================================
   lessons.js — محتوى المنهج كاملاً بالعربية والإنجليزية
   Full bilingual Python curriculum

   عقد الفحص: كل test يستقبل كائن نتيجة التشغيل r
   Check contract: every test receives the run-result object r
     r.ok            لا يوجد خطأ / no exception was raised
     r.stdout        كل ما طُبع / everything printed
     r.lines         المطبوع مقسّماً أسطراً / printed lines
     r.prints(x)     هل طُبع نص أو نمط / did it print text or a pattern
     r.has(name)     هل عُرّف اسم / is a name defined
     r.type(name)    نوعه كاسم بايثون / its Python type name
     r.val(name)     قيمته إن كانت JSON / its value when JSON-able
     r.src(re)       فحص الكود المصدري / test the source itself
     r.call(fn,args) استدعاء دالة المتعلّم (Promise) / call a learner function
   ============================================================= */
(function (global) {
  'use strict';

  /* عدّ تكرار نمط في الكود / count pattern occurrences in source */
  function count(code, re) { var m = String(code).match(re); return m ? m.length : 0; }
  /* كل الأسطر المطبوعة غير فارغة / every printed line has content */
  function allFilled(r, min) {
    if (r.lines.length < (min || 1)) return false;
    return r.lines.every(function (l) { return l.trim().length > 0; });
  }
  /* قيمة عددية قريبة / numeric closeness */
  function near(a, b, eps) {
    return typeof a === 'number' && isFinite(a) && Math.abs(a - b) <= (eps == null ? 1e-9 : eps);
  }
  /* هل الاسم دالة عرّفها المتعلّم / is the name a learner-defined function */
  function isFn(r, name) { return r.type(name) === 'function'; }

  var MODULES = [];

  /* ===========================================================
     الوحدة 1 — البداية / Module 1 — Getting started
     =========================================================== */
  MODULES.push({
    id: 'basics',
    icon: '🚀',
    title: { ar: 'البداية: أول سطر بايثون', en: 'Getting started: your first line of Python' },
    desc:  { ar: 'ما هي بايثون، كيف تُنفَّذ، وكيف تكتب أول برنامج يطبع ويقرأ ويتذكّر.',
             en: 'What Python is, how it runs, and how to write your first program that prints, reads and remembers.' },
    lessons: [

      {
        id: 'what-is-python',
        minutes: 7, level: 'beginner',
        tags: ['python', 'أساسيات', 'basics'],
        title: { ar: 'ما هي لغة بايثون؟', en: 'What is Python?' },
        lede: {
          ar: 'قبل أن تكتب أي سطر، افهم ما الذي تفعله بايثون بالضبط — ولماذا اختارتها ناسا وإنستغرام ويوتيوب وأغلب مشاريع الذكاء الاصطناعي.',
          en: 'Before writing a single line, understand exactly what Python does — and why NASA, Instagram, YouTube and most AI projects chose it.'
        },
        body: {
          ar: '<h2>الفكرة في جملة واحدة</h2>' +
              '<p><strong>بايثون لغة برمجة</strong>: أنت تكتب <em>أوامر</em> والحاسوب ينفّذها بالترتيب. على عكس HTML التي تصف شكل صفحة، بايثون تصنع <em>قرارات</em> و<em>تكرارات</em> و<em>حسابات</em>. تقول لها: احسب، قارن، كرّر، احفظ، اطبع — فتفعل.</p>' +
              '<p>سُمّيت على اسم فرقة الكوميديا البريطانية <em>Monty Python</em>، لا على اسم الأفعى. صمّمها <strong>خيدو فان روسم</strong> عام 1991 بهدف واحد: لغة تُقرأ كأنها إنجليزية بسيطة.</p>' +
              '<h2>لماذا بايثون تحديداً؟</h2>' +
              '<p>قارن بين طباعة جملة في ثلاث لغات:</p>' +
              '<ul>' +
              '<li><strong>Java</strong>: <code>System.out.println("مرحبا");</code> داخل صنف داخل دالة.</li>' +
              '<li><strong>C++</strong>: <code>std::cout &lt;&lt; "مرحبا";</code> بعد استيراد مكتبة.</li>' +
              '<li><strong>Python</strong>: <code>print("مرحبا")</code> — هذا كل شيء.</li>' +
              '</ul>' +
              '<p>هذا الفرق ليس تجميلاً. كلّما قلّت الشيفرة، قلّت الأخطاء، وزاد الوقت الذي تقضيه في <em>حلّ المشكلة</em> بدل مصارعة اللغة.</p>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>تشبيه يثبّت الفكرة</b>لغات أخرى تطلب منك شرح كل تفصيل للحاسوب كأنك تخاطب آلة. بايثون تجعلك تخاطبه كأنك تكتب وصفة طبخ لإنسان: «خذ القائمة، لكل عنصر فيها، اطبع اسمه».</div></div>' +
              '<h2>أين تُستخدم فعلياً؟</h2>' +
              '<ul>' +
              '<li><strong>الذكاء الاصطناعي وتعلّم الآلة</strong> — لغة المجال الأولى بلا منافس.</li>' +
              '<li><strong>تحليل البيانات</strong> — من جداول إكسل إلى ملايين السجلات.</li>' +
              '<li><strong>مواقع الويب</strong> — إنستغرام وسبوتيفاي مبنيان على إطار Django.</li>' +
              '<li><strong>الأتمتة</strong> — سكربت يرتّب ملفاتك أو يرسل تقاريرك كل صباح.</li>' +
              '<li><strong>العلوم</strong> — ناسا تستخدمها في تحليل بيانات المهمّات.</li>' +
              '</ul>' +
              '<h2>لغة مُفسَّرة: ماذا يعني ذلك؟</h2>' +
              '<p>بايثون <strong>مُفسَّرة</strong> (interpreted): لا تحتاج خطوة «بناء» قبل التشغيل. تكتب السطر وتضغط تشغيل فيُنفَّذ فوراً. هذا يجعل التجربة والتعلّم أسرع بكثير، وهو بالضبط ما سنفعله في كل درس هنا.</p>' +
              '<div class="callout callout-note"><span class="ic">🐍</span><div><b>بايثون تعمل الآن داخل متصفحك</b>محرّر كل درس في هذه المنصة يشغّل <em>مفسّر بايثون حقيقي</em> (CPython مُترجَم إلى WebAssembly) داخل صفحتك. لا خادم، ولا تثبيت. أول تشغيل يستغرق ثوانٍ لتحميل المفسّر، وبعدها كل شيء فوري.</div></div>',
          en: '<h2>The idea in one sentence</h2>' +
              '<p><strong>Python is a programming language</strong>: you write <em>instructions</em> and the computer executes them in order. Unlike HTML, which describes how a page looks, Python makes <em>decisions</em>, <em>repeats</em> work and <em>calculates</em>. You tell it to compute, compare, loop, store, print — and it does.</p>' +
              '<p>It is named after the British comedy troupe <em>Monty Python</em>, not the snake. <strong>Guido van Rossum</strong> designed it in 1991 with one goal: a language that reads like plain English.</p>' +
              '<h2>Why Python specifically?</h2>' +
              '<p>Compare printing one sentence in three languages:</p>' +
              '<ul>' +
              '<li><strong>Java</strong>: <code>System.out.println("Hello");</code> inside a method inside a class.</li>' +
              '<li><strong>C++</strong>: <code>std::cout &lt;&lt; "Hello";</code> after including a library.</li>' +
              '<li><strong>Python</strong>: <code>print("Hello")</code> — that is the whole program.</li>' +
              '</ul>' +
              '<p>That difference is not cosmetic. Less code means fewer bugs, and more of your time spent <em>solving the problem</em> instead of fighting the language.</p>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>An analogy that sticks</b>Other languages make you explain every detail to a machine. Python lets you talk to it the way you would write a recipe for a person: "take the list, for each item in it, print its name".</div></div>' +
              '<h2>Where is it actually used?</h2>' +
              '<ul>' +
              '<li><strong>AI and machine learning</strong> — the field\'s default language, by a wide margin.</li>' +
              '<li><strong>Data analysis</strong> — from spreadsheets to millions of records.</li>' +
              '<li><strong>Web backends</strong> — Instagram and Spotify are built on the Django framework.</li>' +
              '<li><strong>Automation</strong> — a script that tidies your files or emails your report every morning.</li>' +
              '<li><strong>Science</strong> — NASA uses it to analyse mission data.</li>' +
              '</ul>' +
              '<h2>An interpreted language: what does that mean?</h2>' +
              '<p>Python is <strong>interpreted</strong>: there is no "build" step before running. You write a line, press run, and it executes immediately. That makes experimenting and learning far faster — and it is exactly what we will do in every lesson here.</p>' +
              '<div class="callout callout-note"><span class="ic">🐍</span><div><b>Python is running inside your browser right now</b>Every lesson editor on this platform runs a <em>real Python interpreter</em> (CPython compiled to WebAssembly) inside your page. No server, no install. The first run takes a few seconds to download the interpreter; after that everything is instant.</div></div>'
        },
        example: {
          note: { ar: 'اضغط «تشغيل». أول مرة ستستغرق ثوانٍ لتحميل بايثون، ثم غيّر النص وشغّل مرة أخرى.',
                  en: 'Press "Run". The first time takes a few seconds to load Python, then change the text and run again.' },
          code: {
            ar: '# أول برنامج لك بلغة بايثون\nprint("أهلاً بالعالم!")\nprint("أنا أتعلّم بايثون")\n\n# بايثون تحسب أيضاً\nprint(2 + 3 * 4)',
            en: '# Your first Python program\nprint("Hello, world!")\nprint("I am learning Python")\n\n# Python calculates too\nprint(2 + 3 * 4)'
          }
        },
        challenge: {
          brief: { ar: 'اطبع ثلاثة أسطر على الأقل: اسمك، والمدينة التي تعيش فيها، وسبب تعلّمك بايثون. استخدم print ثلاث مرات.',
                   en: 'Print at least three lines: your name, the city you live in, and why you are learning Python. Use print three times.' },
          starter: { ar: '# اكتب هنا — استخدم print ثلاث مرات\n', en: '# Write here — use print three times\n' },
          solution: { ar: 'print("أنا سارة")\nprint("أعيش في الرياض")\nprint("أتعلّم بايثون لتحليل البيانات")',
                      en: 'print("I am Sara")\nprint("I live in Riyadh")\nprint("I am learning Python for data analysis")' },
          checks: [
            { label: { ar: 'البرنامج يعمل بلا أخطاء', en: 'The program runs without errors' },
              hint:  { ar: 'تأكّد من إغلاق الأقواس وعلامات الاقتباس', en: 'Make sure brackets and quotes are closed' },
              test: function (r) { return r.ok; } },
            { label: { ar: 'استخدمت print ثلاث مرات على الأقل', en: 'You used print at least three times' },
              hint:  { ar: 'اكتب ثلاثة أسطر كلٌّ منها ‎print("…")‎', en: 'Write three separate print("…") lines' },
              test: function (r) { return count(r.code, /print\s*\(/g) >= 3; } },
            { label: { ar: 'طُبعت ثلاثة أسطر أو أكثر', en: 'Three or more lines were printed' },
              hint:  { ar: 'كل print تطبع سطراً جديداً', en: 'Each print outputs its own line' },
              test: function (r) { return r.lines.length >= 3; } },
            { label: { ar: 'لا يوجد سطر فارغ بين المطبوعات', en: 'No printed line is empty' },
              hint:  { ar: 'ضع نصاً حقيقياً داخل كل ‎print("…")‎', en: 'Put real text inside each print("…")' },
              test: function (r) { return allFilled(r, 3); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما التصنيف الصحيح للغة بايثون؟', en: 'How is Python correctly classified?' },
            options: [ { ar: 'لغة ترميز لوصف الصفحات', en: 'A markup language for describing pages' },
                       { ar: 'لغة برمجة مُفسَّرة', en: 'An interpreted programming language' },
                       { ar: 'قاعدة بيانات', en: 'A database' },
                       { ar: 'نظام تشغيل', en: 'An operating system' } ],
            answer: 1,
            why: { ar: 'بايثون لغة برمجة كاملة، وتُنفَّذ سطراً بسطر عبر مفسّر دون خطوة بناء منفصلة.',
                   en: 'Python is a full programming language, executed line by line by an interpreter with no separate build step.' } },
          { q: { ar: 'على اسم ماذا سُمّيت بايثون؟', en: 'What is Python named after?' },
            options: [ { ar: 'الأفعى الضخمة', en: 'The large snake' },
                       { ar: 'فرقة كوميديا بريطانية', en: 'A British comedy troupe' },
                       { ar: 'مدينة يونانية', en: 'A Greek city' },
                       { ar: 'اسم مُصمّمها', en: 'Its designer\'s name' } ],
            answer: 1,
            why: { ar: 'اختار خيدو فان روسم الاسم من فرقة Monty Python الكوميدية.',
                   en: 'Guido van Rossum took the name from the Monty Python comedy troupe.' } },
          { q: { ar: 'ما ميزة كون اللغة «مُفسَّرة»؟', en: 'What is the advantage of being "interpreted"?' },
            options: [ { ar: 'تعمل دون كهرباء', en: 'It runs without electricity' },
                       { ar: 'تُنفَّذ فوراً بلا خطوة بناء', en: 'It runs immediately with no build step' },
                       { ar: 'لا تحتاج إلى كتابة كود', en: 'It needs no code at all' },
                       { ar: 'تعمل على المتصفح فقط', en: 'It only works in a browser' } ],
            answer: 1,
            why: { ar: 'تكتب السطر وتشغّله مباشرة، ما يجعل التجريب والتعلّم أسرع.',
                   en: 'You write a line and run it directly, which makes experimenting and learning much faster.' } }
        ]
      },

      {
        id: 'first-program',
        minutes: 8, level: 'beginner',
        tags: ['print', 'أساسيات', 'output'],
        title: { ar: 'أول برنامج: دالة print', en: 'Your first program: the print function' },
        lede: { ar: 'print هي نافذتك على ما يحدث داخل البرنامج. أتقنها الآن لأنك ستستخدمها في كل درس بعد هذا.',
                en: 'print is your window into what the program is doing. Master it now — you will use it in every lesson after this.' },
        body: {
          ar: '<h2>أبسط أمر في بايثون</h2>' +
              '<p><code>print()</code> دالة تعرض ما بين قوسيها. النص يوضع بين علامتَي اقتباس: مفردة <code>\'…\'</code> أو مزدوجة <code>"…"</code> — بايثون لا تفرّق بينهما، لكن كن متسقاً.</p>' +
              '<pre><code>print("مرحباً")\nprint(\'مرحباً أيضاً\')</code></pre>' +
              '<h2>كل print سطر جديد</h2>' +
              '<p>بشكل افتراضي تُنهي <code>print</code> سطرها وتنتقل للتالي. لتغيير ذلك استخدم المُعامل <code>end</code>:</p>' +
              '<pre><code>print("أ", end="")\nprint("ب", end="")\nprint("ج")   # ينتج: أبج</code></pre>' +
              '<h2>أكثر من قيمة في نداء واحد</h2>' +
              '<p>افصل بينها بفاصلة، وستضع بايثون مسافة بينها تلقائياً:</p>' +
              '<pre><code>print("العمر:", 25)          # العمر: 25\nprint("أ", "ب", sep=" - ")   # أ - ب</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>الخطأ الأشيع للمبتدئين</b>نسيان علامات الاقتباس. <code>print(مرحبا)</code> يجعل بايثون تظن أن <code>مرحبا</code> اسم متغيّر لم تعرّفه، فيظهر خطأ <code>NameError</code>. النص دائماً بين اقتباسين.</div></div>' +
              '<h2>التعليقات</h2>' +
              '<p>كل ما يلي علامة <code>#</code> تتجاهله بايثون تماماً. التعليقات لك ولمن يقرأ كودك لاحقاً:</p>' +
              '<pre><code># هذا السطر لا يُنفَّذ\nprint("هذا يُنفَّذ")  # وهذا تعليق في نهاية سطر</code></pre>' +
              '<h2>قراءة رسالة الخطأ</h2>' +
              '<p>ستُخطئ كثيراً — وهذا طبيعي. اقرأ آخر سطر في رسالة الخطأ أولاً: هو يخبرك <em>بنوع</em> المشكلة، والسطر الذي قبله يخبرك <em>بمكانها</em>. جرّب حذف قوس في المثال أدناه وشاهد ماذا يحدث.</p>',
          en: '<h2>The simplest instruction in Python</h2>' +
              '<p><code>print()</code> is a function that displays whatever sits between its brackets. Text goes inside quotes: single <code>\'…\'</code> or double <code>"…"</code> — Python treats them the same, but be consistent.</p>' +
              '<pre><code>print("Hello")\nprint(\'Hello again\')</code></pre>' +
              '<h2>Every print starts a new line</h2>' +
              '<p>By default <code>print</code> ends its line and moves to the next. Change that with the <code>end</code> parameter:</p>' +
              '<pre><code>print("a", end="")\nprint("b", end="")\nprint("c")   # prints: abc</code></pre>' +
              '<h2>More than one value per call</h2>' +
              '<p>Separate them with commas and Python inserts a space automatically:</p>' +
              '<pre><code>print("Age:", 25)           # Age: 25\nprint("a", "b", sep=" - ")  # a - b</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>The most common beginner mistake</b>Forgetting the quotes. <code>print(hello)</code> makes Python think <code>hello</code> is a variable you never created, so it raises a <code>NameError</code>. Text always lives inside quotes.</div></div>' +
              '<h2>Comments</h2>' +
              '<p>Everything after a <code>#</code> is ignored by Python entirely. Comments are for you and for whoever reads your code later:</p>' +
              '<pre><code># this line never runs\nprint("this one does")  # and this is a trailing comment</code></pre>' +
              '<h2>Reading an error message</h2>' +
              '<p>You will make mistakes constantly — that is normal. Read the <em>last</em> line of the error first: it tells you the <em>kind</em> of problem, and the line above tells you <em>where</em>. Try deleting a bracket in the example below and see what happens.</p>'
        },
        example: {
          note: { ar: 'جرّب تغيير sep و end، ثم احذف قوساً عمداً لترى شكل رسالة الخطأ.',
                  en: 'Try changing sep and end, then delete a bracket on purpose to see what an error looks like.' },
          code: {
            ar: '# ثلاث طرق لاستخدام print\nprint("سطر عادي")\nprint("قيمتان:", 42)\nprint("أ", "ب", "ج", sep=" | ")\n\n# بلا سطر جديد\nprint("لا", end=" ")\nprint("ينتهي السطر هنا")',
            en: '# three ways to use print\nprint("a normal line")\nprint("two values:", 42)\nprint("a", "b", "c", sep=" | ")\n\n# no new line\nprint("no", end=" ")\nprint("line break until here")'
          }
        },
        challenge: {
          brief: { ar: 'اطبع بطاقة تعريف من ثلاثة أسطر: سطر فيه اسمك، سطر فيه كلمة «العمر» متبوعة برقم، وسطر أخير تفصل فيه بين ثلاث كلمات بالرمز |‎ باستخدام sep.',
                   en: 'Print a three-line ID card: a line with your name, a line with the word "Age" followed by a number, and a final line separating three words with | using sep.' },
          starter: { ar: '# 1) اسمك\n\n# 2) العمر ورقم في نداء واحد\n\n# 3) ثلاث كلمات مفصولة بـ | عبر sep\n',
                     en: '# 1) your name\n\n# 2) "Age" and a number in one call\n\n# 3) three words separated by | using sep\n' },
          solution: { ar: 'print("سارة")\nprint("العمر:", 25)\nprint("قراءة", "برمجة", "رياضة", sep=" | ")',
                      en: 'print("Sara")\nprint("Age:", 25)\nprint("reading", "coding", "sport", sep=" | ")' },
          checks: [
            { label: { ar: 'البرنامج يعمل بلا أخطاء', en: 'The program runs without errors' },
              hint:  { ar: 'راجع الأقواس وعلامات الاقتباس', en: 'Check your brackets and quotes' },
              test: function (r) { return r.ok; } },
            { label: { ar: 'طُبعت ثلاثة أسطر', en: 'Three lines were printed' },
              hint:  { ar: 'ثلاثة نداءات print منفصلة', en: 'Three separate print calls' },
              test: function (r) { return r.lines.length >= 3; } },
            { label: { ar: 'أحد الأسطر يحتوي رقماً', en: 'One of the lines contains a number' },
              hint:  { ar: 'مثال: ‎print("العمر:", 25)‎', en: 'For example: print("Age:", 25)' },
              test: function (r) { return /\d/.test(r.stdout); } },
            { label: { ar: 'استخدمت sep وظهر الرمز | في المخرجات', en: 'You used sep and | appears in the output' },
              hint:  { ar: 'اكتب ‎sep=" | "‎ داخل نداء print الثالث', en: 'Write sep=" | " inside the third print call' },
              test: function (r) { return r.src(/sep\s*=/) && r.stdout.indexOf('|') >= 0; } }
          ]
        },
        quiz: [
          { q: { ar: 'ماذا تطبع ‎print("2" + "3")‎؟', en: 'What does print("2" + "3") output?' },
            options: [ { ar: '5', en: '5' }, { ar: '23', en: '23' }, { ar: 'خطأ', en: 'An error' }, { ar: '2 3', en: '2 3' } ],
            answer: 1,
            why: { ar: 'العلامة + بين نصّين تدمجهما، فتنتج "23" وليس الجمع العددي.',
                   en: 'A + between two strings joins them, producing "23" rather than numeric addition.' } },
          { q: { ar: 'ما وظيفة المُعامل end في print؟', en: 'What does the end parameter do in print?' },
            options: [ { ar: 'ينهي البرنامج', en: 'Ends the program' },
                       { ar: 'يحدّد ما يُطبع بعد القيم بدل سطر جديد', en: 'Sets what is printed after the values instead of a newline' },
                       { ar: 'يحذف آخر حرف', en: 'Deletes the last character' },
                       { ar: 'يفصل بين القيم', en: 'Separates the values' } ],
            answer: 1,
            why: { ar: 'القيمة الافتراضية لـ end هي سطر جديد؛ تغييرها يمنع الانتقال للسطر التالي.',
                   en: 'end defaults to a newline; changing it stops print from moving to the next line.' } },
          { q: { ar: 'ما الخطأ في ‎print(مرحبا)‎؟', en: 'What is wrong with print(hello)?' },
            options: [ { ar: 'لا خطأ فيه', en: 'Nothing is wrong' },
                       { ar: 'النص بلا اقتباسين فتظنه بايثون متغيّراً', en: 'The text has no quotes, so Python treats it as a variable' },
                       { ar: 'print تحتاج قوسين مربعين', en: 'print needs square brackets' },
                       { ar: 'يجب أن ينتهي بفاصلة منقوطة', en: 'It must end with a semicolon' } ],
            answer: 1,
            why: { ar: 'بلا اقتباسين تبحث بايثون عن متغيّر بهذا الاسم ولا تجده، فترفع NameError.',
                   en: 'Without quotes Python looks for a variable with that name, fails to find it, and raises NameError.' } }
        ]
      },

      {
        id: 'variables',
        minutes: 9, level: 'beginner',
        tags: ['variables', 'متغيرات'],
        title: { ar: 'المتغيّرات: ذاكرة برنامجك', en: 'Variables: your program\'s memory' },
        lede: { ar: 'المتغيّر اسم تعطيه لقيمة كي تستعملها لاحقاً. بدونه يكون برنامجك بلا ذاكرة.',
                en: 'A variable is a name you give a value so you can use it later. Without them a program has no memory.' },
        body: {
          ar: '<h2>الإسناد: علامة يساوي</h2>' +
              '<p>تكتب <code>الاسم = القيمة</code>. تقرأها: «ضع القيمة في الاسم».</p>' +
              '<pre><code>name = "سارة"\nage = 25\nheight = 1.63</code></pre>' +
              '<p>لاحظ: لا تُعلن نوع المتغيّر كما في لغات أخرى. بايثون تستنتجه من القيمة.</p>' +
              '<h2>الصندوق واللافتة</h2>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>التشبيه الصحيح</b>لا تتخيّل المتغيّر «صندوقاً» توضع فيه القيمة، بل <em>لافتة</em> تُعلّق على القيمة. ولذلك يمكن للافتتين أن تشيرا للقيمة نفسها، ويمكن نقل اللافتة إلى قيمة أخرى في أي وقت.</div></div>' +
              '<h2>القيمة تتغيّر — والنوع أيضاً</h2>' +
              '<pre><code>x = 10        # الآن عدد صحيح\nx = "عشرة"   # والآن نص — مسموح تماماً\nprint(x)      # عشرة</code></pre>' +
              '<h2>قواعد التسمية</h2>' +
              '<ul>' +
              '<li>يبدأ بحرف أو <code>_</code>، ولا يبدأ برقم أبداً.</li>' +
              '<li>حروف وأرقام و<code>_</code> فقط — بلا مسافات ولا رموز.</li>' +
              '<li>حسّاس لحالة الأحرف: <code>age</code> و<code>Age</code> متغيّران مختلفان.</li>' +
              '<li>لا تستخدم الكلمات المحجوزة مثل <code>if</code> و<code>for</code> و<code>class</code>.</li>' +
              '</ul>' +
              '<p>العُرف في بايثون: أسماء بأحرف صغيرة والكلمات مفصولة بشرطة سفلية — <code>user_name</code> لا <code>userName</code>. يسمّى هذا <em>snake_case</em>.</p>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>اسم جيد يوفّر ساعة تصحيح</b><code>x</code> و<code>data</code> و<code>temp</code> أسماء لا تخبر أحداً بشيء. <code>student_count</code> و<code>total_price</code> تشرح نفسها. اكتب للقارئ، والقارئ غالباً هو أنت بعد شهر.</div></div>' +
              '<h2>الإسناد المتعدّد والتبديل</h2>' +
              '<pre><code>a, b = 1, 2\na, b = b, a      # تبديل القيمتين في سطر واحد\nprint(a, b)      # 2 1</code></pre>',
          en: '<h2>Assignment: the equals sign</h2>' +
              '<p>You write <code>name = value</code>. Read it as: "put this value into this name".</p>' +
              '<pre><code>name = "Sara"\nage = 25\nheight = 1.63</code></pre>' +
              '<p>Notice you never declare a type as you would in other languages. Python infers it from the value.</p>' +
              '<h2>The label, not the box</h2>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>The accurate analogy</b>Do not picture a variable as a "box" holding a value — picture it as a <em>label</em> stuck onto a value. That is why two labels can point at the same value, and why a label can be moved to a different value at any moment.</div></div>' +
              '<h2>The value can change — and so can the type</h2>' +
              '<pre><code>x = 10        # now an integer\nx = "ten"     # now a string — perfectly allowed\nprint(x)      # ten</code></pre>' +
              '<h2>Naming rules</h2>' +
              '<ul>' +
              '<li>Starts with a letter or <code>_</code>, never with a digit.</li>' +
              '<li>Letters, digits and <code>_</code> only — no spaces, no symbols.</li>' +
              '<li>Case sensitive: <code>age</code> and <code>Age</code> are two different variables.</li>' +
              '<li>Never use reserved words like <code>if</code>, <code>for</code> or <code>class</code>.</li>' +
              '</ul>' +
              '<p>The Python convention: lowercase names with words joined by underscores — <code>user_name</code>, not <code>userName</code>. This is called <em>snake_case</em>.</p>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>A good name saves an hour of debugging</b><code>x</code>, <code>data</code> and <code>temp</code> tell the reader nothing. <code>student_count</code> and <code>total_price</code> explain themselves. Write for the reader — and the reader is usually you, a month from now.</div></div>' +
              '<h2>Multiple assignment and swapping</h2>' +
              '<pre><code>a, b = 1, 2\na, b = b, a      # swap both values in one line\nprint(a, b)      # 2 1</code></pre>'
        },
        example: {
          note: { ar: 'غيّر القيم وشاهد كيف تتغيّر المخرجات دون تعديل أسطر الطباعة.',
                  en: 'Change the values and watch the output change without touching the print lines.' },
          code: {
            ar: 'name = "سارة"\nage = 25\ncity = "الرياض"\n\nprint("الاسم:", name)\nprint("العمر:", age)\nprint("المدينة:", city)\n\n# سنة الميلاد تقريباً\nbirth_year = 2026 - age\nprint("سنة الميلاد تقريباً:", birth_year)',
            en: 'name = "Sara"\nage = 25\ncity = "Riyadh"\n\nprint("Name:", name)\nprint("Age:", age)\nprint("City:", city)\n\n# approximate birth year\nbirth_year = 2026 - age\nprint("Born around:", birth_year)'
          }
        },
        challenge: {
          brief: { ar: 'عرّف ثلاثة متغيّرات: product اسم منتج نصاً، price سعره عدداً، quantity الكمية عدداً صحيحاً. ثم احسب متغيّراً رابعاً total يساوي السعر × الكمية، واطبعه.',
                   en: 'Define three variables: product as a text name, price as a number, quantity as a whole number. Then compute a fourth variable total equal to price × quantity, and print it.' },
          starter: { ar: '# عرّف المتغيّرات الأربعة ثم اطبع الإجمالي\nproduct = \nprice = \nquantity = \n',
                     en: '# define the four variables then print the total\nproduct = \nprice = \nquantity = \n' },
          solution: { ar: 'product = "دفتر"\nprice = 12.5\nquantity = 4\ntotal = price * quantity\n\nprint("المنتج:", product)\nprint("الإجمالي:", total)',
                      en: 'product = "notebook"\nprice = 12.5\nquantity = 4\ntotal = price * quantity\n\nprint("Product:", product)\nprint("Total:", total)' },
          checks: [
            { label: { ar: 'المتغيّر product نصّي', en: 'product holds a string' },
              hint:  { ar: 'ضع اسم المنتج بين علامتَي اقتباس', en: 'Put the product name in quotes' },
              test: function (r) { return r.type('product') === 'str'; } },
            { label: { ar: 'price عدد و quantity عدد صحيح', en: 'price is a number and quantity is an integer' },
              hint:  { ar: 'مثال: ‎price = 12.5‎ و ‎quantity = 4‎', en: 'For example: price = 12.5 and quantity = 4' },
              test: function (r) {
                var pt = r.type('price');
                return (pt === 'int' || pt === 'float') && r.type('quantity') === 'int';
              } },
            { label: { ar: 'total يساوي السعر × الكمية', en: 'total equals price × quantity' },
              hint:  { ar: 'اكتب ‎total = price * quantity‎', en: 'Write total = price * quantity' },
              test: function (r) {
                var p = r.val('price'), q = r.val('quantity'), tt = r.val('total');
                return typeof p === 'number' && typeof q === 'number' && near(tt, p * q, 1e-6);
              } },
            { label: { ar: 'طُبع الإجمالي في المخرجات', en: 'The total appears in the output' },
              hint:  { ar: 'أضف ‎print("الإجمالي:", total)‎', en: 'Add print("Total:", total)' },
              test: function (r) {
                var tt = r.val('total');
                if (typeof tt !== 'number') return false;
                var a = String(tt), b = String(Math.round(tt * 100) / 100);
                return r.stdout.indexOf(a) >= 0 || r.stdout.indexOf(b) >= 0;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'أي اسم متغيّر صحيح في بايثون؟', en: 'Which is a valid Python variable name?' },
            options: [ { ar: '2nd_price', en: '2nd_price' }, { ar: 'user name', en: 'user name' },
                       { ar: 'total_price', en: 'total_price' }, { ar: 'class', en: 'class' } ],
            answer: 2,
            why: { ar: 'لا يبدأ برقم، ولا يحوي مسافة، وليس كلمة محجوزة.',
                   en: 'It does not start with a digit, contains no space, and is not a reserved word.' } },
          { q: { ar: 'بعد ‎x = 5‎ ثم ‎x = "خمسة"‎، ما نوع x؟', en: 'After x = 5 then x = "five", what type is x?' },
            options: [ { ar: 'int', en: 'int' }, { ar: 'str', en: 'str' }, { ar: 'خطأ', en: 'An error' }, { ar: 'كلاهما', en: 'Both' } ],
            answer: 1,
            why: { ar: 'الإسناد الأخير ينقل الاسم إلى القيمة الجديدة، فيصبح النوع str.',
                   en: 'The last assignment moves the name onto the new value, so the type becomes str.' } },
          { q: { ar: 'ما العُرف المتّبع لتسمية المتغيّرات في بايثون؟', en: 'What is the Python naming convention for variables?' },
            options: [ { ar: 'userName', en: 'userName' }, { ar: 'UserName', en: 'UserName' },
                       { ar: 'user_name', en: 'user_name' }, { ar: 'USERNAME', en: 'USERNAME' } ],
            answer: 2,
            why: { ar: 'يُعرف بـ snake_case: أحرف صغيرة وكلمات مفصولة بشرطة سفلية.',
                   en: 'It is called snake_case: lowercase words joined by underscores.' } }
        ]
      },

      {
        id: 'input-output',
        minutes: 8, level: 'beginner',
        tags: ['input', 'مدخلات', 'io'],
        title: { ar: 'قراءة المدخلات من المستخدم', en: 'Reading input from the user' },
        lede: { ar: 'البرنامج الذي يطبع فقط جامد. الذي يسأل ويستجيب يصير أداة يستخدمها الناس.',
                en: 'A program that only prints is frozen. One that asks and responds becomes a tool people use.' },
        body: {
          ar: '<h2>الدالة input</h2>' +
              '<p><code>input()</code> توقف البرنامج وتنتظر أن يكتب المستخدم شيئاً ويضغط Enter، ثم تُعيد ما كتبه.</p>' +
              '<pre><code>name = input("ما اسمك؟ ")\nprint("أهلاً", name)</code></pre>' +
              '<div class="callout callout-note"><span class="ic">⌨️</span><div><b>كيف تعمل المدخلات هنا؟</b>لا يوجد «مستخدم» يكتب داخل صفحة الويب، لذلك يظهر لك حقل <b>«مدخلات البرنامج»</b> أسفل المحرّر عندما يحتوي كودك على <code>input(</code>. اكتب فيه سطراً لكل نداء <code>input()</code> قبل التشغيل.</div></div>' +
              '<h2>القاعدة الذهبية: input تُعيد نصاً دائماً</h2>' +
              '<p>حتى لو كتب المستخدم <code>25</code>، فما تحصل عليه هو النص <code>"25"</code> لا العدد. ولهذا:</p>' +
              '<pre><code>age = input("عمرك؟ ")\nprint(age + 1)     # ✗ TypeError — لا يمكن جمع نص وعدد</code></pre>' +
              '<h2>التحويل: int و float</h2>' +
              '<pre><code>age = int(input("عمرك؟ "))       # نص → عدد صحيح\nprice = float(input("السعر؟ "))  # نص → عدد عشري\nprint(age + 1)                   # ✓ يعمل الآن</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>احذر</b><code>int("سلام")</code> يرفع <code>ValueError</code> لأن النص ليس رقماً. سنتعلّم في وحدة لاحقة كيف نتعامل مع هذا بأمان عبر <code>try/except</code>.</div></div>' +
              '<h2>نمط ثلاثي تتكرّر عليه كل البرامج</h2>' +
              '<ol>' +
              '<li><strong>اقرأ</strong> المدخلات — <code>input()</code></li>' +
              '<li><strong>عالِج</strong> البيانات — حساب أو قرار</li>' +
              '<li><strong>اعرض</strong> النتيجة — <code>print()</code></li>' +
              '</ol>' +
              '<p>كل برنامج تكتبه من الآن، مهما كبر، هو تكرار وتوسيع لهذا النمط.</p>',
          en: '<h2>The input function</h2>' +
              '<p><code>input()</code> pauses the program, waits for the user to type something and press Enter, then returns what they typed.</p>' +
              '<pre><code>name = input("What is your name? ")\nprint("Hello", name)</code></pre>' +
              '<div class="callout callout-note"><span class="ic">⌨️</span><div><b>How does input work here?</b>There is no "user" typing inside a web page, so a <b>Program input</b> field appears under the editor whenever your code contains <code>input(</code>. Write one line there for each <code>input()</code> call before you run.</div></div>' +
              '<h2>The golden rule: input always returns a string</h2>' +
              '<p>Even if the user types <code>25</code>, what you get is the text <code>"25"</code>, not the number. Which is why:</p>' +
              '<pre><code>age = input("Your age? ")\nprint(age + 1)     # ✗ TypeError — cannot add text and a number</code></pre>' +
              '<h2>Converting: int and float</h2>' +
              '<pre><code>age = int(input("Your age? "))       # text → whole number\nprice = float(input("Price? "))      # text → decimal number\nprint(age + 1)                       # ✓ works now</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>Careful</b><code>int("hello")</code> raises a <code>ValueError</code> because the text is not a number. In a later module we will handle this safely with <code>try/except</code>.</div></div>' +
              '<h2>The three-step pattern behind every program</h2>' +
              '<ol>' +
              '<li><strong>Read</strong> the input — <code>input()</code></li>' +
              '<li><strong>Process</strong> the data — a calculation or a decision</li>' +
              '<li><strong>Show</strong> the result — <code>print()</code></li>' +
              '</ol>' +
              '<p>Every program you write from now on, however large, is this pattern repeated and expanded.</p>'
        },
        example: {
          note: { ar: 'حقل «مدخلات البرنامج» ظهر أسفل المحرّر. اكتب فيه سطرين: اسماً ثم رقماً، ثم شغّل.',
                  en: 'The "Program input" field appeared under the editor. Type two lines there: a name then a number, then run.' },
          code: {
            ar: 'name = input("ما اسمك؟ ")\nage = int(input("كم عمرك؟ "))\n\nprint("أهلاً", name)\nprint("بعد عشر سنوات ستكون عمرك:", age + 10)',
            en: 'name = input("What is your name? ")\nage = int(input("How old are you? "))\n\nprint("Hello", name)\nprint("In ten years you will be:", age + 10)'
          }
        },
        challenge: {
          brief: { ar: 'اقرأ سطرين: اسم مدينة، ثم درجة حرارة بالمئوية. حوّل الدرجة إلى عدد عشري واطبع ما يعادلها بالفهرنهايت وفق: ف = (م × 9/5) + 32.',
                   en: 'Read two lines: a city name, then a temperature in Celsius. Convert it to a number and print the Fahrenheit equivalent using: F = (C × 9/5) + 32.' },
          starter: { ar: '# اكتب في حقل المدخلات أسفل المحرّر سطرين: مدينة ثم رقم\ncity = \ncelsius = \n',
                     en: '# In the input field below the editor write two lines: a city then a number\ncity = \ncelsius = \n' },
          solution: { ar: 'city = input("المدينة؟ ")\ncelsius = float(input("الحرارة بالمئوية؟ "))\n\nfahrenheit = (celsius * 9 / 5) + 32\nprint("المدينة:", city)\nprint("بالفهرنهايت:", fahrenheit)',
                      en: 'city = input("City? ")\ncelsius = float(input("Temperature in Celsius? "))\n\nfahrenheit = (celsius * 9 / 5) + 32\nprint("City:", city)\nprint("In Fahrenheit:", fahrenheit)' },
          checks: [
            { label: { ar: 'استخدمت input مرّتين', en: 'You used input twice' },
              hint:  { ar: 'نداء لكل قيمة: المدينة ثم الحرارة', en: 'One call per value: the city then the temperature' },
              test: function (r) { return count(r.code, /input\s*\(/g) >= 2; } },
            { label: { ar: 'حوّلت الحرارة إلى عدد بـ float أو int', en: 'You converted the temperature with float or int' },
              hint:  { ar: 'غلّف نداء input بـ ‎float(...)‎', en: 'Wrap the input call in float(...)' },
              test: function (r) { return r.src(/(float|int)\s*\(\s*input\s*\(/); } },
            { label: { ar: 'البرنامج يعمل بلا أخطاء', en: 'The program runs without errors' },
              hint:  { ar: 'تأكّد أن حقل المدخلات فيه سطران: نص ثم رقم', en: 'Make sure the input field holds two lines: text then a number' },
              test: function (r) { return r.ok; } },
            { label: { ar: 'النتيجة بالفهرنهايت صحيحة', en: 'The Fahrenheit result is correct' },
              hint:  { ar: 'استخدم ‎(celsius * 9 / 5) + 32‎', en: 'Use (celsius * 9 / 5) + 32' },
              test: function (r) {
                var c = r.val('celsius');
                if (typeof c !== 'number') return false;
                var f = (c * 9 / 5) + 32;
                if (r.stdout.indexOf(String(f)) >= 0) return true;
                var keys = Object.keys(r.globals);
                for (var i = 0; i < keys.length; i++) {
                  if (near(r.val(keys[i]), f, 1e-6)) return true;
                }
                return false;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'ما نوع القيمة التي تُعيدها input دائماً؟', en: 'What type does input always return?' },
            options: [ { ar: 'int', en: 'int' }, { ar: 'float', en: 'float' }, { ar: 'str', en: 'str' }, { ar: 'حسب ما يكتبه المستخدم', en: 'It depends on what the user typed' } ],
            answer: 2,
            why: { ar: 'input تُعيد نصاً دائماً، ولذلك نحوّله بـ int أو float عند الحاجة لعملية حسابية.',
                   en: 'input always returns a string, which is why we convert it with int or float before doing arithmetic.' } },
          { q: { ar: 'ماذا يحدث في ‎int(input())‎ إن كتب المستخدم «سلام»؟', en: 'What happens in int(input()) if the user types "hello"?' },
            options: [ { ar: 'يُعيد صفراً', en: 'It returns zero' }, { ar: 'يرفع ValueError', en: 'It raises ValueError' },
                       { ar: 'يُعيد النص كما هو', en: 'It returns the text unchanged' }, { ar: 'يتجاهل السطر', en: 'It skips the line' } ],
            answer: 1,
            why: { ar: 'النص غير قابل للتحويل إلى عدد، فترفع بايثون ValueError.',
                   en: 'The text cannot be parsed as a number, so Python raises a ValueError.' } },
          { q: { ar: 'ما النمط الثلاثي الذي تقوم عليه أغلب البرامج؟', en: 'What three-step pattern underlies most programs?' },
            options: [ { ar: 'ابنِ، انشر، احذف', en: 'Build, deploy, delete' },
                       { ar: 'اقرأ، عالِج، اعرض', en: 'Read, process, show' },
                       { ar: 'احفظ، أغلق، افتح', en: 'Save, close, open' },
                       { ar: 'اطبع، اطبع، اطبع', en: 'Print, print, print' } ],
            answer: 1,
            why: { ar: 'كل برنامج تقريباً: يقرأ مدخلاً، يعالجه، ثم يعرض نتيجة.',
                   en: 'Nearly every program reads an input, processes it, then shows a result.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 2 — الأنواع والعمليات / Module 2 — Types & operations
     =========================================================== */
  MODULES.push({
    id: 'types',
    icon: '🔢',
    title: { ar: 'الأنواع: أعداد ونصوص وقيم منطقية', en: 'Types: numbers, text and truth values' },
    desc:  { ar: 'كل قيمة في بايثون لها نوع، والنوع يحدّد ما يمكنك فعله بها. هنا تتقن الأربعة الأساسية.',
             en: 'Every value in Python has a type, and the type decides what you can do with it. Here you master the four essentials.' },
    lessons: [

      {
        id: 'numbers',
        minutes: 9, level: 'beginner',
        tags: ['numbers', 'أعداد', 'math'],
        title: { ar: 'الأعداد والعمليات الحسابية', en: 'Numbers and arithmetic' },
        lede: { ar: 'بايثون آلة حاسبة قوية قبل أن تكون أي شيء آخر. أتقن عوامل الحساب السبعة وستحلّ نصف مشاكلك.',
                en: 'Python is a powerful calculator before it is anything else. Master its seven arithmetic operators and half your problems are solved.' },
        body: {
          ar: '<h2>نوعان للأعداد</h2>' +
              '<ul>' +
              '<li><code>int</code> — عدد صحيح بلا فاصلة: <code>5</code>، <code>-40</code>، <code>1000000</code></li>' +
              '<li><code>float</code> — عدد عشري: <code>3.14</code>، <code>-0.5</code>، <code>2.0</code></li>' +
              '</ul>' +
              '<p>لاحظ أن <code>2</code> و<code>2.0</code> قيمتان متساويتان لكن نوعاهما مختلفان.</p>' +
              '<h2>العوامل السبعة</h2>' +
              '<table><thead><tr><th>العامل</th><th>المعنى</th><th>مثال</th><th>الناتج</th></tr></thead><tbody>' +
              '<tr><td><code>+</code></td><td>جمع</td><td><code>7 + 3</code></td><td>10</td></tr>' +
              '<tr><td><code>-</code></td><td>طرح</td><td><code>7 - 3</code></td><td>4</td></tr>' +
              '<tr><td><code>*</code></td><td>ضرب</td><td><code>7 * 3</code></td><td>21</td></tr>' +
              '<tr><td><code>/</code></td><td>قسمة عشرية</td><td><code>7 / 2</code></td><td>3.5</td></tr>' +
              '<tr><td><code>//</code></td><td>قسمة صحيحة</td><td><code>7 // 2</code></td><td>3</td></tr>' +
              '<tr><td><code>%</code></td><td>باقي القسمة</td><td><code>7 % 2</code></td><td>1</td></tr>' +
              '<tr><td><code>**</code></td><td>أُسّ</td><td><code>2 ** 10</code></td><td>1024</td></tr>' +
              '</tbody></table>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>لماذا % مهم أكثر مما تظن</b>باقي القسمة يجيب على سؤال «هل يقبل القسمة؟». <code>n % 2 == 0</code> تعني أن العدد زوجي. و<code>n % 5 == 0</code> تعني أنه من مضاعفات الخمسة. ستستخدمها كثيراً.</div></div>' +
              '<h2>القسمة دائماً تُنتج float</h2>' +
              '<pre><code>print(10 / 2)    # 5.0 وليس 5\nprint(10 // 2)   # 5</code></pre>' +
              '<h2>ترتيب العمليات</h2>' +
              '<p>نفس ترتيب الرياضيات: الأقواس، ثم الأُسّ، ثم الضرب والقسمة، ثم الجمع والطرح.</p>' +
              '<pre><code>print(2 + 3 * 4)      # 14 وليس 20\nprint((2 + 3) * 4)    # 20</code></pre>' +
              '<h2>الاختصارات</h2>' +
              '<pre><code>total = 10\ntotal += 5    # مثل total = total + 5 → 15\ntotal -= 3    # 12\ntotal *= 2    # 24\ntotal /= 4    # 6.0</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>مفاجأة الأعداد العشرية</b><code>0.1 + 0.2</code> ينتج <code>0.30000000000000004</code> وليس <code>0.3</code>. ليس خطأً في بايثون بل في طريقة تخزين الحواسيب للكسور ثنائياً. لمقارنة عشريّين استخدم <code>round(a - b, 9) == 0</code> بدل <code>a == b</code>.</div></div>',
          en: '<h2>Two number types</h2>' +
              '<ul>' +
              '<li><code>int</code> — a whole number: <code>5</code>, <code>-40</code>, <code>1000000</code></li>' +
              '<li><code>float</code> — a decimal number: <code>3.14</code>, <code>-0.5</code>, <code>2.0</code></li>' +
              '</ul>' +
              '<p>Note that <code>2</code> and <code>2.0</code> are equal in value but different in type.</p>' +
              '<h2>The seven operators</h2>' +
              '<table><thead><tr><th>Operator</th><th>Meaning</th><th>Example</th><th>Result</th></tr></thead><tbody>' +
              '<tr><td><code>+</code></td><td>add</td><td><code>7 + 3</code></td><td>10</td></tr>' +
              '<tr><td><code>-</code></td><td>subtract</td><td><code>7 - 3</code></td><td>4</td></tr>' +
              '<tr><td><code>*</code></td><td>multiply</td><td><code>7 * 3</code></td><td>21</td></tr>' +
              '<tr><td><code>/</code></td><td>true division</td><td><code>7 / 2</code></td><td>3.5</td></tr>' +
              '<tr><td><code>//</code></td><td>floor division</td><td><code>7 // 2</code></td><td>3</td></tr>' +
              '<tr><td><code>%</code></td><td>remainder</td><td><code>7 % 2</code></td><td>1</td></tr>' +
              '<tr><td><code>**</code></td><td>power</td><td><code>2 ** 10</code></td><td>1024</td></tr>' +
              '</tbody></table>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>Why % matters more than you think</b>The remainder answers "does it divide evenly?". <code>n % 2 == 0</code> means the number is even. <code>n % 5 == 0</code> means it is a multiple of five. You will reach for it constantly.</div></div>' +
              '<h2>Division always produces a float</h2>' +
              '<pre><code>print(10 / 2)    # 5.0, not 5\nprint(10 // 2)   # 5</code></pre>' +
              '<h2>Order of operations</h2>' +
              '<p>The same as in mathematics: brackets, then powers, then multiply and divide, then add and subtract.</p>' +
              '<pre><code>print(2 + 3 * 4)      # 14, not 20\nprint((2 + 3) * 4)    # 20</code></pre>' +
              '<h2>Shorthand assignment</h2>' +
              '<pre><code>total = 10\ntotal += 5    # same as total = total + 5 → 15\ntotal -= 3    # 12\ntotal *= 2    # 24\ntotal /= 4    # 6.0</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>The floating-point surprise</b><code>0.1 + 0.2</code> gives <code>0.30000000000000004</code>, not <code>0.3</code>. This is not a Python bug — it is how computers store fractions in binary. To compare two floats use <code>round(a - b, 9) == 0</code> rather than <code>a == b</code>.</div></div>'
        },
        example: {
          note: { ar: 'غيّر الأرقام وشاهد الفرق بين / و // و %.',
                  en: 'Change the numbers and watch the difference between /, // and %.' },
          code: {
            ar: 'items = 17\nper_box = 5\n\nprint("العدد الكلي:", items)\nprint("صناديق ممتلئة:", items // per_box)\nprint("الباقي خارج الصناديق:", items % per_box)\nprint("بالقسمة العشرية:", items / per_box)\n\n# الأُسّ\nprint("2 أُس 10 =", 2 ** 10)\n\n# مفاجأة العشريات\nprint(0.1 + 0.2)',
            en: 'items = 17\nper_box = 5\n\nprint("Total items:", items)\nprint("Full boxes:", items // per_box)\nprint("Left over:", items % per_box)\nprint("True division:", items / per_box)\n\n# powers\nprint("2 to the 10 =", 2 ** 10)\n\n# the float surprise\nprint(0.1 + 0.2)'
          }
        },
        challenge: {
          brief: { ar: 'عرّف seconds = 3725 (عدد ثوانٍ). احسب ثلاثة متغيّرات: hours و minutes و secs بحيث تمثّل نفس المدّة بصيغة ساعات ودقائق وثوانٍ، ثم اطبعها. استخدم // و %.',
                   en: 'Define seconds = 3725. Compute three variables hours, minutes and secs representing the same duration in hours, minutes and seconds, then print them. Use // and %.' },
          starter: { ar: 'seconds = 3725\n\n# احسب hours و minutes و secs باستخدام // و %\n',
                     en: 'seconds = 3725\n\n# compute hours, minutes and secs using // and %\n' },
          solution: { ar: 'seconds = 3725\n\nhours = seconds // 3600\nminutes = (seconds % 3600) // 60\nsecs = seconds % 60\n\nprint("ساعات:", hours)\nprint("دقائق:", minutes)\nprint("ثوانٍ:", secs)',
                      en: 'seconds = 3725\n\nhours = seconds // 3600\nminutes = (seconds % 3600) // 60\nsecs = seconds % 60\n\nprint("Hours:", hours)\nprint("Minutes:", minutes)\nprint("Seconds:", secs)' },
          checks: [
            { label: { ar: 'hours يساوي 1', en: 'hours equals 1' },
              hint:  { ar: 'استخدم ‎seconds // 3600‎', en: 'Use seconds // 3600' },
              test: function (r) { return r.val('hours') === 1; } },
            { label: { ar: 'minutes يساوي 2', en: 'minutes equals 2' },
              hint:  { ar: 'استخدم ‎(seconds % 3600) // 60‎', en: 'Use (seconds % 3600) // 60' },
              test: function (r) { return r.val('minutes') === 2; } },
            { label: { ar: 'secs يساوي 5', en: 'secs equals 5' },
              hint:  { ar: 'استخدم ‎seconds % 60‎', en: 'Use seconds % 60' },
              test: function (r) { return r.val('secs') === 5; } },
            { label: { ar: 'استخدمت العاملين // و % وطبعت النتائج', en: 'You used both // and % and printed the results' },
              hint:  { ar: 'العاملان مطلوبان، ثم اطبع القيم الثلاث', en: 'Both operators are required, then print the three values' },
              test: function (r) {
                return r.src(/\/\//) && r.src(/%/) && r.lines.length >= 3;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'ما ناتج ‎7 // 2‎؟', en: 'What is 7 // 2?' },
            options: [ { ar: '3.5', en: '3.5' }, { ar: '3', en: '3' }, { ar: '4', en: '4' }, { ar: '1', en: '1' } ],
            answer: 1,
            why: { ar: '‎//‎ قسمة صحيحة تُهمل الكسر وتُعيد 3.', en: '// is floor division: it drops the fraction and returns 3.' } },
          { q: { ar: 'ما ناتج ‎10 / 5‎ ونوعه؟', en: 'What is 10 / 5 and its type?' },
            options: [ { ar: '2 من نوع int', en: '2 as an int' }, { ar: '2.0 من نوع float', en: '2.0 as a float' },
                       { ar: '5 من نوع int', en: '5 as an int' }, { ar: 'خطأ', en: 'An error' } ],
            answer: 1,
            why: { ar: 'العامل / يُنتج float دائماً حتى لو كانت القسمة تامّة.',
                   en: 'The / operator always produces a float, even when the division is exact.' } },
          { q: { ar: 'كيف تتحقّق أن العدد n زوجي؟', en: 'How do you check that a number n is even?' },
            options: [ { ar: 'n // 2 == 0', en: 'n // 2 == 0' }, { ar: 'n % 2 == 0', en: 'n % 2 == 0' },
                       { ar: 'n ** 2 == 0', en: 'n ** 2 == 0' }, { ar: 'n / 2 == 0', en: 'n / 2 == 0' } ],
            answer: 1,
            why: { ar: 'باقي قسمة العدد الزوجي على 2 يساوي صفراً.',
                   en: 'An even number leaves a remainder of zero when divided by 2.' } }
        ]
      },

      {
        id: 'strings',
        minutes: 10, level: 'beginner',
        tags: ['strings', 'نصوص', 'str'],
        title: { ar: 'النصوص وعملياتها', en: 'Strings and what you can do with them' },
        lede: { ar: 'أغلب ما تعالجه البرامج نصوص: أسماء، رسائل، ملفات. النص في بايثون سلسلة أحرف لها قوانين واضحة.',
                en: 'Most of what programs handle is text: names, messages, files. A Python string is a sequence of characters with clear rules.' },
        body: {
          ar: '<h2>إنشاء النص</h2>' +
              '<pre><code>a = "بأقواس مزدوجة"\nb = \'بأقواس مفردة\'\nc = """نص متعدّد\nالأسطر"""</code></pre>' +
              '<p>الأقواس الثلاثية مفيدة للنصوص الطويلة ولتوثيق الدوال لاحقاً.</p>' +
              '<h2>الدمج والتكرار</h2>' +
              '<pre><code>first = "سارة"\nlast = "الأحمد"\nprint(first + " " + last)   # سارة الأحمد\nprint("-" * 20)              # عشرون شرطة</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>لا تجمع نصاً مع عدد</b><code>"العمر: " + 25</code> يرفع <code>TypeError</code>. إمّا أن تحوّل العدد بـ <code>str(25)</code>، أو — وهو الأفضل — تستخدم f-string كما في الدرس التالي.</div></div>' +
              '<h2>الفهرسة: كل حرف له رقم</h2>' +
              '<p>الترقيم يبدأ من <strong>صفر</strong>، والأرقام السالبة تعدّ من النهاية:</p>' +
              '<pre><code>word = "Python"\nprint(word[0])    # P\nprint(word[1])    # y\nprint(word[-1])   # n  آخر حرف\nprint(len(word))  # 6</code></pre>' +
              '<h2>التقطيع (slicing)</h2>' +
              '<p>الصيغة <code>[البداية:النهاية]</code> — النهاية غير مشمولة:</p>' +
              '<pre><code>word = "Python"\nprint(word[0:3])   # Pyt\nprint(word[:3])    # Pyt  من البداية\nprint(word[3:])    # hon  حتى النهاية\nprint(word[::-1])  # nohtyP  معكوساً</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>لماذا النهاية غير مشمولة؟</b>لأن <code>word[0:3]</code> تعطي <em>ثلاثة</em> أحرف بالضبط، و<code>word[:i] + word[i:]</code> تعيد النص كاملاً دائماً. هذا الاتساق يوفّر أخطاء كثيرة.</div></div>' +
              '<h2>النصوص غير قابلة للتغيير</h2>' +
              '<pre><code>word = "Python"\nword[0] = "J"     # ✗ TypeError\nword = "J" + word[1:]   # ✓ تصنع نصاً جديداً</code></pre>' +
              '<p>تسمّى هذه الخاصية <em>immutability</em>: أي «تعديل» على نص ينتج نصاً جديداً ولا يغيّر الأصل.</p>' +
              '<h2>محارف الهروب</h2>' +
              '<pre><code>print("سطر\\nسطر ثانٍ")   # \\n سطر جديد\nprint("عمود\\tعمود")      # \\t مسافة جدولة\nprint("قال: \\"أهلاً\\"")   # \\" اقتباس داخل نص</code></pre>',
          en: '<h2>Creating a string</h2>' +
              '<pre><code>a = "with double quotes"\nb = \'with single quotes\'\nc = """spanning\nmultiple lines"""</code></pre>' +
              '<p>Triple quotes are handy for long text and, later, for documenting functions.</p>' +
              '<h2>Joining and repeating</h2>' +
              '<pre><code>first = "Sara"\nlast = "Ahmed"\nprint(first + " " + last)   # Sara Ahmed\nprint("-" * 20)              # twenty dashes</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>Never add a string to a number</b><code>"Age: " + 25</code> raises a <code>TypeError</code>. Either convert with <code>str(25)</code>, or — much better — use an f-string as shown in the next lesson.</div></div>' +
              '<h2>Indexing: every character has a number</h2>' +
              '<p>Counting starts at <strong>zero</strong>, and negative numbers count back from the end:</p>' +
              '<pre><code>word = "Python"\nprint(word[0])    # P\nprint(word[1])    # y\nprint(word[-1])   # n  the last character\nprint(len(word))  # 6</code></pre>' +
              '<h2>Slicing</h2>' +
              '<p>The form is <code>[start:stop]</code> — the stop index is not included:</p>' +
              '<pre><code>word = "Python"\nprint(word[0:3])   # Pyt\nprint(word[:3])    # Pyt  from the start\nprint(word[3:])    # hon  to the end\nprint(word[::-1])  # nohtyP  reversed</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>Why is the stop excluded?</b>Because <code>word[0:3]</code> then gives exactly <em>three</em> characters, and <code>word[:i] + word[i:]</code> always rebuilds the whole string. That consistency prevents a lot of bugs.</div></div>' +
              '<h2>Strings cannot be changed</h2>' +
              '<pre><code>word = "Python"\nword[0] = "J"           # ✗ TypeError\nword = "J" + word[1:]   # ✓ builds a new string</code></pre>' +
              '<p>This property is called <em>immutability</em>: any "edit" to a string produces a new string and leaves the original untouched.</p>' +
              '<h2>Escape characters</h2>' +
              '<pre><code>print("line\\nsecond line")   # \\n newline\nprint("col\\tcol")            # \\t tab\nprint("She said: \\"hi\\"")     # \\" a quote inside a string</code></pre>'
        },
        example: {
          note: { ar: 'جرّب تغيير أرقام التقطيع وشاهد ما تحصل عليه.',
                  en: 'Try changing the slice numbers and see what you get.' },
          code: {
            ar: 'word = "Python"\n\nprint("الطول:", len(word))\nprint("أول حرف:", word[0])\nprint("آخر حرف:", word[-1])\nprint("أول ثلاثة:", word[:3])\nprint("معكوساً:", word[::-1])\n\n# الدمج والتكرار\nprint("=" * 25)\nprint("أهلاً " + word)',
            en: 'word = "Python"\n\nprint("Length:", len(word))\nprint("First char:", word[0])\nprint("Last char:", word[-1])\nprint("First three:", word[:3])\nprint("Reversed:", word[::-1])\n\n# joining and repeating\nprint("=" * 25)\nprint("Hello " + word)'
          }
        },
        challenge: {
          brief: { ar: 'عرّف text = "programming". ثم عرّف: first_four أول أربعة أحرف، last_three آخر ثلاثة، reversed_text النص معكوساً، و length طوله. اطبعها كلها.',
                   en: 'Define text = "programming". Then define: first_four as the first four characters, last_three as the last three, reversed_text as the text reversed, and length as its length. Print them all.' },
          starter: { ar: 'text = "programming"\n\n# عرّف first_four و last_three و reversed_text و length\n',
                     en: 'text = "programming"\n\n# define first_four, last_three, reversed_text and length\n' },
          solution: { ar: 'text = "programming"\n\nfirst_four = text[:4]\nlast_three = text[-3:]\nreversed_text = text[::-1]\nlength = len(text)\n\nprint(first_four)\nprint(last_three)\nprint(reversed_text)\nprint(length)',
                      en: 'text = "programming"\n\nfirst_four = text[:4]\nlast_three = text[-3:]\nreversed_text = text[::-1]\nlength = len(text)\n\nprint(first_four)\nprint(last_three)\nprint(reversed_text)\nprint(length)' },
          checks: [
            { label: { ar: 'first_four يساوي "prog"', en: 'first_four equals "prog"' },
              hint:  { ar: 'استخدم ‎text[:4]‎', en: 'Use text[:4]' },
              test: function (r) { return r.val('first_four') === 'prog'; } },
            { label: { ar: 'last_three يساوي "ing"', en: 'last_three equals "ing"' },
              hint:  { ar: 'استخدم ‎text[-3:]‎', en: 'Use text[-3:]' },
              test: function (r) { return r.val('last_three') === 'ing'; } },
            { label: { ar: 'reversed_text هو النص معكوساً', en: 'reversed_text is the text reversed' },
              hint:  { ar: 'استخدم ‎text[::-1]‎', en: 'Use text[::-1]' },
              test: function (r) { return r.val('reversed_text') === 'gnimmargorp'; } },
            { label: { ar: 'length يساوي 11 وطُبعت القيم', en: 'length equals 11 and the values were printed' },
              hint:  { ar: 'استخدم ‎len(text)‎ ثم اطبع الأربعة', en: 'Use len(text) then print all four' },
              test: function (r) { return r.val('length') === 11 && r.lines.length >= 4; } }
          ]
        },
        quiz: [
          { q: { ar: 'ما ناتج ‎"Python"[1:4]‎؟', en: 'What is "Python"[1:4]?' },
            options: [ { ar: 'Pyt', en: 'Pyt' }, { ar: 'yth', en: 'yth' }, { ar: 'ytho', en: 'ytho' }, { ar: 'tho', en: 'tho' } ],
            answer: 1,
            why: { ar: 'يبدأ من الفهرس 1 ويقف قبل 4، فينتج الأحرف 1 و2 و3 أي "yth".',
                   en: 'It starts at index 1 and stops before 4, giving characters 1, 2 and 3 — "yth".' } },
          { q: { ar: 'لماذا يفشل ‎word[0] = "J"‎؟', en: 'Why does word[0] = "J" fail?' },
            options: [ { ar: 'الفهرسة تبدأ من 1', en: 'Indexing starts at 1' },
                       { ar: 'النصوص غير قابلة للتغيير', en: 'Strings are immutable' },
                       { ar: 'يجب استخدام أقواس مربعة مزدوجة', en: 'You need double square brackets' },
                       { ar: 'لا يفشل', en: 'It does not fail' } ],
            answer: 1,
            why: { ar: 'النص في بايثون غير قابل للتعديل، وأي تغيير يتطلّب بناء نص جديد.',
                   en: 'A Python string cannot be modified in place; any change requires building a new string.' } },
          { q: { ar: 'ما ناتج ‎"ab" * 3‎؟', en: 'What is "ab" * 3?' },
            options: [ { ar: 'ababab', en: 'ababab' }, { ar: 'خطأ', en: 'An error' }, { ar: 'ab3', en: 'ab3' }, { ar: 'a b a b a b', en: 'a b a b a b' } ],
            answer: 0,
            why: { ar: 'ضرب نص في عدد صحيح يكرّره ذلك العدد من المرات.',
                   en: 'Multiplying a string by an integer repeats it that many times.' } }
        ]
      },

      {
        id: 'fstrings',
        minutes: 9, level: 'beginner',
        tags: ['f-string', 'تنسيق', 'format'],
        title: { ar: 'تنسيق النصوص: f-strings ودوال النص', en: 'Formatting text: f-strings and string methods' },
        lede: { ar: 'أفضل طريقة لدمج القيم داخل النص في بايثون الحديثة، ومعها أهم الدوال التي ستستخدمها يومياً.',
                en: 'The best way to weave values into text in modern Python, plus the string methods you will use every day.' },
        body: {
          ar: '<h2>المشكلة التي تحلّها f-strings</h2>' +
              '<pre><code>name = "سارة"\nage = 25\n\n# الطريقة القديمة المتعبة\nprint("اسمي " + name + " وعمري " + str(age))\n\n# f-string — أوضح وأقصر\nprint(f"اسمي {name} وعمري {age}")</code></pre>' +
              '<p>ضع حرف <code>f</code> قبل الاقتباس، ثم اكتب أي تعبير بين <code>{}</code>. لا حاجة لتحويل الأنواع.</p>' +
              '<h2>التعبيرات داخل الأقواس</h2>' +
              '<pre><code>price = 12.5\nqty = 4\nprint(f"الإجمالي: {price * qty}")        # 50.0\nprint(f"بحرف كبير: {name.upper()}")</code></pre>' +
              '<h2>ضبط عدد الخانات العشرية</h2>' +
              '<pre><code>pi = 3.14159265\nprint(f"{pi:.2f}")     # 3.14\nprint(f"{1234567:,}")  # 1,234,567</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>الصيغة ‎:.2f‎</b>النقطتان تبدآن «مواصفة التنسيق»، و<code>.2f</code> تعني «عدد عشري بخانتين». استخدمها دائماً عند عرض الأسعار والنسب.</div></div>' +
              '<h2>أهم دوال النصوص</h2>' +
              '<table><thead><tr><th>الدالة</th><th>ماذا تفعل</th><th>مثال</th></tr></thead><tbody>' +
              '<tr><td><code>.upper()</code></td><td>أحرف كبيرة</td><td><code>"abc".upper()</code> → ABC</td></tr>' +
              '<tr><td><code>.lower()</code></td><td>أحرف صغيرة</td><td><code>"ABC".lower()</code> → abc</td></tr>' +
              '<tr><td><code>.strip()</code></td><td>يحذف المسافات الطرفية</td><td><code>" a ".strip()</code> → a</td></tr>' +
              '<tr><td><code>.replace(a, b)</code></td><td>يستبدل نصاً بآخر</td><td><code>"a-b".replace("-", " ")</code></td></tr>' +
              '<tr><td><code>.split(s)</code></td><td>يقسم إلى قائمة</td><td><code>"a,b".split(",")</code> → ["a","b"]</td></tr>' +
              '<tr><td><code>.startswith(s)</code></td><td>هل يبدأ بـ…</td><td><code>"abc".startswith("a")</code> → True</td></tr>' +
              '<tr><td><code>.count(s)</code></td><td>عدد التكرارات</td><td><code>"aaa".count("a")</code> → 3</td></tr>' +
              '</tbody></table>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>الدوال لا تغيّر الأصل</b><code>name.upper()</code> تُعيد نصاً جديداً ولا تعدّل <code>name</code>. إن أردت الاحتفاظ بالنتيجة أسندها: <code>name = name.upper()</code>.</div></div>' +
              '<h2>‎.strip()‎ صديقك مع المدخلات</h2>' +
              '<p>المستخدم يضغط مسافة زائدة كثيراً. اجعل <code>input().strip()</code> عادة.</p>',
          en: '<h2>The problem f-strings solve</h2>' +
              '<pre><code>name = "Sara"\nage = 25\n\n# the tiring old way\nprint("My name is " + name + " and I am " + str(age))\n\n# f-string — clearer and shorter\nprint(f"My name is {name} and I am {age}")</code></pre>' +
              '<p>Put an <code>f</code> before the quote, then write any expression inside <code>{}</code>. No type conversion needed.</p>' +
              '<h2>Expressions inside the braces</h2>' +
              '<pre><code>price = 12.5\nqty = 4\nprint(f"Total: {price * qty}")        # 50.0\nprint(f"Shouting: {name.upper()}")</code></pre>' +
              '<h2>Controlling decimal places</h2>' +
              '<pre><code>pi = 3.14159265\nprint(f"{pi:.2f}")     # 3.14\nprint(f"{1234567:,}")  # 1,234,567</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>The <code>:.2f</code> form</b>The colon starts a "format spec", and <code>.2f</code> means "a float with two decimals". Reach for it whenever you display prices or percentages.</div></div>' +
              '<h2>The string methods that matter most</h2>' +
              '<table><thead><tr><th>Method</th><th>What it does</th><th>Example</th></tr></thead><tbody>' +
              '<tr><td><code>.upper()</code></td><td>uppercase</td><td><code>"abc".upper()</code> → ABC</td></tr>' +
              '<tr><td><code>.lower()</code></td><td>lowercase</td><td><code>"ABC".lower()</code> → abc</td></tr>' +
              '<tr><td><code>.strip()</code></td><td>removes surrounding spaces</td><td><code>" a ".strip()</code> → a</td></tr>' +
              '<tr><td><code>.replace(a, b)</code></td><td>swaps one text for another</td><td><code>"a-b".replace("-", " ")</code></td></tr>' +
              '<tr><td><code>.split(s)</code></td><td>splits into a list</td><td><code>"a,b".split(",")</code> → ["a","b"]</td></tr>' +
              '<tr><td><code>.startswith(s)</code></td><td>does it begin with…</td><td><code>"abc".startswith("a")</code> → True</td></tr>' +
              '<tr><td><code>.count(s)</code></td><td>how many occurrences</td><td><code>"aaa".count("a")</code> → 3</td></tr>' +
              '</tbody></table>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>Methods never change the original</b><code>name.upper()</code> returns a new string and leaves <code>name</code> alone. To keep the result, assign it: <code>name = name.upper()</code>.</div></div>' +
              '<h2><code>.strip()</code> is your friend with input</h2>' +
              '<p>Users add stray spaces constantly. Make <code>input().strip()</code> a habit.</p>'
        },
        example: {
          note: { ar: 'لاحظ الفرق بين الطباعة بالدمج والطباعة بـ f-string.',
                  en: 'Notice the difference between concatenation and an f-string.' },
          code: {
            ar: 'name = "  سارة  "\nprice = 12.5\nqty = 4\n\nclean = name.strip()\ntotal = price * qty\n\nprint(f"الاسم: [{clean}]")\nprint(f"الاسم بحروف كبيرة: {clean.upper()}")\nprint(f"الإجمالي: {total:.2f} ريال")\nprint(f"عدد الأحرف: {len(clean)}")',
            en: 'name = "  Sara  "\nprice = 12.5\nqty = 4\n\nclean = name.strip()\ntotal = price * qty\n\nprint(f"Name: [{clean}]")\nprint(f"Uppercase: {clean.upper()}")\nprint(f"Total: {total:.2f} SAR")\nprint(f"Characters: {len(clean)}")'
          }
        },
        challenge: {
          brief: { ar: 'عرّف raw = "  ahmad ali  ". نظّفه في متغيّر clean، واصنع متغيّراً shout يحوّله لأحرف كبيرة، ثم اطبع سطراً واحداً بـ f-string يقول: الاسم هو <الاسم النظيف> وطوله <عدد الأحرف> حرفاً.',
                   en: 'Define raw = "  ahmad ali  ". Clean it into clean, make shout the uppercase version, then print one f-string line saying: the name is <clean name> and it is <length> characters long.' },
          starter: { ar: 'raw = "  ahmad ali  "\n\n# عرّف clean و shout ثم اطبع سطراً واحداً بـ f-string\n',
                     en: 'raw = "  ahmad ali  "\n\n# define clean and shout then print one f-string line\n' },
          solution: { ar: 'raw = "  ahmad ali  "\n\nclean = raw.strip()\nshout = clean.upper()\n\nprint(f"الاسم هو {clean} وطوله {len(clean)} حرفاً")\nprint(shout)',
                      en: 'raw = "  ahmad ali  "\n\nclean = raw.strip()\nshout = clean.upper()\n\nprint(f"the name is {clean} and it is {len(clean)} characters long")\nprint(shout)' },
          checks: [
            { label: { ar: 'clean بلا مسافات طرفية', en: 'clean has no surrounding spaces' },
              hint:  { ar: 'استخدم ‎raw.strip()‎', en: 'Use raw.strip()' },
              test: function (r) { return r.val('clean') === 'ahmad ali'; } },
            { label: { ar: 'shout بأحرف كبيرة', en: 'shout is uppercase' },
              hint:  { ar: 'استخدم ‎clean.upper()‎', en: 'Use clean.upper()' },
              test: function (r) { return r.val('shout') === 'AHMAD ALI'; } },
            { label: { ar: 'استخدمت f-string فعلياً', en: 'You actually used an f-string' },
              hint:  { ar: 'اكتب ‎f"…{clean}…"‎', en: 'Write f"…{clean}…"' },
              test: function (r) { return r.src(/f["']/) && r.src(/\{/); } },
            { label: { ar: 'المخرجات فيها الاسم النظيف والعدد 9', en: 'The output contains the clean name and the number 9' },
              hint:  { ar: 'أدرج ‎{len(clean)}‎ داخل النص', en: 'Insert {len(clean)} inside the text' },
              test: function (r) { return r.prints('ahmad ali') && r.stdout.indexOf('9') >= 0; } }
          ]
        },
        quiz: [
          { q: { ar: 'ما ناتج ‎f"{2 + 3}"‎؟', en: 'What does f"{2 + 3}" produce?' },
            options: [ { ar: '2 + 3', en: '2 + 3' }, { ar: '5', en: '5' }, { ar: '{5}', en: '{5}' }, { ar: 'خطأ', en: 'An error' } ],
            answer: 1,
            why: { ar: 'ما بين الأقواس المعقوفة تعبير يُحسب أولاً ثم يُدرج ناتجه في النص.',
                   en: 'Whatever sits inside the braces is evaluated first, and its result is inserted into the text.' } },
          { q: { ar: 'ماذا تفعل ‎"  hi  ".strip()‎؟', en: 'What does "  hi  ".strip() do?' },
            options: [ { ar: 'تحذف كل المسافات', en: 'Removes every space' },
                       { ar: 'تحذف المسافات من الطرفين فقط', en: 'Removes spaces from both ends only' },
                       { ar: 'تحوّل لأحرف كبيرة', en: 'Converts to uppercase' },
                       { ar: 'تقسم النص', en: 'Splits the string' } ],
            answer: 1,
            why: { ar: 'strip تحذف المسافات البادئة واللاحقة ولا تمسّ المسافات الداخلية.',
                   en: 'strip removes leading and trailing whitespace and leaves inner spaces untouched.' } },
          { q: { ar: 'بعد ‎name = "ali"‎ ثم ‎name.upper()‎ فقط، ما قيمة name؟', en: 'After name = "ali" then just name.upper(), what is name?' },
            options: [ { ar: 'ALI', en: 'ALI' }, { ar: 'ali', en: 'ali' }, { ar: 'None', en: 'None' }, { ar: 'خطأ', en: 'An error' } ],
            answer: 1,
            why: { ar: 'الدالة تُعيد نصاً جديداً ولا تعدّل الأصل، ولم نُسند الناتج لشيء.',
                   en: 'The method returns a new string without modifying the original, and we never assigned the result.' } }
        ]
      },

      {
        id: 'type-conversion',
        minutes: 8, level: 'beginner',
        tags: ['bool', 'None', 'types', 'أنواع'],
        title: { ar: 'القيم المنطقية و None والتحويل بين الأنواع', en: 'Booleans, None, and converting between types' },
        lede: { ar: 'نوعان صغيران يقودان كل قرار في برامجك، وقواعد التحويل التي تمنع نصف أخطاء المبتدئين.',
                en: 'Two small types that drive every decision in your programs, plus the conversion rules that prevent half of all beginner errors.' },
        body: {
          ar: '<h2>النوع bool: صح أو خطأ</h2>' +
              '<p>قيمتان فقط: <code>True</code> و<code>False</code> — بحرف أول كبير دائماً.</p>' +
              '<pre><code>is_student = True\nhas_paid = False\nprint(type(is_student))   # &lt;class \'bool\'&gt;</code></pre>' +
              '<h2>القيم «الكاذبة»</h2>' +
              '<p>بايثون تعتبر هذه القيم بحكم <code>False</code> عند اختبارها:</p>' +
              '<ul>' +
              '<li><code>0</code> و<code>0.0</code></li>' +
              '<li>النص الفارغ <code>""</code></li>' +
              '<li>القائمة الفارغة <code>[]</code> والقاموس الفارغ <code>{}</code></li>' +
              '<li><code>None</code></li>' +
              '</ul>' +
              '<p>وكل ما عداها بحكم <code>True</code>. جرّب: <code>bool("")</code> و<code>bool("a")</code>.</p>' +
              '<h2>القيمة None</h2>' +
              '<p><code>None</code> تعني «لا قيمة بعد». تختلف عن الصفر وعن النص الفارغ: الصفر <em>قيمة</em>، و<code>None</code> <em>غياب</em> قيمة.</p>' +
              '<pre><code>answer = None\nprint(answer is None)   # True</code></pre>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>استخدم <code>is</code> مع None</b>اكتب <code>x is None</code> لا <code>x == None</code>. الأولى أسرع وأدقّ وهي العُرف المتّبع.</div></div>' +
              '<h2>دوال التحويل</h2>' +
              '<pre><code>int("25")      # 25\nint(3.9)       # 3  يقطع الكسر ولا يقرّب\nfloat("3.5")   # 3.5\nstr(25)        # "25"\nbool(0)        # False</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b><code>int()</code> تقطع ولا تقرّب</b><code>int(3.9)</code> تعطي <code>3</code> لا <code>4</code>. للتقريب الصحيح استخدم <code>round(3.9)</code> التي تعطي <code>4</code>.</div></div>' +
              '<h2>معرفة النوع</h2>' +
              '<pre><code>print(type(5))          # int\nprint(type("5"))        # str\nprint(isinstance(5, int))   # True</code></pre>' +
              '<p>عند مطاردة خطأ غامض، اطبع <code>type(x)</code> — غالباً ستجد أن قيمتك نصّ وأنت تظنها عدداً.</p>',
          en: '<h2>The bool type: true or false</h2>' +
              '<p>Only two values: <code>True</code> and <code>False</code> — always capitalised.</p>' +
              '<pre><code>is_student = True\nhas_paid = False\nprint(type(is_student))   # &lt;class \'bool\'&gt;</code></pre>' +
              '<h2>"Falsy" values</h2>' +
              '<p>Python treats these as <code>False</code> when tested:</p>' +
              '<ul>' +
              '<li><code>0</code> and <code>0.0</code></li>' +
              '<li>the empty string <code>""</code></li>' +
              '<li>the empty list <code>[]</code> and empty dict <code>{}</code></li>' +
              '<li><code>None</code></li>' +
              '</ul>' +
              '<p>Everything else is treated as <code>True</code>. Try it: <code>bool("")</code> versus <code>bool("a")</code>.</p>' +
              '<h2>The value None</h2>' +
              '<p><code>None</code> means "no value yet". It differs from zero and from the empty string: zero is <em>a value</em>, <code>None</code> is the <em>absence</em> of one.</p>' +
              '<pre><code>answer = None\nprint(answer is None)   # True</code></pre>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>Use <code>is</code> with None</b>Write <code>x is None</code>, not <code>x == None</code>. The first is faster, more precise, and the accepted convention.</div></div>' +
              '<h2>Conversion functions</h2>' +
              '<pre><code>int("25")      # 25\nint(3.9)       # 3  truncates, does not round\nfloat("3.5")   # 3.5\nstr(25)        # "25"\nbool(0)        # False</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b><code>int()</code> truncates, it does not round</b><code>int(3.9)</code> gives <code>3</code>, not <code>4</code>. For proper rounding use <code>round(3.9)</code>, which gives <code>4</code>.</div></div>' +
              '<h2>Inspecting a type</h2>' +
              '<pre><code>print(type(5))              # int\nprint(type("5"))            # str\nprint(isinstance(5, int))   # True</code></pre>' +
              '<p>When hunting a confusing bug, print <code>type(x)</code> — more often than not you will find a string where you expected a number.</p>'
        },
        example: {
          note: { ar: 'لاحظ الفرق بين int و round، وبين None والصفر.',
                  en: 'Notice the difference between int and round, and between None and zero.' },
          code: {
            ar: 'print(int("25") + 5)      # 30\nprint(int(3.9))           # 3 — قطع\nprint(round(3.9))         # 4 — تقريب\n\nprint(bool(0), bool(""), bool("a"))\n\nscore = None\nprint("لا نتيجة بعد" if score is None else score)\n\nprint(type(5), type("5"))',
            en: 'print(int("25") + 5)      # 30\nprint(int(3.9))           # 3 — truncated\nprint(round(3.9))         # 4 — rounded\n\nprint(bool(0), bool(""), bool("a"))\n\nscore = None\nprint("no score yet" if score is None else score)\n\nprint(type(5), type("5"))'
          }
        },
        challenge: {
          brief: { ar: 'عرّف raw_price = "49.99" و raw_qty = "3" كنصّين. حوّلهما إلى price عدداً عشرياً و qty عدداً صحيحاً، احسب total، ثم عرّف is_expensive قيمة منطقية تكون True إن تجاوز الإجمالي 100. اطبع الإجمالي بخانتين عشريتين.',
                   en: 'Define raw_price = "49.99" and raw_qty = "3" as strings. Convert them to price (float) and qty (int), compute total, then define is_expensive as a boolean that is True when the total exceeds 100. Print the total with two decimals.' },
          starter: { ar: 'raw_price = "49.99"\nraw_qty = "3"\n\n# حوّل ثم احسب total ثم عرّف is_expensive\n',
                     en: 'raw_price = "49.99"\nraw_qty = "3"\n\n# convert, compute total, then define is_expensive\n' },
          solution: { ar: 'raw_price = "49.99"\nraw_qty = "3"\n\nprice = float(raw_price)\nqty = int(raw_qty)\ntotal = price * qty\nis_expensive = total > 100\n\nprint(f"الإجمالي: {total:.2f}")\nprint("غالٍ؟", is_expensive)',
                      en: 'raw_price = "49.99"\nraw_qty = "3"\n\nprice = float(raw_price)\nqty = int(raw_qty)\ntotal = price * qty\nis_expensive = total > 100\n\nprint(f"Total: {total:.2f}")\nprint("Expensive?", is_expensive)' },
          checks: [
            { label: { ar: 'price عدد عشري و qty عدد صحيح', en: 'price is a float and qty is an int' },
              hint:  { ar: 'استخدم ‎float(raw_price)‎ و ‎int(raw_qty)‎', en: 'Use float(raw_price) and int(raw_qty)' },
              test: function (r) { return r.type('price') === 'float' && r.type('qty') === 'int'; } },
            { label: { ar: 'total يساوي 149.97', en: 'total equals 149.97' },
              hint:  { ar: 'اضرب السعر في الكمية', en: 'Multiply the price by the quantity' },
              test: function (r) { return near(r.val('total'), 149.97, 1e-6); } },
            { label: { ar: 'is_expensive قيمة منطقية True', en: 'is_expensive is the boolean True' },
              hint:  { ar: 'اكتب ‎is_expensive = total > 100‎', en: 'Write is_expensive = total > 100' },
              test: function (r) { return r.type('is_expensive') === 'bool' && r.val('is_expensive') === true; } },
            { label: { ar: 'طُبع الإجمالي بخانتين عشريتين: 149.97', en: 'The total was printed with two decimals: 149.97' },
              hint:  { ar: 'استخدم ‎f"{total:.2f}"‎', en: 'Use f"{total:.2f}"' },
              test: function (r) { return r.stdout.indexOf('149.97') >= 0; } }
          ]
        },
        quiz: [
          { q: { ar: 'ما ناتج ‎int(3.9)‎؟', en: 'What is int(3.9)?' },
            options: [ { ar: '4', en: '4' }, { ar: '3', en: '3' }, { ar: '3.9', en: '3.9' }, { ar: 'خطأ', en: 'An error' } ],
            answer: 1,
            why: { ar: 'int تقطع الجزء العشري ولا تقرّب؛ للتقريب استخدم round.',
                   en: 'int truncates the decimal part rather than rounding; use round for rounding.' } },
          { q: { ar: 'أي القيم التالية تُعتبر False؟', en: 'Which of these is treated as False?' },
            options: [ { ar: '"0"', en: '"0"' }, { ar: '[]', en: '[]' }, { ar: '-1', en: '-1' }, { ar: '" "', en: '" "' } ],
            answer: 1,
            why: { ar: 'القائمة الفارغة قيمة كاذبة، أما النص "0" والمسافة فغير فارغين فيُعتبران True.',
                   en: 'An empty list is falsy, while the string "0" and a space are non-empty and therefore truthy.' } },
          { q: { ar: 'ما الطريقة الموصى بها لاختبار None؟', en: 'What is the recommended way to test for None?' },
            options: [ { ar: 'x == None', en: 'x == None' }, { ar: 'x is None', en: 'x is None' },
                       { ar: 'x = None', en: 'x = None' }, { ar: 'bool(x)', en: 'bool(x)' } ],
            answer: 1,
            why: { ar: 'is تقارن الهوية وهي الأسلوب المعتمد في بايثون لاختبار None.',
                   en: 'is compares identity and is the accepted Python idiom for testing None.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 3 — القرارات والتكرار / Module 3 — Decisions & loops
     =========================================================== */
  MODULES.push({
    id: 'control',
    icon: '🔀',
    title: { ar: 'القرارات والتكرار: حيث تبدأ البرمجة فعلاً', en: 'Decisions and loops: where programming really begins' },
    desc:  { ar: 'أن يختار برنامجك مساراً، وأن يكرّر عملاً آلاف المرات بلا ملل — هذه هي القوة الحقيقية.',
             en: 'Letting your program choose a path, and repeat work thousands of times without tiring — this is the real power.' },
    lessons: [

      {
        id: 'if-else',
        minutes: 10, level: 'beginner',
        tags: ['if', 'شرط', 'condition'],
        title: { ar: 'الشروط: if و elif و else', en: 'Conditions: if, elif and else' },
        lede: { ar: 'أول مرة يتّخذ فيها برنامجك قراراً بنفسه. ومعها تتعلّم أهم قاعدة في بايثون: الإزاحة.',
                en: 'The first time your program makes a decision on its own — and where you learn Python\'s single most important rule: indentation.' },
        body: {
          ar: '<h2>الشكل الأساسي</h2>' +
              '<pre><code>age = 20\n\nif age >= 18:\n    print("بالغ")\nelse:\n    print("قاصر")</code></pre>' +
              '<p>لاحظ ثلاثة أشياء: النقطتان <code>:</code> في نهاية السطر، والإزاحة بأربع مسافات، وغياب الأقواس المعقوفة.</p>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>الإزاحة ليست تجميلاً — إنها اللغة نفسها</b>في معظم اللغات تحدّد الأقواس <code>{}</code> ما ينتمي للشرط. في بايثون <em>المسافات</em> هي التي تحدّد ذلك. إزاحة خاطئة تعني منطقاً خاطئاً أو خطأ <code>IndentationError</code>. استخدم أربع مسافات دائماً، ولا تخلط بينها وبين Tab.</div></div>' +
              '<h2>ثلاثة مسارات أو أكثر: elif</h2>' +
              '<pre><code>score = 85\n\nif score >= 90:\n    grade = "ممتاز"\nelif score >= 80:\n    grade = "جيد جداً"\nelif score >= 70:\n    grade = "جيد"\nelse:\n    grade = "يحتاج تحسيناً"\n\nprint(grade)</code></pre>' +
              '<h2>الترتيب يهمّ</h2>' +
              '<p>بايثون تفحص الشروط من الأعلى للأسفل وتتوقّف عند أول شرط صحيح. لو بدأت بـ <code>score >= 70</code> لحصل صاحب الـ 95 على «جيد» — لأن شرطه تحقّق أولاً. رتّب من الأضيق إلى الأوسع.</p>' +
              '<h2>الشروط المتداخلة</h2>' +
              '<pre><code>if is_member:\n    if total > 100:\n        print("خصم 20%")\n    else:\n        print("خصم 10%")\nelse:\n    print("لا خصم")</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>قلّل التداخل</b>كلّما زادت مستويات التداخل صعُبت القراءة. غالباً يمكنك دمج الشروط بـ <code>and</code> — وهذا موضوع الدرس التالي.</div></div>' +
              '<h2>الشرط في سطر واحد</h2>' +
              '<pre><code>status = "بالغ" if age >= 18 else "قاصر"</code></pre>' +
              '<p>يسمّى <em>التعبير الشرطي</em>. مفيد للحالات القصيرة فقط؛ لا تحشر فيه منطقاً معقّداً.</p>',
          en: '<h2>The basic shape</h2>' +
              '<pre><code>age = 20\n\nif age >= 18:\n    print("adult")\nelse:\n    print("minor")</code></pre>' +
              '<p>Notice three things: the colon <code>:</code> ending the line, the four-space indent, and the complete absence of curly braces.</p>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>Indentation is not decoration — it is the language</b>In most languages <code>{}</code> decides what belongs to the condition. In Python the <em>whitespace</em> decides. A wrong indent means wrong logic, or an <code>IndentationError</code>. Always use four spaces, and never mix them with tabs.</div></div>' +
              '<h2>Three paths or more: elif</h2>' +
              '<pre><code>score = 85\n\nif score >= 90:\n    grade = "excellent"\nelif score >= 80:\n    grade = "very good"\nelif score >= 70:\n    grade = "good"\nelse:\n    grade = "needs work"\n\nprint(grade)</code></pre>' +
              '<h2>Order matters</h2>' +
              '<p>Python checks conditions top to bottom and stops at the first true one. If you started with <code>score >= 70</code>, someone scoring 95 would get "good" — because their condition matched first. Order from narrowest to widest.</p>' +
              '<h2>Nested conditions</h2>' +
              '<pre><code>if is_member:\n    if total > 100:\n        print("20% off")\n    else:\n        print("10% off")\nelse:\n    print("no discount")</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>Keep nesting shallow</b>Every extra level of nesting costs readability. You can usually merge conditions with <code>and</code> — which is exactly the next lesson.</div></div>' +
              '<h2>A condition on one line</h2>' +
              '<pre><code>status = "adult" if age >= 18 else "minor"</code></pre>' +
              '<p>This is a <em>conditional expression</em>. Use it for short cases only; never cram complex logic into it.</p>'
        },
        example: {
          note: { ar: 'غيّر قيمة score وشغّل مرة أخرى لترى المسار يتغيّر.',
                  en: 'Change the score value and run again to watch the path change.' },
          code: {
            ar: 'score = 85\n\nif score >= 90:\n    grade = "ممتاز"\nelif score >= 80:\n    grade = "جيد جداً"\nelif score >= 70:\n    grade = "جيد"\nelse:\n    grade = "يحتاج تحسيناً"\n\nprint(f"الدرجة {score} → {grade}")\n\n# شرط في سطر واحد\nstatus = "ناجح" if score >= 60 else "راسب"\nprint(status)',
            en: 'score = 85\n\nif score >= 90:\n    grade = "excellent"\nelif score >= 80:\n    grade = "very good"\nelif score >= 70:\n    grade = "good"\nelse:\n    grade = "needs work"\n\nprint(f"Score {score} → {grade}")\n\n# one-line condition\nstatus = "pass" if score >= 60 else "fail"\nprint(status)'
          }
        },
        challenge: {
          brief: { ar: 'عرّف temp = 34. اكتب سلسلة شروط تُسند إلى متغيّر advice: إن كانت الحرارة 35 فأكثر «ابقَ في الداخل»، وإن كانت 25 فأكثر «الجو حارّ»، وإن كانت 15 فأكثر «الجو معتدل»، وغير ذلك «الجو بارد». اطبع advice.',
                   en: 'Define temp = 34. Write a chain of conditions assigning to advice: 35 or above "stay indoors", 25 or above "it is hot", 15 or above "it is mild", otherwise "it is cold". Print advice.' },
          starter: { ar: 'temp = 34\n\n# اكتب if / elif / else يُسند القيمة إلى advice\n',
                     en: 'temp = 34\n\n# write if / elif / else assigning to advice\n' },
          solution: { ar: 'temp = 34\n\nif temp >= 35:\n    advice = "ابقَ في الداخل"\nelif temp >= 25:\n    advice = "الجو حارّ"\nelif temp >= 15:\n    advice = "الجو معتدل"\nelse:\n    advice = "الجو بارد"\n\nprint(advice)',
                      en: 'temp = 34\n\nif temp >= 35:\n    advice = "stay indoors"\nelif temp >= 25:\n    advice = "it is hot"\nelif temp >= 15:\n    advice = "it is mild"\nelse:\n    advice = "it is cold"\n\nprint(advice)' },
          checks: [
            { label: { ar: 'استخدمت elif مرّتين على الأقل', en: 'You used elif at least twice' },
              hint:  { ar: 'أربعة مسارات تحتاج if و elif و elif و else', en: 'Four paths need if, elif, elif and else' },
              test: function (r) { return count(r.code, /\belif\b/g) >= 2; } },
            { label: { ar: 'يوجد else يغطّي بقية الحالات', en: 'There is an else covering the remaining cases' },
              hint:  { ar: 'أضف ‎else:‎ في النهاية', en: 'Add an else: at the end' },
              test: function (r) { return r.src(/\belse\s*:/); } },
            { label: { ar: 'advice يساوي القيمة الصحيحة عند 34', en: 'advice holds the right value for 34' },
              hint:  { ar: 'الحرارة 34 تقع في نطاق «الجو حارّ»', en: '34 falls in the "it is hot" band' },
              test: function (r) {
                var v = r.val('advice');
                return typeof v === 'string' && v.length > 0 &&
                       (/حار/.test(v) || /hot/i.test(v));
              } },
            { label: { ar: 'طُبعت قيمة advice', en: 'advice was printed' },
              hint:  { ar: 'أضف ‎print(advice)‎', en: 'Add print(advice)' },
              test: function (r) {
                var v = r.val('advice');
                return typeof v === 'string' && r.stdout.indexOf(v) >= 0;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'ما الذي يحدّد ما ينتمي لكتلة if في بايثون؟', en: 'What decides which lines belong to an if block in Python?' },
            options: [ { ar: 'الأقواس المعقوفة {}', en: 'Curly braces {}' }, { ar: 'الإزاحة بالمسافات', en: 'Indentation' },
                       { ar: 'الفاصلة المنقوطة', en: 'The semicolon' }, { ar: 'كلمة end', en: 'The end keyword' } ],
            answer: 1,
            why: { ar: 'بايثون تستخدم المسافات البادئة لتحديد الكتل، وهذا جزء أصيل من قواعد اللغة.',
                   en: 'Python uses leading whitespace to delimit blocks; it is part of the grammar itself.' } },
          { q: { ar: 'كم شرطاً ينفَّذ في سلسلة if/elif/else واحدة؟', en: 'How many branches run in one if/elif/else chain?' },
            options: [ { ar: 'كل الشروط الصحيحة', en: 'Every true branch' }, { ar: 'واحد فقط: أول شرط صحيح', en: 'Exactly one: the first true branch' },
                       { ar: 'الأخير دائماً', en: 'Always the last one' }, { ar: 'لا شيء', en: 'None' } ],
            answer: 1,
            why: { ar: 'تتوقّف بايثون عند أول شرط صحيح وتتجاهل بقية السلسلة.',
                   en: 'Python stops at the first true condition and skips the rest of the chain.' } },
          { q: { ar: 'ما الخطأ في ترتيب ‎if x >= 70 … elif x >= 90‎؟', en: 'What is wrong with ordering if x >= 70 … elif x >= 90?' },
            options: [ { ar: 'لا خطأ', en: 'Nothing' },
                       { ar: 'الشرط الثاني لن يتحقّق أبداً', en: 'The second branch can never run' },
                       { ar: 'elif يجب أن يسبق if', en: 'elif must come before if' },
                       { ar: 'يجب استخدام else فقط', en: 'You must use only else' } ],
            answer: 1,
            why: { ar: 'كل قيمة أكبر من 90 تحقّق الشرط الأول أيضاً، فتتوقّف السلسلة قبل الوصول للثاني.',
                   en: 'Any value above 90 also satisfies the first condition, so the chain stops before reaching the second.' } }
        ]
      },

      {
        id: 'comparisons',
        minutes: 8, level: 'beginner',
        tags: ['and', 'or', 'not', 'مقارنات'],
        title: { ar: 'المقارنات والعوامل المنطقية', en: 'Comparisons and logical operators' },
        lede: { ar: 'كل شرط يُبنى من مقارنة أو أكثر. وثلاث كلمات — and و or و not — تكفي لبناء أي منطق تحتاجه.',
                en: 'Every condition is built from comparisons. And three words — and, or, not — are enough to express any logic you need.' },
        body: {
          ar: '<h2>عوامل المقارنة الستة</h2>' +
              '<table><thead><tr><th>العامل</th><th>المعنى</th><th>مثال يعطي True</th></tr></thead><tbody>' +
              '<tr><td><code>==</code></td><td>يساوي</td><td><code>5 == 5</code></td></tr>' +
              '<tr><td><code>!=</code></td><td>لا يساوي</td><td><code>5 != 3</code></td></tr>' +
              '<tr><td><code>&gt;</code></td><td>أكبر من</td><td><code>5 &gt; 3</code></td></tr>' +
              '<tr><td><code>&lt;</code></td><td>أصغر من</td><td><code>3 &lt; 5</code></td></tr>' +
              '<tr><td><code>&gt;=</code></td><td>أكبر أو يساوي</td><td><code>5 &gt;= 5</code></td></tr>' +
              '<tr><td><code>&lt;=</code></td><td>أصغر أو يساوي</td><td><code>3 &lt;= 5</code></td></tr>' +
              '</tbody></table>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>‎=‎ ليست ‎==‎</b>علامة واحدة <code>=</code> تُسند قيمة، وعلامتان <code>==</code> تقارنان. كتابة <code>if x = 5:</code> خطأ نحوي. هذا أشهر خطأ مطبعي في البرمجة كلها.</div></div>' +
              '<h2>الربط: and و or و not</h2>' +
              '<pre><code>age = 25\nhas_id = True\n\nif age >= 18 and has_id:\n    print("مسموح")\n\nif age &lt; 12 or age &gt; 65:\n    print("تذكرة مخفّضة")\n\nif not has_id:\n    print("أحضر هويتك")</code></pre>' +
              '<ul>' +
              '<li><code>and</code> — يجب أن يتحقّق <strong>الطرفان</strong>.</li>' +
              '<li><code>or</code> — يكفي تحقّق <strong>طرف واحد</strong>.</li>' +
              '<li><code>not</code> — يقلب القيمة.</li>' +
              '</ul>' +
              '<h2>سلسلة المقارنات</h2>' +
              '<p>بايثون تسمح بما لا تسمح به أغلب اللغات:</p>' +
              '<pre><code>if 18 &lt;= age &lt;= 65:\n    print("في سنّ العمل")</code></pre>' +
              '<p>أوضح من <code>age >= 18 and age <= 65</code> وأقصر.</p>' +
              '<h2>عامل الاحتواء: in</h2>' +
              '<pre><code>print("y" in "Python")          # True\nprint("cat" in ["dog", "cat"])  # True\nprint("z" not in "Python")      # True</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>التقييم الكسول</b>في <code>a and b</code> إن كان <code>a</code> خاطئاً فلن تُقيّم بايثون <code>b</code> أصلاً. يفيدك هذا لحماية نفسك: <code>if name and name[0] == "أ"</code> لن ينهار حين يكون الاسم فارغاً.</div></div>',
          en: '<h2>The six comparison operators</h2>' +
              '<table><thead><tr><th>Operator</th><th>Meaning</th><th>A True example</th></tr></thead><tbody>' +
              '<tr><td><code>==</code></td><td>equals</td><td><code>5 == 5</code></td></tr>' +
              '<tr><td><code>!=</code></td><td>does not equal</td><td><code>5 != 3</code></td></tr>' +
              '<tr><td><code>&gt;</code></td><td>greater than</td><td><code>5 &gt; 3</code></td></tr>' +
              '<tr><td><code>&lt;</code></td><td>less than</td><td><code>3 &lt; 5</code></td></tr>' +
              '<tr><td><code>&gt;=</code></td><td>greater or equal</td><td><code>5 &gt;= 5</code></td></tr>' +
              '<tr><td><code>&lt;=</code></td><td>less or equal</td><td><code>3 &lt;= 5</code></td></tr>' +
              '</tbody></table>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b><code>=</code> is not <code>==</code></b>A single <code>=</code> assigns; a double <code>==</code> compares. Writing <code>if x = 5:</code> is a syntax error. This is the most famous typo in all of programming.</div></div>' +
              '<h2>Combining: and, or, not</h2>' +
              '<pre><code>age = 25\nhas_id = True\n\nif age >= 18 and has_id:\n    print("allowed")\n\nif age &lt; 12 or age &gt; 65:\n    print("discounted ticket")\n\nif not has_id:\n    print("bring your ID")</code></pre>' +
              '<ul>' +
              '<li><code>and</code> — <strong>both</strong> sides must be true.</li>' +
              '<li><code>or</code> — <strong>one</strong> side is enough.</li>' +
              '<li><code>not</code> — flips the value.</li>' +
              '</ul>' +
              '<h2>Chained comparisons</h2>' +
              '<p>Python allows what most languages do not:</p>' +
              '<pre><code>if 18 &lt;= age &lt;= 65:\n    print("of working age")</code></pre>' +
              '<p>Clearer and shorter than <code>age >= 18 and age <= 65</code>.</p>' +
              '<h2>The membership operator: in</h2>' +
              '<pre><code>print("y" in "Python")          # True\nprint("cat" in ["dog", "cat"])  # True\nprint("z" not in "Python")      # True</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>Short-circuit evaluation</b>In <code>a and b</code>, if <code>a</code> is false Python never evaluates <code>b</code> at all. Use it to protect yourself: <code>if name and name[0] == "A"</code> will not crash when the name is empty.</div></div>'
        },
        example: {
          note: { ar: 'غيّر القيم في الأعلى وشاهد أي الرسائل تظهر.',
                  en: 'Change the values at the top and see which messages appear.' },
          code: {
            ar: 'age = 25\nhas_id = True\nbalance = 40\n\nprint("بالغ ومعه هوية:", age >= 18 and has_id)\nprint("خصم عمري:", age < 12 or age > 65)\nprint("في سنّ العمل:", 18 <= age <= 65)\nprint("لا يملك رصيداً كافياً:", not balance >= 50)\n\nif age >= 18 and has_id and balance >= 30:\n    print("✓ اكتملت الشروط")\nelse:\n    print("✗ شرط ناقص")',
            en: 'age = 25\nhas_id = True\nbalance = 40\n\nprint("adult with ID:", age >= 18 and has_id)\nprint("age discount:", age < 12 or age > 65)\nprint("of working age:", 18 <= age <= 65)\nprint("balance too low:", not balance >= 50)\n\nif age >= 18 and has_id and balance >= 30:\n    print("✓ all conditions met")\nelse:\n    print("✗ a condition is missing")'
          }
        },
        challenge: {
          brief: { ar: 'عرّف age = 30 و is_member = True و total = 250. عرّف متغيّراً منطقياً free_shipping يكون True فقط إذا كان العضو مشتركاً وكان الإجمالي 200 فأكثر. وعرّف needs_id يكون True إذا كان العمر خارج النطاق 18 إلى 65. اطبع القيمتين.',
                   en: 'Define age = 30, is_member = True and total = 250. Define a boolean free_shipping that is True only when the customer is a member and the total is 200 or more. Define needs_id as True when the age falls outside 18 to 65. Print both.' },
          starter: { ar: 'age = 30\nis_member = True\ntotal = 250\n\n# عرّف free_shipping و needs_id\n',
                     en: 'age = 30\nis_member = True\ntotal = 250\n\n# define free_shipping and needs_id\n' },
          solution: { ar: 'age = 30\nis_member = True\ntotal = 250\n\nfree_shipping = is_member and total >= 200\nneeds_id = not (18 <= age <= 65)\n\nprint("شحن مجاني:", free_shipping)\nprint("يحتاج هوية:", needs_id)',
                      en: 'age = 30\nis_member = True\ntotal = 250\n\nfree_shipping = is_member and total >= 200\nneeds_id = not (18 <= age <= 65)\n\nprint("Free shipping:", free_shipping)\nprint("Needs ID:", needs_id)' },
          checks: [
            { label: { ar: 'free_shipping قيمة منطقية تساوي True', en: 'free_shipping is a boolean equal to True' },
              hint:  { ar: 'استخدم ‎is_member and total >= 200‎', en: 'Use is_member and total >= 200' },
              test: function (r) { return r.type('free_shipping') === 'bool' && r.val('free_shipping') === true; } },
            { label: { ar: 'needs_id قيمة منطقية تساوي False', en: 'needs_id is a boolean equal to False' },
              hint:  { ar: 'العمر 30 داخل النطاق، فالنتيجة False', en: 'Age 30 is inside the range, so the result is False' },
              test: function (r) { return r.type('needs_id') === 'bool' && r.val('needs_id') === false; } },
            { label: { ar: 'استخدمت العامل and فعلياً', en: 'You actually used the and operator' },
              hint:  { ar: 'الشرطان معاً مطلوبان للشحن المجاني', en: 'Both conditions are required for free shipping' },
              test: function (r) { return r.src(/\band\b/); } },
            { label: { ar: 'طُبعت القيمتان True و False', en: 'Both True and False appear in the output' },
              hint:  { ar: 'اطبع المتغيّرين', en: 'Print both variables' },
              test: function (r) { return r.prints('True') && r.prints('False'); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما الفرق بين = و ==؟', en: 'What is the difference between = and ==?' },
            options: [ { ar: 'لا فرق', en: 'No difference' },
                       { ar: '= تُسند و == تقارن', en: '= assigns and == compares' },
                       { ar: '= تقارن و == تُسند', en: '= compares and == assigns' },
                       { ar: 'الأولى للأعداد والثانية للنصوص', en: 'One is for numbers, one for strings' } ],
            answer: 1,
            why: { ar: 'الإسناد يضع قيمة في اسم، والمقارنة تنتج True أو False.',
                   en: 'Assignment puts a value into a name; comparison produces True or False.' } },
          { q: { ar: 'متى يكون ‎a or b‎ صحيحاً؟', en: 'When is a or b true?' },
            options: [ { ar: 'حين يتحقّق الطرفان', en: 'When both sides are true' },
                       { ar: 'حين يتحقّق طرف واحد على الأقل', en: 'When at least one side is true' },
                       { ar: 'حين لا يتحقّق أيّهما', en: 'When neither is true' },
                       { ar: 'دائماً', en: 'Always' } ],
            answer: 1,
            why: { ar: 'or تحتاج طرفاً واحداً صحيحاً فقط، بخلاف and التي تحتاج الطرفين.',
                   en: 'or needs only one true side, unlike and which needs both.' } },
          { q: { ar: 'ما ناتج ‎"y" in "Python"‎؟', en: 'What is "y" in "Python"?' },
            options: [ { ar: 'True', en: 'True' }, { ar: 'False', en: 'False' }, { ar: '1', en: '1' }, { ar: 'خطأ', en: 'An error' } ],
            answer: 0,
            why: { ar: 'العامل in يفحص وجود جزء داخل نص أو عنصر داخل قائمة.',
                   en: 'The in operator checks whether a part exists inside a string, or an item inside a list.' } }
        ]
      },

      {
        id: 'for-loops',
        minutes: 10, level: 'beginner',
        tags: ['for', 'range', 'حلقة', 'loop'],
        title: { ar: 'حلقة for و range', en: 'The for loop and range' },
        lede: { ar: 'بدل أن تكتب السطر مئة مرة، اكتبه مرة وقل لبايثون: كرّره. هذه هي اللحظة التي تصير فيها مبرمجاً.',
                en: 'Instead of writing a line a hundred times, write it once and tell Python to repeat it. This is the moment you become a programmer.' },
        body: {
          ar: '<h2>المرور على عناصر</h2>' +
              '<pre><code>names = ["سارة", "أحمد", "ليلى"]\n\nfor name in names:\n    print(f"أهلاً {name}")</code></pre>' +
              '<p>اقرأها حرفياً: «لكل <code>name</code> في <code>names</code>، افعل التالي». المتغيّر <code>name</code> تخترع اسمه أنت، ويحمل عنصراً مختلفاً في كل دورة.</p>' +
              '<h2>المرور على نص</h2>' +
              '<pre><code>for ch in "أهلاً":\n    print(ch)</code></pre>' +
              '<h2>الدالة range</h2>' +
              '<pre><code>for i in range(5):\n    print(i)        # 0 1 2 3 4\n\nfor i in range(1, 6):\n    print(i)        # 1 2 3 4 5\n\nfor i in range(0, 10, 2):\n    print(i)        # 0 2 4 6 8</code></pre>' +
              '<p><code>range(start, stop, step)</code> — و<code>stop</code> غير مشمولة، تماماً كالتقطيع.</p>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>‎range(5)‎ تعطي خمسة أرقام</b>من 0 إلى 4. إن أردت من 1 إلى 5 اكتب <code>range(1, 6)</code>. تذكّر: النهاية دائماً خارج النطاق.</div></div>' +
              '<h2>المجموع والعدّاد</h2>' +
              '<pre><code>numbers = [10, 20, 30]\ntotal = 0\n\nfor n in numbers:\n    total += n\n\nprint(total)   # 60</code></pre>' +
              '<p>هذا نمط أساسي: ابدأ بمتغيّر صفري خارج الحلقة، وراكم فيه داخلها.</p>' +
              '<h2>enumerate: العنصر ورقمه معاً</h2>' +
              '<pre><code>for i, name in enumerate(names, start=1):\n    print(f"{i}. {name}")</code></pre>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>لا تعدّل القائمة أثناء المرور عليها</b>حذف عناصر من قائمة داخل حلقة <code>for</code> تمرّ عليها يُنتج نتائج غريبة. اصنع قائمة جديدة بدلاً من ذلك.</div></div>',
          en: '<h2>Looping over items</h2>' +
              '<pre><code>names = ["Sara", "Ahmed", "Layla"]\n\nfor name in names:\n    print(f"Hello {name}")</code></pre>' +
              '<p>Read it literally: "for each <code>name</code> in <code>names</code>, do the following". You invent the name <code>name</code>, and it holds a different item on every pass.</p>' +
              '<h2>Looping over a string</h2>' +
              '<pre><code>for ch in "Hello":\n    print(ch)</code></pre>' +
              '<h2>The range function</h2>' +
              '<pre><code>for i in range(5):\n    print(i)        # 0 1 2 3 4\n\nfor i in range(1, 6):\n    print(i)        # 1 2 3 4 5\n\nfor i in range(0, 10, 2):\n    print(i)        # 0 2 4 6 8</code></pre>' +
              '<p><code>range(start, stop, step)</code> — and <code>stop</code> is excluded, exactly like slicing.</p>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b><code>range(5)</code> gives five numbers</b>0 through 4. If you want 1 through 5, write <code>range(1, 6)</code>. Remember: the stop is always outside the range.</div></div>' +
              '<h2>Totals and counters</h2>' +
              '<pre><code>numbers = [10, 20, 30]\ntotal = 0\n\nfor n in numbers:\n    total += n\n\nprint(total)   # 60</code></pre>' +
              '<p>This is a fundamental pattern: start a variable at zero outside the loop, and accumulate into it inside.</p>' +
              '<h2>enumerate: the item and its position</h2>' +
              '<pre><code>for i, name in enumerate(names, start=1):\n    print(f"{i}. {name}")</code></pre>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>Never modify a list while looping over it</b>Removing items from a list inside a <code>for</code> loop that iterates it produces strange results. Build a new list instead.</div></div>'
        },
        example: {
          note: { ar: 'جرّب تغيير أرقام range وشاهد أثرها.',
                  en: 'Try changing the range numbers and see the effect.' },
          code: {
            ar: 'names = ["سارة", "أحمد", "ليلى"]\n\nfor i, name in enumerate(names, start=1):\n    print(f"{i}. {name}")\n\nprint("-" * 20)\n\n# جدول الضرب للرقم 7\nfor i in range(1, 6):\n    print(f"7 × {i} = {7 * i}")\n\nprint("-" * 20)\n\n# المجموع\nnumbers = [10, 20, 30, 40]\ntotal = 0\nfor n in numbers:\n    total += n\nprint("المجموع:", total)',
            en: 'names = ["Sara", "Ahmed", "Layla"]\n\nfor i, name in enumerate(names, start=1):\n    print(f"{i}. {name}")\n\nprint("-" * 20)\n\n# times table for 7\nfor i in range(1, 6):\n    print(f"7 x {i} = {7 * i}")\n\nprint("-" * 20)\n\n# the total\nnumbers = [10, 20, 30, 40]\ntotal = 0\nfor n in numbers:\n    total += n\nprint("Total:", total)'
          }
        },
        challenge: {
          brief: { ar: 'استخدم حلقة for لحساب مجموع الأعداد الزوجية من 1 إلى 20 (شاملاً 20) في متغيّر اسمه even_sum، ثم اطبعه. الناتج الصحيح 110.',
                   en: 'Use a for loop to sum the even numbers from 1 to 20 inclusive into a variable named even_sum, then print it. The correct answer is 110.' },
          starter: { ar: 'even_sum = 0\n\n# مُرّ على الأعداد من 1 إلى 20 وأضف الزوجية فقط\n',
                     en: 'even_sum = 0\n\n# loop over 1 to 20 and add only the even numbers\n' },
          solution: { ar: 'even_sum = 0\n\nfor n in range(1, 21):\n    if n % 2 == 0:\n        even_sum += n\n\nprint(even_sum)',
                      en: 'even_sum = 0\n\nfor n in range(1, 21):\n    if n % 2 == 0:\n        even_sum += n\n\nprint(even_sum)' },
          checks: [
            { label: { ar: 'استخدمت حلقة for', en: 'You used a for loop' },
              hint:  { ar: 'اكتب ‎for n in range(1, 21):‎', en: 'Write for n in range(1, 21):' },
              test: function (r) { return r.src(/\bfor\b/) && r.src(/\brange\s*\(/); } },
            { label: { ar: 'فحصت الزوجية بالعامل %', en: 'You tested evenness with the % operator' },
              hint:  { ar: 'الشرط ‎n % 2 == 0‎', en: 'The condition is n % 2 == 0' },
              test: function (r) { return r.src(/%\s*2/); } },
            { label: { ar: 'even_sum يساوي 110', en: 'even_sum equals 110' },
              hint:  { ar: '2+4+6+…+20 = 110', en: '2+4+6+…+20 = 110' },
              test: function (r) { return r.val('even_sum') === 110; } },
            { label: { ar: 'طُبعت النتيجة 110', en: 'The result 110 was printed' },
              hint:  { ar: 'أضف ‎print(even_sum)‎ بعد الحلقة', en: 'Add print(even_sum) after the loop' },
              test: function (r) { return r.stdout.indexOf('110') >= 0; } }
          ]
        },
        quiz: [
          { q: { ar: 'كم رقماً تُنتج ‎range(5)‎؟', en: 'How many numbers does range(5) produce?' },
            options: [ { ar: '4', en: '4' }, { ar: '5', en: '5' }, { ar: '6', en: '6' }, { ar: 'لا نهائي', en: 'Infinite' } ],
            answer: 1,
            why: { ar: 'تُنتج خمسة أرقام من 0 إلى 4، والنهاية 5 غير مشمولة.',
                   en: 'It produces five numbers, 0 through 4; the stop value 5 is excluded.' } },
          { q: { ar: 'ما فائدة enumerate؟', en: 'What is enumerate for?' },
            options: [ { ar: 'ترتيب القائمة', en: 'Sorting the list' },
                       { ar: 'إعطاء العنصر ورقم موضعه معاً', en: 'Giving you the item and its position together' },
                       { ar: 'عدّ الأحرف', en: 'Counting characters' },
                       { ar: 'حذف التكرارات', en: 'Removing duplicates' } ],
            answer: 1,
            why: { ar: 'تُعيد في كل دورة زوجاً: الفهرس والعنصر.',
                   en: 'On each pass it yields a pair: the index and the item.' } },
          { q: { ar: 'أين يجب أن يوضع ‎total = 0‎ عند حساب مجموع؟', en: 'Where should total = 0 go when computing a sum?' },
            options: [ { ar: 'داخل الحلقة', en: 'Inside the loop' }, { ar: 'قبل الحلقة', en: 'Before the loop' },
                       { ar: 'بعد الحلقة', en: 'After the loop' }, { ar: 'لا يهمّ', en: 'It does not matter' } ],
            answer: 1,
            why: { ar: 'لو وُضع داخلها لأُعيد تصفيره في كل دورة وضاع التراكم.',
                   en: 'Inside the loop it would reset on every pass, destroying the running total.' } }
        ]
      },

      {
        id: 'while-loops',
        minutes: 9, level: 'intermediate',
        tags: ['while', 'break', 'continue'],
        title: { ar: 'حلقة while و break و continue', en: 'The while loop, break and continue' },
        lede: { ar: 'حين لا تعرف عدد التكرارات مسبقاً — كأن تنتظر إدخالاً صحيحاً — فحلقة while هي أداتك.',
                en: 'When you do not know the number of repetitions in advance — waiting for valid input, say — while is your tool.' },
        body: {
          ar: '<h2>for مقابل while</h2>' +
              '<ul>' +
              '<li><code>for</code> — «كرّر لكل عنصر» أو «كرّر عشر مرات». العدد معروف.</li>' +
              '<li><code>while</code> — «كرّر ما دام الشرط صحيحاً». العدد غير معروف.</li>' +
              '</ul>' +
              '<pre><code>count = 3\n\nwhile count > 0:\n    print(count)\n    count -= 1\n\nprint("انطلق!")</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>الحلقة اللانهائية</b>لو نسيت <code>count -= 1</code> لبقي الشرط صحيحاً إلى الأبد وتجمّد برنامجك. كل حلقة <code>while</code> يجب أن تحوي سطراً يقرّبها من التوقّف. في محرّر هذه المنصة يوجد زر «إيقاف» ومهلة تلقائية تحميك.</div></div>' +
              '<h2>break: اخرج فوراً</h2>' +
              '<pre><code>for n in range(1, 100):\n    if n * n > 50:\n        print("أول عدد مربّعه أكبر من 50:", n)\n        break</code></pre>' +
              '<h2>continue: تخطَّ هذه الدورة فقط</h2>' +
              '<pre><code>for n in range(1, 11):\n    if n % 2 != 0:\n        continue        # تجاهل الفردي\n    print(n)            # 2 4 6 8 10</code></pre>' +
              '<h2>النمط الأشيع: التحقّق من المدخلات</h2>' +
              '<pre><code>while True:\n    answer = input("اكتب نعم أو لا: ").strip()\n    if answer in ("نعم", "لا"):\n        break\n    print("إجابة غير مفهومة، حاول ثانية")</code></pre>' +
              '<p><code>while True</code> حلقة لا تنتهي بذاتها، و<code>break</code> هو مخرجها الوحيد. نمط شائع جداً ومقبول تماماً.</p>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>متى تختار أيّهما؟</b>إن كان لديك مجموعة تمرّ عليها — قائمة، نص، <code>range</code> — فاستخدم <code>for</code>. إن كنت تنتظر شرطاً يتغيّر — إدخال، رصيد، محاولة — فاستخدم <code>while</code>.</div></div>',
          en: '<h2>for versus while</h2>' +
              '<ul>' +
              '<li><code>for</code> — "repeat for each item" or "repeat ten times". The count is known.</li>' +
              '<li><code>while</code> — "repeat as long as this holds". The count is unknown.</li>' +
              '</ul>' +
              '<pre><code>count = 3\n\nwhile count > 0:\n    print(count)\n    count -= 1\n\nprint("Go!")</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>The infinite loop</b>Forget <code>count -= 1</code> and the condition stays true forever, freezing your program. Every <code>while</code> loop needs a line that moves it toward stopping. This platform\'s editor gives you a Stop button and an automatic timeout to protect you.</div></div>' +
              '<h2>break: leave immediately</h2>' +
              '<pre><code>for n in range(1, 100):\n    if n * n > 50:\n        print("first number whose square exceeds 50:", n)\n        break</code></pre>' +
              '<h2>continue: skip just this pass</h2>' +
              '<pre><code>for n in range(1, 11):\n    if n % 2 != 0:\n        continue        # skip the odd ones\n    print(n)            # 2 4 6 8 10</code></pre>' +
              '<h2>The most common pattern: validating input</h2>' +
              '<pre><code>while True:\n    answer = input("Type yes or no: ").strip()\n    if answer in ("yes", "no"):\n        break\n    print("I did not understand, try again")</code></pre>' +
              '<p><code>while True</code> never ends on its own, and <code>break</code> is its only exit. A very common and perfectly accepted pattern.</p>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>How to choose</b>If you have a collection to walk through — a list, a string, a <code>range</code> — use <code>for</code>. If you are waiting on a condition that changes — an input, a balance, an attempt — use <code>while</code>.</div></div>'
        },
        example: {
          note: { ar: 'لاحظ كيف يوقف break الحلقة تماماً بينما يتخطّى continue دورة واحدة.',
                  en: 'Notice how break stops the loop entirely while continue only skips one pass.' },
          code: {
            ar: '# العدّ التنازلي\ncount = 3\nwhile count > 0:\n    print(count)\n    count -= 1\nprint("انطلق!")\n\nprint("-" * 20)\n\n# break: أول عدد مربّعه أكبر من 50\nfor n in range(1, 100):\n    if n * n > 50:\n        print("وجدته:", n)\n        break\n\nprint("-" * 20)\n\n# continue: الأعداد الزوجية فقط\nfor n in range(1, 11):\n    if n % 2 != 0:\n        continue\n    print(n, end=" ")\nprint()',
            en: '# countdown\ncount = 3\nwhile count > 0:\n    print(count)\n    count -= 1\nprint("Go!")\n\nprint("-" * 20)\n\n# break: first number whose square exceeds 50\nfor n in range(1, 100):\n    if n * n > 50:\n        print("found:", n)\n        break\n\nprint("-" * 20)\n\n# continue: even numbers only\nfor n in range(1, 11):\n    if n % 2 != 0:\n        continue\n    print(n, end=" ")\nprint()'
          }
        },
        challenge: {
          brief: { ar: 'ابدأ بـ balance = 1000. استخدم حلقة while تطرح 150 في كل دورة وتعدّ عدد الدورات في متغيّر months، وتتوقّف حين يصبح الرصيد أقل من 150. اطبع months والرصيد المتبقّي.',
                   en: 'Start with balance = 1000. Use a while loop that subtracts 150 each pass and counts the passes in a variable months, stopping when the balance drops below 150. Print months and the remaining balance.' },
          starter: { ar: 'balance = 1000\nmonths = 0\n\n# اطرح 150 في كل دورة وعُدّ الدورات\n',
                     en: 'balance = 1000\nmonths = 0\n\n# subtract 150 each pass and count the passes\n' },
          solution: { ar: 'balance = 1000\nmonths = 0\n\nwhile balance >= 150:\n    balance -= 150\n    months += 1\n\nprint("عدد الأشهر:", months)\nprint("المتبقّي:", balance)',
                      en: 'balance = 1000\nmonths = 0\n\nwhile balance >= 150:\n    balance -= 150\n    months += 1\n\nprint("Months:", months)\nprint("Remaining:", balance)' },
          checks: [
            { label: { ar: 'استخدمت حلقة while', en: 'You used a while loop' },
              hint:  { ar: 'اكتب ‎while balance >= 150:‎', en: 'Write while balance >= 150:' },
              test: function (r) { return r.src(/\bwhile\b/); } },
            { label: { ar: 'months يساوي 6', en: 'months equals 6' },
              hint:  { ar: '1000 تكفي لستّ عمليات طرح مقدارها 150', en: '1000 covers six subtractions of 150' },
              test: function (r) { return r.val('months') === 6; } },
            { label: { ar: 'الرصيد المتبقّي 100', en: 'The remaining balance is 100' },
              hint:  { ar: '1000 − (6 × 150) = 100', en: '1000 − (6 × 150) = 100' },
              test: function (r) { return r.val('balance') === 100; } },
            { label: { ar: 'طُبعت النتيجتان', en: 'Both results were printed' },
              hint:  { ar: 'اطبع months والرصيد بعد الحلقة', en: 'Print months and the balance after the loop' },
              test: function (r) { return r.stdout.indexOf('6') >= 0 && r.stdout.indexOf('100') >= 0; } }
          ]
        },
        quiz: [
          { q: { ar: 'متى تفضّل while على for؟', en: 'When do you prefer while over for?' },
            options: [ { ar: 'حين تعرف عدد التكرارات', en: 'When you know the number of repetitions' },
                       { ar: 'حين لا تعرف عدد التكرارات مسبقاً', en: 'When you do not know it in advance' },
                       { ar: 'حين تمرّ على قائمة', en: 'When looping over a list' },
                       { ar: 'while أسرع دائماً', en: 'while is always faster' } ],
            answer: 1,
            why: { ar: 'while تناسب الشروط المفتوحة، وfor تناسب المجموعات والأعداد المعروفة.',
                   en: 'while suits open-ended conditions; for suits collections and known counts.' } },
          { q: { ar: 'ما الفرق بين break و continue؟', en: 'What is the difference between break and continue?' },
            options: [ { ar: 'لا فرق', en: 'No difference' },
                       { ar: 'break يخرج من الحلقة و continue يتخطّى دورة واحدة', en: 'break exits the loop; continue skips one pass' },
                       { ar: 'break يتخطّى دورة و continue يخرج', en: 'break skips a pass; continue exits' },
                       { ar: 'كلاهما ينهي البرنامج', en: 'Both end the program' } ],
            answer: 1,
            why: { ar: 'break ينهي الحلقة كلها، وcontinue ينتقل مباشرة للدورة التالية.',
                   en: 'break ends the whole loop; continue jumps straight to the next pass.' } },
          { q: { ar: 'ما سبب الحلقة اللانهائية الأشهر؟', en: 'What is the most common cause of an infinite loop?' },
            options: [ { ar: 'استخدام for', en: 'Using for' },
                       { ar: 'نسيان تحديث المتغيّر الذي يفحصه الشرط', en: 'Forgetting to update the variable the condition tests' },
                       { ar: 'كتابة break', en: 'Writing break' },
                       { ar: 'استخدام range', en: 'Using range' } ],
            answer: 1,
            why: { ar: 'إن بقي الشرط صحيحاً بلا تغيير فلن تتوقّف الحلقة أبداً.',
                   en: 'If the condition never changes it stays true forever and the loop never ends.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 4 — المجموعات / Module 4 — Collections
     =========================================================== */
  MODULES.push({
    id: 'collections',
    icon: '📦',
    title: { ar: 'المجموعات: قوائم وقواميس ومجموعات', en: 'Collections: lists, dictionaries and sets' },
    desc:  { ar: 'متغيّر واحد يحمل قيمة واحدة. المجموعات تحمل آلاف القيم وتنظّمها — وهنا تصير برامجك حقيقية.',
             en: 'One variable holds one value. Collections hold thousands and organise them — this is where your programs get real.' },
    lessons: [

      {
        id: 'lists',
        minutes: 10, level: 'beginner',
        tags: ['list', 'قائمة'],
        title: { ar: 'القوائم: تخزين عدّة قيم', en: 'Lists: storing many values' },
        lede: { ar: 'أهم نوع بيانات في بايثون على الإطلاق. مرتّبة، قابلة للتعديل، وتقبل أي شيء.',
                en: 'By far the most important data type in Python. Ordered, changeable, and able to hold anything.' },
        body: {
          ar: '<h2>إنشاء قائمة</h2>' +
              '<pre><code>fruits = ["تفاح", "موز", "برتقال"]\nnumbers = [10, 20, 30]\nmixed = ["نص", 42, True, 3.14]\nempty = []</code></pre>' +
              '<p>القوسان المربّعان <code>[]</code> والفواصل — هذا كل ما تحتاجه.</p>' +
              '<h2>الوصول والتعديل</h2>' +
              '<pre><code>fruits = ["تفاح", "موز", "برتقال"]\n\nprint(fruits[0])     # تفاح — الترقيم من صفر\nprint(fruits[-1])    # برتقال — من النهاية\nprint(len(fruits))   # 3\n\nfruits[1] = "عنب"    # ✓ التعديل مسموح\nprint(fruits)</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>الفرق الجوهري عن النصوص</b>النص <em>غير</em> قابل للتغيير، والقائمة <em>قابلة</em>. <code>fruits[1] = "عنب"</code> تعمل، بينما <code>word[1] = "x"</code> ترفع خطأً. تذكّر هذا الفرق جيداً.</div></div>' +
              '<h2>الإضافة والحذف</h2>' +
              '<pre><code>fruits.append("مانجو")        # يضيف في النهاية\nfruits.insert(0, "تين")       # يضيف في موضع محدّد\nfruits.remove("موز")          # يحذف أول تطابق بالقيمة\nlast = fruits.pop()           # يحذف الأخير ويُعيده\ndel fruits[0]                 # يحذف بالفهرس</code></pre>' +
              '<h2>التقطيع — تماماً كالنصوص</h2>' +
              '<pre><code>nums = [10, 20, 30, 40, 50]\nprint(nums[1:3])    # [20, 30]\nprint(nums[:2])     # [10, 20]\nprint(nums[::-1])   # معكوسة</code></pre>' +
              '<h2>المرور والفحص</h2>' +
              '<pre><code>for fruit in fruits:\n    print(fruit)\n\nif "تفاح" in fruits:\n    print("موجود")</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>خطأ الفهرس</b><code>fruits[10]</code> في قائمة من ثلاثة عناصر يرفع <code>IndexError</code>. آخر فهرس صالح هو <code>len(fruits) - 1</code> دائماً.</div></div>',
          en: '<h2>Creating a list</h2>' +
              '<pre><code>fruits = ["apple", "banana", "orange"]\nnumbers = [10, 20, 30]\nmixed = ["text", 42, True, 3.14]\nempty = []</code></pre>' +
              '<p>Square brackets <code>[]</code> and commas — that is all it takes.</p>' +
              '<h2>Reading and changing</h2>' +
              '<pre><code>fruits = ["apple", "banana", "orange"]\n\nprint(fruits[0])     # apple — counting from zero\nprint(fruits[-1])    # orange — from the end\nprint(len(fruits))   # 3\n\nfruits[1] = "grape"  # ✓ changing is allowed\nprint(fruits)</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>The essential difference from strings</b>A string is <em>not</em> changeable; a list <em>is</em>. <code>fruits[1] = "grape"</code> works, while <code>word[1] = "x"</code> raises an error. Hold on to that distinction.</div></div>' +
              '<h2>Adding and removing</h2>' +
              '<pre><code>fruits.append("mango")        # adds at the end\nfruits.insert(0, "fig")       # adds at a position\nfruits.remove("banana")       # removes the first match by value\nlast = fruits.pop()           # removes the last and returns it\ndel fruits[0]                 # removes by index</code></pre>' +
              '<h2>Slicing — exactly like strings</h2>' +
              '<pre><code>nums = [10, 20, 30, 40, 50]\nprint(nums[1:3])    # [20, 30]\nprint(nums[:2])     # [10, 20]\nprint(nums[::-1])   # reversed</code></pre>' +
              '<h2>Looping and testing</h2>' +
              '<pre><code>for fruit in fruits:\n    print(fruit)\n\nif "apple" in fruits:\n    print("found")</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>The index error</b><code>fruits[10]</code> on a three-item list raises an <code>IndexError</code>. The last valid index is always <code>len(fruits) - 1</code>.</div></div>'
        },
        example: {
          note: { ar: 'جرّب إضافة وحذف عناصر وشاهد كيف تتغيّر القائمة.',
                  en: 'Try adding and removing items and watch the list change.' },
          code: {
            ar: 'tasks = ["مذاكرة", "رياضة", "قراءة"]\n\nprint("الأصلية:", tasks)\nprint("الأولى:", tasks[0])\nprint("الأخيرة:", tasks[-1])\nprint("العدد:", len(tasks))\n\ntasks.append("تسوّق")\ntasks.insert(0, "صلاة")\nprint("بعد الإضافة:", tasks)\n\ntasks.remove("رياضة")\nprint("بعد الحذف:", tasks)\n\nfor i, task in enumerate(tasks, 1):\n    print(f"{i}. {task}")',
            en: 'tasks = ["study", "sport", "reading"]\n\nprint("original:", tasks)\nprint("first:", tasks[0])\nprint("last:", tasks[-1])\nprint("count:", len(tasks))\n\ntasks.append("shopping")\ntasks.insert(0, "breakfast")\nprint("after adding:", tasks)\n\ntasks.remove("sport")\nprint("after removing:", tasks)\n\nfor i, task in enumerate(tasks, 1):\n    print(f"{i}. {task}")'
          }
        },
        challenge: {
          brief: { ar: 'ابدأ بـ scores = [72, 88, 95, 61, 80]. أضف الدرجة 90 إلى نهايتها، احذف أصغر درجة (61) بالقيمة، ثم عرّف total مجموع القائمة الناتجة و count عدد عناصرها. اطبعهما.',
                   en: 'Start with scores = [72, 88, 95, 61, 80]. Append 90, remove the lowest score (61) by value, then define total as the sum of the resulting list and count as its length. Print both.' },
          starter: { ar: 'scores = [72, 88, 95, 61, 80]\n\n# أضف 90 ثم احذف 61 ثم احسب total و count\n',
                     en: 'scores = [72, 88, 95, 61, 80]\n\n# append 90, remove 61, then compute total and count\n' },
          solution: { ar: 'scores = [72, 88, 95, 61, 80]\n\nscores.append(90)\nscores.remove(61)\n\ntotal = sum(scores)\ncount = len(scores)\n\nprint("القائمة:", scores)\nprint("المجموع:", total)\nprint("العدد:", count)',
                      en: 'scores = [72, 88, 95, 61, 80]\n\nscores.append(90)\nscores.remove(61)\n\ntotal = sum(scores)\ncount = len(scores)\n\nprint("List:", scores)\nprint("Total:", total)\nprint("Count:", count)' },
          checks: [
            { label: { ar: 'استخدمت append و remove', en: 'You used append and remove' },
              hint:  { ar: 'الدالتان مطلوبتان بالاسم', en: 'Both methods are required by name' },
              test: function (r) { return r.src(/\.append\s*\(/) && r.src(/\.remove\s*\(/); } },
            { label: { ar: 'القائمة النهائية لا تحتوي 61 وتحتوي 90', en: 'The final list excludes 61 and includes 90' },
              hint:  { ar: 'احذف بالقيمة لا بالفهرس', en: 'Remove by value, not by index' },
              test: function (r) {
                var s = r.val('scores');
                return Array.isArray(s) && s.indexOf(61) < 0 && s.indexOf(90) >= 0;
              } },
            { label: { ar: 'total يساوي 425', en: 'total equals 425' },
              hint:  { ar: '72+88+95+80+90 = 425', en: '72+88+95+80+90 = 425' },
              test: function (r) { return r.val('total') === 425; } },
            { label: { ar: 'count يساوي 5 وطُبعت القيم', en: 'count equals 5 and the values were printed' },
              hint:  { ar: 'استخدم ‎len(scores)‎ ثم اطبع', en: 'Use len(scores) then print' },
              test: function (r) { return r.val('count') === 5 && r.stdout.indexOf('425') >= 0; } }
          ]
        },
        quiz: [
          { q: { ar: 'ما فهرس آخر عنصر في قائمة طولها 4؟', en: 'What is the index of the last item in a list of length 4?' },
            options: [ { ar: '4', en: '4' }, { ar: '3', en: '3' }, { ar: '5', en: '5' }, { ar: '-4', en: '-4' } ],
            answer: 1,
            why: { ar: 'الترقيم يبدأ من صفر، فآخر فهرس هو الطول ناقص واحد.',
                   en: 'Indexing starts at zero, so the last index is the length minus one.' } },
          { q: { ar: 'ما الفرق بين append و insert؟', en: 'What is the difference between append and insert?' },
            options: [ { ar: 'لا فرق', en: 'No difference' },
                       { ar: 'append تضيف في النهاية و insert في موضع محدّد', en: 'append adds at the end; insert adds at a chosen position' },
                       { ar: 'append تحذف', en: 'append removes' },
                       { ar: 'insert تعمل مع النصوص فقط', en: 'insert only works on strings' } ],
            answer: 1,
            why: { ar: 'append تلحق في آخر القائمة، وinsert تأخذ الفهرس المطلوب أولاً.',
                   en: 'append attaches at the end, while insert takes the target index first.' } },
          { q: { ar: 'أي مما يلي قابل للتعديل بعد إنشائه؟', en: 'Which of these can be modified after creation?' },
            options: [ { ar: 'النص str', en: 'A string' }, { ar: 'القائمة list', en: 'A list' },
                       { ar: 'كلاهما', en: 'Both' }, { ar: 'لا شيء منهما', en: 'Neither' } ],
            answer: 1,
            why: { ar: 'القائمة قابلة للتغيير، أما النص فغير قابل ويجب بناء نص جديد.',
                   en: 'Lists are mutable; strings are not, so you must build a new string instead.' } }
        ]
      },

      {
        id: 'list-methods',
        minutes: 9, level: 'intermediate',
        tags: ['sort', 'sum', 'قوائم'],
        title: { ar: 'عمليات القوائم: ترتيب وإحصاء', en: 'Working with lists: sorting and summarising' },
        lede: { ar: 'دوال قليلة تختصر عليك عشرات الأسطر: المجموع والأكبر والأصغر والترتيب.',
                en: 'A handful of functions that replace dozens of lines: totals, extremes and ordering.' },
        body: {
          ar: '<h2>دوال جاهزة تعمل على أي قائمة</h2>' +
              '<pre><code>nums = [40, 10, 30, 20]\n\nprint(sum(nums))       # 100\nprint(max(nums))       # 40\nprint(min(nums))       # 10\nprint(len(nums))       # 4\nprint(sum(nums) / len(nums))   # 25.0 — المتوسّط</code></pre>' +
              '<h2>الترتيب: طريقتان مختلفتان تماماً</h2>' +
              '<pre><code>nums = [40, 10, 30]\n\nnums.sort()              # يرتّب القائمة نفسها ويُعيد None\nprint(nums)              # [10, 30, 40]\n\nother = [40, 10, 30]\nnew_list = sorted(other) # يُعيد قائمة جديدة ويترك الأصل\nprint(other)             # [40, 10, 30] — لم تتغيّر\nprint(new_list)          # [10, 30, 40]</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>الفخّ الشهير</b><code>nums = nums.sort()</code> يجعل <code>nums</code> تساوي <code>None</code>! لأن <code>.sort()</code> ترتّب في مكانها ولا تُعيد شيئاً. إمّا <code>nums.sort()</code> وحدها، أو <code>nums = sorted(nums)</code>.</div></div>' +
              '<h2>ترتيب تنازلي وبمعيار</h2>' +
              '<pre><code>nums.sort(reverse=True)              # تنازلي\nwords = ["برتقال", "تين", "موز"]\nwords.sort(key=len)                  # حسب الطول</code></pre>' +
              '<h2>دوال أخرى مفيدة</h2>' +
              '<pre><code>nums.count(10)     # كم مرة تكرّر 10\nnums.index(30)     # فهرس أول ظهور لـ 30\nnums.reverse()     # يعكس الترتيب في مكانه\nnums.clear()       # يفرّغ القائمة\nnums.extend([1,2]) # يضيف عدّة عناصر دفعة واحدة</code></pre>' +
              '<h2>نسخ القائمة — انتبه</h2>' +
              '<pre><code>a = [1, 2, 3]\nb = a            # ✗ اسمان للقائمة نفسها!\nb.append(4)\nprint(a)         # [1, 2, 3, 4] — تغيّرت أيضاً\n\nc = a.copy()     # ✓ نسخة مستقلّة\nc.append(5)\nprint(a)         # لم تتأثّر</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>تذكّر تشبيه اللافتة</b><code>b = a</code> يعلّق لافتة ثانية على القائمة نفسها لا ينسخها. للنسخ استخدم <code>.copy()</code> أو <code>a[:]</code>.</div></div>',
          en: '<h2>Built-in functions that work on any list</h2>' +
              '<pre><code>nums = [40, 10, 30, 20]\n\nprint(sum(nums))       # 100\nprint(max(nums))       # 40\nprint(min(nums))       # 10\nprint(len(nums))       # 4\nprint(sum(nums) / len(nums))   # 25.0 — the average</code></pre>' +
              '<h2>Sorting: two very different approaches</h2>' +
              '<pre><code>nums = [40, 10, 30]\n\nnums.sort()              # sorts the list itself and returns None\nprint(nums)              # [10, 30, 40]\n\nother = [40, 10, 30]\nnew_list = sorted(other) # returns a new list, leaves the original\nprint(other)             # [40, 10, 30] — unchanged\nprint(new_list)          # [10, 30, 40]</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>The famous trap</b><code>nums = nums.sort()</code> makes <code>nums</code> equal to <code>None</code>! Because <code>.sort()</code> sorts in place and returns nothing. Use either <code>nums.sort()</code> on its own, or <code>nums = sorted(nums)</code>.</div></div>' +
              '<h2>Reverse order and custom keys</h2>' +
              '<pre><code>nums.sort(reverse=True)              # descending\nwords = ["orange", "fig", "banana"]\nwords.sort(key=len)                  # by length</code></pre>' +
              '<h2>Other useful methods</h2>' +
              '<pre><code>nums.count(10)     # how many times 10 appears\nnums.index(30)     # index of the first 30\nnums.reverse()     # reverses in place\nnums.clear()       # empties the list\nnums.extend([1,2]) # adds several items at once</code></pre>' +
              '<h2>Copying a list — careful</h2>' +
              '<pre><code>a = [1, 2, 3]\nb = a            # ✗ two names for the same list!\nb.append(4)\nprint(a)         # [1, 2, 3, 4] — it changed too\n\nc = a.copy()     # ✓ an independent copy\nc.append(5)\nprint(a)         # unaffected</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>Remember the label analogy</b><code>b = a</code> sticks a second label on the same list, it does not copy it. To copy, use <code>.copy()</code> or <code>a[:]</code>.</div></div>'
        },
        example: {
          note: { ar: 'لاحظ الفرق بين sort و sorted على القائمة الأصلية.',
                  en: 'Notice how sort and sorted differ in their effect on the original list.' },
          code: {
            ar: 'scores = [72, 95, 61, 88, 80]\n\nprint("المجموع:", sum(scores))\nprint("الأعلى:", max(scores))\nprint("الأدنى:", min(scores))\nprint("المتوسّط:", sum(scores) / len(scores))\n\n# sorted لا تغيّر الأصل\nranked = sorted(scores, reverse=True)\nprint("الأصلية:", scores)\nprint("مرتّبة تنازلياً:", ranked)\nprint("أعلى ثلاث:", ranked[:3])',
            en: 'scores = [72, 95, 61, 88, 80]\n\nprint("Total:", sum(scores))\nprint("Highest:", max(scores))\nprint("Lowest:", min(scores))\nprint("Average:", sum(scores) / len(scores))\n\n# sorted leaves the original alone\nranked = sorted(scores, reverse=True)\nprint("Original:", scores)\nprint("Descending:", ranked)\nprint("Top three:", ranked[:3])'
          }
        },
        challenge: {
          brief: { ar: 'مع prices = [45, 12, 89, 33, 67]، عرّف: total المجموع، average المتوسّط، cheapest الأصغر، و sorted_prices قائمة جديدة مرتّبة تصاعدياً دون تغيير الأصلية. اطبع المتوسّط بخانتين عشريتين.',
                   en: 'Given prices = [45, 12, 89, 33, 67], define: total as the sum, average as the mean, cheapest as the minimum, and sorted_prices as a new ascending list without altering the original. Print the average with two decimals.' },
          starter: { ar: 'prices = [45, 12, 89, 33, 67]\n\n# عرّف total و average و cheapest و sorted_prices\n',
                     en: 'prices = [45, 12, 89, 33, 67]\n\n# define total, average, cheapest and sorted_prices\n' },
          solution: { ar: 'prices = [45, 12, 89, 33, 67]\n\ntotal = sum(prices)\naverage = total / len(prices)\ncheapest = min(prices)\nsorted_prices = sorted(prices)\n\nprint("المجموع:", total)\nprint(f"المتوسّط: {average:.2f}")\nprint("الأرخص:", cheapest)\nprint("مرتّبة:", sorted_prices)',
                      en: 'prices = [45, 12, 89, 33, 67]\n\ntotal = sum(prices)\naverage = total / len(prices)\ncheapest = min(prices)\nsorted_prices = sorted(prices)\n\nprint("Total:", total)\nprint(f"Average: {average:.2f}")\nprint("Cheapest:", cheapest)\nprint("Sorted:", sorted_prices)' },
          checks: [
            { label: { ar: 'total يساوي 246 و cheapest يساوي 12', en: 'total equals 246 and cheapest equals 12' },
              hint:  { ar: 'استخدم ‎sum(prices)‎ و ‎min(prices)‎', en: 'Use sum(prices) and min(prices)' },
              test: function (r) { return r.val('total') === 246 && r.val('cheapest') === 12; } },
            { label: { ar: 'average يساوي 49.2', en: 'average equals 49.2' },
              hint:  { ar: 'اقسم المجموع على ‎len(prices)‎', en: 'Divide the total by len(prices)' },
              test: function (r) { return near(r.val('average'), 49.2, 1e-6); } },
            { label: { ar: 'sorted_prices مرتّبة تصاعدياً والأصلية لم تتغيّر', en: 'sorted_prices is ascending and the original is unchanged' },
              hint:  { ar: 'استخدم ‎sorted(prices)‎ لا ‎prices.sort()‎', en: 'Use sorted(prices), not prices.sort()' },
              test: function (r) {
                var s = r.val('sorted_prices'), p = r.val('prices');
                if (!Array.isArray(s) || !Array.isArray(p)) return false;
                var okSorted = String(s) === String([12, 33, 45, 67, 89]);
                var okOriginal = String(p) === String([45, 12, 89, 33, 67]);
                return okSorted && okOriginal;
              } },
            { label: { ar: 'طُبع المتوسّط بخانتين: 49.20', en: 'The average was printed with two decimals: 49.20' },
              hint:  { ar: 'استخدم ‎f"{average:.2f}"‎', en: 'Use f"{average:.2f}"' },
              test: function (r) { return r.stdout.indexOf('49.20') >= 0; } }
          ]
        },
        quiz: [
          { q: { ar: 'ماذا تُعيد ‎nums.sort()‎؟', en: 'What does nums.sort() return?' },
            options: [ { ar: 'قائمة مرتّبة جديدة', en: 'A new sorted list' }, { ar: 'None', en: 'None' },
                       { ar: 'عدد العناصر', en: 'The item count' }, { ar: 'أول عنصر', en: 'The first item' } ],
            answer: 1,
            why: { ar: 'ترتّب القائمة في مكانها ولا تُعيد قيمة، ولهذا لا تُسندها لمتغيّر.',
                   en: 'It sorts in place and returns nothing, which is why you must never assign its result.' } },
          { q: { ar: 'كيف تنسخ قائمة نسخاً مستقلاً؟', en: 'How do you make an independent copy of a list?' },
            options: [ { ar: 'b = a', en: 'b = a' }, { ar: 'b = a.copy()', en: 'b = a.copy()' },
                       { ar: 'b = a.sort()', en: 'b = a.sort()' }, { ar: 'b = len(a)', en: 'b = len(a)' } ],
            answer: 1,
            why: { ar: 'الإسناد المباشر يشارك القائمة نفسها؛ copy تنشئ نسخة منفصلة.',
                   en: 'Plain assignment shares the same list; copy creates a separate one.' } },
          { q: { ar: 'كيف تحسب متوسّط قائمة أعداد؟', en: 'How do you compute the average of a list of numbers?' },
            options: [ { ar: 'max(nums) / 2', en: 'max(nums) / 2' }, { ar: 'sum(nums) / len(nums)', en: 'sum(nums) / len(nums)' },
                       { ar: 'nums.sort()', en: 'nums.sort()' }, { ar: 'len(nums) / sum(nums)', en: 'len(nums) / sum(nums)' } ],
            answer: 1,
            why: { ar: 'المتوسّط هو مجموع القيم مقسوماً على عددها.',
                   en: 'The mean is the sum of the values divided by how many there are.' } }
        ]
      },

      {
        id: 'dicts',
        minutes: 11, level: 'intermediate',
        tags: ['dict', 'قاموس', 'key'],
        title: { ar: 'القواميس: ربط مفتاح بقيمة', en: 'Dictionaries: mapping keys to values' },
        lede: { ar: 'حين لا يكفي الترتيب برقم وتحتاج اسماً لكل قيمة — كسجلّ طالب أو إعدادات برنامج — فالقاموس هو الأداة.',
                en: 'When a numeric position is not enough and each value needs a name — a student record, a settings object — the dictionary is the tool.' },
        body: {
          ar: '<h2>الفكرة</h2>' +
              '<p>القائمة تصل للقيمة برقم: <code>students[0]</code>. القاموس يصل إليها باسم: <code>student["name"]</code>. أوضح بكثير.</p>' +
              '<pre><code>student = {\n    "name": "سارة",\n    "age": 22,\n    "grade": 95\n}\n\nprint(student["name"])   # سارة\nprint(student["grade"])  # 95</code></pre>' +
              '<p>الأقواس المعقوفة <code>{}</code>، وكل عنصر <code>مفتاح: قيمة</code>.</p>' +
              '<h2>الإضافة والتعديل والحذف</h2>' +
              '<pre><code>student["city"] = "الرياض"   # مفتاح جديد\nstudent["age"] = 23           # تعديل موجود\ndel student["grade"]          # حذف</code></pre>' +
              '<h2>‎.get()‎ بدل الأقواس — أأمن</h2>' +
              '<pre><code>print(student["phone"])         # ✗ KeyError إن لم يوجد\nprint(student.get("phone"))     # ✓ None بدل الانهيار\nprint(student.get("phone", "غير مسجّل"))  # ✓ قيمة بديلة</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>متى تستخدم كلاً منهما؟</b>استخدم <code>[]</code> حين يكون غياب المفتاح خطأً حقيقياً تريد أن تعرف به. واستخدم <code>.get()</code> حين يكون الغياب احتمالاً طبيعياً.</div></div>' +
              '<h2>المرور على القاموس</h2>' +
              '<pre><code>for key in student:\n    print(key, "→", student[key])\n\nfor key, value in student.items():\n    print(f"{key}: {value}")\n\nprint(list(student.keys()))     # المفاتيح\nprint(list(student.values()))   # القيم</code></pre>' +
              '<h2>الفحص</h2>' +
              '<pre><code>if "name" in student:\n    print("الاسم مسجّل")\nprint(len(student))   # عدد الأزواج</code></pre>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>قواعد المفاتيح</b>المفتاح يجب أن يكون غير قابل للتغيير — نص أو عدد غالباً — ولا يتكرّر. لو أسندت لمفتاح موجود فأنت تعدّل قيمته لا تضيف عنصراً جديداً.</div></div>' +
              '<h2>قائمة من القواميس — النمط الأشيع في البيانات الحقيقية</h2>' +
              '<pre><code>students = [\n    {"name": "سارة", "grade": 95},\n    {"name": "أحمد", "grade": 78}\n]\n\nfor s in students:\n    print(f\'{s["name"]}: {s["grade"]}\')</code></pre>',
          en: '<h2>The idea</h2>' +
              '<p>A list reaches a value by number: <code>students[0]</code>. A dictionary reaches it by name: <code>student["name"]</code>. Far clearer.</p>' +
              '<pre><code>student = {\n    "name": "Sara",\n    "age": 22,\n    "grade": 95\n}\n\nprint(student["name"])   # Sara\nprint(student["grade"])  # 95</code></pre>' +
              '<p>Curly braces <code>{}</code>, and each entry is <code>key: value</code>.</p>' +
              '<h2>Adding, changing, deleting</h2>' +
              '<pre><code>student["city"] = "Riyadh"   # a new key\nstudent["age"] = 23           # updating an existing one\ndel student["grade"]          # deleting</code></pre>' +
              '<h2><code>.get()</code> instead of brackets — safer</h2>' +
              '<pre><code>print(student["phone"])         # ✗ KeyError if missing\nprint(student.get("phone"))     # ✓ None instead of a crash\nprint(student.get("phone", "not on file"))  # ✓ a fallback value</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>When to use which</b>Use <code>[]</code> when a missing key is a genuine bug you want to hear about. Use <code>.get()</code> when absence is a normal possibility.</div></div>' +
              '<h2>Looping over a dictionary</h2>' +
              '<pre><code>for key in student:\n    print(key, "→", student[key])\n\nfor key, value in student.items():\n    print(f"{key}: {value}")\n\nprint(list(student.keys()))     # the keys\nprint(list(student.values()))   # the values</code></pre>' +
              '<h2>Testing</h2>' +
              '<pre><code>if "name" in student:\n    print("name is on file")\nprint(len(student))   # number of pairs</code></pre>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>Key rules</b>A key must be immutable — usually a string or a number — and unique. Assigning to an existing key updates its value rather than adding a new entry.</div></div>' +
              '<h2>A list of dictionaries — the shape of most real data</h2>' +
              '<pre><code>students = [\n    {"name": "Sara", "grade": 95},\n    {"name": "Ahmed", "grade": 78}\n]\n\nfor s in students:\n    print(f\'{s["name"]}: {s["grade"]}\')</code></pre>'
        },
        example: {
          note: { ar: 'جرّب الوصول لمفتاح غير موجود بالأقواس ثم بـ get وقارن.',
                  en: 'Try reaching a missing key with brackets, then with get, and compare.' },
          code: {
            ar: 'student = {\n    "name": "سارة",\n    "age": 22,\n    "city": "الرياض"\n}\n\nprint(student["name"])\nprint(student.get("phone", "غير مسجّل"))\n\nstudent["grade"] = 95\nprint("بعد الإضافة:", student)\n\nfor key, value in student.items():\n    print(f"{key}: {value}")\n\nprint("عدد الحقول:", len(student))',
            en: 'student = {\n    "name": "Sara",\n    "age": 22,\n    "city": "Riyadh"\n}\n\nprint(student["name"])\nprint(student.get("phone", "not on file"))\n\nstudent["grade"] = 95\nprint("after adding:", student)\n\nfor key, value in student.items():\n    print(f"{key}: {value}")\n\nprint("field count:", len(student))'
          }
        },
        challenge: {
          brief: { ar: 'اصنع قاموساً book فيه المفاتيح title و author و year و pages بقيم من اختيارك (year و pages أعداد). أضف بعد إنشائه مفتاحاً available قيمته True، ثم عرّف fields عدد المفاتيح، واطبع العنوان وعدد الحقول.',
                   en: 'Build a dictionary book with the keys title, author, year and pages (year and pages are numbers). After creating it, add a key available set to True, then define fields as the number of keys, and print the title and the field count.' },
          starter: { ar: 'book = {\n    # اكتب المفاتيح الأربعة هنا\n}\n\n# أضف available ثم عرّف fields\n',
                     en: 'book = {\n    # write the four keys here\n}\n\n# add available then define fields\n' },
          solution: { ar: 'book = {\n    "title": "الأسود يليق بك",\n    "author": "أحلام مستغانمي",\n    "year": 2012,\n    "pages": 320\n}\n\nbook["available"] = True\nfields = len(book)\n\nprint(book["title"])\nprint("عدد الحقول:", fields)',
                      en: 'book = {\n    "title": "The Little Prince",\n    "author": "Saint-Exupery",\n    "year": 1943,\n    "pages": 96\n}\n\nbook["available"] = True\nfields = len(book)\n\nprint(book["title"])\nprint("Field count:", fields)' },
          checks: [
            { label: { ar: 'book قاموس فيه المفاتيح الأربعة', en: 'book is a dict containing all four keys' },
              hint:  { ar: 'المفاتيح: title و author و year و pages', en: 'The keys are title, author, year and pages' },
              test: function (r) {
                var b = r.val('book');
                if (!b || typeof b !== 'object' || Array.isArray(b)) return false;
                return ['title', 'author', 'year', 'pages'].every(function (k) {
                  return Object.prototype.hasOwnProperty.call(b, k);
                });
              } },
            { label: { ar: 'year و pages قيمتان عدديتان', en: 'year and pages hold numbers' },
              hint:  { ar: 'اكتبهما بلا علامات اقتباس', en: 'Write them without quotes' },
              test: function (r) {
                var b = r.val('book') || {};
                return typeof b.year === 'number' && typeof b.pages === 'number';
              } },
            { label: { ar: 'أُضيف المفتاح available بقيمة True', en: 'The key available was added with the value True' },
              hint:  { ar: 'اكتب ‎book["available"] = True‎ بعد الإنشاء', en: 'Write book["available"] = True after creating it' },
              test: function (r) {
                var b = r.val('book') || {};
                return b.available === true && r.src(/\[\s*["']available["']\s*\]\s*=/);
              } },
            { label: { ar: 'fields يساوي 5 وطُبع العنوان', en: 'fields equals 5 and the title was printed' },
              hint:  { ar: 'استخدم ‎len(book)‎ ثم اطبع العنوان', en: 'Use len(book) then print the title' },
              test: function (r) {
                var b = r.val('book') || {};
                return r.val('fields') === 5 &&
                       typeof b.title === 'string' && r.stdout.indexOf(b.title) >= 0;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'ماذا يحدث عند ‎d["missing"]‎ لمفتاح غير موجود؟', en: 'What happens with d["missing"] for an absent key?' },
            options: [ { ar: 'يُعيد None', en: 'It returns None' }, { ar: 'يرفع KeyError', en: 'It raises KeyError' },
                       { ar: 'ينشئ المفتاح', en: 'It creates the key' }, { ar: 'يُعيد نصاً فارغاً', en: 'It returns an empty string' } ],
            answer: 1,
            why: { ar: 'الأقواس ترفع KeyError؛ استخدم ‎.get()‎ إن كان الغياب واردًا.',
                   en: 'Bracket access raises KeyError; use .get() when absence is expected.' } },
          { q: { ar: 'ما الذي تُعيده ‎.items()‎؟', en: 'What does .items() give you?' },
            options: [ { ar: 'المفاتيح فقط', en: 'Keys only' }, { ar: 'القيم فقط', en: 'Values only' },
                       { ar: 'أزواج المفتاح والقيمة', en: 'Key–value pairs' }, { ar: 'عدد العناصر', en: 'The item count' } ],
            answer: 2,
            why: { ar: 'تُستخدم غالباً في ‎for key, value in d.items():‎',
                   en: 'It is typically used as for key, value in d.items():' } },
          { q: { ar: 'ماذا يحدث لو أسندت لمفتاح موجود مسبقاً؟', en: 'What happens if you assign to a key that already exists?' },
            options: [ { ar: 'يُضاف عنصر مكرّر', en: 'A duplicate entry is added' },
                       { ar: 'تُستبدل قيمته القديمة', en: 'Its old value is replaced' },
                       { ar: 'يرفع خطأً', en: 'It raises an error' },
                       { ar: 'يُتجاهل', en: 'It is ignored' } ],
            answer: 1,
            why: { ar: 'المفاتيح فريدة، فالإسناد لمفتاح موجود تعديل لا إضافة.',
                   en: 'Keys are unique, so assigning to an existing key updates rather than appends.' } }
        ]
      },

      {
        id: 'tuples-sets',
        minutes: 8, level: 'intermediate',
        tags: ['tuple', 'set', 'مجموعة'],
        title: { ar: 'الصفوف والمجموعات', en: 'Tuples and sets' },
        lede: { ar: 'نوعان يكملان الصورة: الصفّ لما يجب ألا يتغيّر، والمجموعة للقيم الفريدة والمقارنات السريعة.',
                en: 'Two types that complete the picture: the tuple for what must not change, the set for unique values and fast comparisons.' },
        body: {
          ar: '<h2>الصفّ (tuple): قائمة مقفلة</h2>' +
              '<pre><code>point = (3, 5)\ncolors = ("أحمر", "أخضر", "أزرق")\n\nprint(point[0])      # 3\npoint[0] = 9         # ✗ TypeError — غير قابل للتغيير</code></pre>' +
              '<p>كل ما تفعله بالقائمة من قراءة وتقطيع ومرور تفعله بالصفّ — عدا التعديل.</p>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>لماذا نستخدمه إذن؟</b>لأن «غير قابل للتغيير» ميزة لا قيد. الإحداثيات وتاريخ الميلاد وأبعاد الشاشة لا يجب أن تتغيّر بالخطأ. الصفّ يعلن نيّتك ويحميك، وهو أسرع وأخفّ من القائمة.</div></div>' +
              '<h2>التفكيك</h2>' +
              '<pre><code>point = (3, 5)\nx, y = point        # تفكيك\nprint(x, y)         # 3 5\n\n# ولهذا يعمل التبديل:\na, b = b, a</code></pre>' +
              '<h2>المجموعة (set): بلا تكرار وبلا ترتيب</h2>' +
              '<pre><code>nums = {3, 1, 3, 2, 1}\nprint(nums)          # {1, 2, 3} — حُذف المكرّر\n\nunique = set([1, 1, 2, 2, 3])\nprint(len(unique))   # 3</code></pre>' +
              '<p>أشهر استخدام: <strong>إزالة التكرار من قائمة</strong> في سطر واحد.</p>' +
              '<pre><code>names = ["سارة", "أحمد", "سارة"]\nprint(list(set(names)))   # بلا تكرار</code></pre>' +
              '<h2>عمليات المجموعات</h2>' +
              '<pre><code>a = {1, 2, 3}\nb = {3, 4, 5}\n\nprint(a | b)   # {1,2,3,4,5} الاتحاد\nprint(a & b)   # {3} التقاطع\nprint(a - b)   # {1,2} الفرق</code></pre>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>متى تختار كلاً منها؟</b><b>قائمة</b> — ترتيب يهمّ وتعديل مطلوب. <b>صفّ</b> — قيم ثابتة لا تتغيّر. <b>مجموعة</b> — تريد قيماً فريدة أو فحص انتماء سريعاً. <b>قاموس</b> — كل قيمة تحتاج اسماً.</div></div>',
          en: '<h2>The tuple: a locked list</h2>' +
              '<pre><code>point = (3, 5)\ncolors = ("red", "green", "blue")\n\nprint(point[0])      # 3\npoint[0] = 9         # ✗ TypeError — immutable</code></pre>' +
              '<p>Everything you do to a list — reading, slicing, looping — you can do to a tuple, except change it.</p>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>So why use one?</b>Because "cannot change" is a feature, not a limitation. Coordinates, a date of birth, screen dimensions — these should not change by accident. A tuple declares your intent, protects you, and is faster and lighter than a list.</div></div>' +
              '<h2>Unpacking</h2>' +
              '<pre><code>point = (3, 5)\nx, y = point        # unpacking\nprint(x, y)         # 3 5\n\n# and this is why swapping works:\na, b = b, a</code></pre>' +
              '<h2>The set: no duplicates, no order</h2>' +
              '<pre><code>nums = {3, 1, 3, 2, 1}\nprint(nums)          # {1, 2, 3} — duplicates dropped\n\nunique = set([1, 1, 2, 2, 3])\nprint(len(unique))   # 3</code></pre>' +
              '<p>The most common use: <strong>removing duplicates from a list</strong> in one line.</p>' +
              '<pre><code>names = ["Sara", "Ahmed", "Sara"]\nprint(list(set(names)))   # duplicates gone</code></pre>' +
              '<h2>Set operations</h2>' +
              '<pre><code>a = {1, 2, 3}\nb = {3, 4, 5}\n\nprint(a | b)   # {1,2,3,4,5} union\nprint(a & b)   # {3} intersection\nprint(a - b)   # {1,2} difference</code></pre>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>Choosing between them</b><b>List</b> — order matters and you need to change it. <b>Tuple</b> — fixed values that must not change. <b>Set</b> — you want uniqueness or fast membership tests. <b>Dict</b> — every value needs a name.</div></div>'
        },
        example: {
          note: { ar: 'جرّب تعديل عنصر في الصفّ وشاهد الخطأ.',
                  en: 'Try changing an item in the tuple and watch the error.' },
          code: {
            ar: '# الصفّ\npoint = (3, 5)\nx, y = point\nprint(f"الإحداثيات: x={x}, y={y}")\n\n# المجموعة تزيل التكرار\nvisits = ["سارة", "أحمد", "سارة", "ليلى", "أحمد"]\nunique_visitors = set(visits)\nprint("الزيارات:", len(visits))\nprint("الزوّار الفريدون:", len(unique_visitors))\nprint(unique_visitors)\n\n# عمليات المجموعات\nmorning = {"سارة", "أحمد"}\nevening = {"أحمد", "ليلى"}\nprint("حضروا الفترتين:", morning & evening)\nprint("كل الحضور:", morning | evening)',
            en: '# the tuple\npoint = (3, 5)\nx, y = point\nprint(f"coordinates: x={x}, y={y}")\n\n# a set removes duplicates\nvisits = ["Sara", "Ahmed", "Sara", "Layla", "Ahmed"]\nunique_visitors = set(visits)\nprint("visits:", len(visits))\nprint("unique visitors:", len(unique_visitors))\nprint(unique_visitors)\n\n# set operations\nmorning = {"Sara", "Ahmed"}\nevening = {"Ahmed", "Layla"}\nprint("attended both:", morning & evening)\nprint("all attendees:", morning | evening)'
          }
        },
        challenge: {
          brief: { ar: 'مع entries = ["a", "b", "a", "c", "b", "a"]، عرّف unique مجموعة القيم الفريدة، و unique_count عددها، و duplicates_removed عدد ما حُذف. ثم عرّف صفّاً اسمه size فيه العرض 1920 والارتفاع 1080، وفكّكه إلى width و height.',
                   en: 'Given entries = ["a", "b", "a", "c", "b", "a"], define unique as the set of distinct values, unique_count as its size, and duplicates_removed as how many were dropped. Then define a tuple size holding width 1920 and height 1080, and unpack it into width and height.' },
          starter: { ar: 'entries = ["a", "b", "a", "c", "b", "a"]\n\n# unique و unique_count و duplicates_removed\n\n# الصفّ size ثم التفكيك إلى width و height\n',
                     en: 'entries = ["a", "b", "a", "c", "b", "a"]\n\n# unique, unique_count and duplicates_removed\n\n# the tuple size then unpack into width and height\n' },
          solution: { ar: 'entries = ["a", "b", "a", "c", "b", "a"]\n\nunique = set(entries)\nunique_count = len(unique)\nduplicates_removed = len(entries) - unique_count\n\nsize = (1920, 1080)\nwidth, height = size\n\nprint("الفريدة:", unique_count)\nprint("المحذوف:", duplicates_removed)\nprint(f"الأبعاد: {width}x{height}")',
                      en: 'entries = ["a", "b", "a", "c", "b", "a"]\n\nunique = set(entries)\nunique_count = len(unique)\nduplicates_removed = len(entries) - unique_count\n\nsize = (1920, 1080)\nwidth, height = size\n\nprint("unique:", unique_count)\nprint("removed:", duplicates_removed)\nprint(f"size: {width}x{height}")' },
          checks: [
            { label: { ar: 'unique من نوع set', en: 'unique is a set' },
              hint:  { ar: 'استخدم ‎set(entries)‎', en: 'Use set(entries)' },
              test: function (r) { return r.type('unique') === 'set'; } },
            { label: { ar: 'unique_count يساوي 3 و duplicates_removed يساوي 3', en: 'unique_count equals 3 and duplicates_removed equals 3' },
              hint:  { ar: 'ستّ قيم منها ثلاث فريدة', en: 'Six values, three of them distinct' },
              test: function (r) { return r.val('unique_count') === 3 && r.val('duplicates_removed') === 3; } },
            { label: { ar: 'size من نوع tuple', en: 'size is a tuple' },
              hint:  { ar: 'استخدم الأقواس الهلالية ‎(1920, 1080)‎', en: 'Use round brackets: (1920, 1080)' },
              test: function (r) { return r.type('size') === 'tuple'; } },
            { label: { ar: 'width و height مفكّكان بالقيم الصحيحة', en: 'width and height are unpacked with the right values' },
              hint:  { ar: 'اكتب ‎width, height = size‎', en: 'Write width, height = size' },
              test: function (r) { return r.val('width') === 1920 && r.val('height') === 1080; } }
          ]
        },
        quiz: [
          { q: { ar: 'ما الفرق الجوهري بين القائمة والصفّ؟', en: 'What is the essential difference between a list and a tuple?' },
            options: [ { ar: 'الصفّ أطول', en: 'A tuple is longer' },
                       { ar: 'الصفّ غير قابل للتغيير', en: 'A tuple cannot be changed' },
                       { ar: 'القائمة لا تقبل الأعداد', en: 'A list cannot hold numbers' },
                       { ar: 'لا فرق', en: 'No difference' } ],
            answer: 1,
            why: { ar: 'الصفّ immutable، فما إن يُنشأ لا يمكن تعديل عناصره.',
                   en: 'A tuple is immutable: once created, its items cannot be modified.' } },
          { q: { ar: 'ما ناتج ‎len({1, 1, 2, 2, 3})‎؟', en: 'What is len({1, 1, 2, 2, 3})?' },
            options: [ { ar: '5', en: '5' }, { ar: '3', en: '3' }, { ar: '2', en: '2' }, { ar: 'خطأ', en: 'An error' } ],
            answer: 1,
            why: { ar: 'المجموعة تحذف المكرّرات فيبقى 1 و2 و3 فقط.',
                   en: 'A set drops duplicates, leaving only 1, 2 and 3.' } },
          { q: { ar: 'أي نوع تختار لتخزين قيم فريدة وفحص الانتماء بسرعة؟', en: 'Which type would you pick for unique values and fast membership tests?' },
            options: [ { ar: 'list', en: 'list' }, { ar: 'tuple', en: 'tuple' }, { ar: 'set', en: 'set' }, { ar: 'str', en: 'str' } ],
            answer: 2,
            why: { ar: 'المجموعة مصمّمة للتفرّد ولفحص in بسرعة عالية.',
                   en: 'A set is designed for uniqueness and for very fast in checks.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 5 — الدوال / Module 5 — Functions
     =========================================================== */
  MODULES.push({
    id: 'functions',
    icon: '🧩',
    title: { ar: 'الدوال: اكتب مرة واستخدم دائماً', en: 'Functions: write once, use forever' },
    desc:  { ar: 'الدالة تحوّل كوداً مكرّراً إلى أداة لها اسم. هنا يتحوّل كودك من سكربت إلى برنامج.',
             en: 'A function turns repeated code into a named tool. This is where your code stops being a script and becomes a program.' },
    lessons: [

      {
        id: 'def-functions',
        minutes: 10, level: 'intermediate',
        tags: ['def', 'function', 'دالة'],
        title: { ar: 'تعريف الدوال بـ def', en: 'Defining functions with def' },
        lede: { ar: 'لاحظت أنك تكرّر الكود نفسه؟ هذه إشارة أنك تحتاج دالة.',
                en: 'Noticed you are writing the same code twice? That is the signal you need a function.' },
        body: {
          ar: '<h2>المشكلة</h2>' +
              '<pre><code># نحسب الضريبة في ثلاثة أماكن…\nprint(100 * 0.15)\nprint(250 * 0.15)\nprint(80 * 0.15)</code></pre>' +
              '<p>لو تغيّرت النسبة إلى 12% لبحثت عن كل موضع وعدّلته — واحتمال نسيان أحدها كبير.</p>' +
              '<h2>الحل</h2>' +
              '<pre><code>def tax(amount):\n    return amount * 0.15\n\nprint(tax(100))\nprint(tax(250))\nprint(tax(80))</code></pre>' +
              '<p>الآن النسبة في مكان واحد. عدّلها هناك فيتغيّر كل شيء.</p>' +
              '<h2>تشريح الدالة</h2>' +
              '<pre><code>def   greet   (name)   :\n#  ↑     ↑       ↑     ↑\n#  |     |       |     النقطتان تفتحان الكتلة\n#  |     |       المعامل — مدخل الدالة\n#  |     اسم الدالة\n#  الكلمة المفتاحية\n    return f"أهلاً {name}"</code></pre>' +
              '<h2>التعريف ثم النداء</h2>' +
              '<p>خطوتان منفصلتان: <code>def</code> تُعرّف ولا تُنفّذ شيئاً. الأقواس هي التي تُنفّذ.</p>' +
              '<pre><code>def greet(name):\n    return f"أهلاً {name}"\n\ngreet          # لا شيء يحدث — إشارة للدالة فقط\ngreet("سارة")  # ✓ الآن تُنفَّذ</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>عرّف قبل أن تنادي</b>بايثون تقرأ من أعلى لأسفل. نداء دالة قبل سطر <code>def</code> الخاص بها يرفع <code>NameError</code>. ضع تعريفات الدوال في أعلى الملف.</div></div>' +
              '<h2>return مقابل print</h2>' +
              '<pre><code>def add_print(a, b):\n    print(a + b)        # يعرض فقط\n\ndef add_return(a, b):\n    return a + b        # يُعيد قيمة تُستخدم\n\nx = add_print(2, 3)     # x تساوي None!\ny = add_return(2, 3)    # y تساوي 5 ✓\nprint(y * 2)            # 10</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>الفرق الذي يربك الجميع</b><code>print</code> يُري <em>الإنسان</em> شيئاً. <code>return</code> يُعطي <em>البرنامج</em> قيمة يكمل بها. الدالة التي تحسب يجب أن تُعيد، لا أن تطبع. اطبع في نهاية البرنامج، واحسب داخل الدوال.</div></div>' +
              '<h2>التوثيق</h2>' +
              '<pre><code>def tax(amount):\n    """يحسب ضريبة 15% على المبلغ."""\n    return amount * 0.15</code></pre>' +
              '<p>النص الثلاثي بعد <code>def</code> مباشرة يُسمّى <em>docstring</em>، ويظهر عند <code>help(tax)</code>.</p>',
          en: '<h2>The problem</h2>' +
              '<pre><code># computing tax in three places…\nprint(100 * 0.15)\nprint(250 * 0.15)\nprint(80 * 0.15)</code></pre>' +
              '<p>If the rate changed to 12% you would hunt down every occurrence — and very likely miss one.</p>' +
              '<h2>The fix</h2>' +
              '<pre><code>def tax(amount):\n    return amount * 0.15\n\nprint(tax(100))\nprint(tax(250))\nprint(tax(80))</code></pre>' +
              '<p>Now the rate lives in exactly one place. Change it there and everything follows.</p>' +
              '<h2>Anatomy of a function</h2>' +
              '<pre><code>def   greet   (name)   :\n#  ↑     ↑       ↑     ↑\n#  |     |       |     the colon opens the block\n#  |     |       the parameter — the function\'s input\n#  |     the function name\n#  the keyword\n    return f"Hello {name}"</code></pre>' +
              '<h2>Defining, then calling</h2>' +
              '<p>Two separate steps: <code>def</code> defines and executes nothing. The brackets are what run it.</p>' +
              '<pre><code>def greet(name):\n    return f"Hello {name}"\n\ngreet          # nothing happens — just a reference\ngreet("Sara")  # ✓ now it runs</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>Define before you call</b>Python reads top to bottom. Calling a function above its <code>def</code> line raises a <code>NameError</code>. Keep your definitions near the top of the file.</div></div>' +
              '<h2>return versus print</h2>' +
              '<pre><code>def add_print(a, b):\n    print(a + b)        # only displays\n\ndef add_return(a, b):\n    return a + b        # hands back a usable value\n\nx = add_print(2, 3)     # x is None!\ny = add_return(2, 3)    # y is 5 ✓\nprint(y * 2)            # 10</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>The distinction that trips everyone up</b><code>print</code> shows a <em>human</em> something. <code>return</code> hands the <em>program</em> a value to carry on with. A function that computes should return, not print. Print at the edges of your program; compute inside functions.</div></div>' +
              '<h2>Documentation</h2>' +
              '<pre><code>def tax(amount):\n    """Return 15% tax on the given amount."""\n    return amount * 0.15</code></pre>' +
              '<p>A triple-quoted string right after <code>def</code> is called a <em>docstring</em>, and it shows up in <code>help(tax)</code>.</p>'
        },
        example: {
          note: { ar: 'لاحظ أن الدالة الأولى تُعيد None لأنها تطبع فقط.',
                  en: 'Notice the first function returns None because it only prints.' },
          code: {
            ar: 'def tax(amount):\n    """يحسب ضريبة 15%."""\n    return amount * 0.15\n\ndef total_with_tax(amount):\n    return amount + tax(amount)\n\nfor price in [100, 250, 80]:\n    print(f"{price} → الضريبة {tax(price):.2f} → الإجمالي {total_with_tax(price):.2f}")\n\n# الفرق بين print و return\ndef shows(x):\n    print(x)\n\nresult = shows(5)\nprint("ما أعادته:", result)',
            en: 'def tax(amount):\n    """Return 15% tax."""\n    return amount * 0.15\n\ndef total_with_tax(amount):\n    return amount + tax(amount)\n\nfor price in [100, 250, 80]:\n    print(f"{price} → tax {tax(price):.2f} → total {total_with_tax(price):.2f}")\n\n# print versus return\ndef shows(x):\n    print(x)\n\nresult = shows(5)\nprint("what it returned:", result)'
          }
        },
        challenge: {
          brief: { ar: 'عرّف دالة اسمها celsius_to_fahrenheit تأخذ معاملاً واحداً c وتُعيد (لا تطبع) ما يعادله بالفهرنهايت. ثم نادِها واطبع نتيجتها لدرجة 25.',
                   en: 'Define a function named celsius_to_fahrenheit taking one parameter c and returning (not printing) the Fahrenheit equivalent. Then call it and print the result for 25.' },
          starter: { ar: '# عرّف الدالة ثم نادِها\ndef celsius_to_fahrenheit(c):\n    pass\n',
                     en: '# define the function then call it\ndef celsius_to_fahrenheit(c):\n    pass\n' },
          solution: { ar: 'def celsius_to_fahrenheit(c):\n    """يحوّل من مئوية إلى فهرنهايت."""\n    return (c * 9 / 5) + 32\n\nprint(celsius_to_fahrenheit(25))',
                      en: 'def celsius_to_fahrenheit(c):\n    """Convert Celsius to Fahrenheit."""\n    return (c * 9 / 5) + 32\n\nprint(celsius_to_fahrenheit(25))' },
          checks: [
            { label: { ar: 'عرّفت دالة بالاسم المطلوب', en: 'You defined a function with the required name' },
              hint:  { ar: 'اكتب ‎def celsius_to_fahrenheit(c):‎', en: 'Write def celsius_to_fahrenheit(c):' },
              test: function (r) { return isFn(r, 'celsius_to_fahrenheit'); } },
            { label: { ar: 'الدالة تُعيد 77.0 عند إدخال 25', en: 'The function returns 77.0 for 25' },
              hint:  { ar: 'استخدم return مع ‎(c * 9 / 5) + 32‎', en: 'Use return with (c * 9 / 5) + 32' },
              test: function (r) {
                return r.call('celsius_to_fahrenheit', [25]).then(function (o) {
                  return o.ok && near(o.value, 77, 1e-6);
                });
              } },
            { label: { ar: 'تعمل مع قيمة أخرى: 0 تعطي 32', en: 'It works for another value: 0 gives 32' },
              hint:  { ar: 'استخدم المعامل c لا رقماً ثابتاً', en: 'Use the parameter c, not a hard-coded number' },
              test: function (r) {
                return r.call('celsius_to_fahrenheit', [0]).then(function (o) {
                  return o.ok && near(o.value, 32, 1e-6);
                });
              } },
            { label: { ar: 'استخدمت return لا print داخل الدالة', en: 'You used return, not print, inside the function' },
              hint:  { ar: 'الدالة تُعيد القيمة، والطباعة خارجها', en: 'The function returns the value; printing happens outside' },
              test: function (r) { return r.src(/\breturn\b/) && r.stdout.indexOf('77') >= 0; } }
          ]
        },
        quiz: [
          { q: { ar: 'ما الفرق بين return و print؟', en: 'What is the difference between return and print?' },
            options: [ { ar: 'لا فرق', en: 'No difference' },
                       { ar: 'return يُعيد قيمة للبرنامج و print يعرضها للمستخدم', en: 'return hands a value back to the program; print shows it to a human' },
                       { ar: 'print أسرع', en: 'print is faster' },
                       { ar: 'return يعمل خارج الدوال فقط', en: 'return only works outside functions' } ],
            answer: 1,
            why: { ar: 'قيمة return يمكن تخزينها واستخدامها، أما print فيعرض ولا يُعيد شيئاً.',
                   en: 'A returned value can be stored and reused; print displays and returns nothing.' } },
          { q: { ar: 'ماذا تُعيد دالة بلا return؟', en: 'What does a function with no return give back?' },
            options: [ { ar: '0', en: '0' }, { ar: 'None', en: 'None' }, { ar: 'نصاً فارغاً', en: 'An empty string' }, { ar: 'خطأ', en: 'An error' } ],
            answer: 1,
            why: { ar: 'كل دالة بلا return صريح تُعيد None ضمناً.',
                   en: 'Every function without an explicit return implicitly returns None.' } },
          { q: { ar: 'ما الذي يُنفّذ الدالة فعلياً؟', en: 'What actually executes a function?' },
            options: [ { ar: 'كلمة def', en: 'The def keyword' }, { ar: 'كتابة اسمها فقط', en: 'Writing its name alone' },
                       { ar: 'الأقواس بعد الاسم', en: 'The brackets after the name' }, { ar: 'كلمة return', en: 'The return keyword' } ],
            answer: 2,
            why: { ar: 'def تُعرّف فقط، والأقواس ‎()‎ هي التي تستدعي وتُنفّذ.',
                   en: 'def only defines; the () brackets are what call and run it.' } }
        ]
      },

      {
        id: 'params-return',
        minutes: 10, level: 'intermediate',
        tags: ['parameters', 'معاملات', 'return'],
        title: { ar: 'المعاملات والقيم المُعادة', en: 'Parameters and returned values' },
        lede: { ar: 'كيف تمرّر أكثر من مدخل، وتُعيد أكثر من نتيجة، وتجعل بعض المدخلات اختيارية.',
                en: 'How to pass several inputs, return several results, and make some inputs optional.' },
        body: {
          ar: '<h2>عدّة معاملات</h2>' +
              '<pre><code>def rectangle_area(width, height):\n    return width * height\n\nprint(rectangle_area(5, 3))   # 15</code></pre>' +
              '<p>الترتيب مهمّ: أول قيمة تذهب لأول معامل.</p>' +
              '<h2>التمرير بالاسم</h2>' +
              '<pre><code>print(rectangle_area(height=3, width=5))   # 15 — الترتيب لم يعد مهمّاً</code></pre>' +
              '<p>أوضح بكثير حين تكثر المعاملات: <code>send(to="x", subject="y")</code> أفضل من <code>send("x", "y")</code>.</p>' +
              '<h2>القيم الافتراضية</h2>' +
              '<pre><code>def greet(name, greeting="أهلاً"):\n    return f"{greeting} {name}"\n\nprint(greet("سارة"))              # أهلاً سارة\nprint(greet("سارة", "صباح الخير")) # صباح الخير سارة</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>المعاملات ذات القيم الافتراضية تأتي أخيراً</b><code>def f(a=1, b)</code> خطأ نحوي. الترتيب الصحيح: الإجبارية أولاً ثم الاختيارية.</div></div>' +
              '<h2>إعادة عدّة قيم</h2>' +
              '<pre><code>def stats(numbers):\n    return min(numbers), max(numbers), sum(numbers)\n\nlow, high, total = stats([4, 9, 2])\nprint(low, high, total)   # 2 9 15</code></pre>' +
              '<p>في الحقيقة أنت تُعيد <em>صفّاً واحداً</em> ثم تفكّكه — وهذا يفسّر لماذا تعمل الفكرة أصلاً.</p>' +
              '<h2>return يُنهي الدالة فوراً</h2>' +
              '<pre><code>def check(age):\n    if age < 0:\n        return "قيمة غير صالحة"\n    return "مقبول"      # لن يُنفَّذ إن تحقّق الشرط الأول</code></pre>' +
              '<p>يُسمّى هذا النمط <em>الخروج المبكّر</em>، ويقلّل التداخل كثيراً.</p>' +
              '<h2>عدد غير محدّد من المعاملات</h2>' +
              '<pre><code>def total(*numbers):\n    return sum(numbers)\n\nprint(total(1, 2))        # 3\nprint(total(1, 2, 3, 4))  # 10</code></pre>' +
              '<p>النجمة تجمع كل ما مُرّر في صفّ واحد اسمه <code>numbers</code>.</p>',
          en: '<h2>Several parameters</h2>' +
              '<pre><code>def rectangle_area(width, height):\n    return width * height\n\nprint(rectangle_area(5, 3))   # 15</code></pre>' +
              '<p>Order matters: the first value fills the first parameter.</p>' +
              '<h2>Passing by name</h2>' +
              '<pre><code>print(rectangle_area(height=3, width=5))   # 15 — order no longer matters</code></pre>' +
              '<p>Far clearer once parameters multiply: <code>send(to="x", subject="y")</code> beats <code>send("x", "y")</code>.</p>' +
              '<h2>Default values</h2>' +
              '<pre><code>def greet(name, greeting="Hello"):\n    return f"{greeting} {name}"\n\nprint(greet("Sara"))                # Hello Sara\nprint(greet("Sara", "Good morning")) # Good morning Sara</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>Defaulted parameters come last</b><code>def f(a=1, b)</code> is a syntax error. The correct order is required parameters first, optional ones after.</div></div>' +
              '<h2>Returning several values</h2>' +
              '<pre><code>def stats(numbers):\n    return min(numbers), max(numbers), sum(numbers)\n\nlow, high, total = stats([4, 9, 2])\nprint(low, high, total)   # 2 9 15</code></pre>' +
              '<p>What you are really returning is <em>one tuple</em>, which you then unpack — and that explains why the trick works at all.</p>' +
              '<h2>return exits the function immediately</h2>' +
              '<pre><code>def check(age):\n    if age < 0:\n        return "invalid value"\n    return "accepted"      # never runs if the first condition held</code></pre>' +
              '<p>This is the <em>early return</em> pattern, and it flattens nesting considerably.</p>' +
              '<h2>An unlimited number of arguments</h2>' +
              '<pre><code>def total(*numbers):\n    return sum(numbers)\n\nprint(total(1, 2))        # 3\nprint(total(1, 2, 3, 4))  # 10</code></pre>' +
              '<p>The star gathers everything passed into a single tuple named <code>numbers</code>.</p>'
        },
        example: {
          note: { ar: 'جرّب استدعاء الدوال بالاسم وبالترتيب وقارن.',
                  en: 'Try calling the functions positionally and by name, and compare.' },
          code: {
            ar: 'def invoice(item, price, qty=1, discount=0):\n    subtotal = price * qty\n    final = subtotal - discount\n    return subtotal, final\n\nsub, total = invoice("دفتر", 12.5, qty=4, discount=5)\nprint(f"المجموع قبل الخصم: {sub:.2f}")\nprint(f"بعد الخصم: {total:.2f}")\n\n# قيمة افتراضية\nprint(invoice("قلم", 3)[1])\n\n# عدد غير محدّد\ndef add_all(*nums):\n    return sum(nums)\n\nprint(add_all(1, 2, 3, 4, 5))',
            en: 'def invoice(item, price, qty=1, discount=0):\n    subtotal = price * qty\n    final = subtotal - discount\n    return subtotal, final\n\nsub, total = invoice("notebook", 12.5, qty=4, discount=5)\nprint(f"Before discount: {sub:.2f}")\nprint(f"After discount: {total:.2f}")\n\n# using the default\nprint(invoice("pen", 3)[1])\n\n# unlimited arguments\ndef add_all(*nums):\n    return sum(nums)\n\nprint(add_all(1, 2, 3, 4, 5))'
          }
        },
        challenge: {
          brief: { ar: 'عرّف دالة price_after_discount(price, percent=10) تُعيد السعر بعد خصم النسبة المئوية. يجب أن تعمل بمعامل واحد (خصم 10% افتراضياً) وبمعاملين. اطبع نتيجتين: واحدة بالافتراضي وأخرى بنسبة 25.',
                   en: 'Define a function price_after_discount(price, percent=10) returning the price after the given percentage discount. It must work with one argument (10% by default) and with two. Print two results: one using the default and one with 25.' },
          starter: { ar: '# عرّف الدالة بقيمة افتراضية للنسبة\ndef price_after_discount(price, percent=10):\n    pass\n',
                     en: '# define the function with a default percentage\ndef price_after_discount(price, percent=10):\n    pass\n' },
          solution: { ar: 'def price_after_discount(price, percent=10):\n    """يُعيد السعر بعد خصم نسبة مئوية."""\n    return price - (price * percent / 100)\n\nprint(price_after_discount(200))\nprint(price_after_discount(200, 25))',
                      en: 'def price_after_discount(price, percent=10):\n    """Return the price after a percentage discount."""\n    return price - (price * percent / 100)\n\nprint(price_after_discount(200))\nprint(price_after_discount(200, 25))' },
          checks: [
            { label: { ar: 'عرّفت الدالة بالاسم المطلوب', en: 'You defined the function with the required name' },
              hint:  { ar: 'الاسم ‎price_after_discount‎', en: 'The name is price_after_discount' },
              test: function (r) { return isFn(r, 'price_after_discount'); } },
            { label: { ar: 'بمعامل واحد: 200 تعطي 180', en: 'With one argument: 200 gives 180' },
              hint:  { ar: 'اجعل القيمة الافتراضية ‎percent=10‎', en: 'Set the default to percent=10' },
              test: function (r) {
                return r.call('price_after_discount', [200]).then(function (o) {
                  return o.ok && near(o.value, 180, 1e-6);
                });
              } },
            { label: { ar: 'بمعاملين: (200, 25) تعطي 150', en: 'With two arguments: (200, 25) gives 150' },
              hint:  { ar: 'الخصم = ‎price * percent / 100‎', en: 'The discount is price * percent / 100' },
              test: function (r) {
                return r.call('price_after_discount', [200, 25]).then(function (o) {
                  return o.ok && near(o.value, 150, 1e-6);
                });
              } },
            { label: { ar: 'استخدمت قيمة افتراضية وطبعت نتيجتين', en: 'You used a default value and printed two results' },
              hint:  { ar: 'اكتب ‎percent=10‎ في التعريف ثم اطبع مرّتين', en: 'Write percent=10 in the definition then print twice' },
              test: function (r) { return r.src(/percent\s*=\s*10/) && r.lines.length >= 2; } }
          ]
        },
        quiz: [
          { q: { ar: 'أي تعريف صحيح نحوياً؟', en: 'Which definition is syntactically valid?' },
            options: [ { ar: 'def f(a=1, b):', en: 'def f(a=1, b):' }, { ar: 'def f(a, b=1):', en: 'def f(a, b=1):' },
                       { ar: 'def f(=a, b):', en: 'def f(=a, b):' }, { ar: 'def f(a; b):', en: 'def f(a; b):' } ],
            answer: 1,
            why: { ar: 'المعاملات ذات القيم الافتراضية يجب أن تأتي بعد الإجبارية.',
                   en: 'Parameters with defaults must come after the required ones.' } },
          { q: { ar: 'ما نوع ما تُعيده ‎return a, b‎؟', en: 'What type does return a, b give back?' },
            options: [ { ar: 'list', en: 'list' }, { ar: 'tuple', en: 'tuple' }, { ar: 'dict', en: 'dict' }, { ar: 'قيمتان منفصلتان', en: 'Two separate values' } ],
            answer: 1,
            why: { ar: 'تُحزم القيم في صفّ واحد ثم يمكن تفكيكه عند الاستقبال.',
                   en: 'The values are packed into a single tuple, which you can unpack on receipt.' } },
          { q: { ar: 'ماذا يحدث للأسطر بعد return داخل الدالة؟', en: 'What happens to lines after a return inside a function?' },
            options: [ { ar: 'تُنفَّذ أولاً', en: 'They run first' }, { ar: 'لا تُنفَّذ', en: 'They never run' },
                       { ar: 'تُنفَّذ مرّتين', en: 'They run twice' }, { ar: 'ترفع خطأً', en: 'They raise an error' } ],
            answer: 1,
            why: { ar: 'return يُنهي الدالة فوراً ويُعيد التنفيذ إلى موضع النداء.',
                   en: 'return exits the function immediately and hands control back to the caller.' } }
        ]
      },

      {
        id: 'scope',
        minutes: 9, level: 'intermediate',
        tags: ['scope', 'نطاق', 'local'],
        title: { ar: 'نطاق المتغيّرات', en: 'Variable scope' },
        lede: { ar: 'لماذا يختفي متغيّر عرّفته داخل دالة؟ فهم النطاق يمنع صنفاً كاملاً من الأخطاء المحيّرة.',
                en: 'Why does a variable defined inside a function vanish? Understanding scope prevents a whole class of baffling bugs.' },
        body: {
          ar: '<h2>محلّي وعامّ</h2>' +
              '<pre><code>def f():\n    inside = 10        # محلّي — يوجد داخل الدالة فقط\n    print(inside)\n\nf()\nprint(inside)          # ✗ NameError</code></pre>' +
              '<p>كل متغيّر يُنشأ داخل دالة يُولد عند النداء ويموت عند انتهائها.</p>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>هذه ميزة لا عائق</b>لولا النطاق لتصادمت أسماء المتغيّرات بين الدوال في أي برنامج كبير. النطاق يجعل كل دالة صندوقاً مغلقاً يمكنك التفكير فيه وحده.</div></div>' +
              '<h2>القراءة مسموحة، الكتابة لا</h2>' +
              '<pre><code>rate = 0.15\n\ndef tax(amount):\n    return amount * rate    # ✓ القراءة من الخارج مسموحة\n\nprint(tax(100))</code></pre>' +
              '<pre><code>counter = 0\n\ndef bump():\n    counter = counter + 1   # ✗ UnboundLocalError</code></pre>' +
              '<p>بمجرّد أن تُسند لاسم داخل دالة تعتبره بايثون محلّياً في كامل الدالة — حتى قبل سطر الإسناد.</p>' +
              '<h2>الحلّ الصحيح: مرّر وأعِد</h2>' +
              '<pre><code>def bump(counter):\n    return counter + 1\n\ncounter = 0\ncounter = bump(counter)   # ✓ واضح ويمكن تتبّعه</code></pre>' +
              '<h2>كلمة global — وتحذير</h2>' +
              '<pre><code>def bump():\n    global counter\n    counter += 1        # يعمل، لكن…</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>تجنّب <code>global</code> ما استطعت</b>تعمل، لكنها تجعل الدالة تعدّل شيئاً خارجها بلا إعلان في توقيعها، فيصعب تتبّع من غيّر ماذا. الدالة الجيدة تأخذ مدخلاتها وتُعيد نتيجتها ولا تلمس ما حولها. يسمّى هذا <em>الدالة النقيّة</em>.</div></div>' +
              '<h2>الظلّ (shadowing)</h2>' +
              '<pre><code>name = "عامّ"\n\ndef f():\n    name = "محلّي"      # اسم جديد تماماً\n    print(name)         # محلّي\n\nf()\nprint(name)             # عامّ — لم يتأثّر</code></pre>',
          en: '<h2>Local and global</h2>' +
              '<pre><code>def f():\n    inside = 10        # local — exists only inside the function\n    print(inside)\n\nf()\nprint(inside)          # ✗ NameError</code></pre>' +
              '<p>Every variable created inside a function is born on the call and dies when it ends.</p>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>This is a feature, not an obstacle</b>Without scope, variable names would collide between functions in any large program. Scope makes each function a closed box you can reason about on its own.</div></div>' +
              '<h2>Reading is allowed, writing is not</h2>' +
              '<pre><code>rate = 0.15\n\ndef tax(amount):\n    return amount * rate    # ✓ reading from outside is fine\n\nprint(tax(100))</code></pre>' +
              '<pre><code>counter = 0\n\ndef bump():\n    counter = counter + 1   # ✗ UnboundLocalError</code></pre>' +
              '<p>The moment you assign to a name inside a function, Python treats it as local throughout the whole function — even before the assignment line.</p>' +
              '<h2>The right fix: pass in, return out</h2>' +
              '<pre><code>def bump(counter):\n    return counter + 1\n\ncounter = 0\ncounter = bump(counter)   # ✓ explicit and traceable</code></pre>' +
              '<h2>The global keyword — and a warning</h2>' +
              '<pre><code>def bump():\n    global counter\n    counter += 1        # works, but…</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>Avoid <code>global</code> wherever you can</b>It works, but it lets a function modify something outside itself without declaring it in its signature, making "who changed what" hard to trace. A good function takes its inputs, returns its result, and touches nothing around it. That is called a <em>pure function</em>.</div></div>' +
              '<h2>Shadowing</h2>' +
              '<pre><code>name = "global"\n\ndef f():\n    name = "local"      # an entirely new name\n    print(name)         # local\n\nf()\nprint(name)             # global — untouched</code></pre>'
        },
        example: {
          note: { ar: 'احذف التعليق عن السطر الأخير لترى NameError بنفسك.',
                  en: 'Uncomment the last line to see the NameError for yourself.' },
          code: {
            ar: 'rate = 0.15          # عامّ\n\ndef tax(amount):\n    result = amount * rate    # result محلّي، rate مقروء من الخارج\n    return result\n\nprint(tax(100))\n\n# النمط النقيّ: مرّر وأعِد\ndef bump(counter):\n    return counter + 1\n\ncounter = 0\ncounter = bump(counter)\ncounter = bump(counter)\nprint("العدّاد:", counter)\n\n# print(result)   # ← احذف التعليق لترى NameError',
            en: 'rate = 0.15          # global\n\ndef tax(amount):\n    result = amount * rate    # result is local; rate is read from outside\n    return result\n\nprint(tax(100))\n\n# the pure pattern: pass in, return out\ndef bump(counter):\n    return counter + 1\n\ncounter = 0\ncounter = bump(counter)\ncounter = bump(counter)\nprint("counter:", counter)\n\n# print(result)   # ← uncomment to see the NameError'
          }
        },
        challenge: {
          brief: { ar: 'عرّف دالة نقيّة add_item(cart, item) تأخذ قائمة ونصّاً، وتُعيد قائمة <b>جديدة</b> فيها العنصر مضافاً، دون تعديل القائمة الأصلية. اختبرها: أنشئ basket فيه عنصر واحد، ونادِ الدالة لتحصل على new_basket.',
                   en: 'Define a pure function add_item(cart, item) taking a list and a string, returning a <b>new</b> list with the item appended, without modifying the original. Test it: create basket with one item and call the function to get new_basket.' },
          starter: { ar: 'def add_item(cart, item):\n    # أعِد قائمة جديدة بلا تعديل الأصلية\n    pass\n\nbasket = ["خبز"]\n',
                     en: 'def add_item(cart, item):\n    # return a new list without changing the original\n    pass\n\nbasket = ["bread"]\n' },
          solution: { ar: 'def add_item(cart, item):\n    """يُعيد نسخة جديدة من السلة فيها العنصر."""\n    new_cart = cart.copy()\n    new_cart.append(item)\n    return new_cart\n\nbasket = ["خبز"]\nnew_basket = add_item(basket, "حليب")\n\nprint("الأصلية:", basket)\nprint("الجديدة:", new_basket)',
                      en: 'def add_item(cart, item):\n    """Return a new cart containing the item."""\n    new_cart = cart.copy()\n    new_cart.append(item)\n    return new_cart\n\nbasket = ["bread"]\nnew_basket = add_item(basket, "milk")\n\nprint("original:", basket)\nprint("new:", new_basket)' },
          checks: [
            { label: { ar: 'عرّفت الدالة add_item', en: 'You defined add_item' },
              hint:  { ar: 'اكتب ‎def add_item(cart, item):‎', en: 'Write def add_item(cart, item):' },
              test: function (r) { return isFn(r, 'add_item'); } },
            { label: { ar: 'تُعيد قائمة فيها العنصر الجديد', en: 'It returns a list containing the new item' },
              hint:  { ar: 'انسخ ثم أضف ثم أعِد', en: 'Copy, append, then return' },
              test: function (r) {
                return r.call('add_item', [['a'], 'b']).then(function (o) {
                  return o.ok && Array.isArray(o.value) && String(o.value) === String(['a', 'b']);
                });
              } },
            { label: { ar: 'لا تعدّل القائمة الأصلية', en: 'It does not modify the original list' },
              hint:  { ar: 'استخدم ‎cart.copy()‎ لا ‎cart.append()‎ مباشرة', en: 'Use cart.copy(), not cart.append() directly' },
              test: function (r) {
                var b = r.val('basket');
                return Array.isArray(b) && b.length === 1;
              } },
            { label: { ar: 'new_basket فيه عنصران', en: 'new_basket holds two items' },
              hint:  { ar: 'نادِ الدالة وأسند نتيجتها إلى new_basket', en: 'Call the function and assign the result to new_basket' },
              test: function (r) {
                var n = r.val('new_basket');
                return Array.isArray(n) && n.length === 2;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'أين يمكن استخدام متغيّر عُرّف داخل دالة؟', en: 'Where can a variable defined inside a function be used?' },
            options: [ { ar: 'في كل البرنامج', en: 'Anywhere in the program' }, { ar: 'داخل تلك الدالة فقط', en: 'Only inside that function' },
                       { ar: 'في الدوال الأخرى', en: 'In other functions' }, { ar: 'قبل تعريف الدالة', en: 'Before the function is defined' } ],
            answer: 1,
            why: { ar: 'المتغيّر المحلّي يُنشأ عند النداء ويختفي بانتهاء الدالة.',
                   en: 'A local variable is created on the call and disappears when the function ends.' } },
          { q: { ar: 'لماذا يُنصح بتجنّب global؟', en: 'Why is global discouraged?' },
            options: [ { ar: 'لأنها بطيئة', en: 'It is slow' },
                       { ar: 'لأنها تُخفي من يعدّل ماذا فيصعب التتبّع', en: 'It hides who changes what, making code hard to trace' },
                       { ar: 'لأنها لا تعمل', en: 'It does not work' },
                       { ar: 'لأنها محذوفة من بايثون', en: 'It was removed from Python' } ],
            answer: 1,
            why: { ar: 'الأفضل تمرير القيم وإعادتها لتبقى تدفّقات البيانات ظاهرة.',
                   en: 'Passing values in and returning them keeps data flow visible.' } },
          { q: { ar: 'ما الدالة النقيّة؟', en: 'What is a pure function?' },
            options: [ { ar: 'دالة بلا معاملات', en: 'A function with no parameters' },
                       { ar: 'دالة تعتمد على مدخلاتها وتُعيد نتيجة بلا آثار جانبية', en: 'One that depends on its inputs and returns a result with no side effects' },
                       { ar: 'دالة تطبع فقط', en: 'One that only prints' },
                       { ar: 'دالة قصيرة', en: 'A short function' } ],
            answer: 1,
            why: { ar: 'الدالة النقيّة أسهل اختباراً وفهماً لأنها لا تغيّر شيئاً خارجها.',
                   en: 'A pure function is easier to test and reason about because it changes nothing outside itself.' } }
        ]
      },

      {
        id: 'lambda-higher',
        minutes: 9, level: 'advanced',
        tags: ['lambda', 'map', 'filter', 'sorted'],
        title: { ar: 'lambda والدوال العليا', en: 'lambda and higher-order functions' },
        lede: { ar: 'الدوال في بايثون قيم كأي قيمة أخرى: تُمرّر وتُخزّن وتُعاد. هذه الفكرة تفتح أدوات قوية.',
                en: 'Functions in Python are values like any other: they can be passed, stored and returned. That idea unlocks powerful tools.' },
        body: {
          ar: '<h2>الدالة قيمة</h2>' +
              '<pre><code>def double(x):\n    return x * 2\n\nf = double        # بلا أقواس — نُسند الدالة نفسها\nprint(f(5))       # 10</code></pre>' +
              '<h2>lambda: دالة في سطر</h2>' +
              '<pre><code>double = lambda x: x * 2\nprint(double(5))   # 10\n\n# مكافئة تماماً لـ:\ndef double(x):\n    return x * 2</code></pre>' +
              '<p>الصيغة: <code>lambda المعاملات: التعبير</code>. لا <code>return</code> ولا اسم — القيمة تُعاد ضمناً.</p>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>متى تستخدم lambda؟</b>حين تحتاج دالة صغيرة <em>لمرّة واحدة</em> تمرّرها لدالة أخرى. إن كنت ستسمّيها وتستخدمها مراراً فاستخدم <code>def</code> — أوضح وتقبل التوثيق.</div></div>' +
              '<h2>sorted بمعيار مخصّص</h2>' +
              '<pre><code>students = [\n    {"name": "سارة", "grade": 78},\n    {"name": "أحمد", "grade": 95}\n]\n\nranked = sorted(students, key=lambda s: s["grade"], reverse=True)\nprint(ranked[0]["name"])   # أحمد</code></pre>' +
              '<p>هذا أكثر استخدام عملي لـ lambda على الإطلاق: إخبار <code>sorted</code> <em>بأي حقل</em> يرتّب.</p>' +
              '<h2>map و filter</h2>' +
              '<pre><code>nums = [1, 2, 3, 4, 5]\n\ndoubled = list(map(lambda x: x * 2, nums))\nprint(doubled)     # [2, 4, 6, 8, 10]\n\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(evens)       # [2, 4]</code></pre>' +
              '<ul>' +
              '<li><code>map</code> — طبّق دالة على <strong>كل</strong> عنصر.</li>' +
              '<li><code>filter</code> — أبقِ العناصر التي تُعيد الدالة لها <code>True</code>.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>الأسلوب البايثوني</b>في بايثون الحديثة يُفضَّل غالباً استخدام <em>اختصار القوائم</em> بدل map وfilter: <code>[x * 2 for x in nums]</code> أوضح من <code>list(map(...))</code>. ستتعلّمه في الوحدة الأخيرة. لكن يبقى <code>key=lambda</code> مع <code>sorted</code> أداة لا غنى عنها.</div></div>',
          en: '<h2>A function is a value</h2>' +
              '<pre><code>def double(x):\n    return x * 2\n\nf = double        # no brackets — we assign the function itself\nprint(f(5))       # 10</code></pre>' +
              '<h2>lambda: a function on one line</h2>' +
              '<pre><code>double = lambda x: x * 2\nprint(double(5))   # 10\n\n# exactly equivalent to:\ndef double(x):\n    return x * 2</code></pre>' +
              '<p>The form is <code>lambda parameters: expression</code>. No <code>return</code>, no name — the value comes back implicitly.</p>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>When should you use lambda?</b>When you need a tiny <em>one-off</em> function to hand to another function. If you are going to name it and reuse it, use <code>def</code> — it is clearer and can carry a docstring.</div></div>' +
              '<h2>sorted with a custom key</h2>' +
              '<pre><code>students = [\n    {"name": "Sara", "grade": 78},\n    {"name": "Ahmed", "grade": 95}\n]\n\nranked = sorted(students, key=lambda s: s["grade"], reverse=True)\nprint(ranked[0]["name"])   # Ahmed</code></pre>' +
              '<p>This is by far the most practical use of lambda: telling <code>sorted</code> <em>which field</em> to order by.</p>' +
              '<h2>map and filter</h2>' +
              '<pre><code>nums = [1, 2, 3, 4, 5]\n\ndoubled = list(map(lambda x: x * 2, nums))\nprint(doubled)     # [2, 4, 6, 8, 10]\n\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(evens)       # [2, 4]</code></pre>' +
              '<ul>' +
              '<li><code>map</code> — apply a function to <strong>every</strong> item.</li>' +
              '<li><code>filter</code> — keep the items for which the function returns <code>True</code>.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>The Pythonic style</b>Modern Python usually prefers a <em>comprehension</em> over map and filter: <code>[x * 2 for x in nums]</code> reads better than <code>list(map(...))</code>. You will learn it in the final module. But <code>key=lambda</code> with <code>sorted</code> remains indispensable.</div></div>'
        },
        example: {
          note: { ar: 'غيّر المفتاح في sorted لترتيب حسب حقل آخر.',
                  en: 'Change the key in sorted to order by a different field.' },
          code: {
            ar: 'students = [\n    {"name": "سارة", "grade": 78},\n    {"name": "أحمد", "grade": 95},\n    {"name": "ليلى", "grade": 88}\n]\n\nranked = sorted(students, key=lambda s: s["grade"], reverse=True)\nfor i, s in enumerate(ranked, 1):\n    print(f\'{i}. {s["name"]} — {s["grade"]}\')\n\nprint("-" * 20)\n\nnums = [1, 2, 3, 4, 5, 6]\nprint("مضاعفة:", list(map(lambda x: x * 2, nums)))\nprint("الزوجية:", list(filter(lambda x: x % 2 == 0, nums)))',
            en: 'students = [\n    {"name": "Sara", "grade": 78},\n    {"name": "Ahmed", "grade": 95},\n    {"name": "Layla", "grade": 88}\n]\n\nranked = sorted(students, key=lambda s: s["grade"], reverse=True)\nfor i, s in enumerate(ranked, 1):\n    print(f\'{i}. {s["name"]} — {s["grade"]}\')\n\nprint("-" * 20)\n\nnums = [1, 2, 3, 4, 5, 6]\nprint("doubled:", list(map(lambda x: x * 2, nums)))\nprint("evens:", list(filter(lambda x: x % 2 == 0, nums)))'
          }
        },
        challenge: {
          brief: { ar: 'مع القائمة products أدناه، عرّف by_price قائمة مرتّبة تصاعدياً حسب السعر باستخدام key=lambda، و cheap قائمة المنتجات التي سعرها أقل من 50، و names قائمة أسماء المنتجات فقط.',
                   en: 'With the products list below, define by_price sorted ascending by price using key=lambda, cheap as the products priced under 50, and names as just the product names.' },
          starter: { ar: 'products = [\n    {"name": "قلم", "price": 8},\n    {"name": "حقيبة", "price": 120},\n    {"name": "دفتر", "price": 25}\n]\n\n# by_price و cheap و names\n',
                     en: 'products = [\n    {"name": "pen", "price": 8},\n    {"name": "bag", "price": 120},\n    {"name": "notebook", "price": 25}\n]\n\n# by_price, cheap and names\n' },
          solution: { ar: 'products = [\n    {"name": "قلم", "price": 8},\n    {"name": "حقيبة", "price": 120},\n    {"name": "دفتر", "price": 25}\n]\n\nby_price = sorted(products, key=lambda p: p["price"])\ncheap = list(filter(lambda p: p["price"] < 50, products))\nnames = list(map(lambda p: p["name"], products))\n\nprint([p["name"] for p in by_price])\nprint(len(cheap))\nprint(names)',
                      en: 'products = [\n    {"name": "pen", "price": 8},\n    {"name": "bag", "price": 120},\n    {"name": "notebook", "price": 25}\n]\n\nby_price = sorted(products, key=lambda p: p["price"])\ncheap = list(filter(lambda p: p["price"] < 50, products))\nnames = list(map(lambda p: p["name"], products))\n\nprint([p["name"] for p in by_price])\nprint(len(cheap))\nprint(names)' },
          checks: [
            { label: { ar: 'استخدمت lambda فعلياً', en: 'You actually used lambda' },
              hint:  { ar: 'اكتب ‎key=lambda p: p["price"]‎', en: 'Write key=lambda p: p["price"]' },
              test: function (r) { return r.src(/\blambda\b/); } },
            { label: { ar: 'by_price مرتّبة تصاعدياً حسب السعر', en: 'by_price is sorted ascending by price' },
              hint:  { ar: 'استخدم ‎sorted(products, key=...)‎', en: 'Use sorted(products, key=...)' },
              test: function (r) {
                var b = r.val('by_price');
                if (!Array.isArray(b) || b.length !== 3) return false;
                return b[0].price === 8 && b[1].price === 25 && b[2].price === 120;
              } },
            { label: { ar: 'cheap فيه منتجان فقط', en: 'cheap holds exactly two products' },
              hint:  { ar: 'القلم والدفتر أقل من 50', en: 'The pen and the notebook are under 50' },
              test: function (r) {
                var c = r.val('cheap');
                return Array.isArray(c) && c.length === 2;
              } },
            { label: { ar: 'names قائمة الأسماء الثلاثة', en: 'names is the list of the three names' },
              hint:  { ar: 'استخدم map أو اختصار قوائم لاستخراج الاسم', en: 'Use map or a comprehension to pull out the name' },
              test: function (r) {
                var n = r.val('names');
                return Array.isArray(n) && n.length === 3 &&
                       n.every(function (x) { return typeof x === 'string'; });
              } }
          ]
        },
        quiz: [
          { q: { ar: 'ما مكافئ ‎lambda x: x + 1‎؟', en: 'What is lambda x: x + 1 equivalent to?' },
            options: [ { ar: 'def f(x): print(x + 1)', en: 'def f(x): print(x + 1)' },
                       { ar: 'def f(x): return x + 1', en: 'def f(x): return x + 1' },
                       { ar: 'x = x + 1', en: 'x = x + 1' },
                       { ar: 'لا مكافئ لها', en: 'It has no equivalent' } ],
            answer: 1,
            why: { ar: 'lambda تُعيد قيمة التعبير ضمناً بلا كلمة return.',
                   en: 'A lambda implicitly returns the value of its expression, without a return keyword.' } },
          { q: { ar: 'ماذا يفعل ‎key‎ في ‎sorted‎؟', en: 'What does key do in sorted?' },
            options: [ { ar: 'يحدّد عدد العناصر', en: 'Sets how many items to keep' },
                       { ar: 'يحدّد القيمة التي يُرتَّب بناءً عليها', en: 'Chooses the value each item is sorted by' },
                       { ar: 'يعكس الترتيب', en: 'Reverses the order' },
                       { ar: 'يحذف المكرّرات', en: 'Removes duplicates' } ],
            answer: 1,
            why: { ar: 'تُمرَّر دالة تستخرج من كل عنصر القيمة التي يُقارن بها.',
                   en: 'You pass a function that extracts, from each item, the value used for comparison.' } },
          { q: { ar: 'ما الفرق بين map و filter؟', en: 'What is the difference between map and filter?' },
            options: [ { ar: 'لا فرق', en: 'No difference' },
                       { ar: 'map تحوّل كل عنصر و filter تنتقي بعضها', en: 'map transforms every item; filter selects some of them' },
                       { ar: 'map ترتّب و filter تعكس', en: 'map sorts; filter reverses' },
                       { ar: 'كلاهما يحذف عناصر', en: 'Both remove items' } ],
            answer: 1,
            why: { ar: 'map تُطبّق تحويلاً على الجميع، وfilter تُبقي ما يحقّق الشرط.',
                   en: 'map applies a transformation to all items; filter keeps only those that satisfy a condition.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 6 — الأخطاء والملفات / Module 6 — Errors, files & modules
     =========================================================== */
  MODULES.push({
    id: 'robust',
    icon: '🛡️',
    title: { ar: 'برامج لا تنهار: الأخطاء والملفات والوحدات', en: 'Programs that do not crash: errors, files and modules' },
    desc:  { ar: 'الفرق بين سكربت تجريبي وبرنامج حقيقي هو ما يحدث حين تسوء الأمور.',
             en: 'The difference between a throwaway script and a real program is what happens when things go wrong.' },
    lessons: [

      {
        id: 'errors',
        minutes: 9, level: 'intermediate',
        tags: ['errors', 'أخطاء', 'debug'],
        title: { ar: 'قراءة رسائل الخطأ', en: 'Reading error messages' },
        lede: { ar: 'رسالة الخطأ ليست عقاباً بل خريطة. من يقرأها جيداً يصلح في دقيقة ما يستغرق غيره ساعة.',
                en: 'An error message is not a punishment, it is a map. Read it well and you fix in a minute what otherwise takes an hour.' },
        body: {
          ar: '<h2>كيف تقرأ التتبّع (traceback)</h2>' +
              '<pre><code>Traceback (most recent call last):\n  File "&lt;program&gt;", line 3, in &lt;module&gt;\n    print(10 / 0)\nZeroDivisionError: division by zero</code></pre>' +
              '<p>اقرأها <strong>من الأسفل إلى الأعلى</strong>:</p>' +
              '<ol>' +
              '<li><strong>السطر الأخير</strong> — نوع الخطأ ورسالته. هذا أهم سطر.</li>' +
              '<li><strong>السطر قبله</strong> — الكود الذي انهار.</li>' +
              '<li><strong>‎line 3‎</strong> — رقم السطر في ملفك.</li>' +
              '</ol>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>القاعدة الذهبية</b>لا تخف من الرسالة الطويلة. ابدأ بآخر سطر دائماً، فهو يخبرك <em>ماذا</em> حدث، ثم اصعد لتعرف <em>أين</em>.</div></div>' +
              '<h2>الأخطاء التي ستقابلها فعلاً</h2>' +
              '<table><thead><tr><th>الخطأ</th><th>معناه</th><th>سببه الشائع</th></tr></thead><tbody>' +
              '<tr><td><code>SyntaxError</code></td><td>الكود غير مفهوم نحوياً</td><td>قوس ناقص، نقطتان منسيتان</td></tr>' +
              '<tr><td><code>IndentationError</code></td><td>إزاحة خاطئة</td><td>خلط المسافات بـ Tab</td></tr>' +
              '<tr><td><code>NameError</code></td><td>اسم غير معرّف</td><td>خطأ إملائي، أو استخدام قبل التعريف</td></tr>' +
              '<tr><td><code>TypeError</code></td><td>نوع غير مناسب للعملية</td><td><code>"5" + 5</code></td></tr>' +
              '<tr><td><code>ValueError</code></td><td>النوع صحيح والقيمة لا</td><td><code>int("abc")</code></td></tr>' +
              '<tr><td><code>IndexError</code></td><td>فهرس خارج النطاق</td><td><code>[1,2][5]</code></td></tr>' +
              '<tr><td><code>KeyError</code></td><td>مفتاح غير موجود</td><td><code>d["missing"]</code></td></tr>' +
              '<tr><td><code>ZeroDivisionError</code></td><td>قسمة على صفر</td><td><code>x / 0</code></td></tr>' +
              '<tr><td><code>AttributeError</code></td><td>دالة غير موجودة لهذا النوع</td><td><code>"نص".append()</code></td></tr>' +
              '</tbody></table>' +
              '<h2>التمييز الدقيق: TypeError مقابل ValueError</h2>' +
              '<pre><code>int("abc")   # ValueError — النوع str صحيح لكن محتواه ليس رقماً\nint([1, 2])  # TypeError — القائمة نوع لا يُحوَّل أصلاً</code></pre>' +
              '<h2>التصحيح بالطباعة</h2>' +
              '<pre><code>total = 0\nfor n in [1, 2, 3]:\n    print("قبل:", total, "أضيف:", n)   # تتبّع مؤقّت\n    total += n</code></pre>' +
              '<p>أبسط أداة تصحيح وأكثرها فائدة: اطبع القيمة و<code>type()</code> عند النقطة التي تشكّ فيها.</p>',
          en: '<h2>How to read a traceback</h2>' +
              '<pre><code>Traceback (most recent call last):\n  File "&lt;program&gt;", line 3, in &lt;module&gt;\n    print(10 / 0)\nZeroDivisionError: division by zero</code></pre>' +
              '<p>Read it <strong>from the bottom up</strong>:</p>' +
              '<ol>' +
              '<li><strong>The last line</strong> — the error type and message. This is the important one.</li>' +
              '<li><strong>The line above it</strong> — the code that broke.</li>' +
              '<li><strong><code>line 3</code></strong> — the line number in your file.</li>' +
              '</ol>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>The golden rule</b>Do not be intimidated by a long message. Always start at the last line: it tells you <em>what</em> happened. Then work upward to find <em>where</em>.</div></div>' +
              '<h2>The errors you will actually meet</h2>' +
              '<table><thead><tr><th>Error</th><th>Meaning</th><th>Common cause</th></tr></thead><tbody>' +
              '<tr><td><code>SyntaxError</code></td><td>the code is not valid Python</td><td>a missing bracket or colon</td></tr>' +
              '<tr><td><code>IndentationError</code></td><td>wrong indentation</td><td>mixing spaces and tabs</td></tr>' +
              '<tr><td><code>NameError</code></td><td>undefined name</td><td>a typo, or use before definition</td></tr>' +
              '<tr><td><code>TypeError</code></td><td>wrong type for the operation</td><td><code>"5" + 5</code></td></tr>' +
              '<tr><td><code>ValueError</code></td><td>right type, wrong value</td><td><code>int("abc")</code></td></tr>' +
              '<tr><td><code>IndexError</code></td><td>index out of range</td><td><code>[1,2][5]</code></td></tr>' +
              '<tr><td><code>KeyError</code></td><td>key not found</td><td><code>d["missing"]</code></td></tr>' +
              '<tr><td><code>ZeroDivisionError</code></td><td>division by zero</td><td><code>x / 0</code></td></tr>' +
              '<tr><td><code>AttributeError</code></td><td>no such method on this type</td><td><code>"text".append()</code></td></tr>' +
              '</tbody></table>' +
              '<h2>The subtle one: TypeError versus ValueError</h2>' +
              '<pre><code>int("abc")   # ValueError — str is a convertible type, but this content is not a number\nint([1, 2])  # TypeError — a list is not convertible at all</code></pre>' +
              '<h2>Debugging by printing</h2>' +
              '<pre><code>total = 0\nfor n in [1, 2, 3]:\n    print("before:", total, "adding:", n)   # a temporary trace\n    total += n</code></pre>' +
              '<p>The simplest and most useful debugging tool there is: print the value and its <code>type()</code> at the point you suspect.</p>'
        },
        example: {
          note: { ar: 'كل سطر خطأ معلّق. احذف علامة # عن واحد في كل مرة واقرأ الرسالة.',
                  en: 'Each faulty line is commented out. Uncomment one at a time and read the message.' },
          code: {
            ar: '# احذف علامة # عن سطر واحد في كل مرة\n\n# print(10 / 0)          # ZeroDivisionError\n# print("5" + 5)         # TypeError\n# print(int("abc"))      # ValueError\n# print([1, 2][5])       # IndexError\n# print({"a": 1}["b"])   # KeyError\n# print(undefined_name)  # NameError\n\nprint("احذف علامة # عن أحد الأسطر أعلاه")\n\n# التصحيح بالطباعة\nvalue = "42"\nprint("القيمة:", value, "| النوع:", type(value))',
            en: '# uncomment one line at a time\n\n# print(10 / 0)          # ZeroDivisionError\n# print("5" + 5)         # TypeError\n# print(int("abc"))      # ValueError\n# print([1, 2][5])       # IndexError\n# print({"a": 1}["b"])   # KeyError\n# print(undefined_name)  # NameError\n\nprint("uncomment one of the lines above")\n\n# debugging by printing\nvalue = "42"\nprint("value:", value, "| type:", type(value))'
          }
        },
        challenge: {
          brief: { ar: 'الكود في المحرّر يحتوي ثلاثة أخطاء تمنعه من العمل: خطأ نوع، وخطأ اسم، وخطأ فهرس. أصلحها كلها بحيث يطبع البرنامج الإجمالي 30 وآخر عنصر في القائمة.',
                   en: 'The code in the editor contains three bugs that stop it running: a type error, a name error and an index error. Fix all three so the program prints the total 30 and the last item of the list.' },
          starter: { ar: 'items = [10, 20]\n\ntotal = items[0] + items[1]\nprint("الإجمالي:", totl)\n\nlast = items[2]\nprint("الأخير:", last)\n\nlabel = "العدد: " + len(items)\nprint(label)\n',
                     en: 'items = [10, 20]\n\ntotal = items[0] + items[1]\nprint("Total:", totl)\n\nlast = items[2]\nprint("Last:", last)\n\nlabel = "Count: " + len(items)\nprint(label)\n' },
          solution: { ar: 'items = [10, 20]\n\ntotal = items[0] + items[1]\nprint("الإجمالي:", total)\n\nlast = items[-1]\nprint("الأخير:", last)\n\nlabel = "العدد: " + str(len(items))\nprint(label)',
                      en: 'items = [10, 20]\n\ntotal = items[0] + items[1]\nprint("Total:", total)\n\nlast = items[-1]\nprint("Last:", last)\n\nlabel = "Count: " + str(len(items))\nprint(label)' },
          checks: [
            { label: { ar: 'البرنامج يعمل بلا أي خطأ', en: 'The program runs with no errors at all' },
              hint:  { ar: 'ثلاثة أخطاء: ‎totl‎ و ‎items[2]‎ ودمج نص مع عدد', en: 'Three bugs: totl, items[2], and joining text with a number' },
              test: function (r) { return r.ok; } },
            { label: { ar: 'total يساوي 30 وطُبع', en: 'total equals 30 and was printed' },
              hint:  { ar: 'صحّح الخطأ الإملائي في اسم المتغيّر', en: 'Fix the typo in the variable name' },
              test: function (r) { return r.val('total') === 30 && r.stdout.indexOf('30') >= 0; } },
            { label: { ar: 'last يساوي 20 بلا خطأ فهرس', en: 'last equals 20 with no index error' },
              hint:  { ar: 'آخر فهرس صالح هو 1، أو استخدم ‎items[-1]‎', en: 'The last valid index is 1, or use items[-1]' },
              test: function (r) { return r.val('last') === 20; } },
            { label: { ar: 'label نصّ صحيح فيه العدد 2', en: 'label is a valid string containing the number 2' },
              hint:  { ar: 'حوّل العدد بـ ‎str(len(items))‎ قبل الدمج', en: 'Convert with str(len(items)) before joining' },
              test: function (r) {
                var l = r.val('label');
                return typeof l === 'string' && l.indexOf('2') >= 0;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'من أين تبدأ قراءة رسالة الخطأ؟', en: 'Where do you start reading an error message?' },
            options: [ { ar: 'من أول سطر', en: 'The first line' }, { ar: 'من آخر سطر', en: 'The last line' },
                       { ar: 'من المنتصف', en: 'The middle' }, { ar: 'لا تُقرأ', en: 'You do not read it' } ],
            answer: 1,
            why: { ar: 'آخر سطر يحمل نوع الخطأ ورسالته، وهو أهم معلومة.',
                   en: 'The last line carries the error type and message — the single most useful piece of information.' } },
          { q: { ar: 'أي خطأ يسبّبه ‎int("hello")‎؟', en: 'Which error does int("hello") raise?' },
            options: [ { ar: 'TypeError', en: 'TypeError' }, { ar: 'ValueError', en: 'ValueError' },
                       { ar: 'NameError', en: 'NameError' }, { ar: 'SyntaxError', en: 'SyntaxError' } ],
            answer: 1,
            why: { ar: 'النوع str قابل للتحويل مبدئياً لكن هذه القيمة ليست رقماً، فهو ValueError.',
                   en: 'A str is convertible in principle, but this particular value is not a number — hence ValueError.' } },
          { q: { ar: 'ما سبب NameError الأشيع؟', en: 'What most commonly causes a NameError?' },
            options: [ { ar: 'قسمة على صفر', en: 'Division by zero' },
                       { ar: 'خطأ إملائي في اسم متغيّر أو استخدامه قبل تعريفه', en: 'A typo in a name, or using it before it is defined' },
                       { ar: 'قائمة فارغة', en: 'An empty list' },
                       { ar: 'ملف مفقود', en: 'A missing file' } ],
            answer: 1,
            why: { ar: 'بايثون لم تجد اسماً بهذا النصّ في النطاق الحالي.',
                   en: 'Python could not find a name matching that text in the current scope.' } }
        ]
      },

      {
        id: 'try-except',
        minutes: 10, level: 'intermediate',
        tags: ['try', 'except', 'استثناء'],
        title: { ar: 'معالجة الاستثناءات: try و except', en: 'Handling exceptions: try and except' },
        lede: { ar: 'أن يتوقّع برنامجك المشكلة ويتعامل معها بدل أن ينهار — هذه علامة الكود المهني.',
                en: 'A program that anticipates trouble and handles it instead of crashing — that is the mark of professional code.' },
        body: {
          ar: '<h2>الشكل الأساسي</h2>' +
              '<pre><code>try:\n    age = int("غير رقم")\nexcept ValueError:\n    print("من فضلك أدخل رقماً")\n    age = 0\n\nprint(age)</code></pre>' +
              '<p>في <code>try</code> تضع ما قد يفشل، وفي <code>except</code> ما تفعله إن فشل.</p>' +
              '<h2>التقاط أنواع مختلفة</h2>' +
              '<pre><code>try:\n    result = 10 / int(value)\nexcept ValueError:\n    print("ليس رقماً")\nexcept ZeroDivisionError:\n    print("لا يمكن القسمة على صفر")</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>لا تكتب <code>except:</code> عارية أبداً</b>تلتقط <em>كل</em> شيء بما فيه أخطاؤك البرمجية وضغط Ctrl+C، فتُخفي مشاكل حقيقية. حدّد النوع دائماً: <code>except ValueError:</code>. إن اضطررت للعموم فاكتب <code>except Exception as e:</code> واطبع <code>e</code>.</div></div>' +
              '<h2>الأجزاء الأربعة</h2>' +
              '<pre><code>try:\n    value = int(text)\nexcept ValueError as e:\n    print("فشل:", e)          # e تحمل تفاصيل الخطأ\nelse:\n    print("نجح:", value)       # يُنفَّذ إن لم يقع خطأ\nfinally:\n    print("انتهى")             # يُنفَّذ دائماً</code></pre>' +
              '<ul>' +
              '<li><code>except</code> — عند وقوع الخطأ.</li>' +
              '<li><code>else</code> — عند عدم وقوعه.</li>' +
              '<li><code>finally</code> — في الحالتين، للتنظيف كإغلاق ملف.</li>' +
              '</ul>' +
              '<h2>النمط العملي: إدخال آمن متكرّر</h2>' +
              '<pre><code>while True:\n    try:\n        age = int(input("العمر: "))\n        break\n    except ValueError:\n        print("رقم فقط، حاول ثانية")</code></pre>' +
              '<h2>رفع خطأ متعمّد</h2>' +
              '<pre><code>def set_age(age):\n    if age &lt; 0:\n        raise ValueError("العمر لا يكون سالباً")\n    return age</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>متى تلتقط ومتى تدع الخطأ يمرّ؟</b>التقط الخطأ حين تعرف كيف <em>تتعافى</em> منه: قيمة بديلة، إعادة سؤال، تخطّي سجلّ. إن لم تكن تعرف فدعه يمرّ — الانهيار الصريح أفضل من نتيجة خاطئة صامتة.</div></div>',
          en: '<h2>The basic shape</h2>' +
              '<pre><code>try:\n    age = int("not a number")\nexcept ValueError:\n    print("please enter a number")\n    age = 0\n\nprint(age)</code></pre>' +
              '<p>Inside <code>try</code> goes what might fail; inside <code>except</code> goes what you do if it does.</p>' +
              '<h2>Catching different types</h2>' +
              '<pre><code>try:\n    result = 10 / int(value)\nexcept ValueError:\n    print("not a number")\nexcept ZeroDivisionError:\n    print("cannot divide by zero")</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>Never write a bare <code>except:</code></b>It catches <em>everything</em>, including your own bugs and Ctrl+C, hiding real problems. Always name the type: <code>except ValueError:</code>. If you truly need breadth, write <code>except Exception as e:</code> and print <code>e</code>.</div></div>' +
              '<h2>The four parts</h2>' +
              '<pre><code>try:\n    value = int(text)\nexcept ValueError as e:\n    print("failed:", e)        # e carries the details\nelse:\n    print("worked:", value)    # runs when no error occurred\nfinally:\n    print("done")              # runs either way</code></pre>' +
              '<ul>' +
              '<li><code>except</code> — when the error happens.</li>' +
              '<li><code>else</code> — when it does not.</li>' +
              '<li><code>finally</code> — in both cases, for cleanup such as closing a file.</li>' +
              '</ul>' +
              '<h2>The practical pattern: safe repeated input</h2>' +
              '<pre><code>while True:\n    try:\n        age = int(input("Age: "))\n        break\n    except ValueError:\n        print("numbers only, try again")</code></pre>' +
              '<h2>Raising an error deliberately</h2>' +
              '<pre><code>def set_age(age):\n    if age &lt; 0:\n        raise ValueError("age cannot be negative")\n    return age</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>When to catch, and when to let it through</b>Catch an error when you know how to <em>recover</em>: a fallback value, asking again, skipping a record. If you do not know, let it through — an honest crash beats a silently wrong result.</div></div>'
        },
        example: {
          note: { ar: 'غيّر القيم في القائمة وشاهد كيف يعالج البرنامج كل حالة بلا انهيار.',
                  en: 'Change the values in the list and watch each case handled without a crash.' },
          code: {
            ar: 'inputs = ["25", "غير رقم", "0", "7"]\n\nfor text in inputs:\n    try:\n        n = int(text)\n        result = 100 / n\n    except ValueError:\n        print(f"[{text}] ليس رقماً — تخطّي")\n    except ZeroDivisionError:\n        print(f"[{text}] قسمة على صفر — تخطّي")\n    else:\n        print(f"[{text}] 100 ÷ {n} = {result:.2f}")\n\nprint("اكتمل بلا انهيار ✓")',
            en: 'inputs = ["25", "not a number", "0", "7"]\n\nfor text in inputs:\n    try:\n        n = int(text)\n        result = 100 / n\n    except ValueError:\n        print(f"[{text}] not a number — skipping")\n    except ZeroDivisionError:\n        print(f"[{text}] division by zero — skipping")\n    else:\n        print(f"[{text}] 100 / {n} = {result:.2f}")\n\nprint("finished without crashing ✓")'
          }
        },
        challenge: {
          brief: { ar: 'عرّف دالة safe_divide(a, b) تُعيد ناتج القسمة، وتُعيد None إن كان المقسوم عليه صفراً أو إن كانت القيم غير قابلة للقسمة — دون أن ينهار البرنامج. استخدم try/except مع تحديد نوعَي الخطأ.',
                   en: 'Define a function safe_divide(a, b) returning the quotient, and returning None when the divisor is zero or the values cannot be divided — without ever crashing. Use try/except naming both error types.' },
          starter: { ar: 'def safe_divide(a, b):\n    # استخدم try/except وأعِد None عند الفشل\n    pass\n',
                     en: 'def safe_divide(a, b):\n    # use try/except and return None on failure\n    pass\n' },
          solution: { ar: 'def safe_divide(a, b):\n    """يُعيد a ÷ b أو None عند تعذّر القسمة."""\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None\n    except TypeError:\n        return None\n\nprint(safe_divide(10, 2))\nprint(safe_divide(10, 0))\nprint(safe_divide(10, "نص"))',
                      en: 'def safe_divide(a, b):\n    """Return a / b, or None when division is impossible."""\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None\n    except TypeError:\n        return None\n\nprint(safe_divide(10, 2))\nprint(safe_divide(10, 0))\nprint(safe_divide(10, "text"))' },
          checks: [
            { label: { ar: 'استخدمت try و except بنوع محدّد', en: 'You used try and except with a named type' },
              hint:  { ar: 'اكتب ‎except ZeroDivisionError:‎ لا ‎except:‎ عارية', en: 'Write except ZeroDivisionError:, not a bare except:' },
              test: function (r) {
                return r.src(/\btry\s*:/) && r.src(/except\s+[A-Z]\w*/);
              } },
            { label: { ar: 'القسمة العادية تعمل: (10, 2) تعطي 5', en: 'Normal division works: (10, 2) gives 5' },
              hint:  { ar: 'أعِد ‎a / b‎ داخل كتلة try', en: 'Return a / b inside the try block' },
              test: function (r) {
                return r.call('safe_divide', [10, 2]).then(function (o) {
                  return o.ok && near(o.value, 5, 1e-9);
                });
              } },
            { label: { ar: 'القسمة على صفر تُعيد None بلا انهيار', en: 'Dividing by zero returns None without crashing' },
              hint:  { ar: 'التقط ZeroDivisionError وأعِد None', en: 'Catch ZeroDivisionError and return None' },
              test: function (r) {
                return r.call('safe_divide', [10, 0]).then(function (o) {
                  return o.ok && (o.value === null || o.value === 'None');
                });
              } },
            { label: { ar: 'القيمة النصّية تُعيد None بلا انهيار', en: 'A text value returns None without crashing' },
              hint:  { ar: 'التقط TypeError أيضاً', en: 'Catch TypeError as well' },
              test: function (r) {
                return r.call('safe_divide', [10, 'x']).then(function (o) {
                  return o.ok && (o.value === null || o.value === 'None');
                });
              } }
          ]
        },
        quiz: [
          { q: { ar: 'ما وظيفة كتلة finally؟', en: 'What does a finally block do?' },
            options: [ { ar: 'تُنفَّذ عند الخطأ فقط', en: 'Runs only on error' },
                       { ar: 'تُنفَّذ عند النجاح فقط', en: 'Runs only on success' },
                       { ar: 'تُنفَّذ في الحالتين', en: 'Runs in both cases' },
                       { ar: 'لا تُنفَّذ أبداً', en: 'Never runs' } ],
            answer: 2,
            why: { ar: 'تُستخدم للتنظيف المضمون كإغلاق ملف أو اتصال.',
                   en: 'It is used for guaranteed cleanup such as closing a file or a connection.' } },
          { q: { ar: 'لماذا يُنصح بتجنّب ‎except:‎ العارية؟', en: 'Why avoid a bare except:?' },
            options: [ { ar: 'لأنها بطيئة', en: 'It is slow' },
                       { ar: 'لأنها تخفي أخطاءً حقيقية لم تقصد التقاطها', en: 'It hides real bugs you never meant to catch' },
                       { ar: 'لأنها خطأ نحوي', en: 'It is a syntax error' },
                       { ar: 'لأنها تعمل مرة واحدة', en: 'It only works once' } ],
            answer: 1,
            why: { ar: 'التقاط كل شيء يبتلع أخطاء البرمجة ويجعل التصحيح شبه مستحيل.',
                   en: 'Catching everything swallows programming mistakes and makes debugging nearly impossible.' } },
          { q: { ar: 'متى يُنفَّذ جزء else في try؟', en: 'When does the else part of a try run?' },
            options: [ { ar: 'عند وقوع خطأ', en: 'When an error occurs' }, { ar: 'حين لا يقع أي خطأ', en: 'When no error occurs' },
                       { ar: 'دائماً', en: 'Always' }, { ar: 'أبداً', en: 'Never' } ],
            answer: 1,
            why: { ar: 'يُخصّص للكود الذي يجب أن يعمل فقط عند نجاح كتلة try.',
                   en: 'It holds code that should run only when the try block succeeded.' } }
        ]
      },

      {
        id: 'modules',
        minutes: 8, level: 'intermediate',
        tags: ['import', 'math', 'random', 'وحدات'],
        title: { ar: 'الوحدات والاستيراد', en: 'Modules and importing' },
        lede: { ar: 'بايثون تأتي بمكتبة ضخمة جاهزة. لا تعِد اختراع ما كُتب واختُبر قبلك بعشرين سنة.',
                en: 'Python ships with a vast standard library. Do not reinvent what was written and battle-tested twenty years ago.' },
        body: {
          ar: '<h2>ثلاث طرق للاستيراد</h2>' +
              '<pre><code>import math\nprint(math.sqrt(16))        # 4.0\n\nfrom math import sqrt\nprint(sqrt(16))             # بلا بادئة\n\nimport math as m\nprint(m.sqrt(16))           # باسم مختصر</code></pre>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>أيّها أفضل؟</b><code>import math</code> هو الأوضح لأن <code>math.sqrt</code> يخبر القارئ من أين جاءت الدالة. استخدم <code>from … import</code> لأسماء قليلة تتكرّر كثيراً، وتجنّب <code>from math import *</code> تماماً لأنها تُغرق مساحة الأسماء.</div></div>' +
              '<h2>math — الرياضيات</h2>' +
              '<pre><code>import math\n\nmath.sqrt(25)     # 5.0 الجذر\nmath.ceil(4.1)    # 5 تقريب لأعلى\nmath.floor(4.9)   # 4 تقريب لأسفل\nmath.pi           # 3.14159…\nmath.pow(2, 10)   # 1024.0</code></pre>' +
              '<h2>random — العشوائية</h2>' +
              '<pre><code>import random\n\nrandom.randint(1, 6)             # عدد صحيح من 1 إلى 6 شاملاً\nrandom.choice(["أ", "ب", "ج"])   # اختيار عنصر\nrandom.shuffle(my_list)          # خلط في المكان\nrandom.random()                  # كسر بين 0 و1</code></pre>' +
              '<h2>datetime — الوقت والتاريخ</h2>' +
              '<pre><code>from datetime import datetime, date\n\nnow = datetime.now()\nprint(now.year, now.month, now.day)\nprint(now.strftime("%Y-%m-%d"))\n\nbirthday = date(2000, 5, 15)\nage_days = (date.today() - birthday).days</code></pre>' +
              '<h2>وحدات أخرى ستحتاجها</h2>' +
              '<ul>' +
              '<li><code>json</code> — قراءة وكتابة بيانات JSON.</li>' +
              '<li><code>os</code> و<code>pathlib</code> — الملفات والمسارات.</li>' +
              '<li><code>statistics</code> — المتوسّط والوسيط والانحراف.</li>' +
              '<li><code>collections</code> — أنواع بيانات متقدّمة مثل <code>Counter</code>.</li>' +
              '</ul>' +
              '<h2>ملفّك وحدة أيضاً</h2>' +
              '<p>أي ملف <code>helpers.py</code> تكتبه يمكن استيراده: <code>import helpers</code> ثم <code>helpers.my_function()</code>. هكذا تُقسّم البرامج الكبيرة إلى ملفات.</p>',
          en: '<h2>Three ways to import</h2>' +
              '<pre><code>import math\nprint(math.sqrt(16))        # 4.0\n\nfrom math import sqrt\nprint(sqrt(16))             # no prefix\n\nimport math as m\nprint(m.sqrt(16))           # under a short alias</code></pre>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>Which is best?</b><code>import math</code> is clearest, because <code>math.sqrt</code> tells the reader where the function came from. Use <code>from … import</code> for a few heavily repeated names, and avoid <code>from math import *</code> entirely — it floods your namespace.</div></div>' +
              '<h2>math — mathematics</h2>' +
              '<pre><code>import math\n\nmath.sqrt(25)     # 5.0 square root\nmath.ceil(4.1)    # 5 round up\nmath.floor(4.9)   # 4 round down\nmath.pi           # 3.14159…\nmath.pow(2, 10)   # 1024.0</code></pre>' +
              '<h2>random — randomness</h2>' +
              '<pre><code>import random\n\nrandom.randint(1, 6)             # a whole number from 1 to 6 inclusive\nrandom.choice(["a", "b", "c"])   # pick one item\nrandom.shuffle(my_list)          # shuffle in place\nrandom.random()                  # a fraction between 0 and 1</code></pre>' +
              '<h2>datetime — dates and times</h2>' +
              '<pre><code>from datetime import datetime, date\n\nnow = datetime.now()\nprint(now.year, now.month, now.day)\nprint(now.strftime("%Y-%m-%d"))\n\nbirthday = date(2000, 5, 15)\nage_days = (date.today() - birthday).days</code></pre>' +
              '<h2>Other modules you will want</h2>' +
              '<ul>' +
              '<li><code>json</code> — reading and writing JSON data.</li>' +
              '<li><code>os</code> and <code>pathlib</code> — files and paths.</li>' +
              '<li><code>statistics</code> — mean, median, standard deviation.</li>' +
              '<li><code>collections</code> — advanced containers such as <code>Counter</code>.</li>' +
              '</ul>' +
              '<h2>Your own file is a module too</h2>' +
              '<p>Any <code>helpers.py</code> you write can be imported: <code>import helpers</code> then <code>helpers.my_function()</code>. This is how large programs get split across files.</p>'
        },
        example: {
          note: { ar: 'شغّل عدّة مرات — نتائج random ستتغيّر في كل مرة.',
                  en: 'Run it several times — the random results change on every run.' },
          code: {
            ar: 'import math\nimport random\nfrom datetime import date\n\nprint("الجذر التربيعي لـ 144:", math.sqrt(144))\nprint("تقريب لأعلى 4.1:", math.ceil(4.1))\nprint("قيمة π:", round(math.pi, 4))\n\nprint("رمية نرد:", random.randint(1, 6))\nprint("اختيار:", random.choice(["أحمر", "أخضر", "أزرق"]))\n\ntoday = date.today()\nprint("اليوم:", today)\nprint("السنة:", today.year)',
            en: 'import math\nimport random\nfrom datetime import date\n\nprint("square root of 144:", math.sqrt(144))\nprint("ceil of 4.1:", math.ceil(4.1))\nprint("pi:", round(math.pi, 4))\n\nprint("dice roll:", random.randint(1, 6))\nprint("pick:", random.choice(["red", "green", "blue"]))\n\ntoday = date.today()\nprint("today:", today)\nprint("year:", today.year)'
          }
        },
        challenge: {
          brief: { ar: 'استورد math و random. عرّف hypotenuse وتر مثلث ضلعاه 3 و4 باستخدام math.sqrt، و rolls قائمة من خمس رميات نرد عشوائية بين 1 و6، و rounded_pi قيمة π مقرّبة لثلاث خانات.',
                   en: 'Import math and random. Define hypotenuse for a triangle with sides 3 and 4 using math.sqrt, rolls as a list of five random dice rolls between 1 and 6, and rounded_pi as pi rounded to three decimals.' },
          starter: { ar: 'import math\nimport random\n\n# hypotenuse و rolls و rounded_pi\n',
                     en: 'import math\nimport random\n\n# hypotenuse, rolls and rounded_pi\n' },
          solution: { ar: 'import math\nimport random\n\nhypotenuse = math.sqrt(3 ** 2 + 4 ** 2)\nrolls = [random.randint(1, 6) for _ in range(5)]\nrounded_pi = round(math.pi, 3)\n\nprint("الوتر:", hypotenuse)\nprint("الرميات:", rolls)\nprint("π:", rounded_pi)',
                      en: 'import math\nimport random\n\nhypotenuse = math.sqrt(3 ** 2 + 4 ** 2)\nrolls = [random.randint(1, 6) for _ in range(5)]\nrounded_pi = round(math.pi, 3)\n\nprint("hypotenuse:", hypotenuse)\nprint("rolls:", rolls)\nprint("pi:", rounded_pi)' },
          checks: [
            { label: { ar: 'استوردت math و random', en: 'You imported math and random' },
              hint:  { ar: 'اكتب ‎import math‎ و ‎import random‎', en: 'Write import math and import random' },
              test: function (r) { return r.src(/import\s+math/) && r.src(/import\s+random/); } },
            { label: { ar: 'hypotenuse يساوي 5 عبر math.sqrt', en: 'hypotenuse equals 5 via math.sqrt' },
              hint:  { ar: 'الوتر = ‎sqrt(3² + 4²)‎', en: 'The hypotenuse is sqrt(3² + 4²)' },
              test: function (r) { return near(r.val('hypotenuse'), 5, 1e-9) && r.src(/math\.sqrt|\bsqrt\s*\(/); } },
            { label: { ar: 'rolls قائمة من خمس قيم بين 1 و6', en: 'rolls is a list of five values between 1 and 6' },
              hint:  { ar: 'استخدم ‎random.randint(1, 6)‎ خمس مرات', en: 'Use random.randint(1, 6) five times' },
              test: function (r) {
                var v = r.val('rolls');
                return Array.isArray(v) && v.length === 5 &&
                       v.every(function (n) { return Number.isInteger(n) && n >= 1 && n <= 6; });
              } },
            { label: { ar: 'rounded_pi يساوي 3.142', en: 'rounded_pi equals 3.142' },
              hint:  { ar: 'استخدم ‎round(math.pi, 3)‎', en: 'Use round(math.pi, 3)' },
              test: function (r) { return near(r.val('rounded_pi'), 3.142, 1e-9); } }
          ]
        },
        quiz: [
          { q: { ar: 'ما الفرق بين ‎import math‎ و ‎from math import sqrt‎؟', en: 'What differs between import math and from math import sqrt?' },
            options: [ { ar: 'لا فرق', en: 'No difference' },
                       { ar: 'الأولى تتطلّب البادئة math. والثانية لا', en: 'The first requires the math. prefix, the second does not' },
                       { ar: 'الثانية أبطأ', en: 'The second is slower' },
                       { ar: 'الأولى لا تعمل', en: 'The first does not work' } ],
            answer: 1,
            why: { ar: 'الاستيراد الكامل يبقي الاسم داخل الوحدة، والاستيراد الجزئي يجلبه لمساحتك.',
                   en: 'A full import keeps the name inside the module; a partial import brings it into your namespace.' } },
          { q: { ar: 'ماذا تُعيد ‎random.randint(1, 6)‎؟', en: 'What does random.randint(1, 6) return?' },
            options: [ { ar: 'عدداً من 1 إلى 5', en: 'A number from 1 to 5' }, { ar: 'عدداً من 1 إلى 6 شاملاً', en: 'A number from 1 to 6 inclusive' },
                       { ar: 'كسراً عشرياً', en: 'A decimal fraction' }, { ar: 'قائمة', en: 'A list' } ],
            answer: 1,
            why: { ar: 'randint تشمل الطرفين، بخلاف range التي تستثني النهاية.',
                   en: 'randint includes both endpoints, unlike range which excludes the stop value.' } },
          { q: { ar: 'لماذا يُنصح بتجنّب ‎from math import *‎؟', en: 'Why is from math import * discouraged?' },
            options: [ { ar: 'لأنها بطيئة جداً', en: 'It is very slow' },
                       { ar: 'لأنها تُغرق مساحة الأسماء وتُخفي مصدر كل دالة', en: 'It floods the namespace and hides where each function came from' },
                       { ar: 'لأنها خطأ نحوي', en: 'It is a syntax error' },
                       { ar: 'لأنها تستورد نصف الوحدة', en: 'It imports only half the module' } ],
            answer: 1,
            why: { ar: 'قد تتصادم الأسماء مع متغيّراتك ويصعب على القارئ معرفة مصدرها.',
                   en: 'Names can collide with your own variables, and readers cannot tell where anything came from.' } }
        ]
      },

      {
        id: 'files',
        minutes: 10, level: 'advanced',
        tags: ['files', 'ملفات', 'open'],
        title: { ar: 'قراءة الملفات وكتابتها', en: 'Reading and writing files' },
        lede: { ar: 'حتى الآن كل بياناتك تختفي عند انتهاء البرنامج. الملفات تجعلها تبقى.',
                en: 'Until now all your data vanishes when the program ends. Files make it persist.' },
        body: {
          ar: '<h2>الكتابة</h2>' +
              '<pre><code>with open("notes.txt", "w", encoding="utf-8") as f:\n    f.write("السطر الأول\\n")\n    f.write("السطر الثاني\\n")</code></pre>' +
              '<h2>القراءة</h2>' +
              '<pre><code>with open("notes.txt", "r", encoding="utf-8") as f:\n    content = f.read()\nprint(content)\n\n# سطراً سطراً — الأفضل للملفات الكبيرة\nwith open("notes.txt", encoding="utf-8") as f:\n    for line in f:\n        print(line.strip())</code></pre>' +
              '<h2>أوضاع الفتح</h2>' +
              '<table><thead><tr><th>الوضع</th><th>المعنى</th><th>تحذير</th></tr></thead><tbody>' +
              '<tr><td><code>"r"</code></td><td>قراءة (الافتراضي)</td><td>خطأ إن لم يوجد الملف</td></tr>' +
              '<tr><td><code>"w"</code></td><td>كتابة</td><td><b>يمسح المحتوى القديم كاملاً</b></td></tr>' +
              '<tr><td><code>"a"</code></td><td>إضافة في النهاية</td><td>آمن، لا يمسح</td></tr>' +
              '<tr><td><code>"x"</code></td><td>إنشاء جديد</td><td>خطأ إن كان موجوداً</td></tr>' +
              '</tbody></table>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>الوضع "w" يمسح كل شيء</b>فتح ملف موجود بوضع <code>"w"</code> يمحو محتواه فوراً قبل أن تكتب حرفاً. للإضافة استخدم <code>"a"</code>. هذا خطأ يكلّف بيانات حقيقية.</div></div>' +
              '<h2>لماذا with؟</h2>' +
              '<pre><code># ✗ الطريقة الهشّة\nf = open("data.txt")\ncontent = f.read()\nf.close()          # لن يُنفَّذ إن وقع خطأ قبله!\n\n# ✓ with يغلق دائماً\nwith open("data.txt") as f:\n    content = f.read()</code></pre>' +
              '<p><code>with</code> يضمن إغلاق الملف حتى لو وقع استثناء في المنتصف.</p>' +
              '<h2>encoding="utf-8" ليس اختيارياً</h2>' +
              '<p>بدونه قد تُقرأ النصوص العربية كرموز مشوّهة على بعض الأنظمة. اجعله عادة دائمة.</p>' +
              '<h2>التعامل مع ملف مفقود</h2>' +
              '<pre><code>try:\n    with open("missing.txt", encoding="utf-8") as f:\n        data = f.read()\nexcept FileNotFoundError:\n    data = ""\n    print("الملف غير موجود، بدأنا فارغين")</code></pre>' +
              '<div class="callout callout-note"><span class="ic">🐍</span><div><b>الملفات هنا مؤقّتة</b>بايثون في متصفحك تكتب في نظام ملفات وهمي داخل الذاكرة. كل شيء يعمل تماماً كالمعتاد، لكنه يختفي عند إعادة تحميل الصفحة — وهذا مثالي للتعلّم بلا مخاطر.</div></div>',
          en: '<h2>Writing</h2>' +
              '<pre><code>with open("notes.txt", "w", encoding="utf-8") as f:\n    f.write("first line\\n")\n    f.write("second line\\n")</code></pre>' +
              '<h2>Reading</h2>' +
              '<pre><code>with open("notes.txt", "r", encoding="utf-8") as f:\n    content = f.read()\nprint(content)\n\n# line by line — better for large files\nwith open("notes.txt", encoding="utf-8") as f:\n    for line in f:\n        print(line.strip())</code></pre>' +
              '<h2>Opening modes</h2>' +
              '<table><thead><tr><th>Mode</th><th>Meaning</th><th>Warning</th></tr></thead><tbody>' +
              '<tr><td><code>"r"</code></td><td>read (the default)</td><td>errors if the file is missing</td></tr>' +
              '<tr><td><code>"w"</code></td><td>write</td><td><b>erases all existing content</b></td></tr>' +
              '<tr><td><code>"a"</code></td><td>append</td><td>safe, erases nothing</td></tr>' +
              '<tr><td><code>"x"</code></td><td>create new</td><td>errors if it already exists</td></tr>' +
              '</tbody></table>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>Mode "w" wipes everything</b>Opening an existing file with <code>"w"</code> erases its contents immediately, before you write a single character. To add to a file use <code>"a"</code>. This mistake costs real data.</div></div>' +
              '<h2>Why with?</h2>' +
              '<pre><code># ✗ the fragile way\nf = open("data.txt")\ncontent = f.read()\nf.close()          # never runs if an error happens first!\n\n# ✓ with always closes\nwith open("data.txt") as f:\n    content = f.read()</code></pre>' +
              '<p><code>with</code> guarantees the file is closed even if an exception fires midway.</p>' +
              '<h2>encoding="utf-8" is not optional</h2>' +
              '<p>Without it, non-English text can come back as mangled symbols on some systems. Make it a permanent habit.</p>' +
              '<h2>Handling a missing file</h2>' +
              '<pre><code>try:\n    with open("missing.txt", encoding="utf-8") as f:\n        data = f.read()\nexcept FileNotFoundError:\n    data = ""\n    print("file not found, starting empty")</code></pre>' +
              '<div class="callout callout-note"><span class="ic">🐍</span><div><b>Files here are temporary</b>Python in your browser writes to a virtual in-memory filesystem. Everything behaves exactly as normal, but it disappears when you reload the page — which is ideal for risk-free practice.</div></div>'
        },
        example: {
          note: { ar: 'الملف يُنشأ في ذاكرة المتصفح فقط. جرّب تغيير الوضع من a إلى w وشاهد الفرق.',
                  en: 'The file lives only in browser memory. Try changing the mode from a to w and see the difference.' },
          code: {
            ar: '# الكتابة\nwith open("tasks.txt", "w", encoding="utf-8") as f:\n    f.write("مذاكرة\\n")\n    f.write("رياضة\\n")\n\n# الإضافة\nwith open("tasks.txt", "a", encoding="utf-8") as f:\n    f.write("قراءة\\n")\n\n# القراءة سطراً سطراً\nwith open("tasks.txt", encoding="utf-8") as f:\n    for i, line in enumerate(f, 1):\n        print(f"{i}. {line.strip()}")\n\n# ملف مفقود\ntry:\n    with open("nope.txt", encoding="utf-8") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print("الملف غير موجود — عولج بأمان ✓")',
            en: '# writing\nwith open("tasks.txt", "w", encoding="utf-8") as f:\n    f.write("study\\n")\n    f.write("sport\\n")\n\n# appending\nwith open("tasks.txt", "a", encoding="utf-8") as f:\n    f.write("reading\\n")\n\n# reading line by line\nwith open("tasks.txt", encoding="utf-8") as f:\n    for i, line in enumerate(f, 1):\n        print(f"{i}. {line.strip()}")\n\n# a missing file\ntry:\n    with open("nope.txt", encoding="utf-8") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print("file not found — handled safely ✓")'
          }
        },
        challenge: {
          brief: { ar: 'اكتب ثلاثة أسماء في ملف names.txt كل واحد في سطر باستخدام with ووضع الكتابة. ثم أعد فتحه للقراءة، واقرأ الأسماء في قائمة اسمها loaded (بلا فراغات ولا أسطر فارغة)، وعرّف name_count عددها.',
                   en: 'Write three names into names.txt, one per line, using with and write mode. Then reopen it for reading, load the names into a list called loaded (stripped, no blank lines), and define name_count as how many there are.' },
          starter: { ar: '# اكتب ثلاثة أسماء ثم اقرأها في loaded\n',
                     en: '# write three names then read them back into loaded\n' },
          solution: { ar: 'names = ["سارة", "أحمد", "ليلى"]\n\nwith open("names.txt", "w", encoding="utf-8") as f:\n    for name in names:\n        f.write(name + "\\n")\n\nloaded = []\nwith open("names.txt", encoding="utf-8") as f:\n    for line in f:\n        clean = line.strip()\n        if clean:\n            loaded.append(clean)\n\nname_count = len(loaded)\n\nprint(loaded)\nprint("العدد:", name_count)',
                      en: 'names = ["Sara", "Ahmed", "Layla"]\n\nwith open("names.txt", "w", encoding="utf-8") as f:\n    for name in names:\n        f.write(name + "\\n")\n\nloaded = []\nwith open("names.txt", encoding="utf-8") as f:\n    for line in f:\n        clean = line.strip()\n        if clean:\n            loaded.append(clean)\n\nname_count = len(loaded)\n\nprint(loaded)\nprint("Count:", name_count)' },
          checks: [
            { label: { ar: 'استخدمت with مع open', en: 'You used with together with open' },
              hint:  { ar: 'اكتب ‎with open(...) as f:‎', en: 'Write with open(...) as f:' },
              test: function (r) { return r.src(/with\s+open\s*\(/); } },
            { label: { ar: 'البرنامج يعمل بلا أخطاء', en: 'The program runs without errors' },
              hint:  { ar: 'اكتب الملف قبل أن تقرأه', en: 'Write the file before you read it' },
              test: function (r) { return r.ok; } },
            { label: { ar: 'loaded قائمة فيها ثلاثة نصوص', en: 'loaded is a list of three strings' },
              hint:  { ar: 'استخدم ‎line.strip()‎ وتجاهل الأسطر الفارغة', en: 'Use line.strip() and skip blank lines' },
              test: function (r) {
                var v = r.val('loaded');
                return Array.isArray(v) && v.length === 3 &&
                       v.every(function (s) { return typeof s === 'string' && s.length > 0 && s.indexOf('\n') < 0; });
              } },
            { label: { ar: 'name_count يساوي 3 وطُبعت النتيجة', en: 'name_count equals 3 and the result was printed' },
              hint:  { ar: 'استخدم ‎len(loaded)‎ ثم اطبع', en: 'Use len(loaded) then print' },
              test: function (r) { return r.val('name_count') === 3 && r.lines.length >= 1; } }
          ]
        },
        quiz: [
          { q: { ar: 'ماذا يفعل فتح ملف موجود بوضع "w"؟', en: 'What does opening an existing file in "w" mode do?' },
            options: [ { ar: 'يضيف في نهايته', en: 'Appends to the end' }, { ar: 'يمسح محتواه بالكامل', en: 'Erases its entire content' },
                       { ar: 'يقرأه فقط', en: 'Only reads it' }, { ar: 'يرفع خطأً', en: 'Raises an error' } ],
            answer: 1,
            why: { ar: 'وضع الكتابة يبدأ من ملف فارغ؛ استخدم "a" للإضافة الآمنة.',
                   en: 'Write mode starts from an empty file; use "a" to append safely.' } },
          { q: { ar: 'ما فائدة with عند فتح الملفات؟', en: 'What does with give you when opening files?' },
            options: [ { ar: 'يجعل القراءة أسرع', en: 'Faster reading' },
                       { ar: 'يضمن إغلاق الملف حتى عند وقوع خطأ', en: 'Guarantees the file closes even if an error occurs' },
                       { ar: 'يضغط الملف', en: 'Compresses the file' },
                       { ar: 'ينشئ الملف تلقائياً', en: 'Creates the file automatically' } ],
            answer: 1,
            why: { ar: 'يُغلق الملف عند مغادرة الكتلة مهما كان سبب المغادرة.',
                   en: 'It closes the file when the block exits, whatever the reason for exiting.' } },
          { q: { ar: 'أي خطأ يقع عند قراءة ملف غير موجود؟', en: 'Which error occurs when reading a file that does not exist?' },
            options: [ { ar: 'ValueError', en: 'ValueError' }, { ar: 'FileNotFoundError', en: 'FileNotFoundError' },
                       { ar: 'KeyError', en: 'KeyError' }, { ar: 'IndexError', en: 'IndexError' } ],
            answer: 1,
            why: { ar: 'يُلتقط بـ ‎except FileNotFoundError:‎ للتعامل معه بأمان.',
                   en: 'Catch it with except FileNotFoundError: to handle it gracefully.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 7 — الكائنات / Module 7 — Objects & classes
     =========================================================== */
  MODULES.push({
    id: 'oop',
    icon: '🏗️',
    title: { ar: 'الأصناف والكائنات', en: 'Classes and objects' },
    desc:  { ar: 'حين تكثر البيانات المترابطة مع سلوكها، تصير الأصناف الطريقة الطبيعية لتنظيم برنامجك.',
             en: 'When related data and behaviour pile up, classes become the natural way to organise your program.' },
    lessons: [

      {
        id: 'classes',
        minutes: 11, level: 'advanced',
        tags: ['class', 'صنف', 'object'],
        title: { ar: 'الصنف والكائن و __init__', en: 'Classes, objects and __init__' },
        lede: { ar: 'الصنف قالب، والكائن نسخة منه. فكرة واحدة تعيد تنظيم طريقة تفكيرك في البرامج الكبيرة.',
                en: 'A class is a blueprint; an object is one made from it. A single idea that reorganises how you think about larger programs.' },
        body: {
          ar: '<h2>المشكلة التي تحلّها الأصناف</h2>' +
              '<pre><code># بيانات الطالب متناثرة\nname1, grade1 = "سارة", 95\nname2, grade2 = "أحمد", 78\n\ndef describe(name, grade):\n    return f"{name}: {grade}"</code></pre>' +
              '<p>مع كل حقل جديد — العمر، المدينة، المواد — يزداد التشتّت. الصنف يجمع <strong>البيانات وسلوكها</strong> في وحدة واحدة.</p>' +
              '<h2>أول صنف</h2>' +
              '<pre><code>class Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n\n    def describe(self):\n        return f"{self.name}: {self.grade}"\n\nsara = Student("سارة", 95)\nprint(sara.name)         # سارة\nprint(sara.describe())   # سارة: 95</code></pre>' +
              '<h2>تشريح ما حدث</h2>' +
              '<ul>' +
              '<li><code>class Student:</code> — تعريف القالب. الاسم بصيغة <em>PascalCase</em> بالعُرف.</li>' +
              '<li><code>__init__</code> — «البانية»: تُستدعى تلقائياً عند إنشاء كائن جديد.</li>' +
              '<li><code>self</code> — إشارة إلى <em>هذا الكائن بالذات</em>.</li>' +
              '<li><code>self.name = name</code> — تخزين القيمة داخل الكائن لتبقى معه.</li>' +
              '<li><code>Student("سارة", 95)</code> — إنشاء كائن؛ لا تمرّر <code>self</code> فبايثون تمرّره عنك.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>ما هو self بالضبط؟</b>حين تكتب <code>sara.describe()</code> تحوّلها بايثون داخلياً إلى <code>Student.describe(sara)</code>. فـ<code>self</code> ليس سحراً — إنه ببساطة الكائن الذي نُوديت الدالة عليه. ولهذا يكون أول معامل في كل دالة داخل الصنف.</div></div>' +
              '<h2>كائنات مستقلّة تماماً</h2>' +
              '<pre><code>sara = Student("سارة", 95)\nahmad = Student("أحمد", 78)\n\nsara.grade = 97          # تغيير لا يمسّ أحمد\nprint(ahmad.grade)       # 78</code></pre>' +
              '<h2>قيم افتراضية في البانية</h2>' +
              '<pre><code>class Student:\n    def __init__(self, name, grade=0):\n        self.name = name\n        self.grade = grade\n        self.courses = []        # قائمة خاصّة بكل كائن</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>لا تنسَ <code>self</code></b>نسيان <code>self</code> في تعريف الدالة داخل الصنف يرفع <code>TypeError</code> غامضاً عند النداء. وكذلك <code>name = name</code> بدل <code>self.name = name</code> يجعل القيمة تختفي فور انتهاء البانية.</div></div>',
          en: '<h2>The problem classes solve</h2>' +
              '<pre><code># student data scattered around\nname1, grade1 = "Sara", 95\nname2, grade2 = "Ahmed", 78\n\ndef describe(name, grade):\n    return f"{name}: {grade}"</code></pre>' +
              '<p>Each new field — age, city, subjects — makes the scatter worse. A class bundles <strong>data and its behaviour</strong> into one unit.</p>' +
              '<h2>Your first class</h2>' +
              '<pre><code>class Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n\n    def describe(self):\n        return f"{self.name}: {self.grade}"\n\nsara = Student("Sara", 95)\nprint(sara.name)         # Sara\nprint(sara.describe())   # Sara: 95</code></pre>' +
              '<h2>Anatomy of what happened</h2>' +
              '<ul>' +
              '<li><code>class Student:</code> — defines the blueprint. Names use <em>PascalCase</em> by convention.</li>' +
              '<li><code>__init__</code> — the "constructor": called automatically when a new object is made.</li>' +
              '<li><code>self</code> — a reference to <em>this particular object</em>.</li>' +
              '<li><code>self.name = name</code> — stores the value inside the object so it persists.</li>' +
              '<li><code>Student("Sara", 95)</code> — creates an object; you never pass <code>self</code>, Python passes it for you.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>What exactly is self?</b>When you write <code>sara.describe()</code>, Python internally turns it into <code>Student.describe(sara)</code>. So <code>self</code> is not magic — it is simply the object the method was called on. That is why it is the first parameter of every method in a class.</div></div>' +
              '<h2>Objects are fully independent</h2>' +
              '<pre><code>sara = Student("Sara", 95)\nahmad = Student("Ahmed", 78)\n\nsara.grade = 97          # a change that never touches Ahmed\nprint(ahmad.grade)       # 78</code></pre>' +
              '<h2>Defaults in the constructor</h2>' +
              '<pre><code>class Student:\n    def __init__(self, name, grade=0):\n        self.name = name\n        self.grade = grade\n        self.courses = []        # a list unique to each object</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>Never forget <code>self</code></b>Omitting <code>self</code> from a method definition produces a cryptic <code>TypeError</code> on call. Likewise <code>name = name</code> instead of <code>self.name = name</code> makes the value vanish the moment the constructor ends.</div></div>'
        },
        example: {
          note: { ar: 'أنشئ كائناً ثالثاً وشاهد استقلاله عن البقية.',
                  en: 'Create a third object and watch how independent it is.' },
          code: {
            ar: 'class Student:\n    def __init__(self, name, grade=0):\n        self.name = name\n        self.grade = grade\n        self.courses = []\n\n    def add_course(self, course):\n        self.courses.append(course)\n\n    def describe(self):\n        return f"{self.name} — الدرجة {self.grade} — المواد {len(self.courses)}"\n\n\nsara = Student("سارة", 95)\nahmad = Student("أحمد", 78)\n\nsara.add_course("رياضيات")\nsara.add_course("فيزياء")\nahmad.add_course("برمجة")\n\nprint(sara.describe())\nprint(ahmad.describe())\nprint("قوائم منفصلة:", sara.courses, ahmad.courses)',
            en: 'class Student:\n    def __init__(self, name, grade=0):\n        self.name = name\n        self.grade = grade\n        self.courses = []\n\n    def add_course(self, course):\n        self.courses.append(course)\n\n    def describe(self):\n        return f"{self.name} — grade {self.grade} — {len(self.courses)} courses"\n\n\nsara = Student("Sara", 95)\nahmad = Student("Ahmed", 78)\n\nsara.add_course("maths")\nsara.add_course("physics")\nahmad.add_course("coding")\n\nprint(sara.describe())\nprint(ahmad.describe())\nprint("separate lists:", sara.courses, ahmad.courses)'
          }
        },
        challenge: {
          brief: { ar: 'عرّف صنفاً BankAccount ببانية تأخذ owner و balance (افتراضي 0)، ودالة deposit(amount) تزيد الرصيد وتُعيده، ودالة describe() تُعيد نصاً فيه اسم المالك والرصيد. أنشئ كائناً account وأودِع فيه 500.',
                   en: 'Define a class BankAccount with a constructor taking owner and balance (default 0), a method deposit(amount) that increases and returns the balance, and describe() returning text with the owner and balance. Create an object account and deposit 500 into it.' },
          starter: { ar: 'class BankAccount:\n    def __init__(self, owner, balance=0):\n        pass\n\n# أنشئ account وأودِع 500\n',
                     en: 'class BankAccount:\n    def __init__(self, owner, balance=0):\n        pass\n\n# create account and deposit 500\n' },
          solution: { ar: 'class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n        return self.balance\n\n    def describe(self):\n        return f"{self.owner}: {self.balance}"\n\n\naccount = BankAccount("سارة")\naccount.deposit(500)\nprint(account.describe())',
                      en: 'class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n        return self.balance\n\n    def describe(self):\n        return f"{self.owner}: {self.balance}"\n\n\naccount = BankAccount("Sara")\naccount.deposit(500)\nprint(account.describe())' },
          checks: [
            { label: { ar: 'عرّفت الصنف BankAccount', en: 'You defined the class BankAccount' },
              hint:  { ar: 'اكتب ‎class BankAccount:‎', en: 'Write class BankAccount:' },
              test: function (r) { return r.src(/class\s+BankAccount\s*[:(]/); } },
            { label: { ar: 'البانية تخزّن owner و balance في self', en: 'The constructor stores owner and balance on self' },
              hint:  { ar: 'اكتب ‎self.owner = owner‎ و ‎self.balance = balance‎', en: 'Write self.owner = owner and self.balance = balance' },
              test: function (r) {
                return r.src(/self\.owner\s*=/) && r.src(/self\.balance\s*=/);
              } },
            { label: { ar: 'account كائن من الصنف ورصيده 500', en: 'account is an instance and its balance is 500' },
              hint:  { ar: 'أنشئه بلا رصيد ثم أودِع 500', en: 'Create it with no balance, then deposit 500' },
              test: function (r) { return r.type('account') === 'BankAccount'; } },
            { label: { ar: 'deposit تزيد الرصيد فعلياً', en: 'deposit really increases the balance' },
              hint:  { ar: 'استخدم ‎self.balance += amount‎ ثم أعِده', en: 'Use self.balance += amount then return it' },
              test: function (r) {
                return r.src(/def\s+deposit\s*\(\s*self/) &&
                       r.src(/self\.balance\s*(\+=|=\s*self\.balance)/) &&
                       r.stdout.indexOf('500') >= 0;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'ما وظيفة ‎__init__‎؟', en: 'What is __init__ for?' },
            options: [ { ar: 'حذف الكائن', en: 'Deleting the object' },
                       { ar: 'تهيئة الكائن عند إنشائه', en: 'Setting up the object when it is created' },
                       { ar: 'طباعة الكائن', en: 'Printing the object' },
                       { ar: 'نسخ الصنف', en: 'Copying the class' } ],
            answer: 1,
            why: { ar: 'تُستدعى تلقائياً عند الإنشاء لتخزين القيم الأوّلية في الكائن.',
                   en: 'It is called automatically on creation to store the initial values on the object.' } },
          { q: { ar: 'ما الذي يشير إليه self؟', en: 'What does self refer to?' },
            options: [ { ar: 'الصنف نفسه', en: 'The class itself' }, { ar: 'الكائن الذي نُوديت الدالة عليه', en: 'The object the method was called on' },
                       { ar: 'الدالة', en: 'The method' }, { ar: 'الوحدة', en: 'The module' } ],
            answer: 1,
            why: { ar: '‎sara.describe()‎ تكافئ ‎Student.describe(sara)‎، فـ self هو sara.',
                   en: 'sara.describe() is equivalent to Student.describe(sara), so self is sara.' } },
          { q: { ar: 'لماذا نكتب ‎self.name = name‎ بدل ‎name = name‎؟', en: 'Why write self.name = name rather than name = name?' },
            options: [ { ar: 'لا فرق', en: 'No difference' },
                       { ar: 'لأن الثانية متغيّر محلّي يختفي بانتهاء البانية', en: 'The second is a local variable that vanishes when the constructor ends' },
                       { ar: 'لأن الأولى أسرع', en: 'The first is faster' },
                       { ar: 'لأن بايثون تطلب ذلك نحوياً', en: 'Python requires it syntactically' } ],
            answer: 1,
            why: { ar: 'التخزين على self يجعل القيمة جزءاً من الكائن ويبقيها بعد انتهاء الدالة.',
                   en: 'Storing on self makes the value part of the object so it survives the method call.' } }
        ]
      },

      {
        id: 'inheritance',
        minutes: 10, level: 'advanced',
        tags: ['inheritance', 'وراثة', 'super'],
        title: { ar: 'الوراثة وإعادة استخدام الأصناف', en: 'Inheritance and reusing classes' },
        lede: { ar: 'صنف يبني على صنف آخر فيرث كل ما فيه ويضيف عليه. أقوى أدوات إعادة الاستخدام.',
                en: 'A class built on another, inheriting everything and adding more. The most powerful reuse tool there is.' },
        body: {
          ar: '<h2>الفكرة</h2>' +
              '<pre><code>class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return "صوت ما"\n\n\nclass Dog(Animal):          # Dog يرث من Animal\n    def speak(self):        # ويستبدل هذه الدالة\n        return "هاو هاو"\n\n\nd = Dog("ريكس")\nprint(d.name)      # ريكس — موروثة من Animal\nprint(d.speak())   # هاو هاو — النسخة الخاصة بـ Dog</code></pre>' +
              '<p>الاسم بين القوسين هو <em>الصنف الأب</em>. الابن يحصل مجاناً على كل دوال الأب وخصائصه.</p>' +
              '<h2>super(): استدعاء الأب</h2>' +
              '<pre><code>class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n\nclass Manager(Employee):\n    def __init__(self, name, salary, team_size):\n        super().__init__(name, salary)   # لا تكرّر عمل الأب\n        self.team_size = team_size</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>لماذا <code>super()</code> لا نسخ ولصق؟</b>لأنك لو نسخت أسطر الأب ثم تغيّر الأب لاحقاً، لبقي الابن على النسخة القديمة. <code>super()</code> يبقيهما مرتبطين دائماً.</div></div>' +
              '<h2>إعادة التعريف (override)</h2>' +
              '<p>عرّف دالة بنفس الاسم في الابن لتحلّ محلّ نسخة الأب. وإن أردت أن تبني عليها بدل استبدالها:</p>' +
              '<pre><code>class Manager(Employee):\n    def describe(self):\n        base = super().describe()\n        return base + f" — يقود {self.team_size} أشخاص"</code></pre>' +
              '<h2>isinstance مع الوراثة</h2>' +
              '<pre><code>d = Dog("ريكس")\nprint(isinstance(d, Dog))      # True\nprint(isinstance(d, Animal))   # True — الكلب حيوان أيضاً</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>اختبار «هو نوع من»</b>لا ترث إلا حين تكون العلاقة حقيقية: الكلب <em>هو</em> حيوان، والمدير <em>هو</em> موظّف. لكن السيارة ليست محرّكاً — بل <em>تملك</em> محرّكاً. في حالة «يملك» استخدم خاصية بداخل الكائن لا وراثة.</div></div>' +
              '<h2>تعدّد الأشكال</h2>' +
              '<pre><code>for animal in [Dog("ريكس"), Cat("مشمش")]:\n    print(animal.speak())   # كل واحد ينفّذ نسخته</code></pre>' +
              '<p>الحلقة لا تعرف نوع كل كائن ولا تحتاج — كلٌّ يعرف كيف ينطق. هذا هو <em>تعدّد الأشكال</em>، وهو ما يجعل الوراثة مفيدة فعلاً.</p>',
          en: '<h2>The idea</h2>' +
              '<pre><code>class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return "some sound"\n\n\nclass Dog(Animal):          # Dog inherits from Animal\n    def speak(self):        # and replaces this method\n        return "Woof"\n\n\nd = Dog("Rex")\nprint(d.name)      # Rex — inherited from Animal\nprint(d.speak())   # Woof — Dog\'s own version</code></pre>' +
              '<p>The name in brackets is the <em>parent class</em>. The child gets all of the parent\'s methods and attributes for free.</p>' +
              '<h2>super(): calling the parent</h2>' +
              '<pre><code>class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n\nclass Manager(Employee):\n    def __init__(self, name, salary, team_size):\n        super().__init__(name, salary)   # do not repeat the parent\'s work\n        self.team_size = team_size</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>Why <code>super()</code> instead of copy-paste?</b>Because if you copied the parent\'s lines and the parent later changed, the child would be stuck on the old version. <code>super()</code> keeps them linked forever.</div></div>' +
              '<h2>Overriding</h2>' +
              '<p>Define a method with the same name in the child to replace the parent\'s. And to build on it rather than replace it:</p>' +
              '<pre><code>class Manager(Employee):\n    def describe(self):\n        base = super().describe()\n        return base + f" — leads {self.team_size} people"</code></pre>' +
              '<h2>isinstance and inheritance</h2>' +
              '<pre><code>d = Dog("Rex")\nprint(isinstance(d, Dog))      # True\nprint(isinstance(d, Animal))   # True — a dog is an animal too</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>The "is a" test</b>Only inherit when the relationship is genuine: a dog <em>is</em> an animal, a manager <em>is</em> an employee. But a car is not an engine — it <em>has</em> an engine. For "has a", store an attribute inside the object rather than inheriting.</div></div>' +
              '<h2>Polymorphism</h2>' +
              '<pre><code>for animal in [Dog("Rex"), Cat("Misha")]:\n    print(animal.speak())   # each runs its own version</code></pre>' +
              '<p>The loop does not know each object\'s type and does not need to — each one knows how to speak. This is <em>polymorphism</em>, and it is what makes inheritance genuinely useful.</p>'
        },
        example: {
          note: { ar: 'أضف صنفاً ثالثاً يرث من Employee وشاهد الحلقة تتعامل معه بلا تعديل.',
                  en: 'Add a third class inheriting from Employee and watch the loop handle it with no changes.' },
          code: {
            ar: 'class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def describe(self):\n        return f"{self.name} — الراتب {self.salary}"\n\n\nclass Manager(Employee):\n    def __init__(self, name, salary, team_size):\n        super().__init__(name, salary)\n        self.team_size = team_size\n\n    def describe(self):\n        base = super().describe()\n        return base + f" — يقود {self.team_size} أشخاص"\n\n\nstaff = [\n    Employee("سارة", 8000),\n    Manager("أحمد", 15000, 5)\n]\n\nfor person in staff:\n    print(person.describe())\n\nprint(isinstance(staff[1], Employee))',
            en: 'class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def describe(self):\n        return f"{self.name} — salary {self.salary}"\n\n\nclass Manager(Employee):\n    def __init__(self, name, salary, team_size):\n        super().__init__(name, salary)\n        self.team_size = team_size\n\n    def describe(self):\n        base = super().describe()\n        return base + f" — leads {self.team_size} people"\n\n\nstaff = [\n    Employee("Sara", 8000),\n    Manager("Ahmed", 15000, 5)\n]\n\nfor person in staff:\n    print(person.describe())\n\nprint(isinstance(staff[1], Employee))'
          }
        },
        challenge: {
          brief: { ar: 'عرّف صنفاً Shape ببانية تأخذ name ودالة area() تُعيد 0. ثم عرّف Circle يرث منه، بانيته تأخذ radius وتستدعي super().__init__("دائرة")، ودالة area() تُعيد 3.14159 × نصف القطر². أنشئ كائناً c بنصف قطر 2.',
                   en: 'Define a class Shape with a constructor taking name and an area() method returning 0. Then define Circle inheriting from it, whose constructor takes radius and calls super().__init__("circle"), with area() returning 3.14159 × radius². Create an object c with radius 2.' },
          starter: { ar: 'class Shape:\n    def __init__(self, name):\n        pass\n\n    def area(self):\n        return 0\n\n\n# عرّف Circle يرث من Shape\n',
                     en: 'class Shape:\n    def __init__(self, name):\n        pass\n\n    def area(self):\n        return 0\n\n\n# define Circle inheriting from Shape\n' },
          solution: { ar: 'class Shape:\n    def __init__(self, name):\n        self.name = name\n\n    def area(self):\n        return 0\n\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        super().__init__("دائرة")\n        self.radius = radius\n\n    def area(self):\n        return 3.14159 * self.radius ** 2\n\n\nc = Circle(2)\nprint(c.name)\nprint(c.area())',
                      en: 'class Shape:\n    def __init__(self, name):\n        self.name = name\n\n    def area(self):\n        return 0\n\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        super().__init__("circle")\n        self.radius = radius\n\n    def area(self):\n        return 3.14159 * self.radius ** 2\n\n\nc = Circle(2)\nprint(c.name)\nprint(c.area())' },
          checks: [
            { label: { ar: 'Circle يرث من Shape', en: 'Circle inherits from Shape' },
              hint:  { ar: 'اكتب ‎class Circle(Shape):‎', en: 'Write class Circle(Shape):' },
              test: function (r) { return r.src(/class\s+Circle\s*\(\s*Shape\s*\)/); } },
            { label: { ar: 'استدعيت super() في البانية', en: 'You called super() in the constructor' },
              hint:  { ar: 'اكتب ‎super().__init__("دائرة")‎', en: 'Write super().__init__("circle")' },
              test: function (r) { return r.src(/super\s*\(\s*\)\s*\.\s*__init__/); } },
            { label: { ar: 'c كائن من Circle وله الخاصية name الموروثة', en: 'c is a Circle and carries the inherited name attribute' },
              hint:  { ar: 'أنشئ ‎c = Circle(2)‎ بعد تعريف الصنفين', en: 'Create c = Circle(2) after defining both classes' },
              test: function (r) { return r.type('c') === 'Circle'; } },
            { label: { ar: 'area() تُعيد نحو 12.566 لنصف قطر 2', en: 'area() returns about 12.566 for radius 2' },
              hint:  { ar: 'أعِد ‎3.14159 * self.radius ** 2‎', en: 'Return 3.14159 * self.radius ** 2' },
              test: function (r) { return /12\.56/.test(r.stdout); } }
          ]
        },
        quiz: [
          { q: { ar: 'ماذا يفعل ‎super().__init__(...)‎؟', en: 'What does super().__init__(...) do?' },
            options: [ { ar: 'ينشئ كائناً جديداً', en: 'Creates a new object' },
                       { ar: 'يستدعي بانية الصنف الأب', en: 'Calls the parent class constructor' },
                       { ar: 'يحذف الوراثة', en: 'Removes the inheritance' },
                       { ar: 'يطبع الصنف', en: 'Prints the class' } ],
            answer: 1,
            why: { ar: 'يتيح للابن الاستفادة من تهيئة الأب بلا تكرار كوده.',
                   en: 'It lets the child reuse the parent\'s setup without duplicating its code.' } },
          { q: { ar: 'متى تكون الوراثة الخيار الصحيح؟', en: 'When is inheritance the right choice?' },
            options: [ { ar: 'حين تكون العلاقة «يملك»', en: 'When the relationship is "has a"' },
                       { ar: 'حين تكون العلاقة «هو نوع من»', en: 'When the relationship is "is a"' },
                       { ar: 'دائماً', en: 'Always' }, { ar: 'أبداً', en: 'Never' } ],
            answer: 1,
            why: { ar: 'المدير هو موظّف فترث؛ أما السيارة فتملك محرّكاً فتُخزّنه خاصيةً.',
                   en: 'A manager is an employee, so inherit; a car has an engine, so store it as an attribute.' } },
          { q: { ar: 'ما ناتج ‎isinstance(dog, Animal)‎ إن كان ‎Dog(Animal)‎؟', en: 'What is isinstance(dog, Animal) when Dog inherits Animal?' },
            options: [ { ar: 'False', en: 'False' }, { ar: 'True', en: 'True' }, { ar: 'خطأ', en: 'An error' }, { ar: 'None', en: 'None' } ],
            answer: 1,
            why: { ar: 'الكائن يُعدّ نسخة من صنفه ومن كل أصنافه الأعلى في سلسلة الوراثة.',
                   en: 'An object is an instance of its own class and of every ancestor in its inheritance chain.' } }
        ]
      },

      {
        id: 'dunder',
        minutes: 9, level: 'advanced',
        tags: ['__str__', 'dunder', 'magic'],
        title: { ar: 'الدوال الخاصة: __str__ وأخواتها', en: 'Special methods: __str__ and friends' },
        lede: { ar: 'دوال بأسماء محاطة بشرطتين تجعل كائناتك تتصرّف كأنواع بايثون الأصلية.',
                en: 'Methods with double-underscore names make your objects behave like Python\'s own built-in types.' },
        body: {
          ar: '<h2>المشكلة</h2>' +
              '<pre><code>class Student:\n    def __init__(self, name):\n        self.name = name\n\nprint(Student("سارة"))\n# &lt;__main__.Student object at 0x7f8b1c&gt;   ← غير مفيد إطلاقاً</code></pre>' +
              '<h2>الحلّ: __str__</h2>' +
              '<pre><code>class Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n\n    def __str__(self):\n        return f"الطالب {self.name} ({self.grade})"\n\nprint(Student("سارة", 95))   # الطالب سارة (95)</code></pre>' +
              '<p>تُستدعى تلقائياً عند <code>print()</code> أو <code>str()</code>.</p>' +
              '<h2>__len__ و __eq__</h2>' +
              '<pre><code>class Team:\n    def __init__(self, members):\n        self.members = members\n\n    def __len__(self):\n        return len(self.members)\n\n    def __eq__(self, other):\n        return self.members == other.members\n\n\nt = Team(["سارة", "أحمد"])\nprint(len(t))            # 2 — لأننا عرّفنا __len__\nprint(t == Team(["سارة", "أحمد"]))   # True</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>لماذا تُسمّى «سحرية»؟</b>لأنك لا تناديها مباشرة أبداً. تكتب <code>len(t)</code> فتستدعي بايثون <code>t.__len__()</code> نيابةً عنك. أنت تُعرّف <em>كيف يتصرّف كائنك</em> مع أدوات اللغة القياسية.</div></div>' +
              '<h2>الدوال الخاصة الأكثر فائدة</h2>' +
              '<table><thead><tr><th>الدالة</th><th>تُستدعى عند</th></tr></thead><tbody>' +
              '<tr><td><code>__init__</code></td><td>الإنشاء</td></tr>' +
              '<tr><td><code>__str__</code></td><td><code>print(x)</code> و<code>str(x)</code></td></tr>' +
              '<tr><td><code>__repr__</code></td><td>العرض في المفسّر والتصحيح</td></tr>' +
              '<tr><td><code>__len__</code></td><td><code>len(x)</code></td></tr>' +
              '<tr><td><code>__eq__</code></td><td><code>x == y</code></td></tr>' +
              '<tr><td><code>__lt__</code></td><td><code>x &lt; y</code> و<code>sorted()</code></td></tr>' +
              '<tr><td><code>__contains__</code></td><td><code>item in x</code></td></tr>' +
              '<tr><td><code>__getitem__</code></td><td><code>x[0]</code></td></tr>' +
              '</tbody></table>' +
              '<h2>__lt__ يجعل كائناتك قابلة للترتيب</h2>' +
              '<pre><code>class Student:\n    def __lt__(self, other):\n        return self.grade &lt; other.grade\n\nprint(sorted(students))   # يعمل الآن مباشرة</code></pre>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>لا تُفرط</b>عرّف من هذه الدوال ما يخدم معنى كائنك فعلاً. <code>__str__</code> شبه دائمة الفائدة؛ أما البقية فأضفها حين تكون العملية منطقية على كائنك.</div></div>',
          en: '<h2>The problem</h2>' +
              '<pre><code>class Student:\n    def __init__(self, name):\n        self.name = name\n\nprint(Student("Sara"))\n# &lt;__main__.Student object at 0x7f8b1c&gt;   ← completely useless</code></pre>' +
              '<h2>The fix: __str__</h2>' +
              '<pre><code>class Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n\n    def __str__(self):\n        return f"Student {self.name} ({self.grade})"\n\nprint(Student("Sara", 95))   # Student Sara (95)</code></pre>' +
              '<p>It is called automatically by <code>print()</code> and <code>str()</code>.</p>' +
              '<h2>__len__ and __eq__</h2>' +
              '<pre><code>class Team:\n    def __init__(self, members):\n        self.members = members\n\n    def __len__(self):\n        return len(self.members)\n\n    def __eq__(self, other):\n        return self.members == other.members\n\n\nt = Team(["Sara", "Ahmed"])\nprint(len(t))            # 2 — because we defined __len__\nprint(t == Team(["Sara", "Ahmed"]))   # True</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>Why "magic" methods?</b>Because you never call them directly. You write <code>len(t)</code> and Python calls <code>t.__len__()</code> on your behalf. You are defining <em>how your object behaves</em> with the language\'s standard tools.</div></div>' +
              '<h2>The most useful special methods</h2>' +
              '<table><thead><tr><th>Method</th><th>Called by</th></tr></thead><tbody>' +
              '<tr><td><code>__init__</code></td><td>creation</td></tr>' +
              '<tr><td><code>__str__</code></td><td><code>print(x)</code> and <code>str(x)</code></td></tr>' +
              '<tr><td><code>__repr__</code></td><td>the interpreter and debugging output</td></tr>' +
              '<tr><td><code>__len__</code></td><td><code>len(x)</code></td></tr>' +
              '<tr><td><code>__eq__</code></td><td><code>x == y</code></td></tr>' +
              '<tr><td><code>__lt__</code></td><td><code>x &lt; y</code> and <code>sorted()</code></td></tr>' +
              '<tr><td><code>__contains__</code></td><td><code>item in x</code></td></tr>' +
              '<tr><td><code>__getitem__</code></td><td><code>x[0]</code></td></tr>' +
              '</tbody></table>' +
              '<h2>__lt__ makes your objects sortable</h2>' +
              '<pre><code>class Student:\n    def __lt__(self, other):\n        return self.grade &lt; other.grade\n\nprint(sorted(students))   # now works directly</code></pre>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>Do not overdo it</b>Define only the ones that genuinely fit your object\'s meaning. <code>__str__</code> is almost always worth having; add the rest when the operation actually makes sense for your type.</div></div>'
        },
        example: {
          note: { ar: 'احذف __str__ وشغّل لترى الفرق في الطباعة.',
                  en: 'Delete __str__ and run to see the difference in printing.' },
          code: {
            ar: 'class Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\n    def __str__(self):\n        return f"{self.name} — {self.price} ريال"\n\n    def __lt__(self, other):\n        return self.price < other.price\n\n    def __eq__(self, other):\n        return self.price == other.price\n\n\nitems = [\n    Product("حقيبة", 120),\n    Product("قلم", 8),\n    Product("دفتر", 25)\n]\n\nfor p in sorted(items):\n    print(p)\n\nprint("الأرخص:", min(items))\nprint("متساويان؟", Product("أ", 10) == Product("ب", 10))',
            en: 'class Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\n    def __str__(self):\n        return f"{self.name} — {self.price} SAR"\n\n    def __lt__(self, other):\n        return self.price < other.price\n\n    def __eq__(self, other):\n        return self.price == other.price\n\n\nitems = [\n    Product("bag", 120),\n    Product("pen", 8),\n    Product("notebook", 25)\n]\n\nfor p in sorted(items):\n    print(p)\n\nprint("cheapest:", min(items))\nprint("equal?", Product("a", 10) == Product("b", 10))'
          }
        },
        challenge: {
          brief: { ar: 'عرّف صنفاً Playlist ببانية تأخذ title وقائمة songs. أضف __str__ تُعيد نصاً فيه العنوان وعدد الأغاني، و__len__ تُعيد عدد الأغاني، و__contains__ تتيح ‎"اسم" in playlist‎. أنشئ كائناً pl فيه ثلاث أغانٍ واطبعه.',
                   en: 'Define a class Playlist with a constructor taking title and a songs list. Add __str__ returning text with the title and song count, __len__ returning the number of songs, and __contains__ so that "name" in playlist works. Create pl with three songs and print it.' },
          starter: { ar: 'class Playlist:\n    def __init__(self, title, songs):\n        pass\n\n# أنشئ pl بثلاث أغانٍ واطبعه\n',
                     en: 'class Playlist:\n    def __init__(self, title, songs):\n        pass\n\n# create pl with three songs and print it\n' },
          solution: { ar: 'class Playlist:\n    def __init__(self, title, songs):\n        self.title = title\n        self.songs = songs\n\n    def __str__(self):\n        return f"{self.title} — {len(self.songs)} أغانٍ"\n\n    def __len__(self):\n        return len(self.songs)\n\n    def __contains__(self, song):\n        return song in self.songs\n\n\npl = Playlist("المفضّلة", ["أ", "ب", "ج"])\nprint(pl)\nprint(len(pl))\nprint("ب" in pl)',
                      en: 'class Playlist:\n    def __init__(self, title, songs):\n        self.title = title\n        self.songs = songs\n\n    def __str__(self):\n        return f"{self.title} — {len(self.songs)} songs"\n\n    def __len__(self):\n        return len(self.songs)\n\n    def __contains__(self, song):\n        return song in self.songs\n\n\npl = Playlist("Favourites", ["a", "b", "c"])\nprint(pl)\nprint(len(pl))\nprint("b" in pl)' },
          checks: [
            { label: { ar: 'عرّفت __str__ و __len__ و __contains__', en: 'You defined __str__, __len__ and __contains__' },
              hint:  { ar: 'ثلاث دوال خاصة داخل الصنف', en: 'Three special methods inside the class' },
              test: function (r) {
                return r.src(/def\s+__str__/) && r.src(/def\s+__len__/) && r.src(/def\s+__contains__/);
              } },
            { label: { ar: 'pl كائن من Playlist', en: 'pl is a Playlist instance' },
              hint:  { ar: 'أنشئه بعنوان وقائمة من ثلاث أغانٍ', en: 'Create it with a title and a list of three songs' },
              test: function (r) { return r.type('pl') === 'Playlist'; } },
            { label: { ar: 'الطباعة تعرض نصاً مفيداً لا عنوان ذاكرة', en: 'Printing shows useful text, not a memory address' },
              hint:  { ar: 'أعِد نصاً من __str__ فيه العنوان', en: 'Return text from __str__ including the title' },
              test: function (r) { return r.ok && r.stdout.indexOf('object at') < 0 && r.stdout.length > 0; } },
            { label: { ar: 'len(pl) يعطي 3 و in تعمل', en: 'len(pl) gives 3 and in works' },
              hint:  { ar: 'اطبع ‎len(pl)‎ ونتيجة اختبار الاحتواء', en: 'Print len(pl) and a membership test' },
              test: function (r) { return r.stdout.indexOf('3') >= 0 && r.prints('True'); } }
          ]
        },
        quiz: [
          { q: { ar: 'متى تُستدعى ‎__str__‎؟', en: 'When is __str__ called?' },
            options: [ { ar: 'عند إنشاء الكائن', en: 'When the object is created' },
                       { ar: 'عند ‎print(x)‎ أو ‎str(x)‎', en: 'On print(x) or str(x)' },
                       { ar: 'عند حذف الكائن', en: 'When the object is deleted' },
                       { ar: 'عند المقارنة', en: 'On comparison' } ],
            answer: 1,
            why: { ar: 'تحدّد كيف يُعرض كائنك كنصّ للإنسان.',
                   en: 'It defines how your object is rendered as human-readable text.' } },
          { q: { ar: 'أي دالة تجعل ‎len(x)‎ يعمل على كائنك؟', en: 'Which method makes len(x) work on your object?' },
            options: [ { ar: '__size__', en: '__size__' }, { ar: '__len__', en: '__len__' },
                       { ar: '__count__', en: '__count__' }, { ar: '__length__', en: '__length__' } ],
            answer: 1,
            why: { ar: 'بايثون تستدعي ‎x.__len__()‎ خلف الكواليس عند ‎len(x)‎.',
                   en: 'Python calls x.__len__() behind the scenes when you write len(x).' } },
          { q: { ar: 'أي دالة تُمكّن ‎sorted()‎ من ترتيب كائناتك؟', en: 'Which method lets sorted() order your objects?' },
            options: [ { ar: '__sort__', en: '__sort__' }, { ar: '__lt__', en: '__lt__' },
                       { ar: '__order__', en: '__order__' }, { ar: '__cmp__', en: '__cmp__' } ],
            answer: 1,
            why: { ar: 'الترتيب يعتمد على المقارنة «أصغر من» التي تُعرّفها ‎__lt__‎.',
                   en: 'Sorting relies on the "less than" comparison, which __lt__ defines.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     الوحدة 8 — الاحتراف / Module 8 — Going pro
     =========================================================== */
  MODULES.push({
    id: 'pro',
    icon: '🎓',
    title: { ar: 'الاحتراف: كود يقرأه البشر', en: 'Going pro: code humans can read' },
    desc:  { ar: 'الفرق بين من يعرف بايثون ومن يُتقنها: الاختصارات البايثونية، والأسلوب النظيف، والاختبار.',
             en: 'What separates knowing Python from being good at it: idiomatic shortcuts, clean style, and testing.' },
    lessons: [

      {
        id: 'comprehensions',
        minutes: 9, level: 'advanced',
        tags: ['comprehension', 'اختصار'],
        title: { ar: 'اختصارات القوائم والقواميس', en: 'List and dictionary comprehensions' },
        lede: { ar: 'أشهر تركيب بايثوني على الإطلاق: ثلاثة أسطر تتحوّل إلى سطر واحد أوضح منها.',
                en: 'The single most recognisable Python idiom: three lines becoming one that reads better than all three.' },
        body: {
          ar: '<h2>من حلقة إلى سطر</h2>' +
              '<pre><code># الطريقة الطويلة\nsquares = []\nfor n in range(1, 6):\n    squares.append(n ** 2)\n\n# الاختصار\nsquares = [n ** 2 for n in range(1, 6)]\nprint(squares)   # [1, 4, 9, 16, 25]</code></pre>' +
              '<p>اقرأها: «<em>مربّع n</em>، لكل <em>n</em> في <em>المدى</em>».</p>' +
              '<h2>مع شرط</h2>' +
              '<pre><code>evens = [n for n in range(1, 11) if n % 2 == 0]\nprint(evens)   # [2, 4, 6, 8, 10]</code></pre>' +
              '<p>الصيغة الكاملة: <code>[التعبير for العنصر in المجموعة if الشرط]</code></p>' +
              '<h2>أمثلة عملية</h2>' +
              '<pre><code>names = ["  سارة ", "أحمد  "]\nclean = [n.strip() for n in names]\n\nprices = [100, 250, 80]\nwith_tax = [round(p * 1.15, 2) for p in prices]\n\nstudents = [{"name": "سارة", "grade": 95}, {"name": "أحمد", "grade": 55}]\npassed = [s["name"] for s in students if s["grade"] >= 60]</code></pre>' +
              '<h2>اختصار القواميس</h2>' +
              '<pre><code>words = ["بايثون", "كود"]\nlengths = {w: len(w) for w in words}\nprint(lengths)   # {\'بايثون\': 6, \'كود\': 3}</code></pre>' +
              '<h2>اختصار المجموعات</h2>' +
              '<pre><code>unique_lengths = {len(w) for w in words}</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>حدّ الوضوح</b>الاختصار أداة للوضوح لا للاستعراض. إن احتوى شرطين متداخلين وحلقتين فقد صار أسوأ من الحلقة العادية. القاعدة: إن لم تفهمه بنظرة واحدة، فاكتبه حلقة.</div></div>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>لماذا يُفضَّل على map وfilter؟</b><code>[x * 2 for x in nums]</code> يُقرأ من اليسار لليمين كجملة. <code>list(map(lambda x: x * 2, nums))</code> يطلب منك فكّ ثلاث طبقات. الأول هو الأسلوب البايثوني المعتمد.</div></div>',
          en: '<h2>From a loop to one line</h2>' +
              '<pre><code># the long way\nsquares = []\nfor n in range(1, 6):\n    squares.append(n ** 2)\n\n# the comprehension\nsquares = [n ** 2 for n in range(1, 6)]\nprint(squares)   # [1, 4, 9, 16, 25]</code></pre>' +
              '<p>Read it as: "<em>n squared</em>, for each <em>n</em> in <em>the range</em>".</p>' +
              '<h2>With a condition</h2>' +
              '<pre><code>evens = [n for n in range(1, 11) if n % 2 == 0]\nprint(evens)   # [2, 4, 6, 8, 10]</code></pre>' +
              '<p>The full form: <code>[expression for item in collection if condition]</code></p>' +
              '<h2>Practical examples</h2>' +
              '<pre><code>names = ["  Sara ", "Ahmed  "]\nclean = [n.strip() for n in names]\n\nprices = [100, 250, 80]\nwith_tax = [round(p * 1.15, 2) for p in prices]\n\nstudents = [{"name": "Sara", "grade": 95}, {"name": "Ahmed", "grade": 55}]\npassed = [s["name"] for s in students if s["grade"] >= 60]</code></pre>' +
              '<h2>Dictionary comprehensions</h2>' +
              '<pre><code>words = ["python", "code"]\nlengths = {w: len(w) for w in words}\nprint(lengths)   # {\'python\': 6, \'code\': 4}</code></pre>' +
              '<h2>Set comprehensions</h2>' +
              '<pre><code>unique_lengths = {len(w) for w in words}</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>The clarity limit</b>A comprehension is a tool for clarity, not for showing off. Once it holds two nested conditions and two loops it has become worse than the plain loop. The rule: if you cannot read it at a glance, write the loop.</div></div>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>Why is it preferred over map and filter?</b><code>[x * 2 for x in nums]</code> reads left to right as a sentence. <code>list(map(lambda x: x * 2, nums))</code> asks you to unwrap three layers. The first is the accepted Pythonic style.</div></div>'
        },
        example: {
          note: { ar: 'قارن الطريقتين — النتيجة واحدة والوضوح مختلف.',
                  en: 'Compare the two approaches — same result, different clarity.' },
          code: {
            ar: 'students = [\n    {"name": "سارة", "grade": 95},\n    {"name": "أحمد", "grade": 55},\n    {"name": "ليلى", "grade": 78}\n]\n\n# الناجحون\npassed = [s["name"] for s in students if s["grade"] >= 60]\nprint("الناجحون:", passed)\n\n# قاموس: الاسم → الدرجة\ngrades = {s["name"]: s["grade"] for s in students}\nprint(grades)\n\n# مربّعات الأعداد الفردية\nodd_squares = [n ** 2 for n in range(1, 11) if n % 2 != 0]\nprint("مربّعات الفردية:", odd_squares)\n\n# تنظيف نصوص\nraw = ["  بايثون ", " كود  "]\nprint([w.strip().upper() for w in raw])',
            en: 'students = [\n    {"name": "Sara", "grade": 95},\n    {"name": "Ahmed", "grade": 55},\n    {"name": "Layla", "grade": 78}\n]\n\n# who passed\npassed = [s["name"] for s in students if s["grade"] >= 60]\nprint("passed:", passed)\n\n# dict: name → grade\ngrades = {s["name"]: s["grade"] for s in students}\nprint(grades)\n\n# squares of the odd numbers\nodd_squares = [n ** 2 for n in range(1, 11) if n % 2 != 0]\nprint("odd squares:", odd_squares)\n\n# cleaning strings\nraw = ["  python ", " code  "]\nprint([w.strip().upper() for w in raw])'
          }
        },
        challenge: {
          brief: { ar: 'مع words = ["python", "is", "a", "great", "language"]، استخدم الاختصارات لتعريف: long_words الكلمات التي طولها 4 أحرف فأكثر، upper_words كل الكلمات بأحرف كبيرة، و word_lengths قاموساً يربط كل كلمة بطولها.',
                   en: 'With words = ["python", "is", "a", "great", "language"], use comprehensions to define: long_words for words of 4+ characters, upper_words for all words uppercased, and word_lengths as a dict mapping each word to its length.' },
          starter: { ar: 'words = ["python", "is", "a", "great", "language"]\n\n# long_words و upper_words و word_lengths باستخدام الاختصارات\n',
                     en: 'words = ["python", "is", "a", "great", "language"]\n\n# long_words, upper_words and word_lengths using comprehensions\n' },
          solution: { ar: 'words = ["python", "is", "a", "great", "language"]\n\nlong_words = [w for w in words if len(w) >= 4]\nupper_words = [w.upper() for w in words]\nword_lengths = {w: len(w) for w in words}\n\nprint(long_words)\nprint(upper_words)\nprint(word_lengths)',
                      en: 'words = ["python", "is", "a", "great", "language"]\n\nlong_words = [w for w in words if len(w) >= 4]\nupper_words = [w.upper() for w in words]\nword_lengths = {w: len(w) for w in words}\n\nprint(long_words)\nprint(upper_words)\nprint(word_lengths)' },
          checks: [
            { label: { ar: 'استخدمت اختصار القوائم لا حلقة append', en: 'You used a comprehension rather than a loop with append' },
              hint:  { ar: 'الصيغة ‎[w for w in words ...]‎', en: 'The form is [w for w in words ...]' },
              test: function (r) { return r.src(/\[[^\]]*\bfor\b[^\]]*\bin\b[^\]]*\]/); } },
            { label: { ar: 'long_words فيه ثلاث كلمات', en: 'long_words holds three words' },
              hint:  { ar: 'python و great و language طولها 4 فأكثر', en: 'python, great and language are 4+ characters' },
              test: function (r) {
                var v = r.val('long_words');
                return Array.isArray(v) && String(v) === String(['python', 'great', 'language']);
              } },
            { label: { ar: 'upper_words خمس كلمات بأحرف كبيرة', en: 'upper_words holds five uppercased words' },
              hint:  { ar: 'استخدم ‎w.upper()‎ داخل الاختصار', en: 'Use w.upper() inside the comprehension' },
              test: function (r) {
                var v = r.val('upper_words');
                return Array.isArray(v) && v.length === 5 && v[0] === 'PYTHON';
              } },
            { label: { ar: 'word_lengths قاموس يربط الكلمة بطولها', en: 'word_lengths maps each word to its length' },
              hint:  { ar: 'الصيغة ‎{w: len(w) for w in words}‎', en: 'The form is {w: len(w) for w in words}' },
              test: function (r) {
                var d = r.val('word_lengths');
                return d && typeof d === 'object' && !Array.isArray(d) &&
                       d.python === 6 && d.is === 2 && d.language === 8;
              } }
          ]
        },
        quiz: [
          { q: { ar: 'ما مكافئ ‎[n * 2 for n in nums]‎؟', en: 'What is [n * 2 for n in nums] equivalent to?' },
            options: [ { ar: 'حلقة تطبع القيم', en: 'A loop that prints the values' },
                       { ar: 'حلقة تبني قائمة بالقيم مضاعفة', en: 'A loop building a list of doubled values' },
                       { ar: 'ترتيب القائمة', en: 'Sorting the list' },
                       { ar: 'حذف عناصر', en: 'Removing items' } ],
            answer: 1,
            why: { ar: 'الاختصار يبني قائمة جديدة بتطبيق التعبير على كل عنصر.',
                   en: 'A comprehension builds a new list by applying the expression to each item.' } },
          { q: { ar: 'أين يوضع الشرط في الاختصار؟', en: 'Where does the condition go in a comprehension?' },
            options: [ { ar: 'في البداية', en: 'At the beginning' }, { ar: 'بعد جزء for في النهاية', en: 'After the for part, at the end' },
                       { ar: 'خارج الأقواس', en: 'Outside the brackets' }, { ar: 'لا يمكن وضع شرط', en: 'Conditions are not allowed' } ],
            answer: 1,
            why: { ar: 'الصيغة ‎[تعبير for عنصر in مجموعة if شرط]‎.',
                   en: 'The form is [expression for item in collection if condition].' } },
          { q: { ar: 'متى تتجنّب الاختصار؟', en: 'When should you avoid a comprehension?' },
            options: [ { ar: 'دائماً', en: 'Always' },
                       { ar: 'حين يصير معقّداً لا يُفهم بنظرة', en: 'When it grows too complex to read at a glance' },
                       { ar: 'مع القوائم القصيرة', en: 'With short lists' },
                       { ar: 'مع الأعداد', en: 'With numbers' } ],
            answer: 1,
            why: { ar: 'الوضوح هو الهدف؛ الاختصار المعقّد يخسر الغاية منه.',
                   en: 'Readability is the point; an over-complex comprehension defeats its own purpose.' } }
        ]
      },

      {
        id: 'clean-code',
        minutes: 9, level: 'advanced',
        tags: ['pep8', 'style', 'نظافة'],
        title: { ar: 'كود نظيف وأسلوب PEP 8', en: 'Clean code and the PEP 8 style' },
        lede: { ar: 'الكود يُقرأ أضعاف ما يُكتب. الاتفاق على أسلوب موحّد يوفّر ساعات على كل من يقرأه — وأولهم أنت.',
                en: 'Code is read far more often than it is written. A shared style saves hours for everyone who reads it — starting with you.' },
        body: {
          ar: '<h2>PEP 8: الدليل الرسمي</h2>' +
              '<p>وثيقة رسمية تحدّد أسلوب كتابة بايثون، ويتبعها المجتمع كله تقريباً. أهم قواعدها:</p>' +
              '<table><thead><tr><th>العنصر</th><th>الأسلوب</th><th>مثال</th></tr></thead><tbody>' +
              '<tr><td>المتغيّرات والدوال</td><td>snake_case</td><td><code>user_name</code></td></tr>' +
              '<tr><td>الأصناف</td><td>PascalCase</td><td><code>BankAccount</code></td></tr>' +
              '<tr><td>الثوابت</td><td>UPPER_CASE</td><td><code>MAX_SIZE</code></td></tr>' +
              '<tr><td>الإزاحة</td><td>4 مسافات</td><td>لا Tab</td></tr>' +
              '<tr><td>طول السطر</td><td>79 حرفاً</td><td>يمكن التساهل قليلاً</td></tr>' +
              '<tr><td>حول العوامل</td><td>مسافة واحدة</td><td><code>x = a + b</code></td></tr>' +
              '</tbody></table>' +
              '<h2>الأسماء تشرح نفسها</h2>' +
              '<pre><code># ✗ لا يخبر بشيء\nd = {}\ndef calc(x, y):\n    return x * y * 0.15\n\n# ✓ يشرح نفسه\nstudent_grades = {}\ndef calculate_tax(price, quantity):\n    return price * quantity * TAX_RATE</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>اختبار بسيط</b>لو قرأت اسم الدالة وحده بلا جسدها، هل تعرف ماذا تفعل؟ إن لم تعرف فالاسم سيّئ. الاسم الطويل الواضح أفضل من القصير الغامض دائماً.</div></div>' +
              '<h2>الأرقام السحرية</h2>' +
              '<pre><code># ✗ من أين جاء 0.15؟\ntotal = price * 0.15\n\n# ✓ اسم يشرح\nTAX_RATE = 0.15\ntotal = price * TAX_RATE</code></pre>' +
              '<h2>دالة واحدة = مهمّة واحدة</h2>' +
              '<pre><code># ✗ تفعل ثلاثة أشياء\ndef process(data):\n    cleaned = [d.strip() for d in data]\n    total = sum(len(c) for c in cleaned)\n    print(f"الإجمالي {total}")\n    return cleaned\n\n# ✓ كلٌّ في مكانه\ndef clean(data):\n    return [d.strip() for d in data]\n\ndef total_length(items):\n    return sum(len(i) for i in items)</code></pre>' +
              '<h2>التعليقات تشرح «لماذا» لا «ماذا»</h2>' +
              '<pre><code># ✗ يكرّر ما يقوله الكود\ncount = count + 1   # نزيد العدّاد بواحد\n\n# ✓ يشرح السبب\ncount = count + 1   # الفهرسة تبدأ من صفر والتقرير يبدأ من واحد</code></pre>' +
              '<div class="callout callout-note"><span class="ic">🛠️</span><div><b>أدوات تفعل هذا عنك</b><code>black</code> ينسّق الكود آلياً وفق PEP 8، و<code>flake8</code> أو <code>ruff</code> ينبّهانك للمخالفات. في المشاريع الحقيقية تُشغَّل هذه تلقائياً قبل كل حفظ.</div></div>',
          en: '<h2>PEP 8: the official guide</h2>' +
              '<p>An official document defining Python\'s writing style, followed by essentially the whole community. Its key rules:</p>' +
              '<table><thead><tr><th>Element</th><th>Style</th><th>Example</th></tr></thead><tbody>' +
              '<tr><td>variables and functions</td><td>snake_case</td><td><code>user_name</code></td></tr>' +
              '<tr><td>classes</td><td>PascalCase</td><td><code>BankAccount</code></td></tr>' +
              '<tr><td>constants</td><td>UPPER_CASE</td><td><code>MAX_SIZE</code></td></tr>' +
              '<tr><td>indentation</td><td>4 spaces</td><td>never tabs</td></tr>' +
              '<tr><td>line length</td><td>79 characters</td><td>a little leeway is fine</td></tr>' +
              '<tr><td>around operators</td><td>one space</td><td><code>x = a + b</code></td></tr>' +
              '</tbody></table>' +
              '<h2>Names should explain themselves</h2>' +
              '<pre><code># ✗ tells you nothing\nd = {}\ndef calc(x, y):\n    return x * y * 0.15\n\n# ✓ self-explanatory\nstudent_grades = {}\ndef calculate_tax(price, quantity):\n    return price * quantity * TAX_RATE</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>A simple test</b>If you read the function name alone, without its body, do you know what it does? If not, the name is bad. A long clear name always beats a short cryptic one.</div></div>' +
              '<h2>Magic numbers</h2>' +
              '<pre><code># ✗ where did 0.15 come from?\ntotal = price * 0.15\n\n# ✓ a name that explains\nTAX_RATE = 0.15\ntotal = price * TAX_RATE</code></pre>' +
              '<h2>One function, one job</h2>' +
              '<pre><code># ✗ doing three things\ndef process(data):\n    cleaned = [d.strip() for d in data]\n    total = sum(len(c) for c in cleaned)\n    print(f"total {total}")\n    return cleaned\n\n# ✓ each in its place\ndef clean(data):\n    return [d.strip() for d in data]\n\ndef total_length(items):\n    return sum(len(i) for i in items)</code></pre>' +
              '<h2>Comments explain "why", not "what"</h2>' +
              '<pre><code># ✗ repeats what the code says\ncount = count + 1   # increase the counter by one\n\n# ✓ explains the reason\ncount = count + 1   # indexing starts at zero, the report starts at one</code></pre>' +
              '<div class="callout callout-note"><span class="ic">🛠️</span><div><b>Tools that do this for you</b><code>black</code> reformats code to PEP 8 automatically, and <code>flake8</code> or <code>ruff</code> flag violations. On real projects these run automatically on every save.</div></div>'
        },
        example: {
          note: { ar: 'الكود الثاني يفعل ما يفعله الأول تماماً — لكن اقرأ الاثنين وقارن.',
                  en: 'The second version does exactly what the first does — but read both and compare.' },
          code: {
            ar: '# ✗ النسخة الغامضة\ndef f(l):\n    t=0\n    for i in l:\n        if i["g"]>=60: t+=i["g"]\n    return t\n\n# ✓ النسخة النظيفة\nPASSING_GRADE = 60\n\ndef total_passing_grades(students):\n    """يجمع درجات الطلاب الناجحين فقط."""\n    return sum(s["grade"] for s in students if s["grade"] >= PASSING_GRADE)\n\n\nstudents = [\n    {"name": "سارة", "grade": 95},\n    {"name": "أحمد", "grade": 55},\n    {"name": "ليلى", "grade": 78}\n]\n\nprint(total_passing_grades(students))',
            en: '# ✗ the cryptic version\ndef f(l):\n    t=0\n    for i in l:\n        if i["g"]>=60: t+=i["g"]\n    return t\n\n# ✓ the clean version\nPASSING_GRADE = 60\n\ndef total_passing_grades(students):\n    """Sum the grades of passing students only."""\n    return sum(s["grade"] for s in students if s["grade"] >= PASSING_GRADE)\n\n\nstudents = [\n    {"name": "Sara", "grade": 95},\n    {"name": "Ahmed", "grade": 55},\n    {"name": "Layla", "grade": 78}\n]\n\nprint(total_passing_grades(students))'
          }
        },
        challenge: {
          brief: { ar: 'أعد كتابة الدالة الغامضة في المحرّر وفق PEP 8: سمِّها calculate_discount بمعاملات واضحة، واستخرج الرقم السحري 0.2 إلى ثابت DISCOUNT_RATE بأحرف كبيرة، وأضف docstring. يجب أن تُعيد السعر بعد خصم 20%.',
                   en: 'Rewrite the cryptic function in the editor to PEP 8: name it calculate_discount with clear parameters, extract the magic number 0.2 into an UPPER_CASE constant DISCOUNT_RATE, and add a docstring. It must return the price after a 20% discount.' },
          starter: { ar: '# أعد كتابة هذه الدالة بأسلوب نظيف\ndef d(p):\n    return p-p*0.2\n',
                     en: '# rewrite this function in clean style\ndef d(p):\n    return p-p*0.2\n' },
          solution: { ar: 'DISCOUNT_RATE = 0.2\n\n\ndef calculate_discount(price):\n    """يُعيد السعر بعد تطبيق نسبة الخصم القياسية."""\n    return price - (price * DISCOUNT_RATE)\n\n\nprint(calculate_discount(200))',
                      en: 'DISCOUNT_RATE = 0.2\n\n\ndef calculate_discount(price):\n    """Return the price after applying the standard discount rate."""\n    return price - (price * DISCOUNT_RATE)\n\n\nprint(calculate_discount(200))' },
          checks: [
            { label: { ar: 'الدالة باسم واضح calculate_discount', en: 'The function is clearly named calculate_discount' },
              hint:  { ar: 'الأسماء بصيغة snake_case الوصفية', en: 'Use a descriptive snake_case name' },
              test: function (r) { return isFn(r, 'calculate_discount'); } },
            { label: { ar: 'عرّفت ثابتاً DISCOUNT_RATE بأحرف كبيرة', en: 'You defined an UPPER_CASE constant DISCOUNT_RATE' },
              hint:  { ar: 'اكتب ‎DISCOUNT_RATE = 0.2‎ خارج الدالة', en: 'Write DISCOUNT_RATE = 0.2 outside the function' },
              test: function (r) { return near(r.val('DISCOUNT_RATE'), 0.2, 1e-9); } },
            { label: { ar: 'الدالة تستخدم الثابت لا الرقم مباشرة', en: 'The function uses the constant, not the bare number' },
              hint:  { ar: 'استبدل 0.2 داخل الدالة بـ DISCOUNT_RATE', en: 'Replace 0.2 inside the function with DISCOUNT_RATE' },
              test: function (r) {
                return r.src(/DISCOUNT_RATE/) &&
                       !/def\s+calculate_discount[\s\S]*?return[^\n]*0\.2/.test(r.code);
              } },
            { label: { ar: 'تُعيد 160 لسعر 200 ولها docstring', en: 'It returns 160 for a price of 200 and has a docstring' },
              hint:  { ar: 'أضف نصاً ثلاثي الاقتباس بعد سطر def', en: 'Add a triple-quoted string right after the def line' },
              test: function (r) {
                if (!r.src(/"""|'''/)) return false;
                return r.call('calculate_discount', [200]).then(function (o) {
                  return o.ok && near(o.value, 160, 1e-6);
                });
              } }
          ]
        },
        quiz: [
          { q: { ar: 'ما أسلوب تسمية الأصناف في PEP 8؟', en: 'What is the PEP 8 naming style for classes?' },
            options: [ { ar: 'snake_case', en: 'snake_case' }, { ar: 'PascalCase', en: 'PascalCase' },
                       { ar: 'UPPER_CASE', en: 'UPPER_CASE' }, { ar: 'camelCase', en: 'camelCase' } ],
            answer: 1,
            why: { ar: 'الأصناف بحرف أول كبير لكل كلمة مثل ‎BankAccount‎.',
                   en: 'Classes capitalise each word, as in BankAccount.' } },
          { q: { ar: 'ما «الرقم السحري» ولماذا يُتجنّب؟', en: 'What is a "magic number" and why avoid it?' },
            options: [ { ar: 'رقم كبير جداً يبطئ البرنامج', en: 'A very large number that slows the program' },
                       { ar: 'رقم في الكود بلا اسم يشرح معناه', en: 'A bare number in the code with no name explaining it' },
                       { ar: 'رقم عشوائي', en: 'A random number' },
                       { ar: 'رقم سالب', en: 'A negative number' } ],
            answer: 1,
            why: { ar: 'استخراجه إلى ثابت مسمّى يوضّح المعنى ويجعل التعديل في مكان واحد.',
                   en: 'Extracting it into a named constant explains the meaning and centralises future changes.' } },
          { q: { ar: 'ما الذي يجب أن يشرحه التعليق الجيد؟', en: 'What should a good comment explain?' },
            options: [ { ar: 'ماذا يفعل السطر حرفياً', en: 'Literally what the line does' },
                       { ar: 'لماذا كُتب بهذه الطريقة', en: 'Why it was written this way' },
                       { ar: 'اسم كاتب الكود', en: 'Who wrote the code' },
                       { ar: 'تاريخ الكتابة', en: 'The date it was written' } ],
            answer: 1,
            why: { ar: 'الكود يخبرك بالـ«ماذا» أصلاً؛ التعليق يضيف الـ«لماذا» الذي لا يظهر منه.',
                   en: 'The code already tells you the "what"; a comment adds the "why" that the code cannot show.' } }
        ]
      },

      {
        id: 'stdlib',
        minutes: 8, level: 'advanced',
        tags: ['json', 'collections', 'statistics'],
        title: { ar: 'جولة في المكتبة القياسية', en: 'A tour of the standard library' },
        lede: { ar: '«البطاريات مرفقة» شعار بايثون: أدوات جاهزة لمعظم ما تحتاجه، بلا أي تثبيت.',
                en: '"Batteries included" is Python\'s motto: ready-made tools for most of what you need, with nothing to install.' },
        body: {
          ar: '<h2>json — لغة تبادل البيانات</h2>' +
              '<pre><code>import json\n\ndata = {"name": "سارة", "grades": [95, 88]}\n\ntext = json.dumps(data, ensure_ascii=False)   # كائن → نص\nprint(text)\n\nback = json.loads(text)                       # نص → كائن\nprint(back["name"])</code></pre>' +
              '<p><code>ensure_ascii=False</code> ضرورية لإبقاء العربية مقروءة بدل ترميزها رموزاً.</p>' +
              '<h2>collections.Counter — العدّ في سطر</h2>' +
              '<pre><code>from collections import Counter\n\nvotes = ["أ", "ب", "أ", "ج", "أ", "ب"]\ntally = Counter(votes)\n\nprint(tally)                  # Counter({\'أ\': 3, \'ب\': 2, \'ج\': 1})\nprint(tally.most_common(1))   # [(\'أ\', 3)]</code></pre>' +
              '<p>لو كتبتها يدوياً لاحتجت حلقة وقاموساً وشرطاً. هنا سطر واحد.</p>' +
              '<h2>statistics — إحصاء سريع</h2>' +
              '<pre><code>import statistics as stats\n\nscores = [72, 95, 61, 88, 80]\nprint(stats.mean(scores))     # المتوسّط\nprint(stats.median(scores))   # الوسيط\nprint(stats.stdev(scores))    # الانحراف المعياري</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>الوسيط أصدق من المتوسّط أحياناً</b>في قائمة رواتب فيها راتب ضخم واحد، يرتفع <em>المتوسّط</em> فيعطي صورة مضلّلة، بينما يبقى <em>الوسيط</em> ممثّلاً للواقع.</div></div>' +
              '<h2>pathlib — المسارات بأسلوب حديث</h2>' +
              '<pre><code>from pathlib import Path\n\np = Path("data") / "notes.txt"    # يبني المسار بشكل صحيح على أي نظام\nprint(p.suffix)                   # .txt\nprint(p.exists())</code></pre>' +
              '<h2>ما يستحقّ أن تعرفه لاحقاً</h2>' +
              '<ul>' +
              '<li><code>itertools</code> — أدوات تكرار متقدّمة كالتباديل والتجميعات.</li>' +
              '<li><code>re</code> — التعابير النمطية للبحث في النصوص.</li>' +
              '<li><code>csv</code> — قراءة وكتابة جداول البيانات.</li>' +
              '<li><code>dataclasses</code> — أصناف بيانات بأسطر قليلة.</li>' +
              '</ul>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>القاعدة قبل أن تكتب أي أداة</b>ابحث أولاً: «هل في المكتبة القياسية ما يفعل هذا؟» الإجابة نعم في أغلب الأحيان، والكود الجاهز اختُبر على ملايين المستخدمين.</div></div>',
          en: '<h2>json — the data interchange format</h2>' +
              '<pre><code>import json\n\ndata = {"name": "Sara", "grades": [95, 88]}\n\ntext = json.dumps(data, ensure_ascii=False)   # object → text\nprint(text)\n\nback = json.loads(text)                       # text → object\nprint(back["name"])</code></pre>' +
              '<p><code>ensure_ascii=False</code> keeps non-English text readable instead of escaping it into codes.</p>' +
              '<h2>collections.Counter — counting in one line</h2>' +
              '<pre><code>from collections import Counter\n\nvotes = ["a", "b", "a", "c", "a", "b"]\ntally = Counter(votes)\n\nprint(tally)                  # Counter({\'a\': 3, \'b\': 2, \'c\': 1})\nprint(tally.most_common(1))   # [(\'a\', 3)]</code></pre>' +
              '<p>Written by hand this needs a loop, a dict and a condition. Here it is one line.</p>' +
              '<h2>statistics — quick statistics</h2>' +
              '<pre><code>import statistics as stats\n\nscores = [72, 95, 61, 88, 80]\nprint(stats.mean(scores))     # the mean\nprint(stats.median(scores))   # the median\nprint(stats.stdev(scores))    # standard deviation</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>The median is sometimes more honest than the mean</b>In a salary list containing one enormous salary, the <em>mean</em> is dragged upward and misleads, while the <em>median</em> still represents reality.</div></div>' +
              '<h2>pathlib — modern path handling</h2>' +
              '<pre><code>from pathlib import Path\n\np = Path("data") / "notes.txt"    # builds a correct path on any OS\nprint(p.suffix)                   # .txt\nprint(p.exists())</code></pre>' +
              '<h2>Worth knowing later</h2>' +
              '<ul>' +
              '<li><code>itertools</code> — advanced iteration tools such as permutations and combinations.</li>' +
              '<li><code>re</code> — regular expressions for searching text.</li>' +
              '<li><code>csv</code> — reading and writing spreadsheet data.</li>' +
              '<li><code>dataclasses</code> — data-carrying classes in a few lines.</li>' +
              '</ul>' +
              '<div class="callout callout-note"><span class="ic">📌</span><div><b>The rule before you write any tool</b>Search first: "does the standard library already do this?" The answer is usually yes, and that code has been tested by millions of users.</div></div>'
        },
        example: {
          note: { ar: 'جرّب تغيير قائمة الأصوات وشاهد Counter يتكيّف.',
                  en: 'Try changing the votes list and watch Counter adapt.' },
          code: {
            ar: 'import json\nimport statistics as stats\nfrom collections import Counter\n\n# Counter\nvotes = ["أحمد", "سارة", "أحمد", "ليلى", "أحمد", "سارة"]\ntally = Counter(votes)\nprint("النتائج:", dict(tally))\nprint("الفائز:", tally.most_common(1)[0][0])\n\n# statistics\nscores = [72, 95, 61, 88, 80]\nprint("المتوسّط:", round(stats.mean(scores), 2))\nprint("الوسيط:", stats.median(scores))\n\n# json\nrecord = {"name": "سارة", "scores": scores}\ntext = json.dumps(record, ensure_ascii=False)\nprint("كنص:", text)\nprint("مسترجَع:", json.loads(text)["name"])',
            en: 'import json\nimport statistics as stats\nfrom collections import Counter\n\n# Counter\nvotes = ["Ahmed", "Sara", "Ahmed", "Layla", "Ahmed", "Sara"]\ntally = Counter(votes)\nprint("tally:", dict(tally))\nprint("winner:", tally.most_common(1)[0][0])\n\n# statistics\nscores = [72, 95, 61, 88, 80]\nprint("mean:", round(stats.mean(scores), 2))\nprint("median:", stats.median(scores))\n\n# json\nrecord = {"name": "Sara", "scores": scores}\ntext = json.dumps(record, ensure_ascii=False)\nprint("as text:", text)\nprint("back again:", json.loads(text)["name"])'
          }
        },
        challenge: {
          brief: { ar: 'مع letters = ["a","b","a","c","a","b"]، استخدم Counter لتعريف tally، و winner أكثر حرف تكراراً (نصّاً)، و winner_count عدد مرّاته. ثم استخدم statistics لتعريف avg متوسّط القائمة nums = [4, 8, 15, 16, 23].',
                   en: 'With letters = ["a","b","a","c","a","b"], use Counter to define tally, winner as the most frequent letter (a string), and winner_count as its count. Then use statistics to define avg as the mean of nums = [4, 8, 15, 16, 23].' },
          starter: { ar: 'from collections import Counter\nimport statistics\n\nletters = ["a", "b", "a", "c", "a", "b"]\nnums = [4, 8, 15, 16, 23]\n\n# tally و winner و winner_count و avg\n',
                     en: 'from collections import Counter\nimport statistics\n\nletters = ["a", "b", "a", "c", "a", "b"]\nnums = [4, 8, 15, 16, 23]\n\n# tally, winner, winner_count and avg\n' },
          solution: { ar: 'from collections import Counter\nimport statistics\n\nletters = ["a", "b", "a", "c", "a", "b"]\nnums = [4, 8, 15, 16, 23]\n\ntally = Counter(letters)\nwinner, winner_count = tally.most_common(1)[0]\navg = statistics.mean(nums)\n\nprint(dict(tally))\nprint(winner, winner_count)\nprint(avg)',
                      en: 'from collections import Counter\nimport statistics\n\nletters = ["a", "b", "a", "c", "a", "b"]\nnums = [4, 8, 15, 16, 23]\n\ntally = Counter(letters)\nwinner, winner_count = tally.most_common(1)[0]\navg = statistics.mean(nums)\n\nprint(dict(tally))\nprint(winner, winner_count)\nprint(avg)' },
          checks: [
            { label: { ar: 'استخدمت Counter من collections', en: 'You used Counter from collections' },
              hint:  { ar: 'اكتب ‎tally = Counter(letters)‎', en: 'Write tally = Counter(letters)' },
              test: function (r) { return r.src(/Counter\s*\(/) && r.type('tally') === 'Counter'; } },
            { label: { ar: 'winner يساوي "a"', en: 'winner equals "a"' },
              hint:  { ar: 'استخدم ‎tally.most_common(1)‎', en: 'Use tally.most_common(1)' },
              test: function (r) { return r.val('winner') === 'a'; } },
            { label: { ar: 'winner_count يساوي 3', en: 'winner_count equals 3' },
              hint:  { ar: 'الحرف a تكرّر ثلاث مرات', en: 'The letter a appears three times' },
              test: function (r) { return r.val('winner_count') === 3; } },
            { label: { ar: 'avg يساوي 13.2 عبر statistics', en: 'avg equals 13.2 via statistics' },
              hint:  { ar: 'استخدم ‎statistics.mean(nums)‎', en: 'Use statistics.mean(nums)' },
              test: function (r) { return near(r.val('avg'), 13.2, 1e-6) && r.src(/mean\s*\(/); } }
          ]
        },
        quiz: [
          { q: { ar: 'ماذا تفعل ‎json.dumps()‎؟', en: 'What does json.dumps() do?' },
            options: [ { ar: 'تقرأ ملفاً', en: 'Reads a file' }, { ar: 'تحوّل كائن بايثون إلى نص JSON', en: 'Converts a Python object into JSON text' },
                       { ar: 'تحوّل نصاً إلى كائن', en: 'Converts text into an object' }, { ar: 'تحذف البيانات', en: 'Deletes data' } ],
            answer: 1,
            why: { ar: 'dumps تُخرج نصاً، وloads تقرأ نصاً وتُعيد كائناً.',
                   en: 'dumps produces text; loads reads text and returns an object.' } },
          { q: { ar: 'ما فائدة Counter؟', en: 'What is Counter for?' },
            options: [ { ar: 'ترتيب القائمة', en: 'Sorting a list' }, { ar: 'حساب تكرار كل عنصر', en: 'Counting how often each item appears' },
                       { ar: 'حذف المكرّرات', en: 'Removing duplicates' }, { ar: 'جمع الأعداد', en: 'Summing numbers' } ],
            answer: 1,
            why: { ar: 'تُنتج قاموساً بالعناصر وتكراراتها، مع ‎most_common()‎ للأكثر شيوعاً.',
                   en: 'It produces a mapping of items to counts, with most_common() for the top entries.' } },
          { q: { ar: 'متى يكون الوسيط أفضل من المتوسّط؟', en: 'When is the median better than the mean?' },
            options: [ { ar: 'دائماً', en: 'Always' },
                       { ar: 'حين توجد قيم شاذّة تجرّ المتوسّط بعيداً', en: 'When outliers drag the mean away from reality' },
                       { ar: 'مع القوائم القصيرة', en: 'With short lists' },
                       { ar: 'أبداً', en: 'Never' } ],
            answer: 1,
            why: { ar: 'الوسيط لا يتأثّر بالقيم المتطرّفة كما يتأثّر المتوسّط.',
                   en: 'The median is not pulled by extreme values the way the mean is.' } }
        ]
      },

      {
        id: 'testing',
        minutes: 8, level: 'advanced',
        tags: ['assert', 'test', 'اختبار'],
        title: { ar: 'اختبار كودك', en: 'Testing your code' },
        lede: { ar: '«جرّبته ونجح» ليست ضماناً. الاختبار المكتوب يبقى ويحميك من كسر ما كان يعمل.',
                en: '"I tried it and it worked" is not a guarantee. A written test stays behind and protects you from breaking what already worked.' },
        body: {
          ar: '<h2>assert: أبسط اختبار</h2>' +
              '<pre><code>def add(a, b):\n    return a + b\n\nassert add(2, 3) == 5\nassert add(-1, 1) == 0\nprint("كل الاختبارات نجحت ✓")</code></pre>' +
              '<p><code>assert</code> لا تفعل شيئاً إن كان الشرط صحيحاً، وترفع <code>AssertionError</code> إن كان خاطئاً.</p>' +
              '<h2>ماذا تختبر؟</h2>' +
              '<ul>' +
              '<li><strong>الحالة الطبيعية</strong> — المدخل المتوقّع والناتج الصحيح.</li>' +
              '<li><strong>الحالات الحدّية</strong> — الصفر، القائمة الفارغة، النص الفارغ، القيمة السالبة.</li>' +
              '<li><strong>الحالات الخاطئة</strong> — ماذا يحدث مع مدخل غير صالح؟</li>' +
              '</ul>' +
              '<pre><code>def average(numbers):\n    if not numbers:\n        return 0\n    return sum(numbers) / len(numbers)\n\nassert average([2, 4]) == 3        # الحالة الطبيعية\nassert average([]) == 0            # الحالة الحدّية\nassert average([5]) == 5           # عنصر واحد</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>الحالات الحدّية هي مصنع الأخطاء</b>معظم الأخطاء في البرامج الحقيقية لا تقع في الحالة الطبيعية بل عند الفراغ والصفر والحدود. اكتب اختبار الحالة الحدّية أولاً.</div></div>' +
              '<h2>رسالة توضيحية</h2>' +
              '<pre><code>assert average([2, 4]) == 3, "متوسّط 2 و4 يجب أن يكون 3"</code></pre>' +
              '<h2>اختبار الأخطاء المتوقّعة</h2>' +
              '<pre><code>def set_age(age):\n    if age &lt; 0:\n        raise ValueError("العمر لا يكون سالباً")\n    return age\n\ntry:\n    set_age(-5)\n    assert False, "كان يجب أن يرفع خطأً"\nexcept ValueError:\n    pass   # ✓ سلوك صحيح</code></pre>' +
              '<h2>الخطوة التالية: pytest</h2>' +
              '<pre><code># في ملف test_math.py\ndef test_add():\n    assert add(2, 3) == 5\n\ndef test_add_negative():\n    assert add(-1, 1) == 0</code></pre>' +
              '<p>ثم تكتب <code>pytest</code> في الطرفية فيكتشف كل دالة تبدأ بـ <code>test_</code> ويشغّلها ويعطيك تقريراً.</p>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>assert ليست للتحقّق من المدخلات</b>بايثون تحذف كل <code>assert</code> عند التشغيل بوضع التحسين <code>-O</code>. استخدمها للاختبار فقط؛ وللتحقّق من مدخلات المستخدم استخدم <code>if</code> و<code>raise</code>.</div></div>',
          en: '<h2>assert: the simplest test</h2>' +
              '<pre><code>def add(a, b):\n    return a + b\n\nassert add(2, 3) == 5\nassert add(-1, 1) == 0\nprint("all tests passed ✓")</code></pre>' +
              '<p><code>assert</code> does nothing when the condition is true, and raises an <code>AssertionError</code> when it is false.</p>' +
              '<h2>What should you test?</h2>' +
              '<ul>' +
              '<li><strong>The normal case</strong> — expected input, correct output.</li>' +
              '<li><strong>Edge cases</strong> — zero, the empty list, the empty string, a negative value.</li>' +
              '<li><strong>Failure cases</strong> — what happens with invalid input?</li>' +
              '</ul>' +
              '<pre><code>def average(numbers):\n    if not numbers:\n        return 0\n    return sum(numbers) / len(numbers)\n\nassert average([2, 4]) == 3        # the normal case\nassert average([]) == 0            # the edge case\nassert average([5]) == 5           # a single item</code></pre>' +
              '<div class="callout callout-tip"><span class="ic">💡</span><div><b>Edge cases are where bugs are manufactured</b>Most real-world bugs do not happen in the normal case — they happen at emptiness, zero and boundaries. Write the edge-case test first.</div></div>' +
              '<h2>Adding a message</h2>' +
              '<pre><code>assert average([2, 4]) == 3, "the average of 2 and 4 should be 3"</code></pre>' +
              '<h2>Testing that an error is raised</h2>' +
              '<pre><code>def set_age(age):\n    if age &lt; 0:\n        raise ValueError("age cannot be negative")\n    return age\n\ntry:\n    set_age(-5)\n    assert False, "it should have raised"\nexcept ValueError:\n    pass   # ✓ correct behaviour</code></pre>' +
              '<h2>The next step: pytest</h2>' +
              '<pre><code># in a file named test_math.py\ndef test_add():\n    assert add(2, 3) == 5\n\ndef test_add_negative():\n    assert add(-1, 1) == 0</code></pre>' +
              '<p>Then you type <code>pytest</code> in the terminal and it discovers every function starting with <code>test_</code>, runs them, and reports back.</p>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>assert is not for validating input</b>Python strips every <code>assert</code> when run with the <code>-O</code> optimisation flag. Use it for tests only; to validate user input use <code>if</code> and <code>raise</code>.</div></div>'
        },
        example: {
          note: { ar: 'غيّر الدالة عمداً لتكسرها وشاهد أي اختبار يمسك الخطأ.',
                  en: 'Deliberately break the function and see which test catches it.' },
          code: {
            ar: 'def average(numbers):\n    """يُعيد المتوسّط، وصفراً للقائمة الفارغة."""\n    if not numbers:\n        return 0\n    return sum(numbers) / len(numbers)\n\n\n# الحالة الطبيعية\nassert average([2, 4]) == 3, "متوسّط [2,4] يجب أن يكون 3"\n\n# الحالات الحدّية\nassert average([]) == 0, "القائمة الفارغة تعطي صفراً"\nassert average([5]) == 5, "عنصر واحد يعطي نفسه"\nassert average([-2, 2]) == 0, "المتوسّط المتماثل يعطي صفراً"\n\nprint("✓ نجحت الاختبارات الأربعة")',
            en: 'def average(numbers):\n    """Return the mean, or zero for an empty list."""\n    if not numbers:\n        return 0\n    return sum(numbers) / len(numbers)\n\n\n# the normal case\nassert average([2, 4]) == 3, "the average of [2,4] should be 3"\n\n# edge cases\nassert average([]) == 0, "an empty list gives zero"\nassert average([5]) == 5, "one item gives itself"\nassert average([-2, 2]) == 0, "a symmetric average gives zero"\n\nprint("✓ all four tests passed")'
          }
        },
        challenge: {
          brief: { ar: 'عرّف دالة longest_word(words) تُعيد أطول كلمة في قائمة، وتُعيد نصاً فارغاً "" للقائمة الفارغة. ثم اكتب ثلاث جمل assert على الأقل تختبر: الحالة الطبيعية، والقائمة الفارغة، وقائمة من عنصر واحد.',
                   en: 'Define a function longest_word(words) returning the longest word in a list, and returning an empty string "" for an empty list. Then write at least three assert statements covering: the normal case, the empty list, and a single-item list.' },
          starter: { ar: 'def longest_word(words):\n    pass\n\n\n# اكتب ثلاث جمل assert على الأقل\n',
                     en: 'def longest_word(words):\n    pass\n\n\n# write at least three assert statements\n' },
          solution: { ar: 'def longest_word(words):\n    """يُعيد أطول كلمة، أو نصاً فارغاً للقائمة الفارغة."""\n    if not words:\n        return ""\n    return max(words, key=len)\n\n\nassert longest_word(["a", "abc", "ab"]) == "abc"\nassert longest_word([]) == ""\nassert longest_word(["one"]) == "one"\n\nprint("✓ نجحت الاختبارات")',
                      en: 'def longest_word(words):\n    """Return the longest word, or an empty string for an empty list."""\n    if not words:\n        return ""\n    return max(words, key=len)\n\n\nassert longest_word(["a", "abc", "ab"]) == "abc"\nassert longest_word([]) == ""\nassert longest_word(["one"]) == "one"\n\nprint("✓ tests passed")' },
          checks: [
            { label: { ar: 'عرّفت الدالة longest_word', en: 'You defined longest_word' },
              hint:  { ar: 'اكتب ‎def longest_word(words):‎', en: 'Write def longest_word(words):' },
              test: function (r) { return isFn(r, 'longest_word'); } },
            { label: { ar: 'تُعيد أطول كلمة في الحالة الطبيعية', en: 'It returns the longest word in the normal case' },
              hint:  { ar: 'استخدم ‎max(words, key=len)‎', en: 'Use max(words, key=len)' },
              test: function (r) {
                return r.call('longest_word', [['a', 'abc', 'ab']]).then(function (o) {
                  return o.ok && o.value === 'abc';
                });
              } },
            { label: { ar: 'تُعيد نصاً فارغاً للقائمة الفارغة', en: 'It returns an empty string for an empty list' },
              hint:  { ar: 'افحص ‎if not words:‎ في البداية', en: 'Check if not words: at the start' },
              test: function (r) {
                return r.call('longest_word', [[]]).then(function (o) {
                  return o.ok && o.value === '';
                });
              } },
            { label: { ar: 'كتبت ثلاث جمل assert والبرنامج يعمل بلا فشل', en: 'You wrote three assert statements and the program passes' },
              hint:  { ar: 'ثلاث أسطر تبدأ بـ assert وتنجح كلها', en: 'Three lines starting with assert, all passing' },
              test: function (r) { return count(r.code, /^\s*assert\b/gm) >= 3 && r.ok; } }
          ]
        },
        quiz: [
          { q: { ar: 'ماذا يحدث عند فشل جملة assert؟', en: 'What happens when an assert fails?' },
            options: [ { ar: 'لا شيء', en: 'Nothing' }, { ar: 'ترفع AssertionError', en: 'It raises AssertionError' },
                       { ar: 'تطبع تحذيراً فقط', en: 'It only prints a warning' }, { ar: 'تعيد False', en: 'It returns False' } ],
            answer: 1,
            why: { ar: 'الفشل يوقف التنفيذ برفع استثناء يوضّح أن التوقّع لم يتحقّق.',
                   en: 'A failure halts execution by raising an exception showing the expectation was not met.' } },
          { q: { ar: 'ما «الحالة الحدّية»؟', en: 'What is an "edge case"?' },
            options: [ { ar: 'أطول مدخل ممكن', en: 'The longest possible input' },
                       { ar: 'حالة عند حدود المدخلات كالفراغ والصفر', en: 'A case at the boundaries of the input, such as empty or zero' },
                       { ar: 'خطأ نحوي', en: 'A syntax error' },
                       { ar: 'أول اختبار تكتبه', en: 'The first test you write' } ],
            answer: 1,
            why: { ar: 'معظم الأخطاء الحقيقية تظهر عند هذه الحدود لا في الحالة الاعتيادية.',
                   en: 'Most real bugs surface at these boundaries rather than in the ordinary case.' } },
          { q: { ar: 'لماذا لا تُستخدم assert للتحقّق من مدخلات المستخدم؟', en: 'Why not use assert to validate user input?' },
            options: [ { ar: 'لأنها بطيئة', en: 'It is slow' },
                       { ar: 'لأنها تُحذف عند التشغيل بوضع التحسين', en: 'It is stripped out when running in optimised mode' },
                       { ar: 'لأنها لا تعمل مع النصوص', en: 'It does not work with strings' },
                       { ar: 'لأنها تحتاج مكتبة', en: 'It needs a library' } ],
            answer: 1,
            why: { ar: 'وضع ‎-O‎ يحذف جمل assert، فيختفي التحقّق تماماً؛ استخدم if وraise.',
                   en: 'The -O flag removes assert statements entirely, so the check vanishes; use if and raise instead.' } }
        ]
      },

      {
        id: 'next-steps',
        minutes: 7, level: 'advanced',
        tags: ['pip', 'venv', 'مسار'],
        title: { ar: 'الخطوات التالية بعد هذا المنهج', en: 'Where to go after this course' },
        lede: { ar: 'أنت الآن تعرف أساسيات بايثون كاملة. هذه خريطة ما بعدها، ومن أين تبدأ فعلاً.',
                en: 'You now know the whole of Python\'s core. Here is the map of what comes next, and where to actually begin.' },
        body: {
          ar: '<h2>أولاً: بايثون على جهازك</h2>' +
              '<p>حتى الآن كنت تعمل داخل المتصفح. للعمل الحقيقي:</p>' +
              '<ol>' +
              '<li>نزّل بايثون من <strong>python.org</strong> (اختر «Add to PATH» أثناء التثبيت على ويندوز).</li>' +
              '<li>ثبّت محرّراً: <strong>VS Code</strong> مع إضافة Python.</li>' +
              '<li>تحقّق بكتابة <code>python --version</code> في الطرفية.</li>' +
              '</ol>' +
              '<h2>pip: مكتبات العالم كلّه</h2>' +
              '<pre><code>pip install requests\npip install pandas\npip list</code></pre>' +
              '<p>أكثر من نصف مليون حزمة جاهزة على <em>PyPI</em>.</p>' +
              '<h2>البيئات الافتراضية — لا تتخطَّ هذه</h2>' +
              '<pre><code>python -m venv .venv\nsource .venv/bin/activate    # ماك ولينكس\n.venv\\Scripts\\activate       # ويندوز</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>لماذا هي ضرورية؟</b>مشروعان قد يحتاجان نسختين مختلفتين من المكتبة نفسها. البيئة الافتراضية تعطي كل مشروع مجلّد مكتبات خاصاً به. تثبيت كل شيء عالمياً يقودك حتماً إلى تعارضات موجعة.</div></div>' +
              '<h2>اختر مسارك</h2>' +
              '<table><thead><tr><th>المجال</th><th>المكتبات</th></tr></thead><tbody>' +
              '<tr><td>تحليل البيانات</td><td><code>pandas</code>، <code>numpy</code>، <code>matplotlib</code></td></tr>' +
              '<tr><td>الذكاء الاصطناعي</td><td><code>scikit-learn</code>، <code>pytorch</code></td></tr>' +
              '<tr><td>الويب</td><td><code>django</code>، <code>flask</code>، <code>fastapi</code></td></tr>' +
              '<tr><td>الأتمتة</td><td><code>requests</code>، <code>beautifulsoup4</code>، <code>openpyxl</code></td></tr>' +
              '<tr><td>الألعاب</td><td><code>pygame</code></td></tr>' +
              '</tbody></table>' +
              '<h2>الطريقة الوحيدة التي تعمل</h2>' +
              '<p>لا تنتقل إلى منهج جديد الآن. <strong>ابنِ شيئاً</strong>. اختر مشكلة صغيرة تزعجك فعلاً واكتب لها برنامجاً:</p>' +
              '<ul>' +
              '<li>سكربت يرتّب ملفات مجلّد التنزيلات حسب النوع.</li>' +
              '<li>برنامج يتتبّع مصروفك اليومي ويطبع تقريراً أسبوعياً.</li>' +
              '<li>أداة تقرأ ملف CSV وتستخرج منه ملخّصاً.</li>' +
              '<li>لعبة تخمين رقم مع لوحة أفضل النتائج.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">🎯</span><div><b>القاعدة التي تصنع المبرمجين</b>مشروع واحد تُنهيه يعلّمك أكثر من عشرة دروس تشاهدها. ستتعثّر وتبحث وتقرأ رسائل خطأ — وهذا بالضبط ما يفعله المحترفون كل يوم.</div></div>',
          en: '<h2>First: Python on your own machine</h2>' +
              '<p>So far you have worked inside the browser. For real work:</p>' +
              '<ol>' +
              '<li>Download Python from <strong>python.org</strong> (tick "Add to PATH" during Windows installation).</li>' +
              '<li>Install an editor: <strong>VS Code</strong> with the Python extension.</li>' +
              '<li>Verify by typing <code>python --version</code> in a terminal.</li>' +
              '</ol>' +
              '<h2>pip: the world\'s libraries</h2>' +
              '<pre><code>pip install requests\npip install pandas\npip list</code></pre>' +
              '<p>More than half a million packages are ready on <em>PyPI</em>.</p>' +
              '<h2>Virtual environments — do not skip this</h2>' +
              '<pre><code>python -m venv .venv\nsource .venv/bin/activate    # macOS and Linux\n.venv\\Scripts\\activate       # Windows</code></pre>' +
              '<div class="callout callout-warn"><span class="ic">⚠️</span><div><b>Why are they essential?</b>Two projects may need two different versions of the same library. A virtual environment gives each project its own library folder. Installing everything globally leads inevitably to painful conflicts.</div></div>' +
              '<h2>Choose your path</h2>' +
              '<table><thead><tr><th>Field</th><th>Libraries</th></tr></thead><tbody>' +
              '<tr><td>data analysis</td><td><code>pandas</code>, <code>numpy</code>, <code>matplotlib</code></td></tr>' +
              '<tr><td>AI and machine learning</td><td><code>scikit-learn</code>, <code>pytorch</code></td></tr>' +
              '<tr><td>web</td><td><code>django</code>, <code>flask</code>, <code>fastapi</code></td></tr>' +
              '<tr><td>automation</td><td><code>requests</code>, <code>beautifulsoup4</code>, <code>openpyxl</code></td></tr>' +
              '<tr><td>games</td><td><code>pygame</code></td></tr>' +
              '</tbody></table>' +
              '<h2>The only approach that actually works</h2>' +
              '<p>Do not move straight to another course. <strong>Build something</strong>. Pick a small problem that genuinely annoys you and write a program for it:</p>' +
              '<ul>' +
              '<li>A script that sorts your downloads folder by file type.</li>' +
              '<li>A program that tracks your daily spending and prints a weekly report.</li>' +
              '<li>A tool that reads a CSV file and extracts a summary.</li>' +
              '<li>A number-guessing game with a high-score table.</li>' +
              '</ul>' +
              '<div class="callout callout-tip"><span class="ic">🎯</span><div><b>The rule that makes programmers</b>One project you finish teaches you more than ten lessons you watch. You will get stuck, search, and read error messages — which is exactly what professionals do every single day.</div></div>'
        },
        example: {
          note: { ar: 'مثال مصغّر لسكربت أتمتة حقيقي — يصنّف أسماء ملفات حسب امتدادها.',
                  en: 'A miniature of a real automation script — it groups file names by extension.' },
          code: {
            ar: 'files = [\n    "تقرير.pdf", "صورة.png", "بيانات.csv",\n    "ملاحظات.txt", "شعار.png", "ميزانية.csv"\n]\n\ngroups = {}\nfor filename in files:\n    ext = filename.split(".")[-1]\n    groups.setdefault(ext, []).append(filename)\n\nfor ext, names in sorted(groups.items()):\n    print(f"[{ext}] — {len(names)} ملف")\n    for name in names:\n        print(f"   • {name}")',
            en: 'files = [\n    "report.pdf", "photo.png", "data.csv",\n    "notes.txt", "logo.png", "budget.csv"\n]\n\ngroups = {}\nfor filename in files:\n    ext = filename.split(".")[-1]\n    groups.setdefault(ext, []).append(filename)\n\nfor ext, names in sorted(groups.items()):\n    print(f"[{ext}] — {len(names)} file(s)")\n    for name in names:\n        print(f"   • {name}")'
          }
        },
        challenge: {
          brief: { ar: 'اكتب أداة تصنيف: عرّف دالة group_by_extension(files) تُعيد قاموساً مفتاحه الامتداد وقيمته قائمة الملفات. اختبرها على القائمة المعطاة واطبع كل مجموعة. هذا تدريب على النمط الذي ستستخدمه في أي سكربت أتمتة.',
                   en: 'Write a classification tool: define group_by_extension(files) returning a dict mapping each extension to its list of files. Test it on the given list and print each group. This is the pattern behind every automation script you will write.' },
          starter: { ar: 'files = ["a.pdf", "b.png", "c.csv", "d.png", "e.pdf"]\n\ndef group_by_extension(files):\n    pass\n',
                     en: 'files = ["a.pdf", "b.png", "c.csv", "d.png", "e.pdf"]\n\ndef group_by_extension(files):\n    pass\n' },
          solution: { ar: 'files = ["a.pdf", "b.png", "c.csv", "d.png", "e.pdf"]\n\n\ndef group_by_extension(files):\n    """يجمع أسماء الملفات في قاموس حسب الامتداد."""\n    groups = {}\n    for filename in files:\n        ext = filename.split(".")[-1]\n        groups.setdefault(ext, []).append(filename)\n    return groups\n\n\nresult = group_by_extension(files)\nfor ext, names in sorted(result.items()):\n    print(f"{ext}: {names}")',
                      en: 'files = ["a.pdf", "b.png", "c.csv", "d.png", "e.pdf"]\n\n\ndef group_by_extension(files):\n    """Group file names into a dict keyed by extension."""\n    groups = {}\n    for filename in files:\n        ext = filename.split(".")[-1]\n        groups.setdefault(ext, []).append(filename)\n    return groups\n\n\nresult = group_by_extension(files)\nfor ext, names in sorted(result.items()):\n    print(f"{ext}: {names}")' },
          checks: [
            { label: { ar: 'عرّفت الدالة group_by_extension', en: 'You defined group_by_extension' },
              hint:  { ar: 'اكتب ‎def group_by_extension(files):‎', en: 'Write def group_by_extension(files):' },
              test: function (r) { return isFn(r, 'group_by_extension'); } },
            { label: { ar: 'تُعيد قاموساً بثلاثة امتدادات', en: 'It returns a dict with three extensions' },
              hint:  { ar: 'استخدم ‎filename.split(".")[-1]‎ لاستخراج الامتداد', en: 'Use filename.split(".")[-1] to get the extension' },
              test: function (r) {
                return r.call('group_by_extension', [['a.pdf', 'b.png', 'c.csv', 'd.png', 'e.pdf']])
                  .then(function (o) {
                    if (!o.ok || !o.value || typeof o.value !== 'object') return false;
                    return Object.keys(o.value).length === 3;
                  });
              } },
            { label: { ar: 'امتداد png فيه ملفان', en: 'The png extension holds two files' },
              hint:  { ar: 'أضف إلى القائمة الموجودة لا تستبدلها', en: 'Append to the existing list rather than replacing it' },
              test: function (r) {
                return r.call('group_by_extension', [['a.pdf', 'b.png', 'c.csv', 'd.png', 'e.pdf']])
                  .then(function (o) {
                    return o.ok && o.value && Array.isArray(o.value.png) && o.value.png.length === 2;
                  });
              } },
            { label: { ar: 'طُبعت المجموعات الثلاث', en: 'All three groups were printed' },
              hint:  { ar: 'مُرّ على ‎result.items()‎ واطبع كل مجموعة', en: 'Loop over result.items() and print each group' },
              test: function (r) { return r.ok && r.lines.length >= 3; } }
          ]
        },
        quiz: [
          { q: { ar: 'ما وظيفة البيئة الافتراضية venv؟', en: 'What is a venv virtual environment for?' },
            options: [ { ar: 'تسريع بايثون', en: 'Making Python faster' },
                       { ar: 'عزل مكتبات كل مشروع عن غيره', en: 'Isolating each project\'s libraries from the others' },
                       { ar: 'تشغيل بايثون بلا تثبيت', en: 'Running Python without installing it' },
                       { ar: 'ترجمة الكود', en: 'Compiling the code' } ],
            answer: 1,
            why: { ar: 'تمنع تعارض النسخ حين يحتاج مشروعان نسختين مختلفتين من مكتبة واحدة.',
                   en: 'It prevents version conflicts when two projects need different versions of the same library.' } },
          { q: { ar: 'ما أداة تثبيت المكتبات في بايثون؟', en: 'What is Python\'s package installer?' },
            options: [ { ar: 'npm', en: 'npm' }, { ar: 'pip', en: 'pip' }, { ar: 'apt', en: 'apt' }, { ar: 'git', en: 'git' } ],
            answer: 1,
            why: { ar: '‎pip install اسم_المكتبة‎ يجلبها من مستودع PyPI.',
                   en: 'pip install package_name fetches it from the PyPI repository.' } },
          { q: { ar: 'ما أفضل خطوة بعد إتقان الأساسيات؟', en: 'What is the best step after mastering the basics?' },
            options: [ { ar: 'حفظ كل دوال المكتبة القياسية', en: 'Memorising the entire standard library' },
                       { ar: 'بناء مشروع صغير حقيقي وإنهاؤه', en: 'Building a small real project and finishing it' },
                       { ar: 'تعلّم لغة أخرى فوراً', en: 'Immediately learning another language' },
                       { ar: 'قراءة الوثائق كاملة', en: 'Reading the complete documentation' } ],
            answer: 1,
            why: { ar: 'المشروع يجبرك على حلّ مشاكل حقيقية، وهو ما يرسّخ التعلّم فعلاً.',
                   en: 'A project forces you to solve real problems, which is what actually cements learning.' } }
        ]
      }
    ]
  });

  /* ===========================================================
     المشروع الختامي / Final project
     =========================================================== */
  var PROJECT = {
    title: { ar: 'متتبّع المصروفات', en: 'The expense tracker' },
    intro: {
      ar: 'حان وقت الجمع بين كل ما تعلّمته في برنامج واحد حقيقي. ستبني متتبّع مصروفات كاملاً: قائمة من القواميس، دوال نقيّة تحسب وتُلخّص، وتقرير منسّق بـ f-strings. أنجز الخطوات بالترتيب واضغط «تحقّق» في أي وقت لترى ما أنجزته وما بقي.',
      en: 'Time to combine everything you have learned into one real program. You will build a complete expense tracker: a list of dictionaries, pure functions that compute and summarise, and a formatted report built with f-strings. Work through the steps in order and press Check at any time to see what is done and what remains.'
    },
    starter: {
      ar: '# متتبّع المصروفات — المشروع الختامي\n\n# 1) قائمة المصروفات: كل عنصر قاموس فيه name و amount و category\nexpenses = [\n    {"name": "قهوة", "amount": 18.5, "category": "طعام"},\n    {"name": "وقود", "amount": 120.0, "category": "مواصلات"},\n    {"name": "غداء", "amount": 45.0, "category": "طعام"},\n    {"name": "كتاب", "amount": 62.0, "category": "تعليم"},\n    {"name": "تاكسي", "amount": 30.0, "category": "مواصلات"},\n]\n\n# 2) دالة تُعيد المجموع الكلي\ndef total_spent(items):\n    pass\n\n\n# 3) دالة تُعيد قاموساً: التصنيف → مجموع مصروفاته\ndef totals_by_category(items):\n    pass\n\n\n# 4) دالة تُعيد قاموس أغلى مصروف\ndef most_expensive(items):\n    pass\n\n\n# 5) دالة تضيف مصروفاً وتُعيد قائمة جديدة (بلا تعديل الأصلية)\ndef add_expense(items, name, amount, category):\n    pass\n\n\n# 6) اطبع تقريراً: المجموع، ومجموع كل تصنيف، وأغلى مصروف\n',
      en: '# Expense tracker — the final project\n\n# 1) the expenses list: each item a dict with name, amount and category\nexpenses = [\n    {"name": "coffee", "amount": 18.5, "category": "food"},\n    {"name": "fuel", "amount": 120.0, "category": "transport"},\n    {"name": "lunch", "amount": 45.0, "category": "food"},\n    {"name": "book", "amount": 62.0, "category": "education"},\n    {"name": "taxi", "amount": 30.0, "category": "transport"},\n]\n\n# 2) a function returning the grand total\ndef total_spent(items):\n    pass\n\n\n# 3) a function returning a dict: category → its total\ndef totals_by_category(items):\n    pass\n\n\n# 4) a function returning the most expensive expense dict\ndef most_expensive(items):\n    pass\n\n\n# 5) a function that adds an expense and returns a NEW list (original untouched)\ndef add_expense(items, name, amount, category):\n    pass\n\n\n# 6) print a report: the total, each category total, and the priciest item\n'
    },
    solution: {
      ar: '# متتبّع المصروفات — المشروع الختامي\n\nexpenses = [\n    {"name": "قهوة", "amount": 18.5, "category": "طعام"},\n    {"name": "وقود", "amount": 120.0, "category": "مواصلات"},\n    {"name": "غداء", "amount": 45.0, "category": "طعام"},\n    {"name": "كتاب", "amount": 62.0, "category": "تعليم"},\n    {"name": "تاكسي", "amount": 30.0, "category": "مواصلات"},\n]\n\n\ndef total_spent(items):\n    """يُعيد مجموع كل المبالغ."""\n    return sum(item["amount"] for item in items)\n\n\ndef totals_by_category(items):\n    """يُعيد قاموساً يربط كل تصنيف بمجموع مصروفاته."""\n    totals = {}\n    for item in items:\n        category = item["category"]\n        totals[category] = totals.get(category, 0) + item["amount"]\n    return totals\n\n\ndef most_expensive(items):\n    """يُعيد قاموس أغلى مصروف، أو None لقائمة فارغة."""\n    if not items:\n        return None\n    return max(items, key=lambda item: item["amount"])\n\n\ndef add_expense(items, name, amount, category):\n    """يُعيد قائمة جديدة فيها المصروف مضافاً، بلا تعديل الأصلية."""\n    new_items = items.copy()\n    new_items.append({"name": name, "amount": amount, "category": category})\n    return new_items\n\n\n# التقرير\nprint("=" * 34)\nprint("تقرير المصروفات")\nprint("=" * 34)\n\nprint(f"عدد المصروفات: {len(expenses)}")\nprint(f"المجموع الكلي: {total_spent(expenses):.2f}")\nprint("-" * 34)\n\nfor category, amount in sorted(totals_by_category(expenses).items()):\n    print(f"{category:<12} {amount:>8.2f}")\n\nprint("-" * 34)\ntop = most_expensive(expenses)\nprint(f"الأغلى: {top[\'name\']} بمبلغ {top[\'amount\']:.2f}")\n\nupdated = add_expense(expenses, "دواء", 75.0, "صحة")\nprint(f"بعد الإضافة: {len(updated)} مصروفاً، والأصلية ما زالت {len(expenses)}")',
      en: '# Expense tracker — the final project\n\nexpenses = [\n    {"name": "coffee", "amount": 18.5, "category": "food"},\n    {"name": "fuel", "amount": 120.0, "category": "transport"},\n    {"name": "lunch", "amount": 45.0, "category": "food"},\n    {"name": "book", "amount": 62.0, "category": "education"},\n    {"name": "taxi", "amount": 30.0, "category": "transport"},\n]\n\n\ndef total_spent(items):\n    """Return the sum of every amount."""\n    return sum(item["amount"] for item in items)\n\n\ndef totals_by_category(items):\n    """Return a dict mapping each category to its total."""\n    totals = {}\n    for item in items:\n        category = item["category"]\n        totals[category] = totals.get(category, 0) + item["amount"]\n    return totals\n\n\ndef most_expensive(items):\n    """Return the priciest expense dict, or None for an empty list."""\n    if not items:\n        return None\n    return max(items, key=lambda item: item["amount"])\n\n\ndef add_expense(items, name, amount, category):\n    """Return a new list with the expense added, leaving the original alone."""\n    new_items = items.copy()\n    new_items.append({"name": name, "amount": amount, "category": category})\n    return new_items\n\n\n# the report\nprint("=" * 34)\nprint("EXPENSE REPORT")\nprint("=" * 34)\n\nprint(f"Entries: {len(expenses)}")\nprint(f"Grand total: {total_spent(expenses):.2f}")\nprint("-" * 34)\n\nfor category, amount in sorted(totals_by_category(expenses).items()):\n    print(f"{category:<12} {amount:>8.2f}")\n\nprint("-" * 34)\ntop = most_expensive(expenses)\nprint(f"Priciest: {top[\'name\']} at {top[\'amount\']:.2f}")\n\nupdated = add_expense(expenses, "medicine", 75.0, "health")\nprint(f"After adding: {len(updated)} entries, original still {len(expenses)}")'
    },
    checks: [
      { label: { ar: 'البرنامج يعمل كاملاً بلا أي خطأ', en: 'The whole program runs with no errors' },
        hint:  { ar: 'استبدل كل ‎pass‎ بجسد الدالة الحقيقي', en: 'Replace every pass with the real function body' },
        test: function (r) { return r.ok; } },
      { label: { ar: 'total_spent تُعيد المجموع الصحيح 275.5', en: 'total_spent returns the correct total, 275.5' },
        hint:  { ar: 'استخدم ‎sum(item["amount"] for item in items)‎', en: 'Use sum(item["amount"] for item in items)' },
        test: function (r) {
          if (!isFn(r, 'total_spent')) return false;
          var data = r.val('expenses');
          if (!Array.isArray(data)) return false;
          return r.call('total_spent', [data]).then(function (o) {
            return o.ok && near(o.value, 275.5, 1e-6);
          });
        } },
      { label: { ar: 'totals_by_category تُعيد قاموساً بثلاثة تصنيفات', en: 'totals_by_category returns a dict with three categories' },
        hint:  { ar: 'راكم في قاموس عبر ‎totals.get(category, 0)‎', en: 'Accumulate into a dict using totals.get(category, 0)' },
        test: function (r) {
          if (!isFn(r, 'totals_by_category')) return false;
          var data = r.val('expenses');
          if (!Array.isArray(data)) return false;
          return r.call('totals_by_category', [data]).then(function (o) {
            if (!o.ok || !o.value || typeof o.value !== 'object') return false;
            var keys = Object.keys(o.value);
            if (keys.length !== 3) return false;
            var maxVal = Math.max.apply(null, keys.map(function (k) { return o.value[k]; }));
            return near(maxVal, 150, 1e-6);   /* المواصلات: 120 + 30 */
          });
        } },
      { label: { ar: 'most_expensive تُعيد المصروف الأغلى (120.0)', en: 'most_expensive returns the priciest expense (120.0)' },
        hint:  { ar: 'استخدم ‎max(items, key=lambda item: item["amount"])‎', en: 'Use max(items, key=lambda item: item["amount"])' },
        test: function (r) {
          if (!isFn(r, 'most_expensive')) return false;
          var data = r.val('expenses');
          if (!Array.isArray(data)) return false;
          return r.call('most_expensive', [data]).then(function (o) {
            return o.ok && o.value && near(o.value.amount, 120, 1e-6);
          });
        } },
      { label: { ar: 'add_expense تُعيد قائمة جديدة ولا تعدّل الأصلية', en: 'add_expense returns a new list and never modifies the original' },
        hint:  { ar: 'انسخ بـ ‎items.copy()‎ قبل الإضافة', en: 'Copy with items.copy() before appending' },
        test: function (r) {
          if (!isFn(r, 'add_expense')) return false;
          var data = r.val('expenses');
          if (!Array.isArray(data) || data.length !== 5) return false;
          return r.call('add_expense', [data, 'x', 10, 'y']).then(function (o) {
            return o.ok && Array.isArray(o.value) && o.value.length === 6;
          });
        } },
      { label: { ar: 'التقرير مطبوع بـ f-strings في خمسة أسطر فأكثر', en: 'The report is printed with f-strings across five or more lines' },
        hint:  { ar: 'اطبع المجموع وكل تصنيف والأغلى بصيغة ‎f"{value:.2f}"‎', en: 'Print the total, each category and the priciest using f"{value:.2f}"' },
        test: function (r) {
          return r.src(/f["']/) && r.lines.length >= 5 && /275\.5|275\.50/.test(r.stdout);
        } }
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
