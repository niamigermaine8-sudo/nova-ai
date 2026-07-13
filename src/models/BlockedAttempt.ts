import mongoose, { Model, Document } from "mongoose";

export interface IBlockedAttempt {
  ip: string;
  attemptedEmail?: string;
  reason?: string;
  createdAt?: Date;
}

export interface IBlockedAttemptDocument extends IBlockedAttempt, Document {}

const BlockedAttemptSchema = new mongoose.Schema<IBlockedAttemptDocument>(
  {
    ip: { type: String, required: true, index: true },
    attemptedEmail: { type: String, default: "" },
    reason: { type: String, default: "duplicate_ip" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    collection: "blockedAttempts",
  }
);

const BlockedAttemptModel: Model<IBlockedAttemptDocument> =
  (mongoose.models.BlockedAttempt as Model<IBlockedAttemptDocument>) ||
  mongoose.model<IBlockedAttemptDocument>("BlockedAttempt", BlockedAttemptSchema);

export default BlockedAttemptModel;
