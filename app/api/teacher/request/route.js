// app/api/teacher/request/route.js
import { getLoggedInUser } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import Student from "@/models/Student";

 
export async function POST(req) {
  await dbConnect();
  const user = await getLoggedInUser();

  if (!user || user.role !== "student") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teacherId } = await req.json();

  const student = await Student.findById(user.user._id);
  if (!student) return Response.json({ error: "Student not found" }, { status: 404 });

  if (student.requestedTeacher) {
    return Response.json({ error: "You already requested a teacher" }, { status: 400 });
  }

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) return Response.json({ error: "Teacher not found" }, { status: 404 });

  // Add to teacher.requestStudent
  teacher.requestStudent.push({
    studentId: student._id,
    name: student.name,
  });

  // Update student.requestedTeacher
  student.requestedTeacher = teacher._id;

  await teacher.save();
  await student.save();

  return Response.json({ success: true });
}

