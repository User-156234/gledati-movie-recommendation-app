import React, { useEffect, useState } from 'react';
import { fetchTrendingMovies, searchMovies } from '../api/tmdb';
import MovieCard from './MovieCard';
import Navbar from './Navbar';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const res = search
          ? await searchMovies(search, page)
          : await fetchTrendingMovies(page);
        setMovies(res.data.results);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data. You might need to request temporary access.');
      }
    };
    fetchData();
  }, [search, page]);

  return (
    <div className="container">
      <Navbar /> {/* 🔹 Add Navbar at the top */}

      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="search-bar"
      />

      {error && (
        <div className="error">
          <p>{error}</p>
          <a
            href="https://cors-anywhere.herokuapp.com/corsdemo"
            target="_blank"
            rel="noopener noreferrer"
            className="access-link"
          >
            Get Server Access And Reload the Page 
          </a>
        </div>
      )}

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
