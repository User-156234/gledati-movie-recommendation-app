// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import Upcoming from './components/Upcoming';
import Recommendations from './components/recommendations';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/upcoming" element={<Upcoming />}/>
        <Route path="/recommendations" element={<Recommendations/>} />
        <Route path="/recommendations/:genreId" element={<Recommendations/>} />
      </Routes>
    </Router>
  );
}