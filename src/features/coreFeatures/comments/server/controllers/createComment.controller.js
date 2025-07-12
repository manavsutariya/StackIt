import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB.js';
import Comment from '../models/comment.model.js';
import Question from '@/features/coreFeatures/questions/server/models/question.model.js';
import Answer from '@/features/coreFeatures/answers/server/models/answer.model.js';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { content, owner, question, answer, images = [] } = body;
    
    if (!content || !owner || (!question && !answer)) {
      return NextResponse.json({
        success: false,
        error: 'Content, owner, and either question or answer are required'
      }, { status: 400 });
    }

    const comment = new Comment({
      content,
      owner,
      question,
      answer,
      images
    });

    await comment.save();
    
    // Add comment to question or answer
    if (question) {
      await Question.findByIdAndUpdate(
        question,
        { $push: { comments: comment._id } }
      );
    } else if (answer) {
      await Answer.findByIdAndUpdate(
        answer,
        { $push: { comments: comment._id } }
      );
    }

    return NextResponse.json({
      success: true,
      data: comment
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}