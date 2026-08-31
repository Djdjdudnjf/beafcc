/**
 * توجيه بسيط جداً بين الصفحات باستخدام "الهاش" في عنوان المتصفح:
 *   #/            → الصفحة الرئيسية
 *   #/chat/math   → محادثة مساعد الرياضيات
 *
 * فائدة هذه الطريقة: زر الرجوع في المتصفح يعمل، ويمكن حفظ الرابط،
 * ولا نحتاج تثبيت مكتبة توجيه كاملة.
 */
import { useEffect, useState, useCallback } from 'react';

function readRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const match = hash.match(/^\/chat\/([a-z]+)$/i);
  if (match) return { page: 'chat', assistantId: match[1] };
  return { page: 'home', assistantId: null };
}

export function useRouter() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path;
  }, []);

  return { route, navigate };
}
