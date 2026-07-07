<template>
  <div :class="['quick-consult-page', { 'quick-consult-page--ab-figma-c': useAbFigmaVariantC }]">
    <header class="quick-consult-page__topbar">
      <Button class="quick-consult-page__back" variant="neutral" size="md" icon @click="handleBack">
        <el-icon class="quick-consult-page__back-icon" aria-hidden="true">
          <ArrowLeft />
        </el-icon>
        <span>返回首页</span>
      </Button>
      <div class="quick-consult-page__topbar-right">
        <Button class="quick-consult-page__template" variant="outline-secondary" size="md" @click="fillConsultTemplate">一键填入模板</Button>
        <Button variant="primary" size="md">在线客服</Button>
        <span class="quick-consult-page__store">好药师大药房（九州通大厦店）</span>
      </div>
    </header>

    <main class="quick-consult-page__main">
      <section class="quick-consult-card" aria-label="快速问诊表单" @keydown.enter.capture="handleEnterAdvance">
        <header class="quick-consult-card__header">
          <div class="quick-consult-card__title-row">
            <h1>武汉市好药师大药房南岸店</h1>
            <span class="quick-consult-card__type">快速问诊</span>
          </div>
          <Button variant="outline-secondary" size="sm" @click="handleBack">取消问诊</Button>
        </header>

        <div class="quick-consult-card__body">
          <!-- 左栏：用药人信息 + 病史信息 -->
          <div class="quick-consult-card__col">
            <section class="form-section">
              <div class="form-section__title-row form-section__title-row--patient">
                <h2 class="form-section__title">用药人信息</h2>
                <QuickFillButton @scan="openIdCardScan" @upload="openIdCardUpload" />
              </div>
              <input
                ref="idCardUploadInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                @change="handleIdCardUpload"
              />
              <div class="form-grid form-grid--patient">
                <div class="patient-info-fields">
                  <div ref="patientNameFieldRef" :class="['form-field', { 'form-field--invalid': fieldError('patientName') }]">
                    <span class="form-field__label"><em>*</em>用药人姓名</span>
                    <div class="form-field__control">
                      <div
                        :class="[
                          'patient-name-control',
                          {
                            'is-active': patientNameFocused,
                            'is-error': fieldError('patientName'),
                            'is-field-error-flash': fieldError('patientName')
                          }
                        ]"
                        @focusin="patientNameFocused = true"
                        @focusout="handlePatientNameFocusout"
                      >
                      <div class="patient-name-inputbox">
                        <input
                          ref="patientNameInput"
                          :value="form.patientName"
                          class="patient-name-input"
                          type="text"
                          placeholder="请输入姓名"
                          @blur="markFieldTouched('patientName')"
                          @input="handlePatientNameInput"
                        />
                        <button
                          v-if="form.patientName"
                          class="patient-name-clear"
                          type="button"
                          aria-label="清空姓名"
                          @mousedown.prevent
                          @click="clearPatientName"
                        >
                          ×
                        </button>
                      </div>
                      <button
                        v-if="showSeparateNameDot"
                        class="patient-name-dot"
                        type="button"
                        aria-label="插入姓名间隔点"
                        @mousedown.prevent
                        @click="insertPatientNameDot"
                      >
                        ·
                      </button>
                    </div>
                      <FormFieldError :message="fieldErrorText('patientName')" />
                    </div>
                  </div>
                  <div class="form-field form-field--gender" role="radiogroup" aria-labelledby="patient-gender-label">
                    <span id="patient-gender-label" class="form-field__label form-field__label--gender"><em>*</em>性别</span>
                    <div class="form-field__inline form-field__inline--gender">
                      <label :class="['form-radio', { 'is-checked': form.gender === 'male' }]">
                        <input v-model="form.gender" class="form-radio__input" type="radio" value="male" />
                        <span class="form-radio__control" aria-hidden="true"></span>
                        <span class="form-radio__label">男</span>
                      </label>
                      <label :class="['form-radio', { 'is-checked': form.gender === 'female' }]">
                        <input v-model="form.gender" class="form-radio__input" type="radio" value="female" />
                        <span class="form-radio__control" aria-hidden="true"></span>
                        <span class="form-radio__label">女</span>
                      </label>
                    </div>
                  </div>
                  <label ref="ageFieldRef" :class="['form-field', fieldFieldClass('age')]">
                    <span class="form-field__label"><em>*</em>年龄</span>
                    <div class="form-field__control">
                      <div
                        :class="[
                          'age-control',
                          {
                            'age-control--error': fieldErrorType('age') === 'error',
                            'age-control--warning': fieldErrorType('age') === 'warning'
                          }
                        ]"
                      >
                        <input
                          v-model="form.age"
                          :class="['jh-input-field', 'jh-input-field--sm', fieldInputClass('age')]"
                          type="text"
                          inputmode="numeric"
                          :placeholder="agePlaceholder"
                          @blur="markFieldTouched('age')"
                          @input="markFieldTouched('age')"
                        />
                        <div
                          ref="ageUnitSelectRef"
                          :class="['age-unit-select', { 'age-unit-select--open': ageUnitOpen }]"
                          aria-label="年龄单位"
                        >
                          <button
                            class="age-unit-select__trigger"
                            type="button"
                            aria-haspopup="listbox"
                            :aria-expanded="ageUnitOpen"
                            @click.stop="ageUnitOpen = !ageUnitOpen"
                          >
                            <span>{{ currentAgeUnitLabel }}</span>
                            <i class="age-unit-select__chevron" aria-hidden="true"></i>
                          </button>
                          <div v-if="ageUnitOpen" class="age-unit-select__menu" role="listbox">
                            <button
                              v-for="option in ageUnitOptions"
                              :key="option.value"
                              :class="{ active: form.ageUnit === option.value }"
                              type="button"
                              role="option"
                              :aria-selected="form.ageUnit === option.value"
                              @click="selectAgeUnit(option.value)"
                            >
                              {{ option.label }}
                            </button>
                          </div>
                        </div>
                      </div>
                      <FormFieldError :message="fieldErrorText('age')" :variant="fieldErrorType('age') || 'error'" />
                    </div>
                  </label>
                  <label class="form-field">
                    <span class="form-field__label">体重</span>
                    <div class="form-field__suffix">
                      <input v-model="form.weight" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入体重" />
                      <span>kg</span>
                    </div>
                  </label>
                  <label ref="phoneFieldRef" :class="['form-field', fieldFieldClass('phone')]">
                    <span class="form-field__label"><em>*</em>手机号码</span>
                    <div class="form-field__control">
                      <input
                        v-model="form.phone"
                        :class="['jh-input-field', 'jh-input-field--sm', fieldInputClass('phone')]"
                        type="text"
                        maxlength="11"
                        inputmode="numeric"
                        placeholder="请输入手机号码"
                        aria-required="true"
                        @blur="markFieldTouched('phone')"
                        @input="markFieldTouched('phone')"
                      />
                      <FormFieldError :message="fieldErrorText('phone')" :variant="fieldErrorType('phone') || 'error'" />
                    </div>
                  </label>
                  <label ref="idCardFieldRef" :class="['form-field', fieldFieldClass('idCard')]">
                    <span class="form-field__label"><em>*</em>用药人身份证</span>
                    <div class="form-field__control">
                      <input
                        v-model="form.idCard"
                        :class="['jh-input-field', 'jh-input-field--sm', fieldInputClass('idCard')]"
                        type="text"
                        maxlength="18"
                        placeholder="请输入身份证号码"
                        aria-required="true"
                        @blur="markFieldTouched('idCard')"
                        @input="markFieldTouched('idCard')"
                      />
                      <FormFieldError :message="fieldErrorText('idCard')" :variant="fieldErrorType('idCard') || 'error'" />
                    </div>
                  </label>
                  <label v-if="isChildUnderSix" ref="guardianNameFieldRef" :class="['form-field', { 'form-field--invalid': fieldError('guardianName') }]">
                    <span class="form-field__label"><em>*</em>监护人姓名</span>
                    <div class="form-field__control">
                      <input
                        v-model="form.guardianName"
                        :class="['jh-input-field', 'jh-input-field--sm', { 'jh-input-field--error': fieldError('guardianName'), 'is-field-error-flash': fieldError('guardianName') }]"
                        type="text"
                        placeholder="请输入姓名"
                      />
                      <FormFieldError :message="fieldErrorText('guardianName')" />
                    </div>
                  </label>
                  <label v-if="isChildUnderSix" ref="guardianIdCardFieldRef" :class="['form-field', fieldFieldClass('guardianIdCard')]">
                    <span class="form-field__label"><em>*</em>监护人身份证</span>
                    <div class="form-field__control">
                      <input
                        v-model="form.guardianIdCard"
                        :class="['jh-input-field', 'jh-input-field--sm', fieldInputClass('guardianIdCard')]"
                        type="text"
                        placeholder="请输入身份证号码"
                      />
                      <FormFieldError :message="fieldErrorText('guardianIdCard')" :variant="fieldErrorType('guardianIdCard') || 'error'" />
                    </div>
                  </label>
                </div>
                <div class="patient-proof-fields">
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>就诊方式</span>
                    <input class="jh-input-field jh-input-field--sm visit-method-field" type="text" value="复诊" disabled />
                  </label>
                  <div ref="proofFieldRef" :class="['form-field', 'form-field--proof', { 'form-field--invalid': fieldError('proof') }]">
                    <span class="form-field__label"><em>*</em>复诊凭证</span>
                    <ProofUploadPanel
                      :proof-voice="proofVoice"
                      :proof-images="proofImages"
                      :max-images="maxProofImages"
                      :max-file-size="maxProofFileSize"
                      :error="fieldError('proof')"
                      :show-inline-error="validationVariant !== 'b'"
                      @select-voice="handleProofVoice"
                      @select-images="handleProofImages"
                      @remove-voice="removeProofVoice"
                      @remove-image="removeProofImage"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section class="form-section">
              <h2 class="form-section__title">病史信息</h2>
              <div class="form-grid form-grid--history">
                <div ref="allergyFieldRef" :class="['form-field', 'form-field--toggle', { 'form-field--invalid': fieldError('allergyDetail') }]">
                  <span class="form-field__label">过敏史</span>
                  <ToggleField
                    v-model="form.allergy"
                    v-model:detail="form.allergyDetail"
                    detail-placeholder="请输入过敏史"
                    :error="fieldError('allergyDetail')"
                    :show-inline-error="validationVariant !== 'b'"
                    @detail-blur="markFieldTouched('allergyDetail')"
                    @detail-input="markFieldTouched('allergyDetail')"
                  />
                </div>
                <div ref="liverFieldRef" :class="['form-field', 'form-field--toggle', { 'form-field--invalid': fieldError('liverDetail') }]">
                  <span class="form-field__label">肝功能异常</span>
                  <ToggleField
                    v-model="form.liverAbnormal"
                    v-model:detail="form.liverDetail"
                    detail-placeholder="请输入肝功能异常"
                    :error="fieldError('liverDetail')"
                    :show-inline-error="validationVariant !== 'b'"
                    @detail-blur="markFieldTouched('liverDetail')"
                    @detail-input="markFieldTouched('liverDetail')"
                  />
                </div>
                <div ref="kidneyFieldRef" :class="['form-field', 'form-field--toggle', { 'form-field--invalid': fieldError('kidneyDetail') }]">
                  <span class="form-field__label">肾功能异常</span>
                  <ToggleField
                    v-model="form.kidneyAbnormal"
                    v-model:detail="form.kidneyDetail"
                    detail-placeholder="请输入肾功能异常"
                    :error="fieldError('kidneyDetail')"
                    :show-inline-error="validationVariant !== 'b'"
                    @detail-blur="markFieldTouched('kidneyDetail')"
                    @detail-input="markFieldTouched('kidneyDetail')"
                  />
                </div>
                <div v-if="showPregnancyOptions" class="form-field form-field--pregnancy">
                  <span class="form-field__label">妊娠哺乳</span>
                  <div class="pregnancy-options">
                    <button
                      v-for="option in pregnancyOptions"
                      :key="option.value"
                      :class="[
                        'jh-btn',
                        'jh-btn--sm',
                        form.pregnancy === option.value ? 'jh-btn--primary' : 'jh-btn--outline-secondary'
                      ]"
                      type="button"
                      @click="form.pregnancy = option.value"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- 右栏：诊断 + 药品 + 备注 -->
          <div class="quick-consult-card__col">
            <DiagnosisSelectPanel
              ref="diagnosisFieldRef"
              v-model:keyword="form.diagnosisKeyword"
              v-model:combo-enabled="comboMedicineEnabled"
              :diagnosis-cards="diagnosisCards"
              :unlinked-medicine-prompts="unlinkedMedicinePrompts"
              :show-inline-link-prompt="useInlineDiagnosisLink"
              :link-prompt-layout="diagnosisLinkPromptLayout"
              :show-combo-medicine-option="showComboMedicineOption"
              :combination-recommendations="combinationRecommendations"
              :dropdown-options="diagnosisDropdownOptions"
              :dropdown-title="diagnosisDropdownTitle"
              :show-dropdown="showDiagnosisOptions"
              :is-common-dropdown="showCommonDiagnosisDropdown"
              :error="fieldError('diagnoses')"
              :show-inline-error="validationVariant !== 'b'"
              :is-disabled="isDiagnosisDisabled"
              @toggle="toggleDiagnosis"
              @remove="removeDiagnosis"
              @link-medicines="linkMedicinesToDiagnosis"
              @focus="showDiagnosisDropdown = true"
              @blur="markFieldTouched('diagnoses')"
            />

            <MedicineSelectPanel
              ref="medicineFieldRef"
              v-model:keyword="form.medicineKeyword"
              :medicines="form.medicines"
              :options="filteredMedicineOptions"
              :units="medicineUnits"
              :can-edit="canEditMedicine"
              :show-dropdown="showMedicineDropdown"
              :active-unit-id="activeUnitMedicineId"
              :placeholder="medicinePlaceholder"
              :error="fieldError('medicines')"
              :show-inline-error="validationVariant !== 'b'"
              :type-label="medicineTypeLabel"
              @focus="openMedicineDropdown"
              @blur="markFieldTouched('medicines')"
              @add="addMedicine"
              @remove="removeMedicine"
              @change-qty="changeQty"
              @toggle-unit="toggleUnitDropdown"
              @select-unit="selectMedicineUnit"
              @unit-focusout="handleUnitFocusout"
              @register-new="registerNewMedicine"
            />

            <section class="form-section remark-section">
              <div class="remark-field">
                <span class="remark-field__label">备注</span>
                <div class="right-field-control remark-field__control">
                <input
                  v-model="form.remark"
                  class="jh-input-field jh-input-field--sm"
                  type="text"
                  maxlength="30"
                  placeholder="请输入备注信息，最多30字"
                />
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer class="quick-consult-card__footer">
          <div class="consent-field">
            <label :class="['consent-check', { 'consent-check--invalid': showValidation && consentError }]">
              <input v-model="form.agreed" type="checkbox" />
              <span class="consent-check__box" aria-hidden="true"></span>
              <span class="consent-check__text">我已阅读并同意 <a href="#" @click.prevent>《互联网问诊知情同意书》</a></span>
            </label>
            <FormFieldError v-if="showValidation && consentError" :message="consentError" />
          </div>
          <div ref="submitButtonRef" class="quick-consult-card__submit-anchor">
            <Button variant="primary" size="md" @click="handleSubmit">提交</Button>
          </div>
        </footer>
      </section>
    </main>

    <TopFormNoticeStack v-if="validationVariant === 'b'" :notices="topNotices" />
    <SystemServiceNotice v-if="validationVariant === 'a'" :message="systemNoticeMessage" />

    <Teleport to="body">
      <div v-if="showConsentDialog" class="consent-confirm-overlay" @click.self="closeConsentDialog">
        <section
          ref="consentDialogRef"
          :class="[
            'consent-confirm-dialog',
            { 'consent-confirm-dialog--centered': consentDialogCentered }
          ]"
          :style="consentDialogStyle"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-confirm-title"
          @click.stop
        >
          <header class="consent-confirm-dialog__header">
            <h2 id="consent-confirm-title">互联网问诊知情同意书</h2>
            <button class="consent-confirm-dialog__close" type="button" aria-label="关闭" @click="closeConsentDialog">×</button>
          </header>
          <div class="consent-confirm-dialog__body">
            请确认您是否已经阅读并同意 <a href="#" @click.prevent>《互联网问诊知情同意书》</a>
          </div>
          <footer
            :class="[
              'consent-confirm-dialog__footer',
              { 'consent-confirm-dialog__footer--center': consentDialogCentered }
            ]"
          >
            <Button variant="outline-secondary" size="md" @click="closeConsentDialog">取消</Button>
            <Button variant="primary" size="md" @click="agreeAndSubmit">同意</Button>
          </footer>
        </section>
      </div>

      <div v-if="showIdCardScanDialog" class="id-card-scan-overlay" @click.self="closeIdCardScan">
        <section class="id-card-scan-dialog" role="dialog" aria-modal="true" aria-labelledby="id-card-scan-title">
          <header class="id-card-scan-dialog__header">
            <h2 id="id-card-scan-title">扫描身份证</h2>
            <button class="id-card-scan-dialog__close" type="button" aria-label="关闭" @click="closeIdCardScan">×</button>
          </header>
          <div class="id-card-scan-dialog__body">
            <p>请将身份证放置在读卡器上，识别完成后将自动填入用药人信息。</p>
            <div v-if="idCardRecognizing" class="id-card-scan-dialog__status">识别中...</div>
          </div>
          <footer class="id-card-scan-dialog__footer">
            <Button variant="outline-secondary" size="md" @click="closeIdCardScan">取消</Button>
            <Button variant="primary" size="md" :disabled="idCardRecognizing" @click="simulateIdCardScan">开始识别</Button>
          </footer>
        </section>
      </div>

      <DiagnosisConfirmDialog
        v-if="useDialogDiagnosisLink"
        v-model="showConfirmDialog"
        :anchor-el="submitButtonRef"
        :groups="diagnosisConfirmGroups"
        :can-confirm="canConfirmDiagnoses"
        :is-selected="isConfirmDiagnosisSelected"
        @close="closeConfirmDialog"
        @confirm="confirmDiagnosesAndSubmit"
        @toggle="toggleConfirmDiagnosis"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { Button } from "@jiahong/ui";
