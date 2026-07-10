import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as calendarController from "../controllers/calendarController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get("/", asyncHandler(calendarController.list));
router.get("/:id", asyncHandler(calendarController.getById));
router.post(
  "/",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(calendarController.create)
);
router.put(
  "/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(calendarController.update)
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(calendarController.remove)
);

export default router;
