import mongoose from "mongoose";

const SermonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    speaker: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    scripture: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    transcript: {
      type: String,
      default: "",
    },
    notesUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Sermon = mongoose.model("Sermon", SermonSchema);

export default Sermon;
