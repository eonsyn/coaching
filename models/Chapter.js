import mongoose from 'mongoose';

const chapterIdSchema = new mongoose.Schema({
  title: String,
  shortName: String,
  icon: String
}, { _id: false });

const chapterSchema = new mongoose.Schema({
  chapterId: chapterIdSchema,
  title: { type: String, required: true },
  importance: String,
  priority: Number,

  mainsQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  advanceQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],

  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  order: Number,
  previousYearPapers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreviousYearPaper' }],
  syllabusCategory: { type: String, enum: ['noChange', 'updated', 'removed'], default: 'noChange' },
  questionsCount: Number
}, { timestamps: true });

const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);

export default Chapter;
