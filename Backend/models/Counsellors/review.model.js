const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Counsellor",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  comment: {
    type: String,
    trim: true
  }

}, { timestamps: true });


reviewSchema.index({ user: 1, counsellor: 1 }, { unique: true });


const CounsellorReview = mongoose.model('CounsellorReview', reviewSchema);
module.exports = CounsellorReview;