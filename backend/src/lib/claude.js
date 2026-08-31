/**
 * كل ما يخص الاتصال بـ Claude API.
 *
 * نستخدم "البث" (Streaming): بدل انتظار الرد كاملاً ثم عرضه دفعة واحدة،
 * يصلنا الرد على شكل قطع صغيرة نمررها فوراً إلى المتصفح، فيظهر وكأنه يُكتب أمامك.
 */
import Anthropic from '@anthropic-ai/sdk';
import { config } from './config.js';
import { ASSISTANTS } from './prompts.js';

/**
 * العميل (client) هو الكائن الذي يتكلم مع خوادم Anthropic نيابة عنا.
 * ننشئه مرة واحدة فقط عند أول استخدام.
 */
let client = null;
function getClient() {
  if (!client) {
    client = new Anthropic({
      apiKey: config.apiKey,
      maxRetries: 2, // إعادة المحاولة تلقائياً مرتين عند مشاكل الشبكة المؤقتة
      // مطلوبة فقط مع المفاتيح "المرتبطة بالهوية" (انظر شرح workspaceId في config.js).
      defaultHeaders: config.workspaceId
        ? { 'anthropic-workspace-id': config.workspaceId }
        : undefined,
    });
  }
  return client;
}

/** بيتا "الاحتياط عند الرفض": لو رفض الموديل الطلب لأسباب أمان، يعيد تشغيله على موديل بديل. */
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

/** نطفئها تلقائياً إذا اتضح أن الحساب لا يدعمها، فلا نعيد المحاولة الفاشلة كل مرة. */
let betaSupported = true;

