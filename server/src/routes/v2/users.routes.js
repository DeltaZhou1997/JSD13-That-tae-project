import { Router } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.model.js";
import { actorFromReq, stripAuditFields, diffFields, logAudit } from "../../utils/audit.js";
import { effectiveLifetime } from "../../utils/membership.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "that-tae-secret-key-2026";

function generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role || "customer",
            firstName: user.firstName,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// ข้อมูลผู้ใช้ที่ส่งกลับให้ Frontend (ใช้รูปแบบเดียวกันทั้ง login / me / update)
// เดิม login ส่งไปแค่บางฟิลด์ (ไม่มี avatar, bodyElement) ทำให้ล็อกอินใหม่แล้วรูป/ข้อมูลหาย
// tierStatus / conditions / biaPoints คือชื่อฟิลด์ที่หน้า Admin ใช้ (map มาจาก membership.tier / restrictions / points)
function toPublicUser(user) {
    if (!user) return null;
    const obj = typeof user.toObject === "function" ? user.toObject() : { ...user };
    delete obj.password;
    const tier = obj.membership?.tier || "BRONZE";
    return {
        ...obj,
        id: obj._id,
        tierStatus: tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase(),
        conditions: obj.restrictions || [],
        biaPoints: obj.points || 0,
        lifetimePoints: effectiveLifetime(obj),
    };
}

// แปลงฟิลด์จากหน้า Admin (tierStatus, conditions) กลับเป็นฟิลด์จริงใน User model
// เดิมส่งไปตรง ๆ แล้ว Mongoose ทิ้งทิ้ง (ไม่มีใน schema) ทำให้แก้ระดับสมาชิก/โรคประจำตัวไม่ติด
function mapAdminFields(updateData) {
    if (updateData.tierStatus !== undefined) {
        updateData["membership.tier"] = String(updateData.tierStatus).toUpperCase();
    }
    if (updateData.conditions !== undefined) {
        updateData.restrictions = Array.isArray(updateData.conditions) ? updateData.conditions : [];
    }
    if (updateData.biaPoints !== undefined && updateData.points === undefined) {
        updateData.points = Number(updateData.biaPoints) || 0;
    }
    delete updateData.tierStatus;
    delete updateData.conditions;
    delete updateData.biaPoints;
    return updateData;
}

const ALLOWED_ELEMENTS = ["ดิน", "earth", "น้ำ", "water", "ลม", "wind", "air", "ไฟ", "fire", ""];
const ELEMENT_TO_TH = { earth: "ดิน", water: "น้ำ", wind: "ลม", air: "ลม", fire: "ไฟ" };

// Middleware 1: ตรวจสอบว่าล็อกอินหรือยัง
export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token =
        (authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null) || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, email, role, firstName }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุแล้ว" });
    }
}

// อ่าน token แบบไม่บังคับ (ไม่มี/ไม่ถูกต้อง → null)
export function getOptionalUser(req) {
    const authHeader = req.headers.authorization;
    const token =
        (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null) ||
        req.cookies?.token;
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

// Middleware 2: ตรวจสอบว่าเป็น Admin หรือไม่
// เช็ก role จากฐานข้อมูลจริง (token เก็บ role ตอนล็อกอิน — ถ้าเปลี่ยน role ภายหลัง token จะไม่อัปเดตตาม)
export async function requireAdmin(req, res, next) {
    try {
        const user = mongoose.Types.ObjectId.isValid(req.user?.id)
            ? await User.findById(req.user.id).select("role firstName email").lean()
            : null;
        if (user?.role !== "admin") {
            return res.status(403).json({
                message: user
                    ? "บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ (Admin) — ถ้าเพิ่งได้รับสิทธิ์ ให้ออกจากระบบแล้วเข้าใหม่"
                    : "ไม่พบบัญชีผู้ใช้ กรุณาเข้าสู่ระบบใหม่",
            });
        }
        // ใช้ข้อมูลล่าสุดจาก DB (ชื่อที่บันทึกใน createdBy/updatedBy จะเป็นชื่อปัจจุบัน)
        req.user = { ...req.user, role: user.role, firstName: user.firstName, email: user.email };
        next();
    } catch (err) {
        next(err);
    }
}

// -------------------------------------------------------------
// Routes
// -------------------------------------------------------------

// 1. READ ALL USERS (GET /api/v2/users) -> เฉพาะ Admin เท่านั้น
router.get("/", verifyToken, requireAdmin, async (req, res, next) => {
    try {
        const users = await User.find().select("-password").lean();
        return res.status(200).json(users.map(toPublicUser));
    } catch (err) {
        next(err);
    }
});

// 2. GET CURRENT USER (GET /api/v2/users/me) -> ใครล็อกอินอยู่ก็ดูของตัวเองได้
router.get("/me", verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password").lean();
        if (!user) {
            return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้ในระบบ" });
        }
        return res.status(200).json({ user: toPublicUser(user) });
    } catch (err) {
        next(err);
    }
});

