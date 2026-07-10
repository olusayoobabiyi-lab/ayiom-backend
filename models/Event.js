import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
      uppercase: true,
    },
    year: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["outreach", "prayer", "widows", "school"],
    },
    monthColor: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    isMultiDay: {
      type: Boolean,
      default: false,
    },
    endDay: {
      type: Number,
    },
    endMonth: {
      type: String,
      uppercase: true,
    },
    endYear: {
      type: Number,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrencePattern: {
      type: String,
      enum: [
        "none",
        "weekly",
        "monthly",
        "monthly_last_saturday",
        "monthly_first_friday",
        "monthly_first_sunday",
      ],
      default: "none",
    },
    recurrenceVenueOverrides: [
      {
        dateKey: { type: String, required: true },
        venue: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Auto-fill category-based styling color on save
EventSchema.pre("save", function (next) {
  if (this.category === "outreach") this.monthColor = "bg-[#16A34A]";
  else if (this.category === "prayer") this.monthColor = "bg-[#D4AF37]";
  else if (this.category === "widows") this.monthColor = "bg-[#DC2626]";
  else if (this.category === "school") this.monthColor = "bg-[#2563EB]";
  next();
});

const Event = mongoose.model("Event", EventSchema);

export default Event;
