import { cookies } from 'next/headers';
import Session from '@/models/Session';
import Student from '@/models/Student';
import Teacher from "@/models/Teacher";
import dbConnect from './mongodb';

export async function clearCookies() {
  const cookieStore = cookies(); // ✅ no await
  cookieStore.set('session_token', '', {
    path: '/',
    maxAge: 0,
  });
}

export async function getLoggedInUser() {
  await dbConnect();

  const cookieStore = cookies(); // ✅ no await
  const token = cookieStore.get("session_token"); // ✅ FIXED: removed await

  if (!token) return null;

  const session = await Session.findOne({ token: token.value });
  if (!session) return null;

  // Try to find the user in Student collection
  let user = await Student.findById(session.userId).select("-password").lean();
  if (user) {
    return { user, role: "student" };
  }

  // Try Teacher collection
  user = await Teacher.findById(session.userId).select("-password").lean();
  if (user) {
    return { user, role: "teacher" };
  }

  return null;
}
