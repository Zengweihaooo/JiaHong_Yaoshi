<template>
  <section
    ref="sectionRef"
    :class="['diagnosis-panel', { 'diagnosis-panel--invalid': error }]"
  >
    <h2 class="diagnosis-panel__title"><em>*</em>线下已确诊疾病</h2>

    <div class="diagnosis-panel__body">
      <div
        :class="[
          'diagnosis-panel__search',
          { 'is-error': error, 'is-field-error-flash': error, 'is-open': showDropdown }
        ]"
      >
        <input
          :value="keyword"
          class="diagnosis-panel__input"
          type="text"
          placeholder="请输入线下已确诊的疾病名称"
          :disabled="reachedMax"
          @input="emit('update:keyword', $event.target.value)"
          @focus="emit('focus')"
          @click="emit('focus')"
          @blur="emit('blur')"
        />

        <Transition name="diagnosis-panel-dropdown">
          <div
            v-if="showDropdown && dropdownOptions.length"
            :class="[
              'diagnosis-panel__dropdown',
              'diagnosis-panel__dropdown--floating',
              { 'diagnosis-panel__dropdown--common': isCommonDropdown }
            ]"
          >
            <p class="diagnosis-panel__dropdown-label">{{ dropdownTitle }}</p>
            <div class="diagnosis-panel__dropdown-tags">
              <button
                v-for="option in dropdownOptions"
                :key="option.label"
                :class="[
                  'diagnosis-panel__option',
                  {
                    'is-selected': option.selected,
                    'is-disabled': option.disabled || (reachedMax && !option.selected)
                  }
                ]"
                type="button"
                :disabled="option.disabled || (reachedMax && !option.selected)"
                :aria-pressed="option.selected"
                @mousedown.prevent
                @click="emit('toggle', option.label)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <TransitionGroup
        v-if="diagnosisCards.length"
        name="diagnosis-card"
        tag="div"
        class="diagnosis-panel__cards"
      >
        <article v-for="card in diagnosisCards" :key="card.label" class="diagnosis-card">
          <button
            class="diagnosis-card__tag"
            type="button"
            :disabled="isDisabled(card.label)"
            :aria-label="`移除${card.label}`"
            @click="emit('remove', card.label)"
          >
            {{ card.label }}
          </button>
          <span class="diagnosis-card__meta">{{ formatLinkedMedicines(card.linkedMedicines) }}</span>
        </article>
      </TransitionGroup>

      <div
        v-if="showLinkPrompt"
        class="diagnosis-panel__prompt"
      >
        <div class="diagnosis-panel__prompt-header">
          <div class="diagnosis-panel__prompt-header-main">
            <span class="diagnosis-panel__prompt-icon" aria-hidden="true">!</span>
            <p class="diagnosis-panel__prompt-title">每个或每组药品至少选择一个疾病信息</p>
          </div>
          <label
            v-if="showComboMedicineOption"
            class="diagnosis-panel__combo-toggle"
          >
            <input
              :checked="comboEnabled"
              class="diagnosis-panel__combo-input"
              type="checkbox"
              @change="emit('update:comboEnabled', $event.target.checked)"
            />
            <span class="diagnosis-panel__combo-box" aria-hidden="true">
              <svg class="diagnosis-panel__combo-check" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4.2L3.8 7L9 1"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="diagnosis-panel__combo-label">联合用药</span>
          </label>
        </div>

        <div
          v-if="comboEnabled && combinationRecommendations.length"
          class="diagnosis-panel__recommendations"
        >
          <div
            v-for="recommendation in combinationRecommendations"
            :key="`recommend-${recommendation.id}`"
            class="diagnosis-panel__prompt-group diagnosis-panel__prompt-group--recommend"
          >
            <p class="diagnosis-panel__prompt-label">推荐联合用药</p>
            <p class="diagnosis-panel__prompt-medicine">{{ recommendation.namesJoined }}</p>
            <div class="diagnosis-panel__prompt-tags">
              <button
                v-for="option in recommendation.options"
                :key="`${recommendation.id}-${option.label}`"
                :class="['diagnosis-panel__prompt-tag', { 'is-disabled': option.disabled }]"
                type="button"
                :disabled="option.disabled"
                @mousedown.prevent
                @click="emit('link-medicines', recommendation.medicineIds, option.label)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <div
          v-for="prompt in unlinkedMedicinePrompts"
          :key="`medicine-${prompt.id}`"
          class="diagnosis-panel__prompt-group"
        >
          <p class="diagnosis-panel__prompt-label">药品</p>
          <p class="diagnosis-panel__prompt-medicine">{{ prompt.namesJoined }}</p>
          <div class="diagnosis-panel__prompt-tags">
            <button
              v-for="option in prompt.options"
              :key="`${prompt.id}-${option.label}`"
              :class="['diagnosis-panel__prompt-tag', { 'is-disabled': option.disabled }]"
              type="button"
              :disabled="option.disabled"
              @mousedown.prevent
              @click="emit('link-medicines', prompt.medicineIds, option.label)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>

      <FormFieldError :message="error" />
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import FormFieldError from "@/components/quick-consult/FormFieldError.vue";
import { formatLinkedMedicineNames } from "@/utils/medicineDiagnosisLink";

