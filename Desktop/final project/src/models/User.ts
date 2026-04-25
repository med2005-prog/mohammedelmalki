import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  phone?: string;
  isBusiness: boolean;
  isVerified: boolean;
  subscriptionPlan: "none" | "starter" | "pro" | "enterprise";
  subscriptionExpiresAt?: Date;
  hasUsedFreeBoost: boolean;
  notifications: {
    push: boolean;
    email: boolean;
    matching: boolean;
  };
  favorites: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  phone: { type: String },
  isBusiness: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  
  // Business fields
  subscriptionPlan: { 
    type: String, 
    enum: ["none", "starter", "pro", "enterprise"], 
    default: "none" 
  },
  subscriptionExpiresAt: { type: Date },
  
  // Settings
  notifications: {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    matching: { type: Boolean, default: true },
  },
  
  // Freemium tracking
  hasUsedFreeBoost: { type: Boolean, default: false },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
