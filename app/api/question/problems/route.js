//api/question/problem/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const subject = searchParams.get('subject');
  const type = searchParams.get('type');
  
  if (!subject || !type) {
    return NextResponse.json({ error: 'Missing subject or type' }, { status: 400 });
  }

  try {
    const questions = await Question.aggregate([
      { $match: { subject, type } },
      { $sample: { size: 1 } }
    ]);

    if (!questions.length) {
      return NextResponse.json({ error: 'No question found' }, { status: 404 });
    }

    // ✅ return plain array
    return NextResponse.json(questions); 
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
