import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB.js';
import Question from '../models/question.model';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, content, owner, images = [], tags = [] } = body;
    
    if (!title || !content || !owner) {
      return NextResponse.json({
        success: false,
        error: 'Title, content, and owner are required'
      }, { status: 400 });
    }

    const question = new Question({
      title,
      content,
      owner,
      images,
      tags
    });

    await question.save();

    return NextResponse.json({
      success: true,
      data: question
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}