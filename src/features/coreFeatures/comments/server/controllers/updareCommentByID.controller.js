import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB.js';
import Comment from '../models/comment.model.js';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { content, images } = body;
    
    const comment = await Comment.findByIdAndUpdate(
      params.id,
      { content, images },
      { new: true }
    );

    if (!comment) {
      return NextResponse.json({
        success: false,
        error: 'Comment not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: comment
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}