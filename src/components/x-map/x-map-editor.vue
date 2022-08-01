<template>
  <div :class="$style.root">
    <div :class="$style.controls">
      <x-button
        @click.native="drawFeature('LineString')"
        icon="polyline-pt-svgrepo-com.svg"
        :class="$style.button"
      />
      <x-button
        @click.native="drawFeature('Polygon')"
        icon="polygon-pt-svgrepo-com.svg"
        :class="$style.button"
      />
      <x-button
        @click.native="drawFeature('Point')"
        icon="point-svgrepo-com.svg"
        :class="$style.button"
      />
      <x-button
        :disabled="!currentObject"
        :class="$style.button"
        @click.native="remove"
      >Удалить</x-button>
      <x-button
        :disabled="!toSave.length"
        :class="$style.saveButton"
        @click.native="save"
      >Сохранить</x-button>
    </div>
    <div ref="container" :class="$style.map"></div>
    <PortalTarget name="modals"/>
    <div v-if="isOverlayVisible" :class="$style.overlay"></div>
    <x-modal :is-open="isModalOpen">
      <template #header>!!!!</template>
      <h1>Preved !!!</h1>
    </x-modal>
  </div>  
</template>

<script>
import Vue from 'vue';
import XMapFeature from '@/components/x-map/x-map-feature.vue';
import XModal from '@/components/x-modal.vue'
import XButton from '@/components/x-button.vue';
import { saveFeatures } from '@/api/requests';
import { EventBus } from '@/components/event-bus.js';

export default {
  components: {
    XMapFeature,
    XModal,
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
      isOverlayVisible: false,
      isModalOpen: false,

      map: null,
      objectManager: null,
      featuresCollection: null,
      circlesCollection: null,

      features: [],
      currentObject: null,
      currentFeature: null,

      fillColor: '#00ff00',
      strokeColor: '#0000ff',
      strokeWidth: 3,
      radius: 10,
      filter: 'all',
    };
  },
  computed: {
    toSave() {
      return this.features.filter(feature => feature.status);
    },
  },
  mounted() {
    EventBus.$on('show-overlay', () => { this.isOverlayVisible = true });
    EventBus.$on('hide-overlay', () => { this.isOverlayVisible = false });
    this.features = this.geoJson.features;
    ymaps.ready(this.init);
  },
  methods: {
    remove() {
      this.featuresCollection.remove(this.currentObject);
      this.saveFeature(this.currentFeature, 'deleted');
      this.currentObject = null;
    },
    save() {
      saveFeatures(this.toSave);
      this.features = this.features.map(feature => ({ ...feature, status: '' }));
    },
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

      this.featuresCollection = new ymaps.GeoObjectCollection({
        options: {
          zIndex: 9,
        },
      });

      this.circlesCollection = new ymaps.GeoObjectCollection({
        options: {
          zIndex: 10,
        },
      });

      this.features.forEach(feature => {
        let _feature;
        if (feature.geometry.type === 'Point') {
          _feature = new ymaps.Circle(
            [feature.geometry.coordinates, 10],
            feature.properties,
            feature.options
          );
        } else {
          _feature = new ymaps.GeoObject({
            geometry: feature.geometry,
            properties: feature.properties,
          }, feature.options);
        }
        _feature.events.add('click', event => this.onFeatureClick(_feature, feature));
        _feature.events.add('contextmenu', event => this.openModal(_feature, feature));
        _feature.editor.events.add(['editingstop', 'drawingstop'], event => this.onStopEditing(event, _feature, feature));
        this.featuresCollection.add(_feature);
      });

      this.map.geoObjects
        .add(this.featuresCollection)
        .add(this.circlesCollection);
    },
    drawFeature(type) {
      let feature;
      const style = {
        fillColor: this.fillColor,
        fillOpacity: 0.6,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        strokeOpacity: 0.9,
        editorDrawingCursor: 'crosshair',
      };
      const geoData = {
        type: 'Feature',
        id: `new-${this.features.length}`,
        geometry: {
          type,
        },
        properties: style,
        status: 'new',
      };
      if (type === 'Point') {
        feature = new ymaps.Circle([,this.radius], {}, { ...style, editorDrawingCursor: "crosshair" });
      } else {
        feature = new ymaps.GeoObject({
          geometry: { type }
        }, style);
      }
      this.map.geoObjects.add(feature);
      feature.editor.events.add('drawingstop', event => this.onStopEditing(event, feature, geoData));
      feature.events.add('click', event => this.onFeatureClick(feature, geoData));
      feature.events.add('contextmenu', event => this.openModal(feature, geoData));
      feature.editor.startDrawing();
    },
    onFeatureClick(object, feature) {
      this.currentObject = object;
      this.currentFeature = feature;
      object.editor.startEditing();
    },
    onStopEditing(event, object, feature) {
      const target = event.get('target');
      const coordinates = object.geometry.getCoordinates();
      target.stopDrawing();
      target.stopEditing();

      feature.geometry.coordinates = coordinates;

      if (!feature.status) {
        feature.status = 'updated';
      }

      this.saveFeature(feature);
      this.currentObject = null;
    },
    saveFeature(feature, status = '') {
      if (status) {
        feature.status = status;
      }
      if (feature.id) {
        const featureIndex = this.features.findIndex(_feature => _feature.id === feature.id);
        if (featureIndex >= 0) {
          Vue.set(this.features, featureIndex, feature)
        } else {
          this.features.push(feature);
        }
      } else {
        this.features.push(feature);
      }
    },
    openModal() {
      console.log('openModal');
      this.isModalOpen = true;
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

  .overlay {
    position: absolute 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }

  .button {
    display: block;
    margin-right: 5px;
  }

  .saveButton {
    display: block;
    margin-left: 16px;
  }
</style>
