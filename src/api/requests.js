import axios from 'axios';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getGeoJson = () => apiClient.get('/spmap/geojson.json')
  .then(response => response.data)
  .catch(error => Promise.reject({}));
