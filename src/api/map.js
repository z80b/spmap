export const prepareFeatures = (features) => features
  .map(feature => ({
    type: feature.type,
    id: feature.id,
    geometry: feature.geometry,
    options: {
      strokeColor: feature.properties.fill,
      fillOpacity: feature.properties['fill-opacity'],     
      fillColor: feature.properties.fill,
      strokeWidth: feature.properties['stroke-width'],
      zIndex: feature.properties['z-index'],
    },
    properties: {
      hintContent: feature.properties.description,
    },
  }))
  .filter(feature => ['Polygon', 'LineString'].includes(feature.geometry.type));
