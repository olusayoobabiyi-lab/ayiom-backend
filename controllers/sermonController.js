import Sermon from "../models/Sermon.js";
import { ApiError, success } from "../utils/apiResponse.js";
import { deleteFileByUrl } from "../utils/r2DeleteHelper.js";
import { logActivity } from "../utils/activityLogger.js";

export const list = async (req, res, next) => {
  try {
    const sermons = await Sermon.find().sort({ createdAt: -1 });
    return success(res, 200, sermons, "Sermons retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      throw new ApiError(404, "Sermon not found");
    }
    return success(res, 200, sermon, "Sermon retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const sermon = new Sermon(req.body);
    await sermon.save();
    await logActivity(req, "CREATE_SERMON", { sermonId: sermon._id, title: sermon.title });
    return success(res, 201, sermon, "Sermon created successfully");
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      throw new ApiError(404, "Sermon not found");
    }

    // Delete old thumbnail if a new one is being assigned
    if (req.body.thumbnail && req.body.thumbnail !== sermon.thumbnail) {
      await deleteFileByUrl(sermon.thumbnail);
    }

    Object.assign(sermon, req.body);
    await sermon.save();
    await logActivity(req, "UPDATE_SERMON", { sermonId: sermon._id, title: sermon.title });
    return success(res, 200, sermon, "Sermon updated successfully");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      throw new ApiError(404, "Sermon not found");
    }

    // Delete thumbnail from R2
    if (sermon.thumbnail) {
      await deleteFileByUrl(sermon.thumbnail);
    }

    await sermon.deleteOne();
    await logActivity(req, "DELETE_SERMON", { sermonId: sermon._id, title: sermon.title });
    return success(res, 200, null, "Sermon deleted successfully");
  } catch (error) {
    next(error);
  }
};
