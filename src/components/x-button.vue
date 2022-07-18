<template>
  <button :class="$style.root">
    <slot>
      <img :src="cdn(icon)" :class="$style.icon"/>
    </slot>
  </button>
</template>

<script>
import { cdn } from '@/api/requests.js';

export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
  methods: {
    cdn,
  },
}
</script>

<style module>
  .root {
    padding: 1px;
    size: 26px;
    cursor: pointer;
  }

  .icon {
    size: 20px;
  }
</style>
