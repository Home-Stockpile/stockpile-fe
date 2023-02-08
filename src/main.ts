import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

import "./assets/reset.css";
import "./assets/base.css";
import "quasar/dist/quasar.addon.css";
import "@quasar/extras/material-icons/material-icons.css";

import App from "./App.vue";
import { Dialog, Notify, Quasar } from "quasar";
import "quasar/src/css/index.sass";

import { messages } from "./i18n";

import { createI18n } from "vue-i18n";

export const i18n = createI18n({
  locale: "en",
  globalInjection: true,
  messages,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Quasar, {
  plugins: { Dialog, Notify },
});
app.use(i18n);
app.mount("#app");
