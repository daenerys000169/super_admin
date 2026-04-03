// models/Application.js
const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db');

const Application = sequelize.define('Application', {
  applicationId: { type: DataTypes.STRING, unique: true, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  mobile: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  companyName: { type: DataTypes.STRING, allowNull: false },
  entityType: { type: DataTypes.STRING, allowNull: false },
  incorporationDate: { type: DataTypes.DATE },
  registrationNumber: { type: DataTypes.STRING },
  registeredAddress: { type: DataTypes.STRING },
  scheme: { type: DataTypes.STRING, allowNull: false },
  sectors: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  otherSector: { type: DataTypes.STRING, allowNull: true },
  foundersDetails: { type: DataTypes.TEXT },
  teamMembers: { type: DataTypes.TEXT },
  businessDescription: { type: DataTypes.TEXT },
  problemSolving: { type: DataTypes.TEXT },
  targetAudience: { type: DataTypes.TEXT },
  revenueModel: { type: DataTypes.TEXT },
  currentStage: { type: DataTypes.STRING },
  pitchDeck: { type: DataTypes.STRING },
  registrationCert: { type: DataTypes.STRING },
  panCard: { type: DataTypes.STRING },
  gstCert: { type: DataTypes.STRING },
  msmeCert: { type: DataTypes.STRING },
  founderId: { type: DataTypes.STRING },
  previousFunding: { type: DataTypes.STRING },
  previousFundingDetails: { type: DataTypes.TEXT },
  fundingAmount: { type: DataTypes.STRING },
  fundingPurpose: { type: DataTypes.TEXT },
  interestedSupport: { type: DataTypes.JSON, defaultValue: [] },
  otherSupport: { type: DataTypes.STRING, allowNull: true },
  website: { type: DataTypes.STRING },
  socialMedia: { type: DataTypes.STRING },
  awards: { type: DataTypes.TEXT },
  hearAboutUs: { type: DataTypes.STRING },
  isDraft: { type: DataTypes.TINYINT, defaultValue: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  timestamps: true, // recommended for autosave
});

// Hook to generate applicationId in format SYG/<YEAR>/<SEQ>
Application.beforeValidate(async (application) => {
  if (!application.applicationId) {
   
    const year = new Date().getFullYear();
    const prefix = `SYG/${year}/`;

    const lastApp = await Application.findOne({
      where: {
        applicationId: { [Op.like]: `${prefix}%` }
      },
      order: [['createdAt', 'DESC']]
    });

    let nextSeq = 1;
    if (lastApp?.applicationId) {
      const lastSeqStr = lastApp.applicationId.split('/').pop();
      const lastSeqNum = parseInt(lastSeqStr, 10);
      if (!isNaN(lastSeqNum)) {
        nextSeq = lastSeqNum + 1;
      }
    }

    application.applicationId = `${prefix}${String(nextSeq).padStart(3, '0')}`;
    
  }
});

module.exports = Application;
