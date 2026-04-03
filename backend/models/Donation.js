const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Donation = sequelize.define('Donation', {
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
    allowNull: true, // Email is optional
    validate: {
      isEmail: true, // Optional but if provided, must be valid
    },
  },
  pan: {
    type: DataTypes.STRING,
    allowNull: true, // PAN is optional
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // campaign: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
}, {
  tableName: 'donations',
  timestamps: false,
});

module.exports = Donation;

// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Donation = sequelize.define('Donation', {
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   contact: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   pan: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   amount: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false,
//   },
//   payment_id: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
// }, {
//   tableName: 'donations',
//   timestamps: false,
// });

// module.exports = Donation;
