// models/Student.js
import mongoose from "mongoose";



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
  saveQuestion: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  correctQuestion:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  incorrectQuestion:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
 performanceByDate: {
  type: Map,
  of: {
    correctQuestion: { type: Number, default: 0 },
    incorrectQuestion: { type: Number, default: 0 },
  },
  default: {}
}
,

   
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model("Student", studentSchema);
