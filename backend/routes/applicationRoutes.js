const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // multer config
const applicationController = require('../controllers/applicationController');
const requireRole = require('../middlewares/roleMiddleware');

// AUTOSAVE/UPSERT DRAFT (no files)
router.post('/applications/draft', upload.none(), applicationController.upsertDraft);


// GET USER'S DRAFT
router.get('/applications/draft/:userId', applicationController.getDraft);

// UPDATE EXISTING DRAFT BY ID
router.put('/applications/draft/:id', upload.none(), applicationController.updateDraft);


  router.patch(
    '/applications/submit/:id',
    upload.fields([
      { name: 'pitchDeck' }, { name: 'registrationCert' }, { name: 'panCard' },
      { name: 'gstCert' }, { name: 'msmeCert' }, { name: 'founderId' }
    ]),
    applicationController.finalizeDraft
  );

// 2. Admin-only routes

// Get all applications (ADMIN ONLY)
router.get(
  '/applications',authMiddleware,
  requireRole('admin'),
  applicationController.getAllApplications
);

// Get single application by ID (ADMIN ONLY)
router.get(
  '/applications/:id',authMiddleware,
  requireRole('admin'),
  applicationController.getApplicationById
);

// Update/Edit application by ID (ADMIN ONLY)
router.put(
  '/applications/:id',authMiddleware,
  requireRole('admin'),
  applicationController.updateApplicationById
);

module.exports = router;
