import ActivityLog from "../models/ActivityLog.js";
import Admin from "../models/Admin.js";

/**
 * Log an administrative activity.
 * @param {Object} req Express request object (can be null for login/logout when req.user is not yet fully available)
 * @param {string} action Description of the action (e.g. "CREATE_EVENT", "LOGIN")
 * @param {Object} details Additional structured details
 * @param {Object} fallbackAdmin Optional Admin object if req is null or req.user is not set
 */
export async function logActivity(req, action, details = {}, fallbackAdmin = null) {
  try {
    let adminId = null;
    let adminEmail = "system@amendyourways.org";
    let adminName = "System / Guest";

    if (req && req.user) {
      const admin = await Admin.findById(req.user.id);
      if (admin) {
        adminId = admin._id;
        adminEmail = admin.email;
        adminName = admin.name;
      }
    } else if (fallbackAdmin) {
      adminId = fallbackAdmin._id;
      adminEmail = fallbackAdmin.email;
      adminName = fallbackAdmin.name;
    }

    const ipAddress = req
      ? req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress
      : undefined;
    const userAgent = req ? req.headers["user-agent"] : undefined;

    await ActivityLog.create({
      adminId,
      adminEmail,
      adminName,
      action,
      details,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error("Error logging admin activity:", error);
  }
}
