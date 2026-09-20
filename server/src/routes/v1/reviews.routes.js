import { Router } from "express";
import reviews from "../../mockDB/reviews.js";

const router = Router();

// GET /api/v1/reviews — ดึงข้อมูลรีวิวลูกค้าทั้งหมด
router.get("/", (req, res) => {
  res.status(200).json(reviews);
});

export default router;
