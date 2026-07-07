<template>
  <RecordsView :date-picker-variant="variant" />
  <nav class="ab-records-date-nav" aria-label="AB 测试页面切换">
    <button type="button" :disabled="variant === 'a'" @click="$emit('switch-variant', 'a')">去 A 页面</button>
    <button type="button" :disabled="variant === 'b'" @click="$emit('switch-variant', 'b')">去 B 页面</button>
    <button type="button" @click="$emit('back')">返回测试首页</button>
    <button class="ab-records-date-nav__help" type="button" aria-label="查看操作指引" title="查看操作指引" @click="$emit('show-guide')">?</button>
  </nav>
</template>

<script setup>
import RecordsView from "@/views/RecordsView.vue";

defineProps({
  variant: {
    type: String,
    default: "a",
    validator: (value) => ["a", "b"].includes(value)
  }
});

defineEmits(["back", "switch-variant", "show-guide"]);
</script>

<style scoped>
.ab-records-date-nav {
  position: fixed;
  left: 32px;
  bottom: 28px;
  z-index: 60;
  display: inline-flex;
  gap: 10px;
  padding: 8px;
  border: 1px solid #e5e8eb;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(16, 42, 67, 0.06);
}

.ab-records-date-nav button {
  height: 32px;
  padding: 0 14px;
  border: 1px solid #cfe3ff;
  border-radius: 999px;
  background: #ffffff;
  color: var(--jh-color-primary, #006ef9);
  cursor: pointer;
  font-size: 14px;
}

.ab-records-date-nav button:disabled {
  border-color: #d8dde1;
  background: #f2f3f4;
  color: #99a1af;
  cursor: not-allowed;
}

.ab-records-date-nav .ab-records-date-nav__help {
  width: 32px;
  padding: 0;
  border-color: #006ef9;
  background: #006ef9;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
}
</style>
