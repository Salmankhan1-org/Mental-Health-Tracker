const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    counsellor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    date: {
      type: Date,
      required: true,
      index: true
    },

    startTime: {
      type: String, // e.g., "10:00"
      required: true
    },
    endTime: {
      type: String, // e.g., "11:00"
      required: true
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
   status: {
        type: String,
        enum: ["pending", "scheduled", "completed", "cancelled", "completed_by_counsellor"],
        default: "pending" 
    },
   // Add these to your Appointment Schema
    meetingMethod: {
        type: String,
        enum: ["google-meet", "phone", "in-person"],
        required: true
    },
    meetingDetails: {
        type: String, 
        default: "" // Store Zoom Link, Phone Number, or Address here
    },
    notes: {
      type: String,
      trim: true
    },
    reminderSent1h: { type: Boolean, default: false },
    reminderSent10m: { type: Boolean, default: false },

    confirmAt: {
        type: Date
    },
    confirmationDeadline:{
        type:Date
    }
  },
  { timestamps: true }
);


appointmentSchema.index(
  { counsellor: 1, date: 1, startTime: 1 },
  { 
    unique: true, 
    partialFilterExpression: { status: { $in: ["pending", "scheduled"] } } 
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;