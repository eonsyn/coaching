import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: String,
  image: String,
  isCorrect: Boolean,
}, { _id: false });

const previousYearPaperSchema = new mongoose.Schema({
  title: String,
  isVisible: Boolean,
}, { _id: false });

const questionSchema = new mongoose.Schema({
  showAttemptInsight: { type: Boolean, default: true },
  type: { type: String, enum: ['singleCorrect', 'multiCorrect', 'numerical', 'descriptive'] },
  level: { type: Number, min: 1, max: 5 },
  category: { type: String, default: null },
  approximateTimeRequired: { type: Number },
  imageBaseUrl: String,
  helperText: String,
  source: String,
  classes: [String],
  questionLabels: [String],
  previousYearPapers: [previousYearPaperSchema],
  question: {
    text: String,
    image: String,
  },
  options: [optionSchema],
  correctValue: String,
  solution: {
    text: String,
    image: String,
  },
  priority: { type: String, enum: ['Priority A', 'Priority B', 'Priority C'], default: 'Priority B' },
  isRemoved: { type: Boolean, default: false },
  hint: String,
}, { timestamps: true });

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

export default Question;  
