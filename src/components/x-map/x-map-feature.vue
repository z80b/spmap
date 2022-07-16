<script>
export default {
  props: {
    map: {
      type: Object,
      default: () => ({}),     
    },
    id: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: '',
    },
    geometry: {
      type: Object,
      default: () => ({}),
    },
    properties: {
      type: Object,
      default: () => ({}),     
    },
    object: {
      type: Object,
      default: null,     
    },
  },
  data() {
    return {
      feature: null,
    };
  },
  mounted() {
    if (!this.id && this.object) {
      this.object.editor.events.add('drawingstop', event => {
        event.originalEvent.target.stopEditing();
        const coordinates = this.object.geometry.getCoordinates();
        console.log('drawingstop', coordinates);
      });
      // this.object.geometry.events.add('change', event => {
      //   const model = event.get('newCoordinates');
      //   console.log('drawingstop', model);
      // });
      return;
    }
    const style = {
      fillColor: this.properties.fill,
      strokeColor: this.properties.fill,
      strokeOpacity: this.properties.fillOpacity || 1,
      strokeWidth: 3,
      opacity: this.properties.fillOpacity || 1,
    };
    switch (this.geometry.type) {
      case 'Polygon':
        this.feature = new ymaps.Polygon(
          this.geometry.coordinates,
          {
            hintContent: this.properties.description,
          },
          style
        );
        break;
      case 'LineString':
        this.feature = new ymaps.Polyline(
          this.geometry.coordinates,
          {
            hintContent: this.properties.description,
          },
          style
        );
        break;
      case 'Point':
        this.feature = new ymaps.Circle([this.geometry.coordinates, 10], {
            hintContent: this.properties.description,
          },
          style);
        break;
    }
    if (this.feature) {
      this.map.geoObjects.add(this.feature);
      this.feature.events.add('click', event => {
        this.feature.editor.startDrawing();
      });
      this.feature.editor.events.add('drawingstop', event => {
        event.originalEvent.target.stopDrawing();
        event.originalEvent.target.stopEditing();
        this.$emit('update', event.originalEvent.target.geometry.getCoordinates(), this.index);
      });
    }
  },
  render() {
    return null;
  },
}
</script>
