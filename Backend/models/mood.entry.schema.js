const mongoose = require("mongoose")

const { Schema } = mongoose

const MoodEntrySchema = new Schema(
  {
    //  Reference to User
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    //  User Input
    selectedMood: {
      type: String,
      enum: ["great", "good", "okay", "low", "struggling"],
      required: true,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    //  AI Analysis (Nested Object)
    analysis: {
      moodScore: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },

      stressLevel: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },

      sentiment: {
        type: String,
        enum: ["positive", "neutral", "negative"],
        required: true,
      },

      detectedEmotions: {
        type: [String],
        default: [],
      },

      emotionalBalanceScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },

      insight: {
        type: String,
        required: true,
      },

      confidence: {
        type: Number,
        min: 0,
        max: 1,
      },
    },

    // Soft Delete (Best Practice)
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
)


// Performance Indexes (Important for Dashboard)

MoodEntrySchema.index({ user: 1, createdAt: -1 })
MoodEntrySchema.index({ user: 1, "analysis.sentiment": 1 })
MoodEntrySchema.index({ user: 1, "analysis.moodScore": 1 })


const MoodEntry = mongoose.model('MoodEntry', MoodEntrySchema);
module.exports = MoodEntry
