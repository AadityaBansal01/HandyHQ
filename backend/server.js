// server.js — entry point of our backend

// load .env values into process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
const workerRoutes = require('./routes/workerRoutes'); 

connectDB();

const app = express();

// allow frontend to call this backend
app.use(cors());

// allow server to read JSON from request body
app.use(express.json());

// quick test route — just to prove server is alive
app.get('/', (req, res) => {
  res.send('LabourConnect backend is running');
});

// Routes all requests starting with /api/workers to workerRoutes
app.use('/api/workers', workerRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});