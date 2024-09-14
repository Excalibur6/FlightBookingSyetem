// src/pages/FlightResultsPage.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function FlightResultsPage() {
  const location = useLocation();
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const departure = params.get('departure');
    const destination = params.get('destination');
    const date = params.get('date');
    const passengers = params.get('passengers');

    const fetchFlights = async () => {
      try {
        const response = await fetch('http://localhost:5000/search-flights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ departure, destination, date, passengers })
        });
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        setError('Error: Failed to fetch flight data');
      }
    };

    fetchFlights();
  }, [location.search]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Flight Results</h1>
      <ul>
        {flights.map((flight, index) => (
          <li key={index}>
            {flight.itineraries[0].segments[0].departure.iataCode} to {flight.itineraries[0].segments[0].arrival.iataCode} - {flight.price.total} USD
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FlightResultsPage;
