import axios from 'axios';

const pathParts = document.location.pathname.split('/');

const apiClient = axios.create({
  baseURL: '/api',// pathParts.length > 2 ? `/${pathParts[1]}` : '/',
  headers: {
    'Content-Type': 'application/json',
    
  },
});

const apiPostsClient = axios.create({
  baseURL: '/api',// pathParts.length > 2 ? `/${pathParts[1]}` : '/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    
  },
});

export const getGeoJson = () => apiClient.get('geojson.json')
  .then(response => response.data)
  .catch(error => Promise.reject({}));

export const saveFeatures = (features) => apiPostsClient.post('save', features)
  .then(response => response.data)
  .catch(error => Promise.reject({}));

export const cdn = name => `https://a.lmcdn.ru/files/cms/${name}`;
