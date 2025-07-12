import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        default: null
    },
    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer',
        default: null
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
}, { timestamps: true });

// Ensure a comment belongs to either a question or an answer
commentSchema.pre('save', function (next) {
    if (!this.question && !this.answer) {
        return next(new Error('Comment must belong to either a question or an answer'));
    }
    if (this.question && this.answer) {
        return next(new Error('Comment cannot belong to both question and answer'));
    }
    next();
});

// Index for better performance
commentSchema.index({ question: 1, createdAt: -1 });
commentSchema.index({ answer: 1, createdAt: -1 });

// Check if model exists before creating
const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;