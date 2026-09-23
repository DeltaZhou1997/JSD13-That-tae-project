import express from "express";
import mongoose from "mongoose";
import Cart from "../../models/Cart.model.js";
import Order from "../../models/Order.model.js";
import { getAllProducts, getProductById } from "../../data/products.js";
import { getMemoryCart } from "./cart.routes.js";

const router = express.Router();

// In-memory orders store สำหรับให้ทำงานได้แม้ไม่ได้ต่อ MongoDB Atlas
const inMemoryOrders = [];

// Helper สำหรับตัดสต็อกสินค้าในหน่วยความจำ
function deductMemoryStock(items) {
  for (const item of items) {
    const targetId = item.productId || item.product || item._id;
    const product = getProductById(targetId);
    if (product) {
      const qty = Number(item.quantity) || 1;
      if (product.quantity < qty) {
        throw new Error(
          `สินค้า "${product.name}" มีจำนวนไม่พอในคลัง (คงเหลือ ${product.quantity} ชิ้น)`,
        );
      }
      product.quantity -= qty;
    }
  }
}

// Helper สำหรับคืนสต็อกสินค้า (ใช้ตอน COD ถูกปฏิเสธ)
function restoreMemoryStock(items) {
  for (const item of items) {
    const targetId = item.productId || item.product || item._id;
    const product = getProductById(targetId);
    if (product) {
      product.quantity += Number(item.quantity) || 1;
    }
  }
}

// 1. GET /api/v1/checkout/cart/:user_id (หรือเรียกผ่าน /api/v1/cart/:user_id)
router.get("/cart/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    if (
      mongoose.connection.readyState === 1 &&
      mongoose.Types.ObjectId.isValid(user_id)
    ) {
      const cart = await Cart.findOne({ userId: user_id }).populate(
        "items.product",
      );
      if (cart) return res.status(200).json(cart);
    }

    const memoryCart = getMemoryCart(user_id);
    res.status(200).json(memoryCart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
});

