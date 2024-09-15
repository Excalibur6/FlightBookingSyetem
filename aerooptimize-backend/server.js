const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Amadeus = require('amadeus');

// Import controllers
const userController = require('./controllers/userController');
const flightController = require('./controllers/flightController');
const cronJobs = require('./cornjobs/flightCronJob'); // Import cron jobs

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/aerooptimize')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Initialize Amadeus API Client
const amadeus = new Amadeus({
  clientId: '3MpRyyhEGGXFp5owsJo7VcbPKWvTTGtb',
  clientSecret: 'mUayAYdzfl8yAtEX'
});

// Routes
app.use('/api/user', userController);
app.use('/api/flight', flightController);

// Start cron jobs
cronJobs.scheduleFlightPriceUpdates();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
