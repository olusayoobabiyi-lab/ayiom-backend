import mongoose from "mongoose";
import { env } from "../config/env.js";

/**
 * Starts a background interval to check if the MongoDB database connection is live.
 * Pings the admin database at the frequency defined by DB_PING_INTERVAL_MS.
 */
export function startDbLivelinessCheck() {
  const intervalMs = env.DB_PING_INTERVAL_MS;

  console.log(`[Liveliness Check] Initialized with interval of ${intervalMs}ms`);

  setInterval(async () => {
    try {
      // readyState 1 means Mongoose is connected
      if (mongoose.connection.readyState !== 1) {
        console.error(
          `[Liveliness Check] CRITICAL: MongoDB connection is inactive. Current state code: ${mongoose.connection.readyState}`
        );
        return;
      }

      const start = Date.now();
      // Run the ping command against the admin DB
      await mongoose.connection.db.admin().ping();
      const latency = Date.now() - start;

      console.log(`[Liveliness Check] Database is responsive (Ping latency: ${latency}ms)`);
    } catch (err) {
      console.error(
        "[Liveliness Check] CRITICAL ERROR: Database responsiveness check failed!",
        err.message
      );
    }
  }, intervalMs);
}