// 2. POST /api/v1/checkout — สร้าง Order, ตัด Stock และล้าง Cart
const handleCheckout = async (req, res) => {
  try {
    const {
      userId = "USR-001",
      items,
      planType = "SINGLE_KIT",
      planDetails = null,
      shippingAddress,
      paymentMethod = "PROMPTPAY",
      itemsSubtotal,
      shippingFee = 60,
      grandTotal,
      earnedPoints = 0,
      stripePaymentIntentId = null,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุรายการสินค้าในคำสั่งซื้อ (items)",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุข้อมูลผู้รับและที่อยู่จัดส่งให้ครบถ้วน",
      });
    }

    // 1. ตัดสต็อกสินค้าใน Data Memory ก่อนเสมอ
    deductMemoryStock(items);

    // 2. จัดรูปแบบ items ให้ได้มาตรฐาน
    const formattedItems = items.map((item) => {
      const targetId = item.productId || item.product || item._id;
      const productInfo = getProductById(targetId);
      return {
        product: targetId,
        productId: targetId,
        productName:
          item.productName ||
          item.name ||
          productInfo?.name ||
          "ชุด Cooking Kit",
        price: Number(item.price || item.unitPrice || productInfo?.price || 0),
        quantity: Number(item.quantity) || 1,
      };
    });

    const calculatedSubtotal =
      itemsSubtotal ??
      formattedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const calculatedGrandTotal = grandTotal ?? calculatedSubtotal + shippingFee;
    const generatedOrderId =
      "ORD-" + Math.floor(100000 + Math.random() * 900000);

    // ==========================================
    // 🔑 จุดสำคัญ: กำหนด status ตาม paymentMethod
    // ==========================================
    // - COD → status: "PENDING", paymentStatus: "UNPAID"
    //   (ยังไม่ได้ชำระ ต้องรอพนักงานเก็บเงินปลายทาง)
    //
    // - PROMPTPAY / CREDIT_CARD → status: "PAID", paymentStatus: "PAID"
    //   (ชำระเงินเรียบร้อยแล้วผ่าน Stripe หรือ QR)
    // ==========================================
    const isCOD = paymentMethod.toUpperCase() === "COD";

    const orderData = {
      orderId: generatedOrderId,
      user: userId,
      userId,
      items: formattedItems,
      planType,
      planDetails,
      shippingAddress: {
        fullName:
          shippingAddress.fullName || shippingAddress.recipientName || "",
        phone: shippingAddress.phone || "",
        address: shippingAddress.address || shippingAddress.fullAddress || "",
        district: shippingAddress.district || "",
        province: shippingAddress.province || "",
        zipcode: shippingAddress.zipcode || "",
        deliveryDate:
          shippingAddress.deliveryDate ||
          new Date().toISOString().split("T")[0],
      },
      paymentMethod: paymentMethod.toUpperCase(),

      // ===== ฟิลด์ใหม่ =====
      paymentStatus: isCOD ? "UNPAID" : "PAID",
      codAmount: isCOD ? calculatedGrandTotal : null,
      stripePaymentIntentId: stripePaymentIntentId || null,

      // ===== สถานะ Order =====
      // COD → PENDING (รอเก็บเงิน) | Online → PAID (จ่ายแล้ว)
      status: isCOD ? "PENDING" : "PAID",

      itemsSubtotal: calculatedSubtotal,
      shippingFee,
      grandTotal: calculatedGrandTotal,
      earnedPoints: earnedPoints || Math.floor(calculatedSubtotal * 0.1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 3. บันทึกลง In-memory Store
    inMemoryOrders.unshift(orderData);

    // 4. ล้าง Cart ใน Memory
    const memoryCart = getMemoryCart(userId);
    if (memoryCart) {
      memoryCart.items = [];
      memoryCart.updatedAt = new Date().toISOString();
    }

    // 5. หากต่อ MongoDB Atlas อยู่ ให้บันทึกลง Mongoose Model ด้วย
    if (mongoose.connection.readyState === 1) {
      try {
        const isUserValidObjectId = mongoose.Types.ObjectId.isValid(userId);
        const validUserId = isUserValidObjectId
          ? userId
          : new mongoose.Types.ObjectId();

        const dbFormattedItems = formattedItems.map((item) => ({
          product: mongoose.Types.ObjectId.isValid(item.product)
            ? item.product
            : new mongoose.Types.ObjectId(),
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
        }));

        const newMongoOrder = new Order({
          ...orderData,
          user: validUserId,
          items: dbFormattedItems,
        });

        await newMongoOrder.save();

        if (isUserValidObjectId) {
          await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
        }
      } catch (dbError) {
        console.warn(
          "⚠️ บันทึกลง MongoDB ไม่สำเร็จ แต่บันทึกลง In-memory สำเร็จ:",
          dbError.message,
        );
      }
    }

    // 6. ส่ง Response กลับพร้อมข้อความที่แตกต่างตาม paymentMethod
    const successMessage = isCOD
      ? "สร้างคำสั่งซื้อสำเร็จ — กรุณาเตรียมเงินสดให้พนักงานจัดส่ง"
      : "สร้างคำสั่งซื้อสำเร็จและชำระเงินเรียบร้อยแล้ว";

    return res.status(201).json({
      success: true,
      message: successMessage,
      order: orderData,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

router.post("/", handleCheckout);
router.post("/checkout", handleCheckout);

// 3. GET /api/v1/orders/user/:userId — ดึงประวัติคำสั่งซื้อของ User
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    if (
      mongoose.connection.readyState === 1 &&
      mongoose.Types.ObjectId.isValid(userId)
    ) {
      const dbOrders = await Order.find({ user: userId }).sort({
        createdAt: -1,
      });
      if (dbOrders && dbOrders.length > 0) {
        return res.status(200).json(dbOrders);
      }
    }

    const userOrders = inMemoryOrders.filter(
      (o) => o.userId === userId || o.user === userId,
    );
    return res.status(200).json(userOrders);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "เกิดข้อผิดพลาดในการดึงคำสั่งซื้อ",
        error: error.message,
      });
  }
});

