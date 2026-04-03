// routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const {
  createDonation,
  createOrder,
  verifyPayment
} = require('../controllers/donationController');

// Route for saving donation data
router.post('/', createDonation);

// Route for Razorpay order creation
router.post('/create-order', createOrder);

// Route for payment verification
router.post('/verify-payment', verifyPayment);

module.exports = router;
