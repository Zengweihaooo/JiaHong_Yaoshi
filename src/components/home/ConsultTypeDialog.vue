<template>
  <Teleport to="body">
    <div v-if="visible" class="consult-type-overlay" @click.self="emit('close')">
      <section class="consult-type-dialog" role="dialog" aria-modal="true" aria-labelledby="consult-type-title">
        <header class="consult-type-dialog__header">
          <h2 id="consult-type-title">请选择问诊药品类型</h2>
          <button class="consult-type-dialog__close" type="button" aria-label="关闭" @click="emit('close')">
            <img :src="consultTypeCloseIcon" alt="" />
          </button>
        </header>
        <div class="consult-type-dialog__body">
          <button class="consult-type-option consult-type-option--active" type="button" @click="selectType('western')">
            <span class="consult-type-option__icon consult-type-option__icon--western" aria-hidden="true">
              <img :src="westernIcon" alt="" />
            </span>
            <span class="consult-type-option__text">
              <strong>西药问诊</strong>
              <span>为您匹配专业西医，开具中西成药</span>
            </span>
          </button>
          <button class="consult-type-option consult-type-option--default" type="button" @click="selectType('tcm')">
            <span class="consult-type-option__icon consult-type-option__icon--tcm" aria-hidden="true">
              <img :src="tcmIcon" alt="" />
            </span>
            <span class="consult-type-option__text">
              <strong>中药问诊</strong>
              <span>为您匹配专业中医，开具中药饮品</span>
            </span>
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import consultTypeCloseIcon from "@/assets/figma-consult-type/close.svg";
import tcmIcon from "@/assets/figma-consult-type/icon-home-east.png";
import westernIcon from "@/assets/figma-consult-type/icon-home-west.png";
import { useConsultStore } from "@/stores/consult";
import { useRouter } from "vue-router";

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close"]);
const router = useRouter();
const consultStore = useConsultStore();

function selectType(type) {
  if (type !== "western") return;
  consultStore.setConsultType(type);
  consultStore.setConsultSource("text");
  emit("close");
  router.push({ name: "quick-consult", query: { type, source: "text" } });
}
</script>

<style scoped>
.consult-type-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.5);
}

.consult-type-dialog {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 365px;
  height: 297px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 84px 64px -20px rgba(16, 42, 67, 0.18), 0 8px 16px -4px rgba(16, 42, 67, 0.1);
  overflow: hidden;
}

.consult-type-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 69px;
  width: 100%;
  height: 69px;
  padding: 12px 16px;
  box-sizing: border-box;
  border-radius: 8px 8px 0 0;
  background: #fff;
}

.consult-type-dialog__header h2 {
  margin: 0;
  color: #1e2939;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}

.consult-type-dialog__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.consult-type-dialog__close img {
  display: block;
  width: 20px;
  height: 20px;
}

.consult-type-dialog__close:hover {
  background: transparent;
}

.consult-type-dialog__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  height: 228px;
  padding: 0 20px 16px;
  box-sizing: border-box;
}

.consult-type-option {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 12px;
  box-sizing: border-box;
  width: 322px;
  height: 98px;
  margin: 0;
  padding: 20px 16px;
  border: 1px solid #006ef9;
  border-radius: 8px;
  text-align: left;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}

.consult-type-option--active {
  border-color: #006ef9;
  background: #fff;
}

.consult-type-option--default {
  border-color: #006ef9;
  background: #fff;
}

.consult-type-option:hover {
  border-color: #006ef9;
  background: #fff;
  box-shadow: none;
}

.consult-type-option__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 0;
  background: transparent;
}

.consult-type-option__icon img {
  display: block;
  width: 48px;
  height: 48px;
  object-fit: cover;
}

.consult-type-option__text {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 230px;
  height: 58px;
  border-radius: 4px;
}

.consult-type-option__text strong {
  width: 230px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.consult-type-option__text span {
  width: 230px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
}

@media (max-width: 720px) {
  .consult-type-overlay {
    padding: 16px;
  }

  .consult-type-dialog {
    width: min(365px, calc(100vw - 32px));
  }
}

@media (max-width: 400px) {
  .consult-type-option {
    width: calc(100% - 40px);
  }

  .consult-type-option__text,
  .consult-type-option__text strong,
  .consult-type-option__text span {
    width: auto;
    min-width: 0;
  }
}
</style>
