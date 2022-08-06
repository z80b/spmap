<template>
  <x-modal
    :is-open="isOpen"
    name="dataForm"
    :class="$style.root"
    @close="$emit('close')"
  >
    <template #header>
      <div :class="$style.title">Параметры объекта</div>
    </template>
    <div :class="$style.body">
      <h2 :class="$style.capture">Описание</h2>
      <vue-editor
        v-model="currHintContent"
        :editor-toolbar="$options.editor"
        :class="$style.description"
      ></vue-editor>
      <h2 :class="$style.capture">Фон</h2>
      <v-swatches
        v-model="currFillColor"
        inline
        row-length="8"
        swatch-size="48"
        :class="$style.swatches"
      />
      <h2 :class="$style.capture">Обводка</h2>
      <v-swatches
        v-model="currStrokeColor"
        inline
        row-length="8"
        swatch-size="48"
        :class="$style.swatches"
      />
    </div>
    <template #footer>
      <x-button theme="blue" @click.native="save">Сохранить</x-button>
      <x-button theme="blue" @click.native="$emit('close')">Отмена</x-button>
    </template>
  </x-modal>
</template>

<script>
import Vue from 'vue';
import XModal from '@/components/x-modal.vue'
import XButton from '@/components/x-button.vue';
import VSwatches from 'vue-swatches';
import { VueEditor } from "vue2-editor";


export default {
  editor: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
  components: {
    XModal,
    XButton,
    VSwatches,
    VueEditor,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    geoObject: {
      type: Object,
      default: null,
    },
    hintContent: {
      type: String,
      default: '',      
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
      result: {
        options: {
          fillColor: '',
          strokeColor: '',
        },
        properties: {
          hintContent: '',
        },
      },
    };
  },
  computed: {
    currFillColor: {
      get() {
        return this.geoObject
          ? this.result.options.fillColor || this.geoObject.options.fillColor
          : this.result.options.fillColor || '';
      },
      set(value) { this.result.options.fillColor = value },
    },
    currStrokeColor: {
      get() {
        return this.geoObject
          ? this.result.options.strokeColor || this.geoObject.options.strokeColor
          : this.result.options.strokeColor || '';
      },
      set(value) { this.result.options.strokeColor = value },
    },
    currHintContent: {
      get() {
        return this.geoObject
          ? this.result.properties.hintContent || this.geoObject.properties.hintContent
          : this.result.properties.hintContent || '';
      },
      set(value) { this.result.properties.hintContent = value },
    },
  },
  methods: {
    save() {
      this.$emit('close');
      this.$emit('change', {
        type: 'Feature',
        id: this.geoObject.id,
        geometry: this.geoObject.geometry,
        options: {
          ...this.geoObject.options,
          fillColor: this.currFillColor,
          strokeColor: this.currStrokeColor,
        },
        properties: {
          hintContent: this.result.properties.hintContent,
        },
        status: this.geoObject.status,
      });
    },
  },
}
</script>

<style module src="./x-modal.css"></style>

