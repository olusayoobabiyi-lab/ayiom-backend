import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["member", "partner"],
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", ""],
    },
    partnershipType: {
      type: String,
      enum: ["financial", "prayer", "volunteer", ""],
    },
    frequency: {
      type: String,
      enum: ["monthly", "quarterly", "one-time", ""],
    },
    comments: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", RegistrationSchema);

export default Registration;