import FormFieldError from "@/components/quick-consult/FormFieldError.vue";
import ProofUploadPanel from "@/components/quick-consult/ProofUploadPanel.vue";
import QuickFillButton from "@/components/quick-consult/QuickFillButton.vue";
import ToggleField from "@/components/quick-consult/ToggleField.vue";
import DiagnosisConfirmDialog from "@/components/quick-consult/DiagnosisConfirmDialog.vue";
import DiagnosisSelectPanel from "@/components/quick-consult/DiagnosisSelectPanel.vue";
import MedicineSelectPanel from "@/components/quick-consult/MedicineSelectPanel.vue";
import SystemServiceNotice from "@/components/quick-consult/SystemServiceNotice.vue";
import TopFormNoticeStack from "@/components/quick-consult/TopFormNoticeStack.vue";
import { collectFieldNotices, useTopFormNotices } from "@/composables/useTopFormNotices";
import { parseIdCardNumber, recognizeIdCardFromImage } from "@/utils/idCard";
import { createEmptyFormErrors, validateQuickConsultForm } from "@/utils/quickConsultValidation";
import {
  buildCombinationRecommendations,
  buildUnlinkedMedicinePrompts,
  canUseCombinationMedicine,
  findMedicineDiagnosisRule,
  isMedicineDiagnosisMatched,
  medicineDiagnosisRules
} from "@/utils/medicineDiagnosisLink";
import { quickConsultDiagnoses } from "@/data/quickConsultDiagnoses";
import {
  medicineUnits,
  psychMedicineNames,
  quickConsultMedicines
} from "@/data/quickConsultMedicines";
import { useConsultStore } from "@/stores/consult";
import { normalizePatientNameDots } from "@/utils/patientNameInput";

const props = defineProps({
  diagnosisLinkVariant: {
    type: String,
    default: "",
    validator: (value) => ["", "a", "b", "c"].includes(value)
  },
  validationVariant: {
    type: String,
    default: "",
    validator: (value) => ["", "a", "b"].includes(value)
  },
  abMode: {
    type: Boolean,
    default: false
  },
  formAbMode: {
    type: Boolean,
    default: false
  },
  consentVariant: {
    type: String,
    default: "",
    validator: (value) => ["", "a", "b"].includes(value)
  },
  consentAbMode: {
    type: Boolean,
    default: false
  },
  patientNameDotVariant: {
    type: String,
    default: "",
    validator: (value) => ["", "a", "b", "c"].includes(value)
  }
});

const emit = defineEmits(["back"]);

const router = useRouter();
const route = useRoute();
const consultStore = useConsultStore();
const { notices: topNotices, pushNotices, clearNotices } = useTopFormNotices();
const systemNoticeMessage = ref("");
let systemNoticeTimer;
const showConfirmDialog = ref(false);
const showConsentDialog = ref(false);
const showDiagnosisDropdown = ref(false);
const showMedicineDropdown = ref(false);
const comboMedicineEnabled = ref(false);
const medicineFocused = ref(false);
const activeUnitMedicineId = ref(null);
const patientNameFocused = ref(false);
const patientNameInput = ref(null);
const idCardUploadInput = ref(null);
const showIdCardScanDialog = ref(false);
const idCardRecognizing = ref(false);
const proofVoice = ref(null);
const proofImages = ref([]);
const showValidation = ref(false);
const submitAttempted = ref(false);
const consentError = ref("");
const formErrors = reactive(createEmptyFormErrors());
const touchedFields = reactive({});
const patientNameFieldRef = ref(null);
const ageFieldRef = ref(null);
const phoneFieldRef = ref(null);
const idCardFieldRef = ref(null);
const guardianNameFieldRef = ref(null);
const guardianIdCardFieldRef = ref(null);
const proofFieldRef = ref(null);
const allergyFieldRef = ref(null);
const liverFieldRef = ref(null);
const kidneyFieldRef = ref(null);
const diagnosisFieldRef = ref(null);
const medicineFieldRef = ref(null);
const submitButtonRef = ref(null);
const consentDialogRef = ref(null);
const consentDialogStyle = ref({});
const confirmDiagnosisSelections = reactive({});
const CONSENT_DIALOG_GAP = 4;
const CONSENT_VIEWPORT_PADDING = 20;
const maxProofImages = 5;
const maxProofFileSize = 5 * 1024 * 1024;
const maxDiagnoses = 5;
const maxMedicines = 5;

