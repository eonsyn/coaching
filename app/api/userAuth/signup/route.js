 
// /api/userAuth/signup/route.js
import dbConnect from "@/lib/mongodb";
import Otp from "@/models/Otp";
import Student from "@/models/Student";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { username, password, email } = await req.json();
  await dbConnect();

  const existing = await Student.findOne({ email });
  if (existing) {
    return Response.json({ success: false, message: "Email already registered" }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await Otp.findOneAndUpdate(
    { email },
    { otp, username, password, expiresAt },
    { upsert: true, new: true }
  );

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Signup OTP",
    text: `Your OTP is: ${otp}`,
  });
  

  return Response.json({ success: true, message: "OTP sent" });
}
