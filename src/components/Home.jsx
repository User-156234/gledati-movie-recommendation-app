import React, { useEffect, useState } from 'react';
import { fetchTrendingMovies, searchMovies } from '../api/tmdb';
import MovieCard from './MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const res = search
        ? await searchMovies(search, page)
        : await fetchTrendingMovies(page);
      setMovies(res.data.results);
    };
    fetchData();
  }, [search, page]);

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // reset to page 1 on new search
        }}
        className="search-bar"
      />
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
    </div>
  );
}