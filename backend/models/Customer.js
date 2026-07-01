// models/Customer.js — defines what a "Customer" document looks like in MongoDB
// same pattern as Worker.js — if you understood that file, this one is easier

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true, // no two customers can share a phone number
  },
  email: {
    type: String, // optional — spec says optional, so no "required" here
  },
  password: {
    type: String,
    required: true, // stores HASHED password, same as Worker
  },
  profilePhoto: {
    type: String, // Cloudinary URL, optional — set later if customer uploads one
  },
}, { timestamps: true }); // auto-adds createdAt and updatedAt

module.exports = mongoose.model('Customer', customerSchema);