import React, { useEffect, useState } from 'react';
import { fetchTrendingMovies, searchMovies } from '../api/tmdb';
import MovieCard from './MovieCard';
import Navbar from './Navbar';
import TrendingCarousel from './TrendingCarousel'; // new carousel import
import '../styles/styles.css';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setError(null);
        const res = search
          ? await searchMovies(search, page)
          : await fetchTrendingMovies(page);
        setMovies(res.data.results);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data from TMDB.');
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top on page change
      }
    };
    fetchData();
  }, [search, page]);

  return (
    <div className="container">
      <Navbar />

      {/* Trending Carousel only when not searching */}
      {!search && <TrendingCarousel />}

      <div className="search-section">
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
      </div>

      {loading && <p className="loading">Loading movies...</p>}

      {error && (
        <div className="error">
          <p>{error}</p>
          <p className="tip">Make sure your IP allows TMDB API calls.</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span> Page {page} </span>
            <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
