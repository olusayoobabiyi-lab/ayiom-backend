import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as homepageController from "../controllers/homepageController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get("/", asyncHandler(homepageController.get));
router.put("/", authenticate, requireRole("system_admin"), asyncHandler(homepageController.update));

export default router;
