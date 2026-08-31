/** الصفحة الرئيسية: ترحيب + ثلاث بطاقات، كل بطاقة تفتح مساعداً. */
import { ASSISTANTS } from '../lib/assistants.js';
import { AssistantIcon, SparkIcon, AlertIcon } from './Icons.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';

export function Home({ onOpen, theme, onToggleTheme, health }) {
  return (
    <div className="home">
      {/* خلفية زخرفية متدرجة */}
      <div className="home__glow" aria-hidden="true" />

      <header className="home__bar">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            <SparkIcon width="20" height="20" />
          </span>
          <span className="brand__name">مرشد</span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      {/* تنبيه يظهر فقط إذا كان مفتاح API ناقصاً */}
      {health && !health.apiKeyConfigured && (
        <div className="notice notice--warn" role="alert">
          <AlertIcon width="19" height="19" />
          <div>
            <strong>مفتاح Claude API غير مضبوط.</strong> افتح الملف{' '}
            <code>backend/.env</code> وضع مفتاحك في <code>ANTHROPIC_API_KEY</code>، ثم أعد
            تشغيل الخادم. (الخطوة رقم ٤ في دليل التشغيل)
          </div>
        </div>
      )}

      <main className="home__main">
        <section className="hero">
          <p className="hero__eyebrow">منصة مساعدين أذكياء</p>
          <h1 className="hero__title">
            اختر <span className="hero__accent">مرشدك</span>
          </h1>
          <p className="hero__sub">
            ثلاثة مساعدين، كل واحد متخصص في مجاله وحده — يجيبك بعمق داخل تخصصه،
            ويعتذر بأدب عمّا هو خارجه.
          </p>
        </section>

        <section className="cards" aria-label="اختيار المساعد">
          {ASSISTANTS.map((a, i) => (
            <button
              key={a.id}
              type="button"
              className="card"
              style={{
                '--c1': a.c1,
                '--c2': a.c2,
                '--card-shadow': a.shadow,
                animationDelay: `${i * 90}ms`,
              }}
              onClick={() => onOpen(a.id)}
            >
              <span className="card__stripe" aria-hidden="true" />

              <span className="card__icon" aria-hidden="true">
                <AssistantIcon name={a.icon} width="28" height="28" />
              </span>

              <span className="card__body">
                <span className="card__tagline">{a.tagline}</span>
                <span className="card__title">{a.name}</span>
                <span className="card__desc">{a.description}</span>
              </span>

              <span className="card__note">{a.note}</span>

              <span className="card__cta">
                ابدأ المحادثة
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 5.5 7.5 12l6.5 6.5" />
                </svg>
              </span>
            </button>
          ))}
        </section>
      </main>

      <footer className="home__foot">
        <p>
          مبني على Claude · المعلومات الطبية توعوية عامة ولا تغني عن استشارة طبيب مختص.
        </p>
      </footer>
    </div>
  );
}
