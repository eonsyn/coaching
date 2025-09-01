import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, role } = await req.json();

    let user;
    if (role === "student") {
      user = await Student.findOne({ email });
    } else if (role === "teacher") {
      user = await Teacher.findOne({ email });
    } else {
      return Response.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    if (!user) {
      return Response.json({ success: false, message: "No account found with this email" }, { status: 404 });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}&role=${role}`;

    // Setup email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Concept Learning Classes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.username || "User"},</p>
          <p>You requested to reset your password. Click the link below:</p>
          <a href="${resetUrl}" target="_blank" style="display:inline-block; background:#4F46E5; color:white; padding:10px 20px; border-radius:6px; text-decoration:none;">
            Reset Password
          </a>
          <p>This link will expire in 15 minutes.</p>
        </div>
      `,
    });

    return Response.json({ success: true, message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
