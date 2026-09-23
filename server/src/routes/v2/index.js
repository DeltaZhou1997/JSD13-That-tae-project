import { Router } from "express";
import imagesRouter from "./images.routes.js";
import usersRouter from "./users.routes.js";
import ingredientsRouter from "./ingredients.routes.js";
import productsRouter from "./products.routes.js";
import cartRouter from "./cart.routes.js";
import checkoutRouter from "./checkout.routes.js";

export const router = Router();

// =========================================================================
// 🎯 Mount All v2 Routes Under /api/v2
// =========================================================================

// 1. GridFS Image Upload & Streaming
router.use("/images", imagesRouter);

// 2. Users & Authentication (Register, Login, Role-based Profiles)
router.use("/users", usersRouter);

// 3. Ingredients & Inventory Management (Multi-region & Stocks)
router.use("/ingredients", ingredientsRouter);

// 4. Products & Cooking Kits (Food Restrictions, Elements, Recipes)
router.use("/products", productsRouter);

// 5. Shopping Cart (Sync with MongoDB)
router.use("/cart", cartRouter);

// 6. Checkout & Order Management (Stock deduction, Status update)
router.use("/checkout", checkoutRouter);
router.use("/orders", checkoutRouter); // Alias ให้ Frontend เรียกผ่าน /api/v2/orders ได้

export default router;
