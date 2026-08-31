/**
 * صفحة المحادثة مع مساعد واحد.
 *
 * تدير: تحميل المحادثات السابقة، إرسال الرسالة، استقبال البث حرفاً بحرف،
 * التمرير التلقائي للأسفل، وإيقاف التوليد.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { getAssistant } from '../lib/assistants.js';
import {
  fetchConversation,
  fetchConversations,
  deleteConversation as apiDelete,
  streamChat,
} from '../lib/api.js';
import { Message } from './Message.jsx';
import { Typing } from './Typing.jsx';
import { Composer } from './Composer.jsx';
import { Sidebar } from './Sidebar.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { AssistantIcon, BackIcon, MenuIcon, AlertIcon } from './Icons.jsx';

export function Chat({ assistantId, onHome, theme, onToggleTheme }) {
  const assistant = getAssistant(assistantId);

  const [conversations, setConversations] = useState([]); // قائمة المحادثات السابقة
  const [activeId, setActiveId] = useState(null); // المحادثة المفتوحة حالياً
  const [messages, setMessages] = useState([]); // رسائل المحادثة المفتوحة
  const [draft, setDraft] = useState(''); // النص في صندوق الكتابة
  const [busy, setBusy] = useState(false); // هل ننتظر رداً الآن؟
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // للجوال فقط

  const abortRef = useRef(null); // لإيقاف الطلب الجاري
  const scrollRef = useRef(null); // منطقة الرسائل (للتمرير التلقائي)
  const pinnedRef = useRef(true); // هل المستخدم ملتصق بالأسفل؟

  /* ── تحميل قائمة المحادثات عند فتح المساعد ─────────────── */
  const reloadList = useCallback(async () => {
    try {
      setConversations(await fetchConversations(assistantId));
    } catch (err) {
      setError(err.message);
    }
  }, [assistantId]);

  useEffect(() => {
    // عند تغيير المساعد نبدأ من محادثة جديدة فارغة.
    setActiveId(null);
    setMessages([]);
    setDraft('');
    setError(null);
    reloadList();
  }, [assistantId, reloadList]);

  /* ── التمرير التلقائي للأسفل مع وصول النص ──────────────── */
  useEffect(() => {
    const el = scrollRef.current;
    if (el && pinnedRef.current) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    // نعتبره "ملتصقاً بالأسفل" إذا كان قريباً منه بأقل من 120 بكسل.
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }

  /* ── إيقاف أي طلب جارٍ عند مغادرة الصفحة ───────────────── */
  useEffect(() => () => abortRef.current?.abort(), []);

  /* ── فتح محادثة سابقة ──────────────────────────────────── */
  async function openConversation(id) {
    abortRef.current?.abort();
    setBusy(false);
    setError(null);
    setSidebarOpen(false);
    try {
      const conv = await fetchConversation(assistantId, id);
      setActiveId(conv.id);
      setMessages(conv.messages ?? []);
      pinnedRef.current = true;
    } catch (err) {
      setError(err.message);
    }
  }

  /* ── محادثة جديدة ──────────────────────────────────────── */
  function newConversation() {
    abortRef.current?.abort();
    setBusy(false);
    setActiveId(null);
    setMessages([]);
    setError(null);
    setSidebarOpen(false);
  }

  /* ── حذف محادثة ────────────────────────────────────────── */
  async function removeConversation(id) {
    try {
      await apiDelete(assistantId, id);
      if (id === activeId) newConversation();
      await reloadList();
    } catch (err) {
      setError(err.message);
    }
  }

  /* ── إرسال رسالة واستقبال الرد بثاً ────────────────────── */
  async function send(textArg) {
    const text = (textArg ?? draft).trim();
    if (!text || busy) return;

    setError(null);
    setDraft('');
    setBusy(true);
    pinnedRef.current = true;

    // نعرض رسالة المستخدم فوراً + فقاعة فارغة للمساعد تمتلئ تدريجياً.
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text },
      { role: 'assistant', content: '', thinking: '' },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    /** يعدّل آخر رسالة (رسالة المساعد قيد الكتابة). */
    const patchLast = (fn) =>
      setMessages((prev) => {
        const next = [...prev];
        const last = next.length - 1;
        if (last >= 0) next[last] = fn(next[last]);
        return next;
      });

    let convId = activeId;
    let failed = false;

    try {
      await streamChat({
        assistantId,
        conversationId: activeId,
        message: text,
        signal: controller.signal,
        onEvent: (ev) => {
          switch (ev.type) {
            case 'start':
              convId = ev.conversationId;
              setActiveId(ev.conversationId);
              break;
            case 'thinking':
              patchLast((m) => ({ ...m, thinking: (m.thinking ?? '') + ev.text }));
              break;
            case 'delta':
              patchLast((m) => ({ ...m, content: m.content + ev.text }));
              break;
            case 'error':
              failed = true;
              setError(ev.message);
              break;
            default:
              break;
          }
        },
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        failed = true;
        setError(err.message);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;

      // نحذف فقاعة المساعد إن بقيت فارغة (خطأ أو إيقاف مبكر).
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && !last.content.trim()) return prev.slice(0, -1);
        return prev;
      });

      if (!failed && convId) reloadList();
    }
  }

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
  }

  const isEmpty = messages.length === 0;
  const lastMsg = messages[messages.length - 1];
  const waitingFirstToken =
    busy && lastMsg?.role === 'assistant' && !lastMsg.content && !lastMsg.thinking;

  return (
    <div
      className="chat"
      style={{
        '--accent': assistant.c1,
        '--accent-2': assistant.c2,
        '--accent-shadow': assistant.shadow,
      }}
    >
      <Sidebar
        assistant={assistant}
        conversations={conversations}
        activeId={activeId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={openConversation}
        onNew={newConversation}
        onDelete={removeConversation}
      />

      <div className="chat__main">
        {/* ── الشريط العلوي ── */}
        <header className="chat__bar">
          <button
            type="button"
            className="icon-btn chat__menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="فتح سجل المحادثات"
          >
            <MenuIcon width="20" height="20" />
          </button>

          <button type="button" className="back-btn" onClick={onHome}>
            <BackIcon width="17" height="17" />
            <span>الرئيسية</span>
          </button>

          <div className="chat__id">
            <span className="chat__id-icon" aria-hidden="true">
              <AssistantIcon name={assistant.icon} width="17" height="17" />
            </span>
            <span className="chat__id-name">{assistant.name}</span>
          </div>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </header>

        {/* ── منطقة الرسائل ── */}
        <div className="chat__scroll" ref={scrollRef} onScroll={handleScroll}>
          <div className="chat__inner">
            {isEmpty ? (
              <div className="welcome">
                <span
                  className="welcome__icon"
                  aria-hidden="true"
                  style={{ background: `linear-gradient(140deg, ${assistant.c1}, ${assistant.c2})` }}
                >
                  <AssistantIcon name={assistant.icon} width="32" height="32" />
                </span>
                <h2 className="welcome__title">{assistant.name}</h2>
                <p className="welcome__sub">{assistant.description}</p>

                <div className="samples">
                  <p className="samples__label">جرّب أن تسأل:</p>
                  <div className="samples__grid">
                    {assistant.samples.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="sample"
                        onClick={() => send(s)}
                        disabled={busy}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <Message
                  key={i}
                  message={m}
                  assistant={assistant}
                  streaming={busy && i === messages.length - 1 && m.role === 'assistant'}
                />
              ))
            )}

            {waitingFirstToken && <Typing assistant={assistant} />}

            {error && (
              <div className="notice notice--error" role="alert">
                <AlertIcon width="19" height="19" />
                <div>{error}</div>
              </div>
            )}
          </div>
        </div>

        {/* ── صندوق الكتابة ── */}
        <div className="chat__foot">
          <div className="chat__inner">
            <Composer
              value={draft}
              onChange={setDraft}
              onSend={() => send()}
              onStop={stop}
              busy={busy}
              placeholder={`اكتب رسالتك لـ${assistant.name}…`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
