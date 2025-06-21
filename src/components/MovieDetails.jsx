import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails } from '../api/tmdb';
import CastList from './CastList';
import Trailer from './Trailer';
import axios from 'axios';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [watchProviders, setWatchProviders] = useState([]);

  useEffect(() => {
    const getDetails = async () => {
      const res = await fetchMovieDetails(id);
      setMovie(res.data);
    };

    const getWatchProviders = async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=2cb0292b03fe9b2060d5bdfc7cc0c94b`
      );
      const providers = res.data.results?.IN?.flatrate || []; // IN = India; adjust if needed
      setWatchProviders(providers);
    };

    getDetails();
    getWatchProviders();
  }, [id]);

  if (!movie) return <div className="container">Loading...</div>;

  const trailer = movie.videos.results.find((v) => v.type === 'Trailer');
  const director = movie.credits.crew.find((crew) => crew.job === 'Director');

  return (
    <div className="container details-container">
      <button onClick={() => navigate(-1)} className="back-button">⬅ Back</button>

      <div className="details-top">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
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
        </div>
      </div>

      <div className="cast-scroll">
        <CastList cast={movie.credits.cast.slice(0, 8)} />
      </div>

      {trailer && (
        <div className="trailer">
          <Trailer videoKey={trailer.key} />
        </div>
      )}
    </div>
  );
}
