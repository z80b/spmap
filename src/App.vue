<template>
  <x-map
    :center="[56.30696750781204, 38.13474655151367]"
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
      geoJson: {},
    };
  },
  async mounted() {
    this.geoJson = await getGeoJson();
  },
};
</script>
