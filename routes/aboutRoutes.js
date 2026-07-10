import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as aboutController from "../controllers/aboutController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get("/", asyncHandler(aboutController.get));
router.put("/", authenticate, requireRole("system_admin"), asyncHandler(aboutController.update));

export default router;