// 3. READ USER BY ID (GET /api/v2/users/:id) -> ดูได้ถ้าเป็น Admin หรือเป็นบัญชีตัวเอง
router.get("/:id", verifyToken, async (req, res, next) => {
    try {
        const targetId = req.params.id;

        // ถ้าไม่ใช่ Admin และไม่ใช่ ID ตัวเอง ห้ามดู
        if (req.user?.role !== "admin" && String(req.user?.id) !== String(targetId)) {
            return res.status(403).json({ message: "คุณไม่มีสิทธิ์ดูข้อมูลของผู้ใช้อื่น" });
        }

        let user = null;
        if (mongoose.Types.ObjectId.isValid(targetId)) {
            user = await User.findById(targetId).select("-password").lean();
        }
        if (!user) {
            user = await User.findOne({ $or: [{ email: targetId }, { phone: targetId }] }).select("-password").lean();
        }
        if (!user) {
            // เดิมคืนข้อมูลปลอม (ธาตุดิน) ทำให้ Frontend แสดงข้อมูลไม่ตรงกับ DB
            return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้ในระบบ" });
        }
        return res.status(200).json(toPublicUser(user));
    } catch (err) {
        next(err);
    }
});

// 4. REGISTER (POST /api/v2/users/register หรือ /api/v2/users)
const handleRegister = async (req, res, next) => {
    try {
        const { firstName, lastName, name, email, password, phone, birthDate, gender, bloodType } = req.body;
        const isAdminCaller = getOptionalUser(req)?.role === "admin";

        // แยกชื่อ-นามสกุล ถ้าส่ง name มาตัวเดียว
        let userFirstName = firstName?.trim();
        let userLastName = lastName?.trim();
        if (!userFirstName && name) {
            const parts = name.trim().split(/\s+/);
            userFirstName = parts[0];
            userLastName = parts.slice(1).join(" ") || "สมาชิกใหม่";
        }
        if (!userLastName) {
            userLastName = "สมาชิกใหม่";
        }

        if (!userFirstName || !email || !password) {
            return res.status(400).json({
                message: "กรุณากรอกชื่อ, อีเมล และรหัสผ่านให้ครบถ้วน",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
            });
        }

        const isEmailUsed = await User.findOne({ email: email.toLowerCase().trim() });
        if (isEmailUsed) {
            return res.status(400).json({ message: "อีเมลนี้มีผู้ใช้งานแล้ว" });
        }

        const cleanPhone = phone ? String(phone).replace(/\D/g, "") : "08" + Math.floor(10000000 + Math.random() * 90000000);

        // ผู้สมัครใหม่ยังไม่ทำแบบทดสอบธาตุ จึงต้องเว้นค่าว่างไว้ก่อน
        const assignedElement = req.body.element || "";

        const deliveryAddress = {
            street: req.body.deliveryAddress?.street ?? req.body.street ?? "",
            subdistrict: req.body.deliveryAddress?.subdistrict ?? req.body.subdistrict ?? "",
            district: req.body.deliveryAddress?.district ?? req.body.district ?? "",
            province: req.body.deliveryAddress?.province ?? req.body.province ?? "",
            postalCode: req.body.deliveryAddress?.postalCode ?? req.body.postalCode ?? "",
        };

        const newUser = new User({
            firstName: userFirstName,
            lastName: userLastName,
            email: email.toLowerCase().trim(),
            password, // User.model.js จะ hash ด้วย bcrypt ให้อัตโนมัติใน pre('save')
            phone: cleanPhone,
            birthDate: birthDate ? new Date(birthDate) : new Date("2000-01-01"),
            gender: gender || "not_specified",
            bloodType: bloodType || "O",
            element: assignedElement,
            bodyElement: req.body.bodyElement || assignedElement,
            deliveryAddress,
            addresses: (deliveryAddress.street && deliveryAddress.subdistrict && deliveryAddress.district && deliveryAddress.province && deliveryAddress.postalCode)
                ? [{ label: "บ้าน", address: deliveryAddress.street, subdistrict: deliveryAddress.subdistrict, district: deliveryAddress.district, province: deliveryAddress.province, zipcode: deliveryAddress.postalCode, phone: cleanPhone, isDefault: true }]
                : [],
            // สร้างบัญชี admin ได้เฉพาะเมื่อผู้เรียกเป็น admin (กันคนทั่วไปส่ง role: "admin" มาสมัครเอง)
            role: req.body.role === "admin" && isAdminCaller ? "admin" : "customer",
            // แอดมินกำหนดระดับสมาชิกตอนสร้างบัญชีได้ (ลูกค้าสมัครเองเริ่มที่ BRONZE เสมอ)
            ...(isAdminCaller && req.body.tierStatus
                ? { membership: { tier: String(req.body.tierStatus).toUpperCase() } }
                : {}),
        });

        const adminCaller = isAdminCaller ? getOptionalUser(req) : null;
        const actor = adminCaller
            ? actorFromReq({ user: adminCaller })
            : { id: String(newUser._id), name: newUser.firstName, email: newUser.email, role: "customer" };
        newUser.createdBy = actor;
        newUser.updatedBy = actor;
        await newUser.save();
        await logAudit({ action: "create", entity: "user", doc: newUser, actor });
        const token = generateToken(newUser);

        return res.status(201).json({
            message: "ลงทะเบียนสมาชิกสำเร็จ",
            token,
            user: toPublicUser(newUser),
        });
    } catch (err) {
        next(err);
    }
};

