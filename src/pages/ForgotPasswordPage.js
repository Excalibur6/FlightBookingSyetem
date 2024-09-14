// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, mobile }),
      });

      if (response.ok) {
        // Navigate to OTP verification page if OTP is sent successfully
        navigate('/verify-otp', { state: { email, mobile } });
      } else {
        // Handle errors (e.g., user not found, mobile mismatch)
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      alert('There was a problem. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Forgot Password</h1>
      <form onSubmit={handleForgotPassword} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Mobile Number:</label>
          <input 
            type="text" 
            value={mobile} 
            onChange={(e) => setMobile(e.target.value)} 
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Send OTP</button>
      </form>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    textAlign: 'left',
  },
  input: {
    padding: '10px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ForgotPasswordPage;
