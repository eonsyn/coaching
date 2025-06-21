import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: true //   Ensures only one session per user
  },
  token: {
    type: String,
    required: true,
    unique: true //   Each session has a unique token
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7 // Session expires in 7 days
  }
});

export default mongoose.models.Session || mongoose.model("Session", sessionSchema);
