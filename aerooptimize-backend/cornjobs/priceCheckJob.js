const FlightSearch = require('../models/FlightSearch');
const { sendEmailNotification, sendSMSNotification } = require('../controllers/notificationController');
const Amadeus = require('amadeus');

// Initialize Amadeus API Client
const amadeus = new Amadeus({
  clientId: '3MpRyyhEGGXFp5owsJo7VcbPKWvTTGtb',
  clientSecret: 'mUayAYdzfl8yAtEX'
});

// Cron job to check for price drops
const checkPriceDrops = async () => {
  const searches = await FlightSearch.find();

  for (const search of searches) {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: search.departure,
      destinationLocationCode: search.destination,
      departureDate: search.date,
      adults: search.passengers
    });

    const newFlights = response.data;
    const cheapestNewFlight = newFlights.sort((a, b) => a.price.total - b.price.total)[0];

    // Compare with the current stored price and notify the user if it's lower
    if (cheapestNewFlight.price.total < search.flights[0].price.total) {
      const user = await User.findOne({ email: search.userEmail });

      await sendEmailNotification(user.email, cheapestNewFlight);
      await sendSMSNotification(user.mobile, cheapestNewFlight);

      // You can also update in-app notifications
    }
  }
};

module.exports = checkPriceDrops;
