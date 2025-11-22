import mongoose from "mongoose";

const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    participants: [
      {
        userId: { type: String, required: true },
        role: { type: String, enum: ["user", "assistant"], required: true },
        name: { type: String }, // For AI name or User name
      },
    ],
    projectId: { type: Number, required: true }, // ID from projectsData
    projectName: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    deadline: { type: Date },
    requirements: { type: Object }, // Store the full requirements payload/response
  },
  { timestamps: true }
);

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);

export default Conversation;
