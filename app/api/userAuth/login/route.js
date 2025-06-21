import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import Session from "@/models/Session";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req) {
  await dbConnect();

  const { email, password } = await req.json();
  const student = await Student.findOne({ email });

  if (!student) {
    return NextResponse.json({ message: "Invalid Credentials" }, { status: 404 });
  }

  const isAuthentic = await bcrypt.compare(password, student.password);
  if (!isAuthentic) {
    return NextResponse.json({ message: "Invalid Credentials" }, { status: 400 });
  }

  // Remove previous session (one session per user)
  await Session.findOneAndDelete({ userId: student._id });

  // Create new session
  const token = randomUUID();
  await Session.create({ userId: student._id, token });

  //   Set cookie on response directly
  const response = NextResponse.json({ message: "Login successful" });

  response.cookies.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