const props = defineProps({
  keyword: {
    type: String,
    default: ""
  },
  diagnosisCards: {
    type: Array,
    default: () => []
  },
  unlinkedMedicinePrompts: {
    type: Array,
    default: () => []
  },
  combinationRecommendations: {
    type: Array,
    default: () => []
  },
  showComboMedicineOption: {
    type: Boolean,
    default: false
  },
  comboEnabled: {
    type: Boolean,
    default: false
  },
  dropdownOptions: {
    type: Array,
    default: () => []
  },
  dropdownTitle: {
    type: String,
    default: "常见疾病"
  },
  showDropdown: {
    type: Boolean,
    default: false
  },
  isCommonDropdown: {
    type: Boolean,
    default: true
  },
  error: {
    type: String,
    default: ""
  },
  maxCount: {
    type: Number,
    default: 5
  },
  isDisabled: {
    type: Function,
    default: () => false
  }
});

const emit = defineEmits([
  "update:keyword",
  "update:comboEnabled",
  "toggle",
  "remove",
  "link-medicines",
  "focus",
  "blur"
]);

const sectionRef = ref(null);
const reachedMax = computed(() => props.diagnosisCards.length >= props.maxCount);
const showLinkPrompt = computed(() => props.unlinkedMedicinePrompts.length > 0);

function formatLinkedMedicines(linkedMedicines) {
  return formatLinkedMedicineNames(linkedMedicines);
}

defineExpose({
  get sectionRef() {
    return sectionRef.value;
  }
});
</script>

<style scoped>
.diagnosis-panel {
  min-width: 0;
  width: 100%;
}

.diagnosis-panel__title {
  position: relative;
  margin: 0 0 16px;
  padding-left: 8px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.diagnosis-panel__title::before {
  position: absolute;
  top: 4px;
  left: 0;
  width: 4px;
  height: 16px;
  border-radius: 1px;
  background: #006ef9;
  content: "";
}

.diagnosis-panel__title em {
  margin-right: 0;
  color: #cb2c2c;
  font-style: normal;
}

.diagnosis-panel--invalid .diagnosis-panel__title em {
  color: #d54941;
}

.diagnosis-panel__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 10px;
}

.diagnosis-panel__search {
  position: relative;
}

