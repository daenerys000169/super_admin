// controllers/eventRegistrationController.js
const EventRegistration = require('../models/EventRegistration');
const { sendEventRegistrationMail } = require('../utils/sendEventRegistrationMail');

exports.registerEvent = async (req, res) => {
  try {
    const {
      name,
      contact,
      email,
      numberOfAttendees,
      willJoin,
      eventId,
      eventTitle,
      heardAboutFrom
    } = req.body;

    if (!name || !contact || !email || !numberOfAttendees || !willJoin || !eventId || !eventTitle || !heardAboutFrom) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const registration = await EventRegistration.create({
      name,
      contact,
      email,
      numberOfAttendees,
      willJoin,
      eventId,
      eventTitle,
      heardAboutFrom
    });

    // Send successful registration email
    try {
      await sendEventRegistrationMail(email, name, numberOfAttendees);
    } catch (mailError) {
      console.error("Failed to send registration email:", mailError);
      // We don't return here as the registration was successful in DB
    }

    res.status(201).json({
      message: 'Event registration submitted successfully!',
      id: registration.id,
    });

  } catch (error) {
    console.error("Error saving event registration:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

// Admin: Get all event registrations
exports.getAllEventRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(registrations);
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    res.status(500).json({ message: "Server error fetching event registrations" });
  }
};

// Admin: Get registration by ID
exports.getEventRegistrationById = async (req, res) => {
  try {
    const registration = await EventRegistration.findByPk(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Event registration not found' });
    }
    res.json(registration);
  } catch (error) {
    console.error("Error fetching event registration:", error);
    res.status(500).json({ message: "Server error fetching event registration" });
  }
};
