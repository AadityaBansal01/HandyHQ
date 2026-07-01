// routes/bookingRoutes.js — defines URL paths for booking APIs

const express = require('express');
const router = express.Router();
const {
    createBooking, respondToBooking, startBooking, completeBooking, cancelBookingByCustomer, cancelBookingByWorker, rateBooking, getWorkerBookings, getCustomerBookings  } = require('../controllers/bookingController');
const authorize = require('../middleware/roleMiddleware');
const protect = require('../middleware/authMiddleware');


// protected route — must be logged in AND role must be 'customer'
router.post('/', protect, authorize('customer'), createBooking);

// these two fixed-path routes must stay ABOVE any "/:id" style route we might add later —
// same ordering rule we learned back in the worker search vs get-by-id step
router.get('/worker', protect, authorize('worker'), getWorkerBookings);       // NEW
router.get('/customer', protect, authorize('customer'), getCustomerBookings); // NEW

// :id in the URL is the booking's id — worker acts on ONE specific booking
router.put('/:id/respond', protect, authorize('worker'), respondToBooking);   // NEW

router.put('/:id/start', protect, authorize('worker'), startBooking);       // NEW
router.put('/:id/complete', protect, authorize('worker'), completeBooking); // NEW

router.put('/:id/cancel-by-customer', protect, authorize('customer'), cancelBookingByCustomer);   // NEW
router.put('/:id/cancel-by-worker', protect, authorize('worker'), cancelBookingByWorker);   // NEW

module.exports = router;