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
    <div v-if="modelValue === 'yes'" class="toggle-field__detail-col">
      <div :class="['toggle-field__detail-box', { 'is-error': error }]">
        <span v-if="!detail" class="toggle-field__placeholder" aria-hidden="true">
          <em>*</em>{{ detailPlaceholder }}
        </span>
        <input
          :value="detail"
          :class="['jh-input-field', 'jh-input-field--sm', 'toggle-field__detail', { 'jh-input-field--error': error }]"
          type="text"
          :placeholder="''"
          aria-required="true"
          @input="handleDetailInput($event.target.value)"
          @blur="emit('detail-blur')"
        />
      </div>
    </div>
    <FormFieldError v-if="error" class="toggle-field__error" :message="error" />
  </div>
</template>

<script setup>
import FormFieldError from "@/components/quick-consult/FormFieldError.vue";

defineProps({
  modelValue: {
    type: String,
    default: "no"
  },
  detail: {
    type: String,
    default: ""
  },
  detailPlaceholder: {
    type: String,
    default: "请输入详情"
  },
  error: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["update:modelValue", "update:detail", "detail-blur", "detail-input"]);

function setValue(value) {
  emit("update:modelValue", value);
  if (value === "no") {
    emit("update:detail", "");
  }
}

function handleDetailInput(value) {
  emit("update:detail", value);
  emit("detail-input");
}
</script>

<style scoped>
.toggle-field {
  display: contents;
}

.toggle-field__buttons {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  white-space: nowrap;
}

.toggle-field__buttons .jh-btn {
  min-width: 38px;
  height: 32px;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 16px;
  line-height: 22px;
}

.toggle-field__detail-col {
  min-width: 0;
}

.toggle-field__detail-box {
  position: relative;
  width: 100%;
}

.toggle-field__error {
  margin: 0;
}

.toggle-field__placeholder {
  position: absolute;
  top: 50%;
  left: 10px;
  display: inline-flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.26);
  font-size: 14px;
  line-height: 22px;
  pointer-events: none;
  transform: translateY(-50%);
}

.toggle-field__placeholder em {
  margin-right: 0;
  color: #cb2c2c;
  font-style: normal;
}

.toggle-field__detail {
  width: 100%;
  height: 32px;
  font-size: 14px;
}

.toggle-field__detail:focus {
  border-color: #006ef9;
  box-shadow: 0 0 0 1px color-mix(in srgb, #006ef9 18%, transparent);
  outline: 0;
}

.toggle-field__detail.jh-input-field--error,
.toggle-field__detail-box.is-error .toggle-field__detail {
  border-color: #d54941;
  box-shadow: none;
}
</style>
