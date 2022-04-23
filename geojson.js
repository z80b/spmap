import { createRequire } from 'module'
import { getPolygon, getLineString, getCircle } from './geometry.js';
import { storeData } from './utils.js';

const require = createRequire(import.meta.url);
const data = require('./spmap.json');
const geojson = {
  type: 'FeatureCollection',
  features: Object.keys(data)
    .map((key, index) => {
      switch (data[key].type) {
        case 'polygon': return getPolygon(data[key], index);
        case 'polyline': return getLineString(data[key], index);
        case 'circle': return getCircle(data[key], index);
      }
    })
    .filter(item => item),
};

storeData(geojson, './geojson.json');
