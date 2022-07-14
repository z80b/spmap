<template>
  <x-map
    v-if="geoJson"
    :center="[38.13474655151367, 56.30696750781204]"
    :zoom="15"
    :geo-json="geoJson"
  />
</template>

<script>
import { getGeoJson } from '@/api/requests.js';
import XMap from '@/components/x-map/x-map.vue';

export default {
  components: {
    XMap,
  },
  data() {
    return {
      geoJson: null,
    };
  },
  async mounted() {
    this.geoJson = await getGeoJson();
    console.log('getGeoJson', this.geoJson)
  },
};
</script>
