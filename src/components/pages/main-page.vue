<template>
  <x-map/>
</template>

<script>
import XMap from '@/components/x-map/x-map.vue';

export default {
  components: {
    XMap,
  },
};
</script>


<style module>
  %base {
    font: 500 16px/20px Arial;
    color: #000;
  }
  .root {
    @extend %base;
  }

  .head {
    @extend %base;
    color: #ff0000;
  }
</style>
