/**
 * قراءة الإعدادات من ملف .env والتحقق من صحتها.
 * ملف .env هو ملف نصي بسيط يحتوي على القيم السرية (مثل مفتاح API)
 * حتى لا نكتبها داخل الكود.
 */
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// في وحدات ES الحديثة لا يوجد متغير __dirname، فنستخرج مسار المجلد بهذه الطريقة.
const here = path.dirname(fileURLToPath(import.meta.url));

/** يحوّل نصاً إلى رقم صحيح، وإن فشل يرجع القيمة الافتراضية. */
function toInt(value, fallback) {
  const n = Number.parseInt(value ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

const EFFORT_LEVELS = ['low', 'medium', 'high', 'xhigh', 'max'];
const rawEffort = (process.env.ANTHROPIC_EFFORT ?? 'high').trim().toLowerCase();

export const config = {
  port: toInt(process.env.PORT, 3001),
  apiKey: (process.env.ANTHROPIC_API_KEY ?? '').trim(),
  model: (process.env.ANTHROPIC_MODEL ?? '').trim() || 'claude-opus-5',
  effort: EFFORT_LEVELS.includes(rawEffort) ? rawEffort : 'high',
  maxTokens: toInt(process.env.MAX_TOKENS, 8000),
  historyLimit: toInt(process.env.HISTORY_LIMIT, 30),
  dataDir: path.resolve(here, '..', '..', 'data'),
  // رمز دخول اختياري. إن تُرك فارغاً فالموقع مفتوح (مناسب للاستخدام على جهازك).
  // إن وُضع فيه رمز، يطلبه الموقع من كل من يفتحه — ضروري عند النشر على الإنترنت.
  accessCode: (process.env.ACCESS_CODE ?? '').trim(),
  // مجلد الواجهة المبنية (يُقدَّم تلقائياً في وضع النشر إن كان موجوداً).
  distDir: path.resolve(here, '..', '..', '..', 'frontend', 'dist'),
};

/** هل الموقع محمي برمز دخول؟ */
export function requiresAccessCode() {
  return config.accessCode.length > 0;
}

/**
 * مقارنة آمنة بين رمزين: تأخذ نفس الوقت مهما كان عدد الحروف الصحيحة،
 * حتى لا يُستدل على الرمز بقياس زمن الرد.
 */
export function checkAccessCode(provided) {
  if (!requiresAccessCode()) return true;
  const given = String(provided ?? '');
  const expected = config.accessCode;
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * هل المفتاح موجود ويبدو صحيحاً؟
 * لا نتحقق من صلاحيته هنا (ذلك يحتاج اتصالاً بالإنترنت)، فقط من وجوده.
 */
export function apiKeyStatus() {
  if (!config.apiKey) return { ok: false, reason: 'missing' };
  if (config.apiKey.includes('ضع_مفتاحك_هنا') || config.apiKey.startsWith('your')) {
    return { ok: false, reason: 'placeholder' };
  }
  if (!config.apiKey.startsWith('sk-ant-')) return { ok: true, reason: 'unusual_prefix' };
  return { ok: true, reason: 'ok' };
}
