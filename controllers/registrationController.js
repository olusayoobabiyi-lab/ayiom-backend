import Registration from "../models/Registration.js";
import { ApiError, success } from "../utils/apiResponse.js";
import { logActivity } from "../utils/activityLogger.js";

export const list = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }
    const registrations = await Registration.find(filter).sort({ createdAt: -1 });
    return success(res, 200, registrations, "Registrations retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      throw new ApiError(404, "Registration record not found");
    }
    return success(res, 200, registration, "Registration retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    return success(res, 201, registration, "Registration submitted successfully");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      throw new ApiError(404, "Registration record not found");
    }
    await registration.deleteOne();
    await logActivity(req, "DELETE_REGISTRATION", {
      registrationId: registration._id,
      name: registration.fullName,
    });
    return success(res, 200, null, "Registration deleted successfully");
  } catch (error) {
    next(error);
  }
};
