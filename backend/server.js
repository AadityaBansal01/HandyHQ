const express = require("express");

// Import cors - allows our frontend (different port) to talk to this backend
const cors = require("cors");

// Loads variables from .env file into process.env
require("dotenv").config();

// Create the express app - this is our actual server
const app = express();

// Let frontend (any origin for now) make requests to this backend
app.use(cors());

// Allows server to understand JSON sent in request body
app.use(express.json());

// A simple test route - if this works, server is alive
app.get("/", (req, res) => {
  res.send("LabourConnect backend is running");
});

// Get port from .env, fallback to 5000 if not found
const PORT = process.env.PORT || 5000;

// Start the server and listen for requests
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});