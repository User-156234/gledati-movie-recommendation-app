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
