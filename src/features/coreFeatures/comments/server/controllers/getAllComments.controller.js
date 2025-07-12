import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/connectDB.js';
import Comment from '../models/comment.model.js';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    const answerId = searchParams.get('answerId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    let matchStage = {};
    if (questionId) matchStage.question = new mongoose.Types.ObjectId(questionId);
    if (answerId) matchStage.answer = new mongoose.Types.ObjectId(answerId);
    
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
          'comment.content': '$content',
          'comment.images': { $ifNull: ['$images', []] }
        }
      },
      {
        $project: {
          _id: 1,
          owner: 1,
          comment: 1,
          stats: 1,
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

    const comments = await Comment.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        hasMore: comments.length === limit
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}