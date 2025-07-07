// /app/api/subject/chapter/route.js
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import Question from "@/models/Question";
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth";

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

    const user = await getLoggedInUser(); // 🔑 Get current user
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chapter = await Chapter.findById(chapterId).select("questions title");
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const totalQuestions = chapter.questions.length;

    const paginatedQuestions = await Question.find({
      _id: { $in: chapter.questions }
    })
      .select("question")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // We use lean() to allow modifying question objects

   // const questionIdList = chapter.questions.map(id => id.toString());

    // 🧠 Annotate each question based on user's progress
    const correctSet = new Set(user.correctQuestion.map(id => id.toString()));
    const incorrectSet = new Set(user.incorrectQuestion.map(id => id.toString()));
    const savedSet = new Set(user.saveQuestion.map(id => id.toString()));

    const annotatedQuestions = paginatedQuestions.map((q) => {
      const id = q._id.toString();
      return {
        ...q,
        status: correctSet.has(id)
          ? "correct"
          : incorrectSet.has(id)
          ? "incorrect"
          : "unattempted",
        saved: savedSet.has(id),
      };
    });

    return NextResponse.json({
      chapterTitle: chapter.title,
      page,
      totalPages: Math.ceil(totalQuestions / limit),
      totalQuestions, 
      questions: annotatedQuestions,
    });
  } catch (error) {
    console.error("Error fetching chapter questions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
