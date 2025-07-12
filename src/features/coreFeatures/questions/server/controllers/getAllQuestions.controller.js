import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB.js';
import Question from '../models/question.model';
import User from '@/features/user/auth/server/models/User.model';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // First, check if there are any questions at all
        const totalQuestions = await Question.countDocuments();
        console.log("Total questions in database:", totalQuestions);

        if (totalQuestions === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                message: "No questions found in database. Please add some questions first.",
                pagination: {
                    page,
                    limit,
                    hasMore: false,
                    total: 0
                }
            });
        }

        const totalUsers = await User.countDocuments();
        console.log("Total users in database:", totalUsers);

        const pipeline = [
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

        const questions = await Question.aggregate(pipeline);
        console.log("Questions from pipeline:", questions.length);

        return NextResponse.json({
            success: true,
            data: questions,
            pagination: {
                page,
                limit,
                hasMore: questions.length === limit,
                total: totalQuestions
            }
        });
    } catch (error) {
        console.error("Error in questions API:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}