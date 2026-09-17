import { Router } from "express";

import usersRouter from "./users.routes.js";
import productsRouter from "./products.routes.js"

export const router = Router();

router.use("/users", usersRouter);
router.use("/products", productsRouter);

export default router;


