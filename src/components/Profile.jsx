import React, { useContext } from 'react';
import './Profile.css';
import { AuthContext } from '../auth/AuthContext'; // adjust path as needed
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
        <h2 className="profile-name">{user.username || 'Unknown User'}</h2>
        <p className="profile-email">{user.email || 'Email not available'}</p>

        <div className="profile-actions">
          {user.role === 'admin' && (
            <button onClick={() => navigate('/admin-dashboard')}>
              Go to Dashboard
            </button>
          )}
          <button onClick={() => navigate('/home')}>
              Go to HomePage
            </button>
          <button onClick={()=>navigate('/edit-profile')}>Edit Profile</button>
          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
