import dbConnect from "@/lib/mongodb";
import Subject from "@/models/Subject";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const subjects = await Subject.find({}, { subject: 1 });
    return NextResponse.json({ subjects });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}
