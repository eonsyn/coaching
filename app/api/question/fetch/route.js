import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";

export async function POST(req) {
  await dbConnect();

  const { subject, topic, level, count } = await req.json();

  try {
    const questions = await Question.aggregate([
      { $match: { subject, topic, level } },
      { $sample: { size: count || 1 } },
    ]); 
    return Response.json({ success: true, data: questions });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: "Failed to fetch question" }, { status: 500 });
  }
}