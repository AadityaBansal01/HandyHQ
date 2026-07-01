// controllers/customerController.js — logic behind customer APIs
// same pattern as workerController.js — register hashes password + returns token,
// login checks password + returns token

const Customer = require('../models/Customer');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

// POST /api/customers/register
const registerCustomer = async (req, res) => {
  try {
    const { name, phone, password, email } = req.body;

    // email is optional, so it's not in this required check
    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone and password are required' });
    }

    const existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const hashedPassword = await hashPassword(password);

    const customer = await Customer.create({
      name,
      phone,
      password: hashedPassword,
      email, // fine if undefined — field is optional in the schema
    });

    const token = generateToken({ id: customer._id, role: 'customer' });

    res.status(201).json({
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/customers/login
const loginCustomer = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return res.status(400).json({ message: 'Invalid phone or password' });
    }

    const isMatch = await comparePassword(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone or password' });
    }

    const token = generateToken({ id: customer._id, role: 'customer' });

    res.status(200).json({
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// GET /api/customers/profile — logged-in customer views their own profile (protected)
const getCustomerProfile = async (req, res) => {
    try {
      // req.user.id comes from the JWT — set by authMiddleware after verifying token
      const customer = await Customer.findById(req.user.id).select('-password');
      // .select('-password') = return everything except the password hash
  
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      res.status(200).json({ customer });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  // PUT /api/customers/profile — logged-in customer updates their own profile (protected)
  const updateCustomerProfile = async (req, res) => {
    try {
      const customer = await Customer.findById(req.user.id);
  
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      // only these fields are allowed to be updated here
      const { name, email } = req.body;
  
      // update only fields that were actually sent — leave others untouched
      if (name) customer.name = name;
      if (email) customer.email = email;
  
      const updatedCustomer = await customer.save();
  
      res.status(200).json({
        customer: {
          id: updatedCustomer._id,
          name: updatedCustomer.name,
          phone: updatedCustomer.phone,
          email: updatedCustomer.email,
        },
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  module.exports = { registerCustomer, loginCustomer, getCustomerProfile, updateCustomerProfile };   // CHANGED
