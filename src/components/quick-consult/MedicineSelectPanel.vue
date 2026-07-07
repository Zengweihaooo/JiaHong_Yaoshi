<template>
  <section
    ref="sectionRef"
    :class="['medicine-panel', { 'medicine-panel--disabled': !canEdit, 'medicine-panel--invalid': error }]"
  >
    <div class="medicine-panel__header">
      <h2 class="medicine-panel__title"><em>*</em>所需药品</h2>
      <span class="medicine-panel__note">乙类OTC不需开具处方，请勿录入</span>
    </div>

    <div class="medicine-panel__body">
      <div
        :class="[
          'medicine-panel__search',
          {
            'is-active': showDropdown,
            'is-disabled': !canEdit,
            'is-error': error,
            'is-field-error-flash': error
          }
        ]"
      >
        <input
          :value="keyword"
          class="medicine-panel__input"
          type="text"
          :disabled="!canEdit || reachedMax"
          :placeholder="placeholder"
          @input="emit('update:keyword', $event.target.value)"
          @focus="emit('focus')"
          @click="emit('focus')"
          @blur="emit('blur')"
        />

        <div v-if="showDropdown && canEdit" class="medicine-panel__dropdown">
          <button
            v-for="option in options"
            :key="option.id"
            class="medicine-panel__dropdown-item"
            type="button"
            @mousedown.prevent
            @click="emit('add', option)"
          >
            <span class="medicine-panel__dropdown-type">[{{ typeLabel(option.type) }}]</span>
            <span class="medicine-panel__dropdown-name">{{ option.name }}</span>
            <span class="medicine-panel__dropdown-spec">{{ option.spec }}</span>
            <span class="medicine-panel__dropdown-unit">{{ option.unit }}</span>
          </button>
          <div v-if="!options.length" class="medicine-panel__not-found">
            <button class="medicine-panel__register" type="button" @mousedown.prevent @click="emit('register-new')">
              <span class="medicine-panel__register-icon" aria-hidden="true"></span>
              新品登记
            </button>
            <span>未找到该药品，点击登记</span>
          </div>
        </div>
      </div>

      <div v-if="canEdit && medicines.length" class="medicine-panel__list">
        <article v-for="item in medicines" :key="item.id" class="medicine-panel__row">
          <div class="medicine-panel__main">
            <span :class="['medicine-panel__type', `medicine-panel__type--${item.type}`]">
              {{ typeLabelSpaced(item.type) }}
            </span>
            <div class="medicine-panel__name">{{ item.name }}</div>
          </div>

          <div class="medicine-panel__controls">
            <div class="medicine-panel__spec">{{ item.spec }}</div>

            <div class="medicine-panel__qty">
              <button
                class="medicine-panel__qty-btn"
                type="button"
                :disabled="!canEdit || item.qty <= 1"
                @click="emit('change-qty', item, -1)"
              >
                −
              </button>
              <span class="medicine-panel__qty-value">{{ item.qty }}</span>
              <button
                class="medicine-panel__qty-btn"
                type="button"
                :disabled="!canEdit"
                @click="emit('change-qty', item, 1)"
              >
                +
              </button>
            </div>

            <div class="medicine-panel__unit" @focusout="emit('unit-focusout', $event, item)">
              <button
                class="medicine-panel__unit-btn"
                type="button"
                :disabled="!canEdit"
                :aria-expanded="activeUnitId === item.id"
                @click="emit('toggle-unit', item)"
              >
                <span>{{ item.unit }}</span>
                <span class="medicine-panel__unit-arrow" aria-hidden="true"></span>
              </button>
              <div v-if="activeUnitId === item.id" class="medicine-panel__unit-menu">
                <button
                  v-for="unit in units"
                  :key="unit"
                  :class="['medicine-panel__unit-option', { 'is-active': item.unit === unit }]"
                  type="button"
                  @mousedown.prevent
                  @click="emit('select-unit', item, unit)"
                >
                  {{ unit }}
                </button>
              </div>
            </div>

            <button
              class="medicine-panel__remove"
              type="button"
              aria-label="删除药品"
              :disabled="!canEdit"
              @click="emit('remove', item.id)"
            >
              <span aria-hidden="true"></span>
            </button>
          </div>
        </article>
      </div>

      <FormFieldError :message="showInlineError ? error : ''" />
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import FormFieldError from "@/components/quick-consult/FormFieldError.vue";

