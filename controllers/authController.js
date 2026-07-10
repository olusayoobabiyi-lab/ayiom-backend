import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import { signToken } from "../utils/jwt.js";
import { ApiError, success } from "../utils/apiResponse.js";
import { logActivity } from "../utils/activityLogger.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Please provide email and password");
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = signToken({ id: admin._id, role: admin.role });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    await logActivity(req, "LOGIN", { email: admin.email, role: admin.role }, admin);

    return success(
      res,
      200,
      {
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      "Logged in successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    await logActivity(req, "LOGOUT");
    return success(res, 200, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      throw new ApiError(404, "User not found");
    }

    return success(res, 200, admin, "User profile retrieved");
  } catch (error) {
    next(error);
  }
};

export const listAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select("-password").sort({ createdAt: -1 });
    return success(res, 200, admins, "Administrators list retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Please provide all required fields: name, email, password");
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new ApiError(400, "An administrator with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: role || "admin",
    });

    await newAdmin.save();

    await logActivity(req, "CREATE_ADMIN", {
      newAdminEmail: newAdmin.email,
      newAdminRole: newAdmin.role,
    });

    const responseData = {
      id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      createdAt: newAdmin.createdAt,
    };

    return success(res, 201, responseData, "Administrator account created successfully");
  } catch (error) {
    next(error);
  }
};
