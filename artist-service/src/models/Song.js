const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    duration: {
        type: Number, // Lưu theo giây
        required: true
    },
    artist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến User thay vì Artist
        required: true
    },
    album_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    },
    file_url: {
        type: String,
        required: true,
        maxlength: 255
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index cho tìm kiếm nhanh
songSchema.index({ artist_id: 1 });
songSchema.index({ album_id: 1 });
songSchema.index({ views: -1 });
songSchema.index({ title: 'text' }); // Text search
songSchema.index({ created_at: -1 });

// Virtual để format duration
songSchema.virtual('formatted_duration').get(function () {
    const minutes = Math.floor(this.duration / 60);
    const seconds = this.duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual để lấy comments
songSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'song_id'
});

// Method để tăng view
songSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

// Populate artist và album by default
songSchema.pre(/^find/, function () {
    if (this.getOptions().populate !== false) {
        this.populate([
            {
                path: 'artist_id',
                select: 'first_name last_name profile_image',
                match: { role: 'ROLE_ARTIST' }
            },
            {
                path: 'album_id',
                select: 'title cover_image'
            }
        ]);
    }
});

module.exports = mongoose.model('Song', songSchema);