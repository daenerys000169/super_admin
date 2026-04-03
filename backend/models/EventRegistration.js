// models/EventRegistration.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EventRegistration = sequelize.define('EventRegistration', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numberOfAttendees: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  willJoin: {
    type: DataTypes.ENUM('yes', 'no', 'maybe'),
    allowNull: false,
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  eventTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  heardAboutFrom: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: 'event_registrations',
});

module.exports = EventRegistration;
