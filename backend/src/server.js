/**
 * نقطة انطلاق خادم "مرشد".
 * تشغيله:  npm start   (من داخل مجلد backend)
 */
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { config, apiKeyStatus, requiresAccessCode } from './lib/config.js';
import { accessGuard } from './lib/guard.js';
import { initStorage } from './lib/storage.js';
import { chatRouter } from './routes/chat.js';
import { conversationsRouter } from './routes/conversations.js';

const app = express();

// CORS يسمح لواجهة الموقع (التي تعمل على منفذ مختلف أثناء التطوير) بمخاطبة الخادم.
app.use(cors());
// يجعل Express يفهم الرسائل القادمة بصيغة JSON.
app.use(express.json({ limit: '1mb' }));

/** فحص صحة الخادم: تستخدمه الواجهة لتنبيهك إن كان المفتاح ناقصاً. */
app.get('/api/health', (_req, res) => {
  const key = apiKeyStatus();
  res.json({
    ok: true,
    apiKeyConfigured: key.ok,
    apiKeyIssue: key.ok ? null : key.reason,
    model: config.model,
    effort: config.effort,
    // تخبر الواجهة إن كانت ستطلب رمز دخول من الزائر.
    requiresCode: requiresAccessCode(),
  });
});

// كل ما يلي محميّ برمز الدخول (إن كان مضبوطاً). /api/health أعلاه مفتوح دائماً
// لأن الواجهة تحتاجه لتعرف أنها يجب أن تطلب الرمز أصلاً.
app.use('/api', accessGuard);
app.use('/api', conversationsRouter);
app.use('/api', chatRouter);

// أي عنوان غير معروف يبدأ بـ /api
app.use('/api', (_req, res) => {
  res.status(404).json({ error: { code: 'not_found', message: 'هذا العنوان غير موجود.' } });
});

/*
 * وضع النشر (Production):
 * عند نشر المشروع على الإنترنت نبني الواجهة مرة واحدة إلى مجلد frontend/dist،
 * ثم يقدّمها هذا الخادم بنفسه — فتصبح الواجهة والخادم خدمة واحدة على رابط واحد.
 * أثناء التطوير على جهازك لا يوجد مجلد dist، فيُتخطى هذا القسم تلقائياً.
 */
const hasBuiltFrontend = fs.existsSync(path.join(config.distDir, 'index.html'));

if (hasBuiltFrontend) {
  // الملفات ذات البصمة في اسمها (مثل index-a1b2c3.js) لا تتغير أبداً، فنخزّنها طويلاً.
  app.use(
    express.static(config.distDir, {
      index: false,
      setHeaders(res, filePath) {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    }),
  );

  // أي عنوان آخر يُعيد صفحة الواجهة، لأن التنقل بين الصفحات يتم داخل المتصفح.
  app.get('*', (_req, res) => {
    res.sendFile(path.join(config.distDir, 'index.html'));
  });
}

// مصيدة الأخطاء الأخيرة: تمنع انهيار الخادم وتعيد رسالة مفهومة.
app.use((err, _req, res, _next) => {
  console.error('خطأ غير متوقع:', err);
  if (res.headersSent) return res.end();
  res.status(500).json({
    error: { code: 'server_error', message: 'حدث خطأ في الخادم. راجع نافذة الطرفية.' },
  });
});

async function main() {
  await initStorage();

  const server = app.listen(config.port, () => {
    const key = apiKeyStatus();
    console.log('');
    console.log('  ╭──────────────────────────────────────────────╮');
    console.log('  │            مرشد — الخادم يعمل ✅             │');
    console.log('  ╰──────────────────────────────────────────────╯');
    console.log(`  العنوان : http://localhost:${config.port}`);
    console.log(`  الموديل : ${config.model}  (عمق التفكير: ${config.effort})`);
    console.log(
      `  المفتاح : ${
        key.ok
          ? '✅ موجود'
          : '❌ ناقص — افتح backend/.env وضع مفتاحك في ANTHROPIC_API_KEY ثم أعد التشغيل'
      }`,
    );
    console.log(`  التخزين : ${config.dataDir}`);
    console.log(
      `  الحماية : ${requiresAccessCode() ? '🔒 رمز دخول مفعّل' : '🔓 مفتوح (بلا رمز دخول)'}`,
    );
    console.log('');
    if (hasBuiltFrontend) {
      console.log(`  ✅ الواجهة جاهزة على نفس الرابط: http://localhost:${config.port}`);
    } else {
      console.log('  شغّل الآن الواجهة في نافذة طرفية ثانية:  cd frontend && npm run dev');
    }
    console.log('  لإيقاف الخادم اضغط: Ctrl + C');
    console.log('');

    // شبكة أمان: رمز قصير جداً غالباً يعني أن علامة # قطعته في ملف .env،
    // أو أنه ضعيف يسهل تخمينه.
    if (requiresAccessCode() && config.accessCode.length < 8) {
      console.warn(
        `  ⚠️  رمز الدخول قصير (${config.accessCode.length} أحرف فقط).\n` +
          '     إن كان رمزك يحتوي على علامة # فقد قُطع عندها — ضعه بين علامتي تنصيص\n' +
          '     في ملف .env هكذا:  ACCESS_CODE="رمزك#هنا"   أو استخدم حروفاً وأرقاماً فقط.\n',
      );
    }
  });

  // رسالة واضحة بدل خطأ إنجليزي مخيف لو كان الخادم يعمل مسبقاً.
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error('');
      console.error(`  ❌ المنفذ ${config.port} مشغول — غالباً الخادم يعمل بالفعل في نافذة أخرى.`);
      console.error('     الحل: أغلق النافذة الأخرى، أو غيّر رقم PORT في ملف backend/.env');
      console.error('');
      process.exit(1);
    }
    throw err;
  });
}

// أخطاء غير متوقعة خارج الطلبات — نطبعها بدل إسقاط الخادم فجأة.
process.on('unhandledRejection', (reason) => {
  console.error('⚠️  خطأ غير معالَج:', reason);
});

main().catch((err) => {
  console.error('فشل تشغيل الخادم:', err);
  process.exit(1);
});
