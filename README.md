# إتقان بايثون — Etqan Python

منصّة تفاعلية لتعلّم لغة **Python** من الصفر، بالعربية والإنجليزية، تعمل بالكامل داخل المتصفح
— بمفسّر بايثون حقيقي، بلا خادم ولا تثبيت.

An interactive platform for learning **Python** from zero, in Arabic and English, running
entirely in the browser — with a real Python interpreter, no server, no installation.

---

## المحتوى / What is inside

| | |
|---|---|
| 8 وحدات دراسية | 8 modules |
| 32 درساً مرتّباً | 32 ordered lessons |
| 32 تحدياً عملياً بتصحيح آلي | 32 auto-graded hands-on challenges |
| 96 سؤال اختبار مع شرح | 96 quiz questions with explanations |
| 96 مدخلاً في المرجع السريع | 96 entries in the quick reference |
| مشروع ختامي: متتبّع مصروفات | a final project: an expense tracker |

### المنهج / The curriculum

1. **البداية** — ما هي بايثون، `print`، المتغيّرات، `input`.
2. **الأنواع** — الأعداد، النصوص، f-strings، التحويل بين الأنواع و`None`.
3. **القرارات والتكرار** — `if/elif/else`، المقارنات، `for`/`range`، `while`/`break`.
4. **المجموعات** — القوائم وعملياتها، القواميس، الصفوف والمجموعات.
5. **الدوال** — `def`، المعاملات والإرجاع، النطاق، `lambda` والدوال العليا.
6. **المتانة** — قراءة الأخطاء، `try/except`، الوحدات، الملفات.
7. **الكائنات** — الأصناف و`__init__`، الوراثة و`super()`، الدوال الخاصة.
8. **الاحتراف** — الاختصارات، PEP 8، المكتبة القياسية، الاختبار، الخطوات التالية.

---

## بايثون حقيقية داخل المتصفح / Real Python in the browser

