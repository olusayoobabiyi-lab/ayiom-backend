import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env.js";

import { apiLimiter } from "./middleware/rateLimiter.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import sermonRoutes from "./routes/sermonRoutes.js";
import homepageRoutes from "./routes/homepageRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import missionRoutes from "./routes/missionRoutes.js";
import ministryRoutes from "./routes/ministryRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import activityLogRoutes from "./routes/activityLogRoutes.js";

const allowedOrigins = env.CLIENT_URLS.split(",").map((origin) => origin.trim());

const app = express();

// Security headers
app.use(helmet());

// Response compression
app.use(compression());

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. Postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser
app.use(cookieParser());

// Request logging
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// Global rate limiter
app.use(apiLimiter);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Routers
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/gallery", galleryRoutes);
app.use("/calendar", calendarRoutes);
app.use("/sermons", sermonRoutes);
app.use("/homepage", homepageRoutes);
app.use("/about", aboutRoutes);
app.use("/mission", missionRoutes);
app.use("/ministry", ministryRoutes);
app.use("/registrations", registrationRoutes);
app.use("/contact", contactRoutes);
app.use("/settings", settingsRoutes);
app.use("/activity-logs", activityLogRoutes);

// 404 for unmatched routes — must come after all routers
app.use(notFound);

// Global error handler — must be last
app.use(errorHandler);

export default app;
