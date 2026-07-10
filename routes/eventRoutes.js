import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as eventController from "../controllers/eventController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get("/", asyncHandler(eventController.list));
router.get("/:id", asyncHandler(eventController.getById));
router.post(
  "/",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(eventController.create)
);
router.put(
  "/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(eventController.update)
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(eventController.remove)
);

export default router;
