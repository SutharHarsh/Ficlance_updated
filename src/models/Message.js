import mongoose from "mongoose";

const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      userId: { type: String, required: true },
      role: { type: String, enum: ["user", "assistant", "system"], required: true },
    },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "github_feedback"],
      default: "text",
    },
    metadata: { type: Object }, // For extra data like GitHub API response
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;
