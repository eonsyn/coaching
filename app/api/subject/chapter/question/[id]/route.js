// api/subject/chapter/question/[id]/rotue.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET(req, { params }) {
  const { id } = params;

  try {
    await dbConnect();
    console.log(id)

    const question = await Question.findById(id).lean();

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
