import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Answer from '../models/answer.model.js';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { content, images } = body;
    
    const answer = await Answer.findByIdAndUpdate(
      params.id,
      { content, images },
      { new: true }
    );

    if (!answer) {
      return NextResponse.json({
        success: false,
        error: 'Answer not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: answer
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}