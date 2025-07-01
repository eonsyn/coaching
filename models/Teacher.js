import mongoose from "mongoose"; 
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
    student: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    requestStudent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Student"
        }
    ]

})

export default mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);