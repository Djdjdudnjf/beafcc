/* ============================================================
   Replay — سيرفر التحليل الحقيقي (Node 18+ ، بدون مكتبات خارجية)
   يخدم الموقع + يحلّل لقطات مباراتك عبر نموذج رؤية (OpenAI أو Anthropic)
   ويبني النصائح على ميتا EA FC 26 حقيقية.
   التشغيل:  OPENAI_API_KEY=sk-... node server/server.js
   ============================================================ */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const { META_FC26, META_SOURCES } = require("./meta.js");

// ---------- الإعدادات ----------
const ROOT = path.resolve(__dirname, "..");          // مجلد الموقع (ملفات index.html ...)
const DATA = path.join(ROOT, "data");
const JOBS_FILE = path.join(DATA, "jobs.json");
const PORT = parseInt(process.env.PORT || "8787", 10);
const MAX_FRAMES = parseInt(process.env.MAX_FRAMES || "14", 10); // كم لقطة نرسل للذكاء (تحكّم بالتكلفة)
const BODY_LIMIT = 80 * 1024 * 1024;                  // 80MB (اللقطات)

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";
const PROVIDER = OPENAI_KEY ? "openai" : (ANTHROPIC_KEY ? "anthropic" : "");
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";
const OPENAI_BASE = (process.env.OPENAI_BASE || "https://api.openai.com").replace(/\/$/, "");
const ANTHROPIC_BASE = (process.env.ANTHROPIC_BASE || "https://api.anthropic.com").replace(/\/$/, "");

try { fs.mkdirSync(DATA, { recursive: true }); } catch (e) {}

// ---------- مخزن التقارير ----------
function loadJobs() { try { return JSON.parse(fs.readFileSync(JOBS_FILE, "utf8")); } catch (e) { return {}; } }
function saveJobs(j) { try { fs.writeFileSync(JOBS_FILE, JSON.stringify(j)); } catch (e) {} }
function hex32() { let s = "", h = "0123456789abcdef"; for (let i = 0; i < 32; i++) s += h[(Math.random() * 16) | 0]; return s; }

// ---------- اختيار لقطات موزّعة ----------
function sampleFrames(frames, times, max) {
  const n = frames.length;
  if (n <= max) return { f: frames.slice(), t: (times || []).slice() };
  const f = [], t = [];
  for (let i = 0; i < max; i++) {
    const idx = Math.round(i * (n - 1) / (max - 1));
    f.push(frames[idx]); t.push(times ? times[idx] : idx);
  }
  return { f, t };
}

