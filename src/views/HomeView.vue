<template>
  <div class="home-page">
    <div class="home-page__canvas">
      <img
        class="home-page__image"
        src="/images/homepage.png"
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import ConsultTypeDialog from "@/components/home/ConsultTypeDialog.vue";
import { useConsultStore } from "@/stores/consult";

/** 首页截图尺寸（等比修正后：Figma 内容 1234×2407 对齐全页高 3951） */
const DESIGN_W = 2026;
const DESIGN_H = 3951;
/** Figma 1440 画布 → 截图，统一等比缩放 */
const SCALE = DESIGN_W / 1440;

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

/**
 * 热区坐标：Figma 1440 画布 → 2549 截图，统一等比缩放
 */
function spot(x, y, w, h) {
  return {
    x: Math.round(x * SCALE),
    y: Math.round(y * SCALE),
    w: Math.round(w * SCALE),
    h: Math.round(h * SCALE)
  };
}

const hotspots = [
  { id: "nav-home", label: "首页", ...spot(222, 65, 100, 80), action: goHome },
  { id: "nav-records", label: "问诊记录", ...spot(554, 65, 100, 80), action: goRecords },
  { id: "nav-new-product", label: "新品登记", ...spot(958, 65, 100, 80), action: goNewProduct },
  { id: "quick", label: "便民快速问诊", ...spot(1028, 138, 288, 86), action: () => goQuickConsult("western", "convenient") },
  { id: "text", label: "图文快速问诊", ...spot(1028, 229, 288, 86), action: () => { showConsultTypeDialog.value = true; } }
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
  width: min(1234px, 100%);
  margin: 0 auto;
  aspect-ratio: 2026 / 3951;
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
  z-index: 2;
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
