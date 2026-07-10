import mongoose from "mongoose";

const GalleryAlbumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const GalleryAlbum = mongoose.model("GalleryAlbum", GalleryAlbumSchema);

export default GalleryAlbum;
