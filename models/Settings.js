import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({}, { timestamps: true, strict: false });

const Settings = mongoose.model("Settings", SettingsSchema);

export default Settings;
