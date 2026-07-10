import mongoose from "mongoose";

const GalleryImageSchema = new mongoose.Schema({}, { timestamps: true, strict: false });

const GalleryImage = mongoose.model("GalleryImage", GalleryImageSchema);

export default GalleryImage;
