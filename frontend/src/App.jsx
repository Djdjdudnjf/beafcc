/**
 * الملف الرئيسي: يقرر أي صفحة تُعرض (الرئيسية أم محادثة)،
 * ويحمّل حالة الخادم مرة واحدة عند فتح الموقع.
 */
import { useEffect, useState } from 'react';
import { useRouter } from './lib/router.js';
import { useTheme } from './lib/useTheme.js';
import { fetchHealth, getAccessCode } from './lib/api.js';
import { getAssistant } from './lib/assistants.js';
import { Home } from './components/Home.jsx';
import { Chat } from './components/Chat.jsx';
import { Gate } from './components/Gate.jsx';

export default function App() {
  const { route, navigate } = useRouter();
  const { theme, toggle } = useTheme();
  const [health, setHealth] = useState(null);
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  // نسأل الخادم مرة واحدة: هل أنت شغّال؟ وهل المفتاح مضبوط؟ وهل يلزم رمز دخول؟
  useEffect(() => {
    fetchHealth()
      .then((h) => {
        setHealth(h);
        if (h?.requiresCode && !getAccessCode()) setLocked(true);
      })
      .catch(() => setHealth({ ok: false, apiKeyConfigured: false, offline: true }))
      .finally(() => setChecked(true));
  }, []);

  // إذا رفض الخادم الرمز في أي وقت لاحق، نعيد إظهار شاشة الرمز.
  useEffect(() => {
    const onUnauthorized = () => setLocked(true);
    window.addEventListener('murshid:unauthorized', onUnauthorized);
    return () => window.removeEventListener('murshid:unauthorized', onUnauthorized);
  }, []);

  if (!checked) {
    return (
      <div className="boot">
        <div className="boot__spin" />
        <p>جارٍ التحميل…</p>
      </div>
    );
  }

  if (locked) return <Gate onUnlock={() => setLocked(false)} />;

  // صفحة المحادثة (فقط إذا كان اسم المساعد في الرابط صحيحاً).
  if (route.page === 'chat' && getAssistant(route.assistantId)) {
    return (
      <Chat
        assistantId={route.assistantId}
        onHome={() => navigate('/')}
        theme={theme}
        onToggleTheme={toggle}
      />
    );
  }

  return (
    <Home
      onOpen={(id) => navigate(`/chat/${id}`)}
      theme={theme}
      onToggleTheme={toggle}
      health={health}
    />
  );
}
