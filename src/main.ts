import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

import "./assets/reset.css";
import "./assets/base.css";

import "@quasar/extras/material-icons/material-icons.css";

import App from "./App.vue";
import { Quasar } from "quasar";
import "quasar/src/css/index.sass";

import "@quasar/extras/material-icons/material-icons.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Quasar, {
  plugins: {},
});

app.mount("#app");
