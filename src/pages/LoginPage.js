// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function LoginPage({ onLogin }) {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Successful login
        setErrorMessage(''); // Clear any previous error messages
        onLogin(data.user); // Pass the user data to App.js to manage session
        navigate('/'); // Redirect to home page after login
      } else {
        // Handle login failure
        setErrorMessage(data.message || 'Invalid login credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('There was a problem logging in. Please try again later.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Login Now to Book Your Ticket</h1>
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      <LoginForm onLogin={handleLogin} />
      <div style={styles.options}>
        <a href="/forgot-password" style={styles.link}>Forgot Password?</a>
        <a href="/signup" style={styles.link}>Sign Up</a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    marginBottom: '20px',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '10px',
  },
  options: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default LoginPage;
