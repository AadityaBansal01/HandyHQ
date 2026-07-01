// routes/adminRoutes.js — defines URL paths for admin APIs

const express = require('express');
const router = express.Router();
const { loginAdmin, getPendingWorkers, approveWorker, rejectWorker } = require('../controllers/adminController'); // CHANGED

router.post('/login', loginAdmin);

// all routes below require a valid token AND role must be 'admin'
router.get('/pending-workers', protect, authorize('admin'), getPendingWorkers);        // NEW
router.put('/workers/:id/approve', protect, authorize('admin'), approveWorker);        // NEW
router.put('/workers/:id/reject', protect, authorize('admin'), rejectWorker);  



module.exports = router;