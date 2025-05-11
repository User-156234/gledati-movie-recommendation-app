import React, { useEffect, useState } from 'react';
import { fetchMoviesByGenre } from '../api/tmdb'; // Assuming you add fetchMoviesByGenre to tmdb.js
import MovieCard from './MovieCard';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

export default function Recommendations() {
  const { genreId } = useParams(); // Get genre ID from the URL
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const res = await fetchMoviesByGenre(genreId, page);
        setMovies(res.data.results);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data.');
      }
    };
    fetchData();
  }, [genreId, page]);

  return (
    <div className="container">
      <Navbar />
      <div className="genre-title">
        <h2>Movies in this Genre</h2>
      </div>
      
      {error && <p>{error}</p>}

      {!error && (
        <>
          <div className="grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Prev</button>
            <span> Page {page} </span>
            <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
