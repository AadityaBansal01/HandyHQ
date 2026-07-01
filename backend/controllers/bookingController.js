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


// PUT /api/bookings/:id/respond — worker accepts or rejects a booking (protected, worker only)
// example body: { "action": "accept" }  or  { "action": "reject" }
const respondToBooking = async (req, res) => {
  try {
    const { action } = req.body; // expects "accept" or "reject"

    if (!action || !['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'action must be either "accept" or "reject"' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // SECURITY CHECK — is this booking even assigned to the worker making this request?
    // without this, ANY logged-in worker could accept/reject someone else's booking
    if (booking.workerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'This booking is not assigned to you' });
    }

    // STATE CHECK — can only respond while it's still Requested
    // stops a worker from "accepting" a booking that's already InProgress or Cancelled
    if (booking.status !== 'Requested') {
      return res.status(400).json({ message: `Cannot respond — booking is already ${booking.status}` });
    }

    if (action === 'accept') {
      booking.status = 'Accepted';
    } else {
      // reject = a form of cancellation, so we reuse the same fields as a cancel
      booking.status = 'Cancelled';
      booking.cancellationBy = 'worker';
      booking.cancellationReason = 'Rejected by worker';
    }

    const updatedBooking = await booking.save();

    res.status(200).json({ booking: updatedBooking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/bookings/:id/start — worker marks an accepted booking as InProgress (protected, worker only)
const startBooking = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // same ownership check as respondToBooking — only the assigned worker can act on this booking
      if (booking.workerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'This booking is not assigned to you' });
      }
  
      // can only START a job that has been Accepted — not straight from Requested, not from InProgress again
      if (booking.status !== 'Accepted') {
        return res.status(400).json({ message: `Cannot start — booking is currently ${booking.status}` });
      }
  
      booking.status = 'InProgress';
      const updatedBooking = await booking.save();
  
      res.status(200).json({ booking: updatedBooking });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  // PUT /api/bookings/:id/complete — worker marks a job as Completed (protected, worker only)
  const completeBooking = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      if (booking.workerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'This booking is not assigned to you' });
      }
  
      // can only COMPLETE a job that is currently InProgress
      if (booking.status !== 'InProgress') {
        return res.status(400).json({ message: `Cannot complete — booking is currently ${booking.status}` });
      }
  
      booking.status = 'Completed';
      await booking.save();
  
      // MVP RULE from your spec: "On booking Completed: reset worker cancellationStreak to 0"
      // a successful completion is what "forgives" past cancellations — so we reset it here,
      // right at the moment a job finishes successfully
      const Worker = require('../models/Worker');
      await Worker.findByIdAndUpdate(booking.workerId, { cancellationStreak: 0 });
  
      res.status(200).json({ booking });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  module.exports = { createBooking, respondToBooking, startBooking, completeBooking };   // CHANGED
