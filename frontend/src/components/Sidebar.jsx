/**
 * القائمة الجانبية: سجل المحادثات السابقة لهذا المساعد.
 * على الحاسوب تظهر ثابتة، وعلى الجوال تنزلق من الجانب عند الضغط على زر القائمة.
 */
import { AssistantIcon, PlusIcon, TrashIcon, ChatIcon, CloseIcon } from './Icons.jsx';

/** يحوّل التاريخ إلى نص عربي مختصر: "اليوم"، "أمس"، أو التاريخ. */
function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.floor((startOfToday - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);

  if (days === 0) return `اليوم ${d.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}`;
  if (days === 1) return 'أمس';
  if (days < 7) return `قبل ${days} أيام`;
  return d.toLocaleDateString('ar', { day: 'numeric', month: 'short' });
}

export function Sidebar({
  assistant,
  conversations,
  activeId,
  open,
  onClose,
  onSelect,
  onNew,
  onDelete,
}) {
  return (
    <>
      {/* طبقة معتمة خلف القائمة على الجوال */}
      <div
        className={`scrim ${open ? 'scrim--on' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`side ${open ? 'side--open' : ''}`} aria-label="سجل المحادثات">
        <div className="side__top">
          <div className="side__brand">
            <span
              className="side__mark"
              aria-hidden="true"
              style={{ background: `linear-gradient(140deg, ${assistant.c1}, ${assistant.c2})` }}
            >
              <AssistantIcon name={assistant.icon} width="16" height="16" />
            </span>
            <span className="side__name">{assistant.short}</span>
          </div>

          <button
            type="button"
            className="icon-btn side__close"
            onClick={onClose}
            aria-label="إغلاق القائمة"
          >
            <CloseIcon width="18" height="18" />
          </button>
        </div>

        <button type="button" className="new-btn" onClick={onNew}>
          <PlusIcon width="17" height="17" />
          <span>محادثة جديدة</span>
        </button>

        <div className="side__list">
          <p className="side__label">المحادثات السابقة</p>

          {conversations.length === 0 ? (
            <p className="side__empty">
              لا توجد محادثات بعد.
              <br />
              ابدأ بكتابة سؤالك وستُحفظ هنا تلقائياً.
            </p>
          ) : (
            <ul className="conv-list">
              {conversations.map((c) => (
                <li key={c.id}>
                  <div className={`conv ${c.id === activeId ? 'conv--active' : ''}`}>
                    <button type="button" className="conv__open" onClick={() => onSelect(c.id)}>
                      <ChatIcon width="15" height="15" className="conv__icon" />
                      <span className="conv__text">
                        <span className="conv__title">{c.title}</span>
                        <span className="conv__meta">
                          {formatDate(c.updatedAt)} · {c.messageCount} رسالة
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="conv__del"
                      onClick={() => onDelete(c.id)}
                      title="حذف المحادثة"
                      aria-label={`حذف محادثة: ${c.title}`}
                    >
                      <TrashIcon width="15" height="15" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="side__foot">{assistant.note}</p>
      </aside>
    </>
  );
}