/** يبني معطيات الطلب المرسل إلى Claude. */
function buildParams(assistantId, messages, withFallbacks) {
  const assistant = ASSISTANTS[assistantId];

  const params = {
    model: config.model,
    max_tokens: config.maxTokens,
    // تعليمات المساعد. نضع cache_control حتى تُخزَّن مؤقتاً على خوادم Anthropic،
    // فلا نُحاسب على قراءتها كاملة في كل رسالة (توفير كبير في التكلفة).
    system: [
      {
        type: 'text',
        text: assistant.systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages,
    // التفكير التكيّفي: الموديل يقرر بنفسه متى يحتاج تفكيراً أعمق (مفيد جداً للرياضيات).
    // display: 'summarized' يعطينا ملخصاً للتفكير نعرضه للمستخدم في صندوق قابل للطي.
    thinking: { type: 'adaptive', display: 'summarized' },
    output_config: { effort: config.effort },
  };

  if (withFallbacks) {
    params.betas = [FALLBACK_BETA];
    params.fallbacks = 'default';
  }

  return params;
}

/** هل الخطأ سببه أن الحساب لا يدعم خاصية البيتا؟ عندها نعيد المحاولة بدونها. */
function isBetaRejection(err) {
  if (!(err instanceof Anthropic.APIError)) return false;
  if (err.status !== 400 && err.status !== 403 && err.status !== 404) return false;
  const msg = String(err.message ?? '').toLowerCase();
  return msg.includes('fallback') || msg.includes('beta') || msg.includes('unsupported');
}

/**
 * يرسل المحادثة إلى Claude ويبث الرد قطعة قطعة.
 *
 * @param {object} options
 * @param {string} options.assistantId  - 'medical' | 'cooking' | 'math'
 * @param {Array}  options.messages     - سجل المحادثة [{role, content}]
 * @param {Function} options.onThinking - تُستدعى مع كل قطعة من ملخص التفكير
 * @param {Function} options.onText     - تُستدعى مع كل قطعة من نص الإجابة
 * @param {AbortSignal} [options.signal]- لإلغاء الطلب إذا أغلق المستخدم الصفحة
 * @returns {Promise<{text: string, thinking: string, stopReason: string, model: string, usage: object}>}
 */
export async function streamReply({ assistantId, messages, onThinking, onText, signal }) {
  const anthropic = getClient();

  /**
   * تشغيل محاولة واحدة: نفتح البث ونقرأه حتى النهاية.
   * ملاحظة مهمة: أخطاء الطلب (مثل رفض خاصية البيتا) لا تظهر عند فتح البث،
   * بل أثناء قراءته — لذلك يجب أن تكون القراءة كلها داخل try واحدة.
   */
  async function runAttempt(withFallbacks) {
    const params = buildParams(assistantId, messages, withFallbacks);
    // عند استخدام خصائص البيتا يجب استدعاء المسار beta من المكتبة.
    const surface = withFallbacks ? anthropic.beta.messages : anthropic.messages;
    const stream = surface.stream(params, signal ? { signal } : undefined);

    let text = '';
    let thinking = '';
    let emitted = false; // هل أرسلنا شيئاً للمتصفح فعلاً؟

    try {
      for await (const event of stream) {
        if (event.type !== 'content_block_delta') continue;
        if (event.delta.type === 'text_delta') {
          text += event.delta.text;
          emitted = true;
          onText?.(event.delta.text);
        } else if (event.delta.type === 'thinking_delta') {
          thinking += event.delta.thinking;
          emitted = true;
          onThinking?.(event.delta.thinking);
        }
      }
    } catch (err) {
      // لو انقطع البث في منتصفه ولدينا نص جزئي، نعيده بدل أن نضيّعه.
      if (text.trim()) {
        return {
          text,
          thinking,
          stopReason: 'interrupted',
          model: config.model,
          usage: null,
          partial: true,
        };
      }
      err.murshidEmitted = emitted;
      throw err;
    }

    const finalMessage = await stream.finalMessage();

    // قد يرفض الموديل الطلب لأسباب أمان — نُظهر رسالة مفهومة بدل صفحة فارغة.
    if (finalMessage.stop_reason === 'refusal' && !text.trim()) {
      text =
        'أعتذر، لم أستطع معالجة هذا الطلب. جرّب إعادة صياغة سؤالك بشكل مختلف، ' +
        'أو تأكد أنه ضمن تخصص هذا المساعد.';
    }

    return {
      text,
      thinking,
      stopReason: finalMessage.stop_reason,
      model: finalMessage.model,
      usage: finalMessage.usage ?? null,
      partial: false,
    };
  }

  try {
    return await runAttempt(betaSupported);
  } catch (err) {
    // نعيد المحاولة بدون خاصية البيتا فقط إذا كان الرفض بسببها ولم يصل للمستخدم أي نص.
    if (isBetaRejection(err) && !err.murshidEmitted) {
      console.warn('\u2139\ufe0f  خاصية الاحتياط (fallbacks) غير متاحة لهذا الحساب — سنكمل بدونها.');
      betaSupported = false;
      return runAttempt(false);
    }
    throw err;
  }
}

/**
 * يحوّل أخطاء المكتبة إلى رسائل عربية مفهومة للمستخدم العادي.
 * نستخدم أصناف الأخطاء الجاهزة في المكتبة (وليس مطابقة نصوص).
 */
export function describeError(err) {
  if (err?.name === 'AbortError') {
    return { status: 499, code: 'aborted', message: 'تم إلغاء الطلب.' };
  }
  if (err instanceof Anthropic.AuthenticationError) {
    return {
      status: 401,
      code: 'bad_api_key',
      message:
        'مفتاح Claude API غير صحيح أو منتهي. افتح ملف backend/.env وتأكد من قيمة ANTHROPIC_API_KEY، ثم أعد تشغيل الخادم.',
    };
  }
  if (err instanceof Anthropic.PermissionDeniedError) {
    return {
      status: 403,
      code: 'forbidden',
      message: 'المفتاح لا يملك صلاحية استخدام هذا الموديل. راجع إعدادات حسابك في console.anthropic.com.',
    };
  }
  if (err instanceof Anthropic.NotFoundError) {
    return {
      status: 404,
      code: 'model_not_found',
      message: `لم يتم العثور على الموديل "${config.model}". تأكد من قيمة ANTHROPIC_MODEL في ملف .env.`,
    };
  }
  if (err instanceof Anthropic.RateLimitError) {
    return {
      status: 429,
      code: 'rate_limited',
      message: 'تم إرسال طلبات كثيرة في وقت قصير. انتظر دقيقة ثم أعد المحاولة.',
    };
  }
  if (err instanceof Anthropic.BadRequestError) {
    if (String(err.message ?? '').includes('anthropic-workspace-id')) {
      return {
        status: 400,
        code: 'missing_workspace_id',
        message:
          'مفتاحك يحتاج "معرّف مساحة العمل" (Workspace ID) معه. أضِف ANTHROPIC_WORKSPACE_ID في إعدادات الاستضافة — التفاصيل في دليل التشغيل.',
      };
    }
    return {
      status: 400,
      code: 'bad_request',
      message: `طلب غير صالح: ${err.message}`,
    };
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return {
      status: 503,
      code: 'no_connection',
      message: 'تعذّر الاتصال بخوادم Claude. تأكد من اتصالك بالإنترنت ثم أعد المحاولة.',
    };
  }
  if (err instanceof Anthropic.APIError) {
    return {
      status: err.status ?? 500,
      code: 'api_error',
      message: `خطأ من خوادم Claude (${err.status ?? '?'}): ${err.message}`,
    };
  }
  console.error(err);
  return {
    status: 500,
    code: 'server_error',
    message: 'حدث خطأ غير متوقع في الخادم. راجع نافذة الطرفية لمعرفة التفاصيل.',
  };
}
