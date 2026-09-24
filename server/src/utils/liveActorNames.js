// แสดงชื่อ "ผู้สร้าง/ผู้แก้ไข" เป็นชื่อปัจจุบันเสมอ
// createdBy / updatedBy / actor เก็บชื่อ ณ ตอนบันทึก (snapshot) — ถ้าแอดมินเปลี่ยนชื่อภายหลัง ชื่อเก่าจะค้าง
// middleware นี้เติมชื่อ/อีเมลล่าสุดจาก collection users ตาม id ก่อนส่ง response
// (ผู้ใช้ที่ถูกลบไปแล้วหรือ role "system" ใช้ชื่อเดิมที่บันทึกไว้)
import mongoose from "mongoose";
import { User } from "../models/User.model.js";

const ACTOR_KEYS = ["createdBy", "updatedBy", "actor"];
const MAX_DEPTH = 6;

function collectActors(node, out, depth = 0) {
  if (!node || typeof node !== "object" || depth > MAX_DEPTH) return;
  if (Array.isArray(node)) {
    for (const item of node) collectActors(item, out, depth + 1);
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    if (ACTOR_KEYS.includes(key) && value && typeof value === "object" && mongoose.Types.ObjectId.isValid(value.id)) {
      out.push(value);
    } else if (value && typeof value === "object") {
      collectActors(value, out, depth + 1);
    }
  }
}

export function liveActorNames(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    // ตัดงานเมื่อไม่มีข้อมูลผู้กระทำ (response ส่วนใหญ่)
    let plain;
    try {
      const text = JSON.stringify(body);
      if (!text || !/"(createdBy|updatedBy|actor)"/.test(text)) return originalJson(body);
      plain = JSON.parse(text);
    } catch {
      return originalJson(body);
    }

    const actors = [];
    collectActors(plain, actors);
    if (actors.length === 0) return originalJson(body);

    const ids = [...new Set(actors.map((a) => String(a.id)))];
    User.find({ _id: { $in: ids } })
      .select("firstName lastName email role")
      .lean()
      .then((users) => {
        const byId = new Map(users.map((u) => [String(u._id), u]));
        for (const a of actors) {
          const u = byId.get(String(a.id));
          if (!u) continue;
          a.name = u.firstName || a.name;
          a.email = u.email || a.email;
          a.role = u.role || a.role;
        }
        originalJson(plain);
      })
      .catch(() => originalJson(body));
    return res;
  };
  next();
}

export default liveActorNames;
