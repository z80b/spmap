<template>
  <div
    ref="container"
    :class="$style.root"></div>
</template>

<script>
import ymaps from 'ymaps';
// import { loadYmap } from 'vue-yandex-maps';
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
      geoObject: {},
    };
  },
  async mounted() {
    const maps = await ymaps.load();
    this.map = new maps.Map(this.$refs.container, {
      center: this.center,
      controls: this.controls,
      zoom: this.zoom,
      lang: this.lang,
      coordorder: 'longlat',
    });
    this.map.setType('yandex#satellite');

    const circlesCollection = new maps.GeoObjectCollection({
      options: {
        zIndex: 10,
      },
    });

    this.geoJson.features.forEach(feature => {
      if (feature.geometry && feature.geometry.type == 'Point') {
        const circle = new maps.Circle([feature.geometry.coordinates, 10], {
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
    
    // const objectManager = new ymaps.ObjectManager({
    //   options: {
    //     zIndex: 9,
    //   },    
    // });

    // this.geoObject = { ...this.geoJson, features: prepareFeatures(this.geoJson.features) };

    // objectManager.add(this.geoObject);
    this.map.geoObjects.add(circlesCollection);
  },
};
</script>

<style module>
  .root {
    size: 100%;
  }
</style>
