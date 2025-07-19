import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending reset email');
    }
  };

  return (
    <div className="edit-profile-page">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Enter your registered email:</label>
        <input
          type="text"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
        {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      </form>
    </div>
  );
}
