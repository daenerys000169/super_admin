const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');
const chatController = require('../controllers/chatController');

router.post('/save', chatController.saveChat);
// Get all chat sessions
router.get('/sessions',authMiddleware,
    requireRole('admin'), chatController.getAllChats);

// Get chat session by ID
router.get('/sessions/:id',authMiddleware,
    requireRole('admin'), chatController.getChatById);

module.exports = router;
