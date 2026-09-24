import { formatDate } from "../../utils/dateFormatter.js";

// ชื่อผู้กระทำจาก createdBy / updatedBy (บันทึกฝั่ง server จาก JWT)
function actorLabel(actor) {
  if (!actor) return "";
  if (actor.role === "system") return `ระบบ (${actor.name || "อัตโนมัติ"})`;
  const who = actor.name || actor.email || "ไม่ระบุชื่อ";
  return actor.role === "admin" ? `แอดมิน ${who}` : who;
}

/**
 * บรรทัดเล็กใต้รายการ: "อัปเดตล่าสุด 24 ก.ย. 2569 14:05 โดย แอดมิน Nate"
 * ถ้ายังไม่เคยแก้ไข (createdAt = updatedAt) แสดงเป็น "สร้างเมื่อ ..."
 */
export default function AuditStamp({ doc, className = "" }) {
  const updatedAt = doc?.updatedAt;
  const createdAt = doc?.createdAt;
  if (!updatedAt && !createdAt) return null;

  const neverEdited =
    createdAt && updatedAt && Math.abs(new Date(updatedAt) - new Date(createdAt)) < 2000;
  const actor = neverEdited ? doc.createdBy || doc.updatedBy : doc.updatedBy || doc.createdBy;
  const when = neverEdited ? createdAt : updatedAt || createdAt;
  const by = actorLabel(actor);

  const tooltip = [
    createdAt && `สร้างเมื่อ ${formatDate(createdAt, { showTime: true })}${doc.createdBy ? ` โดย ${actorLabel(doc.createdBy)}` : ""}`,
    updatedAt && `อัปเดตล่าสุด ${formatDate(updatedAt, { showTime: true })}${doc.updatedBy ? ` โดย ${actorLabel(doc.updatedBy)}` : ""}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <span className={`block truncate text-[10px] font-normal text-stone-400 ${className}`} title={tooltip}>
      {neverEdited ? "สร้างเมื่อ" : "อัปเดตล่าสุด"} {formatDate(when, { showTime: true })}
      {by ? ` โดย ${by}` : ""}
    </span>
  );
}
