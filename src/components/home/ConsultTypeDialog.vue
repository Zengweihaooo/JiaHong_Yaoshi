<template>
  <Teleport to="body">
    <div v-if="visible" class="consult-type-overlay" @click.self="emit('close')">
      <section class="consult-type-dialog" role="dialog" aria-modal="true" aria-labelledby="consult-type-title">
        <header class="consult-type-dialog__header">
          <h2 id="consult-type-title">请选择问诊药品类型</h2>
          <button class="consult-type-dialog__close" type="button" aria-label="关闭" @click="emit('close')">
            <el-icon><Close /></el-icon>
          </button>
        </header>
        <div class="consult-type-dialog__body">
          <button class="consult-type-option" type="button" @click="selectType('western')">
            <span class="consult-type-option__icon consult-type-option__icon--western" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="2" />
                <path d="M16 24h16M24 16v16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              </svg>
            </span>
            <span class="consult-type-option__text">
              <strong>西药问诊</strong>
              <span>为您匹配专业西医，并开具中西成药</span>
            </span>
          </button>
          <button class="consult-type-option" type="button" @click="selectType('tcm')">
            <span class="consult-type-option__icon consult-type-option__icon--tcm" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="14" width="28" height="24" rx="4" stroke="currentColor" stroke-width="2" />
                <path d="M10 22h28" stroke="currentColor" stroke-width="2" />
                <path d="M20 14V10a4 4 0 0 1 8 0v4" stroke="currentColor" stroke-width="2" />
              </svg>
            </span>
            <span class="consult-type-option__text">
              <strong>中药问诊</strong>
              <span>为您匹配专业中医，并开具中药饮片</span>
            </span>
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { Close } from "@element-plus/icons-vue";
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
  emit("close");
  router.push({ name: "quick-consult", query: { type } });
}
</script>

<style scoped>
.consult-type-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--jh-space-md, 16px);
  padding-top: 252px;
  background: rgba(0, 0, 0, 0.5);
}

.consult-type-dialog {
  width: min(300px, calc(100vw - 32px));
  border-radius: var(--jh-radius-lg, 8px);
  background: var(--jh-color-bg-surface, #fff);
  box-shadow: var(--jh-shadow-md);
  overflow: hidden;
}

.consult-type-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 8px;
}

.consult-type-dialog__header h2 {
  margin: 0;
  color: var(--jh-color-text);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.consult-type-dialog__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: var(--jh-radius-md, 6px);
  color: var(--jh-color-muted);
  background: transparent;
  cursor: pointer;
}

.consult-type-dialog__close:hover {
  background: var(--jh-color-bg-page);
}

.consult-type-dialog__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 18px 18px;
}

.consult-type-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 74px;
  padding: 12px 14px;
  border: 1px solid rgba(0, 110, 249, 0.18);
  border-radius: var(--jh-radius-md, 6px);
  text-align: left;
  background: color-mix(in srgb, var(--jh-color-primary) 5%, var(--jh-color-bg-surface));
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.consult-type-option:hover {
  border-color: var(--jh-color-primary);
  box-shadow: 0 0 0 2px rgba(0, 110, 249, 0.08);
}

.consult-type-option__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: var(--jh-color-bg-surface);
  background: var(--jh-color-primary);
}

.consult-type-option__icon svg {
  width: 24px;
  height: 24px;
}

.consult-type-option__text {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.consult-type-option__text strong {
  color: var(--jh-color-primary);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
}

.consult-type-option__text span {
  color: var(--jh-color-muted);
  font-size: 12px;
  line-height: 18px;
}

@media (max-width: 720px) {
  .consult-type-overlay {
    align-items: center;
    padding-top: var(--jh-space-md, 16px);
  }
}
</style>
