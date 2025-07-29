import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import Session from "@/models/Session";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req) {
  await dbConnect();

  const { email, password, role } = await req.json();

  if (!["student", "teacher"].includes(role)) {
    return NextResponse.json({ message: "Invalid role provided" }, { status: 400 });
  }

  const UserModel = role === "student" ? Student : Teacher;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "Invalid Credentials" }, { status: 404 });
  }

  const isAuthentic = await bcrypt.compare(password, user.password);

  if (!isAuthentic) {
    return NextResponse.json({ message: "Invalid Credentials" }, { status: 400 });
  }

  // Remove previous session (one session per user)
  await Session.findOneAndDelete({ userId: user._id });

  // Create new session
  const token = randomUUID();
  await Session.create({ userId: user._id, token });

  const response = NextResponse.json({ message: "Login successful" });

  // Set cookie with the session token
  response.cookies.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
