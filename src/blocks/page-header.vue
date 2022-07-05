<template>
  <div :class="$style.root">
    <div :class="$style.title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style module>
  .title {
    font-size: 32px;
  }
</style>
