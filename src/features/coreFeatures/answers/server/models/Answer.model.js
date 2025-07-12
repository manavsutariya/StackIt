import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    images: [{
        type: String // Cloudinary URLs
    }],
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

// Index for better performance
answerSchema.index({ question: 1, createdAt: -1 });
answerSchema.index({ owner: 1, createdAt: -1 });

// Check if model exists before creating
const Answer = mongoose.models.Answer || mongoose.model('Answer', answerSchema);

export default Answer;