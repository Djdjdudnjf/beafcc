# Replay — تحليل مبارياتك في EA FC (FIFA)

ترفع مقطع مباراتك، ويطلع لك تقرير بالعربي: تقييم، لحظات، أخطاء ونقاط قوة، تكتيك، تمارين، ومهمة واحدة لمباراتك القادمة. النصائح مبنية على **ميتا EA FC 27 حقيقية من مصادر** (مذكورة أسفل).

فيه وضعان للتشغيل:

---

## ١) الوضع الحقيقي — ترفع فيديو ويطلع تقرير فعلي 🔥

السيرفر يستقبل لقطات مباراتك (يطلّعها المتصفح نفسه من الفيديو) ويعطيها نموذج رؤية (OpenAI أو Anthropic) ليحللها، ثم يبني التقرير على ميتا FC 27.

### وش تحتاج
- **Node.js 18 أو أحدث** (تتأكد: `node -v`).
- **مفتاح ذكاء اصطناعي واحد** من أحد الاثنين:
  - **Anthropic (Claude):** المفتاح من <https://console.anthropic.com/> ← Settings ← API Keys.
  - أو OpenAI: من <https://platform.openai.com/api-keys>.
- التكلفة: بضعة سنتات لكل تحليل تقريبًا (حسب عدد اللقطات والمزود).

### التشغيل
```bash
# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-xxxx node server/server.js

# أو OpenAI
OPENAI_API_KEY=sk-xxxx node server/server.js
```
بعدها افتح: **http://localhost:8787**

> أو انسخ `.env.example` إلى `.env`، املأ مفتاحك، وشغّل `node server/server.js`.

### كيف ترفع مباراتك
1. سجّل مقطع مباراتك من الجهاز (زر Create في البلايستيشن، أو تسجيل الشاشة).
2. في الموقع اضغط **«حلّل مباراتك»** → اختر **«مقطع واحد»** → اختر ملف الفيديو واكتب لون/اسم فريقك.
3. المتصفح يطلّع لقطات من الفيديو ويرسلها للسيرفر، والسيرفر يحللها ويرجّع التقرير. تقاريرك تُحفظ في «سجلّي».

### إعدادات اختيارية (متغيرات بيئة)
| المتغيّر | الافتراضي | الوظيفة |
|---------|-----------|---------|
| `PORT` | `8787` | منفذ السيرفر |
| `MAX_FRAMES` | `14` | كم لقطة نرسل للذكاء (أكثر = أدق وأغلى) |
| `OPENAI_MODEL` | `gpt-4o` | موديل OpenAI (رؤية) |
| `ANTHROPIC_MODEL` | `claude-sonnet-5-5` | موديل Claude: `claude-haiku-5-5` أرخص، `claude-opus-5-5` أقوى |
| `OPENAI_BASE` | `https://api.openai.com` | لنقاط متوافقة مع OpenAI (OpenRouter، موديل محلي…) |

### صدق وواضح عن الحدود
- **النصائح الميتا** (تشكيلة، تكتيك، دفاع، هجوم، تعليمات اللاعبين): حقيقية ومبنية على مصادر فعلية ومربوطة بأسلوبك.
- **قراءة الفيديو**: الذكاء يشوف لقطات موزّعة من مقطعك ويطلّع اللي يقدر يقرأه (النتيجة إن ظهرت، التشكيلة تقريبًا، لحظات واضحة). ما راح يتابع كل تكتيكة دقيقة عبر كامل المباراة مثل محلل بشري — هذا حد التقنية، والسيرفر ما يخترع أحداثًا لا يراها.
- طريقة **الرابط (يوتيوب)** و**عدة مقاطع** غير مفعّلة في السيرفر الذاتي بعد — استخدم **«مقطع واحد»**.

---

## ٢) وضع المعاينة — بدون سيرفر ولا مفتاح

نسخة تجريبية تشتغل بـ `python3 -m http.server` فقط، التقرير فيها مُولّد من قالب (مو تحليل حقيقي) عشان تشوف شكل المنتج:
```bash
python3 -m http.server 8099   # ثم افتح http://localhost:8099
```
الملف `demo.js` هو اللي يحاكي الـ API محليًا. السيرفر الحقيقي يتجاهله تلقائيًا.

---

## الهوية

الاسم **Replay / RP** واللون **أزرق سماوي** — في الواجهة واللوقو والأيقونات وصورة المشاركة.

## مصادر ميتا EA FC 27 المستخدمة
- [Dexerto — Best EA FC 27 formations & custom tactics](https://www.dexerto.com/wikis/ea-fc-27/best-formations-and-custom-tactics/)
- [timesaver.gg — FC 27 best formations after Update 1.2.0](https://timesaver.gg/blog/fc-27-best-formations-custom-tactics-launch-week)
- [G2A — How to Defend in EA FC 27 (manual defending)](https://www.g2a.com/news/features/guide/how-to-defend-in-ea-fc-27-manual-defending-jockeying-tackling-pressing/)
- [FIFPlay — FC 27 Attacking Tips](https://www.fifplay.com/fc-27-attacking-tips/)
- [nealguides — Best FC 27 Formations (meta tactics & roles)](https://nealguides.com/best-fc-27-formations/)

> الميتا تتغيّر مع كل تحديث موسمي؛ النصائح مبادئ راسخة، راجع آخر باتش للتفاصيل الدقيقة.

## الملفات المهمة
| الملف | الوظيفة |
|------|---------|
| `server/server.js` | السيرفر الحقيقي (static + API + تحليل) |
| `server/meta.js` | قاعدة معرفة ميتا FC 27 |
| `index.html`, `app.js`, `replay.js`, `app.css` | الموقع |
| `demo.js` | محاكاة محلية لوضع المعاينة فقط |
