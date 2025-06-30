import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { BACKEND_URL } from '../config';
import '../styles/styles.css';

export default function MovieCard({ movie }) {
  const { user, token } = useContext(AuthContext);
  const [added, setAdded] = useState(false);

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/fp.jpg';

  // ✅ Check if movie already in watchlist
  useEffect(() => {
    const checkWatchlist = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${BACKEND_URL}/watchlist`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
  }, [user, token, movie.id]);

  const addToWatchlist = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          overview: movie.overview
        })
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
    <div className="movie-card-wrapper">
      <Link to={`/movie/${movie.id}`} className="movie-card">
        <img src={imageUrl} alt={movie.title || 'Movie Poster'} loading="lazy" />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{movie.title}</h3>
            {user && (
              <button
                className={`watchlist-btn ${added ? 'added' : ''}`}
                onClick={addToWatchlist}
                disabled={added}
              >
                {added ? 'Added' : '+ Watchlist'}
              </button>
            )}
          </div>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#ccc' }}>
            {movie.release_date}
          </p>
        </div>
      </Link>
    </div>
  );
}
