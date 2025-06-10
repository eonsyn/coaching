// api/userAuth/login/route.js
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export   async function POST (req){
    await dbConnect();
    const {email ,password}=await req.json();
    const student = await Student.findOne({email});
    const isAuthentic=await bcrypt.compare(password,student.password);
    if(!isAuthentic){
        return NextResponse.json({message:"Invalid Credentials"},{status:400})
    }

    return NextResponse.json({email,password,student},{status:200})
    
}