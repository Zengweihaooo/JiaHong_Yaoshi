<template>
  <div ref="rootRef" class="quick-fill">
    <button
      :class="['quick-fill__btn', { 'is-hover': hovered, 'is-active': active || menuOpen }]"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="menuOpen"
      @mouseenter="hovered = true"
      @mouseleave="handleMouseLeave"
      @mousedown="active = true"
      @mouseup="active = false"
      @click="toggleMenu"
    >
      <img class="quick-fill__icon" :src="scanIcon" alt="" aria-hidden="true" />
      <span>快速填写</span>
    </button>

    <Transition name="quick-fill-tooltip">
      <div v-if="hovered && !menuOpen" class="quick-fill__tooltip" role="tooltip">
        <span class="quick-fill__tooltip-arrow" aria-hidden="true"></span>
        <p>通过扫描身份证或上传证件照片，快速填写信息</p>
      </div>
    </Transition>

    <Transition name="quick-fill-menu">
      <div v-if="menuOpen" class="quick-fill__menu" role="menu">
        <button class="quick-fill__menu-item" type="button" role="menuitem" @click="emit('scan')">
          扫描身份证
        </button>
        <button class="quick-fill__menu-item" type="button" role="menuitem" @click="emit('upload')">
          上传证件照片
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import scanIcon from "@/assets/figma-quick-fill/scan-icon.svg";

const emit = defineEmits(["scan", "upload"]);

const rootRef = ref(null);
const hovered = ref(false);
const active = ref(false);
const menuOpen = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  if (menuOpen.value) {
    hovered.value = false;
  }
}

function handleMouseLeave() {
  hovered.value = false;
  active.value = false;
}

function handleDocumentClick(event) {
  if (!rootRef.value?.contains(event.target)) {
    menuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("mousedown", handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleDocumentClick);
});
</script>

<style scoped>
.quick-fill {
  position: relative;
  display: inline-flex;
}

.quick-fill__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 28px;
  padding: 4px 12px;
  border: 0;
  border-radius: 6px;
  color: #006ef9;
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  font-size: 12px;
  line-height: 20px;
  background: #fff;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.quick-fill__btn.is-hover:not(.is-active) {
  background: #f2f3f4;
}

.quick-fill__btn.is-active {
  background: #e5e8eb;
}

.quick-fill__icon {
  display: block;
  width: 16px;
  height: 16px;
}

.quick-fill__tooltip {
  position: absolute;
  z-index: 20;
  top: 50%;
  left: calc(100% + 8px);
  display: flex;
  align-items: center;
  width: 185px;
  filter: drop-shadow(0 3px 7px rgba(0, 0, 0, 0.05)) drop-shadow(0 8px 5px rgba(0, 0, 0, 0.06))
    drop-shadow(0 5px 2.5px rgba(0, 0, 0, 0.1));
  transform: translateY(-50%);
  pointer-events: none;
}

.quick-fill__tooltip p {
  flex: 1;
  margin: 0;
  padding: 4px 8px;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  line-height: 22px;
  background: rgba(0, 0, 0, 0.9);
}

.quick-fill__tooltip-arrow {
  flex: 0 0 6px;
  align-self: center;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-right: 6px solid rgba(0, 0, 0, 0.9);
  border-bottom: 5px solid transparent;
}

.quick-fill-tooltip-enter-active,
.quick-fill-tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.quick-fill-tooltip-enter-from,
.quick-fill-tooltip-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-4px);
}

.quick-fill__menu {
  position: absolute;
  z-index: 21;
  top: calc(100% + 6px);
  left: 0;
  display: flex;
  flex-direction: column;
  min-width: 132px;
  padding: 4px 0;
  border: 1px solid #e5e8eb;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(16, 42, 67, 0.14), 0 2px 6px rgba(16, 42, 67, 0.08);
}

.quick-fill__menu-item {
  width: 100%;
  padding: 8px 12px;
  border: 0;
  color: rgba(0, 0, 0, 0.9);
  font-family: inherit;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.quick-fill__menu-item:hover {
  color: #006ef9;
  background: #f5f9ff;
}

.quick-fill-menu-enter-active,
.quick-fill-menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.quick-fill-menu-enter-from,
.quick-fill-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
