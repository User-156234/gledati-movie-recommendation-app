import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import './Navbar.css';
import bookmarkIcon from '../assets/bookmark-icon.ico';
import searchIcon from '../assets/search.ico';

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
      <div className="nav-links-center">
        <NavLink to="/home" end className={({ isActive }) => (isActive ? 'active' : '')}>Trending</NavLink>
        <NavLink to="/upcoming" className={({ isActive }) => (isActive ? 'active' : '')}>Upcoming</NavLink>
        <NavLink to="/recommendations" className={({ isActive }) => (isActive ? 'active' : '')}>Recommendations</NavLink>
      </div>

      <div className="auth-links">
        {/* 🔍 Search Icon */}
        <button className="search-icon-button" onClick={onSearchToggle} title="Search">
  <img src={searchIcon} alt="Search" className="icon" />
</button>

        {user ? (
          <div className="dropdown" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-toggle">
              <img src={bookmarkIcon} alt="Watchlist" className="icon" />
              <span>Watchlist ▾</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <NavLink to="/watchlist" className="dropdown-item">My Watchlist</NavLink>
                <button onClick={handleLogout} className="dropdown-item logout">Logout</button>
              </div>
            )}
          </div>
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
