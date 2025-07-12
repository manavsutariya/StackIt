import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Answer from '../models/answer.model.js';
import Question from '@/features/coreFeatures/questions/server/models/question.model.js';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { content, owner, question, images = [] } = body;
    
    if (!content || !owner || !question) {
      return NextResponse.json({
        success: false,
        error: 'Content, owner, and question are required'
      }, { status: 400 });
    }

    const answer = new Answer({
      content,
      owner,
      question,
      images
    });

    await answer.save();
    
    // Add answer to question
    await Question.findByIdAndUpdate(
      question,
      { $push: { answers: answer._id } }
    );

    return NextResponse.json({
      success: true,
      data: answer
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}