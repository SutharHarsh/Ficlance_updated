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
      name: { type: String }, // Optional name for display (e.g., client name)
    },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "github_feedback", "document"],
      default: "text",
    },
    metadata: { type: Object }, // For extra data like GitHub API response, document info
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;
