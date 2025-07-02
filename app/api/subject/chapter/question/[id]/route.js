
// /app/api/subject/chapter/question/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import Chapter from '@/models/Chapter';
import Student from '@/models/Student';





export async function POST(req) {
  const url = new URL(req.url);
  const questionId = url.pathname.split('/').pop(); // safely get [id]
  const { selected = [], userInput = '', type, userId } = await req.json();

  try {
    await dbConnect();

    const [question, student] = await Promise.all([
      Question.findById(questionId).lean(),
      Student.findById(userId)
    ]);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
     

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // 🔍 Get correct indexes based on `isCorrect`
    const correctIndices = question.options
      ?.map((opt, i) => (opt.isCorrect ? i : null))
      ?.filter((i) => i !== null) || [];

    let correct = false;

    if (type === 'singleCorrect') {
      correct = selected.length === 1 && correctIndices.length === 1 && selected[0] === correctIndices[0];
    } else if (type === 'multiCorrect') {
      const userSorted = [...selected].sort();
      const correctSorted = [...correctIndices].sort();
      correct =
        userSorted.length === correctSorted.length &&
        userSorted.every((val, i) => val === correctSorted[i]);
    } else if (type === 'numerical') {
      correct = userInput.trim() === (question.correctValue ?? '').toString().trim();
    } else if (type === 'descriptive') {
      correct = true;
    }

    const alreadyAttempted =
      student.correctQuestion.includes(question._id) ||
      student.incorrectQuestion.includes(question._id);

    if (!student.performance) student.performance = [];

    const todayDate = new Date().toISOString().split('T')[0];
    const today = student.performance.find(
      (entry) => entry.date.toISOString().split('T')[0] === todayDate
    );

    if (!alreadyAttempted) {
      if (correct) {
        student.correctQuestion.push(question._id);
        student.score += 5;

        if (today) {
          today.correctQuestion += 1;
        } else {
          student.performance.push({
            date: new Date(),
            correctQuestion: 1,
            incorrectQuestion: 0
          });
        }
      } else {
        student.incorrectQuestion.push(question._id);

        if (today) {
          today.incorrectQuestion += 1;
        } else {
          student.performance.push({
            date: new Date(),
            correctQuestion: 0,
            incorrectQuestion: 1
          });
        }
      }

      await student.save();
    }

    return NextResponse.json({
      correct,
      correctAnswers: correctIndices, // ✅ useful for UI feedback
      message: correct ? 'Correct Answer!' : 'Wrong Answer',
      alreadyAttempted,
      solution: question.solution || { text: 'No Solution Available' },
      hint: question.hint || null,
      newScore: student.score
    });

  } catch (err) {
    console.error('Answer check error:', err);
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
