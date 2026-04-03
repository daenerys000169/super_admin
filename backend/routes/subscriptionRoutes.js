// routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const {
  createSubscription,
  verifyPayment,
  handleWebhook,
  getSubscription,
  cancelSubscription,
  getAllSubscriptions,
  activateSubscription
} = require('../controllers/subscriptionController');

// Route for creating subscription
router.post('/', createSubscription);

// Route for payment verification
router.post('/verify-payment', verifyPayment);

// Route for Razorpay webhooks
router.post('/webhook', handleWebhook);

// Route for getting subscription details
router.get('/:id', getSubscription);

// Route for cancelling subscription
router.put('/:id/cancel', cancelSubscription);

// Route for activating subscription (admin)
router.put('/:id/activate', activateSubscription);

// Route for getting all subscriptions (admin)
router.get('/', getAllSubscriptions);

module.exports = router;
