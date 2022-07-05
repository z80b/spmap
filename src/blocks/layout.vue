<template>
  <div :class="$style.root">
    <page-header
      title="Page header !!!"
      :class="$style.head"
    />
    <div :class="$style.body">
      <slot></slot>
    </div>
    <div :class="$style.foot">Footer</div>
  </div>  
</template>

<script>
import PageHeader from '@/blocks/page-header.vue';

export default {
  components: {
    PageHeader,
  },
};
</script>

<style module>
  .head {
    width: 100%;
    padding: 24px;
    border: solid 1px #ddd;
  }
</style>