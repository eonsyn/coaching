// app/api/teacher/approve/route.js
import { getLoggedInUser } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";

export async function POST(req) {
  await dbConnect();
  const user = await getLoggedInUser();

  if (!user || user.role !== "teacher") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { studentId } = await req.json();
  const teacher = await Teacher.findById(user.user._id);
  if (!teacher) return Response.json({ error: "Teacher not found" }, { status: 404 });

  const request = teacher.requestStudent.find(
    (s) => s.studentId.toString() === studentId
  );
  if (!request) {
    return Response.json({ error: "Student not in request list" }, { status: 404 });
  }

  // Update teacher
  teacher.student.push(request);
  teacher.requestStudent = teacher.requestStudent.filter(
    (s) => s.studentId.toString() !== studentId
  );
  await teacher.save();

  // Update student
  const student = await Student.findById(studentId);
  student.teacher = teacher._id;
  student.requestedTeacher = null;
  await student.save();

  return Response.json({ success: true });
}

