// controllers/adminController.js — logic behind admin APIs
// NOTE: there is no Admin model / no Admin collection in MongoDB —
// per your spec, admin credentials live only in .env, checked directly here

const generateToken = require('../utils/generateToken');
const Worker = require('../models/Worker');   // NEW — needed to query/update workers below

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

// GET /api/admin/pending-workers — admin sees all workers waiting for verification (protected, admin only)
// example call: /api/admin/pending-workers?page=1&limit=10
const getPendingWorkers = async (req, res) => {
    try {
      // query params always arrive as strings, so convert to real numbers with defaults
      const { page = 1, limit = 10 } = req.query;
  
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
  
      // only workers still waiting on a decision — Verified/Rejected workers don't belong in this queue
      const filter = { verificationStatus: 'Pending' };
  
      const workers = await Worker.find(filter)
        .select('-password')       // never send password hash to admin either
        .sort({ createdAt: 1 })    // oldest FIRST — so the admin clears the longest-waiting workers first
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);
  
      // total count of ALL pending workers (ignoring pagination) — needed for "Page 1 of X" on frontend
      const totalPending = await Worker.countDocuments(filter);
  
      res.status(200).json({
        page: pageNum,
        limit: limitNum,
        totalPending,
        totalPages: Math.ceil(totalPending / limitNum),
        workers,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  // PUT /api/admin/workers/:id/approve — admin approves one worker (protected, admin only)
  const approveWorker = async (req, res) => {
    try {
      const worker = await Worker.findById(req.params.id);
      if (!worker) {
        return res.status(404).json({ message: 'Worker not found' });
      }
  
      // STATE CHECK — only makes sense to approve a worker who's still Pending
      // stops admin from accidentally re-approving an already-Verified/Rejected worker
      if (worker.verificationStatus !== 'Pending') {
        return res.status(400).json({ message: `Cannot approve — worker is already ${worker.verificationStatus}` });
      }
  
      worker.verificationStatus = 'Verified';
      await worker.save();
  
      res.status(200).json({ message: 'Worker approved', worker });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  // PUT /api/admin/workers/:id/reject — admin rejects one worker (protected, admin only)
  const rejectWorker = async (req, res) => {
    try {
      const worker = await Worker.findById(req.params.id);
      if (!worker) {
        return res.status(404).json({ message: 'Worker not found' });
      }
  
      if (worker.verificationStatus !== 'Pending') {
        return res.status(400).json({ message: `Cannot reject — worker is already ${worker.verificationStatus}` });
      }
  
      worker.verificationStatus = 'Rejected';
      await worker.save();
  
      res.status(200).json({ message: 'Worker rejected', worker });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  module.exports = { loginAdmin, getPendingWorkers, approveWorker, rejectWorker };   // CHANGED