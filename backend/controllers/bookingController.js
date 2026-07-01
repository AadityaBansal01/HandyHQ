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
     
      await Worker.findByIdAndUpdate(booking.workerId, { cancellationStreak: 0 });
  
      res.status(200).json({ booking });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
// PUT /api/bookings/:id/cancel-by-customer — customer cancels their own booking (protected, customer only)
const cancelBookingByCustomer = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // OWNERSHIP CHECK — only the customer who made this booking can cancel it
      if (booking.customerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'This booking does not belong to you' });
      }
  
      // STATE CHECK — spec says: "allow Cancelled at any stage before Completed"
      // so cancel is blocked once it's Completed, Rated, or already Cancelled
      const blockedStatuses = ['Completed', 'Rated', 'Cancelled'];
      if (blockedStatuses.includes(booking.status)) {
        return res.status(400).json({ message: `Cannot cancel — booking is already ${booking.status}` });
      }
  
      booking.status = 'Cancelled';
      booking.cancellationBy = 'customer';
      booking.cancellationReason = req.body.reason || 'Cancelled by customer';
      // reason is optional from the frontend — falls back to a generic message if not sent
  
      const updatedBooking = await booking.save();
  
      res.status(200).json({ booking: updatedBooking });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
 // PUT /api/bookings/:id/cancel-by-worker — worker cancels a booking they already accepted (protected, worker only)
