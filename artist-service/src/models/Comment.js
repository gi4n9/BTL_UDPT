const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    song_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 255
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index cho tìm kiếm nhanh
commentSchema.index({ song_id: 1, parent_id: 1 });
commentSchema.index({ user_id: 1 });
commentSchema.index({ created_at: -1 });

// Virtual để lấy replies (trả lời)
commentSchema.virtual('replies', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parent_id'
});

// Method để check xem comment có phải là reply không
commentSchema.methods.isReply = function () {
    return this.parent_id !== null;
};

// Static method để lấy comments theo song (chỉ parent comments)
commentSchema.statics.getParentCommentsBySong = function (songId) {
    return this.find({ song_id: songId, parent_id: null })
        .populate('user_id', 'first_name last_name profile_image')
        .populate('replies')
        .sort({ created_at: -1 });
};

// Static method để lấy tất cả comments theo song (bao gồm replies)
commentSchema.statics.getAllCommentsBySong = function (songId) {
    return this.find({ song_id: songId })
        .populate('user_id', 'first_name last_name profile_image')
        .sort({ created_at: -1 });
};

// Populate user info by default
commentSchema.pre(/^find/, function () {
    if (this.getOptions().populate !== false) {
        this.populate({
            path: 'user_id',
            select: 'first_name last_name profile_image'
        });
    }
});

module.exports = mongoose.model('Comment', commentSchema);