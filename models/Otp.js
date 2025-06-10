import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  username: String,
  password: String,
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
