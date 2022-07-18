<template>
  <div :class="$style.root">
    <div :class="$style.controls">
      <x-button
        @click.native="drawFeature('Polyline')"
        icon="/public/icons/polyline-pt-svgrepo-com.svg"
        :class="$style.button"
      />
      <x-button
        @click.native="drawFeature('Polygon')"
        icon="/public/icons/polygon-pt-svgrepo-com.svg"
        :class="$style.button"
      />
      <x-button
        @click.native="drawFeature('Point')"
        icon="/public/icons/point-svgrepo-com.svg"
        :class="$style.button"
      />
      <select v-model="filter">
        <option value="all">All</option>
        <option value="LineString">Paths</option>
        <option value="Polygon">Polygons</option>
        <option value="Point">Points</option>
      </select>
    </div>
    <div
      ref="container"
      :class="$style.map"
    >
      <template v-if="map">
        <x-map-feature
          v-for="(feature, index) in features"
          :key="feature.id"
          :index="index"
          :map="map"
          v-bind="feature"
          @update="updateFeature"
        />
      </template>
    </div>
  </div>  
</template>

<script>
import XMapFeature from '@/components/x-map/x-map-feature.vue';
import XButton from '@/components/x-button.vue';

export default {
  components: {
    XMapFeature,
    XButton,
  },
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
      objectManager: null,
      newFeatures: [],
      fillColor: '#00ff00',
      strokeColor: '#0000ff',
      strokeWidth: 3,
      radius: 10,
      filter: 'all',
    };
  },
  computed: {
    features() {
      return this.geoJson.features
        .filter(feature => (feature.geometry.type === this.filter || this.filter === 'all'));
    },
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
      this.objectManager = new ymaps.ObjectManager({
        options: {
          zIndex: 9,
        },    
      });
    },
    drawFeature(type) {
      const style = {
        fillColor: this.fillColor,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
      };
      const feature = {
        type: 'Feature',
        id: null,
        geometry: {
          type,
          coordinates: [],
        },
        properties: {
          description: '',
          fill: this.fillColor,
          'fill-opacity': 0.6,
          stroke: this.strokeColor,
          'stroke-width': this.strokeWidth,
          'stroke-opacity': 0.9,
          zIndex: 1,
        },
      };
      if (type === 'Polygon') {
        feature.object = new ymaps.Polygon([], {}, { ...style, editorDrawingCursor: "crosshair" });
      }
      if (type === 'Polyline') {
        feature.object = new ymaps.Polyline([], {}, { ...style, editorDrawingCursor: "crosshair" });
      }
      if (type === 'Point') {
        feature.object = new ymaps.Circle([,this.radius], {}, { ...style, editorDrawingCursor: "crosshair" });
      }
      this.map.geoObjects.add(feature.object);
      this.newFeatures.push(feature);
      
      feature.object.editor.events.add('drawingstop', event => {
        event.originalEvent.target.stopDrawing();
        event.originalEvent.target.stopEditing();
        feature.geometry.coordinates = event.originalEvent.target.geometry.getCoordinates();
        console.log('drawingstop', this.newFeatures);
      });

      feature.object.editor.events.add('click', event => {
        event.originalEvent.target.editor.startDrawing();
      });

      feature.object.editor.startDrawing();
    },
    updateFeature(coordinates, index) {
      console.log('updateFeature', coordinates, index);
    },
  },
}
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
    display: flex;
    position: absolute 10px * * 0;
    box-sizing: border-box;
    size: 100% 26px;
    padding: 0 10px;
    z-index: 2;
  }

  .button {
    display: block;
    margin-right: 5px;
  }
</style>
