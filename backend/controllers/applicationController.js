require('dotenv').config();
const sequelize = require('../config/db');
const Application = require('../models/Application');
const uploadToS3 = require('../utils/uploadToS3');
const { Op } = require('sequelize');
const { sendSuccessfulApplicationMail } = require('../utils/sendSuccessfulApplicationMail');

async function generateApplicationId(transaction) {
  const prefix = 'SYG';
  const year = new Date().getFullYear();

  // Find the max numeric suffix from existing applicationIds in the current year
  // e.g., SYG/2025/0001, SYG/2025/0002 etc

  // Extract numeric suffix using raw query or Sequelize
  const latestApplication = await Application.findOne({
    where: {
      applicationId: {
        [Op.like]: `${prefix}/${year}/%`
      }
    },
    order: [['createdAt', 'DESC']],
    transaction
  });

  let nextNumber = 1;
  if (latestApplication && latestApplication.applicationId) {
    const parts = latestApplication.applicationId.split('/');
    const lastNumStr = parts[2];
    const lastNum = parseInt(lastNumStr, 10);
    if (!isNaN(lastNum)) {
      nextNumber = lastNum + 1;
    }
  }

  // Pad number to fixed length (e.g., 4 digits)
  const nextNumPadded = String(nextNumber).padStart(4, '0');

  return `${prefix}/${year}/${nextNumPadded}`; // e.g. SYG/2025/0003
}

// Function to send confirmation email
// async function sendSubmissionConfirmationEmail(toEmail, name, applicationNumber) {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: toEmail,
//     subject: 'Application Successfully Received - Startup Yogdan Foundation',
//     text: `
// Hi ${name},

// Thank you for your submission to Startup Yogdan Foundation.

// We’re happy to inform you that your application has been successfully received.

// Your Application Number: ${applicationNumber}

// Our team is currently reviewing your application, and we’ll update you on the status shortly.

// If you have any questions in the meantime, feel free to reach out to us.

// Best regards,
// Team Startup Yogdan Foundation
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// }



const parseSafeArray = (value) => {
  if (!value) return [];
  
  if (Array.isArray(value)) {
    return value;
  }
  
  if (typeof value === 'string') {
    if (value.startsWith('[') || value.startsWith('"')) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return [value];
      }
    } else {
      return [value];
    }
  }
  
  return [];
};


// 1. AUTOSAVE/UPSERT DRAFT
exports.upsertDraft = async (req, res) => {
  try {
    const { userId, scheme, ...fields } = req.body; // Added scheme to destructuring
    const sectors = parseSafeArray(fields.sectors);
    const interestedSupport = parseSafeArray(fields.interestedSupport);
    
    let draft = await Application.findOne({ where: { userId, isDraft: true } });
    if (draft) {
      await draft.update({ ...fields, scheme, sectors, interestedSupport });
    } else {
      const applicationId = await generateApplicationId();
      draft = await Application.create({ 
        ...fields, 
        userId, 
        scheme, 
        isDraft: true, 
        applicationId, 
        sectors, 
        interestedSupport 
      });
    }
    res.json({ draftId: draft.id, applicationId: draft.applicationId, message: "Draft autosaved" });
  } catch (err) {
    console.error('Error saving draft:', err); // Added logging
    res.status(500).json({ error: "Draft save failed", details: err.message });
  }
};


