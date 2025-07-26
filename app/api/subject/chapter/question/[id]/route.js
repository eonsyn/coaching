
// /app/api/subject/chapter/question/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import Chapter from '@/models/Chapter';
import Student from '@/models/Student';

import { getLoggedInUser } from '@/lib/auth';



export async function POST(req, { params }) {
  try {
    await dbConnect();

    const user = await getLoggedInUser(); // ✅ get from cookie-based session
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questionId = params.id;
    const { selected = [], userInput = '', type } = await req.json();

    const question = await Question.findById(questionId).lean();
    const student = await Student.findById(user._id);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // ✅ Determine correct answer(s)
    const correctIndices = question.options
      ?.map((opt, i) => (opt.isCorrect ? i : null))
      ?.filter((i) => i !== null) || [];

    let correct = false;
    if (type === 'singleCorrect') {
      correct = selected.length === 1 && correctIndices.length === 1 && selected[0] === correctIndices[0];
    } else if (type === 'multiCorrect') {
      const userSorted = [...selected].sort();
      const correctSorted = [...correctIndices].sort();
      correct = userSorted.length === correctSorted.length &&
                userSorted.every((val, i) => val === correctSorted[i]);
    } else if (type === 'numerical') {
      correct = userInput.trim() === (question.correctValue ?? '').toString().trim();
    } else if (type === 'descriptive') {
      correct = true; // always mark descriptive as correct
    }

    // ✅ Prevent duplicate attempts
    const alreadyAttempted =
      student.correctQuestion.includes(question._id) ||
      student.incorrectQuestion.includes(question._id);

    // ✅ Record performance by date
    const today = new Date().toISOString().split("T")[0];
    if (!student.performanceByDate) student.performanceByDate = new Map();

    const perf = student.performanceByDate.get(today) || {
      correctQuestion: 0,
      incorrectQuestion: 0
    };

    if (!alreadyAttempted) {
      if (correct) {
        student.correctQuestion.push(question._id);
        student.score += 5;
        perf.correctQuestion += 1;
      } else {
        student.incorrectQuestion.push(question._id);
        perf.incorrectQuestion += 1;
      }

      student.performanceByDate.set(today, perf);
      await student.save();
    }

    return NextResponse.json({
      correct,
      correctAnswers: correctIndices,
      message: correct ? 'Correct Answer!' : 'Wrong Answer',
      alreadyAttempted,
      solution: question.solution || { text: 'No Solution Available' },
      hint: question.hint || null,
      newScore: student.score
    });

  } catch (err) {
    console.error("Answer check error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(req, { params }) {
  const { id: questionId } = params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type'); // 'mains' or 'advance'
  const chapterId = searchParams.get('chapterId');

  if (!["mains", "advance"].includes(type)) {
    return NextResponse.json({ error: "Invalid type. Must be 'mains' or 'advance'." }, { status: 400 });
  }

  if (!chapterId) {
    return NextResponse.json({ error: "chapterId is required" }, { status: 400 });
  }

  try {
    await dbConnect();

    const question = await Question.findById(questionId).lean();
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Remove sensitive fields
    delete question.solution;
    delete question.correctValue;
    if (Array.isArray(question.options)) {
      question.options = question.options.map(({ isCorrect, ...rest }) => rest);
    }

    const chapter = await Chapter.findById(chapterId).lean();
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Get correct question list based on type, and reverse it
    const rawQuestionList = type === 'mains' ? chapter.mainsQuestions : chapter.advanceQuestions;
    const reversedQuestions = [...rawQuestionList].reverse().map(q => q.toString());

    const currentIndex = reversedQuestions.indexOf(questionId);
    if (currentIndex === -1) {
      return NextResponse.json({ error: "Question not found in this chapter for the given type" }, { status: 404 });
    }

    const nextQuestionId = currentIndex < reversedQuestions.length - 1
      ? reversedQuestions[currentIndex + 1]
      : null;

    const previousQuestionId = currentIndex > 0
      ? reversedQuestions[currentIndex - 1]
      : null;

    return NextResponse.json({
      question,
      chapterId: chapter._id,
      chapterTitle: chapter.title,
      nextQuestionId,
      previousQuestionId,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}