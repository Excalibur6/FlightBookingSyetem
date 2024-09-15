const FlightSearch = require('../models/FlightSearch');  // Create a new schema for flight searches
//const User = require('../models/User');
const Amadeus = require('amadeus');

// Initialize Amadeus API Client
const amadeus = new Amadeus({
  clientId: '3MpRyyhEGGXFp5owsJo7VcbPKWvTTGtb',
  clientSecret: 'mUayAYdzfl8yAtEX'
});

// Search for flights, save user's search, and return available flights
exports.searchFlights = async (req, res) => {
  const { departure, destination, date, passengers, userEmail } = req.body;

  try {
    // Fetch flights from Amadeus
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: departure,
      destinationLocationCode: destination,
      departureDate: date,
      adults: passengers
    });
    
    const flights = response.data;

    // Save the user's search in the database
    const flightSearch = new FlightSearch({
      userEmail,
      departure,
      destination,
      date,
      passengers,
      flights
    });
    await flightSearch.save();

    // Return flights data sorted by price
    const sortedFlights = flights.sort((a, b) => a.price.total - b.price.total);
    res.status(200).json(sortedFlights);
  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({ message: 'Failed to fetch flights' });
  }
};
