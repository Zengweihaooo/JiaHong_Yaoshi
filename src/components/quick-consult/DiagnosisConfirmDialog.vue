<template>
  <Teleport to="body">
    <div v-if="modelValue" class="diagnosis-confirm-overlay" @click.self="closeDialog">
      <section
        class="diagnosis-confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="diagnosis-confirm-title"
      >
        <div class="diagnosis-confirm-dialog__top">
          <header class="diagnosis-confirm-dialog__header">
            <h2 id="diagnosis-confirm-title">疾病信息确认</h2>
            <button class="diagnosis-confirm-dialog__close" type="button" aria-label="关闭" @click="closeDialog">
              <img :src="closeIcon" alt="" />
            </button>
          </header>
          <p class="diagnosis-confirm-dialog__warning">
            您选择的药品与线下已确诊疾病不匹配，请重新确认用药人的病情。
          </p>
        </div>

        <div class="diagnosis-confirm-dialog__body">
          <p class="diagnosis-confirm-dialog__tip">
            <span class="diagnosis-confirm-dialog__tip-icon" aria-hidden="true">!</span>
            每个或每组药品至少选择一个疾病信息
          </p>

          <div class="diagnosis-confirm-dialog__groups">
            <section v-for="group in groups" :key="group.id" class="diagnosis-confirm-group">
              <div class="diagnosis-confirm-group__card">
                <p class="diagnosis-confirm-group__medicine">{{ group.medicineName }}</p>
                <div class="diagnosis-confirm-group__tags">
                  <button
                    v-for="option in group.options"
                    :key="`${group.id}-${option.label}`"
                    :class="[
                      'diagnosis-confirm-tag',
                      {
                        'is-selected': isSelected(group.id, option.label),
                        'is-disabled': option.disabled
                      }
                    ]"
                    type="button"
                    :disabled="option.disabled"
                    @click="emit('toggle', group.id, option.label)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer class="diagnosis-confirm-dialog__footer">
          <button
            class="diagnosis-confirm-dialog__submit"
            type="button"
            :disabled="!canConfirm"
            @click="emit('confirm')"
          >
            确定
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import closeIcon from "@/assets/figma-diagnosis-confirm/close.svg";

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  groups: {
    type: Array,
    default: () => []
  },
  canConfirm: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Function,
    default: () => false
  }
});

const emit = defineEmits(["update:modelValue", "close", "confirm", "toggle"]);

function closeDialog() {
  emit("update:modelValue", false);
  emit("close");
}
</script>

<style scoped>
.diagnosis-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(122, 136, 152, 0.3);
}

.diagnosis-confirm-dialog {
  display: flex;
  flex-direction: column;
  width: min(560px, calc(100vw - 40px));
  max-height: calc(100vh - 40px);
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 84px 32px rgba(16, 42, 67, 0.18), 0 8px 8px rgba(16, 42, 67, 0.1);
}

.diagnosis-confirm-dialog__top {
  flex-shrink: 0;
}

.diagnosis-confirm-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 12px 16px;
  border-bottom: 0.667px solid rgba(229, 231, 235, 0.5);
  border-radius: 8px 8px 0 0;
  background: #f2f3f4;
  box-shadow: 0 1px 1px rgba(16, 42, 67, 0.04);
}

.diagnosis-confirm-dialog__header h2 {
  margin: 0;
  color: #1e2939;
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.diagnosis-confirm-dialog__close {
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

.diagnosis-confirm-dialog__close img {
  display: block;
  width: 20px;
  height: 20px;
}

.diagnosis-confirm-dialog__close:hover {
  opacity: 0.78;
}

.diagnosis-confirm-dialog__warning {
  margin: 0;
  min-height: 36px;
  padding: 6px 18px;
  color: #fe8125;
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  background: #fff3e5;
}

.diagnosis-confirm-dialog__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  padding: 12px 24px 0;
  overflow-y: auto;
}

.diagnosis-confirm-dialog__tip {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0;
  color: #fe8125;
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
}

.diagnosis-confirm-dialog__tip-icon {
  display: inline-flex;
  flex: 0 0 20px;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  background: #e37318;
}

.diagnosis-confirm-dialog__groups {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding-bottom: 12px;
}

.diagnosis-confirm-group {
  width: 100%;
  padding-left: 28px;
}

.diagnosis-confirm-group__card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 11px 15px;
  border-radius: 4px;
  background: #f5f9ff;
}

.diagnosis-confirm-group__medicine {
  margin: 0;
  color: rgba(0, 0, 0, 0.6);
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.diagnosis-confirm-group__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.diagnosis-confirm-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 5px 12px;
  border: 1px solid #d8dde1;
  border-radius: 50px;
  color: rgba(0, 0, 0, 0.6);
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  background: #fcfcfc;
  cursor: pointer;
}

.diagnosis-confirm-tag:hover:not(:disabled) {
  border-color: #006ef9;
  color: #006ef9;
  background: #fff;
}

.diagnosis-confirm-tag.is-selected,
.diagnosis-confirm-tag.is-selected:hover {
  border-color: #006ef9;
  color: #fff;
  background: #006ef9;
}

.diagnosis-confirm-tag.is-disabled,
.diagnosis-confirm-tag:disabled {
  border-color: #d8dde1;
  color: rgba(0, 0, 0, 0.26);
  background: #eceef0;
  cursor: not-allowed;
}

.diagnosis-confirm-dialog__footer {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px 16px 10px;
  background: #fff;
}

.diagnosis-confirm-dialog__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  color: #fff;
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  background: linear-gradient(270deg, #3b92ff 0%, #006ef9 100%);
  cursor: pointer;
}

.diagnosis-confirm-dialog__submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.diagnosis-confirm-dialog__submit:not(:disabled):hover {
  filter: brightness(1.03);
}
</style>
