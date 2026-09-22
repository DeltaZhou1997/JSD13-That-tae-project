import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users } from "../../mockDB/users.js";

const router = express.Router();

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "that-tae-secret-key-2026";

// ฟังก์ชันสำหรับ Hash รหัสผ่าน
async function hashPassword(rawpass) {
  return await bcrypt.hash(rawpass, SALT_ROUNDS);
}

// ฟังก์ชันสร้าง JWT Token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || "customer",
      firstName: user.firstName,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// 1. READ ALL USERS - ดึงข้อมูลผู้ใช้ทั้งหมด (ซ่อน password)
router.get("/", (req, res) => {
  const safeUsers = users.map(({ password: _, ...safeUser }) => safeUser);
  res.status(200).json(safeUsers);
});

// 2. GET CURRENT USER (ME) - ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่จาก Token
router.get("/me", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null) || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "ไม่พบ Token การเข้าสู่ระบบ" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้ในระบบ" });
    }

    const { password: _, ...safeUser } = user;
    res.status(200).json({ user: safeUser });
  } catch (error) {
    return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุแล้ว" });
  }
});

// 3. READ SINGLE USER - ดึงข้อมูลผู้ใช้รายบุคคลตาม ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ message: `ไม่พบผู้ใช้รหัส "${id}"` });
  }
  const { password: _, ...safeUser } = user;
  res.status(200).json(safeUser);
});

// 4. LOGIN - เข้าสู่ระบบและตรวจสอบรหัสผ่าน + ออก JWT Token
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "กรุณาระบุอีเมลและรหัสผ่าน" });
    }

    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!user) {
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    user.lastActiveAt = new Date().toISOString();

    const token = generateToken(user);

    // เซ็ต Cookie ให้หน้าบ้านแบบปลอดภัย
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
    });

    const { password: _, ...safeUser } = user;
    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
});

// 5. CREATE USER / REGISTER - สร้างผู้ใช้ใหม่ + ออก JWT Token
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
        message:
          "กรุณากรอกข้อมูลจำเป็นให้ครบถ้วน (firstName, lastName, email, password, phone)",
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
      return res
        .status(400)
        .json({ message: "เบอร์โทรศัพท์นี้มีผู้ใช้งานในระบบแล้ว" });
    }

    // 1. Hash รหัสผ่าน
    const hashedPassword = await hashPassword(password);

    // 2. คำนวณหา ID ล่าสุด
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
      role: req.body.role || "customer",
      biaPoints: 0,
      isSubscribed: false,
      conditions: req.body.conditions || [],
      lastActiveAt: now,
      createdAt: now,
      updatedAt: now,
    };

    users.push(newUser);

    const token = generateToken(newUser);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({
      message: "สร้างบัญชีผู้ใช้สำเร็จ",
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
});

// 6. UPDATE USER - แก้ไขข้อมูลผู้ใช้ตาม ID
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
      role,
      deliveryAddress,
    } = req.body || {};

    if (email && email.trim().toLowerCase() !== user.email.toLowerCase()) {
      const emailExist = users.some(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== id
      );
      if (emailExist) {
        return res
          .status(400)
          .json({ message: "อีเมลนี้มีผู้ใช้งานอื่นในระบบแล้ว" });
      }
      user.email = email.trim();
    }

    if (phone && phone.trim() !== user.phone) {
      const phoneExist = users.some(
        (u) => u.phone === phone.trim() && u.id !== id
      );
      if (phoneExist) {
        return res
          .status(400)
          .json({ message: "เบอร์โทรนี้มีผู้ใช้งานอื่นในระบบแล้ว" });
      }
      user.phone = phone.trim();
    }

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
    if (role !== undefined && (role === "admin" || role === "customer")) user.role = role;
    if (deliveryAddress !== undefined) user.deliveryAddress = deliveryAddress;

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

// 7. DELETE USER - ลบผู้ใช้ตาม ID
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