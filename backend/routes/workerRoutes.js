// routes/workerRoutes.js — defines URL paths for worker APIs

const express = require('express');
const router = express.Router();
const { registerWorker, loginWorker, updateWorkerProfile, uploadProfilePhoto, searchWorkers } = require('../controllers/workerController'); // CHANGED
const protect = require('../middleware/authMiddleware');       // NEW
const authorize = require('../middleware/roleMiddleware');     // NEW
const upload = require('../middleware/uploadMiddleware');   // NEW

// Register route: when POST request comes to /register, call registerWorker controller
router.post('/register', registerWorker);
router.post('/login', loginWorker);   // NEW
router.put('/profile', protect, authorize('worker'), updateWorkerProfile);


// upload.single('photo') reads ONE file from a form field named "photo"
router.put('/profile-photo', protect, authorize('worker'), upload.single('photo'), uploadProfilePhoto);   // NEW

// public route — no login needed to search, so customers can browse before signing up
router.get('/search', searchWorkers);   // NEW

module.exports = router;