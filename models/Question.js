//models/Question.js
import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: String,
  imageUrl: String,
});

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
    level: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    unit: String,
    error: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Question || mongoose.model("Question", questionSchema);
