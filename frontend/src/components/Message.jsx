/** فقاعة رسالة واحدة — من المستخدم أو من المساعد. */
import { useMemo, useState } from 'react';
import { renderMarkdown } from '../lib/markdown.js';
import { AssistantIcon, CopyIcon, CheckIcon } from './Icons.jsx';

/** صندوق قابل للطي يعرض ملخص تفكير المساعد قبل إجابته. */
function ThinkingBox({ text, live }) {
  const [open, setOpen] = useState(false);
  if (!text?.trim()) return null;

  return (
    <div className={`thinking ${open ? 'thinking--open' : ''}`}>
      <button
        type="button"
        className="thinking__head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={`thinking__dot ${live ? 'thinking__dot--live' : ''}`} aria-hidden="true" />
        <span>{live ? 'يفكّر…' : 'خطوات التفكير'}</span>
        <svg
          className="thinking__chev"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9.5 12 15.5 18 9.5" />
        </svg>
      </button>
      {open && <div className="thinking__body">{text}</div>}
    </div>
  );
}

/** زر نسخ نص الإجابة. */
function CopyButton({ text }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      /* بعض المتصفحات تمنع النسخ بدون https */
    }
  }

  return (
    <button
      type="button"
      className="msg__copy"
      onClick={copy}
      title={done ? 'تم النسخ' : 'نسخ الإجابة'}
      aria-label={done ? 'تم النسخ' : 'نسخ الإجابة'}
    >
      {done ? <CheckIcon width="15" height="15" /> : <CopyIcon width="15" height="15" />}
    </button>
  );
}

export function Message({ message, assistant, streaming }) {
  const isUser = message.role === 'user';

  // نحوّل Markdown إلى HTML مرة واحدة فقط لكل تغيّر في النص (لتحسين الأداء أثناء البث).
  const html = useMemo(
    () => (isUser ? null : renderMarkdown(message.content)),
    [isUser, message.content],
  );

  if (isUser) {
    return (
      <div className="msg msg--user">
        <div className="msg__bubble msg__bubble--user">{message.content}</div>
      </div>
    );
  }

  return (
    <div className="msg msg--bot">
      <div className="msg__avatar" aria-hidden="true">
        <AssistantIcon name={assistant.icon} width="19" height="19" />
      </div>

      <div className="msg__col">
        <ThinkingBox text={message.thinking} live={streaming && !message.content} />

        <div className="msg__bubble msg__bubble--bot">
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          {streaming && <span className="caret" aria-hidden="true" />}
        </div>

        {!streaming && message.content && <CopyButton text={message.content} />}
      </div>
    </div>
  );
}
