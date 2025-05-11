import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchGenres, fetchMoviesByGenre, fetchRepresentativeMovie } from '../api/tmdb';
import MovieCard from './MovieCard';
import Navbar from './Navbar';
import './Recommendations.css';

export default function Recommendations() {
  const { genreId } = useParams();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [genreImages, setGenreImages] = useState({});

  // Fetch genres and images for each genre
  useEffect(() => {
    const getGenresAndImages = async () => {
      try {
        const res = await fetchGenres();
        const genreList = res.data.genres;
        setGenres(genreList);

        // Fetch poster image for each genre
        const images = {};
        await Promise.all(
          genreList.map(async (genre) => {
            try {
              const movieRes = await fetchRepresentativeMovie(genre.id);
              const poster = movieRes.data.results[0]?.poster_path;
              images[genre.id] = poster
                ? `https://image.tmdb.org/t/p/w500${poster}`
                : 'https://i.imgur.com/qxjZ4b5.jpg';
            } catch {
              images[genre.id] = 'https://i.imgur.com/qxjZ4b5.jpg';
            }
          })
        );
        setGenreImages(images);
      } catch (err) {
        console.error('Error fetching genres and images:', err);
      }
    };
    getGenresAndImages();
  }, []);

  // Fetch movies when genreId changes
  useEffect(() => {
    if (!genreId) return;
    const getMovies = async () => {
      try {
        setError(null);
        const res = await fetchMoviesByGenre(genreId, page);
        setMovies(res.data.results);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch movies.');
      }
    };
    getMovies();
  }, [genreId, page]);

  // Show movies for a selected genre
  if (genreId) {
    return (
      <div className="container">
        <Navbar />
        <div className="genre-title">
          <h2>Movies in this Genre </h2>
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

  // Show genre selection with dynamic images
  return (
    <div className="container">
      <Navbar />
      <h2 className="genre-title">Select a Genre</h2>
      <div className="genre-container">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className="genre-card"
            onClick={() => navigate(`/recommendations/${genre.id}`)}
          >
            <img
              src={genreImages[genre.id] || 'https://r2.erweima.ai/imgcompressed/img/compressed_2fee8a303243ea983cd79b68dc89bfd2.webp'}
              alt={genre.name}
              className="genre-image"
            />
            <h3>{genre.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