const useInlineDiagnosisLink = computed(() => {
  if (props.diagnosisLinkVariant === "b") return false;
  return true;
});

const useDialogDiagnosisLink = computed(() => props.diagnosisLinkVariant === "b");

const diagnosisLinkPromptLayout = computed(() => {
  if (props.diagnosisLinkVariant === "c") return "card";
  return "flat";
});

const consentDialogCentered = computed(() => props.consentVariant === "a");

const patientNameDotMode = computed(() => props.patientNameDotVariant || "a");

const showSeparateNameDot = computed(() => {
  if (patientNameDotMode.value === "a") return true;
  return patientNameDotMode.value === "b" && patientNameFocused.value;
});

const useAbFigmaVariantC = computed(() => props.abMode && props.diagnosisLinkVariant === "c");

const consultType = computed(() => route.query.type || consultStore.consultType || "western");
const consultSource = computed(() => route.query.source || consultStore.consultSource || "text");
const medicineTypePrefix = computed(() => {
  if (consultType.value === "tcm") return "中成药";
  if (consultType.value === "compound") return "复方";
  return "西药";
});
const medicinePlaceholder = computed(() => {
  if (!useAbFigmaVariantC.value && (!patientBaseComplete.value || !guardianComplete.value)) {
    return "请将基本信息填写完整后再进行录药";
  }
  return `[${medicineTypePrefix.value}]请输入药品名称和规格，用空格分隔，最多可录入5个药品`;
});

const pregnancyOptions = [
  { label: "无", value: "none" },
  { label: "备孕中", value: "planning" },
  { label: "怀孕中", value: "pregnant" },
  { label: "哺乳期", value: "lactating" }
];

const ageUnitOpen = ref(false);
const ageUnitSelectRef = ref(null);
const ageUnitOptions = [
  { label: "岁", value: "year" },
  { label: "月", value: "month" }
];

const commonDiagnoses = quickConsultDiagnoses;

const medicineOptions = quickConsultMedicines;

const form = reactive({
  patientName: "",
  gender: "male",
  age: "",
  ageUnit: "year",
  weight: "",
  phone: "",
  idCard: "",
  guardianName: "",
  guardianIdCard: "",
  allergy: "no",
  allergyDetail: "",
  liverAbnormal: "no",
  liverDetail: "",
  kidneyAbnormal: "no",
  kidneyDetail: "",
  pregnancy: "none",
  diagnosisKeyword: "",
  diagnoses: [],
  medicineKeyword: "",
  medicines: [],
  remark: "",
  agreed: false
});

const parsedAge = computed(() => {
  const raw = String(form.age).trim();
  if (!/^(0|[1-9]\d*)$/.test(raw)) return null;
  const age = Number(raw);
  if (form.ageUnit === "month") {
    if (age < 1 || age > 11) return null;
    return age;
  }
  if (age < 0 || age > 120) return null;
  return age;
});

const agePlaceholder = computed(() => (form.ageUnit === "month" ? "请输入月龄（1-11）" : "请输入年龄（0-120）"));
const ageLabel = computed(() => {
  const age = String(form.age).trim();
  if (!age) return "";
  return `${age}${form.ageUnit === "month" ? "月" : "岁"}`;
});

const currentAgeUnitLabel = computed(
  () => ageUnitOptions.find((option) => option.value === form.ageUnit)?.label || "岁"
);

const isChildUnderSix = computed(() => {
  if (parsedAge.value === null) return false;
  return form.ageUnit === "month" || parsedAge.value < 6;
});

const patientBaseComplete = computed(() => {
  return Boolean(form.patientName.trim() && form.gender && parsedAge.value !== null);
});

const guardianComplete = computed(() => {
  if (!isChildUnderSix.value) return true;
  return Boolean(form.guardianName.trim() && form.guardianIdCard.trim());
});

const canEditMedicine = computed(() => useAbFigmaVariantC.value || (patientBaseComplete.value && guardianComplete.value));
const showPregnancyOptions = computed(() => form.gender === "female");
const requiresIdentityInfo = computed(() => {
  const keyword = form.medicineKeyword.trim();
  return [...form.medicines.map((item) => item.name), keyword].filter(Boolean).some((name) => {
    return psychMedicineNames.some((medicineName) => name.includes(medicineName) || medicineName.includes(name));
  });
});
const activeDiagnosisRules = computed(() => {
  const names = [...form.medicines.map((item) => item.name), form.medicineKeyword.trim()].filter(Boolean);
  return medicineDiagnosisRules.filter((rule) => names.some((name) => rule.match(name)));
});
const hasDiagnosisSuggestionContext = computed(() => {
  return activeDiagnosisRules.value.length > 0 || form.medicines.length > 0 || Boolean(form.medicineKeyword.trim());
});
// 根据已录入药品生成 Figma 中“可选疾病”的候选、选中和禁用状态。
const diagnosisSuggestionOptions = computed(() => {
  const labels = [];
  activeDiagnosisRules.value.forEach((rule) => {
    rule.options.forEach((label) => {
      if (!labels.includes(label)) labels.push(label);
    });
  });
  if (!labels.length && form.medicines.length) {
    commonDiagnoses.slice(0, 4).forEach((label) => labels.push(label));
  }
  if (hasDiagnosisSuggestionContext.value) {
    form.diagnoses.forEach((label) => {
      if (!labels.includes(label)) labels.push(label);
    });
  }

  return labels.map((label) => ({
    label,
    selected: form.diagnoses.includes(label),
    disabled: activeDiagnosisRules.value.some((rule) => rule.disabledOptions.includes(label)) || isDiagnosisDisabled(label)
  }));
});
const commonDiagnosisOptions = computed(() =>
  commonDiagnoses.map((label) => ({
    label,
    selected: form.diagnoses.includes(label),
    disabled: isDiagnosisDisabled(label)
  }))
);
const showCommonDiagnosisDropdown = computed(() => !hasDiagnosisSuggestionContext.value);
const diagnosisDropdownTitle = computed(() => (showCommonDiagnosisDropdown.value ? "常见疾病" : "可选疾病"));
const diagnosisDropdownOptions = computed(() =>
  showCommonDiagnosisDropdown.value ? commonDiagnosisOptions.value : diagnosisSuggestionOptions.value
);
const showDiagnosisOptions = computed(
  () => showDiagnosisDropdown.value && diagnosisDropdownOptions.value.length > 0
);

const diagnosisCards = computed(() =>
  form.diagnoses.map((label) => ({
    label,
    linkedMedicines: form.medicines.filter((item) => item.linkedDiagnosis === label).map((item) => item.name)
  }))
);

const unlinkedMedicines = computed(() => form.medicines.filter((medicine) => !medicine.linkedDiagnosis));

const showComboMedicineOption = computed(
  () => canUseCombinationMedicine(form.medicines) && unlinkedMedicines.value.length > 0
);

const combinationRecommendations = computed(() => {
  if (!comboMedicineEnabled.value || !showComboMedicineOption.value) return [];
  return buildCombinationRecommendations(unlinkedMedicines.value, { isDiagnosisDisabled });
});

const unlinkedMedicinePrompts = computed(() =>
  buildUnlinkedMedicinePrompts(unlinkedMedicines.value, { isDiagnosisDisabled })
);

const diagnosisConfirmGroups = computed(() => {
  const buildGroup = (medicine, rule) => ({
    id: `${rule.id}-${medicine.id}`,
    ruleId: rule.id,
    medicineId: medicine.id,
    medicineName: medicine.name,
    options: rule.diagnoses.map((label) => ({
      label,
      disabled: (rule.disabledDiagnoses || []).includes(label) || isDiagnosisDisabled(label)
    }))
  });

  if (props.diagnosisLinkVariant === "b") {
    return form.medicines
      .map((medicine) => {
        const rule = findMedicineDiagnosisRule(medicine.name);
        return rule ? buildGroup(medicine, rule) : null;
      })
      .filter(Boolean)
      .slice(0, maxMedicines);
  }

  return form.medicines
    .map((medicine) => {
      const rule = findMedicineDiagnosisRule(medicine.name);
      if (!rule) return null;
      if (isMedicineDiagnosisMatched(medicine, form.diagnoses)) return null;
      return buildGroup(medicine, rule);
    })
    .filter(Boolean)
    .slice(0, maxMedicines);
});
const canConfirmDiagnoses = computed(() => {
  if (diagnosisConfirmGroups.value.length === 0) return true;
  return diagnosisConfirmGroups.value.every((group) => Boolean(confirmDiagnosisSelections[group.id]));
});
const filteredMedicineOptions = computed(() => {
  const keyword = form.medicineKeyword.trim().toLowerCase();
  if (!keyword) return medicineOptions;
  return medicineOptions.filter((item) => {
    return [item.name, item.spec, medicineTypeLabel(item.type)].some((value) => value.toLowerCase().includes(keyword));
  });
});

function toggleDiagnosis(tag) {
  if (props.validationVariant === "a" && tag === "抑郁发作") {
    showSystemNotice("该疾病所属科室暂无医生");
    return;
  }
  if (isDiagnosisDisabled(tag)) return;
  if (form.diagnoses.includes(tag)) {
    removeDiagnosis(tag);
  } else {
    addDiagnosis(tag);
  }
}

function addDiagnosis(tag) {
  if (isDiagnosisDisabled(tag)) return;
  if (form.diagnoses.length >= maxDiagnoses) return;
  if (!form.diagnoses.includes(tag)) {
    form.diagnoses.push(tag);
  }
  form.diagnosisKeyword = "";
}

function removeDiagnosis(tag) {
  if (isDiagnosisDisabled(tag)) return;
  form.diagnoses = form.diagnoses.filter((item) => item !== tag);
  form.medicines.forEach((medicine) => {
    if (medicine.linkedDiagnosis === tag) {
      medicine.linkedDiagnosis = null;
    }
  });
}

function linkMedicinesToDiagnosis(medicineIds, diagnosis) {
  if (props.validationVariant === "a" && diagnosis === "抑郁发作") {
    showSystemNotice("该疾病所属科室暂无医生");
    return;
  }
  if (isDiagnosisDisabled(diagnosis)) return;
  const ids = Array.isArray(medicineIds) ? medicineIds : [medicineIds];
  const validMedicines = ids
    .map((medicineId) => form.medicines.find((item) => item.id === medicineId))
    .filter(Boolean);
  if (!validMedicines.length) return;
  if (!form.diagnoses.includes(diagnosis) && form.diagnoses.length >= maxDiagnoses) return;

  validMedicines.forEach((medicine) => {
    medicine.linkedDiagnosis = diagnosis;
  });
  if (!form.diagnoses.includes(diagnosis)) {
    form.diagnoses.push(diagnosis);
  }
  form.diagnosisKeyword = "";
}

