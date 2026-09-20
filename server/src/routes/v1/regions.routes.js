import { Router } from "express";
import regions from "../../mockDB/regions.js";

const router = Router();

// GET /api/v1/regions — ดึงข้อมูลทุกภูมิภาค (รวมข้อมูลธาตุและรสชาติ)
router.get("/", (req, res) => {
  res.status(200).json(regions);
});

// GET /api/v1/regions/:id — ดึงข้อมูลภูมิภาคเดี่ยวตาม ID (เช่น north, northeast, central, south) หรือตาม dataRegion (เช่น northern)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const region = regions.find(
    (r) => r.id === id || r.dataRegion === id || r.label === id
  );

  if (!region) {
    return res.status(404).json({ message: `ไม่พบข้อมูลภูมิภาค "${id}"` });
  }

  res.status(200).json(region);
});

export default router;
