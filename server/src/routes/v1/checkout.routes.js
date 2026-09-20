import express from "express";
import mongoose from "mongoose";
import Cart from "../../models/Cart.js";
import Order from "../../models/Order.js";
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
          `สินค้า "${product.name}" มีจำนวนไม่พอในคลัง (คงเหลือ ${product.quantity} ชิ้น)`
        );
      }
      product.quantity -= qty;
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
        "items.product"
      );
      if (cart) return res.status(200).json(cart);
    }

    const memoryCart = getMemoryCart(user_id);
    res.status(200).json(memoryCart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
});

// 2. POST /api/v1/checkout — สร้าง Order, ตัด Stock และล้าง Cart
const handleCheckout = async (req, res) => {
  try {
    const {
      userId = "USR-001",
      items,
      planType = "SINGLE_KIT",
      shippingAddress,
      paymentMethod = "PROMPTPAY",
      itemsSubtotal,
      shippingFee = 60,
      grandTotal,
      earnedPoints = 0,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุรายการสินค้าในคำสั่งซื้อ (items)",
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone) {
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
        productName: item.productName || item.name || productInfo?.name || "ชุด Cooking Kit",
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

    const orderData = {
      orderId: generatedOrderId,
      user: userId,
      userId,
      items: formattedItems,
      planType,
      shippingAddress: {
        fullName: shippingAddress.fullName || shippingAddress.recipientName || "",
        phone: shippingAddress.phone || "",
        address: shippingAddress.address || shippingAddress.fullAddress || "",
        district: shippingAddress.district || "",
        province: shippingAddress.province || "",
        zipcode: shippingAddress.zipcode || "",
        deliveryDate: shippingAddress.deliveryDate || new Date().toISOString().split("T")[0],
      },
      paymentMethod: paymentMethod.toUpperCase(),
      itemsSubtotal: calculatedSubtotal,
      shippingFee,
      grandTotal: calculatedGrandTotal,
      earnedPoints: earnedPoints || Math.floor(calculatedSubtotal * 0.1),
      status: "PAID",
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
          await Cart.findOneAndUpdate(
            { userId },
            { $set: { items: [] } }
          );
        }
      } catch (dbError) {
        console.warn("⚠️ บันทึกลง MongoDB ไม่สำเร็จ แต่บันทึกลง In-memory สำเร็จ:", dbError.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: "สร้างคำสั่งซื้อสำเร็จและตัดสต็อกเรียบร้อยแล้ว",
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
      const dbOrders = await Order.find({ user: userId }).sort({ createdAt: -1 });
      if (dbOrders && dbOrders.length > 0) {
        return res.status(200).json(dbOrders);
      }
    }

    const userOrders = inMemoryOrders.filter((o) => o.userId === userId || o.user === userId);
    return res.status(200).json(userOrders);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงคำสั่งซื้อ", error: error.message });
  }
});

// 4. GET /api/v1/orders/:orderId — ดึงรายละเอียดคำสั่งซื้อรายบิล
router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const memoryOrder = inMemoryOrders.find(
      (o) => o.orderId === orderId || String(o._id) === orderId
    );
    if (memoryOrder) {
      return res.status(200).json(memoryOrder);
    }

    if (mongoose.connection.readyState === 1) {
      const dbOrder = await Order.findOne({
        $or: [{ orderId }, ...(mongoose.Types.ObjectId.isValid(orderId) ? [{ _id: orderId }] : [])],
      });
      if (dbOrder) return res.status(200).json(dbOrder);
    }

    return res.status(404).json({ message: `ไม่พบคำสั่งซื้อ "${orderId}"` });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงคำสั่งซื้อ", error: error.message });
  }
});

// 5. PATCH /api/v1/orders/:orderId/status — อัปเดตสถานะคำสั่งซื้อ (สำหรับ Admin)
router.patch("/:orderId/status", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ["PENDING", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!status || !validStatuses.includes(status.toUpperCase())) {
    return res.status(400).json({
      message: `สถานะไม่ถูกต้อง กรุณาเลือก: ${validStatuses.join(", ")}`,
    });
  }

  const order = inMemoryOrders.find(
    (o) => o.orderId === orderId || String(o._id) === orderId
  );
  if (order) {
    order.status = status.toUpperCase();
    order.updatedAt = new Date().toISOString();
  }

  if (mongoose.connection.readyState === 1) {
    await Order.findOneAndUpdate(
      { $or: [{ orderId }, ...(mongoose.Types.ObjectId.isValid(orderId) ? [{ _id: orderId }] : [])] },
      { $set: { status: status.toUpperCase() } }
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

// 6. GET /api/v1/orders — ดึงคำสั่งซื้อทั้งหมด (สำหรับ Admin)
router.get("/", async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const dbOrders = await Order.find().sort({ createdAt: -1 });
    if (dbOrders && dbOrders.length > 0) return res.status(200).json(dbOrders);
  }
  res.status(200).json(inMemoryOrders);
});

export default router;
export { inMemoryOrders };
