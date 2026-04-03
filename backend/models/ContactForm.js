// models/ContactForm.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContactForm = sequelize.define('ContactForm', {
  name:       { type: DataTypes.STRING, allowNull: false },
  email:      { type: DataTypes.STRING, allowNull: false },
  message:    { type: DataTypes.TEXT,   allowNull: false },
}, {
  timestamps: true,
  tableName: 'contact_forms',
});

module.exports = ContactForm;
