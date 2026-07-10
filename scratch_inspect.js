import "dotenv/config";
import mongoose from "mongoose";
import Homepage from "./models/Homepage.js";
import About from "./models/About.js";
import GalleryAlbum from "./models/GalleryAlbum.js";
import { env } from "./config/env.js";

async function inspect() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB!");

    const home = await Homepage.findOne();
    console.log("\n--- Homepage Hero Carousel ---");
    console.log(JSON.stringify(home?.heroCarousel, null, 2));

    const about = await About.findOne();
    console.log("\n--- About Carousel ---");
    console.log(JSON.stringify(about?.carousel, null, 2));

    const albums = await GalleryAlbum.find();
    console.log("\n--- Gallery Albums ---");
    albums.forEach((album) => {
      console.log(`Album: ${album.title}`);
      console.log(`Cover Image: ${album.coverImage}`);
      console.log(`Images:`, album.images);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

inspect();
