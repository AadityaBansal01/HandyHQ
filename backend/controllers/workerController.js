// controllers/workerController.js — the actual logic behind worker APIs

const Worker = require('../models/Worker');
const { hashPassword, comparePassword } = require('../utils/hashPassword'); // CHANGED — added comparePassword
const generateToken = require('../utils/generateToken');
const cloudinary = require('../config/cloudinary');

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


// POST /api/workers/login — NEW
const loginWorker = async (req, res) => {
    try {
      const { phone, password } = req.body;
  
      if (!phone || !password) {
        return res.status(400).json({ message: 'Phone and password are required' });
      }
  
      // find worker by phone
      const worker = await Worker.findOne({ phone });
      if (!worker) {
        return res.status(400).json({ message: 'Invalid phone or password' });
      }
  
      // compare typed password against stored hash
      const isMatch = await comparePassword(password, worker.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid phone or password' });
      }
  
      const token = generateToken({ id: worker._id, role: 'worker' });
  
      res.status(200).json({
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
  
// PUT /api/workers/profile — worker updates their own profile (protected route)
const updateWorkerProfile = async (req, res) => {
    try {
      // req.user.id comes from the JWT — set by authMiddleware after verifying token
      const worker = await Worker.findById(req.user.id);
  
      if (!worker) {
        return res.status(404).json({ message: 'Worker not found' });
      }
  
      // only these fields are allowed to be updated here
      const {
        name,
        alternatePhone,
        chargesType,
        chargesAmount,
        serviceRadiusKm,
        idDocumentType,
        idDocumentNumber,
        longitude,
        latitude,
      } = req.body;
  
      // update only fields that were actually sent — leave others untouched
      if (name) worker.name = name;
      if (alternatePhone) worker.alternatePhone = alternatePhone;
      if (chargesType) worker.chargesType = chargesType;
      if (chargesAmount) worker.chargesAmount = chargesAmount;
      if (serviceRadiusKm) worker.serviceRadiusKm = serviceRadiusKm;
      if (idDocumentType) worker.idDocumentType = idDocumentType;
      if (idDocumentNumber) worker.idDocumentNumber = idDocumentNumber;
  
      // location needs both longitude and latitude together to be valid GeoJSON
      if (longitude && latitude) {
        worker.location = {
          type: 'Point',
          coordinates: [longitude, latitude], // order matters: [lng, lat]
        };
      }
  
      const updatedWorker = await worker.save();
  
      res.status(200).json({ worker: updatedWorker });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  

  // PUT /api/workers/profile-photo — worker uploads/replaces their profile photo
const uploadProfilePhoto = async (req, res) => {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // convert file buffer to a format Cloudinary accepts (base64 data URI)
    const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(base64File, {
      folder: 'labourconnect/worker-photos', // keeps uploads organized in Cloudinary
    });

    // Find current worker
    const worker = await Worker.findById(req.user.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    // Save uploaded image URL in database
    worker.profilePhoto = result.secure_url; // save the permanent Cloudinary URL
    await worker.save();

    res.status(200).json({ profilePhoto: worker.profilePhoto });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { registerWorker, loginWorker, updateWorkerProfile, uploadProfilePhoto };   // CHANGED  // CHANGED — added loginWorker  // CHANGED
   
 
