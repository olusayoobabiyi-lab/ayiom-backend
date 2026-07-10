import mongoose from "mongoose";

const CalendarSchema = new mongoose.Schema({}, { timestamps: true, strict: false });

const Calendar = mongoose.model("Calendar", CalendarSchema);

export default Calendar;
