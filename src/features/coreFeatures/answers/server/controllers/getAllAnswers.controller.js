import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/connectDB';
import Answer from '../models/answer.model.js';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    const matchStage = questionId ? { question: new mongoose.Types.ObjectId(questionId) } : {};
    
    const pipeline = [
      {
        $match: matchStage
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
          'stats.comments': { $size: '$comments' },
          'answer.content': '$content',
          'answer.images': { $ifNull: ['$images', []] },
          'comments': []
        }
      },
      {
        $project: {
          _id: 1,
          owner: 1,
          answer: 1,
          stats: 1,
          comments: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ];

    const answers = await Answer.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      data: answers,
      pagination: {
        page,
        limit,
        hasMore: answers.length === limit
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}