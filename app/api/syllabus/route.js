import dbConnect from "@/lib/mongodb";
import Syllabus from "@/models/Syllabus";
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const subject = searchParams.get("subject");
  const className = searchParams.get("class");

  if (!subject || !className) {
    return NextResponse.json({ error: "Missing subject or class" }, { status: 400 });
  }

  try {
    const result = await Syllabus.findOne(
      {
        class: className,
        "subjects.subject": subject,
      },
      {
        "subjects.$": 1, // return only the matched subject from the array
        class: 1
      }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch syllabus" }, { status: 500 });
  }
}
