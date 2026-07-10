const requiredKeys = [
  "PORT",
  "MONGODB_URI",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "CLIENT_URL",
];

const missing = requiredKeys.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variable(s): ${missing.join(", ")}`);
}

export const env = Object.freeze({
  PORT: parseInt(process.env.PORT, 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  R2_ENDPOINT: process.env.R2_ENDPOINT,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  CLIENT_URL: process.env.CLIENT_URL,
  DB_PING_INTERVAL_MS: process.env.DB_PING_INTERVAL_MS
    ? parseInt(process.env.DB_PING_INTERVAL_MS, 10)
    : 300000,
});
