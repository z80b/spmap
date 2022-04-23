import { decodeGooglePath } from './utils.js';

export const getPolygon = (data, id) => {
  const path = decodeGooglePath(data.path);
  if (path.length > 2) return {
    type: 'Feature',
    id,
    geometry: {
      type: 'Polygon',
      coordinates: [[ ...path, path[0] ]],
    },
    properties: {
      description: unescape(data.description),
      fill: data.color,
      fillOpacity: 0.6,
      srtoke: data.color,
      strokeWidth: 1,
      strokeOpacity: 0.9,
      zIndex: 0,
    },
    style: {
      'fill-color': data.color,
      'fill-opacity': 0.6,
    },
    hintContent: unescape(data.description),
    fillColor: data.color,
  };
};

export const getLineString = (data, id) => {
  const path = decodeGooglePath(data.path);
  if (path.length > 1) return {
    type: 'Feature',
    id,
    geometry: {
      type: 'LineString',
      coordinates: [ ...path ],
    },
    properties: {
      description: unescape(data.description),
      fill: data.color,
      'fill-opacity': 0.6,
      srtoke: data.color,
      'stroke-width': '3',
      'stroke-opacity': 0.9,
      zIndex: 1,
    },
  };  
};

export const getCircle = (data, id) => {
  return {
    type: 'Feature',
    id,
    geometry: {
      type: 'Point',
      kind: 'c',
      coordinates: [ data.lng, data.lat, 'c' ],
    },
    properties: {
      radius: data.radius,
      description: unescape(data.description),
      fill: data.color,
      'fill-opacity': 0.6,
      srtoke: data.color,
      'stroke-width': '3',
      'stroke-opacity': 0.9,
      zIndex: 2,
    },    
  };
};