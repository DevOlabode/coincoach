const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatMessageSchema = new Schema({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: "ChatSession",
    required: true,
    index: true,
  },

  role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    edited: {
      type: Boolean,
      default: false,
    },

    parentMessageId: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
      default: null,
    },
  },
  {timestamps: { createdAt: true, updatedAt: false },});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
