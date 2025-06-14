import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";

export async function POST(req) {
  await dbConnect(); 
  const { subject, unit, level, count } = await req.json();
  console.log("unit")
  try {
    const questions = await Question.aggregate([
      { $match: { subject, unit, level } },
      { $sample: { size: count || 1 } },
    ]); 
   
    return Response.json({ success: true,unit,subject,level,count,data: questions });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: "Failed to fetch question" }, { status: 500 });
  }
}