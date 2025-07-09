import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../config';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/reset-password`, { token, newPassword });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="edit-profile-page">
      <h2>Set New Password</h2>
      <form onSubmit={handleReset}>
        <label>New Password:</label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
        {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      </form>
    </div>
  );
}
