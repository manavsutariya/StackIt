import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB.js';
import Question from '../models/question.model';

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const question = await Question.findByIdAndDelete(params.id);

    if (!question) {
      return NextResponse.json({
        success: false,
        error: 'Question not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}