import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import TDesign from "tdesign-vue-next";
import "element-plus/dist/index.css";
import "tdesign-vue-next/es/style/index.css";
import "@jiahong/ui/styles.css";
import "@jiahong/ui/fonts.css";
import "@/styles/main.css";
import App from "@/App.vue";
import { router } from "@/router";

createApp(App).use(createPinia()).use(router).use(ElementPlus).use(TDesign).mount("#app");
