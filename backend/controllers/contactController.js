// controllers/contactController.js
const ContactForm = require('../models/ContactForm');

exports.saveContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const contact = await ContactForm.create({ name, email, message });
    res.status(201).json({ message: 'Contact form submitted', id: contact.id });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get all contact form submissions
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactForm.findAll({
      order: [['createdAt', 'DESC']] // latest first
    });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contact forms:', error);
    res.status(500).json({ message: 'Server error fetching contact forms' });
  }
};

// Get a specific contact submission by ID
exports.getContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await ContactForm.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact form entry not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error(`Error fetching contact form with id ${id}:`, error);
    res.status(500).json({ message: 'Server error fetching contact form entry' });
  }
};

