import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }
}

// Connection event handlers
mongoose.connection.on("connected", () => {
  console.log("Mongoose connection established.");
});

mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection disconnected.");
});
