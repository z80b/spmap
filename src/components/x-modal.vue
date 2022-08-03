<template>
  <Portal :to="name">
    <div v-show="isModalOpen" :class="$style.root">
      <div
        :class="$style.close"
        @click="closeModal"
      ></div>
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
    name: {
      type: String,
      default: '',
    },
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
    isOpen(value) {
      if (value) {
        EventBus.$emit('show-overlay');
      }
      this.isModalOpen = value;
    },
  },
  methods: {
    closeModal() {
      EventBus.$emit('hide-overlay');
      this.$emit('close');
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
    box-shadow: 4px 4px 15px 0px #000;
  }

  .close {
    position: absolute -4px -30px * *;
    size: 24px;
    background-image: url('/sites/all/modules/spmap/static/imgs/cross.svg');
    transition: ease 0.5s opacity;
    cursor: pointer;
  }

  .close:hover {
    opacity: 0.6;
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
