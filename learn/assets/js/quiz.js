/* =============================================================
   quiz.js — اختبار قصير بعد كل درس / end-of-lesson quiz
   ============================================================= */
(function (global) {
  'use strict';

  var h = global.Playground.h;
  function t(k) { return global.I18N.t(k); }
  function pick(v) { return global.I18N.pick(v); }

  var LETTERS = ['A', 'B', 'C', 'D', 'E'];

  function createQuiz(questions, options) {
    var opts = options || {};
    var answered = 0;
    var correct = 0;
    var total = questions.length;

    var scoreBox = h('div', { class: 'quiz-score', hidden: true });
    var blocks = [];

    var body = h('div', {});

    questions.forEach(function (q, qi) {
      var optButtons = [];
      var explain = h('div', { class: 'explain', hidden: true }, [pick(q.why)]);
      var done = false;

      var optsWrap = h('div', { class: 'opts' }, q.options.map(function (opt, oi) {
        var btn = h('button', { class: 'opt', type: 'button' }, [
          h('span', { class: 'letter' }, [LETTERS[oi] || String(oi + 1)]),
          h('span', {}, [pick(opt)])
        ]);
        btn.addEventListener('click', function () {
          if (done) return;
          done = true;
          answered++;
          var isRight = oi === q.answer;
          if (isRight) correct++;

          optButtons.forEach(function (b, bi) {
            b.disabled = true;
            if (bi === q.answer) b.classList.add('correct');
            else if (bi === oi) b.classList.add('wrong');
          });
          explain.hidden = false;

          if (answered === total) {
            scoreBox.hidden = false;
            scoreBox.innerHTML = '';
            var perfect = correct === total;
            scoreBox.appendChild(h('span', {}, [perfect ? '🏆' : '📊']));
            scoreBox.appendChild(h('span', {}, [
              t('quizScore') + ' ' + correct + ' / ' + total + (perfect ? ' — ' + t('quizPerfect') : '')
            ]));
            var again = h('button', { class: 'btn btn-sm btn-ghost', type: 'button', style: 'margin-inline-start:auto' }, [t('quizRetry')]);
            again.addEventListener('click', function () { if (opts.onRetry) opts.onRetry(); });
            scoreBox.appendChild(again);
            if (typeof opts.onDone === 'function') opts.onDone(correct, total);
          }
        });
        optButtons.push(btn);
        return btn;
      }));

      blocks.push(h('div', { class: 'q' }, [
        h('p', { class: 'q-text' }, [
          h('span', { class: 'num' }, [(qi + 1) + '.']),
          pick(q.q)
        ]),
        optsWrap,
        explain
      ]));
    });

    blocks.forEach(function (b) { body.appendChild(b); });

    var root = h('div', { class: 'quiz card' }, [
      h('h3', {}, ['🎯 ' + t('quizTitle')]),
      h('p', { class: 'sub' }, [t('quizSub')]),
      body,
      scoreBox
    ]);

    return { el: root };
  }

  global.Quiz = { create: createQuiz };
})(window);
