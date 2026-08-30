/** زر تبديل الوضع الليلي/النهاري. */
import { SunIcon, MoonIcon } from './Icons.jsx';

export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onToggle}
      title={isDark ? 'التبديل للوضع النهاري' : 'التبديل للوضع الليلي'}
      aria-label={isDark ? 'التبديل للوضع النهاري' : 'التبديل للوضع الليلي'}
    >
      {isDark ? <SunIcon width="19" height="19" /> : <MoonIcon width="19" height="19" />}
    </button>
  );
}
