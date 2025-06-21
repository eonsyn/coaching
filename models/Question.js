// models/Question.js
import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: String,
  imageUrl: String,
});

const askedInSchema = new mongoose.Schema(
  {
    exam: String,     // e.g., "JEE Main", "JEE Adv.", "NDA"
    year: Number,     // e.g., 2019, 2006
    date: String,     // e.g., "12 Jan I", optional
    marks: Number,    // e.g., 3 (for "3M"), optional
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["MCQ", "Numerical", "Descriptive"],
      required: true,
    },
    question: {
      text: { type: String, required: true },
      imageUrl: String,
    },
    options: {
      option1: optionSchema,
      option2: optionSchema,
      option3: optionSchema,
      option4: optionSchema,
    },
    correctOption: String,
    answer: String,
    explanation: String,
    publication: String,
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    level: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    unit: String,
    error: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // New: store exam history, marks, etc.
    askedIn: askedInSchema,
  },
  { timestamps: true }
);

export default mongoose.models.Question || mongoose.model("Question", questionSchema);
