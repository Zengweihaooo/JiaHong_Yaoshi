<template>
  <div class="toggle-field">
    <div class="toggle-field__buttons">
      <button
        :class="['jh-btn jh-btn--sm', modelValue === 'no' ? 'jh-btn--primary' : 'jh-btn--outline-secondary']"
        type="button"
        @click="setValue('no')"
      >
        无
      </button>
      <button
        :class="['jh-btn jh-btn--sm', modelValue === 'yes' ? 'jh-btn--primary' : 'jh-btn--outline-secondary']"
        type="button"
        @click="setValue('yes')"
      >
        有
      </button>
    </div>
    <input
      v-if="modelValue === 'yes'"
      :value="detail"
      class="jh-input-field jh-input-field--sm toggle-field__detail"
      type="text"
      placeholder="请输入详情"
      @input="emit('update:detail', $event.target.value)"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "no"
  },
  detail: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["update:modelValue", "update:detail"]);

function setValue(value) {
  emit("update:modelValue", value);
  if (value === "no") {
    emit("update:detail", "");
  }
}
</script>

<style scoped>
.toggle-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-field__buttons {
  display: flex;
  flex-shrink: 0;
  gap: 6px;
}

.toggle-field__buttons .jh-btn {
  height: 34px;
  padding: 5px 16px;
  font-size: 16px;
}

.toggle-field__detail {
  width: min(240px, 100%);
  height: 40px;
  font-size: 16px;
}
</style>
