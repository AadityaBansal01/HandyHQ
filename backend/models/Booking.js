// models/Booking.js — defines what a "Booking" document looks like in MongoDB
// this is the CENTER of the whole app — one booking moves through several
// statuses over its life, and every Phase 4 API just moves it one step forward
/* one Booking document moves through this exact chain, and its status field is the only thing that decides what buttons the frontend shows.
Concretely, once we build Phase 7/8 frontends:

Requested → sits in the worker's dashboard "New Requests" list. Worker sees Accept/Reject buttons only in this state.
Accepted → moves to worker's "Active Jobs" list. Worker sees a "Start Job" button only here.
InProgress → still in "Active Jobs", but now shows "Mark Complete" button instead.
Completed → disappears from worker's active list, moves to customer's booking history with a "Rate this booking" button — this button is the only UI element that even exists conditionally on status, since rating before Completed makes no sense.
Rated → final state, read-only, shows in both histories.
Cancelled → can branch off from Requested, Accepted, or InProgress (not from Completed — that would make no sense, job's already done). This is where the cancellation-streak/suspension logic hooks in, but only when it's the worker who cancels. */
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // WHO booked — link to the Customer who created this booking
  customerId: {
    type: mongoose.Schema.Types.ObjectId, // stores a reference (like a foreign key)
    ref: 'Customer',                       // tells Mongoose which model this id points to
    required: true,
  },

  // WHO is being booked — link to the Worker assigned to this job
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },

  // copied from the worker at booking time — kept simple, no need to look up worker just to know this
  workType: {
    type: String,
    required: true,
  },

  problemDescription: {
    type: String,
    required: true, // customer explains what needs fixing
  },

  scheduledDate: {
    type: Date,
    required: true,
  },

  scheduledTime: {
    type: String, // kept as plain string e.g. "14:30" — no timezone complexity for MVP
    required: true,
  },

  // THE CORE FIELD — this single value drives every button/screen in the frontend
  status: {
    type: String,
    enum: ['Requested', 'Accepted', 'InProgress', 'Completed', 'Rated', 'Cancelled'],
    default: 'Requested', // every booking starts here when customer creates it
  },

  // only filled in if status becomes 'Cancelled'
  cancellationBy: {
    type: String,
    enum: ['customer', 'worker'],
  },
  cancellationReason: {
    type: String,
  },

  // only filled in after customer rates — nested object, not a separate collection,
  // since a rating always belongs to exactly one booking and is never reused elsewhere
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
    },
  },
}, { timestamps: true }); // auto-adds createdAt (when booking was made) and updatedAt

module.exports = mongoose.model('Booking', bookingSchema);