router.post("/register", handleRegister);
router.post("/", handleRegister); // รองรับ Frontend ที่เรียก POST /api/v2/users (เหมือน Register.jsx และ AdminUserList.jsx)

// Address book: รองรับหลายที่อยู่ต่อผู้ใช้
router.get("/me/addresses", verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });
        // ย้ายที่อยู่ระบบเดิมเข้า address book อัตโนมัติครั้งแรก
        const old = user.deliveryAddress;
        if ((!user.addresses || user.addresses.length === 0) && old?.street && old?.subdistrict && old?.district && old?.province && old?.postalCode) {
            user.addresses.push({ label: "บ้าน", address: old.street, subdistrict: old.subdistrict, district: old.district, province: old.province, zipcode: old.postalCode, phone: user.phone, isDefault: true });
            await user.save();
        }
        return res.json({ addresses: user.addresses || [], deliveryAddress: user.deliveryAddress || null });
    } catch (err) { next(err); }
});

router.post("/me/addresses", verifyToken, async (req, res, next) => {
    try {
        const { label = "บ้าน", address, subdistrict, district, province, zipcode, phone } = req.body;
        if (!address || !subdistrict || !district || !province || !zipcode || !phone) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน" });
        }
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });
        const isDefault = user.addresses.length === 0 || Boolean(req.body.isDefault);
        if (isDefault) user.addresses.forEach((item) => { item.isDefault = false; });
        user.addresses.push({ label, address, subdistrict, district, province, zipcode, phone, isDefault });
        await user.save();
        return res.status(201).json({ address: user.addresses[user.addresses.length - 1], addresses: user.addresses });
    } catch (err) { next(err); }
});

router.put("/me/addresses/:addressId", verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user?.addresses.id(req.params.addressId);
        if (!address) return res.status(404).json({ message: "ไม่พบที่อยู่" });
        Object.assign(address, req.body);
        if (req.body.isDefault) user.addresses.forEach((item) => { item.isDefault = String(item._id) === String(address._id); });
        await user.save();
        return res.json({ address, addresses: user.addresses });
    } catch (err) { next(err); }
});

router.delete("/me/addresses/:addressId", verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user?.addresses.id(req.params.addressId);
        if (!address) return res.status(404).json({ message: "ไม่พบที่อยู่" });
        const wasDefault = address.isDefault;
        address.deleteOne();
        if (wasDefault && user.addresses.length > 0) user.addresses[0].isDefault = true;
        await user.save();
        return res.json({ addresses: user.addresses });
    } catch (err) { next(err); }
});

