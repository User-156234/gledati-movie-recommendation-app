// src/pages/Profile.jsx
import React, { useContext } from 'react';
import './Profile.css';
import { AuthContext } from '../auth/AuthContext'; // adjust path as needed

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <p className="profile-page">Loading user details...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src={user.profilePic || 'https://i.pravatar.cc/150?img=10'}
          alt="Profile"
          className="profile-avatar1"
        />
        <h2 className="profile-name">{user.name || 'Unknown User'}</h2>
        <p className="profile-email">{user.email || 'Email not available'}</p>
        <div className="profile-actions">
          <button>Edit Profile</button>
          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
