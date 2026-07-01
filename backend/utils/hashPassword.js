// utils/hashPassword.js — two small helpers for password security

const bcrypt = require('bcryptjs');

// turns plain password into a scrambled hash before saving to DB
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10); // "10" = how strong the scrambling is
  return bcrypt.hash(plainPassword, salt);
};

// compares a login attempt's plain password against the stored hash
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };