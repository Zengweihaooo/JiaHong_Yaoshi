import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import RecordsView from "@/views/RecordsView.vue";
import QuickConsultView from "@/views/QuickConsultView.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "嘉虹健康药师端首页" }
    },
    {
      path: "/records",
      name: "records",
      component: RecordsView,
      meta: { title: "问诊记录" }
    },
    {
      path: "/quick-consult",
      name: "quick-consult",
      component: QuickConsultView,
      meta: { title: "快速问诊" }
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/"
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

router.afterEach((to) => {
  document.title = to.meta.title || "嘉虹健康药师端";
});
