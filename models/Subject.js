import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter'
    }
  ]
}, {
  timestamps: true
});

// Prevent model overwrite during hot-reload
const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);

export default Subject;
