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
// GET /api/workers/search — public route, customers search nearby workers
// example call: /api/workers/search?workType=Plumber&longitude=77.2&latitude=28.6&radiusKm=10&page=1&limit=10
const searchWorkers = async (req, res) => {
  try {
    // pull all possible query params from the URL (?key=value&key2=value2...)
    const {
      workType,       // required — e.g. "Plumber"
      longitude,      // required — customer's location
      latitude,       // required — customer's location
      radiusKm,       // required — how far to search
      verifiedOnly,   // optional — "true" to show only verified workers
      minRating,      // optional — e.g. "4" for 4+ stars
      chargesType,    // optional — e.g. "per_hour"
      page = 1,       // optional — defaults to page 1
      limit = 10,     // optional — defaults to 10 results per page
    } = req.query;

    // workType + location + radius are the MVP's "required" filters — reject if missing
    if (!workType || !longitude || !latitude || !radiusKm) {
      return res.status(400).json({
        message: 'workType, longitude, latitude and radiusKm are required',
      });
    }

    // query params always arrive as strings — convert to real numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // filters applied ON TOP OF the geo search (matched only among nearby workers)
    const matchFilters = {
      workType,
      isSuspended: false, // never show suspended workers in search results
    };

    // only add these filters if the customer actually asked for them
    if (verifiedOnly === 'true') {
      matchFilters.verificationStatus = 'Verified';
    }
    if (minRating) {
      matchFilters.ratingAverage = { $gte: parseFloat(minRating) };
    }
    if (chargesType) {
      matchFilters.chargesType = chargesType;
    }

    // $geoNear finds nearby workers AND sorts by distance automatically
    const workers = await Worker.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)], // [lng, lat] order
          },
          distanceField: 'distanceMeters', // adds this field to each result automatically
          maxDistance: parseFloat(radiusKm) * 1000, // radius in km converted to meters
          spherical: true, // required for real-world (lat/lng) distance calculation
          query: matchFilters, // extra filters applied during the geo search itself
        },
      },
      { $skip: (pageNum - 1) * limitNum }, // skip past previous pages
      { $limit: limitNum },                // only return this page's worth of results
      { $project: { password: 0 } },       // strip password hash from the response — never send this
    ]);

    res.status(200).json({
      page: pageNum,
      limit: limitNum,
      results: workers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// GET /api/workers/:id — public route, view one worker's full profile
const getWorkerById = async (req, res) => {
  try {
    // req.params.id comes from the ":id" part of the URL, e.g. /api/workers/64f1a2...
    const worker = await Worker.findById(req.params.id).select('-password');
    // .select('-password') means "return everything EXCEPT password" — never send the hash to frontend

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(200).json({ worker });
  } catch (err) {
    // if the id in the URL isn't even a valid Mongo ID format, this catches that too
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { registerWorker, loginWorker, updateWorkerProfile, uploadProfilePhoto, searchWorkers, getWorkerById };   // CHANGED  // CHANGED  // CHANGED  // CHANGED — added loginWorker  // CHANGED
   
 