المحرّر لا يحاكي بايثون ولا يرسل كودك إلى خادم. يشغّل **CPython مُترجَماً إلى WebAssembly**
عبر [Pyodide](https://pyodide.org)، داخل **Web Worker** منفصل:

The editor neither simulates Python nor sends your code to a server. It runs
**CPython compiled to WebAssembly** via [Pyodide](https://pyodide.org), inside a
separate **Web Worker**:

- **حلقة لانهائية لا تُجمّد الصفحة** — العامل المنفصل يمكن إنهاؤه، وهناك زرّ «إيقاف» ومهلة تلقائية.
  An infinite loop cannot freeze the page — the worker can be terminated, and there is
  a Stop button plus an automatic timeout.
- **`input()` يعمل فعلاً** — يظهر حقل «مدخلات البرنامج» تلقائياً حين يحتوي كودك على `input(`.
  `input()` genuinely works — a "Program input" field appears whenever your code contains `input(`.
- **الملفات تعمل** — `open()` و`read()` و`write()` على نظام ملفات وهمي في الذاكرة.
  Files work — `open()`, `read()` and `write()` against an in-memory filesystem.
- **التصحيح بتشغيل الكود** — زر «تحقّق» يشغّل كودك فعلياً ثم يفحص مخرجاته ومتغيّراته
  ويستدعي دوالك بقيم اختبار. لا مطابقة نصّية للكود.
  Grading runs your code — the Check button executes it, then inspects its output and
  variables and calls your functions with test values. It is not text-matching.

> يُنزَّل المفسّر (نحو 10 ميغابايت) عند أول تشغيل فقط، ثم يُخزَّن ويعمل بلا اتصال.
> The interpreter (~10 MB) downloads on the first run only, then is cached and works offline.

---

## التشغيل محلياً / Running locally

يحتاج المشروع خادماً محلياً (لا يعمل عبر `file://` لأن Pyodide يُحمَّل داخل Web Worker):

A local server is required (`file://` will not work, because Pyodide loads inside a Web Worker):

```bash
python3 -m http.server 8000
# ثم افتح / then open: http://localhost:8000/
```

## النشر / Publishing

الموقع صفحات ثابتة، فيعمل على أي استضافة ثابتة: GitHub Pages أو Netlify أو Firebase Hosting.
الملفات في جذر المستودع، فاختر الفرع والمجلّد `/ (root)`.

Static pages, so any static host works — GitHub Pages, Netlify or Firebase Hosting.
The files sit at the repository root, so pick the branch and the `/ (root)` folder.

---

## تثبيت التطبيق على هاتفك / Install as an app

المنصّة تطبيق ويب تقدّمي (PWA) قابل للتثبيت:

### على iPhone / iPad (iOS 15+)
1. افتح الرابط في **Safari**.
2. اضغط **مشاركة** (أيقونة المربع مع السهم).
3. اختر **إضافة إلى الشاشة الرئيسية**.

### على Android
1. افتح الموقع في **Chrome**.
2. القائمة (⋮) ← **تثبيت التطبيق**.

بعد التثبيت يعمل التطبيق **بدون إنترنت** — بما في ذلك مفسّر بايثون نفسه بعد أول تشغيل.

After installing, the app works **offline** — including the Python interpreter itself,
once it has run for the first time.

---

## بنية المشروع / Project structure

```
index.html                 هيكل الصفحة (SPA shell)
game.html                  لعبة ركلات الترجيح السابقة (محفوظة)
manifest.json              بيانات التطبيق للتثبيت
service-worker.js          التخزين للعمل بلا اتصال
assets/css/style.css       نظام التصميم: الثيمان، RTL/LTR، الاستجابة
assets/js/i18n.js          نصوص الواجهة ومحرّك اللغة
assets/js/pyrunner.js      تشغيل بايثون عبر Pyodide داخل Web Worker
assets/js/highlight.js     مُلوِّن كود بايثون مكتوب يدوياً (بلا مكتبات)
assets/js/lessons.js       محتوى المنهج كاملاً بالعربية والإنجليزية
assets/js/videos.js        عبارات البحث عن شروحات مرئية لكل درس
assets/js/reference.js     بيانات المرجع السريع
assets/js/playground.js    المحرّر ووحدة الإخراج ومُصحِّح التحديات
assets/js/quiz.js          الاختبارات القصيرة
assets/js/app.js           الراوتر والعرض والتقدّم والبحث
```

### ملاحظات تقنية / Technical notes

- السكربتات تُحمَّل بوسوم `<script>` عادية بلا `fetch` أو ES modules.
- التوجيه عبر الـ hash (`#/lesson/<id>`) فتعمل الروابط على أي استضافة بلا إعدادات.
- لا يُرسل أي شيء إلى أي خادم: تقدّمك وما تكتبه يبقيان في `localStorage` في متصفحك.
- الشروحات المرئية تُعرض كبحث موجّه في يوتيوب لا كمقاطع مضمّنة، فلا تتعطّل بحذف مقطع.

---

## إضافة درس جديد / Adding a lesson

أضف كائناً داخل `lessons` في الوحدة المناسبة في `assets/js/lessons.js`:

```js
{
  id: 'my-lesson', minutes: 6, level: 'beginner', tags: ['tag'],
  title: { ar: '…', en: '…' },
  lede:  { ar: '…', en: '…' },
  body:  { ar: '<h2>…</h2>', en: '<h2>…</h2>' },
  example: { note: { ar: '…', en: '…' }, code: { ar: 'print("…")', en: 'print("…")' } },
  challenge: {
    brief: { ar: '…', en: '…' },
    starter: { ar: '…', en: '…' },
    solution: { ar: '…', en: '…' },
    checks: [{
      label: {…}, hint: {…},
      // r = نتيجة تشغيل كود المتعلّم / the run result
      test: function (r) { return r.val('total') === 30; }
    }]
  },
  quiz: [{ q: {…}, options: [{…}], answer: 0, why: {…} }]
}
```

### عقد الفحص / the check contract

يستقبل كل `test` كائن النتيجة `r` بعد تشغيل كود المتعلّم فعلياً:

| | |
|---|---|
| `r.ok` | لم يقع أي خطأ / no exception was raised |
| `r.stdout` / `r.lines` | المطبوع كاملاً أو مقسّماً أسطراً |
| `r.prints(x)` | هل طُبع نصّ أو نمط |
| `r.has(n)` / `r.type(n)` / `r.val(n)` | وجود اسم، ونوعه، وقيمته |
| `r.src(re)` | فحص الكود المصدري — لاشتراط تركيب بعينه |
| `r.call(fn, args)` | يستدعي دالة المتعلّم ويُعيد `Promise` |

يمكن للفحص أن يُعيد قيمة منطقية أو `Promise` — كلاهما مدعوم.
A check may return a boolean or a Promise; both are supported.

الباقي تلقائي: الفهرس، التقدّم، البحث، والتنقّل بين الدروس.
