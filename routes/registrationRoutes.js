import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as registrationController from "../controllers/registrationController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(registrationController.list)
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(registrationController.getById)
);
router.post("/", asyncHandler(registrationController.create));
router.delete(
  "/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(registrationController.remove)
);

export default router;
