import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import './Navbar.css';
import searchIcon from '../assets/search.ico';
import gledati from '../assets/gledati.png';

export default function Navbar({ onSearchToggle }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      <div className="logo-container" onClick={() => navigate('/home')}>
        <img src={gledati} alt="Logo" className="logo" />
      </div>

      <div className="nav-links-center">
        <NavLink to="/home" end className={({ isActive }) => (isActive ? 'active' : '')}>Trending</NavLink>
        <NavLink to="/upcoming" className={({ isActive }) => (isActive ? 'active' : '')}>Upcoming</NavLink>
        <NavLink to="/recommendations" className={({ isActive }) => (isActive ? 'active' : '')}>Recommendations</NavLink>
      </div>

      <div className="auth-links">
        <button className="search-icon-button" onClick={onSearchToggle} title="Search">
          <img src={searchIcon} alt="Search" className="icon" />
        </button>

        {user ? (
          <>
            <div className="profile-avatar-container" ref={dropdownRef}>
              <img
                src={user.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                alt="Profile"
                className="profile-avatar"
                title="Profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
                  <NavLink to="/watchlist" className="dropdown-item">Watchlist</NavLink>
                  <button onClick={handleLogout} className="dropdown-item logout">Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to="/signin" className={({ isActive }) => (isActive ? 'active' : '')}>Sign In</NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}