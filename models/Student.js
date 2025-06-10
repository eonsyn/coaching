// models/Student.js
import mongoose from "mongoose";

const solvedQuestionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  }],
 
});

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
   score: {
    type: Number,
    default: 0,
  },
  solvedQuestions: [solvedQuestionSchema],
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model("Student", studentSchema);
