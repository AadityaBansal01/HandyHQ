// config/db.js — handles connecting to MongoDB

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // mongoose.connect returns a promise — we wait for it
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    // stop the server if DB fails — no point running without a DB
    process.exit(1);
  }
};

module.exports = connectDB;