// This file is the backend server for the application.
// It uses Express.js to create a REST API and interacts with the Google Gemini API.

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for all origins, adjust in production
app.use(express.json()); // Parse JSON request bodies

// Serve static files from the root directory (where index.html is)
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api', require('./routes/chatRoutes'));

// Catch-all to serve index.html for any other routes (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Ensure you have process.env.API_KEY configured for Gemini API access.');
});
