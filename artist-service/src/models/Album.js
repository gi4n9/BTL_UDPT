const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    release_date: {
        type: Date
    },
    artist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến User thay vì Artist
        required: true
    },
    cover_image: {
        type: String,
        maxlength: 255
    },
    type: {
        type: String,
        enum: ['FREE', 'PREMIUM'],
        default: 'FREE'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index cho tìm kiếm nhanh
albumSchema.index({ artist_id: 1 });
albumSchema.index({ type: 1 });
albumSchema.index({ release_date: -1 });
albumSchema.index({ title: 'text' }); // Text search

// Virtual để lấy songs trong album
albumSchema.virtual('songs', {
    ref: 'Song',
    localField: '_id',
    foreignField: 'album_id'
});

// Populate artist info by default khi cần
albumSchema.pre(/^find/, function () {
    if (this.getOptions().populate !== false) {
        this.populate({
            path: 'artist_id',
            select: 'first_name last_name profile_image',
            match: { role: 'ROLE_ARTIST' }
        });
    }
});

module.exports = mongoose.model('Album', albumSchema);