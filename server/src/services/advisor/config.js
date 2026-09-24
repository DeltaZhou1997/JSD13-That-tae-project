// ค่าตั้งค่า That-Tae Advisor (RAG) — อ่านจาก ENV ตอนเรียกใช้ เพื่อให้ .env ที่โหลดทีหลังยังมีผล

export function getAdvisorConfig() {
  const env = process.env;
  return {
    apiKey: env.GEMINI_API_KEY || "",
    baseUrl: (env.GEMINI_API_BASE_URL || "https://generativelanguage.googleapis.com").replace(/\/+$/, ""),
    embeddingModel: env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001",
    generationModel: env.GEMINI_GENERATION_MODEL || "gemini-3.5-flash-lite",
    timeoutMs: Number(env.GEMINI_HTTP_TIMEOUT_MS) || 15000,
    // ขนาดเวกเตอร์ (gemini-embedding-001 รองรับ 768 / 1536 / 3072)
    embeddingDim: Number(env.ADVISOR_EMBEDDING_DIM) || 768,
    // ชื่อ Atlas Vector Search index (ถ้าไม่ตั้ง จะคำนวณ cosine ในหน่วยความจำแทน — ข้อมูลร้านมีขนาดเล็ก)
    vectorIndexName: env.ADVISOR_VECTOR_INDEX || "",
    // ซิงก์ index ใหม่ได้บ่อยสุดทุกกี่นาที (เช็กแบบ hash ฝังเฉพาะข้อมูลที่เปลี่ยน)
    syncIntervalMs: (Number(env.ADVISOR_SYNC_MINUTES) || 10) * 60 * 1000,
    topK: Number(env.ADVISOR_TOP_K) || 8,
    minScore: Number(env.ADVISOR_MIN_SCORE) || 0.45,
    // จำกัดจำนวนคำถามต่อผู้ใช้/IP ต่อนาที
    rateLimitPerMinute: Number(env.ADVISOR_RATE_LIMIT_PER_MINUTE) || 12,
    // เพดานรายวัน กันยิงทั้งวันจนเปลือง quota ของ Gemini
    dailyLimitPerUser: Number(env.ADVISOR_DAILY_LIMIT_PER_USER) || 100,
    dailyLimitGlobal: Number(env.ADVISOR_DAILY_LIMIT_GLOBAL) || 3000,
  };
}

export function isAdvisorEnabled() {
  return Boolean(process.env.GEMINI_API_KEY);
}
