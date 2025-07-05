// api/subject/route.js 
import Subject from "@/models/Subject";
import Chapter from "@/models/Chapter"; // ✅ Register the Chapter model
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const subjectName = searchParams.get("subject");

    if (!subjectName) {
      return NextResponse.json({ error: "Subject name is required" }, { status: 400 });
    }

    const subject = await Subject.findOne({ subject: subjectName }).populate({
      path: "chapters",
      select: "title , questions" // Only fetch chapter titles
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    const chapterTitles = subject.chapters.map((ch) => ({
     title: ch.title,
     questionsCount: ch.questions.length,
     _id: ch._id
    })); 
    return NextResponse.json({ subject: subject.subject, chapters: chapterTitles });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
