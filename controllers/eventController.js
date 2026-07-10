import Event from "../models/Event.js";
import { ApiError, success } from "../utils/apiResponse.js";
import { deleteFileByUrl } from "../utils/r2DeleteHelper.js";
import { logActivity } from "../utils/activityLogger.js";

export const list = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ year: 1, month: 1, day: 1 });
    return success(res, 200, events, "Events retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }
    return success(res, 200, event, "Event retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const event = new Event(req.body);
    await event.save();
    await logActivity(req, "CREATE_EVENT", {
      eventId: event._id,
      title: event.title,
      category: event.category,
    });
    return success(res, 201, event, "Event created successfully");
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    // Delete old image if a new one is being assigned
    if (req.body.image && req.body.image !== event.image) {
      await deleteFileByUrl(event.image);
    }

    Object.assign(event, req.body);
    await event.save();
    await logActivity(req, "UPDATE_EVENT", {
      eventId: event._id,
      title: event.title,
      category: event.category,
    });
    return success(res, 200, event, "Event updated successfully");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    // Delete image from R2
    if (event.image) {
      await deleteFileByUrl(event.image);
    }

    await event.deleteOne();
    await logActivity(req, "DELETE_EVENT", {
      eventId: event._id,
      title: event.title,
      category: event.category,
    });
    return success(res, 200, null, "Event deleted successfully");
  } catch (error) {
    next(error);
  }
};
