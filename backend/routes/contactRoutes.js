// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');
const contactController = require('../controllers/contactController');

// Your API endpoint could be: /api/contact
router.post('/', contactController.saveContact);
router.get('/contactForms',authMiddleware,
    requireRole('admin'), contactController.getAllContacts);
router.get('/contactForms/:id',authMiddleware,
    requireRole('admin'), contactController.getContactById);
module.exports = router;