// ---------- الموجّه (prompt) ----------
function buildPrompt(team, tactics, duration) {
  const mm = Math.floor((duration || 0) / 60), ss = Math.round((duration || 0) % 60);
  return `أنت مدرّب كرة قدم محترف متخصص في ألعاب EA SPORTS FC (FIFA). وصلك عدد من اللقطات (صور) مأخوذة بالتساوي من مقطع مباراة لاعب في اللعبة، مدتها حوالي ${mm}:${String(ss).padStart(2,"0")} دقيقة.
فريق اللاعب لونه/اسمه: "${team || "غير محدد"}".${tactics ? " ملاحظات تكتيك من اللاعب: " + JSON.stringify(tactics) : ""}

مهمتك: حلّل ما تراه فعليًا في اللقطات وأعطِ تقريرًا تدريبيًا بالعربي.

قواعد الصدق (مهمة جدًا):
- اعتمد على ما هو ظاهر فعلًا في الصور: النتيجة من لوحة النتيجة إن ظهرت، التشكيلة التقريبية من توزّع اللاعبين، المواقف الواضحة (هجمة، تسديدة، خطأ دفاعي، هدف).
- لا تخترع دقائق أو أحداثًا دقيقة لا تظهر. إذا لم تتضح النتيجة اكتب في score عبارة مثل "النتيجة غير واضحة من اللقطات".
- اجعل التقييم (grade) منطقيًا لما تراه، لا رقمًا عشوائيًا.
- اللحظات (key_moments) يجب أن تصف مواقف فعلية رأيتها، وأوقاتها تقديرية ضمن مدة المقطع.

اعتمد في كل توصية تكتيكية على مرجع ميتا EA FC 26 الحقيقي التالي (لا تخرج عنه كثيرًا):
${META_FC26}

أعِد **فقط** كائن JSON صالح (بدون أي نص قبله أو بعده) بهذا الشكل الحرفي:
{
 "valid_clip": true,                         // false إذا اللقطات ليست من مباراة كرة قدم في اللعبة
 "grade": 7.5,                               // رقم من 0 إلى 10
 "headline": "جملة واحدة تلخّص أهم نقطة",
 "score": "نتيجة المباراة إن ظهرت وإلا عبارة توضح عدم وضوحها",
 "style": "وصف أسلوب لعب اللاعب كما يبدو من اللقطات",
 "strengths": ["3 نقاط قوة واضحة"],
 "recurring_mistakes": ["3 أخطاء متكررة مرتبطة بما رأيت"],
 "key_moments": [{"t":"04:28","kind":"bad","what":"وصف الموقف","lesson":"الدرس منه"}],
 "ratings": [
   {"area":"الدفاع","score":6.5,"note":"سبب"},
   {"area":"الهجوم واستغلال الفرص","score":8,"note":"سبب"},
   {"area":"التمرير وبناء اللعب","score":7,"note":"سبب"},
   {"area":"التمركز","score":7,"note":"سبب"},
   {"area":"القرارات","score":7,"note":"سبب"}
 ],
 "assignment": {"title":"مهمة واحدة لمباراتك القادمة","how":"كيف تنفّذها بالتحديد"},
 "pre_match": {"formation":"تشكيلة مقترحة من الميتا","defensive_style":"...","width_depth":"...","build_up":"...","notes":"..."},
 "player_instructions": [{"pos":"الارتكاز","ins":"Stay Back While Attacking + Cover Center"}],
 "in_game": ["تعليمات أثناء المباراة مبنية على الميتا"],
 "game_plans": {"behind":"خطة عند التأخر","ahead":"خطة عند التقدّم","when":"متى تبدّل"},
 "practice": ["تمارين قصيرة مرتبطة بأخطائه"],
 "drills": [{"name":"اسم التمرين","minutes":15,"how":"طريقته","fixes":"الخطأ الذي يعالجه"}],
 "play_read": {"current_formation":"4-4-2","build_up":"...","attack":"...","press":"...","forward":"...","loses_ball":"...","danger":"..."}
}
اكتب كل النصوص بالعربي الطبيعي الواضح. أعِد JSON فقط.`;
}

// ---------- نداء OpenAI ----------
async function callOpenAI(frames, prompt) {
  const content = [{ type: "text", text: prompt }];
  for (const d of frames) content.push({ type: "image_url", image_url: { url: d, detail: "low" } });
  const r = await fetch(OPENAI_BASE+"/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", "authorization": "Bearer " + OPENAI_KEY },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: "user", content }],
      max_tokens: 3000, temperature: 0.5,
      response_format: { type: "json_object" }
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error("openai: " + (j.error && j.error.message || r.status));
  return j.choices[0].message.content;
}

// ---------- نداء Anthropic ----------
async function callAnthropic(frames, prompt) {
  const content = [];
  for (const d of frames) {
    const m = /^data:(image\/\w+);base64,(.*)$/s.exec(d);
    if (!m) continue;
    content.push({ type: "image", source: { type: "base64", media_type: m[1], data: m[2] } });
  }
  content.push({ type: "text", text: prompt });
  const r = await fetch(ANTHROPIC_BASE+"/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: ANTHROPIC_MODEL, max_tokens: 3000, temperature: 0.5, messages: [{ role: "user", content }] })
  });
  const j = await r.json();
  if (!r.ok) throw new Error("anthropic: " + (j.error && j.error.message || r.status));
  return (j.content || []).map(b => b.text || "").join("");
}

function extractJSON(txt) {
  try { return JSON.parse(txt); } catch (e) {}
  const a = txt.indexOf("{"), b = txt.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(txt.slice(a, b + 1)); } catch (e) {} }
  return null;
}

