import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/connectDB';
import Answer from '../models/answer.model.js';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Increment views first
    await Answer.findByIdAndUpdate(params.id, { $inc: { views: 1 } });
    
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
      }
    ];

    const result = await Answer.aggregate(pipeline);
    
    if (!result.length) {
      return NextResponse.json({
        success: false,
        error: 'Answer not found'
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