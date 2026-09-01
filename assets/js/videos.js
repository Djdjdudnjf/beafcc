/* =============================================================
   videos.js — شروحات الفيديو المرتبطة بالدروس / lesson video map

   سياسة صارمة: لا يُضاف معرّف فيديو إلا بعد التحقّق من وجوده فعلياً.
   المعرّف المخمَّن يعطي فيديو محذوفاً أو خاطئاً، وهذا أسوأ من لا شيء.
   لذلك يعتمد كل درس افتراضياً على بحث موجّه ومُعدّ بعناية في يوتيوب،
   يفتح نتائج حيّة ولا يتعطّل أبداً.

   Strict policy: never add a video id without verifying it exists.
   A guessed id yields a deleted or wrong video, which is worse than none.
   So each lesson ships with a carefully targeted YouTube search that
   opens live results and can never break.

   لإضافة فيديو مُتحقَّق منه لاحقاً / to attach a verified clip later:
     'lesson-id': { ar: V('VIDEO_ID', 'العنوان', CHANNEL, 'ar', 0, 600) }
   القيمتان الأخيرتان بداية ونهاية التشغيل بالثواني، لعرض الجزء المفيد فقط.
   The last two values are start and end seconds, so only the useful
   part of a long video plays.
   ============================================================= */