async function analyze(body) {
  if (!PROVIDER) throw new Error("no_key");
  const frames = Array.isArray(body.frames) ? body.frames.filter(x => typeof x === "string" && x.indexOf("data:image") === 0) : [];
  if (!frames.length) throw new Error("no_frames");
  const s = sampleFrames(frames, body.times, MAX_FRAMES);
  const prompt = buildPrompt(body.team, body.tactics, body.duration);
  const raw = PROVIDER === "openai" ? await callOpenAI(s.f, prompt) : await callAnthropic(s.f, prompt);
  const result = extractJSON(raw);
  if (!result || typeof result !== "object") throw new Error("bad_json");
  result.sources = META_SOURCES;              // نرفق المصادر الحقيقية
  const id = hex32();
  const job = { job: id, mode: body.mode || "match", video: true, _reel: [], result, _ts: Date.now() };
  const jobs = loadJobs(); jobs[id] = job; saveJobs(jobs);
  return job;
}

async function chat(body) {
  if (!PROVIDER) throw new Error("no_key");
  const jobs = loadJobs(); const j = jobs[body.job];
  const ctx = j ? JSON.stringify(j.result).slice(0, 6000) : "(لا يوجد تقرير)";
  const prompt = `أنت مدرّب كرة قدم في EA FC 26. هذا تقرير مباراة اللاعب (JSON): ${ctx}
استند لميتا EA FC 26 الحقيقي عند الحاجة:
${META_FC26}
سؤال اللاعب: ${body.question || ""}
أجب بالعربي باختصار ووضوح وبنصيحة عملية قابلة للتطبيق.`;
  let answer;
  if (PROVIDER === "openai") {
    const r = await fetch(OPENAI_BASE+"/v1/chat/completions", {
      method: "POST", headers: { "content-type": "application/json", "authorization": "Bearer " + OPENAI_KEY },
      body: JSON.stringify({ model: OPENAI_MODEL, messages: [{ role: "user", content: prompt }], max_tokens: 700, temperature: 0.6 })
    });
    const d = await r.json(); if (!r.ok) throw new Error("openai"); answer = d.choices[0].message.content;
  } else {
    const r = await fetch(ANTHROPIC_BASE+"/v1/messages", {
      method: "POST", headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: ANTHROPIC_MODEL, max_tokens: 700, temperature: 0.6, messages: [{ role: "user", content: prompt }] })
    });
    const d = await r.json(); if (!r.ok) throw new Error("anthropic"); answer = (d.content || []).map(b => b.text || "").join("");
  }
  return { answer: answer, left: 8 };
}

// ---------- أدوات HTTP ----------
function send(res, code, obj) { const s = JSON.stringify(obj); res.writeHead(code, { "content-type": "application/json; charset=utf-8" }); res.end(s); }
function readBody(req) {
  return new Promise((resolve, reject) => {
    let len = 0; const chunks = [];
    req.on("data", c => { len += c.length; if (len > BODY_LIMIT) { reject(new Error("too_big")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")); } catch (e) { resolve({}); } });
    req.on("error", reject);
  });
}

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon",
  ".mp4": "video/mp4", ".woff2": "font/woff2" };

function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath.split("?")[0]);
  if (rel === "/" || rel === "") rel = "/index.html";
  const full = path.join(ROOT, path.normalize(rel));
  if (!full.startsWith(ROOT)) { res.writeHead(403); return res.end("forbidden"); }
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }); return res.end("غير موجود"); }
    const ext = path.extname(full).toLowerCase();
    // في وضع السيرفر الحقيقي نزيل demo.js حتى تُستخدم الـ API الحقيقية
    if (rel === "/index.html") {
      let html = data.toString("utf8").replace(/\s*<script src="demo\.js[^"]*"><\/script>/g, "");
      res.writeHead(200, { "content-type": MIME[".html"] }); return res.end(html);
    }
    res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" }); res.end(data);
  });
}

