import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as galleryController from "../controllers/galleryController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get("/albums", asyncHandler(galleryController.listAlbums));
router.get("/albums/:id", asyncHandler(galleryController.getAlbumById));
router.post(
  "/albums",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(galleryController.createAlbum)
);
router.put(
  "/albums/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(galleryController.updateAlbum)
);
router.delete(
  "/albums/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(galleryController.removeAlbum)
);
router.post(
  "/albums/:id/images",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(galleryController.addImage)
);
router.delete(
  "/images/:id",
  authenticate,
  requireRole("admin", "system_admin"),
  asyncHandler(galleryController.removeImage)
);

export default router;
