import dbConnect from "@/lib/mongodb";
import Otp from "@/models/Otp";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import bcrypt from "bcryptjs";
import Session from "@/models/Session";
import { NextResponse } from "next/server"; 
import { randomUUID } from "crypto";

export async function POST(req) {
  const { email, otp, role } = await req.json();
  await dbConnect();

  if (!["student", "teacher"].includes(role)) {
    return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
  }

  const record = await Otp.findOne({ email });
  if (!record) {
    return NextResponse.json({ success: false, message: "No OTP found" }, { status: 400 });
  }

  if (new Date() > record.expiresAt) {
    await Otp.deleteOne({ email });
    return NextResponse.json({ success: false, message: "OTP expired" }, { status: 400 });
  }

  if (record.otp !== otp) {
    return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(record.password, 10);
  let user;

  try {
    if (role === 'student') {
      user = await Student.create({
        name: record.username,
        email,
        password: hashedPassword,
      });
    } else {
      user = await Teacher.create({
        name: record.username,
        email,
        password: hashedPassword,
      });
    }
  } catch (err) {
    return NextResponse.json({ success: false, message: "Error creating user" }, { status: 500 });
  }

  await Otp.deleteOne({ email });

  // Remove any existing session
  await Session.findOneAndDelete({ userId: user._id });

  // Create a new session
  const token = randomUUID();
  await Session.create({ userId: user._id, token });

  const response = NextResponse.json({ success: true, message: "Signup successful" });

  response.cookies.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
