<template>
  <div :class="$style.root">
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
      map: null,
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
      this.map.geoObjects.events.add('editingstop', this.editingStop);

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

      circlesCollection.events.add('click', this.mapClick);
      objectManager.events.add('click', () => { console.log('clickFeature') });

      objectManager.add({
        type: 'FeatureCollection',
        features: this.geoJson.features.filter(feature => feature.geometry.type !== 'Point'),
      });



      this.map.geoObjects
        .add(objectManager)
        .add(circlesCollection);
    },
    mapClick(event) {
      const target = event.get('target');
      target.editor.startEditing();
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
