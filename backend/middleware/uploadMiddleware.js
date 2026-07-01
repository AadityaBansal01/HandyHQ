// middleware/uploadMiddleware.js — catches uploaded file before it goes to Cloudinary
// Multer is middleware that reads file uploads from a form (multipart/form-data requests) and makes the file available on req.file. Cloudinary can't directly read a raw HTTP upload — Multer catches it first, saves it briefly (memory or disk), then we hand it to Cloudinary.

const multer = require('multer');

// store file in memory temporarily (as a buffer) — we don't need to save it on disk
// since we immediately forward it to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

module.exports = upload;