const props = defineProps({
  keyword: {
    type: String,
    default: ""
  },
  medicines: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  },
  units: {
    type: Array,
    default: () => []
  },
  canEdit: {
    type: Boolean,
    default: false
  },
  showDropdown: {
    type: Boolean,
    default: false
  },
  activeUnitId: {
    type: [Number, String, null],
    default: null
  },
  placeholder: {
    type: String,
    default: ""
  },
  error: {
    type: String,
    default: ""
  },
  showInlineError: {
    type: Boolean,
    default: true
  },
  maxCount: {
    type: Number,
    default: 5
  },
  typeLabel: {
    type: Function,
    required: true
  }
});

const emit = defineEmits([
  "update:keyword",
  "focus",
  "blur",
  "add",
  "remove",
  "change-qty",
  "toggle-unit",
  "select-unit",
  "unit-focusout",
  "register-new"
]);

const sectionRef = ref(null);
const reachedMax = computed(() => props.medicines.length >= props.maxCount);

function typeLabelSpaced(type) {
  const label = props.typeLabel(type);
  if (label.length === 2) {
    return `${label[0]}   ${label[1]}`;
  }
  return label;
}

defineExpose({
  get sectionRef() {
    return sectionRef.value;
  }
});
</script>

<style scoped>
.medicine-panel {
  min-width: 0;
  width: 100%;
}

.medicine-panel__header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.medicine-panel__title {
  position: relative;
  margin: 0;
  padding-left: 8px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.medicine-panel__title::before {
  position: absolute;
  top: 4px;
  left: 0;
  width: 4px;
  height: 16px;
  border-radius: 1px;
  background: #006ef9;
  content: "";
}

.medicine-panel__title em {
  margin-right: 0;
  color: #cb2c2c;
  font-style: normal;
}

.medicine-panel--invalid .medicine-panel__title em {
  color: #d54941;
}

.medicine-panel__note {
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  line-height: 20px;
  opacity: 0.8;
}

.medicine-panel--disabled .medicine-panel__note {
  opacity: 0.55;
}

.medicine-panel__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding-left: 8px;
}

.medicine-panel__search {
  position: relative;
  min-width: 0;
}

.medicine-panel__input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  padding: 5px 10px;
  border: 1px solid #e5e8eb;
  border-radius: 6px;
  color: rgba(0, 0, 0, 0.9);
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  font-size: 14px;
  line-height: 22px;
  background: #fff;
  outline: 0;
}

.medicine-panel__input:hover:not(:disabled) {
  border-color: #1f2933;
}

.medicine-panel__search.is-active .medicine-panel__input {
  border-color: #006ef9;
  box-shadow: 0 0 0 1px rgba(0, 110, 249, 0.18);
}

.medicine-panel__search.is-error .medicine-panel__input {
  border-color: #d54941;
  box-shadow: none;
}

.medicine-panel__search.is-disabled .medicine-panel__input {
  color: rgba(0, 0, 0, 0.26);
  background: #f8f8f9;
  cursor: not-allowed;
}

.medicine-panel__dropdown {
  position: absolute;
  z-index: 30;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  max-height: 240px;
  padding: 8px 0;
  border: 1px solid #e5e8eb;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(16, 42, 67, 0.14), 0 2px 6px rgba(16, 42, 67, 0.08);
  overflow-y: auto;
}

.medicine-panel__dropdown-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.medicine-panel__dropdown-item:hover {
  background: #f5f9ff;
}

.medicine-panel__dropdown-type {
  color: #006ef9;
  white-space: nowrap;
}

