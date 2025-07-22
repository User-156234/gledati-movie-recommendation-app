import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { BACKEND_URL } from '../config';
import './SeriesCard.css';

export default function SeriesCard({ movie }) {
  const { user, token } = useContext(AuthContext);
  const [added, setAdded] = useState(false);

  const imageUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/fp.jpg';

  useEffect(() => {
    if (!user || !movie) return;
    const checkWatchlist = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/watchlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const found = data.find((m) => m.movieId === movie.id);
          if (found) setAdded(true);
        }
      } catch (error) {
        console.error('Error checking watchlist:', error);
      }
    };
    checkWatchlist();
  }, [user, token, movie]);

  if (!movie) return null;

  const addToWatchlist = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          overview: movie.overview,
        }),
      });
      if (res.ok) {
        setAdded(true);
      } else {
        const data = await res.json();
        alert(data.message || 'Already in watchlist');
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  return (
    <div className="series-card-wrapper">
      <div className="series-card">
        <img src={imageUrl} alt={movie.title || 'Movie Poster'} loading="lazy" />
        <div className="series-card-info">
          <h3 className="series-title">{movie.title}</h3>
          <p className="series-release-date">{movie.release_date}</p>
          {user && (
            <button
              className={`series-watchlist-btn ${added ? 'added' : ''}`}
              onClick={addToWatchlist}
              disabled={added}
            >
              {added ? 'Added' : '+ Watchlist'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
