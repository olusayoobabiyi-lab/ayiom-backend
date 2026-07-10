// IMPORTANT: this side-effect import must be FIRST so dotenv.config()
// runs before any other module (including app.js → env.js) is evaluated.
import "dotenv/config";

import http from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { startDbLivelinessCheck } from "./utils/dbLiveliness.js";
import Admin from "./models/Admin.js";

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-upgrade configured primary admin to system_admin
    try {
      const primaryAdmin = await Admin.findOneAndUpdate(
        { email: env.ADMIN_EMAIL },
        { role: "system_admin" },
        { new: true }
      );
      if (primaryAdmin) {
        console.log(
          `[Migration] Primary admin (${env.ADMIN_EMAIL}) confirmed/upgraded as system_admin.`
        );
      }
    } catch (migError) {
      console.error("[Migration] Failed to verify primary admin role:", migError.message);
    }

    startDbLivelinessCheck();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log("HTTP server closed.");
        mongoose.connection.close(false, () => {
          console.log("MongoDB connection closed.");
          process.exit(0);
        });
      });
      setTimeout(() => {
        console.error("Forced shutdown after timeout.");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
