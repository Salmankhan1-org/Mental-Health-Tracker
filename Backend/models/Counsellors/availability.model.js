const mongoose = require("mongoose")

const timeRangeSchema = new mongoose.Schema(
  {
    startTime: {
      type: String, // "09:00"
      required: true
    },
    endTime: {
      type: String, // "17:00"
      required: true
    },
    duration: {
      type: Number, // minutes (30, 60)
      required: true
    }
  },
  { _id: false }
)

const availabilitySchema = new mongoose.Schema(
  {
    counsellor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    dayOfWeek: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      required: true
    },

    ranges: {
      type: [timeRangeSchema],
      default: []
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata" // future-safe
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

// Prevent duplicate day per counsellor
availabilitySchema.index(
  { counsellor: 1, dayOfWeek: 1 },
  { unique: true }
)

const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = Availability;