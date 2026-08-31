/**
 * إدارة الوضع الليلي/النهاري.
 * - يبدأ بتفضيل نظام تشغيل المستخدم.
 * - يحفظ اختيار المستخدم في ذاكرة المتصفح (localStorage) ليبقى بعد الإغلاق.
 */
import { useCallback, useEffect, useState } from 'react';

const KEY = 'murshid-theme';

function initialTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* بعض المتصفحات تمنع التخزين في وضع التصفح الخاص */
  }
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0b0e14' : '#f6f7fb');
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* تجاهل */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle };
}
