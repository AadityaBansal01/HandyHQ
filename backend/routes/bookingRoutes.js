// routes/bookingRoutes.js — defines URL paths for booking APIs

const express = require('express');
const router = express.Router();
const { createBooking, respondToBooking } = require('../controllers/bookingController'); // CHANGED
const authorize = require('../middleware/roleMiddleware');

// protected route — must be logged in AND role must be 'customer'
router.post('/', protect, authorize('customer'), createBooking);

// :id in the URL is the booking's id — worker acts on ONE specific booking
router.put('/:id/respond', protect, authorize('worker'), respondToBooking);   // NEW

module.exports = router;