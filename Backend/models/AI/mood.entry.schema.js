const mongoose = require("mongoose")

const { Schema } = mongoose

const qaSchema = new Schema(
  {
    question: { type: String, required: true },

    // store selected option OR text
    answer: { type: String, default: "" },

    // optional: for UI rendering (buttons)
    options: [{ type: String }],
  },
  { _id: false }
)

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

    // 🧠 AI Question Flow
    questionsAndAnswers: {
      type: [qaSchema],
      default: [],
    },

    // 📊 Session State
    sessionStatus: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
      index: true,
    },

    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    //  AI Analysis (Nested Object)
    analysis: {
      moodScore: {
        type: Number,
        min: 1,
        max: 5,

      },

      stressLevel: {
        type: Number,
        min: 1,
        max: 5,

      },

      sentiment: {
        type: String,
        enum: ["positive", "neutral", "negative"],

      },

      detectedEmotions: {
        type: [String],
        default: [],
      },

      emotionalBalanceScore: {
        type: Number,
        min: 0,
        max: 100,

      },

      insight: {
        type: String,

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
MoodEntrySchema.index({ user: 1, sessionStatus: 1 })
MoodEntrySchema.index({ user: 1, "analysis.sentiment": 1 })
MoodEntrySchema.index({ user: 1, "analysis.moodScore": 1 })


const MoodEntry = mongoose.model('MoodEntry', MoodEntrySchema);
module.exports = MoodEntry
