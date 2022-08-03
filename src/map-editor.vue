<template>
  <x-map-editor
    v-if="geoJson"
    :center="[38.13474655151367, 56.30696750781204]"
    :zoom="15"
    :geo-json="geoJson"
  />
</template>

<script>
import { getGeoJson } from '@/api/requests.js';
import XMapEditor from '@/components/x-map/x-map-editor.vue';

export default {
  components: {
    XMapEditor,
  },
  data() {
    return {
      geoJson: null,
    };
  },
  async mounted() {
    this.geoJson = await getGeoJson();
  },
};
</script>

<style module>
:root {
  --titleColor: #000;

  --titleFont: 700 24px/30px Arial;
}
</style>