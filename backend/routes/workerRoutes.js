// routes/workerRoutes.js — defines URL paths for worker APIs

const express = require('express');
const router = express.Router();
const { registerWorker, loginWorker } = require('../controllers/workerController'); // CHANGED


// Register route: when POST request comes to /register, call registerWorker controller
router.post('/register', registerWorker);
router.post('/login', loginWorker);   // NEW

module.exports = router;