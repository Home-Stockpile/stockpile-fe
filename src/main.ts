import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";

import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "/node_modules/primeflex/primeflex.css";

import TreeTable from "primevue/treetable";
import Column from "primevue/column";

import App from "./App.vue";

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue);

app.component("TreeTable", TreeTable);
app.component("Column", Column);

app.mount("#app");
