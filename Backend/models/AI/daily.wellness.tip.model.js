const  mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyWellnessTipSchema = new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
      index: true
    },

    tip: {
      type: String,
      required: true,
      trim: true
    },

    // Optional but VERY useful for analytics
    contextSnapshot: {
      moodScore: { type: Number },
      stressLevel: { type: Number },
      sentiment: {
        type: String,
        enum: ["positive", "neutral", "negative"]
      }
    }
},{timestamps:true});

dailyWellnessTipSchema.index({user:1, date:1},{unique: true})

const DailyWellnessTip = mongoose.model('DailyWellnessTip', dailyWellnessTipSchema);
module.exports = DailyWellnessTip;