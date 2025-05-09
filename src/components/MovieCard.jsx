import React from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/fp.jpg'; // Make sure this file exists in your public folder

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img
        src={imageUrl}
        alt={movie.title || 'Movie Poster'}
        loading="lazy"
      />
      <div>
        <h3>{movie.title}</h3>
        <p>{movie.release_date}</p>
      </div>
    </Link>
  );
}
