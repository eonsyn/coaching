//api/subject/chapter/question/next/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import Chapter from '@/models/Chapter';
import Subject from '@/models/Subject';

export async function POST(req) {
  const { currentQuestionId } = await req.json();
  await dbConnect();

  const currentQuestion = await Question.findById(currentQuestionId);
  if (!currentQuestion) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  // Find all chapters where this question exists
  const chapter = await Chapter.findOne({ questions: currentQuestion._id });
  if (!chapter) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  // Find the subject containing this chapter
  const subject = await Subject.findOne({ chapters: chapter._id });
  if (!subject) {
    return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
  }

  // Get all question IDs from all chapters in this subject
  const fullSubject = await Subject.findById(subject._id).populate({
    path: 'chapters',
    populate: {
      path: 'questions',
    },
  });

  const allQuestions = fullSubject.chapters
    .flatMap(chap => chap.questions)
    .filter(q => q != null)
    .sort((a, b) => a._id.toString().localeCompare(b._id.toString()));

  const index = allQuestions.findIndex(q => q._id.toString() === currentQuestionId);
  const nextQuestion = allQuestions[index + 1];

  if (!nextQuestion) {
    return NextResponse.json({ message: 'No more questions in subject' });
  }

  return NextResponse.json({ nextQuestionId: nextQuestion._id });
}
