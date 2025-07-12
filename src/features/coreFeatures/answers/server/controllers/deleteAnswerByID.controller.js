import connectDB from '@/lib/connectDB';
import { NextResponse } from 'next/server';
import Answer from '../models/answer.model.js';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const answer = await Answer.findByIdAndDelete(params.id);

    if (!answer) {
      return NextResponse.json({
        success: false,
        error: 'Answer not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Answer deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}