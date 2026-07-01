// routes/bookingRoutes.js — defines URL paths for booking APIs

const express = require('express');
const router = express.Router();
const { createBooking, respondToBooking, startBooking, completeBooking } = require('../controllers/bookingController'); // CHANGED
const authorize = require('../middleware/roleMiddleware');
const protect = require('../middleware/authMiddleware');


// protected route — must be logged in AND role must be 'customer'
router.post('/', protect, authorize('customer'), createBooking);

// :id in the URL is the booking's id — worker acts on ONE specific booking
router.put('/:id/respond', protect, authorize('worker'), respondToBooking);   // NEW

router.put('/:id/start', protect, authorize('worker'), startBooking);       // NEW
router.put('/:id/complete', protect, authorize('worker'), completeBooking); // NEW

module.exports = router;