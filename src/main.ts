import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";

import "./assets/reset.css";
import "./assets/base.css";

import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import "/node_modules/primeflex/primeflex.css";

import Tree from "primevue/tree";
import PanelMenu from "primevue/panelmenu";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Breadcrumb from "primevue/breadcrumb";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue);
app.use(router);

app.component("Tree", Tree);
app.component("PanelMenu", PanelMenu);
app.component("Column", Column);
app.component("Tag", Tag);
app.component("Toolbar", Toolbar);
app.component("Button", Button);
app.component("InputNumber", InputNumber);
app.component("Textarea", Textarea);
app.component("Breadcrumb", Breadcrumb);

app.mount("#app");
