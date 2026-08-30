/** صندوق كتابة الرسالة أسفل المحادثة. */
import { useEffect, useRef } from 'react';
import { SendIcon, StopIcon } from './Icons.jsx';

export function Composer({ value, onChange, onSend, onStop, busy, placeholder }) {
  const ref = useRef(null);

  // يكبّر الصندوق تلقائياً كلما طال النص (حتى حد أقصى).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 190)}px`;
  }, [value]);

  function handleKeyDown(e) {
    // Enter = إرسال، Shift+Enter = سطر جديد
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!busy && value.trim()) onSend();
    }
  }

  return (
    <div className="composer">
      <div className="composer__box">
        <textarea
          ref={ref}
          className="composer__input"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="اكتب رسالتك"
          dir="auto"
        />

        {busy ? (
          <button
            type="button"
            className="composer__btn composer__btn--stop"
            onClick={onStop}
            title="إيقاف التوليد"
            aria-label="إيقاف التوليد"
          >
            <StopIcon width="17" height="17" />
          </button>
        ) : (
          <button
            type="button"
            className="composer__btn"
            onClick={onSend}
            disabled={!value.trim()}
            title="إرسال"
            aria-label="إرسال الرسالة"
          >
            <SendIcon width="19" height="19" />
          </button>
        )}
      </div>

      <p className="composer__hint">
        <kbd>Enter</kbd> للإرسال · <kbd>Shift</kbd>+<kbd>Enter</kbd> لسطر جديد
      </p>
    </div>
  );
}
