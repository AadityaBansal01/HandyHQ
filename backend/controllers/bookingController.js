// controllers/bookingController.js — logic behind all booking lifecycle APIs
// this file will grow through Phase 4 — each function moves a booking
// exactly one step forward in the lifecycle we mapped out earlier

const Booking = require('../models/Booking');
const Worker = require('../models/Worker');

// POST /api/bookings — customer creates a new booking request (protected, customer only)
const createBooking = async (req, res) => {
  try {
    const { workerId, problemDescription, scheduledDate, scheduledTime } = req.body;

    // all four fields are required — no booking makes sense without them
    if (!workerId || !problemDescription || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        message: 'workerId, problemDescription, scheduledDate and scheduledTime are required',
      });
    }

    // fetch the worker — we need their workType (to copy onto booking)
    // and their suspension status (to block booking a suspended worker)
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    // suspended workers cannot receive new bookings — this is the rule from your spec
    if (worker.isSuspended) {
      return res.status(400).json({ message: 'This worker is currently suspended and cannot accept new bookings' });
    }

    // req.user.id is the CUSTOMER's id — comes from the JWT set by authMiddleware
    const booking = await Booking.create({
      customerId: req.user.id,
      workerId,
      workType: worker.workType, // copied at booking time — see note below
      problemDescription,
      scheduledDate,
      scheduledTime,
      // status defaults to 'Requested' automatically — no need to set it here
    });

    res.status(201).json({ booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createBooking };