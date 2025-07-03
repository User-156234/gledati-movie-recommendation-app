import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchMovieDetails } from '../api/tmdb';
import CastList from './CastList';
import Trailer from './Trailer';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import '../styles/styles.css';
import { BACKEND_URL } from '../config';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const trailerRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [watchProviders, setWatchProviders] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');
  const [newLink, setNewLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const movieRes = await fetchMovieDetails(id);
        setMovie(movieRes.data);

        const providerRes = await axios.get(`${BACKEND_URL}/tmdb/movie/${id}/providers`);
        const providers = providerRes.data.results?.IN?.flatrate || [];
        setWatchProviders(providers);

        const linkRes = await axios.get(`${BACKEND_URL}/download/movie-download/${id}`);
        setDownloadLink(linkRes.data.downloadLink || '');
      } catch (err) {
        console.error('Error loading movie details:', err);
        setDownloadLink('');
      } finally {
        setIsLoading(false);
      }
    };

    loadAll();
  }, [id]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const scrollToTrailer = queryParams.get('playTrailer');
    if (scrollToTrailer && trailerRef.current) {
      setTimeout(() => {
        trailerRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    }
  }, [location.search]);

  const handleAddToWatchlist = async (e) => {
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

      const data = await res.json();
      if (res.ok) {
        alert('Added to watchlist');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const handleSaveLink = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/download/admin/movie-download`,
        {
          movieId: movie.id,
          title: movie.title,
          downloadLink: newLink,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDownloadLink(newLink);
      setNewLink('');
      alert('Download link saved!');
    } catch (err) {
      alert('Error saving download link');
    }
  };

  if (isLoading || !movie) return <div className="container">Loading...</div>;

  const trailer = movie.videos.results.find((v) => v.type === 'Trailer');
  const director = movie.credits.crew.find((crew) => crew.job === 'Director');

  return (
    <div className="container details-container">
      <button onClick={() => navigate(-1)} className="back-button">⬅ Back</button>

      <div className="details-top">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.title} poster`} />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average}</p>

          {director && (
            <p>
              <strong>Director:</strong>{' '}
              <span
                style={{ color: '#ff4757', cursor: 'pointer' }}
                onClick={() => navigate(`/actor/${director.id}`)}
              >
                {director.name}
              </span>
            </p>
          )}

          {watchProviders.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>Available On:</strong>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                {watchProviders.map((provider) => (
                  <img
                    key={provider.provider_id}
                    src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                    alt={provider.provider_name}
                    title={provider.provider_name}
                    style={{ width: '50px', height: '50px', borderRadius: '8px', background: '#fff' }}
                  />
                ))}
              </div>
            </div>
          )}

          {token && (
            <button className="watchlist-button" onClick={handleAddToWatchlist}>
              Add to Watchlist
            </button>
          )}

          {downloadLink && (
            <div style={{ marginTop: '1rem' }}>
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="watchlist-button"
                style={{ backgroundColor: '#00ffcc', color: '#000', fontWeight: 'bold' }}
              >
                📥 Download Movie
              </a>
            </div>
          )}

          {user?.role === 'admin' && (
            <div style={{ marginTop: '1rem' }}>
              <input
                type="text"
                placeholder="Paste new download link"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                style={{ padding: '0.4rem', width: '70%' }}
              />
              <button
                onClick={handleSaveLink}
                className="watchlist-button"
                style={{ marginLeft: '0.5rem' }}
              >
                Save Link
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="cast-scroll">
        <CastList cast={movie.credits.cast.slice(0, 8)} />
      </div>

      {trailer && (
        <div className="trailer" ref={trailerRef}>
          <Trailer videoKey={trailer.key} />
        </div>
      )}
    </div>
  );
}
