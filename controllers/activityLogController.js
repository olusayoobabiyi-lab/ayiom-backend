import ActivityLog from "../models/ActivityLog.js";
import { success } from "../utils/apiResponse.js";

export const list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [
        { adminEmail: searchRegex },
        { adminName: searchRegex },
        { action: searchRegex },
      ];
    }

    const logs = await ActivityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const total = await ActivityLog.countDocuments(query);

    return success(
      res,
      200,
      {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Activity logs retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};
