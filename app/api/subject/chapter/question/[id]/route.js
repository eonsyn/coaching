// api/subject/chapter/question/[id]/rotue.js
// /app/api/subject/chapter/question/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import Chapter from '@/models/Chapter';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    await dbConnect();

    const question = await Question.findById(id).lean();
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Find the chapter containing this question
    const chapter = await Chapter.findOne({ questions: question._id }).lean();
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found for question' }, { status: 404 });
    }

    const questions = chapter.questions.map((q) => q.toString());
    const currentIndex = questions.indexOf(id);

    const previousQuestionId = currentIndex > 0 ? questions[currentIndex - 1] : null;
    const nextQuestionId =
      currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;

    return NextResponse.json(
      {
        question,
        nextQuestionId,
        previousQuestionId,
        chapterId: chapter._id,
        chapterTitle: chapter.title,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
