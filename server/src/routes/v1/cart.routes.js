import { Router } from "express";
import mongoose from "mongoose";
import Cart from "../../models/Cart.model.js";
import { getProductById } from "../../data/products.js";

const router = Router();

// In-memory fallback cart store สำหรับกรณีที่ยังไม่ได้เชื่อมต่อ MongoDB Atlas
const inMemoryCarts = new Map();

function getMemoryCart(userId) {
  if (!inMemoryCarts.has(userId)) {
    inMemoryCarts.set(userId, {
      userId,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return inMemoryCarts.get(userId);
}

function calculateCartTotals(items) {
  const totalItems = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price || item.product?.price || 0) * (Number(item.quantity) || 1)),
    0
  );
  return { totalItems, subtotal };
}

// 1. GET /api/v1/cart/:userId — ดึงรายการสินค้าในตะกร้าของผู้ใช้
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // ถ้าต่อ MongoDB อยู่ ให้ดึงจาก Mongoose
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
      const cart = await Cart.findOne({ userId }).populate("items.product");
      if (cart) {
        const { totalItems, subtotal } = calculateCartTotals(cart.items);
        return res.status(200).json({ ...cart.toObject(), totalItems, subtotal });
      }
    }

    // กรณีใช้ In-memory fallback
    const cart = getMemoryCart(userId);
    const { totalItems, subtotal } = calculateCartTotals(cart.items);
    return res.status(200).json({ ...cart, totalItems, subtotal });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงตะกร้า", error: error.message });
  }
});

// 2. POST /api/v1/cart/items หรือ /api/v1/cart/selected — เพิ่มสินค้าลงตะกร้า
const handleAddItem = async (req, res) => {
  const { userId = "USR-001", productId, product: productPayload, quantity = 1 } = req.body;
  const targetId = productId || productPayload?._id || productPayload?.id;

  if (!targetId) {
    return res.status(400).json({ message: "กรุณาระบุรหัสสินค้า (productId หรือ product)" });
  }

  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const existingProduct = getProductById(targetId) || productPayload || {
    _id: targetId,
    name: "Cooking Kit",
    price: 189,
  };

  try {
    // In-memory update
    const memoryCart = getMemoryCart(userId);
    const existingIndex = memoryCart.items.findIndex(
      (item) => String(item.productId || item._id) === String(targetId)
    );

    if (existingIndex > -1) {
      memoryCart.items[existingIndex].quantity += qty;
    } else {
      memoryCart.items.push({
        _id: targetId,
        productId: targetId,
        name: existingProduct.name || existingProduct.nameTh || "สินค้า Cooking Kit",
        price: Number(existingProduct.price) || 0,
        imageUrl: existingProduct.imageUrl || "",
        quantity: qty,
      });
    }
    memoryCart.updatedAt = new Date().toISOString();

    // MongoDB Sync (ถ้าเชื่อมต่อและเป็น ObjectId)
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
      if (mongoose.Types.ObjectId.isValid(targetId)) {
        await Cart.findOneAndUpdate(
          { userId },
          {
            $setOnInsert: { userId },
            $push: { items: { product: targetId, quantity: qty } },
          },
          { upsert: true, new: true }
        );
      }
    }

    const { totalItems, subtotal } = calculateCartTotals(memoryCart.items);
    return res.status(200).json({
      message: "เพิ่มสินค้าลงในตะกร้าสำเร็จ",
      cart: { ...memoryCart, totalItems, subtotal },
    });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้", error: error.message });
  }
};

router.post("/items", handleAddItem);
router.post("/selected", handleAddItem);

// 3. PUT /api/v1/cart/items/:itemId — ปรับจำนวนสินค้าในตะกร้า
router.put("/items/:itemId", (req, res) => {
  const { itemId } = req.params;
  const { userId = "USR-001", quantity, delta } = req.body;

  const memoryCart = getMemoryCart(userId);
  const item = memoryCart.items.find(
    (i) => String(i.productId || i._id) === String(itemId)
  );

  if (!item) {
    return res.status(404).json({ message: `ไม่พบสินค้า "${itemId}" ในตะกร้า` });
  }

  if (typeof quantity === "number") {
    item.quantity = Math.max(1, quantity);
  } else if (typeof delta === "number") {
    item.quantity = Math.max(1, item.quantity + delta);
  }

  memoryCart.updatedAt = new Date().toISOString();
  const { totalItems, subtotal } = calculateCartTotals(memoryCart.items);

  res.status(200).json({
    message: "อัปเดตจำนวนสินค้าสำเร็จ",
    cart: { ...memoryCart, totalItems, subtotal },
  });
});

// 4. DELETE /api/v1/cart/items/:itemId — ลบสินค้าชิ้นหนึ่งออกจากตะกร้า
router.delete("/items/:itemId", (req, res) => {
  const { itemId } = req.params;
  const userId = req.body.userId || req.query.userId || "USR-001";

  const memoryCart = getMemoryCart(userId);
  const prevCount = memoryCart.items.length;
  memoryCart.items = memoryCart.items.filter(
    (i) => String(i.productId || i._id) !== String(itemId)
  );

  if (memoryCart.items.length === prevCount) {
    return res.status(404).json({ message: `ไม่พบสินค้า "${itemId}" ในตะกร้า` });
  }

  memoryCart.updatedAt = new Date().toISOString();
  const { totalItems, subtotal } = calculateCartTotals(memoryCart.items);

  res.status(200).json({
    message: "ลบสินค้าออกจากตะกร้าสำเร็จ",
    cart: { ...memoryCart, totalItems, subtotal },
  });
});

// 5. DELETE /api/v1/cart/:userId/clear — ล้างตะกร้าทั้งหมด
router.delete("/:userId/clear", async (req, res) => {
  const { userId } = req.params;

  const memoryCart = getMemoryCart(userId);
  memoryCart.items = [];
  memoryCart.updatedAt = new Date().toISOString();

  if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
  }

  res.status(200).json({
    message: "ล้างตะกร้าสินค้าสำเร็จ",
    cart: { ...memoryCart, totalItems: 0, subtotal: 0 },
  });
});

export default router;
export { getMemoryCart };
