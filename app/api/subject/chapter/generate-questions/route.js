import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Chapter from '@/models/Chapter';
import Question from '@/models/Question';

export async function POST(req) {
  try {
    const { chapterId, count } = await req.json();
    if (!chapterId || !count) {
      return NextResponse.json({ error: 'chapterId and count are required' }, { status: 400 });
    }

    await dbConnect();

    const chapter = await Chapter.findById(chapterId).lean();

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const mains = chapter.mainsQuestions || [];
    const adv = chapter.advanceQuestions || [];

    const combined = [...mains, ...adv];

    // Shuffle combined questions
    const shuffled = combined.sort(() => 0.5 - Math.random());

    // Limit to count
    const selectedIds = shuffled.slice(0, count);

    const questions = await Question.find({ _id: { $in: selectedIds } })
      .select('question options solution correctValue type')
      .lean();

    return NextResponse.json({ questions });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
