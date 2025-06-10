import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';

export async function POST(req) {
  try {
    await dbConnect();
    const questions = await req.json();

    const inserted = await Question.insertMany(questions, { ordered: false });
    return Response.json({ success: true, insertedCount: inserted.length });
  } catch (error) {
    console.error("DB Insert Error:", error);

    if (error.name === 'ValidationError') {
      return new Response(JSON.stringify({ error: "Validation failed", details: error.errors }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ error: "Failed to insert questions" }), {
      status: 500,
    });
  }
}


export async function GET(request) {
  await dbConnect();

  // Extract query params from the request URL
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 20;
  const skip = (page - 1) * limit;

  try {
    const questions = await Question.find({})
      .sort({ updatedAt: -1 }) // newest first
      .skip(skip)
      .limit(limit)
      .lean();

    return new Response(
      JSON.stringify({ questions }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch questions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}