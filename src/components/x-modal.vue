<template>
  <Portal to="modals">
    <div v-show="isModalOpen" :class="$style.root">
      <div v-if="isHeader" :class="$style.head">
        <slot name="header">Title</slot>
      </div>
      <div :class="$style.body">
        <slot></slot>
      </div>
      <div v-if="isFooter" :class="$style.foot">
        <slot name="footer"></slot>
      </div>
    </div>
  </Portal>
</template>

<script>
import { EventBus } from '@/components/event-bus.js';

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isModalOpen: false,
    };
  },
  computed: {
    isHeader() {
      return !!this.$slots.header;
    },
    isFooter() {
      return !!this.$slots.footer;
    },
  },
  watch: {
    isOpen() {
      EventBus.$emit('show-overlay');
      this.isModalOpen = true;
    },
  },
}
</script>

<style module>
  .root {
    position: absolute 50% * * 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 5px;
    z-index: 11;
  }

  .head {
    padding: 16px 16px 0;
  }

  .body {
    padding: 16px;
  }

  .foot {
    padding: 0 16px 16px;
  }
</style>
