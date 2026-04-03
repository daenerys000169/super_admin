const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Subscription = sequelize.define('Subscription', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  planType: {
    type: DataTypes.ENUM('changemaker', 'impact_partner', 'empowerment_ally', 'growth_contributor', 'change_guardian'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR',
  },
  frequency: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'),
    defaultValue: 'monthly',
  },
  status: {
    type: DataTypes.ENUM('created', 'pending_payment', 'active', 'paused', 'cancelled', 'completed'),
    defaultValue: 'created',
  },
  razorpaySubscriptionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razorpayCustomerId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  currentStart: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  currentEnd: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  nextChargeAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'subscriptions',
  timestamps: true,
});

module.exports = Subscription;
