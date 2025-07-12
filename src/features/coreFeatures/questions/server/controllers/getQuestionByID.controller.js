import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/connectDB.js';
import Question from '../models/question.model';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Increment views first
    await Question.findByIdAndUpdate(params.id, { $inc: { views: 1 } });
    
    const pipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(params.id) }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                fullName: 1,
                avatar: 1
              }
            }
          ]
        }
      },
      {
        $unwind: '$owner'
      },
      {
        $addFields: {
          'stats.upvotes': '$upvotes',
          'stats.downvotes': '$downvotes',
          'stats.views': '$views',
          'stats.answers': { $size: '$answers' },
          'stats.comments': { $size: '$comments' },
          'question.title': '$title',
          'question.content': '$content',
          'question.images': { $ifNull: ['$images', []] },
          'comments': []
        }
      },
      {
        $project: {
          _id: 1,
          owner: 1,
          question: 1,
          stats: 1,
          tags: { $ifNull: ['$tags', []] },
          comments: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ];

    const result = await Question.aggregate(pipeline);
    
    if (!result.length) {
      return NextResponse.json({
        success: false,
        error: 'Question not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}