export const prepareFeatures = (features) => features
  .map(function (feature) {
    if (feature.geometry && ['LineString', 'Polygon'].includes(feature.geometry.type)) return {
      ...feature,
      options: {
        color: feature.properties.fill,
        stroke: feature.properties.fill,
        fillOpacity: feature.properties.fillOpacity,     
        fillColor: feature.properties.fill,
        strokeWidth: 3,
        zIndex: 9,
      },
    };
    if (feature.geometry && feature.geometry.type == 'Point') {
      const circle = new ymaps.Circle([feature.geometry.coordinates, 10], {
        hintContent: feature.properties.description,
      }, {
        fillColor: feature.properties.fill,
        strokeColor: feature.properties.fill,
        strokeOpacity: feature.properties.fillOpacity,
        strokeWidth: 3,
      });
      // circlesCollection.add(circle);
    }
  })
  .filter( function(feature) { return feature; });
