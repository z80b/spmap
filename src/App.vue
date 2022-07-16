<template>
  <compoment
    v-if="geoJson"
    :is="componentName"
    :center="[38.13474655151367, 56.30696750781204]"
    :zoom="15"
    :geo-json="geoJson"
  />
</template>

<script>
import { getGeoJson } from '@/api/requests.js';
import XMap from '@/components/x-map/x-map.vue';
import XMapEditor from '@/components/x-map/x-map-editor.vue';

export default {
  components: {
    XMap,
    XMapEditor,
  },
  data() {
    return {
      geoJson: null,
    };
  },
  computed: {
    componentName() {
      return document.location.search.match(/mode=edit/i)
        ? XMapEditor
        : XMap;
    },
  },
  async mounted() {
    this.geoJson = await getGeoJson();
  },
};
</script>
