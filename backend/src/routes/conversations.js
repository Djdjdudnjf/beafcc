/** مسارات إدارة سجل المحادثات: عرض، فتح، إنشاء، حذف. */
import { Router } from 'express';
import { ASSISTANTS, isValidAssistant } from '../lib/prompts.js';
import {
  listConversations,
  getConversation,
  createConversation,
  deleteConversation,
} from '../lib/storage.js';

export const conversationsRouter = Router();

/** وسيط صغير يتأكد أن اسم المساعد في الرابط صحيح. */
function requireAssistant(req, res, next) {
  if (!isValidAssistant(req.params.assistant)) {
    return res.status(404).json({
      error: { code: 'bad_assistant', message: 'نوع المساعد غير معروف.' },
    });
  }
  next();
}

/** بيانات المساعدين الثلاثة (الاسم، الوصف، رسالة الترحيب). */
conversationsRouter.get('/assistants', (_req, res) => {
  res.json({
    assistants: Object.values(ASSISTANTS).map(({ id, name, tagline, greeting }) => ({
      id,
      name,
      tagline,
      greeting,
    })),
  });
});

/** قائمة محادثات مساعد معيّن (للقائمة الجانبية). */
conversationsRouter.get('/conversations/:assistant', requireAssistant, async (req, res, next) => {
  try {
    res.json({ conversations: await listConversations(req.params.assistant) });
  } catch (err) {
    next(err);
  }
});

/** محادثة واحدة كاملة برسائلها. */
conversationsRouter.get(
  '/conversations/:assistant/:id',
  requireAssistant,
  async (req, res, next) => {
    try {
      const conversation = await getConversation(req.params.assistant, req.params.id);
      if (!conversation) {
        return res
          .status(404)
          .json({ error: { code: 'not_found', message: 'المحادثة غير موجودة.' } });
      }
      res.json({ conversation });
    } catch (err) {
      next(err);
    }
  },
);

/** إنشاء محادثة جديدة فارغة. */
conversationsRouter.post('/conversations/:assistant', requireAssistant, async (req, res, next) => {
  try {
    res.status(201).json({ conversation: await createConversation(req.params.assistant) });
  } catch (err) {
    next(err);
  }
});

/** حذف محادثة. */
conversationsRouter.delete(
  '/conversations/:assistant/:id',
  requireAssistant,
  async (req, res, next) => {
    try {
      const removed = await deleteConversation(req.params.assistant, req.params.id);
      if (!removed) {
        return res
          .status(404)
          .json({ error: { code: 'not_found', message: 'المحادثة غير موجودة.' } });
      }
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
);
