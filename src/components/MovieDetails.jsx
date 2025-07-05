import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchMovieDetails } from '../api/tmdb';
import Trailer from './Trailer';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import './MovieDetails.css';
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
    <div className="details-container">
      <button onClick={() => navigate(-1)} className="back-button">⬅ Back</button>

      <div
        className="details-hero"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path})`,
        }}
      >
        <div className="details-overlay">
          <h1 className="details-title">{movie.title}</h1>
          <p className="details-tagline">{movie.overview?.slice(0, 300)}...</p>

          {trailer && (
            <button
              className="trailer-button"
              onClick={() => {
                const searchParams = new URLSearchParams(location.search);
                searchParams.set('playTrailer', 'true');
                navigate({ search: searchParams.toString() });
              }}
            >
              ▶ Watch Trailer
            </button>
          )}
        </div>
      </div>

      <div className="details-top">
        <div className="movie-main-info">
          <div className="meta-data">
            <p><strong>Rating:</strong> {movie.vote_average}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
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
          </div>

          {watchProviders.length > 0 && (
            <div className="watch-providers">
              <strong>Available On:</strong>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                {watchProviders.map((provider) => (
                  <img
                    key={provider.provider_id}
                    src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                    alt={provider.provider_name}
                    title={provider.provider_name}
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
        </div>
      </div>

      {/* Cast List */}
      <div className="cast-scroll">
  <h2 style={{ marginBottom: '16px' }}>Cast</h2>
  <div className="cast-list">
    {movie.credits.cast.slice(0, 8).map((actor) => (
      <div
        className="cast-card"
        key={actor.id}
        onClick={() => navigate(`/actor/${actor.id}`)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
              : '/default-profile.png'
          }
          alt={actor.name}
        />
        <span>{actor.name}</span>
      </div>
    ))}
  </div>
</div>


      {trailer && (
        <div className="trailer" ref={trailerRef}>
          <Trailer videoKey={trailer.key} />
        </div>
      )}

      {downloadLink && (
        <div className="download-link-section">
          <a href={downloadLink} target="_blank" rel="noopener noreferrer">
             Download Movie
          </a>
        </div>
      )}

      {user?.role === 'admin' && (
        <div className="admin-input">
          <input
            type="text"
            placeholder="Paste new download link"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
          <button onClick={handleSaveLink}>Save Link</button>
        </div>
      )}
    </div>
  );
}
