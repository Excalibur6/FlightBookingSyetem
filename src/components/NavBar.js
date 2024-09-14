// src/components/NavBar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css'; // External CSS file for NavBar styling

function NavBar({ isLoggedIn, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  // Load the user details (including username) from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsername(parsedUser.username);  // Set username for display in NavBar
    }
  }, [isLoggedIn]);  // Re-run whenever login status changes

  const handleLogoutClick = () => {
    onLogout(); // This will clear the session in App.js
    setShowDropdown(false);
    navigate('/login');  // Redirect to login after signout
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">AeroOptimize</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/updates">Updates</Link></li>

        {isLoggedIn ? (
          <>
            <li className="nav-item user-dropdown">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="dropdown-button"
              >
                {username} ▼
              </button>
              {showDropdown && (
                <ul className="dropdown-menu">
                  <li><Link to="/manage-account">Manage Account</Link></li>
                  <li>
                    <button onClick={handleLogoutClick}>Sign Out</button>
                  </li>
                </ul>
              )}
            </li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
