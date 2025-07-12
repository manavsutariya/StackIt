import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB.js';
import Comment from '../models/comment.model.js';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const comment = await Comment.findByIdAndDelete(params.id);

    if (!comment) {
      return NextResponse.json({
        success: false,
        error: 'Comment not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}