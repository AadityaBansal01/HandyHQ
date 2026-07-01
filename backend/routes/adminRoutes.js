// routes/adminRoutes.js — defines URL paths for admin APIs

const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminController');

router.post('/login', loginAdmin);

module.exports = router;