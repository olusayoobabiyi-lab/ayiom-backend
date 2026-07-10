import mongoose from "mongoose";

const MissionSchema = new mongoose.Schema({}, { timestamps: true, strict: false });

const Mission = mongoose.model("Mission", MissionSchema);

export default Mission;