function isDiagnosisDisabled(tag) {
  return requiresIdentityInfo.value && tag === "抑郁发作";
}

function resetConfirmDiagnosisSelections() {
  Object.keys(confirmDiagnosisSelections).forEach((key) => {
    delete confirmDiagnosisSelections[key];
  });
}

function initConfirmDiagnosisSelections() {
  resetConfirmDiagnosisSelections();
  diagnosisConfirmGroups.value.forEach((group) => {
    const medicine = form.medicines.find((item) => item.id === group.medicineId);
    const linked = medicine?.linkedDiagnosis;
    if (linked && group.options.some((option) => option.label === linked && !option.disabled)) {
      confirmDiagnosisSelections[group.id] = linked;
      return;
    }
    const matchedInForm = group.options.find(
      (option) => form.diagnoses.includes(option.label) && !option.disabled
    );
    if (matchedInForm) {
      confirmDiagnosisSelections[group.id] = matchedInForm.label;
    }
  });
}

function openConfirmDialog() {
  initConfirmDiagnosisSelections();
  showConfirmDialog.value = true;
}

function isConfirmDiagnosisSelected(groupId, label) {
  return confirmDiagnosisSelections[groupId] === label;
}

function toggleConfirmDiagnosis(groupId, label) {
  const group = diagnosisConfirmGroups.value.find((item) => item.id === groupId);
  const option = group?.options.find((item) => item.label === label);
  if (props.validationVariant === "a" && label === "抑郁发作") {
    showSystemNotice("该疾病所属科室暂无医生");
    return;
  }
  if (!group || option?.disabled) return;
  if (confirmDiagnosisSelections[groupId] === label) {
    delete confirmDiagnosisSelections[groupId];
  } else {
    confirmDiagnosisSelections[groupId] = label;
  }
}

function closeDiagnosisDropdown(event) {
  if (!event.target.closest(".diagnosis-panel")) {
    showDiagnosisDropdown.value = false;
  }
  if (!event.target.closest(".medicine-panel")) {
    showMedicineDropdown.value = false;
    medicineFocused.value = false;
    activeUnitMedicineId.value = null;
  }
  if (!event.target.closest(".age-unit-select")) {
    ageUnitOpen.value = false;
  }
}

function changeQty(item, delta) {
  item.qty = Math.max(1, (item.qty || 1) + delta);
}

function removeMedicine(id) {
  form.medicines = form.medicines.filter((item) => item.id !== id);
}

function createMedicineRecord(option) {
  return {
    id: Date.now(),
    type: option.type,
    name: option.name,
    spec: option.spec,
    qty: 1,
    unit: option.unit,
    linkedDiagnosis: null
  };
}

function addMedicine(option) {
  if (form.medicines.length >= maxMedicines) return;
  const duplicate = form.medicines.some((item) => item.name === option.name && item.spec === option.spec);
  if (!duplicate) {
    form.medicines.push(createMedicineRecord(option));
  }
  form.medicineKeyword = "";
  showMedicineDropdown.value = false;
  medicineFocused.value = false;
  showDiagnosisDropdown.value = false;
}

function setAgeUnit(unit) {
  if (!ageUnitOptions.some((option) => option.value === unit)) return;
  form.ageUnit = unit;
  markFieldTouched("age");
}

function selectAgeUnit(unit) {
  setAgeUnit(unit);
  ageUnitOpen.value = false;
}

function medicineTypeLabel(type) {
  if (type === "tcm") return "中成药";
  if (type === "compound") return "复方";
  return "西药";
}

function openMedicineDropdown() {
  if (!canEditMedicine.value) return;
  showMedicineDropdown.value = true;
  medicineFocused.value = true;
}

function registerNewMedicine() {
  if (!canEditMedicine.value) return;
  router.push({ name: "new-product", query: form.medicineKeyword.trim() ? { keyword: form.medicineKeyword.trim() } : {} });
}

function toggleUnitDropdown(item) {
  activeUnitMedicineId.value = activeUnitMedicineId.value === item.id ? null : item.id;
}

function selectMedicineUnit(item, unit) {
  item.unit = unit;
  activeUnitMedicineId.value = null;
}

function handleUnitFocusout(event, item) {
  if (!event.currentTarget.contains(event.relatedTarget) && activeUnitMedicineId.value === item.id) {
    activeUnitMedicineId.value = null;
  }
}

function handlePatientNameFocusout(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    patientNameFocused.value = false;
  }
}

function focusPatientNameInput() {
  requestAnimationFrame(() => {
    patientNameInput.value?.focus();
  });
}

function handlePatientNameInput(event) {
  let value = event.target.value;
  if (patientNameDotMode.value === "c") {
    value = normalizePatientNameDots(value);
  }
  form.patientName = value;
  markFieldTouched("patientName");
}

function insertPatientNameDot() {
  const input = patientNameInput.value;
  if (!input) return;
  const start = input.selectionStart ?? form.patientName.length;
  const end = input.selectionEnd ?? start;
  form.patientName = `${form.patientName.slice(0, start)}·${form.patientName.slice(end)}`;
  focusPatientNameInput();
  requestAnimationFrame(() => {
    input.setSelectionRange(start + 1, start + 1);
  });
}

function clearPatientName() {
  form.patientName = "";
  focusPatientNameInput();
}

function handleProofVoice(payload) {
  markFieldTouched("proof");
  const file = payload?.file || payload;
  const duration = payload?.duration || 1;
  if (!file) return;
  proofVoice.value = {
    id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
    name: file.name,
    file,
    duration
  };
}

function handleProofImages(files) {
  markFieldTouched("proof");
  const availableCount = maxProofImages - proofImages.value.length;
  files.slice(0, availableCount).forEach((file) => {
    proofImages.value.push({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      name: file.name,
      file,
      url: URL.createObjectURL(file)
    });
  });
}

function removeProofVoice() {
  proofVoice.value = null;
}

function removeProofImage(id) {
  const image = proofImages.value.find((item) => item.id === id);
  if (image) URL.revokeObjectURL(image.url);
  proofImages.value = proofImages.value.filter((item) => item.id !== id);
}

function clearProofImages() {
  proofImages.value.forEach((image) => URL.revokeObjectURL(image.url));
  proofImages.value = [];
}

function fillConsultTemplate() {
  removeProofVoice();
  clearProofImages();

  Object.assign(form, {
    patientName: "林小宝",
    gender: "male",
    age: "4",
    ageUnit: "year",
    weight: "16",
    phone: "13800138000",
    idCard: "420106202206012021",
    guardianName: "林建国",
    guardianIdCard: "420106199003150016",
    allergy: "yes",
    allergyDetail: "青霉素过敏",
    liverAbnormal: "no",
    liverDetail: "",
    kidneyAbnormal: "no",
    kidneyDetail: "",
    pregnancy: "none",
    diagnosisKeyword: "",
    diagnoses: [],
    medicineKeyword: "",
    medicines: [],
    remark: "",
    agreed: false
  });

  proofVoice.value = {
    id: `template-voice-${Date.now()}`,
    name: "template-proof.webm",
    file: new File([new Blob(["mock-audio"])], "template-proof.webm", { type: "audio/webm" }),
    duration: 8
  };

  showValidation.value = false;
  submitAttempted.value = false;
  consentError.value = "";
  Object.assign(formErrors, createEmptyFormErrors());
  Object.keys(touchedFields).forEach((key) => {
    delete touchedFields[key];
  });
  showDiagnosisDropdown.value = false;
  showMedicineDropdown.value = false;
  medicineFocused.value = false;
  activeUnitMedicineId.value = null;
}

function applyIdCardRecognition(result) {
  if (!result) return;
  if (result.patientName) {
    form.patientName = result.patientName;
  }
  if (result.idCard) {
    form.idCard = result.idCard;
    const parsed = parseIdCardNumber(result.idCard);
    if (parsed) {
      form.gender = parsed.gender;
      form.age = parsed.age;
      form.ageUnit = "year";
    }
  }
  if (result.gender) {
    form.gender = result.gender;
  }
  if (result.age) {
    form.age = result.age;
    form.ageUnit = "year";
  }
}

function openIdCardUpload() {
  idCardUploadInput.value?.click();
}

function openIdCardScan() {
  showIdCardScanDialog.value = true;
}

function closeIdCardScan() {
  showIdCardScanDialog.value = false;
  idCardRecognizing.value = false;
}

async function simulateIdCardScan() {
  if (idCardRecognizing.value) return;
  idCardRecognizing.value = true;
  try {
    const result = await recognizeIdCardFromImage();
    applyIdCardRecognition(result);
    closeIdCardScan();
  } finally {
    idCardRecognizing.value = false;
  }
}

async function handleIdCardUpload(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return;

  idCardRecognizing.value = true;
  try {
    const result = await recognizeIdCardFromImage(file);
    applyIdCardRecognition(result);
  } finally {
    idCardRecognizing.value = false;
  }
}

function markFieldTouched(key) {
  touchedFields[key] = true;
}

function markAllFieldsTouched() {
  Object.keys(formErrors).forEach((key) => {
    touchedFields[key] = true;
  });
}

function fieldHasInput(key) {
  switch (key) {
    case "patientName":
      return Boolean(form.patientName.trim());
    case "age":
      return Boolean(String(form.age).trim());
    case "phone":
      return Boolean(form.phone.trim());
    case "idCard":
      return Boolean(form.idCard.trim());
    case "guardianName":
      return Boolean(form.guardianName.trim());
    case "guardianIdCard":
      return Boolean(form.guardianIdCard.trim());
    case "proof":
      return Boolean(proofVoice.value) || proofImages.value.length > 0;
    case "allergyDetail":
      return form.allergy === "yes";
    case "liverDetail":
      return form.liverAbnormal === "yes";
    case "kidneyDetail":
      return form.kidneyAbnormal === "yes";
    case "diagnoses":
      return form.diagnoses.length > 0 || Boolean(form.diagnosisKeyword.trim());
    case "medicines":
      return form.medicines.length > 0 || Boolean(form.medicineKeyword.trim());
    default:
      return false;
  }
}

function shouldShowFieldError(key) {
  if (!formErrors[key]?.message) return false;
  if (submitAttempted.value) return true;
  if (touchedFields[key]) return true;
  return fieldHasInput(key);
}

function fieldError(key) {
  return shouldShowFieldError(key) ? formErrors[key].message : "";
}

function fieldErrorText(key) {
  if (props.validationVariant === "b") return "";
  return fieldError(key);
}

function fieldErrorType(key) {
  return shouldShowFieldError(key) ? formErrors[key].type : "";
}

function fieldFieldClass(key) {
  const type = fieldErrorType(key);
  return {
    "form-field--invalid": type === "error",
    "form-field--warning": type === "warning"
  };
}

