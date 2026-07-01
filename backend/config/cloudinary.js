// config/cloudinary.js — sets up connection to Cloudinary
// we don't upload anything here yet — just configuring credentials
// so any file in the project can import this and use it to upload

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;