export const prepareFeatures = (features) => features
  .map(function (feature) {
    if (feature.geometry && feature.geometry.type === 'LineString') return {
      ...feature,
      options: {
        strokeColor: feature.properties.fill,
        fillOpacity: feature.properties.fillOpacity,     
        fillColor: feature.properties.fill,
        strokeWidth: 3,
        zIndex: 7,
      },
      properties: {
        hintContent: feature.properties.description,
      },
    };
    if (feature.geometry && feature.geometry.type === 'Polygon') return {
      ...feature,
      options: {
        strokeColor: feature.properties.fill,
        fillOpacity: feature.properties.fillOpacity,     
        fillColor: feature.properties.fill,
        strokeWidth: 2,
        zIndex: 8,
      },
      properties: {
        hintContent: feature.properties.description,
      },
    };
  })
  .filter( function(feature) { return feature; });
