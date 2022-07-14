<template>
  <div :class="$style.root">
    <div :class="$style.controls">
      <button @click="drawPolyline">Path</button>
      <button @click="drawPolygon">Polygon</button>
      <button @click="drawCircle">Circle</button>
    </div>
    <div
      ref="container"
      :class="$style.map"></div>
  </div>
</template>

<script>
import { prepareFeatures } from '@/api/map.js';

export default {
  props: {
    center: {
      type: Array,
      default: () => ([]),
    },
    zoom: {
      type: Number,
      default: 15,
    },
    controls: {
      type: Array,
      default: () => ['zoomControl'],
    },
    lang: {
      type: String,
      default: 'ru_RU',
    },
    geoJson: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      ready: false,
      map: null,
      geoObject: {},
    };
  },
  mounted() {
    ymaps.ready(this.init);
  },
  methods: {
    async init() {
      this.map = new ymaps.Map(this.$refs.container, {
        center: this.center,
        controls: this.controls,
        zoom: this.zoom,
        lang: this.lang,
        coordorder: 'longlat',
      });
      this.map.setType('yandex#satellite');

      const circlesCollection = new ymaps.GeoObjectCollection({
        options: {
          zIndex: 10,
        },
      });

      this.geoJson.features.forEach(feature => {
        if (feature.geometry && feature.geometry.type == 'Point') {
          const circle = new ymaps.Circle([feature.geometry.coordinates, 10], {
            hintContent: feature.properties.description,
          }, {
            fillColor: feature.properties.fill,
            strokeColor: feature.properties.fill,
            strokeOpacity: feature.properties.fillOpacity || 1,
            strokeWidth: 3,
          });
          circlesCollection.add(circle);
        }
      });
      
      const objectManager = new ymaps.ObjectManager({
        options: {
          zIndex: 9,
        },    
      });

      this.geoObject = { ...this.geoJson, features: prepareFeatures(this.geoJson.features) };

      objectManager.add(this.geoObject);

      this.map.geoObjects
        .add(objectManager)
        .add(circlesCollection);
    },
    drawPolyline() {
       const polyline = new ymaps.Polyline([], {}, {
        editorDrawingCursor: "crosshair",
        fillColor: '#00FF00',
        strokeColor: '#0000FF',
        strokeWidth: 5,
      });

      this.map.geoObjects.add(polyline);
      polyline.editor.startDrawing();     
    },
    drawPolygon() {
      const polygon = new ymaps.Polygon([], {}, {
        editorDrawingCursor: "crosshair",
        fillColor: '#00FF00',
        strokeColor: '#0000FF',
        strokeWidth: 5,
      });

      polygon.events.add('editingstop',() => {
        console.log('polygon.getModel()');
      });

      this.map.geoObjects.add(polygon);
      polygon.editor.startDrawing();
    },
    drawCircle() {
      const cicrcle = new ymaps.Circle([], {}, {
        editorDrawingCursor: "crosshair",
        fillColor: '#FF0000',
        strokeColor: '#0000FF',
        strokeWidth: 5,
      });

      this.map.geoObjects.add(cicrcle);
      cicrcle.editor.startDrawing();      
    },
  },
};
</script>

<style module>
  .root {
    position: relative;
    size: 100%;
  }

  .map {
    position: absolute 0;
    z-index: 1;
  }

  .controls {
    position: absolute 0 * * 0;
    size: 100% 50px;
    z-index: 2;
  }
</style>
