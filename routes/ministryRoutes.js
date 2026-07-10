import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as ministryController from "../controllers/ministryController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(ministryController.list)
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(ministryController.getById)
);
router.post("/", asyncHandler(ministryController.create));
router.delete(
  "/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(ministryController.remove)
);

export default router;
