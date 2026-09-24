import { getApiUrl, getAuthHeaders } from "./authHeader.js";

const base = () => `${getApiUrl()}/api/v2/import`;

async function json(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `เกิดข้อผิดพลาด (${res.status})`);
  return data;
}

/** ชื่อซ้ำ/ใกล้เคียงในระบบ — type: "products" | "ingredients" */
export async function fetchSimilarNames(type, name, excludeId) {
  const q = new URLSearchParams({ name: String(name || "").trim() });
  if (excludeId) q.set("excludeId", excludeId);
  const res = await fetch(`${base()}/similar/${type}?${q}`, { headers: getAuthHeaders() });
  return (await json(res)).matches || [];
}

/** ดาวน์โหลดไฟล์ตัวอย่าง (.zip) */
export async function downloadTemplate(type) {
  const res = await fetch(`${base()}/template/${type}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("ดาวน์โหลดไฟล์ตัวอย่างไม่สำเร็จ");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `that-tae-${type}-template.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function fetchImportColumns(type) {
  const res = await fetch(`${base()}/columns/${type}`, { headers: getAuthHeaders() });
  return (await json(res)).files || {};
}

/**
 * อัปโหลด zip เพื่อตรวจ (ยังไม่บันทึก) — ใช้ XHR เพื่อรายงาน % การอัปโหลด
 * @param {(percent:number)=>void} onProgress
 */
export function uploadForPreview(type, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${base()}/${type}/preview`);
    Object.entries(getAuthHeaders()).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText || "{}");
      } catch {
        /* ignore */
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.message || `อัปโหลดไม่สำเร็จ (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้"));
    const form = new FormData();
    form.append("file", file);
    xhr.send(form);
  });
}

export async function commitImport(importId, choices) {
  const res = await fetch(`${base()}/${importId}/commit`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ choices }),
  });
  return json(res);
}

export async function fetchImportStatus(importId) {
  const res = await fetch(`${base()}/${importId}/status`, { headers: getAuthHeaders() });
  return json(res);
}

export async function cancelImport(importId) {
  await fetch(`${base()}/${importId}`, { method: "DELETE", headers: getAuthHeaders() }).catch(() => {});
}

/** รูปจาก zip สำหรับ preview (ต้องส่ง token จึงโหลดผ่าน fetch แล้วทำเป็น blob URL) */
export async function fetchImportImageUrl(importId, name) {
  const res = await fetch(`${base()}/${importId}/image/${encodeURIComponent(name)}`, { headers: getAuthHeaders() });
  if (!res.ok) return null;
  return URL.createObjectURL(await res.blob());
}
