<template>
  <div class="home-page">
    <div class="home-page__canvas">
      <img
        class="home-page__image"
        src="/images/homepage.png"
        alt="嘉虹健康药师端首页"
        draggable="false"
      />

      <div class="home-quick-panel" aria-hidden="true">
        <div class="home-quick-card home-quick-card--blue">
          <span class="home-quick-plus home-quick-plus--one">+</span>
          <span class="home-quick-plus home-quick-plus--two">+</span>
          <img class="home-quick-card__icon home-quick-card__icon--video" src="/images/figma-home/quick-video.png" alt="" />
          <span class="home-quick-card__label">便民快速问诊</span>
          <span class="home-quick-card__arrow"></span>
        </div>
        <div class="home-quick-card home-quick-card--green">
          <span class="home-quick-plus home-quick-plus--one">+</span>
          <span class="home-quick-plus home-quick-plus--three">+</span>
          <img class="home-quick-card__icon home-quick-card__icon--chat" src="/images/figma-home/quick-chat.png" alt="" />
          <span class="home-quick-card__label">图文快速问诊</span>
          <span class="home-quick-card__arrow"></span>
        </div>
        <div class="home-quick-card home-quick-card--coral">
          <img class="home-quick-card__icon home-quick-card__icon--doctor" src="/images/figma-home/quick-gynecology.png" alt="" />
          <span class="home-quick-card__label">妇科快速问诊</span>
          <span class="home-quick-card__arrow"></span>
        </div>
        <div class="home-quick-card home-quick-card--orange">
          <img class="home-quick-card__icon home-quick-card__icon--pediatrics" src="/images/figma-home/quick-pediatrics.png" alt="" />
          <span class="home-quick-card__label">儿科快速问诊</span>
          <span class="home-quick-card__arrow"></span>
        </div>
        <div class="home-quick-card home-quick-card--small home-quick-card--tcm">
          <span class="home-quick-card__label home-quick-card__label--small">中医快速问诊</span>
          <span class="home-quick-card__arrow home-quick-card__arrow--small"></span>
          <img class="home-quick-card__icon home-quick-card__icon--tcm" src="/images/figma-home/quick-tcm.png" alt="" />
        </div>
        <div class="home-quick-card home-quick-card--small home-quick-card--purple">
          <span class="home-quick-card__label home-quick-card__label--small">处方图片上传</span>
          <span class="home-quick-card__arrow home-quick-card__arrow--small"></span>
          <img class="home-quick-card__icon home-quick-card__icon--upload" src="/images/figma-home/prescription-upload.png" alt="" />
        </div>
      </div>

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
  { id: "quick", label: "便民快速问诊", ...spot(980, 138, 288, 86), action: () => goQuickConsult("western", "convenient") },
  { id: "text", label: "图文快速问诊", ...spot(980, 229, 288, 86), action: () => { showConsultTypeDialog.value = true; } }
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

.home-quick-panel {
  position: absolute;
  z-index: 3;
  left: 67.52%;
  top: 4.56%;
  width: 25.76%;
  height: 18.1%;
  background: #f7f8fa;
  overflow: hidden;
  pointer-events: none;
}

.home-quick-card {
  position: absolute;
  left: 0.35%;
  width: 99.3%;
  height: 19.11%;
  overflow: hidden;
}

.home-quick-card--blue {
  top: 0;
  background: linear-gradient(90deg, #0f7bf9 0%, #37a1fb 100%);
}

.home-quick-card--green {
  top: 20.22%;
  background: linear-gradient(90deg, #00b37a 29.86%, #2fcf9a 100%);
}

.home-quick-card--coral {
  top: 40.44%;
  background: linear-gradient(90deg, #ff4649 0%, #ff8b44 100%);
}

.home-quick-card--orange {
  top: 60.67%;
  background: linear-gradient(90deg, #ff8d00 0%, #ffbd0a 100%);
}

.home-quick-card--small {
  top: 80.67%;
  left: 0.35%;
  width: 48.96%;
}

.home-quick-card--tcm {
  background: linear-gradient(270deg, #83cc75 0%, #04af01 100%);
}

.home-quick-card--purple {
  left: 50.86%;
  background: linear-gradient(270deg, #8878fc 0%, #6342f5 100%);
}

.home-quick-card__label {
  position: absolute;
  left: 36.46%;
  top: 34.88%;
  color: #fff;
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  font-size: clamp(12px, 1.18vw, 20px);
  line-height: 1.2;
  white-space: nowrap;
}

.home-quick-card__label--small {
  left: 8.45%;
  top: 22.09%;
  font-size: clamp(11px, 1.05vw, 18px);
}

.home-quick-card__arrow {
  position: absolute;
  right: 8.12%;
  top: 42%;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 7px solid rgba(255, 255, 255, 0.95);
}

.home-quick-card__arrow--small {
  left: 7.75%;
  top: 62%;
  right: auto;
}

.home-quick-card__icon {
  position: absolute;
  object-fit: contain;
  pointer-events: none;
}

.home-quick-card__icon--video {
  left: 1.74%;
  top: 25.58%;
  width: 24.65%;
  height: 82.56%;
}

.home-quick-card__icon--chat {
  left: -1.04%;
  top: 25.58%;
  width: 28.47%;
  height: 75.58%;
}

.home-quick-card__icon--doctor,
.home-quick-card__icon--pediatrics {
  left: -2%;
  top: 14%;
  width: 31%;
  height: 90%;
  opacity: 0.72;
}

.home-quick-card__icon--tcm {
  right: 4.23%;
  bottom: 4.65%;
  width: 34.51%;
  height: 48.84%;
}

.home-quick-card__icon--upload {
  right: 6.34%;
  bottom: 0;
  width: 35.92%;
  height: 53.49%;
}

.home-quick-plus {
  position: absolute;
  color: rgba(255, 255, 255, 0.18);
  font-size: clamp(14px, 1.25vw, 22px);
  font-weight: 700;
  line-height: 1;
}

.home-quick-plus--one {
  left: 21.88%;
  top: 26.74%;
}

.home-quick-plus--two {
  left: 0.69%;
  top: 67.44%;
}

.home-quick-plus--three {
  left: 1.39%;
  top: 75.58%;
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
