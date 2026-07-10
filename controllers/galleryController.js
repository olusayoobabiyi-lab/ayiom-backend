import GalleryAlbum from "../models/GalleryAlbum.js";
import { ApiError, success } from "../utils/apiResponse.js";
import { deleteFileByUrl, deleteFilesByUrls } from "../utils/r2DeleteHelper.js";
import { logActivity } from "../utils/activityLogger.js";

export const listAlbums = async (req, res, next) => {
  try {
    const albums = await GalleryAlbum.find().sort({ createdAt: -1 });
    return success(res, 200, albums, "Gallery albums retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const album = await GalleryAlbum.findById(req.params.id);
    if (!album) {
      throw new ApiError(404, "Album not found");
    }
    return success(res, 200, album, "Album retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const album = new GalleryAlbum(req.body);
    await album.save();
    await logActivity(req, "CREATE_GALLERY_ALBUM", { albumId: album._id, name: album.name });
    return success(res, 201, album, "Album created successfully");
  } catch (error) {
    next(error);
  }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const album = await GalleryAlbum.findById(req.params.id);
    if (!album) {
      throw new ApiError(404, "Album not found");
    }

    // Delete old cover image if a new one is being assigned
    if (req.body.coverImage && req.body.coverImage !== album.coverImage) {
      await deleteFileByUrl(album.coverImage);
    }

    Object.assign(album, req.body);
    await album.save();
    await logActivity(req, "UPDATE_GALLERY_ALBUM", { albumId: album._id, name: album.name });
    return success(res, 200, album, "Album updated successfully");
  } catch (error) {
    next(error);
  }
};

export const removeAlbum = async (req, res, next) => {
  try {
    const album = await GalleryAlbum.findById(req.params.id);
    if (!album) {
      throw new ApiError(404, "Album not found");
    }

    // Delete cover image from R2
    if (album.coverImage) {
      await deleteFileByUrl(album.coverImage);
    }

    // Delete all images in the album from R2
    if (album.images && album.images.length > 0) {
      await deleteFilesByUrls(album.images);
    }

    await album.deleteOne();
    await logActivity(req, "DELETE_GALLERY_ALBUM", { albumId: album._id, name: album.name });
    return success(res, 200, null, "Album deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const addImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      throw new ApiError(400, "Please provide imageUrl");
    }

    const album = await GalleryAlbum.findById(req.params.id);
    if (!album) {
      throw new ApiError(404, "Album not found");
    }

    album.images.push(imageUrl);
    await album.save();
    await logActivity(req, "ADD_GALLERY_IMAGE", { albumId: album._id, name: album.name, imageUrl });
    return success(res, 200, album, "Image added to album successfully");
  } catch (error) {
    next(error);
  }
};

export const removeImage = async (req, res, next) => {
  try {
    const imageUrl = req.query.url || req.body.url;
    if (!imageUrl) {
      throw new ApiError(400, "Please provide the image URL to delete");
    }

    // Find the album that contains this image URL
    const album = await GalleryAlbum.findOne({ images: imageUrl });
    if (!album) {
      throw new ApiError(404, "Image not found in any album");
    }

    // Delete the file from R2
    await deleteFileByUrl(imageUrl);

    album.images = album.images.filter((img) => img !== imageUrl);
    await album.save();
    await logActivity(req, "DELETE_GALLERY_IMAGE", {
      albumId: album._id,
      name: album.name,
      imageUrl,
    });
    return success(res, 200, album, "Image removed from album successfully");
  } catch (error) {
    next(error);
  }
};
