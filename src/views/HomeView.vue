<template>
  <div class="home-page">
    <!-- 容器锁定 Figma 设计稿 1440×2807 比例，热区用百分比定位 -->
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ConsultTypeDialog from "@/components/home/ConsultTypeDialog.vue";
import { useConsultStore } from "@/stores/consult";

/** 首页 Figma 设计稿尺寸 */
const DESIGN_W = 1440;
const DESIGN_H = 2807;

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

function goQuickConsult(type = "western", source = "text") {
  consultStore.setConsultType(type);
  consultStore.setConsultSource(source);
  router.push({ name: "quick-consult", query: { type, source } });
}

/** 热区坐标基于首页截图本身（1440×2807），已去掉 Figma 画布 Y 偏移 */
const hotspots = [
  { id: "nav-home", label: "首页", x: 222, y: 65, w: 100, h: 80, action: goHome },
  { id: "nav-records", label: "问诊记录", x: 554, y: 65, w: 100, h: 80, action: goRecords },
  { id: "nav-new-product", label: "新品登记", x: 958, y: 65, w: 100, h: 80, action: goNewProduct },
  { id: "quick", label: "便民快速问诊", x: 1089, y: 163, w: 166, h: 100, action: () => goQuickConsult("western", "convenient") },
  { id: "text", label: "图文问诊", x: 1263, y: 163, w: 166, h: 100, action: () => { showConsultTypeDialog.value = true; } }
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
  aspect-ratio: 1440 / 2807;
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
</style>
