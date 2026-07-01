<template>
  <p v-if="message" class="form-field-error">{{ message }}</p>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ""
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
</style>
