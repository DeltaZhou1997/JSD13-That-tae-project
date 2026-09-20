import { Router } from "express";
import { router as v1Routes } from "./v1/index.js";
//import {router as v2Routes} from "./v2/index.js";
const router = Router();

router.use("/v1", v1Routes);
//router.use("/v2", v2Routes);

export default router;