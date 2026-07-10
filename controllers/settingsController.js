import { uploadToR2 } from "../config/r2.js";
import { ApiError, success } from "../utils/apiResponse.js";
import Settings from "../models/Settings.js";
import { logActivity } from "../utils/activityLogger.js";
import { v4 as uuidv4 } from "uuid";

export const get = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings document
      settings = new Settings({
        churchName: "Amend Your Ways International Outreach Ministry",
        phoneNumbers: ["+2348168804973", "+2348062862967", "+2349032598186"],
        emailAddress: "amendyourwaysintl@gmail.com",
        address:
          "Retreat Centre, No 7, Road B, Olutosin Estate, Iloro Community, Ejioku, Ibadan, Oyo State, Nigeria.",
      });
      await settings.save();
    }
    return success(res, 200, settings, "Settings retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    await logActivity(req, "UPDATE_SETTINGS");
    return success(res, 200, settings, "Settings updated successfully");
  } catch (error) {
    next(error);
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "Please upload an image file");
    }

    const fileExtension = req.file.originalname.split(".").pop();
    const uniqueKey = `uploads/${uuidv4()}.${fileExtension}`;

    const imageUrl = await uploadToR2(req.file.buffer, req.file.mimetype, uniqueKey);

    return success(res, 200, { imageUrl }, "Image uploaded successfully");
  } catch (error) {
    next(error);
  }
};
