import React, { useEffect, useState } from 'react';
import { fetchTrendingSeries, searchSeries } from '../api/tmdb'; // Make sure these functions are defined in your tmdb API helper

import Navbar from './Navbar';// Optional: create a separate SeriesCarousel if needed
import '../styles/styles.css';
import { Mosaic } from 'react-loading-indicators';
import SeriesCarousel from './SeriesCarousel';
import SeriesCard from './SeriesCard';

export default function Series() {
  const [series, setSeries] = useState([]);
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
          ? await searchSeries(search, page)
          : await fetchTrendingSeries(page);
        setSeries(res.data.results);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data from TMDB.');
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    fetchData();
  }, [search, page]);

  return (
    <div className="container">
      <Navbar
        searchQuery={search}
        setSearchQuery={(value) => {
          setSearch(value);
          setPage(1);
        }}
        handleSearch={() => setPage(1)}
      />

      {!search && <SeriesCarousel />} {/* Or use a SeriesCarousel */}

      {loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Mosaic color="#314ccc" size="medium" text="" textColor="" />
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
          <p className="tip">Make sure your IP allows TMDB API calls.</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid">
            {series.map((tv) => (
              <SeriesCard key={tv.id} movie={tv} />
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
