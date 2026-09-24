// เรียก Gemini ผ่าน REST (ไม่ต้องติดตั้ง SDK เพิ่ม) — ใช้ fetch ของ Node 18+
import { getAdvisorConfig } from "./config.js";

const EMBED_BATCH_SIZE = 100; // batchEmbedContents รับได้สูงสุด 100 รายการต่อครั้ง

export class GeminiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
  }
}

async function callGemini(model, method, body) {
  const cfg = getAdvisorConfig();
  if (!cfg.apiKey) throw new GeminiError("ยังไม่ได้ตั้งค่า GEMINI_API_KEY", 503);

  const url = `${cfg.baseUrl}/v1beta/models/${encodeURIComponent(model)}:${method}`;
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": cfg.apiKey },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(cfg.timeoutMs),
    });
  } catch (err) {
    const timedOut = err?.name === "TimeoutError" || err?.name === "AbortError";
    throw new GeminiError(timedOut ? "Gemini ตอบกลับช้าเกินกำหนด" : `เชื่อมต่อ Gemini ไม่สำเร็จ: ${err.message}`, 504);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // ไม่ส่งรายละเอียดของ Google กลับไปหา client — log ฝั่ง server พอ
    throw new GeminiError(`Gemini ${method} ผิดพลาด (${res.status}): ${data?.error?.message || res.statusText}`, res.status);
  }
  return data;
}

/** ฝังข้อความหลายชิ้น (ใช้ตอนสร้าง index) */
export async function embedDocuments(texts, titles = []) {
  const cfg = getAdvisorConfig();
  const vectors = [];
  for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
    const slice = texts.slice(i, i + EMBED_BATCH_SIZE);
    const data = await callGemini(cfg.embeddingModel, "batchEmbedContents", {
      requests: slice.map((text, j) => ({
        model: `models/${cfg.embeddingModel}`,
        content: { parts: [{ text }] },
        taskType: "RETRIEVAL_DOCUMENT",
        ...(titles[i + j] ? { title: titles[i + j] } : {}),
        outputDimensionality: cfg.embeddingDim,
      })),
    });
    for (const e of data.embeddings || []) vectors.push(e.values || []);
  }
  return vectors;
}

/** ฝังคำถามของผู้ใช้ */
export async function embedQuery(text) {
  const cfg = getAdvisorConfig();
  const data = await callGemini(cfg.embeddingModel, "embedContent", {
    content: { parts: [{ text }] },
    taskType: "RETRIEVAL_QUERY",
    outputDimensionality: cfg.embeddingDim,
  });
  return data.embedding?.values || [];
}

/**
 * สร้างคำตอบแบบ JSON ตาม responseSchema
 * @param {{ systemInstruction: string, contents: Array, responseSchema: object }} opts
 */
export async function generateJson({ systemInstruction, contents, responseSchema, temperature = 0.3, maxOutputTokens = 1024 }) {
  const cfg = getAdvisorConfig();
  const data = await callGemini(cfg.generationModel, "generateContent", {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens,
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  if (data.promptFeedback?.blockReason) {
    throw new GeminiError(`คำถามถูกบล็อกโดยตัวกรองความปลอดภัย (${data.promptFeedback.blockReason})`, 422);
  }
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
  try {
    return JSON.parse(text);
  } catch {
    throw new GeminiError("Gemini ส่งคำตอบที่ไม่ใช่ JSON", 502);
  }
}