// ---------- التوجيه ----------
const srv = http.createServer(async (req, res) => {
  const u = req.url || "/";
  const p = u.split("?")[0];
  try {
    if (p.indexOf("/api/") === 0) {
      const qs = new URL(u, "http://x").searchParams;
      const body = (req.method === "POST") ? await readBody(req) : {};
      // --- نقاط الذكاء الحقيقية ---
      if (p === "/api/analyze") {
        try { return send(res, 200, await analyze(body)); }
        catch (e) {
          const msg = e.message === "no_key" ? "السيرفر بدون مفتاح ذكاء اصطناعي. ضع OPENAI_API_KEY أو ANTHROPIC_API_KEY."
            : e.message === "no_frames" ? "ما قدرنا نقرأ لقطات من الفيديو، جرّب مقطعًا أوضح."
            : "تعذّر التحليل: " + e.message;
          return send(res, 502, { error: e.message, message: msg });
        }
      }
      if (p === "/api/chat") { try { return send(res, 200, await chat(body)); } catch (e) { return send(res, 200, { message: "تعذّر الرد الآن: " + e.message }); } }
      // --- نقاط مساعدة (وضع شخصي مفتوح) ---
      if (p === "/api/status") return send(res, 200, { live: !!PROVIDER, free: true, provider: PROVIDER || null });
      if (p === "/api/me") return send(res, 200, { user: { email: "you@replay.local", plan: "pro", pro_until: Math.floor(Date.now()/1000)+31536000, credits: 999 } });
      if (p.indexOf("/api/auth/") === 0) { if (p.endsWith("/logout")) return send(res,200,{ok:true}); return send(res, 200, { ok: true, token: "local", user: { email: body.email || "you@replay.local", plan: "pro", pro_until: Math.floor(Date.now()/1000)+31536000, credits: 999 } }); }
      if (p === "/api/video/start") return send(res, 409, {}); // ادفع المسار نحو اللقطات
      if (p === "/api/yt/check") return send(res, 200, { ok: false, message: "طريقة الرابط غير مفعّلة في السيرفر الذاتي بعد — ارفع المقطع كملف." });
      if (p === "/api/job") { const j = loadJobs()[qs.get("id")]; return j ? send(res, 200, { state: "done", job: j.job, mode: j.mode, video: true, result: j.result, _reel: j._reel || [] }) : send(res, 200, { state: "error", error: "no_job", message: "التقرير غير موجود" }); }
      if (p === "/api/jobs") { const ids = (qs.get("ids") || "").split(",").filter(Boolean); const all = loadJobs(); const out = ids.map(i => all[i]).filter(Boolean).map(j => ({ job: j.job, result: j.result, mode: j.mode, video: true })); return send(res, 200, { jobs: out, gone: [] }); }
      if (p === "/api/jobs/delete") { const all = loadJobs(); (body.ids || []).forEach(i => delete all[i]); saveJobs(all); return send(res, 200, { ok: true }); }
      if (p === "/api/journey") return send(res, 200, { ok: true, n: 0 });
      if (p === "/api/leaderboard") return send(res, 200, { rows: [], me: null });
      if (p === "/api/profile") return send(res, 200, { ok: true });
      if (p === "/api/feedback" || p === "/api/ev" || p === "/api/push/sub") return send(res, 200, { ok: true });
      if (p === "/api/push/key") return send(res, 200, { key: null });
      if (p.indexOf("/api/pay/") === 0 || p === "/api/sub/cancel") return send(res, 200, { ok: true, user: { email: "you@replay.local", plan: "pro", pro_until: Math.floor(Date.now()/1000)+31536000, credits: 999 } });
      return send(res, 200, { ok: true });
    }
    // ملفات ثابتة
    serveStatic(req, res, p + (u.includes("?") ? "?" + u.split("?")[1] : ""));
  } catch (e) {
    send(res, 500, { error: "server", message: String(e && e.message || e) });
  }
});

srv.listen(PORT, () => {
  console.log("\n  Replay — سيرفر التحليل الحقيقي");
  console.log("  ────────────────────────────");
  console.log("  افتح:    http://localhost:" + PORT);
  console.log("  المزود:  " + (PROVIDER ? (PROVIDER + " (" + (PROVIDER === "openai" ? OPENAI_MODEL : ANTHROPIC_MODEL) + ")") : "⚠️  لا يوجد مفتاح — ضع OPENAI_API_KEY أو ANTHROPIC_API_KEY"));
  console.log("  لقطات/تحليل: " + MAX_FRAMES);
  console.log("");
});
