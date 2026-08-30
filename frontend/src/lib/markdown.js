/**
 * تحويل نص Markdown (الذي يكتبه المساعد) إلى HTML منسّق وآمن.
 *
 * Markdown هو طريقة كتابة بسيطة: **نص غامق**، قوائم، عناوين…
 * ثم ننظّف الناتج بـ DOMPurify لمنع أي كود خبيث من التنفيذ في الصفحة.
 */
import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  breaks: true, // سطر جديد = سطر جديد فعلاً
  gfm: true,
});

export function renderMarkdown(text) {
  const html = marked.parse(String(text ?? ''));
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['style', 'form', 'input', 'iframe', 'script'],
  });
}
