<template>
  <button :class="{
    [$style.root]: true,
    [$style.withIcon]: icon,
  }">
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
    padding: 1px 10px;
    height: 26px;
    cursor: pointer;
  }

  .withIcon {
    padding: 1px;
    width: 26px;
  }

  .icon {
    size: 20px;
  }
</style>
