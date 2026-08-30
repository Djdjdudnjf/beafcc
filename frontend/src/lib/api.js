/**
 * كل الاتصالات مع الخادم في مكان واحد.
 * نستخدم المسار النسبي /api لأن Vite يمرّره تلقائياً إلى الخادم (انظر vite.config.js).
 */

/** رسالة خطأ مفهومة إذا لم يكن الخادم شغالاً أصلاً. */
const OFFLINE_MSG =
  'تعذّر الاتصال بالخادم. تأكد أنك شغّلت الخادم في نافذة طرفية أخرى بالأمر: cd backend ثم npm start';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error(OFFLINE_MSG);
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error?.message ?? `فشل الطلب (${res.status})`);
  }
  return data;
}

/** حالة الخادم: هل المفتاح مضبوط؟ */
export function fetchHealth() {
  return request('/health');
}

/** قائمة المحادثات السابقة لمساعد معيّن. */
export async function fetchConversations(assistantId) {
  const data = await request(`/conversations/${assistantId}`);
  return data.conversations;
}

/** محادثة كاملة برسائلها. */
export async function fetchConversation(assistantId, id) {
  const data = await request(`/conversations/${assistantId}/${id}`);
  return data.conversation;
}

/** حذف محادثة. */
export function deleteConversation(assistantId, id) {
  return request(`/conversations/${assistantId}/${id}`, { method: 'DELETE' });
}

/**
 * إرسال رسالة واستقبال الرد "بثاً" (قطعة قطعة).
 *
 * @param {object} opts
 * @param {string} opts.assistantId
 * @param {string|null} opts.conversationId
 * @param {string} opts.message
 * @param {AbortSignal} opts.signal - لإيقاف التوليد عند الضغط على زر الإيقاف
 * @param {(event: object) => void} opts.onEvent - تُستدعى مع كل حدث قادم من الخادم
 */
export async function streamChat({ assistantId, conversationId, message, signal, onEvent }) {
  let res;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistant: assistantId, conversationId, message }),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') return;
    throw new Error(OFFLINE_MSG);
  }

  // خطأ وقع قبل بدء البث (مثل: المفتاح ناقص) — يصل كـ JSON عادي.
  if (!res.ok && !res.headers.get('content-type')?.includes('text/event-stream')) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error?.message ?? `فشل الطلب (${res.status})`);
  }

  // قراءة البث سطراً سطراً. كل حدث يأتي بالشكل: "data: {...}\n\n"
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    let chunk;
    try {
      chunk = await reader.read();
    } catch (err) {
      if (err.name === 'AbortError') return;
      throw err;
    }
    if (chunk.done) break;

    buffer += decoder.decode(chunk.value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? ''; // آخر جزء قد يكون ناقصاً، نحتفظ به للدورة القادمة

    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith('data:')) continue;
      try {
        onEvent(JSON.parse(line.slice(5).trim()));
      } catch {
        /* حدث تالف — نتجاهله ونكمل */
      }
    }
  }
}
