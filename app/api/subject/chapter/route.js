// /app/api/subject/chapter/route.js 
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import Question from "@/models/Question";
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth";
import Subject from '@/models/Subject';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("chapterId");
    const chapterType = searchParams.get("type"); // 'mains' or 'advance'
    const page = parseInt(searchParams.get("page") || "0", 10);
    console.log("page is ==> ",page);
    const limit = 10;
    const skip = page * limit;

    if (!chapterId) {
      return NextResponse.json({ error: "chapterId is required" }, { status: 400 });
    }

    if (!["mains", "advance"].includes(chapterType)) {
      return NextResponse.json({ error: "Type must be either 'mains' or 'advance'" }, { status: 400 });
    }

    await dbConnect();

    const session = await getLoggedInUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;

    const questionField = chapterType === "mains" ? "mainsQuestions" : "advanceQuestions";

    const chapter = await Chapter.findById(chapterId)
      .select(`${questionField} title`)
      .lean();

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const allQuestions = chapter[questionField];
    const totalQuestions = allQuestions.length;

    const paginatedQuestions = await Question.find({ _id: { $in: allQuestions } })
      .select("question")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const correctSet = new Set((user.correctQuestion || []).map(id => id.toString()));
    const incorrectSet = new Set((user.incorrectQuestion || []).map(id => id.toString()));
    const savedSet = new Set((user.saveQuestion || []).map(id => id.toString()));

    const annotatedQuestions = paginatedQuestions.map(q => {
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


export async function POST(req) {
  try {
    const { subject } = await req.json();

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    await dbConnect();

    // Find subject and populate chapter references
    const subjectDoc = await Subject.findOne({ subject })
      .populate('chapters', 'title')
      .lean();

    if (!subjectDoc) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    return NextResponse.json({
      chapters: subjectDoc.chapters.map(ch => ({
        _id: ch._id,
        title: ch.title,
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}