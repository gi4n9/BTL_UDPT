const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    artist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan_type: {
        type: String,
        enum: ['BASIC', 'PREMIUM', 'PRO'],
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'],
        default: 'ACTIVE'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Cập nhật updated_at trước khi lưu
subscriptionSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);