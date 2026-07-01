// controllers/adminController.js — logic behind admin APIs
// NOTE: there is no Admin model / no Admin collection in MongoDB —
// per your spec, admin credentials live only in .env, checked directly here

const generateToken = require('../utils/generateToken');

// POST /api/admin/login — checks .env credentials, issues a JWT with role: admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // straight string comparison against .env values — no bcrypt needed here
    // because there's no database row to hash/compare against, just one fixed pair of values
    const isValidEmail = email === process.env.ADMIN_EMAIL;
    const isValidPassword = password === process.env.ADMIN_PASSWORD;

    if (!isValidEmail || !isValidPassword) {
      // same generic message for both wrong cases — don't reveal which one was wrong
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // no "id" to put in the token since there's no admin document in the DB —
    // role: 'admin' alone is enough, since our roleMiddleware only ever checks the role field
    const token = generateToken({ role: 'admin' });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { loginAdmin };