// 4. GET /api/v1/orders/:orderId — ดึงรายละเอียดคำสั่งซื้อรายบิล
router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const memoryOrder = inMemoryOrders.find(
      (o) => o.orderId === orderId || String(o._id) === orderId,
    );
    if (memoryOrder) {
      return res.status(200).json(memoryOrder);
    }

    if (mongoose.connection.readyState === 1) {
      const dbOrder = await Order.findOne({
        $or: [
          { orderId },
          ...(mongoose.Types.ObjectId.isValid(orderId)
            ? [{ _id: orderId }]
            : []),
        ],
      });
      if (dbOrder) return res.status(200).json(dbOrder);
    }

    return res.status(404).json({ message: `ไม่พบคำสั่งซื้อ "${orderId}"` });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "เกิดข้อผิดพลาดในการดึงคำสั่งซื้อ",
        error: error.message,
      });
  }
});

// 5. PATCH /api/v1/orders/:orderId/status — อัปเดตสถานะคำสั่งซื้อ (สำหรับ Admin)
router.patch("/:orderId/status", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "PENDING",
    "PAID",
    "PREPARING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  if (!status || !validStatuses.includes(status.toUpperCase())) {
    return res.status(400).json({
      message: `สถานะไม่ถูกต้อง กรุณาเลือก: ${validStatuses.join(", ")}`,
    });
  }

  const order = inMemoryOrders.find(
    (o) => o.orderId === orderId || String(o._id) === orderId,
  );
  if (order) {
    order.status = status.toUpperCase();
    order.updatedAt = new Date().toISOString();
  }

  if (mongoose.connection.readyState === 1) {
    await Order.findOneAndUpdate(
      {
        $or: [
          { orderId },
          ...(mongoose.Types.ObjectId.isValid(orderId)
            ? [{ _id: orderId }]
            : []),
        ],
      },
      { $set: { status: status.toUpperCase() } },
    );
  }

  if (!order) {
    return res.status(404).json({ message: `ไม่พบคำสั่งซื้อ "${orderId}"` });
  }

  res.status(200).json({
    message: "อัปเดตสถานะคำสั่งซื้อสำเร็จ",
    order,
  });
});

// ======================================================================
// 6. PATCH /api/v1/orders/:orderId/confirm-cod — ยืนยันเก็บเงิน COD สำเร็จ
// ======================================================================
// อธิบาย: API นี้ใช้สำหรับพนักงานจัดส่ง หรือ Admin
//   เพื่อยืนยันว่า "เก็บเงินสดจากลูกค้าเรียบร้อยแล้ว"
//
// การทำงาน:
//   1. ตรวจสอบว่า Order นี้เป็น COD จริงหรือไม่
//   2. เปลี่ยน status → "DELIVERED"
//   3. เปลี่ยน paymentStatus → "PAID"
//
// Request: PATCH /api/v1/orders/ORD-123456/confirm-cod
// Response: { message: "...", order: {...} }
// ======================================================================
router.patch("/:orderId/confirm-cod", async (req, res) => {
  const { orderId } = req.params;

  try {
    // หาใน In-memory
    const order = inMemoryOrders.find(
      (o) => o.orderId === orderId || String(o._id) === orderId,
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: `ไม่พบคำสั่งซื้อ "${orderId}"` });
    }

    // ตรวจสอบว่าเป็น COD หรือไม่
    if (order.paymentMethod !== "COD") {
      return res.status(400).json({
        success: false,
        message: "คำสั่งซื้อนี้ไม่ใช่แบบเก็บเงินปลายทาง (COD)",
      });
    }

    // ตรวจว่าเก็บเงินไปแล้วหรือยัง
    if (order.paymentStatus === "PAID") {
      return res.status(400).json({
        success: false,
        message: "คำสั่งซื้อนี้ได้รับการยืนยันการชำระเงินแล้ว",
      });
    }

    // อัปเดตสถานะ
    order.status = "DELIVERED";
    order.paymentStatus = "PAID";
    order.updatedAt = new Date().toISOString();

    // Sync กับ MongoDB ถ้าเชื่อมต่ออยู่
    if (mongoose.connection.readyState === 1) {
      await Order.findOneAndUpdate(
        {
          $or: [
            { orderId },
            ...(mongoose.Types.ObjectId.isValid(orderId)
              ? [{ _id: orderId }]
              : []),
          ],
        },
        {
          $set: {
            status: "DELIVERED",
            paymentStatus: "PAID",
            updatedAt: new Date().toISOString(),
          },
        },
      );
    }

    console.log(
      `✅ [COD] ยืนยันเก็บเงินสำเร็จ: ${orderId} | ฿${order.grandTotal}`,
    );

    res.status(200).json({
      success: true,
      message: `ยืนยันการเก็บเงินปลายทางสำเร็จ — ฿${order.grandTotal.toLocaleString()}`,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการยืนยัน COD",
      error: error.message,
    });
  }
});