function fieldInputClass(key) {
  const message = fieldError(key);
  const type = fieldErrorType(key);
  return {
    "jh-input-field--error": message && type === "error",
    "jh-input-field--warning": message && type === "warning",
    "is-field-error-flash": message && type === "error",
    "is-field-warning-flash": message && type === "warning"
  };
}

watchEffect(() => {
  const result = validateQuickConsultForm({
    form,
    proofVoice: proofVoice.value,
    proofImages: proofImages.value,
    isChildUnderSix: isChildUnderSix.value,
    canEditMedicine: canEditMedicine.value,
    skipDiagnosesValidation: props.diagnosisLinkVariant === "b"
  });
  Object.assign(formErrors, result.errors);
});

watch(
  () => form.allergy,
  (value) => {
    if (value === "yes") markFieldTouched("allergyDetail");
  }
);

watch(
  () => form.liverAbnormal,
  (value) => {
    if (value === "yes") markFieldTouched("liverDetail");
  }
);

watch(
  () => form.kidneyAbnormal,
  (value) => {
    if (value === "yes") markFieldTouched("kidneyDetail");
  }
);

watch(showConsentDialog, (open) => {
  if (open) scheduleConsentDialogPosition();
});

watch(
  () => form.agreed,
  () => {
    consentError.value = "";
  }
);

function runFormValidation() {
  const result = validateQuickConsultForm({
    form,
    proofVoice: proofVoice.value,
    proofImages: proofImages.value,
    isChildUnderSix: isChildUnderSix.value,
    canEditMedicine: canEditMedicine.value,
    skipDiagnosesValidation: props.diagnosisLinkVariant === "b"
  });
  Object.assign(formErrors, result.errors);
  return result.valid;
}

const fieldRefMap = {
  patientName: patientNameFieldRef,
  age: ageFieldRef,
  phone: phoneFieldRef,
  idCard: idCardFieldRef,
  guardianName: guardianNameFieldRef,
  guardianIdCard: guardianIdCardFieldRef,
  proof: proofFieldRef,
  allergyDetail: allergyFieldRef,
  liverDetail: liverFieldRef,
  kidneyDetail: kidneyFieldRef,
  diagnoses: diagnosisFieldRef,
  medicines: medicineFieldRef
};

async function scrollToFirstError() {
  await nextTick();
  const firstKey = Object.keys(formErrors).find((key) => formErrors[key].message && shouldShowFieldError(key));
  const targetRef = firstKey ? fieldRefMap[firstKey]?.value : null;
  const target = targetRef?.sectionRef ?? targetRef?.$el ?? targetRef;
  target?.scrollIntoView?.({ behavior: "smooth", block: "center" });
}

function resolveAnchorElement(anchor) {
  if (!anchor) return null;
  return anchor.$el ?? anchor;
}

function updateConsentDialogPosition() {
  const dialogElement = consentDialogRef.value;
  if (!dialogElement) return;

  if (consentDialogCentered.value) {
    consentDialogStyle.value = {
      left: "50%",
      top: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      width: "562px",
      maxWidth: `min(562px, calc(100vw - ${CONSENT_VIEWPORT_PADDING * 2}px))`
    };
    return;
  }

  const anchorElement = resolveAnchorElement(submitButtonRef.value);
  if (!anchorElement) return;

  const anchorRect = anchorElement.getBoundingClientRect();
  const maxWidth = Math.min(562, window.innerWidth - CONSENT_VIEWPORT_PADDING * 2);
  const right = Math.max(CONSENT_VIEWPORT_PADDING, window.innerWidth - anchorRect.right);
  const bottom = Math.max(
    CONSENT_VIEWPORT_PADDING,
    window.innerHeight - anchorRect.top + CONSENT_DIALOG_GAP
  );
  const maxHeight = window.innerHeight - bottom - CONSENT_VIEWPORT_PADDING;

  consentDialogStyle.value = {
    left: "auto",
    top: "auto",
    transform: "none",
    right: `${right}px`,
    bottom: `${bottom}px`,
    width: `${maxWidth}px`,
    maxHeight: `${Math.max(180, maxHeight)}px`
  };
}

function scheduleConsentDialogPosition() {
  nextTick(() => {
    updateConsentDialogPosition();
    nextTick(updateConsentDialogPosition);
  });
}

function handleConsentDialogViewportChange() {
  if (showConsentDialog.value) updateConsentDialogPosition();
}

function focusNextEnterTarget(currentTarget, rootElement) {
  const orderedSelectors = [
    ".patient-name-input",
    ".age-control input",
    'input[placeholder="请输入体重"]',
    'input[placeholder="请输入手机号码"]',
    'input[placeholder="请输入身份证号码"]',
    'input[placeholder="请输入姓名"]',
    ".toggle-field__detail",
    ".diagnosis-panel__input",
    ".medicine-panel__input",
    'input[placeholder="请输入备注信息，最多30字"]',
    ".quick-consult-card__submit-anchor button"
  ];
  const root = rootElement ?? document;
  const targets = orderedSelectors
    .flatMap((selector) => Array.from(root.querySelectorAll(selector)))
    .filter((element, index, all) => all.indexOf(element) === index)
    .filter((element) => {
      const style = window.getComputedStyle(element);
      return (
        !element.disabled &&
        element.offsetParent !== null &&
        style.visibility !== "hidden" &&
        style.display !== "none"
      );
    });
  const currentIndex = targets.indexOf(currentTarget);
  const nextTarget = currentIndex >= 0 ? targets[currentIndex + 1] : targets[0];
  nextTarget?.focus?.();
}

function handleEnterAdvance(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.type === "file" || target.type === "radio" || target.type === "checkbox") return;
  event.preventDefault();
  focusNextEnterTarget(target, event.currentTarget);
}

function handleBack() {
  if (props.abMode) {
    emit("back");
    return;
  }
  router.push("/");
}

function showSystemNotice(message) {
  if (props.validationVariant !== "a") return;
  window.clearTimeout(systemNoticeTimer);
  systemNoticeMessage.value = message;
  systemNoticeTimer = window.setTimeout(() => {
    systemNoticeMessage.value = "";
  }, 3000);
}

function pushTopValidationNotices() {
  const items = collectFieldNotices(formErrors, shouldShowFieldError);
  clearNotices();
  pushNotices(items);
}

function setupConsentAbDemoState() {
  fillConsultTemplate();
}

function setupFormValidationAbDemoState() {
  removeProofVoice();
  clearProofImages();

  Object.assign(form, {
    patientName: "林晓晓",
    gender: "female",
    age: "24",
    ageUnit: "year",
    weight: "",
    phone: "12345",
    idCard: "",
    guardianName: "",
    guardianIdCard: "",
    allergy: "no",
    allergyDetail: "",
    liverAbnormal: "yes",
    liverDetail: "",
    kidneyAbnormal: "no",
    kidneyDetail: "",
    pregnancy: "none",
    diagnosisKeyword: "",
    diagnoses: [],
    medicineKeyword: "",
    medicines: [],
    remark: "",
    agreed: false
  });

  proofVoice.value = {
    id: `template-voice-${Date.now()}`,
    name: "template-proof.webm",
    file: new File([new Blob(["mock-audio"])], "template-proof.webm", { type: "audio/webm" }),
    duration: 8
  };

  showValidation.value = false;
  submitAttempted.value = false;
  consentError.value = "";
  Object.assign(formErrors, createEmptyFormErrors());
  Object.keys(touchedFields).forEach((key) => {
    delete touchedFields[key];
  });
  clearNotices();
  systemNoticeMessage.value = "";
}

function setupAbDemoState() {
  if (useAbFigmaVariantC.value) {
    removeProofVoice();
    clearProofImages();

    Object.assign(form, {
      patientName: "",
      gender: "female",
      age: "",
      ageUnit: "year",
      weight: "",
      phone: "",
      idCard: "",
      guardianName: "",
      guardianIdCard: "",
      allergy: "yes",
      allergyDetail: "青霉素过敏",
      liverAbnormal: "yes",
      liverDetail: "转氨酶偏高",
      kidneyAbnormal: "yes",
      kidneyDetail: "肌酐偏高",
      pregnancy: "none",
      diagnosisKeyword: "",
      diagnoses: ["认知障碍", "急性扁桃体炎"],
      medicineKeyword: "",
      medicines: [
        {
          id: "ab-c-medicine-escitalopram",
          type: "western",
          name: "草酸艾司西酞普兰片",
          spec: "10mg*7片",
          qty: 2,
          unit: "盒",
          linkedDiagnosis: null
        },
        {
          id: "ab-c-medicine-cold",
          type: "compound",
          name: "感冒片",
          spec: "0.5g*24片",
          qty: 1,
          unit: "盒",
          linkedDiagnosis: null
        },
        {
          id: "ab-c-medicine-clarithromycin",
          type: "western",
          name: "克拉霉素胶囊",
          spec: "0.125g*10粒",
          qty: 1,
          unit: "盒",
          linkedDiagnosis: null
        }
      ],
      remark: "",
      agreed: false
    });

    proofVoice.value = {
      id: `ab-c-proof-${Date.now()}`,
      name: "ab-c-proof.webm",
      file: new File([new Blob(["mock-audio"])], "ab-c-proof.webm", { type: "audio/webm" }),
      duration: 8
    };

    showValidation.value = false;
    submitAttempted.value = false;
    consentError.value = "";
    Object.assign(formErrors, createEmptyFormErrors());
    Object.keys(touchedFields).forEach((key) => {
      delete touchedFields[key];
    });
    showDiagnosisDropdown.value = false;
    showMedicineDropdown.value = false;
    medicineFocused.value = false;
    activeUnitMedicineId.value = null;
    return;
  }

  fillConsultTemplate();
}

function handleSubmit() {
  submitAttempted.value = true;
  showValidation.value = true;
  markAllFieldsTouched();
  consentError.value = "";

  if (useDialogDiagnosisLink.value && props.diagnosisLinkVariant === "b" && diagnosisConfirmGroups.value.length > 0) {
    const basicResult = validateQuickConsultForm({
      form,
      proofVoice: proofVoice.value,
      proofImages: proofImages.value,
      isChildUnderSix: isChildUnderSix.value,
      canEditMedicine: canEditMedicine.value,
      skipDiagnosesValidation: true
    });
    Object.assign(formErrors, basicResult.errors);
    if (!basicResult.valid) {
      if (props.validationVariant === "b") {
        pushTopValidationNotices();
      }
      scrollToFirstError();
      return;
    }
    openConfirmDialog();
    return;
  }

  const isValid = runFormValidation();
  if (!isValid) {
    if (props.validationVariant === "b") {
      pushTopValidationNotices();
    }
    scrollToFirstError();
    return;
  }
  if (diagnosisConfirmGroups.value.length > 0) {
    if (useDialogDiagnosisLink.value) {
      openConfirmDialog();
      return;
    }
    ElMessage.warning("请为每个药品选择对应的疾病信息");
    markFieldTouched("diagnoses");
    scrollToFirstError();
    return;
  }
  if (!form.agreed) {
    openConsentDialog();
    return;
  }
  goTextConsult();
}

