import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();

    const { token, password, role } = await req.json();
    console.log("🔑 Reset request:", { token, role });

    if (!token || !password || !role) {
      return Response.json(
        { success: false, message: "Token, role, and password are required" },
        { status: 400 }
      );
    }

    let user = null;

    if (role === "student") {
      user = await Student.findOne({
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() }, // still valid
      });
    } else if (role === "teacher") {
      user = await Teacher.findOne({
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() },
      });
    } else {
      return Response.json(
        { success: false, message: "Invalid role" },
        { status: 400 }
      );
    }

    if (!user) {
      return Response.json(
        { success: false, message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash & update password
    user.password = await bcrypt.hash(password, 10);

    // Clear reset fields
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    return Response.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
