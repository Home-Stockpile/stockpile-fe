import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import router from "./router";

import "./assets/reset.css";
import "./assets/base.css";

import "primevue/resources/themes/lara-light-purple/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import App from "./App.vue";

import Tree from "primevue/tree";
import PanelMenu from "primevue/panelmenu";
import Column from "primevue/column";
import Chip from "primevue/chip";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Breadcrumb from "primevue/breadcrumb";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Image from "primevue/image";
import FileUpload from "primevue/fileupload";
import SelectButton from "primevue/selectbutton";
import Sidebar from "primevue/sidebar";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue);
app.use(router);

app.component("Tree", Tree);
app.component("PanelMenu", PanelMenu);
app.component("Column", Column);
app.component("Chip", Chip);
app.component("Toolbar", Toolbar);
app.component("Button", Button);
app.component("InputNumber", InputNumber);
app.component("Textarea", Textarea);
app.component("Breadcrumb", Breadcrumb);
app.component("Dialog", Dialog);
app.component("InputText", InputText);
app.component("Image", Image);
app.component("FileUpload", FileUpload);
app.component("SelectButton", SelectButton);
app.component("Sidebar", Sidebar);
app.component("Dropdown", Dropdown);
app.component("Tag", Tag);

app.mount("#app");
