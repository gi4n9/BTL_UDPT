const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { authenticateToken } = require('../../middlewares/auth');

// Các endpoint yêu cầu xác thực
router.get('/active', authenticateToken, subscriptionController.getMyActiveSubscription);
router.get('/history', authenticateToken, subscriptionController.getMySubscriptionHistory);
router.post('/', authenticateToken, subscriptionController.createSubscription);
router.put('/:id', authenticateToken, subscriptionController.updateSubscription);
router.delete('/:id', authenticateToken, subscriptionController.cancelSubscription);

module.exports = router;