// 5. LOGIN (POST /api/v2/users/login)
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "กรุณากรอกอีเมลและรหัสผ่าน" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        const token = generateToken(user);

        // เซ็ต cookie สำรอง (รองรับ cross-site ระหว่าง Vercel & Render)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "เข้าสู่ระบบสำเร็จ",
            token,
            user: toPublicUser(user),
        });
    } catch (err) {
        next(err);
    }
});

// 6. UPDATE USER (PUT /api/v2/users/:id) -> อัปเดตข้อมูลส่วนตัว / ที่อยู่
router.put("/:id", verifyToken, async (req, res, next) => {
    try {
        const targetId = req.params.id;

        // ลูกค้าแก้ได้เฉพาะของตัวเอง แอดมินแก้ได้ทุกคน
        if (req.user?.role !== "admin" && String(req.user?.id) !== String(targetId)) {
            return res.status(403).json({ message: "คุณไม่มีสิทธิ์แก้ไขข้อมูลผู้อื่น" });
        }

        // ป้องกันไม่ให้ Customer ทั่วไปแอบแก้ role ตัวเองเป็น admin
        const updateData = stripAuditFields(req.body);
        delete updateData._id;
        if (req.user?.role !== "admin") {
            delete updateData.role;
            delete updateData.points;
            delete updateData.biaPoints;
            delete updateData.membership;
            delete updateData.tierStatus;
        }
        mapAdminFields(updateData);
        delete updateData.password; // ถ้าจะเปลี่ยนรหัสผ่านควรแยก endpoint

        // ธาตุเจ้าเรือน: ตรวจค่าและเก็บเป็นภาษาไทยเสมอ ให้ element กับ bodyElement ตรงกัน
        if (updateData.element !== undefined || updateData.bodyElement !== undefined) {
            const rawElement = String(updateData.element ?? updateData.bodyElement ?? "").trim();
            if (!ALLOWED_ELEMENTS.includes(rawElement)) {
                return res.status(400).json({ message: `ธาตุ "${rawElement}" ไม่ถูกต้อง` });
            }
            const elementTh = ELEMENT_TO_TH[rawElement] || rawElement;
            updateData.element = elementTh;
            updateData.bodyElement = elementTh;
        }

        let query = mongoose.Types.ObjectId.isValid(targetId)
            ? { _id: targetId }
            : { $or: [{ email: targetId }, { phone: targetId }] };

        const before = await User.findOne(query).select("-password").lean();
        const actor = actorFromReq(req);
        const updated = await User.findOneAndUpdate(query, { ...updateData, updatedBy: actor }, {
            new: true,
            runValidators: false,
        }).select("-password");

        if (!updated) {
            // ห้ามตอบว่าสำเร็จ ไม่งั้น Frontend จะคิดว่าบันทึกแล้ว แต่ล็อกอินใหม่ข้อมูลจะกลับเป็นค่าเดิม
            return res.status(404).json({ message: "ไม่พบผู้ใช้ที่ต้องการอัปเดต" });
        }
        await logAudit({
            action: "update",
            entity: "user",
            doc: updated,
            actor,
            changes: diffFields(before, updated, Object.keys(updateData).map((k) => k.split(".")[0])),
        });

        return res.status(200).json({ message: "อัปเดตข้อมูลสำเร็จ", user: toPublicUser(updated) });
    } catch (err) {
        next(err);
    }
});

// 7. DELETE USER (DELETE /api/v2/users/:id) -> แอดมินลบผู้ใช้
router.delete("/:id", verifyToken, requireAdmin, async (req, res, next) => {
    try {
        const targetId = req.params.id;
        let query = mongoose.Types.ObjectId.isValid(targetId)
            ? { _id: targetId }
            : { $or: [{ email: targetId }, { phone: targetId }] };

        const deleted = await User.findOneAndDelete(query);
        if (deleted) {
            await logAudit({ action: "delete", entity: "user", doc: deleted, actor: actorFromReq(req) });
        }
        if (!deleted) {
            return res.status(200).json({ message: "ลบผู้ใช้สำเร็จ", id: targetId });
        }
        return res.status(200).json({ message: "ลบผู้ใช้สำเร็จ", id: targetId });
    } catch (err) {
        next(err);
    }
});

export default router;