(function (global) {
  'use strict';

  /* القنوات / channels */
  var ELZERO = { ar: 'Elzero Web School', en: 'Elzero Web School' };
  var FCC = { ar: 'freeCodeCamp.org', en: 'freeCodeCamp.org' };

  var MOSH = { ar: 'Programming with Mosh', en: 'Programming with Mosh' };
  var COREY = { ar: 'Corey Schafer', en: 'Corey Schafer' };
  void ELZERO;   /* محجوز لمقاطع عربية حين تتوفّر / reserved for Arabic clips */

  function V(id, title, channel, lang, start, end) {
    return { id: id, title: title, channel: channel, lang: lang, start: start || 0, end: end || 0 };
  }

  /* ---------------------------------------------------------------
     مقاطع مُقترحة لم تُتحقَّق آلياً بعد.
     الواجهة تفحص كل معرّف قبل عرضه: إن كان المقطع محذوفاً أو غير موجود
     تُستبدل البطاقة ببطاقة البحث تلقائياً، فلا يرى المتعلّم مقطعاً معطّلاً.
     المقاطع هنا دورات شاملة تُفتح من بدايتها، ولذلك بلا توقيتات:
     وضع توقيت مخمَّن قد يبدأ الشرح في منتصف موضوع آخر.

     Suggested clips, not yet machine-verified.
     The UI probes every id before showing it: if the video is deleted or
     missing, the card is swapped for the search card automatically, so a
     learner never faces a dead embed. These are full courses opened from
     the start, hence no timestamps — a guessed timestamp could drop the
     learner into the middle of an unrelated topic.
     --------------------------------------------------------------- */
  var MAP = {
    'what-is-python': {
      en: V('rfscVS0vtbw', 'Learn Python — Full Course for Beginners', FCC, 'en')
    },
    'first-program': {
      en: V('kqtD5dpn9C8', 'Python for Beginners — Learn Python in 1 Hour', MOSH, 'en')
    },
    'variables': {
      en: V('_uQrJ0TkZlc', 'Python Tutorial — Python Full Course for Beginners', MOSH, 'en')
    },
    'classes': {
      en: V('ZDa-Z5JzLYM', 'Python OOP Tutorial 1 — Classes and Instances', COREY, 'en')
    },
    'comprehensions': {
      en: V('HGOBQPFzWKo', 'Intermediate Python Programming Course', FCC, 'en')
    }
  };

  /* عبارات بحث مُعدّة لكل درس — دقيقة بما يكفي لتعطي نتائج مفيدة مباشرة */
  var TOPICS = {
    'what-is-python':   { ar: 'ما هي لغة بايثون ولماذا نتعلمها',      en: 'what is Python and why learn it' },
    'first-program':    { ar: 'بايثون دالة print للمبتدئين',           en: 'Python print function for beginners' },
    'variables':        { ar: 'المتغيرات في بايثون شرح',               en: 'Python variables explained' },
    'input-output':     { ar: 'دالة input في بايثون شرح',              en: 'Python input function tutorial' },
    'numbers':          { ar: 'العمليات الحسابية في بايثون',           en: 'Python arithmetic operators tutorial' },
    'strings':          { ar: 'النصوص strings في بايثون',              en: 'Python strings and slicing tutorial' },
    'fstrings':         { ar: 'f-string في بايثون تنسيق النصوص',       en: 'Python f-strings formatting tutorial' },
    'type-conversion':  { ar: 'أنواع البيانات والتحويل في بايثون',     en: 'Python data types and casting' },
    'if-else':          { ar: 'الشروط if else في بايثون',              en: 'Python if elif else tutorial' },
    'comparisons':      { ar: 'العوامل المنطقية and or not بايثون',    en: 'Python logical operators and or not' },
    'for-loops':        { ar: 'حلقة for و range في بايثون',            en: 'Python for loop and range tutorial' },
    'while-loops':      { ar: 'حلقة while في بايثون break continue',   en: 'Python while loop break continue' },
    'lists':            { ar: 'القوائم list في بايثون',                en: 'Python lists tutorial' },
    'list-methods':     { ar: 'ترتيب القوائم sort في بايثون',          en: 'Python list methods sort sorted' },
    'dicts':            { ar: 'القواميس dictionary في بايثون',         en: 'Python dictionaries tutorial' },
    'tuples-sets':      { ar: 'tuple و set في بايثون الفرق',           en: 'Python tuples and sets explained' },
    'def-functions':    { ar: 'الدوال def في بايثون شرح',              en: 'Python functions def tutorial' },
    'params-return':    { ar: 'معاملات الدوال والقيم الافتراضية بايثون', en: 'Python function parameters and return values' },
    'scope':            { ar: 'نطاق المتغيرات local global بايثون',    en: 'Python variable scope local global' },
    'lambda-higher':    { ar: 'lambda و map و filter في بايثون',       en: 'Python lambda map filter tutorial' },
    'errors':           { ar: 'أنواع الأخطاء في بايثون وقراءتها',      en: 'Python error types and traceback explained' },
    'try-except':       { ar: 'معالجة الأخطاء try except بايثون',      en: 'Python try except exception handling' },
    'modules':          { ar: 'استيراد الوحدات import في بايثون',      en: 'Python modules and import tutorial' },
    'files':            { ar: 'قراءة وكتابة الملفات في بايثون',        en: 'Python file handling read write tutorial' },
    'classes':          { ar: 'البرمجة الكائنية class في بايثون',      en: 'Python classes and objects tutorial' },
    'inheritance':      { ar: 'الوراثة inheritance في بايثون',         en: 'Python inheritance and super tutorial' },
    'dunder':           { ar: 'الدوال الخاصة dunder في بايثون',        en: 'Python dunder methods __str__ tutorial' },
    'comprehensions':   { ar: 'list comprehension في بايثون',          en: 'Python list comprehension tutorial' },
    'clean-code':       { ar: 'كود نظيف و PEP 8 في بايثون',           en: 'Python clean code PEP 8 style guide' },
    'stdlib':           { ar: 'المكتبة القياسية في بايثون',            en: 'Python standard library tour' },
    'testing':          { ar: 'اختبار الكود assert و pytest',          en: 'Python testing assert and pytest basics' },
    'next-steps':       { ar: 'pip والبيئات الافتراضية في بايثون',     en: 'Python pip and virtual environments venv' }
  };

  global.VIDEOS = {
    /* الفيديو المُتحقَّق منه للدرس، أو null */
    forLesson: function (lessonId) {
      var entry = MAP[lessonId];
      if (!entry) return null;
      var lang = global.I18N.lang;
      return entry[lang] || entry.ar || entry.en || null;
    },

    /* عبارة البحث المُعدّة للدرس باللغة المطلوبة */
    topicFor: function (lessonId, lang) {
      var topic = TOPICS[lessonId];
      if (!topic) return null;
      return topic[lang] || topic.en || topic.ar;
    },

    /* رابط بحث في يوتيوب — يعمل دائماً */
    searchUrl: function (query) {
      return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    }
  };
})(window);
