import axios from 'axios';

const API_KEY = '2cb0292b03fe9b2060d5bdfc7cc0c94b';
const BASE_URL = 'https://api.themoviedb.org/3';

const instance = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const fetchTrendingMovies = (page = 1) => {
  return instance.get('/trending/movie/week', { params: { page } });
};

export const searchMovies = (query, page = 1) => {
  return instance.get('/search/movie', { params: { query, page } });
};

export const fetchMovieDetails = (id) => {
  return instance.get(`/movie/${id}`, {
    params: { append_to_response: 'videos,credits' },
  });
};

export const fetchUpcomingMovies = (page = 1) => {
  return instance.get('/movie/upcoming', { params: { page } });
};

export const fetchGenres = () => {
  return instance.get('/genre/movie/list');
};

export const fetchMoviesByGenre = (genreId, page = 1) => {
  return instance.get('/discover/movie', {
    params: { with_genres: genreId, page },
  });
};

export const fetchRepresentativeMovie = (genreId) => {
  return instance.get('/discover/movie', {
    params: {
      with_genres: genreId,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 1000,
    },
  });
};
