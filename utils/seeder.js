import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

// Import models
import Admin from "../models/Admin.js";
import Event from "../models/Event.js";
import Sermon from "../models/Sermon.js";
import GalleryAlbum from "../models/GalleryAlbum.js";
import Homepage from "../models/Homepage.js";
import About from "../models/About.js";

// Import R2 client helper
import { uploadToR2 } from "../config/r2.js";
import { env } from "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to find file path
const projectRoot = path.resolve(__dirname, "../..");
const frontendImagesDir = path.join(projectRoot, "frontend", "src", "assets", "images");

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected successfully!");

    // 1. Seed default Admin
    console.log("\n--- Seeding Administrator ---");
    const adminExists = await Admin.findOne({ email: env.ADMIN_EMAIL });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, salt);
      const newAdmin = new Admin({
        name: "Pastor Taiwo Clement",
        email: env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      await newAdmin.save();
      console.log(`Default admin created: ${env.ADMIN_EMAIL}`);
    } else {
      console.log(`Admin already exists: ${env.ADMIN_EMAIL}`);
    }

    // 2. Upload assets to Cloudflare R2
    console.log("\n--- Uploading Frontend Assets to Cloudflare R2 ---");
    const assetsToUpload = [
      { localName: "hero.png", folder: frontendImagesDir, key: "hero.png", mime: "image/png" },
      {
        localName: "slide-bible.png",
        folder: frontendImagesDir,
        key: "slide-bible.png",
        mime: "image/png",
      },
      {
        localName: "slide-outreach.png",
        folder: frontendImagesDir,
        key: "slide-outreach.png",
        mime: "image/png",
      },
      {
        localName: "slide-worship.png",
        folder: frontendImagesDir,
        key: "slide-worship.png",
        mime: "image/png",
      },
      {
        localName: "children.png",
        folder: frontendImagesDir,
        key: "children.png",
        mime: "image/png",
      },
      {
        localName: "convener.png",
        folder: frontendImagesDir,
        key: "convener.png",
        mime: "image/png",
      },
      {
        localName: "mission-bg.png",
        folder: frontendImagesDir,
        key: "mission-bg.png",
        mime: "image/png",
      },
      { localName: "homepage.jpeg", folder: projectRoot, key: "homepage.jpeg", mime: "image/jpeg" },
      { localName: "about-us.jpeg", folder: projectRoot, key: "about-us.jpeg", mime: "image/jpeg" },
      {
        localName: "Ministries.jpeg",
        folder: projectRoot,
        key: "ministries.jpeg",
        mime: "image/jpeg",
      },
      {
        localName: "our-mission.jpeg",
        folder: projectRoot,
        key: "our-mission.jpeg",
        mime: "image/jpeg",
      },
    ];

    const r2Urls = {};

    for (const asset of assetsToUpload) {
      const filePath = path.join(asset.folder, asset.localName);
      if (fs.existsSync(filePath)) {
        try {
          console.log(`Uploading ${asset.localName} to R2 bucket...`);
          const fileBuffer = fs.readFileSync(filePath);
          const uploadedUrl = await uploadToR2(fileBuffer, asset.mime, `assets/${asset.key}`);
          r2Urls[asset.key] = uploadedUrl;
          console.log(`  Uploaded! URL: ${uploadedUrl}`);
        } catch (uploadErr) {
          console.error(`  Failed to upload ${asset.localName}:`, uploadErr.message);
          r2Urls[asset.key] = ""; // Fallback
        }
      } else {
        console.warn(`  Local asset path not found: ${filePath}`);
        r2Urls[asset.key] = "";
      }
    }

    // 3. Seed Homepage Config
    console.log("\n--- Seeding Homepage Configuration ---");
    const homepageHeroSlides = [
      {
        image:
          r2Urls["hero.png"] ||
          "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1200",
        title: "AMEND YOUR WAYS",
        subtitle: "International Outreach Ministry",
      },
      {
        image:
          r2Urls["slide-bible.png"] ||
          "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200",
        title: "DIVINE FAITH & TRUTH",
        subtitle: "Preaching the uncompromised Word",
      },
      {
        image:
          r2Urls["slide-outreach.png"] ||
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200",
        title: "COMMUNITY OUTREACH",
        subtitle: "Expressing God's love through practical care",
      },
      {
        image:
          r2Urls["slide-worship.png"] ||
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1200",
        title: "PRAYER & REVIVAL",
        subtitle: "Rebuilding the altar of corporate worship",
      },
    ];

    await Homepage.deleteMany({});
    const defaultHomepage = new Homepage({ heroCarousel: homepageHeroSlides });
    await defaultHomepage.save();
    console.log("Homepage configuration seeded successfully!");

    // 4. Seed About Config
    console.log("\n--- Seeding About Us Configuration ---");
    const aboutCarousel = [
      r2Urls["children.png"] ||
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800",
      r2Urls["about-us.jpeg"] ||
        "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800",
    ];

    await About.deleteMany({});
    const defaultAbout = new About({ carousel: aboutCarousel });
    await defaultAbout.save();
    console.log("About Us configuration seeded successfully!");

    // 5. Seed Events
    console.log("\n--- Seeding Events ---");
    const eventsToSeed = [
      {
        day: 18,
        month: "MAY",
        year: 2025,
        category: "outreach",
        title: "Outreach to Rural Community",
        venue: "Rural Community Centre",
        time: "9:00 AM - 2:00 PM",
        description: "Reaching out with the gospel, food, clothes and love.",
        details:
          "This community outreach is focused on visiting remote villages. We will distribute food packages, clothes, clean water relief, and medical aid, alongside sharing the good news of salvation. Volunteers will assist in sorting materials and ministering to families.",
        image:
          r2Urls["slide-outreach.png"] ||
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600",
      },
      {
        day: 29,
        month: "MAY",
        year: 2025,
        category: "prayer",
        title: "Prayer Meeting & Intercession",
        venue: "Church Prayer Room",
        time: "6:00 PM - 7:30 PM",
        description: "A time of prayer and intercession for families and nations.",
        details:
          "Join us in our weekly power-packed prayer meeting as we lift up families, local communities, and nations of the world before the throne of grace. We will participate in guided prayer sessions, warfare prayers, and quiet reflection.",
        image:
          r2Urls["slide-worship.png"] ||
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600",
      },
      {
        day: 15,
        month: "JUN",
        year: 2025,
        category: "widows",
        title: "Outreach to Widows & Less Privileged",
        venue: "Community Welfare Hall",
        time: "10:00 AM - 2:00 PM",
        description: "Reaching out in love to widows and less privileged.",
        details:
          "As part of our commitment to care for the vulnerable, this outreach will serve widows in our neighborhood. We will provide medical checkups, essential food items, and emotional and spiritual support. Volunteers are welcome to assist in counseling and distribution.",
        image:
          r2Urls["about-us.jpeg"] ||
          "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=600",
      },
      {
        day: 23,
        month: "AUG",
        year: 2025,
        category: "school",
        title: "Back to School Support Program",
        venue: "Main Community Center",
        time: "10:00 AM - 2:00 PM",
        description: "Providing school materials and support for children.",
        details:
          "Help us prepare children from less-privileged backgrounds for the upcoming academic year. We will distribute school backpacks, stationery, writing books, and uniforms. Join hands with us to plant seeds of education and hope.",
        image:
          r2Urls["children.png"] ||
          "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600",
      },
    ];

    await Event.deleteMany({});
    for (const e of eventsToSeed) {
      const newEvent = new Event(e);
      await newEvent.save();
    }
    console.log(`${eventsToSeed.length} Events seeded successfully!`);

    // 6. Seed Sermons
    console.log("\n--- Seeding Sermons ---");
    const sermonsToSeed = [
      {
        title: "Walking in Divine Faith & Power",
        speaker: "Pastor Abraham Cole",
        date: "June 28, 2026",
        scripture: "Hebrews 11:1-6",
        description:
          "An empowering message on how to cultivate unwavering faith in challenging times and experience God's power.",
        videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: "45:20",
        notesUrl: "#",
        thumbnail:
          r2Urls["hero.png"] ||
          "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=600",
        transcript:
          "Welcome beloved to today's message. We are talking about walking in faith. Faith is not just a mental assent; it is a spiritual force...",
      },
      {
        title: "The Power of Persistent Prayer",
        speaker: "Pastor Abraham Cole",
        date: "June 14, 2026",
        scripture: "Luke 18:1-8",
        description:
          "Discover the spiritual dynamics of persistent prayer and intercession that breaks limitations.",
        videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        duration: "38:45",
        notesUrl: "#",
        thumbnail:
          r2Urls["slide-worship.png"] ||
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600",
        transcript:
          "Prayer is the currency of the spiritual realm. When we pray persistently, we are not trying to convince a reluctant God...",
      },
      {
        title: "The Gospel of Compassion",
        speaker: "Evang. Sarah Jenkins",
        date: "May 24, 2026",
        scripture: "Matthew 25:35-40",
        description:
          "A sermon exploring the biblical mandate to care for widows, orphans, and the less privileged in our society.",
        videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: "51:10",
        notesUrl: "#",
        thumbnail:
          r2Urls["slide-outreach.png"] ||
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600",
        transcript:
          "The true measure of a church's impact is how it handles the vulnerable. Matthew 25 makes it clear...",
      },
    ];

    await Sermon.deleteMany({});
    for (const s of sermonsToSeed) {
      const newSermon = new Sermon(s);
      await newSermon.save();
    }
    console.log(`${sermonsToSeed.length} Sermons seeded successfully!`);

    // 7. Seed Gallery Albums
    console.log("\n--- Seeding Gallery Albums ---");
    const albumsToSeed = [
      {
        title: "Widows Care Outreach 2026",
        description:
          "Moments from our widows' welfare distribution, support groups, and healthcare checkup drives.",
        coverImage:
          r2Urls["about-us.jpeg"] ||
          "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=600",
        date: "June 2026",
        images: [
          r2Urls["about-us.jpeg"] ||
            "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800",
          "https://images.unsplash.com/photo-1516841273335-e39b37888115?q=80&w=800",
          "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800",
          "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800",
        ],
      },
      {
        title: "Back to School Support 2025",
        description:
          "Empowering children from vulnerable families with backpacks, uniforms, and educational scholarships.",
        coverImage:
          r2Urls["children.png"] ||
          "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600",
        date: "August 2025",
        images: [
          r2Urls["children.png"] ||
            "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800",
          "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800",
          "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800",
          "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800",
        ],
      },
      {
        title: "Rural Missions & Crusades",
        description:
          "Preaching the gospel, conducting free medical missions, and planting churches in remote villages.",
        coverImage:
          r2Urls["slide-outreach.png"] ||
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600",
        date: "May 2025",
        images: [
          r2Urls["slide-outreach.png"] ||
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800",
          "https://images.unsplash.com/photo-1504052434569-7c9180859485?q=80&w=800",
          r2Urls["slide-worship.png"] ||
            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800",
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800",
        ],
      },
    ];

    await GalleryAlbum.deleteMany({});
    for (const a of albumsToSeed) {
      const newAlbum = new GalleryAlbum(a);
      await newAlbum.save();
    }
    console.log(`${albumsToSeed.length} Gallery Albums seeded successfully!`);

    console.log("\n--- Seeding finished successfully! ---");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Migration/Seeding Error:", err);
    process.exit(1);
  }
}

run();
