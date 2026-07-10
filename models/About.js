import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema(
  {
    carousel: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const About = mongoose.model("About", AboutSchema);

export default About;
