const mongoose = require("mongoose");

const { Schema } = mongoose;

const threadReactionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        
        reactedId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'onModel' 
        },
        
        onModel: {
            type: String,
            required: true,
            enum: ['Thread', 'ThreadReply']
        },
        type: {
            type: String,
            enum: ["support", "relate", "hug"],
            required: true
        }
    },
    { timestamps: true }
);


threadReactionSchema.index(
    { user: 1, reactedId: 1, type: 1 },
    { unique: true }
);

const ThreadReaction = mongoose.model("ThreadReaction", threadReactionSchema);

module.exports = ThreadReaction;