.diagnosis-panel__input {
  display: block;
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

.diagnosis-panel__input:hover {
  border-color: #1f2933;
}

.diagnosis-panel__input:focus,
.diagnosis-panel__search.is-open .diagnosis-panel__input {
  border-color: #006ef9;
  box-shadow: 0 0 0 1px rgba(0, 110, 249, 0.18);
}

.diagnosis-panel__search.is-error .diagnosis-panel__input {
  border-color: #d54941;
  box-shadow: none;
}

.diagnosis-panel__dropdown {
  box-sizing: border-box;
  width: 100%;
}

.diagnosis-panel__dropdown--floating {
  position: absolute;
  z-index: 30;
  top: calc(100% + 8px);
  left: 0;
  max-height: 270px;
  margin-top: 0;
  padding: 14px 12px 16px;
  border: 1px solid #e5e8eb;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(16, 42, 67, 0.14), 0 2px 6px rgba(16, 42, 67, 0.08);
  overflow-y: auto;
}

.diagnosis-panel__dropdown-label {
  margin: 0 0 10px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  line-height: 20px;
}

.diagnosis-panel__dropdown--common .diagnosis-panel__dropdown-label {
  margin-bottom: 14px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 16px;
  line-height: 24px;
}

.diagnosis-panel__dropdown-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.diagnosis-panel__dropdown--common .diagnosis-panel__dropdown-tags {
  gap: 12px 10px;
}

.diagnosis-panel__dropdown--common .diagnosis-panel__option {
  height: 32px;
  padding: 5px 18px;
}

.diagnosis-panel__option.is-selected {
  border-color: #006ef9;
  color: #006ef9;
  background: #f5f9ff;
}

.diagnosis-panel__dropdown--common .diagnosis-panel__option.is-selected {
  border-color: #006ef9;
  color: #fff;
  background: #006ef9;
}

.diagnosis-panel__option.is-disabled,
.diagnosis-panel__option:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.diagnosis-panel__option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 3px 12px;
  border: 1px solid #e5e8eb;
  border-radius: 50px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
  background: #fff;
  cursor: pointer;
}

.diagnosis-panel__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 12px;
  width: 100%;
}

.diagnosis-card {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
  padding-right: 12px;
  border-radius: 49px;
  background: #f8f8f9;
}

.diagnosis-card__tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: calc(100% - 40px);
  height: 28px;
  padding: 5px 12px;
  border: 0;
  border-radius: 50px;
  color: #fff;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  background: #006ef9;
  cursor: pointer;
}

.diagnosis-card__tag:disabled {
  cursor: default;
}

.diagnosis-card__meta {
  flex: 1;
  min-width: 0;
  color: #697383;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.diagnosis-panel__prompt {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 8px 16px;
  border-radius: 4px;
  background: #fdf4ed;
}

.diagnosis-panel__prompt-header {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.diagnosis-panel__prompt-header-main {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.diagnosis-panel__prompt-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  background: #e37318;
}

.diagnosis-panel__prompt-title {
  margin: 0;
  color: #fe8125;
  font-size: 14px;
  line-height: 24px;
}

.diagnosis-panel__combo-toggle {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
}

.diagnosis-panel__combo-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.diagnosis-panel__combo-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1.28px solid #e5e8eb;
  border-radius: 4px;
  background: #fff;
}

.diagnosis-panel__combo-check {
  display: none;
  width: 9px;
  height: 7px;
  color: #fff;
}

.diagnosis-panel__combo-input:checked + .diagnosis-panel__combo-box {
  border-color: #006ef9;
  background: linear-gradient(90deg, #3b92ff 0%, #006ef9 100%);
}

.diagnosis-panel__combo-input:checked + .diagnosis-panel__combo-box .diagnosis-panel__combo-check {
  display: block;
}

.diagnosis-panel__combo-label {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
}

.diagnosis-panel__recommendations {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding-bottom: 4px;
  border-bottom: 1px dashed rgba(227, 115, 24, 0.25);
}

.diagnosis-panel__prompt-group--recommend .diagnosis-panel__prompt-label {
  color: #e37318;
}

.diagnosis-panel__prompt-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.diagnosis-panel__prompt-label {
  margin: 0;
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  line-height: 20px;
}

.diagnosis-panel__prompt-medicine {
  margin: 0;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
}

.diagnosis-panel__prompt-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.diagnosis-panel__prompt-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 5px 12px;
  border: 1px solid #d8dde1;
  border-radius: 50px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
  background: #fcfcfc;
  cursor: pointer;
}

.diagnosis-panel__prompt-tag:hover:not(:disabled) {
  border-color: #006ef9;
  color: #006ef9;
  background: #f5f9ff;
}

.diagnosis-panel__prompt-tag.is-disabled,
.diagnosis-panel__prompt-tag:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.diagnosis-panel-dropdown-enter-active,
.diagnosis-panel-dropdown-leave-active,
.diagnosis-card-enter-active,
.diagnosis-card-leave-active,
.diagnosis-card-move {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.diagnosis-panel-dropdown-enter-from,
.diagnosis-panel-dropdown-leave-to,
.diagnosis-card-enter-from,
.diagnosis-card-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
