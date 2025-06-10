import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  chapters: {
    type: [String], // array of chapter names
    required: true,
  },
});

const ClassSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
  },
  subjects: {
    type: [SubjectSchema], // array of subjects with chapters
    required: true,
  },
});

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
