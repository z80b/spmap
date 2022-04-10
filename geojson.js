import { createRequire } from 'module'
import { getPolygon } from './geometry.js';
import { storeData } from './utils.js';

const require = createRequire(import.meta.url);
const data = require('./spmap.json');
const geojson = {
  type: 'FeatureCollection',
  features: Object.keys(data)
    .filter(key => data[key].type == 'polygon')
    .map((key, index) => getPolygon(data[key], index))
    .filter(item => item),
};

storeData(geojson, './geojson.json');
