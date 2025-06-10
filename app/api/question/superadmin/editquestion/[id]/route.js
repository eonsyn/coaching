// /api/question/superadmin/editquestion/[id]/route.js
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import { NextResponse } from 'next/server';

// GET function (from previous example, included for context)
export async function GET(request, { params }) {
    await dbConnect();
    const { id } = params;

    try {
        const question = await Question.findById(id);

        if (!question) {
            return NextResponse.json({ message: 'Question not found' }, { status: 404 });
        }

        return NextResponse.json(question, { status: 200 });

    } catch (error) {
        console.error('Error fetching question:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

// PATCH function for updating a question
export async function PATCH(request, { params }) {
    await dbConnect();
    const { id } = params; // Extract the 'id' from the URL parameters

    try {
        const body = await request.json(); // Get the update data from the request body

        // Mongoose findByIdAndUpdate options:
        // { new: true } returns the updated document
        // { runValidators: true } ensures that any schema validators run on the update
        const updatedQuestion = await Question.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedQuestion) {
            return NextResponse.json({ message: 'Question not found' }, { status: 404 });
        }

        return NextResponse.json(updatedQuestion, { status: 200 });

    } catch (error) {
        console.error('Error updating question:', error);

        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
        }

        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}