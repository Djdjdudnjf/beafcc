/* =============================================================
   videos.js — مقاطع شرح مرتبطة بالدروس / lesson video map
   كل معرّف تم التحقق منه عبر البحث قبل إضافته.
   Every id was verified through search before being added.
   ============================================================= */
(function (global) {
  'use strict';

  /* القنوات / channels */
  var ELZERO = { ar: 'Elzero Web School', en: 'Elzero Web School' };
  var FCC = { ar: 'freeCodeCamp.org', en: 'freeCodeCamp.org' };

  function V(id, title, channel, lang, start, end) {
    return { id: id, title: title, channel: channel, lang: lang, start: start || 0, end: end || 0 };
  }

  var MAP = {
    'what-is-html': {
      ar: V('6QAELgirvjs', 'مقدمة: ما الذي تحتاجه لتتعلّم HTML', ELZERO, 'ar', 0, 600),
      en: V('pQN-pnXPaVg', 'HTML Full Course — Build a Website Tutorial', FCC, 'en', 0, 720)
    },
    'how-web-works': {
      ar: V('7LxA9qXUY5k', 'العناصر والمتصفح: كيف تُقرأ صفحتك', ELZERO, 'ar', 0, 480)
    },
    'first-page': {
      ar: V('QG5aEmS9Fu0', 'أول مشروع وأول صفحة', ELZERO, 'ar', 0, 540),
      en: V('916GWv2Qs08', 'HTML Tutorial — Website Crash Course for Beginners', FCC, 'en', 0, 720)
    },
    'document-structure': {
      ar: V('dVgTBEYCseU', 'وسم head والعناصر المتداخلة', ELZERO, 'ar', 0, 420)
    },
    'comments-attributes': {
      ar: V('nCpNsMgyzh4', 'سمات العناصر (Attributes)', ELZERO, 'ar', 0, 480)
    },
    'lists': {
      ar: V('8Z7zR-UGjcQ', 'القوائم: ul وol وdl', ELZERO, 'ar', 0, 540)
    },
    'tables': {
      ar: V('SUW49Jjxvac', 'الجداول في HTML', ELZERO, 'ar', 0, 600)
    },
    'forms-basics': {
      ar: V('inC9gWjNMJI', 'النماذج: أنواع الحقول والتسميات', ELZERO, 'ar', 0, 480)
    },
    'form-controls': {
      ar: V('HGB42mnD0o4', 'النماذج: select وtextarea', ELZERO, 'ar', 0, 420)
    },
    'video-audio': {
      ar: V('oJbo28ewnL4', 'وسم الفيديو في HTML', ELZERO, 'ar', 0, 360)
    }
  };

  global.VIDEOS = {
    /* يعيد الفيديو المناسب للغة الحالية، وإلا أي فيديو متاح للدرس */
    forLesson: function (lessonId) {
      var entry = MAP[lessonId];
      if (!entry) return null;
      var lang = global.I18N.lang;
      return entry[lang] || entry.ar || entry.en || null;
    },
    /* رابط بحث في يوتيوب يعمل دائماً كبديل */
    searchUrl: function (query) {
      return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    }
  };
})(window);
