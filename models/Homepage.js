import mongoose from "mongoose";

const HeroItemSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
});

const HomepageSchema = new mongoose.Schema(
  {
    heroCarousel: {
      type: [HeroItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Homepage = mongoose.model("Homepage", HomepageSchema);

export default Homepage;
