<template>
  <x-modal
    :is-open="isOpen"
    name="colorsForm"
    :class="$style.root"
    @close="$emit('close')"
  >
    <template #header><h2 :class="$style.title">Выбор цвета</h2></template>
    <div :class="$style.body">
      <h2 :class="$style.capture">Фон</h2>
      <v-swatches
        v-model="currFillColor"
        inline
        row-length="8"
        swatch-size="48"
        :class="$style.swatches"
        @input="$emit('input-fill-color', currFillColor)"
      />
      <h2 :class="$style.capture">Обводка</h2>
      <v-swatches
        v-model="currStrokeColor"
        inline
        row-length="8"
        swatch-size="48"
        :class="$style.swatches"
        @input="$emit('input-stroke-color', currStrokeColor)"
      />
    </div>
    <template #footer>
      <x-button
        @click.native="close"
        theme="blue"
      >Ok</x-button>
    </template>
  </x-modal>
</template>

<script>
import XModal from '@/components/x-modal.vue'
import XButton from '@/components/x-button.vue';
import VSwatches from 'vue-swatches';
import { EventBus } from '@/components/event-bus.js';

export default {
  components: {
    XModal,
    XButton,
    VSwatches,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    fillColor: {
      type: String,
      default: '',
    },
    strokeColor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currFillColor: this.fillColor,
      currStrokeColor: this.strokeColor,
    };
  },
  methods: {
    close() {
      EventBus.$emit('hide-overlay');
      this.$emit('close');
    },
  },
}
</script>

<style module src="./x-modal.css"></style>
