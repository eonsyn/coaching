// app/api/testgeneration /route.js 
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Subject from '@/models/Subject';
import Chapter from '@/models/Chapter';
import Question from '@/models/Question';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { subject, chapter, numberOfQuestions, type } = body;

    if (!subject || !chapter || !numberOfQuestions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the chapter ID if only subject + chapter name is given
    const subjectDoc = await Subject.findOne({ subject }).populate({
      path: 'chapters',
      match: { title: chapter }
    });

    if (!subjectDoc || subjectDoc.chapters.length === 0) {
      return NextResponse.json({ error: 'Chapter not found for the given subject' }, { status: 404 });
    }

    const chapterDoc = subjectDoc.chapters[0];

    // Build the query
    const query = {
      _id: { $in: chapterDoc.questions },
    };

    if (type) {
      query.type = type;
    }

    // Get random questions using aggregation
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: parseInt(numberOfQuestions) } }
    ]);

    return NextResponse.json({ questions }, { status: 200 });

  } catch (error) {
    console.error('Error generating test:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
