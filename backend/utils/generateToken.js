// utils/generateToken.js — creates a signed JWT after login/register

const jwt = require('jsonwebtoken');

// payload = small object we want stored inside the token (id + role)
// token expires in 30 days — after that, user must log in again
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = generateToken;