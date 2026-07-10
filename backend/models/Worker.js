// models/Worker.js — defines what a "Worker" document looks like in MongoDB

const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true, // no two workers can share a phone number
  },
  alternatePhone: {
    type: String,
  },
  password: {
    type: String,
    required: true, // will store the HASHED password, never plain text
  },
  workType: {
    type: String,
    enum: ['Plumber', 'Electrician', 'Mechanic', 'Labourer', 'Carpenter', 'Painter', 'Other'],
    required: true,
  },
  profilePhoto: {
    type: String, // Cloudinary URL, set after upload
  },
  chargesType: {
    type: String,
    enum: ['per_hour', 'per_day', 'per_repair'],
  },
  chargesAmount: {
    type: Number,
  },
  // GeoJSON format — required by MongoDB for geospatial (nearby) search
  location: {
    type: {
      type: String,
      enum: ['Point'],
     
    },
    coordinates: {
      type: [Number], // [longitude, latitude] — this order matters for MongoDB
    },
  },
  serviceRadiusKm: {
    type: Number,
  },
  idDocumentType: {
    type: String,
    enum: ['Aadhar', 'VoterID', 'DrivingLicense', 'Passport'],
  },
  idDocumentNumber: {
    type: String, // plain text field, no file upload for this in MVP
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending',
  },
  ratingAverage: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  cancellationStreak: {
    type: Number,
    default: 0,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  suspendedUntil: {
    type: Date,
    default: null,
  },
}, { timestamps: true }); // timestamps auto-adds createdAt and updatedAt fields

// 2dsphere index — required by MongoDB to run "find nearby" geo queries on location field
workerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Worker', workerSchema);