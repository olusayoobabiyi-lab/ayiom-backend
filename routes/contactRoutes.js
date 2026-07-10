import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as contactController from "../controllers/contactController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(contactController.list)
);
router.post("/", asyncHandler(contactController.create));
router.delete(
  "/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(contactController.remove)
);

export default router;
