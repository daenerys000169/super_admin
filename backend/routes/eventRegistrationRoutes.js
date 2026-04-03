// routes/eventRegistrationRoutes.js
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');
const eventRegistrationController = require('../controllers/eventRegistrationController');

// Public — submit event registration
router.post('/', eventRegistrationController.registerEvent);

// Admin Only — View all registrations
router.get('/all',
    authMiddleware,
    requireRole('admin'),
    eventRegistrationController.getAllEventRegistrations
);

// Admin Only — View registration by ID
router.get('/:id',
    authMiddleware,
    requireRole('admin'),
    eventRegistrationController.getEventRegistrationById
);

module.exports = router;
