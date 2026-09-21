import { Router } from "express";
import checkoutRouter from "./checkout.routes.js";
export const router = Router();

router.use("/checkout", checkoutRouter);
export default router;
