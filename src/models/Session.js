import mongoose from "mongoose";

const { Schema } = mongoose;

const SessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionToken: { type: String, required: true, index: true, unique: true },
    expires: { type: Date, required: true }
  },
  { timestamps: true }
);

const Session = mongoose.models.Session || mongoose.model("Session", SessionSchema);

export default Session;