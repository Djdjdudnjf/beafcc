/**
 * حارس رمز الدخول.
 *
 * "Middleware" = دالة تمر عليها كل الطلبات قبل وصولها لوجهتها،
 * فتسمح لها بالمرور (next) أو ترفضها.
 *
 * إن كان ACCESS_CODE فارغاً في ملف .env فالحارس يسمح للجميع
 * (مناسب عند التشغيل على جهازك). وإن وُضع رمز، يُطلب من كل زائر.
 */
import { requiresAccessCode, checkAccessCode } from './config.js';

export function accessGuard(req, res, next) {
  if (!requiresAccessCode()) return next();

  // الواجهة ترسل الرمز في ترويسة الطلب (header) اسمها x-access-code، مُرمّزاً
  // لأن الترويسات لا تقبل الحروف العربية. نفكّ الترميز هنا قبل المقارنة.
  const raw = req.get('x-access-code');
  let provided = raw;
  if (raw) {
    try {
      provided = decodeURIComponent(raw);
    } catch {
      provided = raw; // ترميز تالف — نقارن النص كما وصل، وسيفشل بأمان
    }
  }
  if (checkAccessCode(provided)) return next();

  return res.status(401).json({
    error: {
      code: 'bad_access_code',
      message: raw ? 'رمز الدخول غير صحيح.' : 'هذا الموقع محمي برمز دخول.',
    },
  });
}
