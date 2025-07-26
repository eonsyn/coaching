// api/subject/route.js
import Subject from "@/models/Subject";
import Chapter from "@/models/Chapter";
import Question from "@/models/Question"; // Needed for population
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const subjectName = searchParams.get("subject");
    const subjectType = searchParams.get("type"); // 'mains' or 'advance'

    if (!subjectName) {
      return NextResponse.json({ error: "Subject name is required" }, { status: 400 });
    }

    if (!["mains", "advance"].includes(subjectType)) {
      return NextResponse.json({ error: "Type must be either 'mains' or 'advance'" }, { status: 400 });
    }

    const questionField = subjectType === "mains" ? "mainsQuestions" : "advanceQuestions";

    const subject = await Subject.findOne({ subject: subjectName }).populate({
      path: "chapters",
      select: `_id title ${questionField}`, // ✅ include _id
      populate: {
        path: questionField,
        select: "_id"
      }
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    const chapters = subject.chapters.map((ch) => ({
      _id: ch._id, // ✅ return chapter ID
      title: ch.title,
      questionsCount: ch[questionField]?.length || 0
    }));

    return NextResponse.json({ subject: subject.subject, chapters });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
