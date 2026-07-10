import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as authController from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.post("/login", asyncHandler(authController.login));
router.post("/logout", asyncHandler(authController.logout));
router.get("/me", asyncHandler(authController.me));

router.get(
  "/admins",
  authenticate,
  requireRole("system_admin"),
  asyncHandler(authController.listAdmins)
);
router.post(
  "/create-admin",
  authenticate,
  requireRole("system_admin"),
  asyncHandler(authController.createAdmin)
);

export default router;
