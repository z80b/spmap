import Vue from 'vue';
import VueCompositionAPI, { createApp } from '@vue/composition-api';
import PortalVue from 'portal-vue';
import App from '@/map-editor.vue';
import i18n from '@/i18n';
import '@/styles/app.css';

Vue.config.productionTip = false;

Vue.use(VueCompositionAPI);
Vue.use(PortalVue);

const app = createApp({
  render: (h) => h(App),
  i18n,
});

app.mount('#content');

