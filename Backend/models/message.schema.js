const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    messages: [messageSchema]
  },
  {
    timestamps: true
  }
)

const Chat = mongoose.model("Chat", chatSchema)
module.exports = Chat;