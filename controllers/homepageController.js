import Homepage from "../models/Homepage.js";
import { success } from "../utils/apiResponse.js";
import { deleteFilesByUrls } from "../utils/r2DeleteHelper.js";
import { logActivity } from "../utils/activityLogger.js";

export const get = async (req, res, next) => {
  try {
    let homepage = await Homepage.findOne();
    if (!homepage) {
      homepage = new Homepage({ heroCarousel: [] });
      await homepage.save();
    }
    return success(res, 200, homepage, "Homepage configuration retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let homepage = await Homepage.findOne();
    const oldCarousel = homepage ? homepage.heroCarousel || [] : [];

    if (!homepage) {
      homepage = new Homepage(req.body);
    } else {
      Object.assign(homepage, req.body);
    }

    // Clean up R2 files for slides that were removed from the carousel
    const newCarousel = req.body.heroCarousel || [];
    const oldUrls = oldCarousel.map((item) => item.image).filter(Boolean);
    const newUrls = newCarousel.map((item) => item.image).filter(Boolean);
    const removedUrls = oldUrls.filter((url) => !newUrls.includes(url));
    await deleteFilesByUrls(removedUrls);

    await homepage.save();
    await logActivity(req, "UPDATE_HOMEPAGE", {
      carouselSize: (req.body.heroCarousel || []).length,
    });
    return success(res, 200, homepage, "Homepage configuration updated successfully");
  } catch (error) {
    next(error);
  }
};
