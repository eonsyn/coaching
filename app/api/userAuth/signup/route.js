 
// /api/userAuth/signup/route.js
import dbConnect from "@/lib/mongodb";
import Otp from "@/models/Otp";
import Student from "@/models/Student";
import nodemailer from "nodemailer";
import Teacher from "@/models/Teacher";
export async function POST(req) {
  const { username, password, email, role } = await req.json();
  await dbConnect();

  const studentExists = await Student.findOne({ email });
  const teacherExists = await Teacher.findOne({ email });

   if (studentExists || teacherExists) {
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

const mailOptions = {
  from: `"Concept Learning Classes" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Your OTP Code for Signup Verification",
  text: `Your OTP is: ${otp}`, // fallback for non-HTML clients
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Welcome to <span style="color: #ff9900;">Concept Learning Classes</span>!</h2>
        <p style="font-size: 16px; color: #555;">To complete your signup for ${role} , please use the following OTP:</p>
        <div style="font-size: 28px; font-weight: bold; color: #222; margin: 20px 0; text-align: center;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #888;">This OTP is valid for 10 minutes. If you didn’t request this, please ignore this email.</p>
        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">© ${new Date().getFullYear()} JEEPrep AI. All rights reserved.</p>
      </div>
    </div>
  `,
};

await transporter.sendMail(mailOptions);

  

  return Response.json({ success: true, message: "OTP sent" });
}
