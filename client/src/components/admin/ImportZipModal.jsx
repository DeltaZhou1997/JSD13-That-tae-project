import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  cancelImport,
  commitImport,
  downloadTemplate,
  fetchImportColumns,
  fetchImportImageUrl,
  fetchImportStatus,
  uploadForPreview,
} from "../../utils/adminImportApi.js";

const TYPE_TEXT = {
  ingredients: { kind: "วัตถุดิบ", structure: ["ingredients.csv"], hint: "1 แถว = 1 วัตถุดิบ" },
  products: {
    kind: "เมนู",
    structure: ["products.csv", "recipes.csv", "images/", "  ├─ laab-moo.jpg", "  └─ ..."],
    hint: "products.csv 1 แถว = 1 เมนู · recipes.csv 1 แถว = วัตถุดิบ 1 รายการในสูตร (ผูกด้วย code) · รูปอยู่ในโฟลเดอร์ images/",
  },
};

const PROCESS_STEPS = ["แตกไฟล์ zip", "อ่านไฟล์ CSV", "ตรวจความถูกต้องทุกแถว", "คำนวณธาตุ / สารอาหาร / สต็อก", "ตรวจชื่อซ้ำหรือใกล้เคียง"];

const STATUS_BADGE = {
  ok: { label: "ผ่าน", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  warning: { label: "มีคำเตือน", cls: "bg-amber-100 text-amber-800 border-amber-200" },
  error: { label: "ผิดพลาด", cls: "bg-red-100 text-red-700 border-red-200" },
};

function Spinner({ className = "h-5 w-5" }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} aria-hidden="true" />;
}

function ProgressBar({ value, indeterminate = false }) {
  return (
    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#f1ead7]">
      {indeterminate ? (
        <div className="absolute inset-y-0 w-1/3 animate-[importSlide_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#b58145] to-[#4c1f08]" />
      ) : (
        <div className="h-full rounded-full bg-gradient-to-r from-[#b58145] to-[#4c1f08] transition-all duration-300" style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
      )}
      <style>{"@keyframes importSlide{0%{left:-35%}100%{left:100%}}"}</style>
    </div>
  );
}

/** รูปจาก zip (ต้องแนบ token) */
function ImportThumb({ importId, name }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let alive = true;
    let objectUrl = null;
    fetchImportImageUrl(importId, name).then((u) => {
      objectUrl = u;
      if (alive) setUrl(u);
      else if (u) URL.revokeObjectURL(u);
    });
    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [importId, name]);
  return url ? (
    <img src={url} alt={name} className="h-14 w-14 shrink-0 rounded-xl border border-[#f1ead7] object-cover" />
  ) : (
    <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-[#f1ead7]" />
  );
}

function RowDetails({ row, type }) {
  const d = row.display || {};
  if (type === "ingredients") {
    const stocks = d.regionalStocks || {};
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6b3215]">
        <span>{d.nameEn}</span>
        <span>หมวด: <b>{d.category}</b></span>
        <span>รสยา: <b>{d.taste || "-"}</b></span>
        <span>ธาตุ (คำนวณ): <b>{d.element}</b></span>
        <span>{d.calories} kcal/100g</span>
        <span>
          สต็อก ({d.unit}): เหนือ {Number(stocks.north || 0).toLocaleString()} · อีสาน {Number(stocks.northeast || 0).toLocaleString()} · กลาง{" "}
          {Number(stocks.central || 0).toLocaleString()} · ใต้ {Number(stocks.south || 0).toLocaleString()}
        </span>
      </div>
    );
  }
  return (
    <div className="space-y-1 text-[11px] text-[#6b3215]">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {row.code && <span className="font-mono">#{row.code}</span>}
        {d.nameEn && <span>{d.nameEn}</span>}
        <span>{d.region}</span>
        <span>฿{Number(d.price || 0).toLocaleString()}</span>
        <span>ธาตุเด่น (คำนวณ): <b>ธาตุ{d.dominantElement}</b></span>
        <span>{d.calories} kcal</span>
        <span className={d.availableKits > 0 ? "" : "font-bold text-red-600"}>ทำได้ {d.availableKits ?? 0} ชุด</span>
        <span>ขั้นตอน {d.steps || 0} ข้อ</span>
      </div>
      {d.recipe?.length > 0 && <p className="text-[#8d593a]">สูตร ({d.recipeCount}): {d.recipe.join(" · ")}</p>}
    </div>
  );
}

