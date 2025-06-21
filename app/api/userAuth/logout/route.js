import dbConnect from "@/lib/mongodb";
import Session from "@/models/Session";
import { clearCookies } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const token = req.cookies.get("session_token")?.value;

  if (token) {
    await Session.findOneAndDelete({ token });
  }
  await clearCookies();
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("session_token", "", { maxAge: 0 });

  return response;
}
