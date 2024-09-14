import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import UpdatesPage from './pages/UpdatesPage';
import ManageAccountPage from './pages/ManageAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SignUpPage from './pages/SignUpPage';
// import FlightResultsPage from './pages/FlightsResultsPage'; 
import VerifyOTPPage from './pages/VerifyOTPPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUser(parsedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} username={user?.username} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/updates" element={<UpdatesPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path ="reset-password" element={<ResetPasswordPage/>}/>
        <Route path="/manage-account" element={<ManageAccountPage user={user} />} />
        
        {/* Route for flight results without query params */}
        {/* <Route path="/flight-results" element={<FlightResultsPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
