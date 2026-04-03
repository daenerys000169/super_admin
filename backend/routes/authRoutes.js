const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');
const { sendOTP, verifyOTP, register, login, getUserById, getAllUsers } = require('../controllers/authController');
const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', login);
router.get('/users', authMiddleware,
    requireRole('admin'), getAllUsers);
router.get('/users/:id', authMiddleware,
    requireRole('admin'), getUserById);
module.exports = router;
