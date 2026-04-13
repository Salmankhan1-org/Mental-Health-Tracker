const mongoose = require("mongoose");

const { Schema } = mongoose;

const threadSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        isAnonymous: {
            type: Boolean,
            default: false
        },

        anonymousIdentity: {
            type: String,
            default: null
        },

        moodLabel: {
            type: String,
            required: true,
            index: true
        },

        topic: {
            type: String,
            required: true,
            index: true
        },

        content: {
            type: String,
            required: true,
            maxlength: 2000,
            trim: true
        },

        tags: {
            type: [String],
            default: []
        },

        //  Fast access counts
        stats: {
            supportCount: { type: Number, default: 0 },
            relateCount: { type: Number, default: 0 },
            hugCount: { type: Number, default: 0 },
            replyCount: { type: Number, default: 0 },
            viewCount: { type: Number, default: 0 }
        },

        //  Moderation
        moderation: {
            isFlagged: { type: Boolean, default: false },
            isSensitive: { type: Boolean, default: false },
            flaggedReason: { type: String, default: null }
        },

        //  AI metadata (future-proof)
        aiMeta: {
            sentiment: {
                type: String,
                enum: ["positive", "neutral", "negative"],
                default: "neutral"
            },
            emotionTags: {
                type: [String],
                default: []
            },
            riskLevel: {
                type: String,
                enum: ["low", "medium", "high"],
                default: "low"
            }
        },

        status: {
            type: String,
            enum: ["active", "hidden", "deleted"],
            default: "active",
            index: true
        },

        isDeleted: {
            type: Boolean,
            default: false
        },

        isMine:{ // if the requester is the owner of any thread
            type: Boolean,
            default: false
        },
        isEdited:{
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);


//  Indexes
threadSchema.index({ topic: 1, createdAt: -1 });
threadSchema.index({ moodLabel: 1, createdAt: -1 });
threadSchema.index({ "stats.supportCount": -1 });
threadSchema.index({ "stats.replyCount": -1 });

const Thread = mongoose.model("Thread", threadSchema);

module.exports = Thread;