function openConsentDialog() {
  consentError.value = "请先阅读并同意《互联网问诊知情同意书》";
  showConsentDialog.value = true;
  scheduleConsentDialogPosition();
}

function agreeAndSubmit() {
  submitAttempted.value = true;
  showValidation.value = true;
  markAllFieldsTouched();
  consentError.value = "";
  const isValid = runFormValidation();
  if (!isValid) {
    showConsentDialog.value = false;
    scrollToFirstError();
    return;
  }
  form.agreed = true;
  showConsentDialog.value = false;
  goTextConsult();
}

function closeConsentDialog() {
  showConsentDialog.value = false;
}

function closeConfirmDialog() {
  showConfirmDialog.value = false;
}

function confirmDiagnosesAndSubmit() {
  if (!canConfirmDiagnoses.value) return;
  diagnosisConfirmGroups.value.forEach((group) => {
    const label = confirmDiagnosisSelections[group.id];
    if (!label) return;
    addDiagnosis(label);
    const medicine = form.medicines.find((item) => item.id === group.medicineId);
    if (medicine) {
      medicine.linkedDiagnosis = label;
    }
  });
  resetConfirmDiagnosisSelections();
  if (!form.agreed) {
    openConsentDialog();
    return;
  }
  goTextConsult();
}

function genderLabel(gender) {
  return gender === "female" ? "女" : "男";
}

function goTextConsult() {
  if (props.abMode) {
    showConfirmDialog.value = false;
    ElMessage.info("AB 测试中暂不提交问诊");
    return;
  }
  showConfirmDialog.value = false;
  consultStore.setVisitInfo({
    patientName: form.patientName.trim(),
    gender: form.gender,
    genderLabel: genderLabel(form.gender),
    age: String(form.age).trim(),
    ageUnit: form.ageUnit,
    ageLabel: ageLabel.value,
    weight: String(form.weight).trim(),
    phone: form.phone.trim(),
    idCard: form.idCard.trim(),
    guardianName: form.guardianName.trim(),
    guardianIdCard: form.guardianIdCard.trim(),
    diagnoses: [...form.diagnoses],
    medicines: form.medicines.map((item) => ({
      id: item.id,
      type: item.type,
      typeLabel: medicineTypeLabel(item.type),
      name: item.name,
      spec: item.spec,
      qty: item.qty,
      unit: item.unit
    })),
    allergy: form.allergy,
    allergyDetail: form.allergyDetail.trim(),
    liverAbnormal: form.liverAbnormal,
    liverDetail: form.liverDetail.trim(),
    kidneyAbnormal: form.kidneyAbnormal,
    kidneyDetail: form.kidneyDetail.trim(),
    pregnancy: form.pregnancy,
    remark: form.remark.trim(),
    source: consultSource.value === "convenient" ? "convenient" : "text"
  });
  router.push({ name: "text-consult", query: { source: consultSource.value === "convenient" ? "convenient" : "text" } });
}

watch(
  () => form.gender,
  (gender) => {
    if (gender === "male") {
      form.pregnancy = "none";
    }
  }
);

onMounted(() => {
  if (props.consentAbMode) {
    setupConsentAbDemoState();
    if (route.query.scene === "consent") {
      nextTick(() => openConsentDialog());
    }
  } else if (props.formAbMode) {
    setupFormValidationAbDemoState();
  } else if (props.abMode) {
    setupAbDemoState();
  }
  document.addEventListener("mousedown", closeDiagnosisDropdown);
  window.addEventListener("resize", handleConsentDialogViewportChange);
  window.addEventListener("scroll", handleConsentDialogViewportChange, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", closeDiagnosisDropdown);
  window.removeEventListener("resize", handleConsentDialogViewportChange);
  window.removeEventListener("scroll", handleConsentDialogViewportChange, true);
  window.clearTimeout(systemNoticeTimer);
  clearProofImages();
  clearNotices();
});
</script>

<style scoped>
.quick-consult-page {
  min-width: 1440px;
  min-height: 100vh;
  background: #f4f5f6;
}

.quick-consult-page__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 56px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid var(--jh-color-border);
}

.quick-consult-page__topbar :deep(.jh-btn) {
  height: 32px;
  padding: 5px 16px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 22px;
}

.quick-consult-page__topbar :deep(.quick-consult-page__back) {
  width: 112px;
  border: 0;
  color: rgba(0, 0, 0, 0.6);
  background: #f3f4f6;
}

.quick-consult-page__back-icon {
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
}

.quick-consult-page__topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quick-consult-page__topbar-right .quick-consult-page__store {
  margin-left: 20px;
}

.quick-consult-page__store {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
}

.quick-consult-page__main {
  box-sizing: border-box;
  width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

.quick-consult-card {
  position: relative;
  width: 1392px;
  height: min(740px, calc(100vh - 104px));
  border: 0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 11.2px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.quick-consult-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 56px;
  min-height: 56px;
  padding: 0 48px;
  border-bottom: 0;
  background: #fcfcfc;
  box-shadow: 0 6px 16px -8px rgba(16, 42, 67, 0.08), 0 1px 3px rgba(16, 42, 67, 0.05);
}

.quick-consult-card__title-row {
  display: flex;
  align-items: center;
  gap: 24px;
}

.quick-consult-card__title-row h1 {
  margin: 0;
  color: rgba(0, 0, 0, 0.9);
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  text-wrap: pretty;
  word-break: auto-phrase;
}

.quick-consult-card__type {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  padding: 5px 12px;
  border-radius: 4px;
  color: #006ef9;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
  background: #d1e5fe;
}

.quick-consult-card__header :deep(.jh-btn) {
  height: 32px;
  padding: 5px 16px;
  border: 1px solid #d8dde1;
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
  background: #fff;
}

.quick-consult-card__body {
  display: grid;
  grid-template-columns: 10fr 13fr;
  gap: 0;
  height: calc(100% - 56px);
  min-height: 0;
  padding-bottom: 72px;
  overflow-y: auto;
  box-sizing: border-box;
}

.quick-consult-card__col {
  box-sizing: border-box;
  min-width: 0;
  padding: 32px 48px 20px;
  overflow-x: hidden;
}

.quick-consult-card__col + .quick-consult-card__col {
  padding-right: 48px;
  padding-left: 23px;
  border-left: 1px solid #e5e8eb;
}

.form-section + .form-section {
  margin-top: 32px;
}

.form-section__title {
  position: relative;
  margin: 0 0 16px;
  padding-left: 8px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  white-space: nowrap;
}

.form-section__title::before {
  position: absolute;
  top: 4px;
  left: 0;
  width: 4px;
  height: 16px;
  border-radius: 1px;
  background: #006ef9;
  content: "";
}

.form-section__title em {
  margin-right: 0;
  color: #cb2c2c;
  font-style: normal;
}

.form-section__title:has(em) {
  padding-left: 18px;
}

.form-section__title:has(em)::before {
  left: 9px;
}

.form-section__title:has(em) em {
  position: absolute;
  top: 3px;
  left: 0;
  line-height: 18px;
}

.form-section__title-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 16px;
}

.form-section__title-row--patient {
  gap: 8px;
  margin-left: 0;
}

.form-section__title-row .form-section__title {
  margin-bottom: 0;
}

.form-section__note {
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  line-height: 22px;
  text-wrap: pretty;
  word-break: auto-phrase;
}

.form-grid {
  display: grid;
  gap: 12px 31px;
}

.form-grid--patient {
  grid-template-columns: minmax(0, 1.47fr) minmax(0, 1fr);
  align-items: start;
  gap: 12px 20px;
}

.patient-info-fields,
.patient-proof-fields {
  display: grid;
  gap: 12px;
}

.patient-info-fields {
  margin-left: 7px;
}

.form-grid--history {
  grid-template-columns: 1fr;
  gap: 12px;
}

.form-field {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  align-items: start;
  gap: 4px 16px;
  min-height: 32px;
}

.form-field__label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 32px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
  text-align: right;
  white-space: nowrap;
}

.form-field__control {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
}

.form-field__control > .patient-name-control,
.form-field__control > .jh-input-field,
.form-field__control > .form-field__suffix,
.form-field__control > .diagnosis-picker,
.form-field__control > .medicine-search,
.form-field__control > .right-field-control {
  flex: 0 0 auto;
}

.patient-info-fields .form-field {
  grid-template-columns: 84px minmax(0, 1fr);
}

.patient-info-fields .form-field:nth-child(3) .jh-input-field {
  width: 100%;
  max-width: 154px;
}

.patient-info-fields .jh-input-field {
  width: 100%;
}

.patient-proof-fields .form-field {
  grid-template-columns: 63px minmax(0, 1fr);
}

.form-grid--history .form-field {
  grid-template-columns: 70px minmax(0, 1fr);
}

.form-grid--history .form-field__label em {
  display: none;
}

.form-field--proof {
  align-items: start;
}

.form-field--proof .form-field__label {
  min-height: 32px;
  line-height: 22px;
}

.form-grid--history .form-field--toggle {
  grid-template-columns: 70px auto minmax(0, 1fr);
  grid-template-rows: auto auto;
  gap: 4px 16px;
  align-items: start;
}

.form-grid--history .form-field--toggle .form-field__label {
  grid-row: 1;
  min-height: 32px;
}

.form-grid--history :deep(.toggle-field__buttons) {
  grid-column: 2;
  grid-row: 1;
}

.form-grid--history :deep(.toggle-field__detail-col) {
  grid-column: 3;
  grid-row: 1;
  min-width: 0;
}

.form-grid--history :deep(.toggle-field__error) {
  grid-column: 3;
  grid-row: 2;
}

.form-field--upload {
  align-items: start;
}

.form-field--upload .form-field__label {
  padding-top: 0;
  line-height: 22px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-field__label em {
  margin-right: 0;
  color: #cb2c2c;
  font-style: normal;
}

.jh-input-field--error,
.patient-name-control.is-error .patient-name-inputbox,
.diagnosis-picker.is-error .diagnosis-picker__input,
.medicine-search.is-error .medicine-search__input {
  border-color: #d54941 !important;
  box-shadow: none !important;
}

.jh-input-field--warning {
  border-color: #e37318 !important;
  box-shadow: none !important;
}

.is-field-error-flash {
  animation: field-error-flash 0.9s ease;
}

.is-field-warning-flash {
  animation: field-warning-flash 0.9s ease;
}

@keyframes field-error-flash {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(213, 73, 65, 0);
  }

  35%,
  65% {
    box-shadow: 0 0 0 3px rgba(213, 73, 65, 0.22);
  }
}

@keyframes field-warning-flash {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(227, 115, 24, 0);
  }

  35%,
  65% {
    box-shadow: 0 0 0 3px rgba(227, 115, 24, 0.22);
  }
}

.form-field--invalid .form-field__label,
.form-section--invalid .form-section__title em {
  color: #d54941;
}

.form-field--warning .form-field__label {
  color: #e37318;
}

.form-field--gender {
  align-items: center;
  min-height: 22px;
}

