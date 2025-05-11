import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trending</NavLink>
      <NavLink to="/upcoming" className={({ isActive }) => isActive ? 'active' : ''}>Upcoming</NavLink>
      <NavLink to="/recommendations" className={({ isActive }) => isActive ? 'active' : ''}>Recommendations</NavLink>
    </nav>
  );
}
