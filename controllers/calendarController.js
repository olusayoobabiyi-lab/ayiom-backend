import Event from "../models/Event.js";
import { ApiError, success } from "../utils/apiResponse.js";
import { logActivity } from "../utils/activityLogger.js";

export const list = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ year: 1, month: 1, day: 1 });
    return success(res, 200, events, "Calendar events retrieved successfully");
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
    await logActivity(req, "CREATE_CALENDAR_EVENT", { eventId: event._id, title: event.title });
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
    Object.assign(event, req.body);
    await event.save();
    await logActivity(req, "UPDATE_CALENDAR_EVENT", { eventId: event._id, title: event.title });
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
    await event.deleteOne();
    await logActivity(req, "DELETE_CALENDAR_EVENT", { eventId: event._id, title: event.title });
    return success(res, 200, null, "Event deleted successfully");
  } catch (error) {
    next(error);
  }
};
