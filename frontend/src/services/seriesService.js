import axios from 'axios';

// Base URL points to the gateway path for the series API
const API_BASE_URL = '/api/series';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSeries = async () => {
  try {
    const response = await apiClient.get(''); // GET request to /api/series
    return response.data; // Expects an array of series objects
  } catch (error) {
    console.error('Error fetching series:', error.response || error.message);
    throw error; // Re-throw to be caught by the component
  }
};

export const getSeriesById = async (id) => {
  try {
    const response = await apiClient.get(`/${id}`); // GET /api/series/{id}
    return response.data;
  } catch (error) {
    console.error(`Error fetching series ${id}:`, error.response || error.message);
    throw error;
  }
};

export const createSeries = async (seriesData) => {
  try {
    const response = await apiClient.post('', seriesData); // POST /api/series
    return response.data;
  } catch (error) {
    console.error('Error creating series:', error.response || error.message);
    throw error;
  }
}; 