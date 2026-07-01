// routes/workerRoutes.js — defines URL paths for worker APIs

const express = require('express');
const router = express.Router();
const { registerWorker } = require('../controllers/workerController');


// Register route: when POST request comes to /register, call registerWorker controller
router.post('/register', registerWorker);

module.exports = router;