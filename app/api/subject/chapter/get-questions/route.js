// /api/subject/chapter/get-questions/route.js

import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Chapter from '@/models/Chapter';
import Question from '@/models/Question';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("chapterId");

    if (!chapterId) {
      return NextResponse.json({ error: 'chapterId is required' }, { status: 400 });
    }

    await dbConnect();

    const chapter = await Chapter.findById(chapterId).lean();
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const mains = chapter.mainsQuestions || [];
    const adv = chapter.advanceQuestions || [];
    const combined = [...mains, ...adv];

    const questions = await Question.find({ _id: { $in: combined } })
      .select('question options solution correctValue type')
      .lean();

    return NextResponse.json({ questions });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
