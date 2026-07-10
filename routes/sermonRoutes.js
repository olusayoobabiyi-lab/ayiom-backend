import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as sermonController from "../controllers/sermonController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get("/", asyncHandler(sermonController.list));
router.get("/:id", asyncHandler(sermonController.getById));
router.post(
  "/",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(sermonController.create)
);
router.put(
  "/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(sermonController.update)
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(sermonController.remove)
);

export default router;
