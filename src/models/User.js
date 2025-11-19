import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, index: true, unique: true },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
    roles: { type: [String], default: ["user"] }
  },
  { timestamps: true }
);

/**
 * Avoid model overwrite issues in development (HMR).
 */
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;