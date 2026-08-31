/**
 * كل الأيقونات مرسومة بصيغة SVG داخل الكود.
 * SVG = رسم بالخطوط والإحداثيات، يبقى حاداً عند أي حجم، ويأخذ لون النص تلقائياً.
 */

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

/* ── أيقونات المساعدين ─────────────────────────────────────── */

export function MedicalIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.2 11.5h3.4l1.6-3.6 2.6 7.4 1.9-4.4 1.2 2.2h2.9" />
      <path d="M20.3 9.6a4.3 4.3 0 0 0-7.5-2.7l-.8.9-.8-.9A4.3 4.3 0 0 0 3.7 9.6" />
      <path d="M4.4 13.9c1.4 2.6 4.5 5 7.6 7 3.1-2 6.2-4.4 7.6-7" />
    </svg>
  );
}

export function CookingIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 10.5V7.2a2.2 2.2 0 0 1 3.7-1.6 2.6 2.6 0 0 1 4.5-.3 2.2 2.2 0 0 1 3.4 1.9v3.3" />
      <path d="M4.6 10.5h15" />
      <path d="M6 13.4h12l-.7 4.9a1.9 1.9 0 0 1-1.9 1.6H8.6a1.9 1.9 0 0 1-1.9-1.6Z" />
      <path d="M9.4 6.1v1.4M14.6 5.6v1.9" />
    </svg>
  );
}

export function MathIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="3.4" />
      <path d="M6.7 8.2h4M8.7 6.2v4" />
      <path d="M13.6 8.2h3.8" />
      <path d="M6.7 15.9h4" />
      <path d="M13.6 14.4h3.8M13.6 17.4h3.8" />
    </svg>
  );
}

/** يختار أيقونة المساعد حسب مفتاحه. */
export function AssistantIcon({ name, ...props }) {
  if (name === 'medical') return <MedicalIcon {...props} />;
  if (name === 'cooking') return <CookingIcon {...props} />;
  return <MathIcon {...props} />;
}

/* ── أيقونات الواجهة ───────────────────────────────────────── */

export function SunIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.1M12 19.3v2.1M4.3 4.3l1.5 1.5M18.2 18.2l1.5 1.5M2.6 12h2.1M19.3 12h2.1M4.3 19.7l1.5-1.5M18.2 5.8l1.5-1.5" />
    </svg>
  );
}

export function MoonIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20.5 14.4A8.6 8.6 0 0 1 9.6 3.5a8.6 8.6 0 1 0 10.9 10.9Z" />
    </svg>
  );
}

/** سهم الرجوع — يتجه لليمين لأن الواجهة عربية (RTL). */
export function BackIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 5.5 15.5 12 9 18.5" />
    </svg>
  );
}

export function SendIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 4 3.8 10.4a.6.6 0 0 0 .05 1.13L10.5 13l1.5 6.6a.6.6 0 0 0 1.12.06Z" />
      <path d="M10.5 13 20 4" />
    </svg>
  );
}

export function StopIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PlusIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}

export function TrashIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 6.6h15M9.6 6.6V5.2a1.4 1.4 0 0 1 1.4-1.4h2a1.4 1.4 0 0 1 1.4 1.4v1.4" />
      <path d="M6.4 6.6l.8 12a1.6 1.6 0 0 0 1.6 1.5h6.4a1.6 1.6 0 0 0 1.6-1.5l.8-12" />
    </svg>
  );
}

export function MenuIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ChatIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20.5 12.6c0 3.9-3.8 7-8.5 7a9.8 9.8 0 0 1-2.6-.35L4.2 21l1.2-3.6a6.6 6.6 0 0 1-2-4.8c0-3.9 3.8-7 8.6-7s8.5 3.1 8.5 7Z" />
    </svg>
  );
}

export function SparkIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.2l1.9 5.2 5.2 1.9-5.2 1.9L12 17.4l-1.9-5.2-5.2-1.9 5.2-1.9Z" />
      <path d="M18.6 15.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7Z" />
    </svg>
  );
}

export function AlertIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4.2 21 19.8H3Z" />
      <path d="M12 10v4M12 16.8v.2" />
    </svg>
  );
}

export function CopyIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="8.6" y="8.6" width="11" height="11" rx="2.4" />
      <path d="M15.4 5.4H6.8a2.4 2.4 0 0 0-2.4 2.4v8.6" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.8 9.7 17.5 19 6.9" />
    </svg>
  );
}
