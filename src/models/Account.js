import mongoose from "mongoose";

const { Schema } = mongoose;

const AccountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    type: { type: String, required: true },
    access_token: { type: String },
    refresh_token: { type: String },
    scope: { type: String },
    id_token: { type: String },
    token_type: { type: String },
    expires_at: { type: Number }
  },
  { timestamps: true }
);

/**
 * Create a unique index per provider + providerAccountId
 * to prevent duplicate account documents.
 */
AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const Account = mongoose.models.Account || mongoose.model("Account", AccountSchema);

export default Account;