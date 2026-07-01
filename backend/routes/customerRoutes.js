// routes/customerRoutes.js — defines URL paths for customer APIs

const express = require('express');
const router = express.Router();
const { registerCustomer, loginCustomer, getCustomerProfile, updateCustomerProfile } = require('../controllers/customerController'); // CHANGED
const protect = require('../middleware/authMiddleware');       // NEW
const authorize = require('../middleware/roleMiddleware');     // NEW

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);

// protected routes — must be logged in AND role must be 'customer'
router.get('/profile', protect, authorize('customer'), getCustomerProfile);      // NEW
router.put('/profile', protect, authorize('customer'), updateCustomerProfile);   // NEW

module.exports = router;