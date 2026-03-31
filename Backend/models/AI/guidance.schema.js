const mongoose = require("mongoose");

const guidanceSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        triggerMoodEntry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mood",
            required: true
        },

        entriesUsed: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Mood",
                required: true,
            },
        ],

        contextSnapshot: {
            avgMoodScore: Number,
            avgStressLevel: Number,
            emotionalBalanceScore: Number,
            dominantEmotions: [String],
            trend: {
                type: String,
                enum: ["improving", "declining", "stable"],
            },
        },

        analysisHeader: {
            type: String,
            required: true,
        },

        microActions: [
            {
                task: String,
                duration: String,
                category: String,
            },
        ],

        educationalInsight: String,

        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
            index: true,
        },

        referral: {
            recommended: {
                type: Boolean,
                default: false,
            },
            reason: String,

            matchCriteria: {
                focusAreas: [String],
                emotions: [String],
                suggestedExpertise: [String],
            },
        },

        generatedForDate: {
            type: Date,
            required: true,
            index: true,
        },

        generatedForDay:{
            type: String
        },

        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    { timestamps: true }
);


//  Prevent duplicate guidance for same mood entry
guidanceSchema.index(
    { triggerMoodEntry: 1 },
    { unique: true }
);


//  Prevent multiple guidance per user per day
guidanceSchema.index(
    { student: 1, generatedForDate: 1, generatedForDay:1 },
    { unique: true }
);


//  Optimized query for fetching latest guidance
guidanceSchema.index(
    { student: 1, isDeleted: 1, createdAt: -1 }
);

const Guidance = mongoose.model("Guidance", guidanceSchema);

module.exports = Guidance;