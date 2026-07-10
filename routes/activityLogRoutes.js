import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as activityLogController from "../controllers/activityLogController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("system_admin"),
  asyncHandler(activityLogController.list)
);

export default router;
