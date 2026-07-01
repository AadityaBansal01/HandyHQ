// routes/bookingRoutes.js — defines URL paths for booking APIs

const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// protected route — must be logged in AND role must be 'customer'
router.post('/', protect, authorize('customer'), createBooking);

module.exports = router;