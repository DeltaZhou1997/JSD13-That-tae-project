import { Router } from "express";
import { Product } from "../../models/Product.model.js";
import { Ingredient } from "../../models/Ingredient.model.js";
import { verifyToken, requireAdmin } from "./users.routes.js";
import { withAvailability } from "../../utils/stockAvailability.js";

const router = Router();

function normalizeProductTags(payload) {
  const restrictions = Array.isArray(payload.foodRestrictions)
    ? payload.foodRestrictions.map((value) => String(value).trim()).filter(Boolean)
    : [];
  return {
    ...payload,
    foodRestrictions: restrictions,
    tags: [...new Set([...(Array.isArray(payload.tags) ? payload.tags : []), ...restrictions])],
  };
}

// =========================================================================
// 1. GET /api/v2/products — ดึงรายการสินค้าทั้งหมด (Search, Filter, Sort, Pagination)
// สิทธิ์: ทุกคนเข้าถึงได้ (Public)
// =========================================================================
router.get("/", async (req, res, next) => {
  try {
    const {
      search,
      region,
      foodRestrictions,
      element,
      sort,
      page = 1,
      limit,
    } = req.query;

    const query = { isActive: true };

    // Search ชื่อเมนูภาษาไทย, อังกฤษ, หรือคำอธิบาย
    if (search) {
      const searchRegex = { $regex: String(search).trim(), $options: "i" };
      query.$or = [
        { name: searchRegex },
        { nameTh: searchRegex },
        { nameEn: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    // กรองตามภูมิภาค (อาหารภาคใครภาคมัน)
    if (region && region !== "all") {
      query.$or = [{ region }, { regionNameTh: region }];
    }

    // กรองตามธาตุเจ้าเรือน (Dominant หรือ Suitability)
    if (element && element !== "all") {
      query.$or = [
        { dominantElement: element },
        { elementSuitability: element },
      ];
    }

    // กรองตามข้อจำกัดทางอาหาร/โรค/การแพ้ (Food Restrictions)
    if (foodRestrictions) {
      const restrictionsList = String(foodRestrictions)
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);

      if (restrictionsList.length > 0) {
        query.foodRestrictions = { $all: restrictionsList };
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === "price_asc") sortOptions = { price: 1 };
    if (sort === "price_desc") sortOptions = { price: -1 };
    if (sort === "name_asc") sortOptions = { nameTh: 1, name: 1 };

    // Pagination
    if (limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const skip = (pageNum - 1) * limitNum;

      const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      ]);

      return res.status(200).json({
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        // availability: จำนวนชุดที่ทำได้ + วัตถุดิบที่ขาด (หน้าเมนู/ตะกร้าใช้แสดง "สินค้าหมด")
        data: await withAvailability(products),
      });
    }

    const products = await Product.find(query).sort(sortOptions).lean();
    return res.status(200).json(await withAvailability(products));
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 2. GET /api/v2/products/:id — ดึงข้อมูลเมนูเดี่ยว พร้อมเช็กสต็อกวัตถุดิบ
// สิทธิ์: ทุกคนเข้าถึงได้ (Public)
// =========================================================================
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("recipe.ingredient")
      .lean();

    if (!product || !product.isActive) {
      return res.status(404).json({ message: `ไม่พบเมนูรหัส "${req.params.id}"` });
    }

    // คำนวณความพร้อมของสต็อกวัตถุดิบ
    const productDoc = new Product(product);
    const stockStatus = await productDoc.checkStockAvailability(1);

    const [withStock] = await withAvailability(product);
    return res.status(200).json({
      ...withStock,
      stockAvailability: stockStatus,
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 3. POST /api/v2/products — สร้างเมนูอาหาร Cooking Kit ใหม่
// สิทธิ์: Admin เท่านั้น (verifyToken + requireAdmin)
// =========================================================================
router.post("/", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { name, nameTh, price, quantity } = req.body;

    if ((!name && !nameTh) || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: "กรุณาระบุชื่อเมนู, ราคา และจำนวนสินค้าในสต็อก",
      });
    }

    const hasImage = Boolean(
      req.body.imageUrl ||
      req.body.imageId ||
      (Array.isArray(req.body.images) && req.body.images.length > 0)
    );
    if (!hasImage) {
      return res.status(400).json({
        message: "กรุณาอัปโหลดรูปภาพเมนูอาหาร (เมนูอาหารจำเป็นต้องมีรูปภาพอาหาร)",
      });
    }

    const newProduct = new Product(normalizeProductTags(req.body));
    const saved = await newProduct.save();

    return res.status(201).json({
      message: `สร้างเมนู "${saved.nameTh || saved.name}" สำเร็จ`,
      product: saved,
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 4. PUT /api/v2/products/:id — แก้ไขรายละเอียดเมนูอาหาร
// สิทธิ์: Admin เท่านั้น
// =========================================================================
router.put("/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, normalizeProductTags(req.body), {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "ไม่พบเมนูอาหารเพื่อทำการแก้ไข" });
    }

    return res.status(200).json({
      message: `แก้ไขเมนู "${updated.nameTh || updated.name}" สำเร็จ`,
      product: updated,
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// 5. DELETE /api/v2/products/:id — ลบเมนูอาหาร (Soft Delete)
// สิทธิ์: Admin เท่านั้น
// =========================================================================
router.delete("/:id", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "ไม่พบเมนูอาหารเพื่อทำการลบ" });
    }

    return res.status(200).json({
      message: `ลบเมนู "${deleted.nameTh || deleted.name}" สำเร็จ`,
      product: deleted,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