.medicine-panel__dropdown-name,
.medicine-panel__dropdown-spec {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.medicine-panel__dropdown-unit {
  color: rgba(0, 0, 0, 0.4);
  white-space: nowrap;
}

.medicine-panel__not-found {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  line-height: 22px;
}

.medicine-panel__register {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  color: #006ef9;
  font: inherit;
  background: transparent;
  cursor: pointer;
}

.medicine-panel__register-icon {
  position: relative;
  width: 14px;
  height: 14px;
}

.medicine-panel__register-icon::before,
.medicine-panel__register-icon::after {
  position: absolute;
  top: 50%;
  left: 50%;
  background: #006ef9;
  transform: translate(-50%, -50%);
  content: "";
}

.medicine-panel__register-icon::before {
  width: 10px;
  height: 2px;
}

.medicine-panel__register-icon::after {
  width: 2px;
  height: 10px;
}

.medicine-panel__list {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
  width: 100%;
  max-width: 688px;
}

.medicine-panel__row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 688px;
  min-width: 0;
  height: 48px;
  padding: 0 10px;
  border-bottom: 4px solid #fff;
  background: #f5f9ff;
}

.medicine-panel__main,
.medicine-panel__controls {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.medicine-panel__main {
  flex: 0 0 318px;
}

.medicine-panel__controls {
  flex: 1 1 auto;
  min-width: 0;
}

.medicine-panel__type {
  display: inline-flex;
  flex: 0 0 65px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 65px;
  height: 24px;
  padding: 2px 12px;
  border: 1px solid #2ba471;
  border-radius: 4px;
  color: #2ba471;
  font-size: 14px;
  line-height: 22px;
  white-space: pre;
  background: #eef8f4;
}

.medicine-panel__type--tcm {
  border-color: #e37318;
  color: #e37318;
  background: #fff7f0;
}

.medicine-panel__type--compound {
  border-color: #006ef9;
  color: #006ef9;
  background: #f5f9ff;
}

.medicine-panel__name {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  box-sizing: border-box;
  width: 245px;
  min-width: 0;
  height: 46px;
  padding: 0 8px;
  color: #697383;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.medicine-panel__spec {
  display: flex;
  flex: 0 0 114px;
  align-items: center;
  box-sizing: border-box;
  width: 114px;
  height: 40px;
  padding: 9px 10px;
  border-radius: 6px;
  color: #697383;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.medicine-panel__qty {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 2px;
  box-sizing: border-box;
  padding: 2px;
  border: 1px solid #0091ea;
  border-radius: 4px;
  background: #fff;
}

.medicine-panel__qty-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 2px;
  color: #3c4449;
  font-size: 16px;
  line-height: 1;
  background: #f3f5f6;
  cursor: pointer;
}

.medicine-panel__qty-btn:first-child {
  border-radius: 2px 0 0 2px;
}

.medicine-panel__qty-btn:last-child {
  border-radius: 0 2px 2px 0;
}

.medicine-panel__qty-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.medicine-panel__qty-value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  color: #3c4449;
  font-size: 14px;
  line-height: 22px;
}

.medicine-panel__unit {
  position: relative;
  flex: 0 0 56px;
}

.medicine-panel__unit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  width: 56px;
  height: 32px;
  padding: 7px 12px;
  border: 1px solid #d0d5d9;
  border-radius: 4px;
  color: #3c4449;
  font-size: 14px;
  line-height: 22px;
  background: #fff;
  cursor: pointer;
}

.medicine-panel__unit-arrow {
  width: 0;
  height: 0;
  border-top: 5px solid #697383;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}

.medicine-panel__unit-menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
  min-width: 56px;
  padding: 4px 0;
  border: 1px solid #e5e8eb;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(16, 42, 67, 0.12);
}

.medicine-panel__unit-option {
  display: block;
  width: 100%;
  padding: 6px 12px;
  border: 0;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.medicine-panel__unit-option.is-active,
.medicine-panel__unit-option:hover {
  color: #006ef9;
  background: #f5f9ff;
}

.medicine-panel__remove {
  display: inline-flex;
  flex: 0 0 28px;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 48px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.medicine-panel__remove > span {
  position: relative;
  width: 16px;
  height: 16px;
}

.medicine-panel__remove > span::before,
.medicine-panel__remove > span::after {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 1.5px;
  border-radius: 1px;
  background: #cb2c2c;
  content: "";
}

.medicine-panel__remove > span::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.medicine-panel__remove > span::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.medicine-panel__remove:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