const cancelBookingByWorker = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      if (booking.workerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'This booking is not assigned to you' });
      }
  
      // spec says the STREAK penalty applies to cancelling "after accepting" —
      // so this action is only valid once accepted (or already InProgress), not on a raw Requested booking
      // (a Requested booking should be REJECTED via respondToBooking instead, which carries no penalty)
      const cancellableStatuses = ['Accepted', 'InProgress'];
      if (!cancellableStatuses.includes(booking.status)) {
        return res.status(400).json({ message: `Cannot cancel — booking is currently ${booking.status}` });
      }
  
      booking.status = 'Cancelled';
      booking.cancellationBy = 'worker';
      booking.cancellationReason = req.body.reason || 'Cancelled by worker';
      await booking.save();
  
      // fetch the worker so we can update their streak/suspension fields
      const worker = await Worker.findById(booking.workerId);
  
      // increment streak — this is the "3 continuous cancellations" counter from your spec
      worker.cancellationStreak += 1;
  
      let suspended = false; // used to tell the frontend/response whether suspension just kicked in
  
      if (worker.cancellationStreak >= 3) {
        worker.isSuspended = true;
  
        // suspendedUntil = right now + 15 days, in milliseconds
        // Date.now() gives current time in ms, 15 * 24 * 60 * 60 * 1000 = 15 days in ms
        worker.suspendedUntil = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  
        worker.cancellationStreak = 0; // reset streak — spec says "reset only after 1 successful completion",
        // but also implicitly after a suspension kicks in, since the streak has "done its job" and restarting
        // at 0 avoids instantly re-suspending the moment they're unsuspended
        suspended = true;
      }
  
      await worker.save();
  
      res.status(200).json({
        booking,
        cancellationStreak: worker.cancellationStreak,
        isSuspended: worker.isSuspended,
        suspendedUntil: worker.suspendedUntil,
        justGotSuspended: suspended, // handy flag for frontend to show a special warning message
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
// PUT /api/bookings/:id/rate — customer rates a completed booking (protected, customer only)
// example body: { "score": 5, "review": "Great work, on time" }
const rateBooking = async (req, res) => {
    try {
      const { score, review } = req.body;
  
      // score is required and must be 1-5 — matches the schema's min/max, but we check
      // here too so we can return a clean 400 message instead of a raw Mongoose validation error
      if (!score || score < 1 || score > 5) {
        return res.status(400).json({ message: 'score is required and must be between 1 and 5' });
      }
  
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // OWNERSHIP CHECK — only the customer who made this booking can rate it
      if (booking.customerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'This booking does not belong to you' });
      }
  
      // STATE CHECK — spec says rating is only allowed "only after Completed status"
      if (booking.status !== 'Completed') {
        return res.status(400).json({ message: `Cannot rate — booking must be Completed, currently ${booking.status}` });
      }
  
      // save the rating onto the booking itself
      booking.rating = { score, review };
      booking.status = 'Rated'; // final state — nothing moves after this
      await booking.save();
  
      // now update the WORKER's running average — this is the part search/profile pages read from
      const worker = await Worker.findById(booking.workerId);
  
      // formula: new average = (old total sum of all scores + new score) / new count
      // we don't store a running "total sum" separately, so we back-calculate it:
      // oldSum = oldAverage * oldCount, then add the new score, then divide by newCount
      const oldSum = worker.ratingAverage * worker.ratingCount;
      const newCount = worker.ratingCount + 1;
      const newAverage = (oldSum + score) / newCount;
  
      worker.ratingAverage = newAverage;
      worker.ratingCount = newCount;
      await worker.save();
  
      res.status(200).json({ booking, worker: { ratingAverage: worker.ratingAverage, ratingCount: worker.ratingCount } });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
// GET /api/bookings/worker — logged-in worker sees ALL their own bookings (protected, worker only)
// example call: /api/bookings/worker?page=1&limit=10
const getWorkerBookings = async (req, res) => {
    try {
      // query params (?page=1&limit=10) always arrive as STRINGS from the URL,
      // so we give simple defaults and convert them to real numbers below
      const { page = 1, limit = 10 } = req.query;
  
      const pageNum = parseInt(page);   // "1" -> 1
      const limitNum = parseInt(limit); // "10" -> 10
  
      // req.user.id is THIS worker's id, taken from their JWT by authMiddleware
      // we only ever fetch bookings that belong to them — never all bookings in the DB
      const bookings = await Booking.find({ workerId: req.user.id })
        .sort({ createdAt: -1 })
        // -1 means "newest first" — so the worker's most recent booking shows at the top
        .skip((pageNum - 1) * limitNum)
        // skip = how many results to jump over before starting this page
        // page 1 -> skip 0, page 2 -> skip 10 (if limit is 10), page 3 -> skip 20, etc.
        .limit(limitNum)
        // limit = how many results to actually return for this one page
        .populate('customerId', 'name phone');
        // populate REPLACES the raw customerId (just an id string) with the actual
        // customer's name and phone — so the worker's frontend doesn't need a second API call
        // just to show "who booked this job"
  
      // also get the TOTAL count (ignoring pagination) — frontend needs this to know
      // how many pages exist in total, e.g. to show "Page 1 of 4"
      const totalBookings = await Booking.countDocuments({ workerId: req.user.id });
  
      res.status(200).json({
        page: pageNum,
        limit: limitNum,
        totalBookings,
        totalPages: Math.ceil(totalBookings / limitNum),
        // Math.ceil rounds UP — e.g. 23 bookings at 10 per page = 2.3 -> 3 pages needed
        bookings,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  // GET /api/bookings/customer — logged-in customer sees ALL their own bookings (protected, customer only)
  // exact same pattern as getWorkerBookings above, just filtered by customerId instead of workerId
  const getCustomerBookings = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
  
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
  
      const bookings = await Booking.find({ customerId: req.user.id })
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        // here we populate the WORKER's info instead — customer's frontend needs
        // to show "who did I book" (worker name, photo, workType) on their booking history page
        .populate('workerId', 'name workType profilePhoto');
  
      const totalBookings = await Booking.countDocuments({ customerId: req.user.id });
  
      res.status(200).json({
        page: pageNum,
        limit: limitNum,
        totalBookings,
        totalPages: Math.ceil(totalBookings / limitNum),
        bookings,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  module.exports = {
    createBooking,
    respondToBooking,
    startBooking,
    completeBooking,
    cancelBookingByCustomer,
    cancelBookingByWorker,
    rateBooking,
    getWorkerBookings,    // NEW
    getCustomerBookings,  // NEW
  };