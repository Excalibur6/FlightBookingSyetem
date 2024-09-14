const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Amadeus = require('amadeus'); // Add Amadeus import

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

// Define the User Schema
const userSchema = new mongoose.Schema({
  fullName: String,
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  mobile: String,
  password: { type: String, required: true },
  otp: String,           // Store the OTP temporarily
  otpExpires: Date,      // OTP expiration time
});

const User = mongoose.model('User', userSchema);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aadidaa609@gmail.com',  // Your email address
    pass: 'hdwl irga ccrt lkib'      // App Password from Google
  }
});

// Forgot Password Route (Send OTP via Email)
app.post('/forgot-password', async (req, res) => {
  const { email, mobile } = req.body;

  try {
    const user = await User.findOne({ email, mobile });
    if (!user) {
      return res.status(400).json({ message: 'User not found with the provided email and mobile number' });
    }

    // Generate OTP and expiration time
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    await user.save();

    // Send OTP to the user's email
    const mailOptions = {
      from: 'aadidaa609@gmail.com',
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp} to change your password. It will expire in 15 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'OTP sent to your email address' });
      }
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Verify OTP Route
app.post('/verify-otp', async (req, res) => {
  const { email, mobile, otp } = req.body;

  try {
    const user = await User.findOne({ email, mobile, otp });
    if (!user || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear the OTP and expiration time
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP verified' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Reset Password Route
app.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Hash the new password and update the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Signup Route
app.post('/signup', async (req, res) => {
  const { fullName, username, email, mobile, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullName,
      username,
      email,
      mobile,
      password: hashedPassword,
    });

    // Save the user in the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // If login is successful, send user data (without password) back to the client
    res.status(200).json({
      message: 'Login successful',
      user: {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Route to fetch user details based on their email
app.get('/user-details', async (req, res) => {
  const { email } = req.query; // Assume user email is passed in query params

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user details without the password
    res.status(200).json({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
    });
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Update user details route
app.post('/update-user', async (req, res) => {
  const { email, fullName, username, password, mobile } = req.body;

  try {
    // Find the user by email and update their details
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.fullName = fullName;
    user.username = username;
    user.mobile = mobile;

    // Only update password if it's provided (optional, as passwords might be hashed)
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Hash the password before saving
    }

    // Save the updated user information
    await user.save();

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

app.get('/search-flights', async (req, res) => {
  const { departure, destination, date, passengers } = req.query;

  try {
    const response = await Amadeus.shopping.flightOffersSearch.get({
      originLocationCode: departure,
      destinationLocationCode: destination,
      departureDate: date,
      adults: passengers
    });
    res.json(response.data); // Send flight data back to client
  } catch (error) {
    console.error('Error fetching flight data:', error);
    res.status(500).json({ message: 'Failed to fetch flight data' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
