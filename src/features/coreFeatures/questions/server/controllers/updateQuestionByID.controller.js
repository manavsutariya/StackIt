import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB.js';
import Question from '../models/question.model';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, content, images, tags } = body;
    
    const question = await Question.findByIdAndUpdate(
      params.id,
      { title, content, images, tags },
      { new: true }
    );

    if (!question) {
      return NextResponse.json({
        success: false,
        error: 'Question not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: question
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}