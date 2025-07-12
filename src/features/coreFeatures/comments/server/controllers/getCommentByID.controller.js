import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/connectDB.js';
import Comment from '../models/comment.model.js';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
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
      }
    ];

    const result = await Comment.aggregate(pipeline);
    
    if (!result.length) {
      return NextResponse.json({
        success: false,
        error: 'Comment not found'
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