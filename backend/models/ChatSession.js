const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ChatSession = sequelize.define('ChatSession', {
  name:          { type: DataTypes.STRING, allowNull: false },
  contactNo:     { type: DataTypes.STRING, allowNull: false },
  email:         { type: DataTypes.STRING, allowNull: false },
  organisation:  { type: DataTypes.STRING, allowNull: false },
  address:       { type: DataTypes.STRING, allowNull: false },
  category:      { type: DataTypes.STRING, allowNull: false },
  sector:        { type: DataTypes.STRING, allowNull: false },
  website:       { type: DataTypes.STRING, allowNull: true },
  stage:         { type: DataTypes.STRING, allowNull: false },
  otherSupport:  { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true,
    tableName: 'chat_sessions'
 });

module.exports = ChatSession;