/**
 * Modal นำเข้า ZIP (วัตถุดิบ / เมนู)
 * @param {{ type: "ingredients"|"products", open: boolean, onClose: ()=>void, onImported: ()=>void }} props
 */
export default function ImportZipModal({ type, open, onClose, onImported }) {
  const text = TYPE_TEXT[type];
  const [step, setStep] = useState("guide"); // guide | uploading | processing | preview | committing | done | failed
  const [columns, setColumns] = useState({});
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [processIdx, setProcessIdx] = useState(0);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [choices, setChoices] = useState({});
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState({});
  const [status, setStatus] = useState(null);
  const inputRef = useRef(null);
  const pollRef = useRef(null);

  const reset = useCallback(() => {
    clearInterval(pollRef.current);
    setStep("guide");
    setFile(null);
    setUploadPct(0);
    setProcessIdx(0);
    setError("");
    setPreview(null);
    setChoices({});
    setFilter("all");
    setExpanded({});
    setStatus(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    reset();
    fetchImportColumns(type).then(setColumns).catch(() => setColumns({}));
  }, [open, type, reset]);

  useEffect(() => () => clearInterval(pollRef.current), []);

  // แอนิเมชันขั้นตอนระหว่างรอ server ตรวจไฟล์
  useEffect(() => {
    if (step !== "processing") return undefined;
    const t = setInterval(() => setProcessIdx((i) => Math.min(i + 1, PROCESS_STEPS.length - 1)), 700);
    return () => clearInterval(t);
  }, [step]);

  const handleClose = () => {
    if (step === "committing") return; // กำลังนำเข้า ห้ามปิดกลางทาง
    if (preview?.importId && step !== "done") cancelImport(preview.importId);
    if (step === "done") onImported?.();
    onClose();
  };

  const pickFile = (f) => {
    setError("");
    if (!f) return;
    if (!/\.zip$/i.test(f.name)) return setError("รองรับเฉพาะไฟล์ .zip");
    if (f.size > 50 * 1024 * 1024) return setError("ไฟล์ใหญ่เกิน 50MB");
    setFile(f);
  };

  const startUpload = async () => {
    if (!file) return;
    setError("");
    setStep("uploading");
    setUploadPct(0);
    try {
      const data = await uploadForPreview(type, file, (pct) => {
        setUploadPct(pct);
        if (pct >= 100) {
          setProcessIdx(0);
          setStep("processing");
        }
      });
      setPreview(data);
      const init = {};
      data.rows.forEach((r) => {
        init[r.index] = { action: r.defaultAction, targetId: r.defaultTargetId };
      });
      setChoices(init);
      setFilter(data.summary.error > 0 ? "error" : data.summary.duplicate > 0 ? "duplicate" : "all");
      setStep("preview");
    } catch (err) {
      setError(err.message);
      setStep("guide");
    }
  };

  const setChoice = (index, value) => {
    const [action, targetId] = value.split(":");
    setChoices((prev) => ({ ...prev, [index]: { action, targetId: targetId || null } }));
  };

  const plan = useMemo(() => {
    const out = { create: 0, update: 0, skip: 0 };
    preview?.rows.forEach((r) => {
      const a = r.status === "error" ? "skip" : choices[r.index]?.action || "skip";
      out[a] += 1;
    });
    return out;
  }, [preview, choices]);

  const visibleRows = useMemo(() => {
    if (!preview) return [];
    return preview.rows.filter((r) =>
      filter === "all" ? true : filter === "duplicate" ? r.similar.length > 0 : r.status === filter,
    );
  }, [preview, filter]);

  const startCommit = async () => {
    setError("");
    try {
      await commitImport(preview.importId, choices);
      setStep("committing");
      setStatus({ done: 0, total: plan.create + plan.update });
      pollRef.current = setInterval(async () => {
        try {
          const s = await fetchImportStatus(preview.importId);
          setStatus(s);
          if (s.state === "done" || s.state === "failed") {
            clearInterval(pollRef.current);
            setStep(s.state === "done" ? "done" : "failed");
            if (s.state === "done") onImported?.();
          }
        } catch (err) {
          clearInterval(pollRef.current);
          setError(err.message);
          setStep("failed");
        }
      }, 600);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!open) return null;

  const summary = preview?.summary;
  const tabs = [
    ["all", "ทั้งหมด", summary?.total],
    ["ok", "ผ่าน", summary?.ok],
    ["warning", "มีคำเตือน", summary?.warning],
    ["error", "ผิดพลาด", summary?.error],
    ["duplicate", "ชื่อซ้ำ/ใกล้เคียง", summary?.duplicate],
  ];

  return (
    <div className="fixed inset-0 z-[125] flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs sm:p-6" role="dialog" aria-modal="true">
      <div className="flex max-h-[92vh] w-full max-w-4xl animate-in fade-in zoom-in-95 flex-col overflow-hidden rounded-3xl border border-[#dfd1c1] bg-[#fdfbf7] shadow-2xl duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#dfd1c1] px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-black text-[#4c1f08] sm:text-xl">นำเข้า{text.kind}จากไฟล์ ZIP</h2>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#a08b7d]">
              {["เตรียมไฟล์", "ตรวจข้อมูล", "นำเข้า"].map((label, i) => {
                const current = ["guide", "uploading", "processing"].includes(step) ? 0 : step === "preview" ? 1 : 2;
                return (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${i <= current ? "bg-[#4c1f08] text-white" : "bg-[#f1ead7] text-[#a08b7d]"}`}>{i + 1}</span>
                    <span className={i <= current ? "text-[#4c1f08]" : ""}>{label}</span>
                    {i < 2 && <span className="mx-1 h-px w-5 bg-[#dfd1c1]" />}
                  </span>
                );
              })}
            </div>
          </div>
          <button type="button" onClick={handleClose} disabled={step === "committing"} className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-stone-200 disabled:opacity-40 cursor-pointer" title="ปิด">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>}

          {step === "guide" && (
            <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#f1ead7] bg-white p-4">
                  <h3 className="text-sm font-bold text-[#4c1f08]">โครงสร้างไฟล์ zip</h3>
                  <pre className="mt-2 rounded-xl bg-[#faf7f2] p-3 font-mono text-xs leading-relaxed text-[#4c1f08]">
                    {`${type}.zip\n${text.structure.map((s) => (s.startsWith(" ") ? s : `├─ ${s}`)).join("\n")}`}
                  </pre>
                  <p className="mt-2 text-xs text-[#7a5c4d]">{text.hint}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-[#6b3215]">
                    <li>บันทึก CSV เป็น <b>UTF-8</b> (Excel: บันทึกเป็น → CSV UTF-8)</li>
                    <li>ธาตุ แคลอรี จำนวนชุด ระบบคำนวณให้เอง</li>
                    {type === "products" && <li>วัตถุดิบในสูตรต้องมีในคลังแล้ว · รูป .jpg .png .webp ไม่เกิน 5MB</li>}
                    <li>ไม่เกิน 500 แถว · zip ไม่เกิน 50MB</li>
                    <li>ตรวจทุกแถวและให้ดูผลก่อน — ยังไม่บันทึกจนกว่าจะกดยืนยัน</li>
                  </ul>
                  <button type="button" onClick={() => downloadTemplate(type).catch((e) => setError(e.message))} className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#4c1f08] px-4 py-2 text-xs font-bold text-[#4c1f08] transition hover:bg-[#f1ead7] cursor-pointer">
                    ⬇ ดาวน์โหลดไฟล์ตัวอย่าง (template.zip)
                  </button>
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    pickFile(e.dataTransfer.files?.[0]);
                  }}
                  onClick={() => inputRef.current?.click()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${dragging ? "scale-[1.01] border-[#4c1f08] bg-[#f6ede5]" : "border-[#d9cbbd] bg-white hover:border-[#8d593a]"}`}
                >
                  <input ref={inputRef} type="file" accept=".zip,application/zip" className="hidden" onChange={(e) => pickFile(e.target.files?.[0])} />
                  <div className="text-3xl">🗂️</div>
                  {file ? (
                    <p className="mt-2 text-sm font-bold text-[#4c1f08]">
                      {file.name} <span className="font-normal text-[#7a5c4d]">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-[#6b3215]">ลากไฟล์ .zip มาวาง หรือ <b className="text-[#4c1f08] underline">คลิกเลือกไฟล์</b></p>
                  )}
                </div>
              </div>

              {/* Columns */}
              <div className="rounded-2xl border border-[#f1ead7] bg-white p-4">
                <h3 className="text-sm font-bold text-[#4c1f08]">คอลัมน์ในไฟล์ <span className="text-red-500">*</span> = บังคับ</h3>
                <div className="mt-2 max-h-[46vh] space-y-3 overflow-y-auto pr-1">
                  {Object.entries(columns).map(([fileName, cols]) => (
                    <div key={fileName}>
                      <p className="mb-1 font-mono text-xs font-bold text-[#8d593a]">{fileName}</p>
                      <table className="w-full text-left text-[11px]">
                        <tbody>
                          {cols.map((c) => (
                            <tr key={c.key} className="border-b border-[#f1ead7] align-top last:border-0">
                              <td className="whitespace-nowrap py-1 pr-2 font-mono font-semibold text-[#4c1f08]">
                                {c.key}
                                {c.required && <span className="text-red-500">*</span>}
                              </td>
                              <td className="py-1 text-[#6b3215]">
                                {c.note}
                                {c.example && <span className="ml-1 text-[#a08b7d]">เช่น {c.example}</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                  {Object.keys(columns).length === 0 && <p className="text-xs text-[#a08b7d]">กำลังโหลดคำอธิบายคอลัมน์...</p>}
                </div>
              </div>
            </div>
          )}

          {(step === "uploading" || step === "processing") && (
            <div className="mx-auto flex max-w-md flex-col items-center py-10 text-center">
              <div className="relative grid h-20 w-20 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#b58145]/20" />
                <span className="grid h-16 w-16 place-items-center rounded-full bg-[#4c1f08] text-2xl text-white shadow-lg">{step === "uploading" ? "⬆" : "🔍"}</span>
              </div>
              <p className="mt-5 text-base font-bold text-[#4c1f08]">{step === "uploading" ? `กำลังอัปโหลด ${uploadPct}%` : "กำลังตรวจข้อมูล..."}</p>
              <div className="mt-3 w-full">
                <ProgressBar value={uploadPct} indeterminate={step === "processing"} />
              </div>
              {step === "processing" && (
                <ul className="mt-5 w-full space-y-1.5 text-left text-sm">
                  {PROCESS_STEPS.map((label, i) => (
                    <li key={label} className={`flex items-center gap-2 transition-opacity ${i <= processIdx ? "opacity-100" : "opacity-40"}`}>
                      {i < processIdx ? <span className="text-emerald-600">✓</span> : i === processIdx ? <Spinner className="h-3.5 w-3.5 text-[#8d593a]" /> : <span className="text-[#d9cbbd]">○</span>}
                      <span className="text-[#6b3215]">{label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === "preview" && preview && (
            <div className="space-y-4">
              {preview.fileErrors.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <b>ไฟล์ไม่ถูกต้อง:</b>
                  <ul className="mt-1 list-disc pl-5">{preview.fileErrors.map((e) => <li key={e}>{e}</li>)}</ul>
                </div>
              )}
              {preview.fileWarnings.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  <ul className="list-disc pl-5">{preview.fileWarnings.map((w) => <li key={w}>{w}</li>)}</ul>
                </div>
              )}

              {/* Summary */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ["ทั้งหมด", summary.total, "text-[#4c1f08]"],
                  ["ผ่าน", summary.ok, "text-emerald-700"],
                  ["มีคำเตือน", summary.warning, "text-amber-700"],
                  ["ผิดพลาด (จะข้าม)", summary.error, "text-red-600"],
                ].map(([label, n, cls]) => (
                  <div key={label} className="rounded-2xl border border-[#f1ead7] bg-white p-3 text-center">
                    <div className={`text-2xl font-black ${cls}`}>{n}</div>
                    <div className="text-[11px] text-[#7a5c4d]">{label}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {tabs.map(([key, label, n]) => (
                  <button key={key} type="button" onClick={() => setFilter(key)} className={`rounded-full border px-3 py-1 text-xs font-bold transition cursor-pointer ${filter === key ? "border-[#4c1f08] bg-[#4c1f08] text-white" : "border-[#dfd1c1] bg-white text-[#6b3215] hover:bg-[#f1ead7]"}`}>
                    {label} ({n || 0})
                  </button>
                ))}
              </div>

              {/* Rows */}
              <div className="max-h-[48vh] space-y-2 overflow-y-auto pr-1">
                {visibleRows.length === 0 && <p className="py-8 text-center text-sm text-[#a08b7d]">ไม่มีรายการในกลุ่มนี้</p>}
                {visibleRows.map((row) => {
                  const badge = STATUS_BADGE[row.status];
                  const choice = choices[row.index] || {};
                  const value = `${choice.action}${choice.action === "update" ? `:${choice.targetId}` : ""}`;
                  const isOpen = expanded[row.index] ?? row.status !== "ok";
                  return (
                    <div key={row.index} className={`rounded-2xl border bg-white p-3 transition ${row.status === "error" ? "border-red-200" : row.status === "warning" ? "border-amber-200" : "border-[#f1ead7]"}`}>
                      <div className="flex flex-wrap items-center gap-3">
                        {type === "products" && row.images?.[0] && <ImportThumb importId={preview.importId} name={row.images[0]} />}
                        <button type="button" onClick={() => setExpanded((p) => ({ ...p, [row.index]: !isOpen }))} className="min-w-0 flex-1 text-left cursor-pointer">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono text-[#a08b7d]">แถว {row.line}</span>
                            <span className="font-bold text-[#4c1f08]">{row.name}</span>
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.cls}`}>{badge.label}</span>
                            {type === "products" && row.images?.length > 1 && <span className="text-[10px] text-[#a08b7d]">+{row.images.length - 1} รูป</span>}
                          </div>
                          <div className="mt-1"><RowDetails row={row} type={type} /></div>
                        </button>

                        {/* การกระทำ */}
                        {row.status === "error" ? (
                          <span className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600">ข้าม</span>
                        ) : (
                          <select value={value} onChange={(e) => setChoice(row.index, e.target.value)} className="rounded-lg border border-[#d9cbbd] bg-white p-1.5 text-xs font-semibold text-[#4c1f08] cursor-pointer">
                            <option value="create">➕ เพิ่มใหม่</option>
                            {row.similar.map((m) => (
                              <option key={m.id} value={`update:${m.id}`}>✏️ อัปเดตทับ "{m.name}"</option>
                            ))}
                            <option value="skip">⏭ ข้าม</option>
                          </select>
                        )}
                      </div>

                      {isOpen && (row.errors.length > 0 || row.warnings.length > 0 || row.similar.length > 0) && (
                        <div className="mt-2 space-y-1 border-t border-dashed border-[#f1ead7] pt-2 text-xs">
                          {row.errors.map((e) => <p key={e} className="text-red-600">✕ {e}</p>)}
                          {row.warnings.map((w) => <p key={w} className="text-amber-700">⚠ {w}</p>)}
                          {row.similar.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <span className="text-[#7a5c4d]">ในระบบมี:</span>
                              {row.similar.map((m) => (
                                <span key={m.id} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${m.exact ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
                                  {m.name} · {m.exact ? "ชื่อเดียวกัน" : `คล้าย ${Math.round(m.score * 100)}%`}
                                  {m.inactive ? " · ปิดใช้งาน" : ""}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === "committing" && (
            <div className="mx-auto flex max-w-md flex-col items-center py-10 text-center">
              <Spinner className="h-12 w-12 text-[#4c1f08]" />
              <p className="mt-5 text-base font-bold text-[#4c1f08]">
                กำลังนำเข้า {status?.done ?? 0} / {status?.total ?? 0} รายการ
              </p>
              <div className="mt-3 w-full">
                <ProgressBar value={status?.total ? (status.done / status.total) * 100 : 5} />
              </div>
              <p className="mt-3 text-xs text-[#7a5c4d]">{type === "products" ? "อัปโหลดรูปเข้าคลังและบันทึกเมนู" : "บันทึกวัตถุดิบ"} — อย่าปิดหน้าต่างนี้</p>
            </div>
          )}

          {step === "done" && status?.result && (
            <div className="mx-auto max-w-lg py-6 text-center">
              <div className="mx-auto grid h-16 w-16 animate-in zoom-in-50 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-700 duration-300">✓</div>
              <p className="mt-4 text-lg font-black text-[#4c1f08]">นำเข้าเรียบร้อย</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  ["เพิ่มใหม่", status.result.created, "text-emerald-700"],
                  ["อัปเดต", status.result.updated, "text-sky-700"],
                  ["ข้าม", status.result.skipped, "text-stone-500"],
                ].map(([label, n, cls]) => (
                  <div key={label} className="rounded-2xl border border-[#f1ead7] bg-white p-3">
                    <div className={`text-2xl font-black ${cls}`}>{n}</div>
                    <div className="text-[11px] text-[#7a5c4d]">{label}</div>
                  </div>
                ))}
              </div>
              {status.result.skippedRows?.length > 0 && (
                <div className="mt-4 max-h-40 overflow-y-auto rounded-xl border border-[#f1ead7] bg-white p-3 text-left text-xs text-[#6b3215]">
                  {status.result.skippedRows.map((r) => (
                    <p key={`${r.line}-${r.name}`}>แถว {r.line} {r.name} — {r.reason}</p>
                  ))}
                </div>
              )}
              <p className="mt-3 text-xs text-[#a08b7d]">บันทึกผู้นำเข้าใน Audit Log และอัปเดตข้อมูล AI Advisor ให้แล้ว</p>
            </div>
          )}

          {step === "failed" && (
            <div className="mx-auto max-w-md py-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-100 text-3xl text-red-600">!</div>
              <p className="mt-4 text-base font-bold text-[#4c1f08]">นำเข้าไม่สำเร็จ</p>
              <p className="mt-2 text-sm text-red-600">{status?.error || error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dfd1c1] bg-white/60 px-5 py-3 sm:px-6">
          <div className="text-xs text-[#6b3215]">
            {step === "preview" && (
              <>
                จะ <b className="text-emerald-700">เพิ่มใหม่ {plan.create}</b> · <b className="text-sky-700">อัปเดต {plan.update}</b> · <b className="text-stone-500">ข้าม {plan.skip}</b>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {step === "guide" && (
              <button type="button" disabled={!file} onClick={startUpload} className="rounded-full bg-[#4c1f08] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#6b3215] disabled:opacity-40 cursor-pointer">
                อัปโหลดและตรวจข้อมูล →
              </button>
            )}
            {step === "preview" && (
              <>
                <button type="button" onClick={() => { cancelImport(preview.importId); reset(); }} className="rounded-full border border-[#dfd1c1] bg-white px-4 py-2 text-sm font-bold text-[#6b3215] transition hover:bg-[#f1ead7] cursor-pointer">
                  เลือกไฟล์ใหม่
                </button>
                <button type="button" disabled={plan.create + plan.update === 0 || preview.fileErrors.length > 0} onClick={startCommit} className="rounded-full bg-[#4c1f08] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#6b3215] disabled:opacity-40 cursor-pointer">
                  ยืนยันนำเข้า {plan.create + plan.update} รายการ
                </button>
              </>
            )}
            {step === "failed" && (
              <button type="button" onClick={() => setStep("preview")} className="rounded-full border border-[#dfd1c1] bg-white px-4 py-2 text-sm font-bold text-[#6b3215] transition hover:bg-[#f1ead7] cursor-pointer">
                กลับไปหน้าตรวจข้อมูล
              </button>
            )}
            {(step === "done" || step === "failed" || step === "guide") && (
              <button type="button" onClick={handleClose} className="rounded-full border border-[#dfd1c1] bg-white px-4 py-2 text-sm font-bold text-[#6b3215] transition hover:bg-[#f1ead7] cursor-pointer">
                ปิด
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
