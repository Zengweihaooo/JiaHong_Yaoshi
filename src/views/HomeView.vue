<template>
  <div class="home-page">
    <div class="home-page__canvas">
      <img
        class="home-page__image"
        :src="homepageImage"
        alt="嘉虹健康药师端首页"
        draggable="false"
      />

      <button
        v-for="spot in hotspots"
        :key="spot.id"
        class="home-hotspot"
        type="button"
        :aria-label="spot.label"
        :style="spotStyle(spot)"
        @click="spot.action"
      />
    </div>

    <ConsultTypeDialog
      :visible="showConsultTypeDialog"
      @close="showConsultTypeDialog = false"
    />

    <button class="home-ab-entry" type="button" @click="goAbTest">AB 测试</button>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import ConsultTypeDialog from "@/components/home/ConsultTypeDialog.vue";
import { useConsultStore } from "@/stores/consult";

const DESIGN_W = 2880;
const DESIGN_H = 1800;

const homepageImage = computed(() => {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}images/homepage.png`;
});

const router = useRouter();
const consultStore = useConsultStore();
const showConsultTypeDialog = ref(false);

function goHome() {
  router.push({ name: "home" });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goRecords() {
  router.push({ name: "records" });
}

function goNewProduct() {
  router.push({ name: "new-product" });
}

function goAbTest() {
  router.push({ name: "ab-test" });
}

function goQuickConsult(type = "western", source = "text") {
  consultStore.setConsultType(type);
  consultStore.setConsultSource(source);
  router.push({ name: "quick-consult", query: { type, source } });
}

function pxSpot(x, y, w, h) {
  return { x, y, w, h };
}

const hotspots = [
  { id: "nav-home", label: "首页", ...pxSpot(200, 28, 120, 48), action: goHome },
  { id: "nav-records", label: "问诊记录", ...pxSpot(500, 28, 120, 48), action: goRecords },
  { id: "nav-new-product", label: "新品登记", ...pxSpot(860, 28, 120, 48), action: goNewProduct },
  { id: "quick", label: "便民快速问诊", ...pxSpot(1968, 74, 820, 58), action: () => goQuickConsult("western", "convenient") },
  { id: "text", label: "图文快速问诊", ...pxSpot(1968, 136, 820, 58), action: () => { showConsultTypeDialog.value = true; } },
  { id: "gynecology", label: "妇科快速问诊", ...pxSpot(1968, 198, 820, 58), action: () => goQuickConsult("western", "text") },
  { id: "pediatrics", label: "儿科快速问诊", ...pxSpot(1968, 260, 820, 58), action: () => goQuickConsult("western", "text") },
  { id: "tcm", label: "中医快速问诊", ...pxSpot(1968, 322, 400, 58), action: () => goQuickConsult("tcm", "text") },
  { id: "upload", label: "处方图片上传", ...pxSpot(2388, 322, 400, 58), action: () => goQuickConsult("western", "text") }
];

function spotStyle(spot) {
  return {
    left: `${(spot.x / DESIGN_W) * 100}%`,
    top: `${(spot.y / DESIGN_H) * 100}%`,
    width: `${(spot.w / DESIGN_W) * 100}%`,
    height: `${(spot.h / DESIGN_H) * 100}%`
  };
}
</script>

<style scoped>
.home-page {
  min-height: var(--jh-viewport-height, 100vh);
  padding: var(--jh-space-md, 16px) 0;
  background: var(--jh-color-bg-page, #f4f5f6);
}

.home-page__canvas {
  position: relative;
  width: min(1440px, 100%);
  margin: 0 auto;
  aspect-ratio: 2880 / 1800;
}

.home-page__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
  user-select: none;
  pointer-events: none;
}

.home-hotspot {
  position: absolute;
  z-index: 4;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.home-hotspot:focus-visible {
  outline: 2px solid var(--jh-color-primary);
  outline-offset: 1px;
}

.home-ab-entry {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 30;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #cfe3ff;
  border-radius: 999px;
  background: #ffffff;
  color: var(--jh-color-primary, #006ef9);
  box-shadow: 0 2px 8px rgba(16, 42, 67, 0.1);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.home-ab-entry:hover {
  background: #f5f9ff;
}

.home-ab-entry:focus-visible {
  outline: 2px solid var(--jh-color-primary);
  outline-offset: 2px;
}
</style>
