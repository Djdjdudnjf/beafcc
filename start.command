#!/usr/bin/env bash
# ملف تشغيل Replay بضغطة واحدة — ماك / لينكس
# طريقة الاستخدام: دبل كليك على هذا الملف (ماك)، أو شغّله من التيرمنال.
cd "$(dirname "$0")" || exit 1

echo ""
echo "  ▶ Replay — جاري التشغيل..."
echo "  ──────────────────────────"

# حمّل الإعدادات من .env إن وُجد
if [ -f .env ]; then set -a; . ./.env; set +a; fi

# تأكد من Node
if ! command -v node >/dev/null 2>&1; then
  echo "  ✗ Node.js مو مثبّت."
  echo "    ثبّته من: https://nodejs.org  (نسخة LTS) ثم جرّب مرة ثانية."
  read -r -p "  اضغط Enter للخروج... " _; exit 1
fi

# تأكد من المفتاح (واعتبر القيمة النموذجية xxxx كأنها فاضية)
needkey=1
case "$ANTHROPIC_API_KEY$OPENAI_API_KEY" in
  ""|*xxxx*) needkey=1 ;;
  *) needkey=0 ;;
esac
if [ "$needkey" = "1" ]; then
  echo ""
  echo "  أول مرة فقط: الصق مفتاح Anthropic (يبدأ بـ sk-ant-)"
  echo "  تجيبه من: https://console.anthropic.com/  ← Settings ← API Keys"
  printf "  المفتاح: "; read -r KEY
  if [ -z "$KEY" ]; then echo "  ✗ ما أدخلت مفتاح."; read -r -p "  Enter للخروج... " _; exit 1; fi
  export ANTHROPIC_API_KEY="$KEY"
  # احفظه للمرات الجاية
  if [ -f .env ]; then grep -v '^ANTHROPIC_API_KEY=' .env > .env.tmp 2>/dev/null; mv .env.tmp .env; fi
  echo "ANTHROPIC_API_KEY=$KEY" >> .env
  printf "  (اختياري) كلمة مرور لحماية الموقع، أو Enter للتجاوز: "; read -r PW
  if [ -n "$PW" ]; then export APP_PASSWORD="$PW"; echo "APP_PASSWORD=$PW" >> .env; fi
  echo "  ✓ تم الحفظ في ملف .env"
fi

PORT="${PORT:-8787}"
# افتح المتصفح بعد ثانيتين
( sleep 2
  if command -v open >/dev/null 2>&1; then open "http://localhost:$PORT"
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "http://localhost:$PORT"; fi ) &

echo "  ✓ افتح المتصفح على: http://localhost:$PORT"
echo "  (أغلق هذه النافذة لإيقاف السيرفر)"
echo ""
node server/server.js
