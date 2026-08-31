/**
 * شاشة رمز الدخول.
 * تظهر فقط إذا كان الموقع منشوراً على الإنترنت ومحمياً برمز (ACCESS_CODE).
 * على جهازك محلياً لن تظهر أبداً.
 */
import { useState } from 'react';
import { setAccessCode, fetchConversations } from '../lib/api.js';
import { SparkIcon, AlertIcon } from './Icons.jsx';

export function Gate({ onUnlock }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const value = code.trim();
    if (!value || checking) return;

    setChecking(true);
    setError(null);
    setAccessCode(value);

    try {
      // نجرّب طلباً محمياً حقيقياً للتأكد أن الرمز صحيح قبل الدخول.
      await fetchConversations('medical');
      onUnlock();
    } catch (err) {
      setAccessCode('');
      setError(err.message);
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="gate">
      <div className="home__glow" aria-hidden="true" />

      <form className="gate__card" onSubmit={submit}>
        <span className="gate__mark" aria-hidden="true">
          <SparkIcon width="26" height="26" />
        </span>

        <h1 className="gate__title">مرشد</h1>
        <p className="gate__sub">هذا الموقع محمي. أدخل رمز الدخول للمتابعة.</p>

        <input
          className="gate__input"
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="رمز الدخول"
          autoFocus
          autoComplete="current-password"
          dir="ltr"
          aria-label="رمز الدخول"
        />

        {error && (
          <p className="gate__error" role="alert">
            <AlertIcon width="16" height="16" />
            {error}
          </p>
        )}

        <button type="submit" className="gate__btn" disabled={!code.trim() || checking}>
          {checking ? 'جارٍ التحقق…' : 'دخول'}
        </button>
      </form>
    </div>
  );
}
