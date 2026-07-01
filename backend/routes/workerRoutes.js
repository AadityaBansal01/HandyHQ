// routes/workerRoutes.js — defines URL paths for worker APIs

const express = require('express');
const router = express.Router();
const { registerWorker, loginWorker, updateWorkerProfile } = require('../controllers/workerController'); // CHANGED
const protect = require('../middleware/authMiddleware');       // NEW
const authorize = require('../middleware/roleMiddleware');     // NEW

// Register route: when POST request comes to /register, call registerWorker controller
router.post('/register', registerWorker);
router.post('/login', loginWorker);   // NEW
  


// protected route — must be logged in AND role must be 'worker'
router.put('/profile', protect, authorize('worker'), updateWorkerProfile);   // NEW


module.exports = router;