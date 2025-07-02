
// /app/api/subject/chapter/question/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import Chapter from '@/models/Chapter';
import Student from '@/models/Student';



export async function POST(req, { params }) {
  const questionId = params.id;
  const { selected = [], userInput = '', type, userId } = await req.json();

  try {
    await dbConnect();

    const [question, student] = await Promise.all([
      Question.findById(questionId).select('type options correctValue solution hint'),
      Student.findById(userId).select('correctQuestion incorrectQuestion performanceByDate score'),
    ]);

    if (!question || !student) {
      return NextResponse.json({ error: 'Question or student not found' }, { status: 404 });
    }

    let correct = false;

    if (type === 'singleCorrect') {
      const correctIndex = question.options.findIndex((o) => o.isCorrect);
      correct = selected.length === 1 && selected[0] === correctIndex;
    } else if (type === 'multiCorrect') {
      const correctIndices = question.options
        .map((opt, idx) => (opt.isCorrect ? idx : null))
        .filter((v) => v !== null)
        .sort();
      const userSelected = [...selected].sort();
      correct = correctIndices.length === userSelected.length &&
        correctIndices.every((val, i) => val === userSelected[i]);
    } else if (type === 'numerical') {
      correct = userInput.trim() === (question.correctValue ?? '').toString().trim();
    } else if (type === 'descriptive') {
      correct = true;
    }

    const alreadyAttempted =
      student.correctQuestion.includes(questionId) || student.incorrectQuestion.includes(questionId);

    if (alreadyAttempted) {
      return NextResponse.json({
        correct,
        message: correct ? 'Correct (already attempted)' : 'Wrong (already attempted)',
        solution: question.solution,
        hint: question.hint,
        alreadyAttempted: true,
        newScore: student.score
      });
    }

    const today = new Date().toISOString().split('T')[0];

    const update = {
      $addToSet: correct
        ? { correctQuestion: questionId }
        : { incorrectQuestion: questionId },
      $inc: {
        ...(correct ? { score: 5 } : {}),
        [`performanceByDate.${today}.${correct ? 'correctQuestion' : 'incorrectQuestion'}`]: 1
      }
    };

    await Student.findByIdAndUpdate(userId, update);

    return NextResponse.json({
      correct,
      message: correct ? '✅ Correct Answer!' : '❌ Wrong Answer',
      solution: question.solution,
      hint: question.hint,
      alreadyAttempted: false,
      newScore: student.score + (correct ? 5 : 0)
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export async function GET(req, { params }) {
  const { id } = params;

  try {
    await dbConnect();

    const question = await Question.findById(id).lean();



    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    // Remove solution entirely
    delete question.solution;

    // Optional: remove isCorrect from options
    if (Array.isArray(question.options)) {
      question.options = question.options.map(({ isCorrect, ...rest }) => rest);
    }

    // Optional: remove correctValue
    delete question.correctValue;

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
