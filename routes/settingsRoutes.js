import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as settingsController from "../controllers/settingsController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", asyncHandler(settingsController.get));
router.put(
  "/",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(settingsController.update)
);
router.post(
  "/upload",
  authenticate,
  requireRole("admin", "system_admin"),
  upload.single("image"),
  asyncHandler(settingsController.uploadImage)
);

export default router;
