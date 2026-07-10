import About from "../models/About.js";
import { success } from "../utils/apiResponse.js";
import { deleteFilesByUrls } from "../utils/r2DeleteHelper.js";
import { logActivity } from "../utils/activityLogger.js";

export const get = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About({ carousel: [] });
      await about.save();
    }
    return success(res, 200, about, "About configuration retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let about = await About.findOne();
    const oldCarousel = about ? about.carousel || [] : [];

    if (!about) {
      about = new About(req.body);
    } else {
      Object.assign(about, req.body);
    }

    // Clean up R2 files for slides that were removed from the carousel
    const newCarousel = req.body.carousel || [];
    const oldUrls = oldCarousel.filter(Boolean);
    const newUrls = newCarousel.filter(Boolean);
    const removedUrls = oldUrls.filter((url) => !newUrls.includes(url));
    await deleteFilesByUrls(removedUrls);

    await about.save();
    await logActivity(req, "UPDATE_ABOUT_PAGE", { carouselSize: (req.body.carousel || []).length });
    return success(res, 200, about, "About configuration updated successfully");
  } catch (error) {
    next(error);
  }
};
