/* =============================================================
   i18n.js — نصوص الواجهة بالعربية والإنجليزية
   Interface strings for Arabic + English
   ============================================================= */
(function (global) {
  'use strict';

  var STRINGS = {
    /* الهوية / Brand */
    brandName:        { ar: 'إتقان بايثون',          en: 'Etqan Python' },
    brandTag:         { ar: 'تعلّم من الصفر',        en: 'Learn from zero' },
    skipToContent:    { ar: 'تخطَّ إلى المحتوى',      en: 'Skip to content' },

    /* التنقل / Navigation */
    navHome:          { ar: 'الرئيسية',              en: 'Home' },
    navCurriculum:    { ar: 'المنهج',                en: 'Curriculum' },
    navReference:     { ar: 'المرجع',                en: 'Reference' },
    navProject:       { ar: 'المشروع',               en: 'Project' },
    navPlayground:    { ar: 'المحرّر',               en: 'Playground' },
    navAbout:         { ar: 'عن المنصة',             en: 'About' },
    navGameDev:       { ar: 'اصنع لعبة',             en: 'Make a game' },
    searchPlaceholder:{ ar: 'ابحث في الدروس…',       en: 'Search lessons…' },
    footNote:         { ar: 'منصّة تعليمية مفتوحة — تعمل بالكامل داخل متصفحك.', en: 'An open learning platform — runs entirely in your browser.' },

    /* التقدّم / Progress */
    progressTitle:    { ar: 'تقدّمك',                en: 'Your progress' },
    curriculumTitle:  { ar: 'المنهج الدراسي',        en: 'Curriculum' },
    resetProgress:    { ar: 'تصفير',                 en: 'Reset' },
    resetConfirm:     { ar: 'هل تريد مسح كل تقدّمك؟', en: 'Erase all your progress?' },
    progressReset:    { ar: 'تم تصفير التقدّم',      en: 'Progress reset' },
    lessonsDone:      { ar: 'درس مكتمل',             en: 'lessons done' },

    /* الرئيسية / Home */
    heroEyebrow:      { ar: 'منهج متكامل • عربي وإنجليزي', en: 'Complete course • Arabic & English' },
    heroTitleA:       { ar: 'تعلّم ',                en: 'Learn ' },
    heroTitleEm:      { ar: 'بايثون',                en: 'Python' },
    heroTitleB:       { ar: ' من الصفر حتى الاحتراف', en: ' from zero to professional' },
    heroLede:         { ar: 'دروس مرتّبة خطوة بخطوة، محرّر يشغّل بايثون حقيقية داخل متصفحك، وتحدٍّ عملي بعد كل درس يقول لك: يلا اكتب! لا تثبيت ولا حساب ولا خادم.',
                        en: 'Step-by-step lessons, an editor running real Python inside your browser, and a hands-on challenge after every lesson. No install, no account, no server.' },
    heroStart:        { ar: 'ابدأ الدرس الأول',      en: 'Start the first lesson' },
    heroContinue:     { ar: 'أكمل من حيث توقفت',     en: 'Continue where you left off' },
    heroBrowse:       { ar: 'تصفّح المنهج',          en: 'Browse the curriculum' },
    statLessons:      { ar: 'درساً تفاعلياً',        en: 'interactive lessons' },
    statModules:      { ar: 'وحدات دراسية',          en: 'modules' },
    statChallenges:   { ar: 'تحدياً عملياً',         en: 'hands-on challenges' },
    statQuestions:    { ar: 'سؤال اختبار',           en: 'quiz questions' },

    featuresTitle:    { ar: 'لماذا هذه المنصة؟',     en: 'Why this platform?' },
    featuresSub:      { ar: 'كل ما تحتاجه لتتعلّم بايثون فعلياً، لا أن تقرأ عنها فقط.', en: 'Everything you need to actually learn Python — not just read about it.' },
    f1t:              { ar: 'بايثون حقيقية في متصفحك', en: 'Real Python in your browser' },
    f1d:              { ar: 'مفسّر CPython كامل يعمل داخل الصفحة عبر WebAssembly. تكتب وتضغط تشغيل فترى المخرجات الحقيقية.', en: 'A full CPython interpreter runs inside the page via WebAssembly. Write, press Run, and see genuine output.' },
    f2t:              { ar: 'تحدٍّ بعد كل درس',      en: 'A challenge each lesson' },
    f2d:              { ar: 'مهمة عملية محدّدة، وزر «تحقّق» يشغّل كودك ويفحص نتيجته ومتغيّراته بنداً بنداً.', en: 'A concrete task, and a Check button that runs your code and inspects its output and variables point by point.' },
    f3t:              { ar: 'عربي وإنجليزي',         en: 'Arabic & English' },
    f3d:              { ar: 'بضغطة واحدة يتبدّل الموقع كاملاً — الشرح والأمثلة والاختبارات — مع اتجاه الصفحة.', en: 'One click flips the entire site — explanations, examples and quizzes — along with the page direction.' },
    f4t:              { ar: 'تقدّم محفوظ',           en: 'Saved progress' },
    f4d:              { ar: 'يتذكّر متصفحك ما أنهيته، ويعرض شريط تقدّم يحفّزك حتى آخر درس.', en: 'Your browser remembers what you finished and shows a progress bar that keeps you going.' },
    f5t:              { ar: 'مرجع سريع',             en: 'Quick reference' },
    f5d:              { ar: 'جدول بكل ما يهمّك من دوال وكلمات وأخطاء مع وصفها ومثالها، قابل للبحث والتصفية.', en: 'A searchable, filterable table of the functions, keywords and errors that matter, each with an example.' },
    f6t:              { ar: 'مشروع ختامي',           en: 'Final project' },
    f6d:              { ar: 'تبني متتبّع مصروفات كاملاً خطوة بخطوة، ويُتحقَّق من كل دالة بتشغيلها فعلياً.', en: 'Build a complete expense tracker step by step, with every function verified by actually running it.' },

    modulesTitle:     { ar: 'وحدات المنهج',          en: 'Course modules' },
    modulesSub:       { ar: 'ثماني وحدات مرتّبة من أول سطر بايثون وحتى الأصناف والاختبار والكود النظيف.', en: 'Eight ordered modules, from your first line of Python to classes, testing and clean code.' },
    lessonsCount:     { ar: 'دروس',                  en: 'lessons' },

    /* الدرس / Lesson */
    lessonOf:         { ar: 'الدرس',                 en: 'Lesson' },
    minutes:          { ar: 'دقائق',                 en: 'min' },
    levelBeginner:    { ar: 'مبتدئ',                 en: 'Beginner' },
    levelIntermediate:{ ar: 'متوسّط',                en: 'Intermediate' },
    levelAdvanced:    { ar: 'متقدّم',                en: 'Advanced' },
    exampleTitle:     { ar: 'مثال حيّ — جرّب بنفسك', en: 'Live example — try it yourself' },
    exampleHint:      { ar: 'عدّل الكود واضغط «تشغيل» لترى المخرجات.', en: 'Edit the code and press Run to see the output.' },
    paneCode:         { ar: 'الكود',                 en: 'Code' },
    paneOutput:       { ar: 'المخرجات',              en: 'Output' },
    run:              { ar: 'تشغيل',                 en: 'Run' },
    stop:             { ar: 'إيقاف',                 en: 'Stop' },
    reset:            { ar: 'استعادة',               en: 'Reset' },
    copy:             { ar: 'نسخ',                   en: 'Copy' },
    copied:           { ar: 'تم النسخ ✓',            en: 'Copied ✓' },
    openFull:         { ar: 'فتح بملء الشاشة',       en: 'Open full screen' },

    /* المدخلات / stdin */
    stdinLabel:       { ar: 'مدخلات البرنامج',       en: 'Program input' },
    stdinPlaceholder: { ar: 'سطر لكل نداء input()',  en: 'One line per input() call' },
    stdinHint:        { ar: 'كودك يستخدم ‎input()‎ — اكتب هنا ما «سيكتبه المستخدم»، سطراً لكل نداء.',
                        en: 'Your code uses input() — type here what "the user" would enter, one line per call.' },

    /* حالات وحدة الإخراج / console states */
    consoleIdle:      { ar: 'اضغط «تشغيل» لتنفيذ الكود', en: 'Press Run to execute the code' },
    consoleIdleHint:  { ar: 'أو استخدم Ctrl + Enter',   en: 'or press Ctrl + Enter' },
    pyLoading:        { ar: 'جارٍ تحميل بايثون…',       en: 'Loading Python…' },
    pyLoadingHint:    { ar: 'أول تشغيل فقط: يُنزَّل المفسّر مرة واحدة ثم يصير كل شيء فورياً.',
                        en: 'First run only: the interpreter downloads once, then everything is instant.' },
    runRunning:       { ar: 'جارٍ التنفيذ…',            en: 'Running…' },
    runNoOutput:      { ar: 'تمّ التنفيذ بلا مخرجات',   en: 'Ran successfully with no output' },
    runNoOutputHint:  { ar: 'استخدم ‎print()‎ لعرض قيمة.', en: 'Use print() to display a value.' },
    runTimeout:       { ar: 'استغرق البرنامج وقتاً طويلاً وأُوقف', en: 'The program took too long and was stopped' },
    runTimeoutHint:   { ar: 'غالباً حلقة لا تنتهي: تأكّد أن شرط ‎while‎ يتغيّر داخلها.',
                        en: 'Usually an endless loop: make sure the while condition changes inside it.' },
    runStopped:       { ar: 'أوقفتَ التنفيذ',           en: 'You stopped the program' },
    runStoppedHint:   { ar: 'اضغط «تشغيل» للمحاولة من جديد.', en: 'Press Run to try again.' },
    runLoadFail:      { ar: 'تعذّر تحميل بايثون',       en: 'Could not load Python' },
    runLoadFailHint:  { ar: 'تحقّق من اتصالك بالإنترنت — يُنزَّل المفسّر مرة واحدة ثم يعمل بلا اتصال.',
                        en: 'Check your connection — the interpreter downloads once, then works offline.' },
    runUnsupported:   { ar: 'متصفحك لا يدعم تشغيل بايثون', en: 'Your browser cannot run Python here' },
    runUnsupportedHint:{ ar: 'يحتاج المحرّر إلى متصفّح حديث يدعم WebAssembly وWeb Workers.',
                        en: 'The editor needs a modern browser with WebAssembly and Web Worker support.' },

    /* التحدي / Challenge */
    challengeKicker:  { ar: 'تطبيق عملي',            en: 'Hands-on practice' },
    challengeGo:      { ar: 'يلا اكتب!',             en: 'Your turn — write it!' },
    check:            { ar: 'تحقّق من إجابتي',       en: 'Check my answer' },
    checkRunning:     { ar: 'جارٍ تشغيل كودك وفحصه…', en: 'Running and checking your code…' },
    showSolution:     { ar: 'أظهر الحل',             en: 'Show solution' },
    hideSolution:     { ar: 'أخفِ الحل',             en: 'Hide solution' },
    challengePass:    { ar: 'ممتاز! أنجزت التحدي 🎉', en: 'Excellent! Challenge complete 🎉' },
    challengeFail:    { ar: 'قريب! راجع البنود الحمراء وحاول مرة أخرى.', en: 'Close! Review the red items and try again.' },
    tasksTitle:       { ar: 'المطلوب منك',           en: 'What you must do' },

    /* الاختبار / Quiz */
    quizTitle:        { ar: 'اختبر فهمك',            en: 'Test your understanding' },
    quizSub:          { ar: 'اختر الإجابة الصحيحة — التصحيح فوري مع الشرح.', en: 'Pick the right answer — instant feedback with an explanation.' },
    quizScore:        { ar: 'نتيجتك:',               en: 'Your score:' },
    quizPerfect:      { ar: 'إجابات كاملة! 🏆',      en: 'Perfect score! 🏆' },
    quizRetry:        { ar: 'أعد المحاولة',          en: 'Try again' },
    correct:          { ar: 'إجابة صحيحة',           en: 'Correct' },
    incorrect:        { ar: 'إجابة خاطئة',           en: 'Incorrect' },

    /* الفيديو / Video */
    videoTitle:       { ar: 'شرح بالفيديو',          en: 'Video explanation' },
    videoOpen:        { ar: 'افتح على يوتيوب ↗',     en: 'Open on YouTube ↗' },
    videoPlay:        { ar: 'شغّل الفيديو',          en: 'Play video' },
    videoNote:        { ar: 'يُحمَّل الفيديو من يوتيوب عند الضغط فقط.', en: 'The video loads from YouTube only when you click.' },
    videoSearchLede:  { ar: 'تريد شرحاً مرئياً لهذا الدرس؟ هذه عبارة بحث مُعدّة لموضوعه بالضبط:',
                        en: 'Want a video explanation of this lesson? Here is a search prepared for exactly this topic:' },
    videoSearchAr:    { ar: 'شرح بالعربية',          en: 'Search in Arabic' },
    videoSearchEn:    { ar: 'شرح بالإنجليزية',       en: 'Search in English' },
    videoSearchNote:  { ar: 'يفتح نتائج يوتيوب في تبويب جديد — نعرض بحثاً حيّاً بدل مقطع ثابت قد يُحذف.',
                        en: 'Opens YouTube results in a new tab — a live search rather than a fixed clip that may be taken down.' },

    /* التنقل بين الدروس / Pager */
    markDone:         { ar: 'علّم الدرس كمكتمل',     en: 'Mark lesson complete' },
    markedDone:       { ar: 'مكتمل ✓',               en: 'Completed ✓' },
    prevLesson:       { ar: 'الدرس السابق',          en: 'Previous lesson' },
    nextLesson:       { ar: 'الدرس التالي',          en: 'Next lesson' },
    savedDone:        { ar: 'أحسنت! تم حفظ تقدّمك.', en: 'Nice! Progress saved.' },
    progressHint:     { ar: 'يُحفظ تقدّمك في متصفحك تلقائياً.', en: 'Your progress is saved in this browser automatically.' },

    /* المرجع / Reference */
    refTitle:         { ar: 'مرجع بايثون السريع',    en: 'Python quick reference' },
    refSub:           { ar: 'الكلمات والدوال والأخطاء المهمة في مكان واحد — ابحث أو صفِّ حسب التصنيف.', en: 'The keywords, functions and errors that matter, in one place — search or filter by category.' },
    refSearch:        { ar: 'ابحث عن دالة أو وصف…',  en: 'Search a function or description…' },
    refAll:           { ar: 'الكل',                  en: 'All' },
    colTag:           { ar: 'العنصر',                en: 'Item' },
    colDesc:          { ar: 'الوصف',                 en: 'Description' },
    colExample:       { ar: 'مثال',                  en: 'Example' },
    refEmpty:         { ar: 'لا توجد نتائج مطابقة.', en: 'No matching results.' },

    /* المحرّر المستقل / Playground */
    pgTitle:          { ar: 'المحرّر الحر',          en: 'Free playground' },
    pgSub:            { ar: 'مساحة مفتوحة لتجربة أي كود بايثون يخطر ببالك — يُحفظ تلقائياً في متصفحك.', en: 'An open space to try any Python you like — auto-saved in your browser.' },

    /* المشروع / Project */
    projTitle:        { ar: 'المشروع الختامي: متتبّع المصروفات', en: 'Final project: the expense tracker' },
    projSub:          { ar: 'طبّق كل ما تعلّمته في برنامج واحد كامل. أنجز الخطوات بالترتيب واضغط «تحقّق».', en: 'Apply everything you learned in one complete program. Do the steps in order and press Check.' },
    projSteps:        { ar: 'خطوات المشروع',         en: 'Project steps' },

    /* عن المنصة / About */
    aboutTitle:       { ar: 'عن المنصة',             en: 'About this platform' },

    /* البحث / Search palette */
    paletteHint:      { ar: 'اكتب للبحث في الدروس والمرجع…', en: 'Type to search lessons and the reference…' },
    paletteNav:       { ar: 'للتنقل',                en: 'to navigate' },
    paletteOpen:      { ar: 'للفتح',                 en: 'to open' },
    paletteClose:     { ar: 'للإغلاق',               en: 'to close' },
    paletteEmpty:     { ar: 'لا توجد نتائج',         en: 'No results' },
    notFound:         { ar: 'الصفحة غير موجودة',     en: 'Page not found' },
    backHome:         { ar: 'العودة للرئيسية',       en: 'Back home' }
  };

  var LANG_KEY = 'etqan.lang';

  var I18N = {
    strings: STRINGS,

    lang: (function () {
      try { return localStorage.getItem(LANG_KEY) || 'ar'; } catch (e) { return 'ar'; }
    })(),

    /* نص واجهة حسب المفتاح */
    t: function (key) {
      var entry = STRINGS[key];
      if (!entry) return key;
      return entry[I18N.lang] || entry.ar || key;
    },

    /* قيمة ثنائية اللغة {ar,en} أو نص عادي */
    pick: function (value) {
      if (value == null) return '';
      if (typeof value === 'string') return value;
      return value[I18N.lang] != null ? value[I18N.lang] : (value.ar || '');
    },

    setLang: function (lang) {
      I18N.lang = lang === 'en' ? 'en' : 'ar';
      try { localStorage.setItem(LANG_KEY, I18N.lang); } catch (e) {}
      var el = document.documentElement;
      el.lang = I18N.lang;
      el.dir = I18N.lang === 'ar' ? 'rtl' : 'ltr';
    },

    /* تحديث كل عنصر يحمل data-i18n */
    apply: function (root) {
      var scope = root || document;
      var nodes = scope.querySelectorAll('[data-i18n]');
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].textContent = I18N.t(nodes[i].getAttribute('data-i18n'));
      }
    },

    isRTL: function () { return I18N.lang === 'ar'; }
  };

  global.I18N = I18N;
  global.t = I18N.t;
})(window);