// ======================================================================
// 7. PATCH /api/v1/orders/:orderId/reject-cod — ปฏิเสธ/ยกเลิก COD + คืน Stock
// ======================================================================
// อธิบาย: ใช้เมื่อลูกค้าปฏิเสธรับของ หรือไม่มีผู้รับ หรือ Admin ต้องการยกเลิก
//
// การทำงาน:
//   1. คืน Stock สินค้ากลับเข้าคลัง
//   2. เปลี่ยน status → "CANCELLED"
//   3. บันทึกเหตุผลการยกเลิก
//
// Request: PATCH /api/v1/orders/ORD-123456/reject-cod
// Body: { "reason": "ลูกค้าไม่อยู่บ้าน" }
// ======================================================================
router.patch("/:orderId/reject-cod", async (req, res) => {
  const { orderId } = req.params;
  const { reason = "ลูกค้าปฏิเสธรับสินค้า" } = req.body;

  try {
    const order = inMemoryOrders.find(
      (o) => o.orderId === orderId || String(o._id) === orderId,
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: `ไม่พบคำสั่งซื้อ "${orderId}"` });
    }

    if (order.paymentMethod !== "COD") {
      return res.status(400).json({
        success: false,
        message: "คำสั่งซื้อนี้ไม่ใช่แบบเก็บเงินปลายทาง (COD)",
      });
    }

    if (order.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "คำสั่งซื้อนี้ถูกยกเลิกไปแล้ว",
      });
    }

    // คืน Stock สินค้ากลับเข้าคลัง
    restoreMemoryStock(order.items);

    // อัปเดตสถานะ
    order.status = "CANCELLED";
    order.paymentStatus = "UNPAID";
    order.cancelReason = reason;
    order.updatedAt = new Date().toISOString();

    // Sync กับ MongoDB
    if (mongoose.connection.readyState === 1) {
      await Order.findOneAndUpdate(
        {
          $or: [
            { orderId },
            ...(mongoose.Types.ObjectId.isValid(orderId)
              ? [{ _id: orderId }]
              : []),
          ],
        },
        {
          $set: {
            status: "CANCELLED",
            paymentStatus: "UNPAID",
            cancelReason: reason,
            updatedAt: new Date().toISOString(),
          },
        },
      );
    }

    console.log(`❌ [COD] ยกเลิก Order: ${orderId} | เหตุผล: ${reason}`);

    res.status(200).json({
      success: true,
      message: `ยกเลิกคำสั่งซื้อและคืนสต็อกเรียบร้อย — เหตุผล: ${reason}`,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการยกเลิก COD",
      error: error.message,
    });
  }
});

// 8. GET /api/v1/orders — ดึงคำสั่งซื้อทั้งหมด (สำหรับ Admin)
router.get("/", async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const dbOrders = await Order.find().sort({ createdAt: -1 });
    if (dbOrders && dbOrders.length > 0) return res.status(200).json(dbOrders);
  }
  res.status(200).json(inMemoryOrders);
});

export default router;
export { inMemoryOrders };
