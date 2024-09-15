const mongoose = require('mongoose');

const flightSearchSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  passengers: { type: Number, required: true },
  flights: { type: Array, required: true },
});

module.exports = mongoose.model('FlightSearch', flightSearchSchema);
