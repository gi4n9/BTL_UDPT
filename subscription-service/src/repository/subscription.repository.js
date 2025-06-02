const Subscription = require('../models/Subscription');

// Lấy subscription hiện tại của artist
const getActiveSubscriptionByArtist = async (artistId) => {
    return await Subscription.findOne({
        artist_id: artistId,
        status: 'ACTIVE',
        end_date: { $gte: new Date() }
    })
        .populate('artist_id', 'first_name last_name email')
        .exec();
};

// Tạo subscription mới
const createSubscription = async (subscriptionData) => {
    const subscription = new Subscription(subscriptionData);
    const savedSubscription = await subscription.save();
    return await Subscription.findById(savedSubscription._id)
        .populate('artist_id', 'first_name last_name email')
        .exec();
};

// Cập nhật subscription
const updateSubscription = async (subscriptionId, artistId, updateData) => {
    return await Subscription.findOneAndUpdate(
        { _id: subscriptionId, artist_id: artistId },
        { $set: updateData },
        { new: true, runValidators: true }
    )
        .populate('artist_id', 'first_name last_name email')
        .exec();
};

// Hủy subscription
const cancelSubscription = async (subscriptionId, artistId) => {
    return await Subscription.findOneAndUpdate(
        { _id: subscriptionId, artist_id: artistId, status: 'ACTIVE' },
        { $set: { status: 'CANCELLED', updated_at: new Date() } },
        { new: true }
    )
        .populate('artist_id', 'first_name last_name email')
        .exec();
};

// Lấy lịch sử subscription của artist
const getSubscriptionHistory = async (artistId, { page = 1, limit = 10 }) => {
    const subscriptions = await Subscription.find({ artist_id: artistId })
        .populate('artist_id', 'first_name last_name email')
        .sort({ created_at: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Subscription.countDocuments({ artist_id: artistId });

    return {
        subscriptions,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalCount: count
    };
};

module.exports = {
    getActiveSubscriptionByArtist,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    getSubscriptionHistory
};