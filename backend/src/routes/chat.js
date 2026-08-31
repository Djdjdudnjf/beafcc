/**
 * مسار المحادثة: نقطة واحدة مرنة تستقبل (نوع المساعد + الرسالة)،
 * توجّهها إلى التعليمات الصحيحة، وتبثّ رد Claude إلى المتصفح مباشرة.
 */
import { Router } from 'express';
import { isValidAssistant } from '../lib/prompts.js';
import { config, apiKeyStatus } from '../lib/config.js';
import { streamReply, describeError } from '../lib/claude.js';
import {
  appendMessage,
  createConversation,
  getConversation,
} from '../lib/storage.js';

export const chatRouter = Router();

/**
 * SSE (Server-Sent Events) = طريقة يرسل بها الخادم رسائل متتابعة
 * إلى المتصفح عبر اتصال واحد مفتوح. كل رسالة تُكتب بالشكل: "data: {...}\n\n".
 */
function sendEvent(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

chatRouter.post('/chat', async (req, res) => {
  const { assistant, conversationId, message } = req.body ?? {};

  // ---- 1) التحقق من صحة المدخلات قبل أي شيء ----
  if (!isValidAssistant(assistant)) {
    return res.status(400).json({
      error: { code: 'bad_assistant', message: 'نوع المساعد غير معروف.' },
    });
  }
  const text = typeof message === 'string' ? message.trim() : '';
  if (!text) {
    return res.status(400).json({
      error: { code: 'empty_message', message: 'الرسالة فارغة.' },
    });
  }
  if (text.length > 8000) {
    return res.status(400).json({
      error: { code: 'too_long', message: 'الرسالة طويلة جداً (الحد 8000 حرف).' },
    });
  }
  const keyStatus = apiKeyStatus();
  if (!keyStatus.ok) {
    return res.status(500).json({
      error: {
        code: 'missing_api_key',
        message:
          'لم يتم ضبط مفتاح Claude API. افتح ملف backend/.env وضع مفتاحك في ANTHROPIC_API_KEY ثم أعد تشغيل الخادم.',
      },
    });
  }

  // ---- 2) تجهيز المحادثة وحفظ رسالة المستخدم ----
  let conversation;
  try {
    conversation = conversationId ? await getConversation(assistant, conversationId) : null;
    if (!conversation) conversation = await createConversation(assistant);
    conversation = await appendMessage(assistant, conversation.id, {
      role: 'user',
      content: text,
    });
  } catch (err) {
    const info = describeError(err);
    return res.status(info.status).json({ error: info });
  }

  // ---- 3) فتح قناة البث نحو المتصفح ----
  res.status(200).set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // يمنع بعض الوسطاء من تجميع البيانات وتأخيرها
  });
  res.flushHeaders?.();

  // لو أغلق المستخدم الصفحة أو ضغط "إيقاف"، نلغي الطلب حتى لا ندفع ثمن رد لن يُقرأ.
  const controller = new AbortController();
  let clientGone = false;
  req.on('close', () => {
    clientGone = true;
    controller.abort();
  });

  sendEvent(res, { type: 'start', conversationId: conversation.id, title: conversation.title });

  // نرسل آخر عدد محدود من الرسائل فقط، للحفاظ على السرعة والتكلفة.
  const history = conversation.messages
    .slice(-config.historyLimit)
    .map(({ role, content }) => ({ role, content }));

  try {
    const result = await streamReply({
      assistantId: assistant,
      messages: history,
      signal: controller.signal,
      onThinking: (chunk) => sendEvent(res, { type: 'thinking', text: chunk }),
      onText: (chunk) => sendEvent(res, { type: 'delta', text: chunk }),
    });

    // نحفظ رد المساعد في ملف المحادثات حتى يظهر عند العودة لاحقاً.
    if (result.text.trim()) {
      await appendMessage(assistant, conversation.id, {
        role: 'assistant',
        content: result.text,
        thinking: result.thinking || undefined,
      });
    }

    if (!clientGone) {
      sendEvent(res, {
        type: 'done',
        conversationId: conversation.id,
        stopReason: result.stopReason,
        model: result.model,
        partial: result.partial,
        usage: result.usage,
      });
      res.end();
    }
  } catch (err) {
    const info = describeError(err);
    if (!clientGone) {
      // الاتصال مفتوح أصلاً، فنرسل الخطأ كحدث بث لا كرمز HTTP.
      sendEvent(res, { type: 'error', code: info.code, message: info.message });
      res.end();
    }
    if (info.code !== 'aborted') console.error(`[chat/${assistant}]`, err?.message ?? err);
  }
});
