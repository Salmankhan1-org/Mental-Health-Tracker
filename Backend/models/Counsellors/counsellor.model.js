const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const counsellorSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    expertiseTags: [
      {
        type: String,
        trim: true
      }
    ],

    bio: {
      type: String,
      required: true,
      trim: true
    },

    licenseNumber: {
      type: String,
      required: true,
      trim: true
    },

    yearsOfExperience: {
      type: Number,
      min: 0,
      required: true
    },

    location: {
      type: String,
      trim: true
    },

    virtualSessions: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    approvedAt: {
      type: Date
    },
    sessionFee:{
      type: String
    },

    consultationModes:[
      {
        type:String
      }
    ],

  },
  { timestamps: true }
);

counsellorSchema.index({ status: 1 });
counsellorSchema.index({ expertiseTags: 1 });

const Counsellor = mongoose.model("Counsellor", counsellorSchema);

module.exports = Counsellor;