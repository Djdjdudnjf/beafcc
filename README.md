# إتقان HTML — Etqan HTML

منصّة تفاعلية لتعلّم لغة **HTML** من الصفر، بالعربية والإنجليزية، تعمل بالكامل داخل المتصفح
بلا خادم ولا تثبيت ولا أي مكتبة خارجية.

An interactive platform for learning **HTML** from zero, in Arabic and English, running
entirely in the browser — no server, no installation, no external libraries.

---

## المحتوى / What is inside

| | |
|---|---|
| 8 وحدات دراسية | 8 modules |
| 32 درساً مرتّباً | 32 ordered lessons |
| 32 تحدياً عملياً بتصحيح آلي | 32 auto-checked hands-on challenges |
| 96 سؤال اختبار مع شرح | 96 quiz questions with explanations |
| 85 وسماً في المرجع السريع | 85 tags in the quick reference |
| مشروع ختامي من 13 خطوة | a 13-step final project |

### المزايا / Features

- **محرّر حيّ في كل درس**: اكتب HTML وشاهد النتيجة فوراً في معاينة معزولة.
- **تحدٍّ عملي بعد كل درس**: زر «تحقّق» يفحص كودك بنداً بنداً عبر `DOMParser` ويخبرك بما ينقص.
- **عربي/إنجليزي بضغطة واحدة**: تبديل كامل للواجهة والمحتوى مع قلب اتجاه الصفحة.
- **تتبّع التقدّم**: يُحفظ في `localStorage` مع شريط إنجاز وعلامات على الدروس المكتملة.
- **بحث فوري**: `Ctrl/⌘ + K` للبحث في الدروس والوسوم.
- **وضع ليلي/نهاري** يتبع تفضيل النظام ويمكن تبديله يدوياً.
- **مقاطع شرح من يوتيوب** تُحمَّل عند الضغط فقط (نقرة واحدة، بلا تتبّع مسبق).
- **تصميم مستجيب** يعمل من شاشة 390px حتى الشاشات الكبيرة.

---

## التشغيل محلياً / Running locally

الطريقة الأسهل: افتح `learn/index.html` مباشرة في المتصفح — يعمل عبر `file://` بلا خادم.

```bash
# أو عبر خادم محلي بسيط
python3 -m http.server 8000
# ثم افتح: http://localhost:8000/learn/
```

## النشر / Publishing

الموقع صفحات ثابتة، لذا يعمل على أي استضافة ثابتة. على GitHub Pages:
**Settings → Pages** ثم اختر الفرع والمجلد `/ (root)`، وسيكون رابط المنصة:
`https://<username>.github.io/<repo>/learn/`

---

## تثبيت التطبيق على هاتفك / Install as an App

المنصة الآن Progressive Web App (PWA)، مما يعني يمكنك تثبيتها على هاتفك أو جهازك اللوحي:

### على iPhone (iOS 15+)
1. افتح الرابط في **Safari** (بريمة المتصفح)
2. اضغط **Share** (أيقونة المربع السهم)
3. اختر **Add to Home Screen**
4. اضغط **Add** وسيُضاف التطبيق إلى الشاشة الرئيسية

التطبيق سيعمل بكامل وظائفه حتى بدون إنترنت بعد الوصول الأول.

### على Android
1. افتح الموقع في **Chrome** أو أي متصفح حديث
2. اضغط القائمة (ثلاث نقاط) ← **Install app** (أو **Add to home screen**)
3. أكّد التثبيت

### الميزات بعد التثبيت
- ✅ يعمل **بدون إنترنت** بعد التحميل الأول
- ✅ سرعة أسرع (التطبيق يُخزّن الملفات محلياً)
- ✅ يفتح مباشرة **بدون شريط عنوان المتصفح**
- ✅ إشعارات عند توفر نسخة جديدة

---

## بنية المشروع / Project structure

```
learn/
  index.html                 هيكل الصفحة (SPA shell)
  assets/css/style.css       نظام التصميم: الثيمان، RTL/LTR، الاستجابة
  assets/js/i18n.js          نصوص الواجهة ومحرّك اللغة
  assets/js/highlight.js     مُلوِّن كود HTML مكتوب يدوياً (بلا مكتبات)
  assets/js/lessons.js       محتوى المنهج كاملاً بالعربية والإنجليزية
  assets/js/videos.js        خريطة مقاطع الشرح لكل درس
  assets/js/reference.js     بيانات مرجع الوسوم
  assets/js/playground.js    المحرّر والمعاينة ومُصحِّح التحديات
  assets/js/quiz.js          الاختبارات القصيرة
  assets/js/app.js           الراوتر والعرض والتقدّم والبحث
```

### ملاحظات تقنية / Technical notes

- كل السكربتات تُحمَّل بوسوم `<script>` عادية بلا `fetch` أو ES modules، لذلك تعمل الصفحة
  حتى عند فتح الملف مباشرة من القرص.
- المعاينة داخل `<iframe sandbox="allow-scripts allow-forms allow-modals">` معزولة عن الصفحة.
- التوجيه عبر الـ hash (`#/lesson/<id>`) فتعمل الروابط على أي استضافة وبلا إعدادات.
- لا يُرسل أي شيء إلى أي خادم: التقدّم وما تكتبه في المحرّر يبقيان في متصفحك.

## إضافة درس جديد / Adding a lesson

أضف كائناً داخل `lessons` في الوحدة المناسبة في `assets/js/lessons.js`:

```js
{
  id: 'my-lesson', minutes: 6, level: 'beginner', tags: ['tag'],
  title: { ar: '…', en: '…' },
  lede:  { ar: '…', en: '…' },
  body:  { ar: '<h2>…</h2>', en: '<h2>…</h2>' },
  example: { note: { ar: '…', en: '…' }, code: { ar: '…', en: '…' } },
  challenge: {
    brief: { ar: '…', en: '…' },
    starter: { ar: '…', en: '…' },
    solution: { ar: '…', en: '…' },
    checks: [{ label: {…}, hint: {…}, test: function (doc, raw) { return !!doc.querySelector('h1'); } }]
  },
  quiz: [{ q: {…}, options: [{…}], answer: 0, why: {…} }]
}
```

الباقي تلقائي: الفهرس، التقدّم، البحث، والتنقّل بين الدروس.
