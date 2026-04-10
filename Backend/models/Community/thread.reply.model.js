const mongoose = require("mongoose");

const { Schema } = mongoose;

const replySchema = new Schema(
    {
        thread: {
            type: Schema.Types.ObjectId,
            ref: "Thread",
            required: true,
            index: true
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        isAnonymous: {
            type: Boolean,
            default: false
        },

        anonymousIdentity: {
            type: String,
            default: null
        },

        content: {
            type: String,
            required: true,
            maxlength: 1000,
            trim: true
        },

        stats: {
            supportCount: { type: Number, default: 0 },
            relateCount: { type: Number, default: 0 },
            hugCount: { type: Number, default: 0 },
            replyCount: { type: Number, default: 0 },
            viewCount: { type: Number, default: 0 }
        },

        parentReply: {
            type: Schema.Types.ObjectId,
            ref: "ThreadReply",
            default: null
        },

        //  Safety
        isFlagged: {
            type: Boolean,
            default: false
        },

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);


//  Indexes
replySchema.index({ thread: 1, createdAt: -1 });
replySchema.index({ parentReply: 1 });

const ThreadReply = mongoose.model("ThreadReply", replySchema);

module.exports = ThreadReply;