.form-field__label--gender {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.form-field__label--gender em {
  margin-right: 0;
}

.form-field__inline {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 32px;
}

.form-field__inline--gender {
  gap: 16px;
  width: 92px;
  min-height: 22px;
}

.form-radio {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 38px;
  height: 22px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  cursor: pointer;
}

.form-radio__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  border: 0;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.form-radio__control {
  position: relative;
  flex: 0 0 auto;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  border: 1px solid #d8dde1;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
}

.form-radio__control::after {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  transform: translate(-50%, -50%);
  content: "";
}

.form-radio.is-checked .form-radio__control {
  border-color: #006ef9;
  background: #fff;
}

.form-radio.is-checked .form-radio__control::after {
  background: #006ef9;
}

.form-radio__input:focus-visible + .form-radio__control {
  outline: 2px solid rgba(0, 110, 249, 0.28);
  outline-offset: 2px;
}

.form-radio__label {
  width: 14px;
  height: 22px;
}

.patient-name-control {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
}

.patient-name-inputbox {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  border: 1px solid #e5e8eb;
  border-radius: 6px;
  background: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.patient-name-inputbox:hover {
  border-color: #1f2933;
}

.patient-name-control.is-active .patient-name-inputbox {
  border-color: var(--jh-color-primary);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--jh-color-primary) 18%, transparent);
}

.patient-name-input {
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0 32px 0 10px;
  border: 0;
  border-radius: inherit;
  color: var(--jh-color-text);
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  background: transparent;
  outline: none;
}

.patient-name-input::placeholder {
  color: var(--jh-color-placeholder, #b8bec8);
}

.quick-consult-card input::placeholder {
  color: var(--jh-color-placeholder, #b8bec8);
}

.patient-name-clear {
  position: absolute;
  top: 50%;
  right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: #fff;
  font-size: 14px;
  line-height: 1;
  background: #b7c0cc;
  cursor: pointer;
  transform: translateY(-50%);
}

.patient-name-dot {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid #e5e8eb;
  border-radius: 6px;
  color: var(--jh-color-primary);
  font-size: 18px;
  line-height: 1;
  background: #fff;
  cursor: pointer;
}

.patient-name-control.is-active .patient-name-dot {
  border-color: var(--jh-color-primary);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--jh-color-primary) 18%, transparent);
}

.patient-name-dot:hover {
  border-color: var(--jh-color-primary);
}

.form-field__suffix {
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  max-width: 154px;
}

.form-field__suffix span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 32px;
  margin-left: -1px;
  border: 1px solid var(--jh-color-border);
  border-radius: 0 3px 3px 0;
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  background: #f4f4f4;
}

.form-field__suffix .jh-input-field {
  flex: 1;
  width: auto;
  min-width: 0;
  border-radius: 3px 0 0 3px;
}

.age-control {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 220px;
}

.age-control .jh-input-field {
  flex: 1;
  min-width: 0;
  border-radius: 6px 0 0 6px;
}

.age-unit-select {
  position: relative;
  flex: 0 0 auto;
  margin-left: -1px;
}

.age-control--error .age-unit-select__trigger {
  border-color: #d54941;
}

.age-control--warning .age-unit-select__trigger {
  border-color: #e37318;
}

.age-unit-select__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  box-sizing: border-box;
  width: 56px;
  height: 32px;
  padding: 0 8px 0 10px;
  border: 1px solid #e5e8eb;
  border-radius: 0 6px 6px 0;
  color: rgba(0, 0, 0, 0.9);
  font: inherit;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
}

.age-unit-select--open .age-unit-select__trigger {
  border-color: #006ef9;
}

.age-unit-select__chevron {
  flex: 0 0 auto;
  width: 0;
  height: 0;
  border-top: 4px solid rgba(0, 0, 0, 0.4);
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}

.age-unit-select__menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 20;
  min-width: 56px;
  overflow: hidden;
  border: 1px solid #e5e8eb;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 6px 16px -8px rgba(16, 42, 67, 0.08), 0 1px 3px rgba(16, 42, 67, 0.05);
}

.age-unit-select__menu button {
  display: block;
  width: 100%;
  padding: 6px 12px;
  border: 0;
  color: rgba(0, 0, 0, 0.9);
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  background: #fff;
  cursor: pointer;
}

.age-unit-select__menu button:hover,
.age-unit-select__menu button.active {
  color: #006ef9;
  background: #eef6ff;
}

.visit-method-field {
  width: 100%;
  max-width: 154px;
  cursor: not-allowed;
}

.patient-proof-fields .jh-input-field {
  width: 100%;
  max-width: 154px;
}

.pregnancy-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pregnancy-options .jh-btn {
  height: 32px;
  padding: 5px 12px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
}

.quick-consult-card .medicine-panel {
  margin-top: 32px;
}

.quick-consult-card .remark-section {
  margin-top: 12px;
}

.medicine-section .form-section__title-row {
  margin-bottom: 12px;
}

.right-field-control {
  box-sizing: border-box;
  width: calc(100% - 9px);
  margin-left: 9px;
}

.right-field-control .jh-input-field {
  box-sizing: border-box;
  width: 100%;
}

.diagnosis-picker {
  position: relative;
}

.diagnosis-picker__input {
  display: block;
  width: 100%;
  height: 32px;
  min-height: 32px;
  padding: 5px 10px;
  border: 1px solid #e5e8eb;
  border-radius: 6px;
  color: var(--jh-color-text);
  font-family: var(--jh-font-family);
  font-size: 14px;
  line-height: 22px;
  background: var(--jh-color-bg-surface);
  box-shadow: none;
  outline: 0;
  appearance: none;
  -webkit-appearance: none;
}

.diagnosis-picker__input:hover {
  border-color: #1f2933;
}

.diagnosis-picker__input:focus,
.diagnosis-picker__input:focus-visible {
  border-color: var(--jh-color-primary);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--jh-color-primary) 18%, transparent);
  outline: 0;
}

.diagnosis-selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 12px;
}

.diagnosis-selected-move,
.diagnosis-selected-enter-active,
.diagnosis-selected-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.diagnosis-selected-enter-from,
.diagnosis-selected-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.diagnosis-dropdown-fade-enter-active,
.diagnosis-dropdown-fade-leave-active {
  transform-origin: top center;
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.diagnosis-dropdown-fade-enter-from,
.diagnosis-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scaleY(0.98);
}

.diagnosis-dropdown {
  box-sizing: border-box;
  width: 100%;
  margin-top: 8px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  overflow: visible;
}

.diagnosis-dropdown--persistent {
  position: static;
  max-height: none;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  overflow: visible;
}

.diagnosis-dropdown--common {
  position: absolute;
  z-index: 30;
  top: calc(100% + 8px);
  left: 0;
  max-height: 270px;
  padding: 14px 12px 16px;
  border: 1px solid #e5e8eb;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(16, 42, 67, 0.14), 0 2px 6px rgba(16, 42, 67, 0.08);
  overflow-y: auto;
}

.diagnosis-dropdown--common::-webkit-scrollbar {
  width: 8px;
}

.diagnosis-dropdown--common::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: #d8dde1;
}

.diagnosis-dropdown__label {
  margin: 0 0 8px;
  color: rgba(0, 0, 0, 0.4);
  font-family: var(--jh-font-family);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.diagnosis-dropdown--common .diagnosis-dropdown__label {
  margin-bottom: 14px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 16px;
  line-height: 24px;
}

.diagnosis-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.diagnosis-dropdown--common .diagnosis-tags {
  gap: 12px 10px;
}

.diagnosis-dropdown--common .diagnosis-chip {
  height: 32px;
  padding: 5px 18px;
  font-size: 14px;
  line-height: 22px;
}

.diagnosis-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 28px;
  min-width: 0;
  padding: 5px 11px;
  border: 1px solid #d8dde1;
  border-radius: 50px;
  color: rgba(0, 0, 0, 0.6);
  font-family: var(--jh-font-family);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  background: #fcfcfc;
  cursor: pointer;
  appearance: none;
}

.diagnosis-chip.is-selected {
  border-color: #006ef9;
  color: #fff;
  background: #006ef9;
}

.diagnosis-chip--selected-result {
  height: 28px;
  padding: 3px 11px;
  border-color: #d8dde1;
  color: rgba(0, 0, 0, 0.6);
  background: #fcfcfc;
}

.diagnosis-chip--selected-result:hover {
  border-color: #b9c0c7;
  background: #f5f7fa;
}

.diagnosis-chip.is-disabled,
.diagnosis-chip:disabled {
  border-color: #d8dde1;
  color: rgba(0, 0, 0, 0.26);
  background: #eceef0;
  cursor: not-allowed;
}

.medicine-section.is-disabled .form-section__note {
  color: var(--jh-color-muted);
}

.medicine-search {
  position: relative;
}

.medicine-search__input {
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  padding: 5px 10px;
  border: 1px solid #e5e8eb;
  border-radius: 6px;
  color: var(--jh-color-text);
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  background: #fff;
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.medicine-search__input:hover {
  border-color: #338bfa;
}

.medicine-search.is-active .medicine-search__input {
  border-color: #005ed4;
}

.medicine-search.is-disabled .medicine-search__input {
  border-color: #e5e8eb;
  color: var(--jh-color-muted);
  background: #f8f8f9;
  cursor: not-allowed;
}

.medicine-dropdown {
  position: absolute;
  z-index: 18;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 236px;
  padding: 4px 0;
  border: 1px solid #d0d5d9;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 6px 16px rgba(19, 29, 43, 0.12);
  overflow-y: auto;
}

.medicine-dropdown__item {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) 96px 38px;
  align-items: center;
  width: 100%;
  min-height: 32px;
  padding: 5px 12px;
  border: 0;
  color: #697383;
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  background: #fff;
  cursor: pointer;
}

.medicine-dropdown__item:hover {
  background: #f5f9ff;
}

.medicine-dropdown__type {
  color: #697383;
}

.medicine-dropdown__name,
.medicine-dropdown__spec {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.medicine-not-found {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 8px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
}

.medicine-not-found__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 28px;
  padding: 4px 12px;
  border: 0;
  border-radius: 6px;
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  background: linear-gradient(270deg, #3b92ff 0%, #006ef9 100%);
  cursor: pointer;
}

.medicine-not-found__icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.medicine-not-found__icon::before,
.medicine-not-found__icon::after {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 11px;
  height: 2px;
  border-radius: 2px;
  background: #fff;
  content: "";
  transform: translate(-50%, -50%);
}

.medicine-not-found__icon::after {
  width: 2px;
  height: 11px;
}

.medicine-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: calc(100% - 9px);
  margin-top: 8px;
  margin-left: 9px;
}

.remark-field {
  display: flex;
  align-items: center;
  width: calc(100% - 9px);
  height: 32px;
  margin-left: 9px;
}

.remark-field__label {
  flex: 0 0 28px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
}

.remark-field__control {
  flex: 1;
  min-width: 0;
  width: auto;
  margin-left: 16px;
}

