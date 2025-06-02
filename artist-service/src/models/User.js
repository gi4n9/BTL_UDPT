const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        maxlength: 100
    },
    last_name: {
        type: String,
        required: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        maxlength: 255
    },
    profile_image: {
        type: String,
        maxlength: 255
    },
    bio: {
        type: String
    },
    status: {
        type: String,
        enum: ['VERIFY', 'ACTIVE', 'BLOCKED'],
        default: 'VERIFY'
    },
    role: {
        type: String,
        enum: ['ROLE_ADMIN', 'ROLE_ARTIST', 'ROLE_USER'],
        default: 'ROLE_USER'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index cho tìm kiếm nhanh
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Virtual để lấy full name
userSchema.virtual('full_name').get(function () {
    return `${this.first_name} ${this.last_name}`;
});

// Method để check role
userSchema.methods.isArtist = function () {
    return this.role === 'ROLE_ARTIST';
};

userSchema.methods.isAdmin = function () {
    return this.role === 'ROLE_ADMIN';
};

module.exports = mongoose.model('User', userSchema);