// 2. GET USER'S DRAFT
exports.getDraft = async (req, res) => {
  const { userId } = req.params;
  console.log("getDraft called for userId:", userId);
  if (!userId) {
    return res.status(400).json({ error: "userId parameter missing" });
  }

  try {
    const draft = await Application.findOne({ where: { userId, isDraft: true } });
    return res.json(draft || null);
  } catch (err) {
    console.error("Error fetching draft:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


// 4. FINALIZE A DRAFT INTO FINAL SUBMISSION (update + handle files)
exports.finalizeDraft = async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();
  
  try {
    console.log('=== FINALIZE DRAFT DEBUG ===');
    console.log('Draft ID:', id);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    // Check if draft exists first
    const existingDraft = await Application.findOne({
      where: { id: id, isDraft: true },
      transaction
    });
    
    if (!existingDraft) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Draft not found or already submitted' });
    }
    
    const { scheme, ...fields } = req.body; // Extract scheme properly
    const sectors = parseSafeArray(fields.sectors);
    const interestedSupport = parseSafeArray(fields.interestedSupport);

    const files = req.files || {};
    const uploadedFileUrls = {};
    const fileFields = ['pitchDeck', 'registrationCert', 'panCard', 'gstCert', 'msmeCert', 'founderId'];
    
    // Upload files with error handling
    for (const field of fileFields) {
      if (files[field]?.[0]) {
        try {
          const file = files[field][0];
          console.log(`Uploading file for field: ${field}`, file.originalname);
          const url = await uploadToS3(file.buffer, file.originalname, file.mimetype);
          uploadedFileUrls[field] = url;
          console.log(`Successfully uploaded ${field}:`, url);
        } catch (uploadError) {
          console.error(`Failed to upload ${field}:`, uploadError);
          await transaction.rollback();
          return res.status(500).json({ 
            error: `File upload failed for ${field}`, 
            details: uploadError.message 
          });
        }
      }
    }

    // Update the application
    const updateData = { 
      ...fields, 
      sectors, 
      interestedSupport, 
      ...uploadedFileUrls, 
      isDraft: false 
    };
    
    // Add scheme only if it exists
    if (scheme !== undefined) {
      updateData.scheme = scheme;
    }
    
    console.log('Update data:', updateData);
    
    await Application.update(updateData, { 
      where: { id }, 
      transaction 
    });

    // Commit transaction
    await transaction.commit();
    console.log('Transaction committed successfully');

    // Fetch the updated application
    const application = await Application.findByPk(id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found after update' });
    }

    // Send email if details are available
    if (application.email && application.fullName) {
      try {
        await sendSuccessfulApplicationMail(
          application.email, 
          application.fullName, 
          application.applicationId
        );
        console.log('Confirmation email sent successfully');
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the entire operation for email issues
      }
    }

    res.json({ 
      message: 'Application finalized and submitted!', 
      applicationId: application.applicationId 
    });
    
  } catch (err) {
    console.error('=== FINALIZE DRAFT ERROR ===');
    console.error('Error details:', err);
    console.error('Error stack:', err.stack);
    
    await transaction.rollback();
    res.status(500).json({ 
      error: 'Failed to finalize application',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};




exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findByPk(req.params.id); // Changed from findById
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    console.error('Error fetching application:', err); // Added logging
    res.status(500).json({ error: err.message });
  }
};

exports.updateApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    
    // Use Sequelize update method instead of MongoDB-style findByIdAndUpdate
    const [updatedCount] = await Application.update(updateFields, {
      where: { id: id },
      returning: true // For PostgreSQL, returns the updated records
    });
    
    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Fetch the updated record
    const updatedApp = await Application.findByPk(id);
    res.json({ message: 'Application updated', application: updatedApp });
  } catch (err) {
    console.error('Error updating application:', err); // Added logging
    res.status(500).json({ error: err.message });
  }
};

// controllers/applicationController.js
exports.getAllApplications = async (req, res) => {
  console.log('GET /api/applications hit');
  try {
    const applications = await Application.findAll();
    res.json(applications);
    
    
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: err.message });
  }
};



// 3. UPDATE EXISTING DRAFT BY ID
exports.updateDraft = async (req, res) => {
  const { id } = req.params;
  
  try {
    const { userId, scheme, ...fields } = req.body;
    
    // Parse array fields if sent as strings
    const sectors = parseSafeArray(fields.sectors);
    const interestedSupport = parseSafeArray(fields.interestedSupport);
    
    // Find the draft belonging to this user
    const draft = await Application.findOne({ 
      where: { 
        id: id, 
        userId: userId, 
        isDraft: true 
      } 
    });
    
    if (!draft) {
      return res.status(404).json({ error: "Draft not found or doesn't belong to this user" });
    }
    
    // Update the draft
    await draft.update({ ...fields, scheme, sectors, interestedSupport });
    
    res.json({ 
      draftId: draft.id, 
      applicationId: draft.applicationId, 
      message: "Draft updated successfully" 
    });
    
  } catch (err) {
    console.error('Error updating draft:', err);
    res.status(500).json({ error: "Draft update failed", details: err.message });
  }
};