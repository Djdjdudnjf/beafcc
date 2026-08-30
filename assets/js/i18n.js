/* =============================================================
   i18n.js — نصوص الواجهة بالعربية والإنجليزية
   Interface strings for Arabic + English
   ============================================================= */
(function (global) {
  'use strict';

  var STRINGS = {
    /* الهوية / Brand */
    brandName:        { ar: 'إتقان HTML',            en: 'Etqan HTML' },
    brandTag:         { ar: 'تعلّم من الصفر',        en: 'Learn from zero' },
    skipToContent:    { ar: 'تخطَّ إلى المحتوى',      en: 'Skip to content' },

    /* التنقل / Navigation */
    navHome:          { ar: 'الرئيسية',              en: 'Home' },
    navCurriculum:    { ar: 'المنهج',                en: 'Curriculum' },
    navReference:     { ar: 'المرجع',                en: 'Reference' },
    navProject:       { ar: 'المشروع',               en: 'Project' },
    navPlayground:    { ar: 'المحرّر',               en: 'Playground' },
    navAbout:         { ar: 'عن المنصة',             en: 'About' },
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
    heroTitleEm:      { ar: 'HTML',                  en: 'HTML' },
    heroTitleB:       { ar: ' من الصفر حتى الاحتراف', en: ' from zero to professional' },
    heroLede:         { ar: 'دروس مرتّبة خطوة بخطوة، أمثلة حيّة تتغيّر أمام عينيك، محرّر كود مدمج، وتحدٍّ عملي بعد كل درس يقول لك: يلا اكتب! كل شيء يعمل داخل متصفحك بدون أي تثبيت.',
                        en: 'Step-by-step lessons, live examples that change before your eyes, a built-in code editor, and a hands-on challenge after every lesson. Everything runs in your browser — nothing to install.' },
    heroStart:        { ar: 'ابدأ الدرس الأول',      en: 'Start the first lesson' },
    heroContinue:     { ar: 'أكمل من حيث توقفت',     en: 'Continue where you left off' },
    heroBrowse:       { ar: 'تصفّح المنهج',          en: 'Browse the curriculum' },
    statLessons:      { ar: 'درساً تفاعلياً',        en: 'interactive lessons' },
    statModules:      { ar: 'وحدات دراسية',          en: 'modules' },
    statChallenges:   { ar: 'تحدياً عملياً',         en: 'hands-on challenges' },
    statQuestions:    { ar: 'سؤال اختبار',           en: 'quiz questions' },

    featuresTitle:    { ar: 'لماذا هذه المنصة؟',     en: 'Why this platform?' },
    featuresSub:      { ar: 'كل ما تحتاجه لتتعلّم HTML فعلياً، لا أن تقرأ عنها فقط.', en: 'Everything you need to actually learn HTML — not just read about it.' },
    f1t:              { ar: 'تعلّم بالكتابة',        en: 'Learn by typing' },
    f1d:              { ar: 'في كل درس محرّر مباشر: اكتب الكود على اليمين وشاهد النتيجة فوراً على اليسار.', en: 'Every lesson has a live editor: write code on one side, see the result instantly on the other.' },
    f2t:              { ar: 'تحدٍّ بعد كل درس',      en: 'A challenge each lesson' },
    f2d:              { ar: 'مهمة عملية محدّدة، وزر «تحقّق» يفحص كودك بنداً بنداً ويخبرك بما ينقص بالضبط.', en: 'A concrete task with a Check button that inspects your code point by point and tells you exactly what is missing.' },
    f3t:              { ar: 'عربي وإنجليزي',         en: 'Arabic & English' },
    f3d:              { ar: 'بضغطة واحدة يتبدّل الموقع كاملاً — الشرح والأمثلة والاختبارات — مع اتجاه الصفحة.', en: 'One click flips the entire site — explanations, examples and quizzes — along with the page direction.' },
    f4t:              { ar: 'تقدّم محفوظ',           en: 'Saved progress' },
    f4d:              { ar: 'يتذكّر متصفحك ما أنهيته، ويعرض شريط تقدّم يحفّزك حتى آخر درس.', en: 'Your browser remembers what you finished and shows a progress bar that keeps you going.' },
    f5t:              { ar: 'مرجع سريع',             en: 'Quick reference' },
    f5d:              { ar: 'جدول بكل الوسوم المهمة مع وصفها ومثالها، قابل للبحث والتصفية في أي لحظة.', en: 'A searchable, filterable table of every important tag with its description and example.' },
    f6t:              { ar: 'مشروع ختامي',           en: 'Final project' },
    f6d:              { ar: 'تبني صفحتك الشخصية كاملة خطوة بخطوة، وتتحقّق من كل خطوة آلياً.', en: 'Build a complete personal page step by step, with each step verified automatically.' },

    modulesTitle:     { ar: 'وحدات المنهج',          en: 'Course modules' },
    modulesSub:       { ar: 'ثمانية وحدات مرتّبة من أول سطر HTML وحتى نشر موقعك على الإنترنت.', en: 'Eight ordered modules, from your first HTML line to publishing your site online.' },
    lessonsCount:     { ar: 'دروس',                  en: 'lessons' },

    /* الدرس / Lesson */
    lessonOf:         { ar: 'الدرس',                 en: 'Lesson' },
    minutes:          { ar: 'دقائق',                 en: 'min' },
    levelBeginner:    { ar: 'مبتدئ',                 en: 'Beginner' },
    levelIntermediate:{ ar: 'متوسّط',                en: 'Intermediate' },
    levelAdvanced:    { ar: 'متقدّم',                en: 'Advanced' },
    exampleTitle:     { ar: 'مثال حيّ — جرّب بنفسك', en: 'Live example — try it yourself' },
    exampleHint:      { ar: 'عدّل الكود وشاهد النتيجة تتغيّر فوراً.', en: 'Edit the code and watch the result change instantly.' },
    paneCode:         { ar: 'الكود',                 en: 'Code' },
    panePreview:      { ar: 'النتيجة',               en: 'Result' },
    run:              { ar: 'تشغيل',                 en: 'Run' },
    reset:            { ar: 'استعادة',               en: 'Reset' },
    copy:             { ar: 'نسخ',                   en: 'Copy' },
    copied:           { ar: 'تم النسخ ✓',            en: 'Copied ✓' },
    openFull:         { ar: 'فتح بملء الشاشة',       en: 'Open full screen' },

    /* التحدي / Challenge */
    challengeKicker:  { ar: 'تطبيق عملي',            en: 'Hands-on practice' },
    challengeGo:      { ar: 'يلا اكتب!',             en: 'Your turn — write it!' },
    check:            { ar: 'تحقّق من إجابتي',       en: 'Check my answer' },
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

    /* التنقل بين الدروس / Pager */
    markDone:         { ar: 'علّم الدرس كمكتمل',     en: 'Mark lesson complete' },
    markedDone:       { ar: 'مكتمل ✓',               en: 'Completed ✓' },
    prevLesson:       { ar: 'الدرس السابق',          en: 'Previous lesson' },
    nextLesson:       { ar: 'الدرس التالي',          en: 'Next lesson' },
    savedDone:        { ar: 'أحسنت! تم حفظ تقدّمك.', en: 'Nice! Progress saved.' },
    progressHint:     { ar: 'يُحفظ تقدّمك في متصفحك تلقائياً.', en: 'Your progress is saved in this browser automatically.' },

    /* المرجع / Reference */
    refTitle:         { ar: 'مرجع وسوم HTML',        en: 'HTML tag reference' },
    refSub:           { ar: 'كل الوسوم المهمة في مكان واحد — ابحث أو صفِّ حسب التصنيف.', en: 'Every important tag in one place — search or filter by category.' },
    refSearch:        { ar: 'ابحث عن وسم أو وصف…',   en: 'Search a tag or description…' },
    refAll:           { ar: 'الكل',                  en: 'All' },
    colTag:           { ar: 'الوسم',                 en: 'Tag' },
    colDesc:          { ar: 'الوصف',                 en: 'Description' },
    colExample:       { ar: 'مثال',                  en: 'Example' },
    refEmpty:         { ar: 'لا توجد نتائج مطابقة.', en: 'No matching results.' },

    /* المحرّر المستقل / Playground */
    pgTitle:          { ar: 'المحرّر الحر',          en: 'Free playground' },
    pgSub:            { ar: 'مساحة مفتوحة لتجربة أي كود HTML يخطر ببالك — يُحفظ تلقائياً في متصفحك.', en: 'An open space to try any HTML you like — auto-saved in your browser.' },

    /* المشروع / Project */
    projTitle:        { ar: 'المشروع الختامي: صفحتك الشخصية', en: 'Final project: your personal page' },
    projSub:          { ar: 'طبّق كل ما تعلّمته في صفحة واحدة كاملة. أنجز الخطوات بالترتيب واضغط «تحقّق».', en: 'Apply everything you learned in one complete page. Do the steps in order and press Check.' },
    projSteps:        { ar: 'خطوات المشروع',         en: 'Project steps' },

    /* عن المنصة / About */
    aboutTitle:       { ar: 'عن المنصة',             en: 'About this platform' },

    /* البحث / Search palette */
    paletteHint:      { ar: 'اكتب للبحث في الدروس والوسوم…', en: 'Type to search lessons and tags…' },
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
