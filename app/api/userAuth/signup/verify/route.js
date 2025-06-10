// /api/userAuth/signup/verify/route.js
import dbConnect from "@/lib/mongodb";
import Otp from "@/models/Otp";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, otp } = await req.json();
  await dbConnect();

  const record = await Otp.findOne({ email });
  if (!record) {
    return Response.json({ success: false, message: "No OTP found" }, { status: 400 });
  }

  if (new Date() > record.expiresAt) {
    await Otp.deleteOne({ email });
    return Response.json({ success: false, message: "OTP expired" }, { status: 400 });
  }

  if (record.otp !== otp) {
    return Response.json({ success: false, message: "Invalid OTP" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(record.password, 10);
  await Student.create({
    name: record.username,
    email,
    password: hashedPassword,
  });

  await Otp.deleteOne({ email });

  return Response.json({ success: true, message: "Signup successful" });
}
