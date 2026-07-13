import mongoose, { Model, Document } from "mongoose";
import crypto from "crypto";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  school?: string;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    school: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<IUserDocument> = (mongoose.models.User as Model<IUserDocument>) || mongoose.model<IUserDocument>("User", UserSchema);

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export default UserModel;
