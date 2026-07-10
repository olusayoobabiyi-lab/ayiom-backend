import Contact from "../models/Contact.js";
import { success, ApiError } from "../utils/apiResponse.js";

export const list = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return success(res, 200, contacts, "Contact messages retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    return success(res, 201, contact, "Message sent successfully");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      throw new ApiError(404, "Contact message not found");
    }
    await contact.deleteOne();
    return success(res, 200, null, "Contact message deleted successfully");
  } catch (error) {
    next(error);
  }
};
