import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as missionController from "../controllers/missionController.js";

const router = Router();

router.get("/", asyncHandler(missionController.get));
router.put("/", asyncHandler(missionController.update));

export default router;
