import { capitalize, decodeGooglePath } from './utils.js';

export const getPolygon = (data, id) => {
  const path = decodeGooglePath(data.path);
  return {
    type: 'Feature',
    id,
    geometry: {
      type: capitalize(data.type),
      coordinates: [[...path, path[0]]],
    },
    properties: {
      description: unescape(data.description),
      fill: data.color,
      'fill-opacity': 0.6,
      srtoke: data.color,
      'stroke-width': '3',
      'stroke-opacity': 0.9,
    },
  };
};

export const getPoint = () => {};
