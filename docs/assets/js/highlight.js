/* =============================================================
   highlight.js — مُلوِّن كود HTML صغير بلا أي مكتبة خارجية
   A tiny dependency-free HTML syntax highlighter
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

  /* نهاية الوسم مع احترام علامات الاقتباس */
  function findTagEnd(src, start) {
    var quote = null;
    for (var i = start + 1; i < src.length; i++) {
      var ch = src[i];
      if (quote) {
        if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'") {
        quote = ch;
      } else if (ch === '>') {
        return i + 1;
      }
    }
    return src.length;
  }

  /* تلوين وسم واحد: <a href="x"> أو </a> */
  function markupTag(chunk) {
    var m = /^<\/?([a-zA-Z][\w:-]*)/.exec(chunk);
    if (!m) return esc(chunk);

    var head = m[0];                                  // "<div" أو "</div"
    var punct = head.slice(0, head.length - m[1].length);
    var out = span('tok-punct', punct) + span('tok-tag', m[1]);

    var rest = chunk.slice(head.length);
    var re = /(\s+)|("[^"]*"|'[^']*')|(=)|(\/?>)|([a-zA-Z_:@][-\w:.]*)|([\s\S])/g;
    var tok, afterEquals = false;

    while ((tok = re.exec(rest)) !== null) {
      if (tok[1]) { out += esc(tok[1]); continue; }                       // مسافات
      if (tok[2]) { out += span('tok-str', tok[2]); afterEquals = false; continue; }
      if (tok[3]) { out += span('tok-punct', tok[3]); afterEquals = true; continue; }
      if (tok[4]) { out += span('tok-punct', tok[4]); afterEquals = false; continue; }
      if (tok[5]) {
        out += span(afterEquals ? 'tok-str' : 'tok-attr', tok[5]);
        afterEquals = false;
        continue;
      }
      out += esc(tok[6]);
      afterEquals = false;
    }
    return out;
  }

  function highlight(src) {
    var text = String(src == null ? '' : src);
    var out = '';
    var i = 0;

    while (i < text.length) {
      var lt = text.indexOf('<', i);
      if (lt < 0) { out += esc(text.slice(i)); break; }
      if (lt > i) { out += esc(text.slice(i, lt)); i = lt; }

      if (text.substr(i, 4) === '<!--') {
        var endC = text.indexOf('-->', i);
        endC = endC < 0 ? text.length : endC + 3;
        out += span('tok-com', text.slice(i, endC));
        i = endC;
        continue;
      }

      if (/^<!doctype/i.test(text.substr(i, 9))) {
        var endD = text.indexOf('>', i);
        endD = endD < 0 ? text.length : endD + 1;
        out += span('tok-doctype', text.slice(i, endD));
        i = endD;
        continue;
      }

      if (/[a-zA-Z\/]/.test(text[i + 1] || '')) {
        var endT = findTagEnd(text, i);
        out += markupTag(text.slice(i, endT));
        i = endT;
        continue;
      }

      out += esc('<');
      i += 1;
    }
    return out;
  }

  global.Highlight = { code: highlight, escape: esc };
})(window);
