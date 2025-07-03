import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [movie, setMovie] = useState({ title: '', downloadLink: '' });
  const [users, setUsers] = useState([]);

  const handleAddMovie = async () => {
    try {
      await axios.post('/api/admin/add-download', movie);
      alert('Movie link added!');
      setMovie({ title: '', downloadLink: '' });
    } catch (err) {
      alert('Failed to add movie');
    }
  };

  const fetchUsers = async () => {
    const res = await axios.get('/api/admin/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="add-download-form">
        <h3>Add Movie Download Link</h3>
        <input
          type="text"
          placeholder="Movie Title"
          value={movie.title}
          onChange={(e) => setMovie({ ...movie, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Download Link"
          value={movie.downloadLink}
          onChange={(e) => setMovie({ ...movie, downloadLink: e.target.value })}
        />
        <button onClick={handleAddMovie}>Add Download Link</button>
      </div>

      <div className="users-section">
        <h3>Registered Users</h3>
        <ul>
          {users.map((u) => (
            <li key={u._id}>{u.name} - {u.email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
