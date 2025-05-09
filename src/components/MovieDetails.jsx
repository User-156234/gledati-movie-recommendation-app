import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails } from '../api/tmdb';
import CastList from './CastList';
import Trailer from './Trailer';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const getDetails = async () => {
      const res = await fetchMovieDetails(id);
      setMovie(res.data);
    };
    getDetails();
  }, [id]);

  if (!movie) return <div className="container">Loading...</div>;

  const trailer = movie.videos.results.find((v) => v.type === 'Trailer');

  return (
    <div className="container details-container">
      <button onClick={() => navigate(-1)} className="back-button">⬅ Home</button>
      <div className="details-top">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average}</p>
        </div>
      </div>
     
      <div className="cast-scroll">
      <CastList cast={movie.credits.cast.slice(0, 8)} />

      </div>
      {trailer && <div className="trailer"><Trailer videoKey={trailer.key} /></div>}
    </div>
  );
}
