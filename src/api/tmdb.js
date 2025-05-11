import axios from 'axios';

const API_KEY = '2cb0292b03fe9b2060d5bdfc7cc0c94b';
const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://api.themoviedb.org/3';

export const fetchTrendingMovies = (page = 1) => {
  return axios.get(`${BASE_URL}/trending/movie/week`, {
    params: {
      api_key: API_KEY,
      page,
    },
  });
};

export const searchMovies = (query, page = 1) => {
  return axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: API_KEY,
      query,
      page,
    },
  });
};

export const fetchMovieDetails = (id) => {
  return axios.get(`${BASE_URL}/movie/${id}`, {
    params: {
      api_key: API_KEY,
      append_to_response: 'videos,credits,watch/providers',
    },
  });
};

export const fetchUpcomingMovies = (page = 1) => {
  return axios.get(`${BASE_URL}/movie/upcoming`, {
    params: {
      api_key: API_KEY,
      page
    }
  });
};


export const fetchGenres = () => {
  return axios.get(`${BASE_URL}/genre/movie/list`, {
    params: {
      api_key: API_KEY,
    },
  });
};

export const fetchMoviesByGenre = (genreId, page = 1) => {
  return axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: API_KEY,
      with_genres: genreId,
      page: page,
    },
  });
};

export const fetchRepresentativeMovie = (genreId) => {
  return axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: API_KEY,
      with_genres: genreId,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 1000,  // Only include well-rated, widely-voted movies
      page: 1,
    },
  });
};




