import express from "express";
import bcrypt from "bcrypt";
import { users } from "../../mockDB/users.js";

const router = express.Router();

const SALT_ROUNDS = 12;

// ฟังก์ชันสำหรับ Hash รหัสผ่าน
async function hashPassword(rawpass) {
    const hashedpassword = await bcrypt.hash(rawpass, SALT_ROUNDS);
    return hashedpassword;
}

// 1. READ ALL USERS - ดึงข้อมูลผู้ใช้ทั้งหมด
router.get("/", (req, res) => {
    res.status(200).json(users);
});

// 2. READ SINGLE USER - ดึงข้อมูลผู้ใช้รายบุคคลตาม ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((u) => u.id === id);
    if (!user) {
        return res.status(404).json({ message: `ไม่พบผู้ใช้รหัส "${id}"` });
    }
    res.status(200).json(user);
});

// 3. LOGIN - เข้าสู่ระบบและตรวจสอบรหัสผ่าน
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: "กรุณาระบุอีเมลและรหัสผ่าน" });
        }

        const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!user) {
            return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        user.lastActiveAt = new Date().toISOString();

        // ส่งข้อมูลผู้ใช้กลับไปโดยไม่ส่งรหัสผ่าน
        const { password: _, ...safeUser } = user;
        res.status(200).json({
            message: "เข้าสู่ระบบสำเร็จ",
            user: safeUser,
        });
    } catch (error) {
        next(error);
    }
});

// 4. CREATE USER / REGISTER - สร้างผู้ใช้ใหม่
router.post("/", async (req, res, next) => {
    try {
        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({
                message: "กรุณาส่งข้อมูล (Body) ในรูปแบบ JSON",
            });
        }

        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            birthDate,
            gender,
            bloodType,
        } = req.body || {};

        // ตรวจสอบข้อมูลจำเป็น
        if (!firstName || !lastName || !email || !password || !phone) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูลจำเป็นให้ครบถ้วน (firstName, lastName, email, password, phone)",
            });
        }

        // ตรวจสอบว่า Email ซ้ำหรือไม่
        const isEmailExist = users.some(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (isEmailExist) {
            return res.status(400).json({ message: "อีเมลนี้มีผู้ใช้งานในระบบแล้ว" });
        }

        // ตรวจสอบว่า Phone ซ้ำหรือไม่
        const isPhoneExist = users.some((u) => u.phone === phone.trim());
        if (isPhoneExist) {
            return res.status(400).json({ message: "เบอร์โทรศัพท์นี้มีผู้ใช้งานในระบบแล้ว" });
        }

        // 1. Hash รหัสผ่าน
        const hashedPassword = await hashPassword(password);

        // 2. คำนวณหา ID ล่าสุดอย่างถูกต้อง (หาเลขสูงสุด ป้องกัน ID ซ้ำ)
        const maxIdNumber = users.reduce((max, u) => {
            const num = parseInt(String(u.id).replace("USR-", ""), 10);
            return !isNaN(num) && num > max ? num : max;
        }, 0);
        const newId = `USR-${String(maxIdNumber + 1).padStart(3, "0")}`;

        // 3. สร้าง User Object ใหม่
        const now = new Date().toISOString();
        const newUser = {
            id: newId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password: hashedPassword,
            phone: phone.trim(),
            birthDate: birthDate || "",
            gender: gender || "",
            bloodType: bloodType || "",
            tierStatus: "Bronze",
            role: "customer",
            biaPoints: 0,
            isSubscribed: false,
            conditions: req.body.conditions || [],
            lastActiveAt: now,
            createdAt: now,
            updatedAt: now,
        };

        users.push(newUser);

        // ส่งข้อมูลกลับโดยซ่อนฟิลด์ password
        const { password: _, ...safeUser } = newUser;
        res.status(201).json({
            message: "สร้างบัญชีผู้ใช้สำเร็จ",
            user: safeUser,
        });
    } catch (error) {
        next(error);
    }
});

// 5. UPDATE USER - แก้ไขข้อมูลผู้ใช้ตาม ID
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = users.find((u) => u.id === id);
        if (!user) {
            return res.status(404).json({ message: `ไม่พบผู้ใช้รหัส "${id}"` });
        }

        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            birthDate,
            gender,
            bloodType,
            conditions,
            isSubscribed,
            tierStatus,
        } = req.body || {};

        // ถ้าเปลี่ยนอีเมล ต้องเช็คว่าซ้ำกับคนอื่นหรือไม่
        if (email && email.trim().toLowerCase() !== user.email.toLowerCase()) {
            const emailExist = users.some(
                (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== id
            );
            if (emailExist) {
                return res.status(400).json({ message: "อีเมลนี้มีผู้ใช้งานอื่นในระบบแล้ว" });
            }
            user.email = email.trim();
        }

        // ถ้าเปลี่ยนเบอร์โทร ต้องเช็คว่าซ้ำกับคนอื่นหรือไม่
        if (phone && phone.trim() !== user.phone) {
            const phoneExist = users.some(
                (u) => u.phone === phone.trim() && u.id !== id
            );
            if (phoneExist) {
                return res.status(400).json({ message: "เบอร์โทรนี้มีผู้ใช้งานอื่นในระบบแล้ว" });
            }
            user.phone = phone.trim();
        }

        // ถ้ามีการส่งรหัสผ่านใหม่มา ให้ Hash ก่อนบันทึกเสมอ
        if (password && password.trim() !== "") {
            user.password = await hashPassword(password);
        }

        if (firstName !== undefined) user.firstName = firstName.trim();
        if (lastName !== undefined) user.lastName = lastName.trim();
        if (birthDate !== undefined) user.birthDate = birthDate;
        if (gender !== undefined) user.gender = gender;
        if (bloodType !== undefined) user.bloodType = bloodType;
        if (conditions !== undefined) user.conditions = conditions;
        if (isSubscribed !== undefined) user.isSubscribed = isSubscribed;
        if (tierStatus !== undefined) user.tierStatus = tierStatus;

        user.updatedAt = new Date().toISOString();

        const { password: _, ...safeUser } = user;
        res.status(200).json({
            message: "อัปเดตข้อมูลผู้ใช้สำเร็จ",
            user: safeUser,
        });
    } catch (error) {
        next(error);
    }
});

// 6. DELETE USER - ลบผู้ใช้ตาม ID
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const index = users.findIndex((u) => u.id === id);
        if (index === -1) {
            return res.status(404).json({ message: `ไม่พบผู้ใช้รหัส "${id}"` });
        }

        const [deletedUser] = users.splice(index, 1);
        const { password: _, ...safeUser } = deletedUser;

        res.status(200).json({
            message: "ลบผู้ใช้สำเร็จ",
            user: safeUser,
        });
    } catch (error) {
        next(error);
    }
});

export default router;