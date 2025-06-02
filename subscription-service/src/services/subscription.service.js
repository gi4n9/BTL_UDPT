const subscriptionRepository = require('../repository/subscription.repository');

const getActiveSubscriptionByArtist = async (artistId) => {
    try {
        const subscription = await subscriptionRepository.getActiveSubscriptionByArtist(artistId);
        if (!subscription) {
            throw new Error('No active subscription found');
        }
        return subscription;
    } catch (err) {
        throw new Error(`Error fetching active subscription: ${err.message}`);
    }
};

const createSubscription = async (subscriptionData) => {
    try {
        if (!subscriptionData.artist_id || !subscriptionData.plan_type || !subscriptionData.start_date || !subscriptionData.end_date) {
            throw new Error('artist_id, plan_type, start_date, and end_date are required');
        }

        // Kiểm tra xem artist đã có subscription active chưa
        const existingSubscription = await subscriptionRepository.getActiveSubscriptionByArtist(subscriptionData.artist_id);
        if (existingSubscription) {
            throw new Error('Artist already has an active subscription');
        }

        return await subscriptionRepository.createSubscription(subscriptionData);
    } catch (err) {
        throw new Error(`Error creating subscription: ${err.message}`);
    }
};

const updateSubscription = async (subscriptionId, artistId, updateData) => {
    try {
        const subscription = await subscriptionRepository.updateSubscription(subscriptionId, artistId, updateData);
        if (!subscription) {
            throw new Error('Subscription not found or you lack permission');
        }
        return subscription;
    } catch (err) {
        throw new Error(`Error updating subscription: ${err.message}`);
    }
};

const cancelSubscription = async (subscriptionId, artistId) => {
    try {
        const subscription = await subscriptionRepository.cancelSubscription(subscriptionId, artistId);
        if (!subscription) {
            throw new Error('Subscription not found or cannot be cancelled');
        }
        return subscription;
    } catch (err) {
        throw new Error(`Error cancelling subscription: ${err.message}`);
    }
};

const getSubscriptionHistory = async (artistId, options = {}) => {
    try {
        const { page = 1, limit = 10 } = options;
        const validatedPage = Math.max(1, parseInt(page));
        const validatedLimit = Math.min(50, Math.max(1, parseInt(limit)));
        return await subscriptionRepository.getSubscriptionHistory(artistId, { page: validatedPage, limit: validatedLimit });
    } catch (err) {
        throw new Error(`Error fetching subscription history: ${err.message}`);
    }
};

module.exports = {
    getActiveSubscriptionByArtist,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    getSubscriptionHistory
};