.medicine-row {
  display: grid;
  grid-template-columns: 65px minmax(120px, 1fr) 114px 102px 56px 28px;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 10px;
  border: 0;
  border-bottom: 4px solid #fff;
  border-radius: 0;
  background: #f5f9ff;
}

.medicine-type-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 24px;
  padding: 2px 12px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
}

.medicine-type-tag--western {
  border-color: #2ba471;
  color: #2ba471;
  background: #eef8f4;
}

.medicine-type-tag--tcm {
  border-color: #e37318;
  color: #e37318;
  background: #fdf4ed;
}

.medicine-type-tag--compound {
  border-color: #006ef9;
  color: #006ef9;
  background: #f5f9ff;
}

.medicine-row__info {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 40px;
  padding: 0 8px;
}

.medicine-row__info strong {
  color: #697383;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.medicine-row__spec {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 10px;
  border-radius: 6px;
  color: #697383;
  font-size: 14px;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.medicine-row__qty {
  display: flex;
  align-items: center;
  gap: 2px;
  width: 102px;
  padding: 2px;
  border: 1px solid #d0d5d9;
  border-radius: 4px;
  background: #fff;
}

.qty-btn {
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
  background: #fff;
  cursor: pointer;
}

.qty-btn:disabled {
  color: #c0c7cf;
  background: #f3f5f6;
}

.medicine-row__qty:hover,
.medicine-row__qty:focus-within {
  border-color: #006ef9;
}

.medicine-row__qty:hover .qty-btn,
.medicine-row__qty:focus-within .qty-btn {
  background: #f3f5f6;
}

.qty-btn:disabled,
.medicine-row__unit:disabled,
.medicine-row__remove:disabled {
  color: var(--jh-color-muted);
  cursor: not-allowed;
  opacity: 0.5;
}

.qty-value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  color: #3c4449;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}

.medicine-unit {
  position: relative;
  width: 56px;
}

.medicine-row__unit {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  width: 56px;
  padding: 0 8px 0 12px;
  border: 1px solid #d0d5d9;
  border-radius: 4px;
  color: #3c4449;
  font-size: 14px;
  line-height: 22px;
  background: #fff;
  cursor: pointer;
}

.medicine-row__unit:hover,
.medicine-row__unit:focus-visible {
  border-color: #006ef9;
  outline: none;
}

.medicine-row__unit-arrow {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-top: -3px;
  border-right: 1.5px solid #848f9a;
  border-bottom: 1.5px solid #848f9a;
  transform: rotate(45deg);
  transition: transform 0.16s ease;
}

.medicine-row__unit[aria-expanded="true"] .medicine-row__unit-arrow {
  margin-top: 3px;
  transform: rotate(225deg);
}

.medicine-unit-menu {
  position: absolute;
  z-index: 16;
  top: calc(100% + 6px);
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 66px;
  padding: 8px;
  border: 1px solid #d8dde1;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 16px 40px -16px rgba(16, 42, 67, 0.14), 0 4px 8px -2px rgba(16, 42, 67, 0.08);
}

.medicine-unit-menu__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  min-height: 24px;
  padding: 2px 8px;
  border: 0;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.6);
  font: inherit;
  font-size: 12px;
  line-height: 20px;
  background: transparent;
  cursor: pointer;
}

.medicine-unit-menu__item.is-active {
  color: #fff;
  background: #006ef9;
}

.medicine-row__remove {
  width: 28px;
  height: 32px;
  border: 0;
  color: var(--jh-color-danger);
  font-size: 22px;
  background: transparent;
  cursor: pointer;
}

.quick-consult-card__footer {
  position: absolute;
  right: 48px;
  bottom: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 16px;
  min-height: 40px;
  padding: 0;
}

.consent-field {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  max-width: 320px;
}

.consent-check--invalid .consent-check__box {
  border-color: #d54941;
  animation: field-error-flash 0.9s ease;
}

.consent-check {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 298px;
  color: #3c4449;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
}

.consent-check input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.consent-check__box {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  border: 1px solid #d0d5d9;
  border-radius: 4px;
  background: #fff;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.consent-check:hover .consent-check__box {
  border-color: #3b92ff;
}

.consent-check input:checked + .consent-check__box {
  border-color: transparent;
  background: linear-gradient(270deg, #3b92ff 0%, #006ef9 100%);
}

.consent-check input:checked + .consent-check__box::after {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9px;
  height: 5px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  border-radius: 1px;
  content: "";
  transform: translate(-50%, -62%) rotate(-45deg);
}

.consent-check__text {
  color: #3c4449;
  text-wrap: pretty;
  word-break: auto-phrase;
}

.consent-check a {
  color: var(--jh-color-primary);
  text-decoration: none;
}

.jh-input-field {
  width: 100%;
  min-width: 0;
  height: 32px;
  padding: 5px 10px;
  border-color: #e5e8eb;
  border-radius: 6px;
  font-size: 14px;
  line-height: 22px;
}

.jh-input-field:disabled {
  color: var(--jh-color-muted);
  background: #f8f9fb;
  cursor: not-allowed;
}

.quick-consult-card :deep(.jh-btn--sm) {
  min-width: 0;
}

.quick-consult-card__submit-anchor {
  display: inline-flex;
}

.quick-consult-card__footer :deep(.jh-btn) {
  width: 112px;
  height: 40px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
}

.quick-consult-page--ab-figma-c {
  min-height: 900px;
  background: #f4f5f6;
}

.quick-consult-page--ab-figma-c .quick-consult-page__topbar {
  height: 56px;
  padding: 0 24px;
  border-bottom: 0;
  box-shadow: 0 1px 0 rgba(16, 42, 67, 0.04);
}

.quick-consult-page--ab-figma-c .quick-consult-page__template {
  display: none;
}

.quick-consult-page--ab-figma-c .quick-consult-page__topbar :deep(.quick-consult-page__back) {
  width: auto;
  min-width: 88px;
  padding: 5px 12px;
  background: transparent;
}

.quick-consult-page--ab-figma-c .quick-consult-page__topbar-right {
  gap: 16px;
}

.quick-consult-page--ab-figma-c .quick-consult-page__store {
  padding-left: 4px;
  color: rgba(0, 0, 0, 0.65);
}

.quick-consult-page--ab-figma-c .quick-consult-page__main {
  padding: 24px;
}

.quick-consult-page--ab-figma-c .quick-consult-card {
  height: calc(100vh - 104px);
  min-height: 740px;
  max-height: 796px;
  border-radius: 16px;
  box-shadow: 0 4px 11.2px rgba(0, 0, 0, 0.15);
}

.quick-consult-page--ab-figma-c .quick-consult-card__header {
  padding: 0 48px;
  background: #fcfcfc;
}

.quick-consult-page--ab-figma-c .quick-consult-card__title-row {
  gap: 24px;
}

.quick-consult-page--ab-figma-c .quick-consult-card__body {
  grid-template-columns: 604px 1fr;
  height: calc(100% - 56px);
  padding-bottom: 88px;
}

.quick-consult-page--ab-figma-c .quick-consult-card__col {
  padding: 32px 48px 24px;
}

.quick-consult-page--ab-figma-c .quick-consult-card__col + .quick-consult-card__col {
  padding-left: 23px;
  padding-right: 48px;
}

.quick-consult-page--ab-figma-c .form-section + .form-section {
  margin-top: 32px;
}

.quick-consult-page--ab-figma-c .form-grid {
  gap: 12px 31px;
}

.quick-consult-page--ab-figma-c .form-grid--patient {
  grid-template-columns: 1.47fr 1fr;
  gap: 12px 20px;
}

.quick-consult-page--ab-figma-c .patient-info-fields,
.quick-consult-page--ab-figma-c .patient-proof-fields {
  gap: 12px;
}

.quick-consult-page--ab-figma-c .form-field__label,
.quick-consult-page--ab-figma-c .jh-input-field,
.quick-consult-page--ab-figma-c .patient-name-input,
.quick-consult-page--ab-figma-c :deep(.diagnosis-panel__input),
.quick-consult-page--ab-figma-c :deep(.medicine-panel__input) {
  font-size: 14px;
  line-height: 22px;
}

.quick-consult-page--ab-figma-c :deep(.diagnosis-panel__prompt--card) {
  margin-top: 12px;
}

.quick-consult-page--ab-figma-c :deep(.diagnosis-panel__prompt-medicine) {
  line-height: 20px;
}

.quick-consult-page--ab-figma-c .quick-consult-card__footer {
  right: 48px;
  bottom: 24px;
  gap: 16px;
}

.consent-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 3100;
  background: rgba(122, 136, 152, 0.3);
}

.consent-confirm-dialog {
  position: fixed;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background: var(--jh-color-bg-surface);
  box-shadow: 0 20px 48px rgba(19, 29, 43, 0.2);
  overflow: hidden;
}

.consent-confirm-dialog--centered {
  min-height: 206px;
}

.consent-confirm-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 14px;
}

.consent-confirm-dialog__header h2 {
  margin: 0;
  color: var(--jh-color-text);
  font-size: 21px;
  font-weight: 400;
  line-height: 30px;
  text-wrap: pretty;
  word-break: auto-phrase;
}

.consent-confirm-dialog__close {
  width: 32px;
  height: 32px;
  border: 0;
  color: var(--jh-color-muted);
  font-size: 32px;
  line-height: 1;
  background: transparent;
  cursor: pointer;
}

.consent-confirm-dialog__body {
  padding: 18px 28px 28px;
  color: var(--jh-color-text);
  font-size: 18px;
  line-height: 28px;
  text-wrap: pretty;
  word-break: auto-phrase;
}

.consent-confirm-dialog__body a {
  color: var(--jh-color-primary);
  text-decoration: none;
}

.consent-confirm-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  padding: 0 28px 28px;
}

.consent-confirm-dialog__footer--center {
  justify-content: center;
  gap: 17px;
  padding-bottom: 24px;
}

.consent-confirm-dialog__footer :deep(.jh-btn) {
  width: 88px;
  height: 40px;
  font-size: 16px;
}

.consent-confirm-dialog__footer--center :deep(.jh-btn--outline-secondary) {
  border-color: rgba(0, 0, 0, 0.15);
  color: rgba(0, 0, 0, 0.6);
}

.id-card-scan-overlay {
  position: fixed;
  inset: 0;
  z-index: 3050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.48);
}

.id-card-scan-dialog {
  width: min(480px, calc(100vw - 40px));
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 20px 48px rgba(19, 29, 43, 0.2);
}

.id-card-scan-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 12px;
}

.id-card-scan-dialog__header h2 {
  margin: 0;
  color: rgba(0, 0, 0, 0.9);
  font-size: 18px;
  font-weight: 400;
  line-height: 26px;
}

.id-card-scan-dialog__close {
  width: 32px;
  height: 32px;
  border: 0;
  color: rgba(0, 0, 0, 0.4);
  font-size: 28px;
  line-height: 1;
  background: transparent;
  cursor: pointer;
}

.id-card-scan-dialog__body {
  padding: 8px 24px 20px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
}

.id-card-scan-dialog__status {
  margin-top: 12px;
  color: #006ef9;
}

.id-card-scan-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 24px 24px;
}

</style>
