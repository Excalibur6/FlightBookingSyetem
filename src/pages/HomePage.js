// src/pages/HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Move the styles here later

function HomePage() {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Redirect to flight results page with query params
    navigate(`/flight-results?departure=${departure}&destination=${destination}&date=${date}&passengers=${passengers}`);
  };

  return (
    <div className="homepage-container">
      <h1>Book Your Flight</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={departure} onChange={(e) => setDeparture(e.target.value)} placeholder="Departure City" required />
        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination City" required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="number" value={passengers} onChange={(e) => setPassengers(e.target.value)} min="1" required />
        <button type="submit">Search Flights</button>
      </form>
    </div>
  );
}

export default HomePage;
