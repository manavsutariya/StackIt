import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
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
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
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
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
}, { timestamps: true });

questionSchema.index({ title: 'text', content: 'text', tags: 'text' });
questionSchema.index({ owner: 1, createdAt: -1 });

// Check if model exists before creating
const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

export default Question