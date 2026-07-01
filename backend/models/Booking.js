// models/Booking.js — defines what a "Booking" document looks like in MongoDB
// this is the CENTER of the whole app — one booking moves through several
// statuses over its life, and every Phase 4 API just moves it one step forward

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