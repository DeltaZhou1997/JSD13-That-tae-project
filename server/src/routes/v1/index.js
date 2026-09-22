import { Router } from "express";

import usersRouter from "./users.routes.js";
import productsRouter from "./products.routes.js";
import cartRouter from "./cart.routes.js";
import checkoutRouter from "./checkout.routes.js";
import regionsRouter from "./regions.routes.js";
import reviewsRouter from "./reviews.routes.js";
import ingredientsRouter from "./ingredients.routes.js";
import paymentRouter from "./payment.routes.js"; // 🆕 เพิ่ม Stripe Payment
import adminRouter from "./admin.routes.js";

export const router = Router();

// 1. ระบบผู้ใช้และการยืนยันตัวตน
router.use("/users", usersRouter);

// 2. ระบบสินค้า Cooking Kit และเมนูอาหาร
router.use("/products", productsRouter);

// 3. ระบบวัตถุดิบและสารอาหาร (Ingredients & Nutrition)
router.use("/ingredients", ingredientsRouter);

// 4. ระบบตะกร้าสินค้า
router.use("/cart", cartRouter);

// 5. ระบบการสั่งซื้อและชำระเงิน
router.use("/checkout", checkoutRouter);

// 6. ระบบประวัติและการจัดการคำสั่งซื้อ (Orders)
router.use("/orders", checkoutRouter);

// 7. ข้อมูลภูมิภาคและธาตุเจ้าเรือน
router.use("/regions", regionsRouter);

// 8. ข้อมูลรีวิวจากลูกค้า
router.use("/reviews", reviewsRouter);

// 9. 🆕 ระบบชำระเงินผ่าน Stripe (PromptPay + บัตรเครดิต)
router.use("/payment", paymentRouter);
router.use("/admin", adminRouter);

export default router;
