// /app/api/subject/chapter/route.js
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import Question from "@/models/Question";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("chapterId");
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = 10;
    const skip = page * limit;

    if (!chapterId) {
      return NextResponse.json({ error: "chapterId is required" }, { status: 400 });
    }

    await dbConnect();

    // Step 1: Get chapter to extract question IDs
    const chapter = await Chapter.findById(chapterId).select("questions title");
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const totalQuestions = chapter.questions.length;

    // Step 2: Paginate questions
    const paginatedQuestions = await Question.find({
      _id: { $in: chapter.questions }
    })
      .select("question")
      .skip(skip)
      .limit(limit);
const questionIdList = chapter.questions.map(id => id.toString());

    return NextResponse.json({
      chapterTitle: chapter.title,
      page,
      totalPages: Math.ceil(totalQuestions / limit),
      totalQuestions,
      questions: paginatedQuestions,
      questionIdList,
    });
  } catch (error) {
    console.error("Error fetching chapter questions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
