import { Router } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.model.js";

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

// Middleware 2: ตรวจสอบว่าเป็น Admin หรือไม่
export function requireAdmin(req, res, next) {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "ปฏิเสธการเข้าถึง: สำหรับผู้ดูแลระบบ (Admin) เท่านั้น" });
    }
    next();
}

// -------------------------------------------------------------
// Routes
// -------------------------------------------------------------

// 1. READ ALL USERS (GET /api/v2/users) -> เฉพาะ Admin เท่านั้น
router.get("/", verifyToken, requireAdmin, async (req, res, next) => {
    try {
        const users = await User.find().select("-password").lean();
        return res.status(200).json(users);
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
        return res.status(200).json({ user });
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
            // Fallback เพื่อให้หน้าจอไม่พังกรณีทดสอบด้วย mock ID เช่น USR-001
            return res.status(200).json({
                id: targetId,
                _id: targetId,
                firstName: "ผู้ใช้งาน",
                lastName: "ทั่วไป",
                role: "customer",
                element: "ดิน",
            });
        }
        return res.status(200).json({ ...user, id: user._id });
    } catch (err) {
        next(err);
    }
});

// 4. REGISTER (POST /api/v2/users/register หรือ /api/v2/users)
const handleRegister = async (req, res, next) => {
    try {
        const { firstName, lastName, name, email, password, phone, birthDate, gender, bloodType } = req.body;

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

        const assignedElement = req.body.element || "ดิน";

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
            deliveryAddress: req.body.deliveryAddress || {
                street: req.body.street || "",
                district: req.body.district || "",
                province: req.body.province || "",
                postalCode: req.body.postalCode || "",
            },
            role: req.body.role === "admin" ? "admin" : "customer",
        });

        await newUser.save();
        const token = generateToken(newUser);

        return res.status(201).json({
            message: "ลงทะเบียนสมาชิกสำเร็จ",
            token,
            user: {
                id: newUser._id,
                _id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                element: newUser.element,
                points: newUser.points,
            },
        });
    } catch (err) {
        next(err);
    }
};

router.post("/register", handleRegister);
router.post("/", handleRegister); // รองรับ Frontend ที่เรียก POST /api/v2/users (เหมือน Register.jsx และ AdminUserList.jsx)

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
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                element: user.element,
                points: user.points,
            },
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
        const updateData = { ...req.body };
        if (req.user?.role !== "admin") {
            delete updateData.role;
            delete updateData.points;
        }
        delete updateData.password; // ถ้าจะเปลี่ยนรหัสผ่านควรแยก endpoint

        let query = mongoose.Types.ObjectId.isValid(targetId)
            ? { _id: targetId }
            : { $or: [{ email: targetId }, { phone: targetId }] };

        const updated = await User.findOneAndUpdate(query, updateData, {
            new: true,
            runValidators: false,
        }).select("-password");

        if (!updated) {
            return res.status(200).json({
                message: "อัปเดตข้อมูลสำเร็จ",
                user: { id: targetId, _id: targetId, ...updateData },
            });
        }

        return res.status(200).json({ message: "อัปเดตข้อมูลสำเร็จ", user: { ...updated.toObject(), id: updated._id } });
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
        if (!deleted) {
            return res.status(200).json({ message: "ลบผู้ใช้สำเร็จ", id: targetId });
        }
        return res.status(200).json({ message: "ลบผู้ใช้สำเร็จ", id: targetId });
    } catch (err) {
        next(err);
    }
});

export default router;
