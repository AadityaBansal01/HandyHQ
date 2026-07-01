// controllers/workerController.js — the actual logic behind worker APIs

const Worker = require('../models/Worker');
const { hashPassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

// POST /api/workers/register
const registerWorker = async (req, res) => {
  try {
    const { name, phone, password, workType } = req.body;

    // basic required-field check before touching the DB
    if (!name || !phone || !password || !workType) {
      return res.status(400).json({ message: 'Name, phone, password and workType are required' });
    }

    // check phone isn't already used
    const existingWorker = await Worker.findOne({ phone });
    if (existingWorker) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // never save plain password — hash it first
    const hashedPassword = await hashPassword(password);

    // Create new worker document in MongoDB
    const worker = await Worker.create({
      name,
      phone,
      password: hashedPassword,
      workType,
    });

    // sign a token so worker is logged in right after registering
    const token = generateToken({ id: worker._id, role: 'worker' });
    
    // Send response to frontend
    res.status(201).json({
      token,
      worker: {
        id: worker._id,
        name: worker.name,
        phone: worker.phone,
        workType: worker.workType,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { registerWorker };