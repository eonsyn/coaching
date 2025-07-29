import mongoose from "mongoose";

const studentSubSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    name: {
      type: String,
    },
  },
  { _id: false }
);

const teacherSchema = new mongoose.Schema({
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
  student: [studentSubSchema],
  requestStudent: [studentSubSchema],
});

export default mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
