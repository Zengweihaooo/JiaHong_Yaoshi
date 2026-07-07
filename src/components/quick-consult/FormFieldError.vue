<template>
  <p v-if="message" :class="['form-field-error', { 'form-field-error--warning': variant === 'warning' }]">{{ message }}</p>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ""
  },
  variant: {
    type: String,
    default: "error",
    validator: (value) => ["error", "warning"].includes(value)
  }
});
</script>

<style scoped>
.form-field-error {
  margin: 4px 0 0;
  color: #d54941;
  font-size: 12px;
  line-height: 20px;
}

.form-field-error--warning {
  color: #e37318;
}
</style>
