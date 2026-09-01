/* =============================================================
   highlight.js — مُلوِّن كود بايثون صغير بلا أي مكتبة خارجية
   A tiny dependency-free Python syntax highlighter
   ============================================================= */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function span(cls, text) {
    return '<span class="' + cls + '">' + esc(text) + '</span>';
  }

  /* الكلمات المحجوزة / reserved keywords */
  var KEYWORDS = {};
  ('False None True and as assert async await break class continue def del elif else ' +
   'except finally for from global if import in is lambda nonlocal not or pass raise ' +
   'return try while with yield match case').split(' ').forEach(function (k) { KEYWORDS[k] = 1; });

  /* الثوابت المنطقية تُلوَّن كقيم لا ككلمات / literal constants */
  var LITERALS = { True: 1, False: 1, None: 1 };

  /* الدوال المدمجة الشائعة / common builtins */
  var BUILTINS = {};
  ('print len range int str float bool list dict set tuple input sum min max abs round ' +
   'sorted reversed enumerate zip map filter any all type isinstance open format repr ' +
   'divmod pow chr ord bin hex oct id hash iter next slice frozenset bytes super ' +
   'getattr setattr hasattr delattr callable vars dir help exit').split(' ')
    .forEach(function (k) { BUILTINS[k] = 1; });

  /* رمز واحد لكل نمط، بالترتيب: تعليق، نص ثلاثي، نص عادي، مُزخرِف، رقم، معرّف، مسافة، أي شيء */
  var RE = new RegExp([
    '(#[^\\n]*)',                                                        /* 1 تعليق */
    '([rRbBuUfF]{0,2}(?:"""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'))',      /* 2 نص ثلاثي */
    '([rRbBuUfF]{0,2}(?:"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'))', /* 3 نص */
    '(@[A-Za-z_]\\w*)',                                                  /* 4 مُزخرِف */
    '(\\d[\\w.]*)',                                                      /* 5 رقم */
    '([A-Za-z_]\\w*)',                                                   /* 6 معرّف */
    '(\\s+)',                                                            /* 7 مسافة */
    '([\\s\\S])'                                                         /* 8 غير ذلك */
  ].join('|'), 'g');

  function highlight(src) {
    var text = String(src == null ? '' : src);
    var out = '';
    var tok;
    var prevWord = '';   /* آخر معرّف/كلمة مهمّة — لمعرفة def/class */

    RE.lastIndex = 0;
    while ((tok = RE.exec(text)) !== null) {
      if (tok[1]) { out += span('tok-com', tok[1]); continue; }
      if (tok[2]) { out += span('tok-str', tok[2]); continue; }
      if (tok[3]) { out += span('tok-str', tok[3]); continue; }
      if (tok[4]) { out += span('tok-dec', tok[4]); continue; }
      if (tok[5]) { out += span('tok-num', tok[5]); continue; }

      if (tok[6]) {
        var word = tok[6];

        /* اسم بعد def أو class → اسم مُعرَّف */
        if (prevWord === 'def' || prevWord === 'class') {
          out += span('tok-fn', word);
          prevWord = word;
          continue;
        }
        if (LITERALS[word]) { out += span('tok-lit', word); prevWord = word; continue; }
        if (KEYWORDS[word]) { out += span('tok-kw', word); prevWord = word; continue; }

        /* معرّف متبوع بقوس → استدعاء دالة */
        var after = text.slice(RE.lastIndex);
        var isCall = /^\s*\(/.test(after);
        if (BUILTINS[word]) out += span('tok-builtin', word);
        else if (isCall) out += span('tok-fn', word);
        else out += span('tok-var', word);
        prevWord = word;
        continue;
      }

      if (tok[7]) { out += esc(tok[7]); continue; }

      out += span('tok-punct', tok[8]);
      prevWord = '';
    }
    return out;
  }

  global.Highlight = { code: highlight, escape: esc };
})(window);
