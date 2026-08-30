/**
 * تخزين المحادثات في ملفات JSON — ملف مستقل لكل مساعد داخل مجلد backend/data.
 * (JSON هو صيغة نصية بسيطة لحفظ البيانات، يقرأها الإنسان والحاسوب.)
 *
 * ملاحظتان مهمتان في التنفيذ:
 *  1. نستخدم "طابور" (queue) حتى لا تحدث كتابتان في نفس اللحظة فتتلف البيانات.
 *  2. نكتب في ملف مؤقت ثم نعيد تسميته، حتى لا يبقى الملف نصف مكتوب لو انقطعت الكهرباء.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { config } from './config.js';
import { ASSISTANT_IDS, isValidAssistant } from './prompts.js';

/** طابور الكتابة: كل عملية كتابة تنتظر التي قبلها. */
let writeQueue = Promise.resolve();

function fileFor(assistantId) {
  return path.join(config.dataDir, `${assistantId}.json`);
}

/** ينشئ مجلد data إن لم يكن موجوداً. */
async function ensureDataDir() {
  await fs.mkdir(config.dataDir, { recursive: true });
}

/** يقرأ كل محادثات مساعد معيّن. يرجع مصفوفة فارغة إن لم يوجد الملف بعد. */
async function readAll(assistantId) {
  try {
    const raw = await fs.readFile(fileFor(assistantId), 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.conversations) ? parsed.conversations : [];
  } catch (err) {
    if (err.code === 'ENOENT') return []; // الملف غير موجود = لا توجد محادثات بعد
    if (err instanceof SyntaxError) {
      // الملف تالف: ننسخه جانباً بدل حذفه حتى لا تضيع بيانات المستخدم.
      const backup = `${fileFor(assistantId)}.corrupt-${Date.now()}`;
      await fs.rename(fileFor(assistantId), backup).catch(() => {});
      console.error(`⚠️  ملف ${assistantId}.json تالف. تم نسخه إلى ${backup} والبدء من جديد.`);
      return [];
    }
    throw err;
  }
}

/** يكتب كل محادثات مساعد معيّن بشكل آمن (عبر ملف مؤقت + إعادة تسمية). */
async function writeAll(assistantId, conversations) {
  await ensureDataDir();
  const target = fileFor(assistantId);
  const tmp = `${target}.tmp-${process.pid}`;
  const payload = JSON.stringify({ assistant: assistantId, conversations }, null, 2);
  await fs.writeFile(tmp, payload, 'utf8');
  await fs.rename(tmp, target);
}

/** ينفّذ عملية تعديل على ملف مساعد، مع ضمان عدم تداخل عمليتين. */
function withLock(task) {
  const run = writeQueue.then(task, task);
  // نمنع توقف الطابور لو فشلت عملية واحدة
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/** عنوان مختصر للمحادثة مأخوذ من أول رسالة للمستخدم. */
function makeTitle(text) {
  const clean = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return 'محادثة جديدة';
  return clean.length > 45 ? `${clean.slice(0, 45)}…` : clean;
}

/** قائمة مختصرة بالمحادثات (بدون الرسائل) لعرضها في القائمة الجانبية. */
export async function listConversations(assistantId) {
  if (!isValidAssistant(assistantId)) throw new Error('مساعد غير معروف');
  const all = await readAll(assistantId);
  return all
    .map(({ id, title, createdAt, updatedAt, messages }) => ({
      id,
      title,
      createdAt,
      updatedAt,
      messageCount: messages?.length ?? 0,
    }))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

/** محادثة واحدة كاملة برسائلها. يرجع null إن لم توجد. */
export async function getConversation(assistantId, conversationId) {
  if (!isValidAssistant(assistantId)) throw new Error('مساعد غير معروف');
  const all = await readAll(assistantId);
  return all.find((c) => c.id === conversationId) ?? null;
}

/** ينشئ محادثة جديدة فارغة ويرجعها. */
export async function createConversation(assistantId) {
  if (!isValidAssistant(assistantId)) throw new Error('مساعد غير معروف');
  const now = new Date().toISOString();
  const conversation = {
    id: randomUUID(),
    assistant: assistantId,
    title: 'محادثة جديدة',
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
  await withLock(async () => {
    const all = await readAll(assistantId);
    all.push(conversation);
    await writeAll(assistantId, all);
  });
  return conversation;
}

/**
 * يضيف رسالة إلى محادثة. إن لم تكن المحادثة موجودة يتم إنشاؤها بنفس المعرّف.
 * message = { role: 'user' | 'assistant', content: string }
 */
export async function appendMessage(assistantId, conversationId, message) {
  if (!isValidAssistant(assistantId)) throw new Error('مساعد غير معروف');
  return withLock(async () => {
    const all = await readAll(assistantId);
    const now = new Date().toISOString();
    let conversation = all.find((c) => c.id === conversationId);

    if (!conversation) {
      conversation = {
        id: conversationId,
        assistant: assistantId,
        title: 'محادثة جديدة',
        createdAt: now,
        updatedAt: now,
        messages: [],
      };
      all.push(conversation);
    }

    conversation.messages.push({ ...message, createdAt: now });
    conversation.updatedAt = now;

    // أول رسالة من المستخدم تصبح عنوان المحادثة في القائمة الجانبية.
    if (message.role === 'user' && conversation.title === 'محادثة جديدة') {
      conversation.title = makeTitle(message.content);
    }

    await writeAll(assistantId, all);
    return conversation;
  });
}

/** يحذف محادثة. يرجع true إن حُذفت فعلاً. */
export async function deleteConversation(assistantId, conversationId) {
  if (!isValidAssistant(assistantId)) throw new Error('مساعد غير معروف');
  return withLock(async () => {
    const all = await readAll(assistantId);
    const next = all.filter((c) => c.id !== conversationId);
    if (next.length === all.length) return false;
    await writeAll(assistantId, next);
    return true;
  });
}

/** يهيّئ مجلد التخزين وملفات المساعدين عند بدء تشغيل الخادم. */
export async function initStorage() {
  await ensureDataDir();
  for (const id of ASSISTANT_IDS) {
    try {
      await fs.access(fileFor(id));
    } catch {
      await writeAll(id, []);
    }
  }
}
