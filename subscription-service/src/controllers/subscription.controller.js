const subscriptionService = require('../services/subscription.service');

// Lấy subscription hiện tại của artist
const getMyActiveSubscription = async (req, res) => {
    try {
        const subscription = await subscriptionService.getActiveSubscriptionByArtist(req.user.id);
        res.status(200).json({
            success: true,
            message: 'Active subscription retrieved successfully',
            data: subscription
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
};

// Tạo subscription mới
const createSubscription = async (req, res) => {
    try {
        const subscriptionData = {
            ...req.body,
            artist_id: req.user.id
        };
        const newSubscription = await subscriptionService.createSubscription(subscriptionData);
        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: newSubscription
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// Cập nhật subscription
const updateSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid subscription ID' });
        }
        const updatedSubscription = await subscriptionService.updateSubscription(id, req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Subscription updated successfully',
            data: updatedSubscription
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// Hủy subscription
const cancelSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid subscription ID' });
        }
        const cancelledSubscription = await subscriptionService.cancelSubscription(id, req.user.id);
        res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully',
            data: cancelledSubscription
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// Lấy lịch sử subscription
const getMySubscriptionHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const history = await subscriptionService.getSubscriptionHistory(req.user.id, { page, limit });
        res.status(200).json({
            success: true,
            message: 'Subscription history retrieved successfully',
            data: history
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    getMyActiveSubscription,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    getMySubscriptionHistory
};