import nodemailer from "nodemailer";
import { env } from "../config/env.js";

/**
 * Create a nodemailer transporter using Gmail SMTP.
 * Configure via env variables (EMAIL_USER, EMAIL_PASSWORD).
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

/**
 * Send an email.
 * @param {{ to: string, subject: string, html: string, text?: string }} options
 * @returns {Promise<object>} nodemailer info object
 */
export async function sendEmail({ to, subject, html, text = "" }) {
  const info = await transporter.sendMail({
    from: env.EMAIL_USER,
    to,
    subject,
    html,
    text,
  });

  return info;
}
