import Ministry from "../models/Ministry.js";
import { ApiError, success } from "../utils/apiResponse.js";
import { logActivity } from "../utils/activityLogger.js";

export const list = async (req, res, next) => {
  try {
    const inquiries = await Ministry.find().sort({ createdAt: -1 });
    return success(res, 200, inquiries, "Ministry inquiries retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const inquiry = await Ministry.findById(req.params.id);
    if (!inquiry) {
      throw new ApiError(404, "Inquiry not found");
    }
    return success(res, 200, inquiry, "Inquiry retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const inquiry = new Ministry(req.body);
    await inquiry.save();
    return success(res, 201, inquiry, "Inquiry submitted successfully");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const inquiry = await Ministry.findById(req.params.id);
    if (!inquiry) {
      throw new ApiError(404, "Inquiry not found");
    }
    await inquiry.deleteOne();
    await logActivity(req, "DELETE_MINISTRY_INQUIRY", {
      inquiryId: inquiry._id,
      name: inquiry.fullName,
    });
    return success(res, 200, null, "Inquiry deleted successfully");
  } catch (error) {
    next(error);
  }
};
