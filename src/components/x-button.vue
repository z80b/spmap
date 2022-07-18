<template>
  <button :class="$style.root">
    <slot>
      <img :src="icon" :class="$style.icon"/>
    </slot>
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
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
