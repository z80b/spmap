const data = require('./spmap.json');
const fs = require('fs');

const decodePath = (encodedPath = '', precision = 5) => {
  const factor = Math.pow(10, precision);

  const len = encodedPath.length;

  // For speed we preallocate to an upper bound on the final length, then
  // truncate the array before returning.
  const path = new Array(Math.floor(encodedPath.length / 2));
  let index = 0;
  let lat = 0;
  let lng = 0;
  let pointIndex = 0;

  // This code has been profiled and optimized, so don't modify it without
  // measuring its performance.
  for (; index < len; ++pointIndex) {
    // Fully unrolling the following loops speeds things up about 5%.
    let result = 1;
    let shift = 0;
    let b = 0;
    do {
      // Invariant: "result" is current partial result plus (1 << shift).
      // The following line effectively clears this bit by decrementing "b".
      b = encodedPath.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f); // See note above.
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 1;
    shift = 0;
    do {
      b = encodedPath.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    path[pointIndex] = [lng / factor, lat / factor];
  }
  // truncate array
  path.length = pointIndex;

  return path;
};

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data), {
      encoding:'utf8',
      flag:'w'
    });
  } catch (err) {
    console.error(err);
  }
}

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);
const geojson = {
  type: 'FeatureCollection',
  features: Object.keys(data)
    .filter(key => data[key].type == 'polygon')
    .map((key, index) => {
      const item = data[key];
      const path = decodePath(item.path, 5);
      if (path.length > 3) return {
        type: 'Feature',
        id: index,
        geometry: {
          type: capitalize(item.type),
          coordinates: [[...path, path[0]]],
        },
        properties: {
          description: unescape(item.description),
          fill: item.color,
          'fill-opacity': 0.6,
          srtoke: item.color,
          'stroke-width': '3',
          'stroke-opacity': 0.9,
        },
      };
    })
    .filter(item => item),
};

storeData(geojson, './geojson.json');
