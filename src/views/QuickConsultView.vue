<template>
  <div class="quick-consult-page">
    <header class="quick-consult-page__topbar">
      <Button variant="neutral" size="md" icon @click="router.push('/')">
        <img :src="assetUrl('assets/figma-consult/back.svg')" alt="" />
        <span>返回首页</span>
      </Button>
      <div class="quick-consult-page__topbar-right">
        <Button variant="primary" size="md">在线客服</Button>
        <span class="quick-consult-page__store">好药师大药房（九州通大厦店）</span>
      </div>
    </header>

    <main class="quick-consult-page__main">
      <section class="quick-consult-card" aria-label="快速问诊表单">
        <header class="quick-consult-card__header">
          <div class="quick-consult-card__title-row">
            <h1>武汉市好药师大药房南岸店</h1>
            <span class="quick-consult-card__type">快速问诊</span>
          </div>
          <Button variant="outline-secondary" size="sm" @click="router.push('/')">取消问诊</Button>
        </header>

        <div class="quick-consult-card__body">
          <!-- 左栏：用药人信息 + 病史信息 -->
          <div class="quick-consult-card__col">
            <section class="form-section">
              <h2 class="form-section__title">用药人信息</h2>
              <div class="form-grid form-grid--patient">
                <div class="patient-info-fields">
                  <div class="form-field">
                    <span class="form-field__label"><em>*</em>用药人姓名</span>
                    <div
                      :class="['patient-name-control', { 'is-active': patientNameFocused }]"
                      @focusin="patientNameFocused = true"
                      @focusout="handlePatientNameFocusout"
                    >
                      <div class="patient-name-inputbox">
                        <input
                          ref="patientNameInput"
                          v-model="form.patientName"
                          class="patient-name-input"
                          type="text"
                          placeholder="请输入姓名"
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
                        v-if="patientNameFocused"
                        class="patient-name-dot"
                        type="button"
                        aria-label="插入姓名间隔点"
                        @mousedown.prevent
                        @click="insertPatientNameDot"
                      >
                        ·
                      </button>
                    </div>
                  </div>
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>性别</span>
                    <div class="form-field__inline">
                      <label class="form-radio"><input v-model="form.gender" type="radio" value="male" /> 男</label>
                      <label class="form-radio"><input v-model="form.gender" type="radio" value="female" /> 女</label>
                    </div>
                  </label>
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>年龄</span>
                    <input v-model="form.age" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入年龄（0-120）" />
                  </label>
                  <label class="form-field">
                    <span class="form-field__label">体重</span>
                    <div class="form-field__suffix">
                      <input v-model="form.weight" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入体重" />
                      <span>kg</span>
                    </div>
                  </label>
                  <label class="form-field">
                    <span class="form-field__label">手机号码</span>
                    <input v-model="form.phone" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入手机号码" />
                  </label>
                  <label class="form-field">
                    <span class="form-field__label">用药人身份证</span>
                    <input v-model="form.idCard" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入身份证号码" />
                  </label>
                  <label v-if="isChildUnderSix" class="form-field">
                    <span class="form-field__label"><em>*</em>监护人姓名</span>
                    <input v-model="form.guardianName" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入姓名" />
                  </label>
                  <label v-if="isChildUnderSix" class="form-field">
                    <span class="form-field__label"><em>*</em>监护人身份证</span>
                    <input v-model="form.guardianIdCard" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入身份证号码" />
                  </label>
                </div>
                <div class="patient-proof-fields">
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>就诊方式</span>
                    <input class="jh-input-field jh-input-field--sm visit-method-field" type="text" value="复诊" disabled />
                  </label>
                  <div class="form-field form-field--upload">
                    <span class="form-field__label"><em v-if="hasMedicines">*</em>复诊凭证</span>
                    <div class="upload-panel">
                      <p class="upload-panel__hint">
                        支持上传线下就诊的历史处方、病历或相关证明，最多 5 张，单张不超过 5MB
                        <a href="#" @click.prevent>示例图片</a>
                      </p>
                      <button class="upload-panel__box" type="button" aria-label="上传复诊凭证">
                        <span>+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section class="form-section">
              <h2 class="form-section__title">病史信息</h2>
              <div class="form-grid form-grid--history">
                <div class="form-field form-field--toggle">
                  <span class="form-field__label"><em>*</em>过敏史</span>
                  <ToggleField v-model="form.allergy" v-model:detail="form.allergyDetail" />
                </div>
                <div class="form-field form-field--toggle">
                  <span class="form-field__label"><em>*</em>肝功能异常</span>
                  <ToggleField v-model="form.liverAbnormal" v-model:detail="form.liverDetail" />
                </div>
                <div class="form-field form-field--toggle">
                  <span class="form-field__label"><em>*</em>肾功能异常</span>
                  <ToggleField v-model="form.kidneyAbnormal" v-model:detail="form.kidneyDetail" />
                </div>
                <div class="form-field form-field--pregnancy">
                  <span class="form-field__label"><em>*</em>妊娠哺乳</span>
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
            <section class="form-section diagnosis-section">
              <h2 class="form-section__title"><em>*</em>线下已确诊疾病</h2>
              <div class="right-field-control diagnosis-picker">
                <input
                  v-model="form.diagnosisKeyword"
                  class="jh-input-field jh-input-field--sm"
                  type="text"
                  placeholder="请输入线下已确诊的疾病名称"
                  @focus="showDiagnosisDropdown = true"
                  @click="showDiagnosisDropdown = true"
                />
                <div v-if="form.diagnoses.length" class="selected-diagnosis-tags">
                  <DiseaseOption
                    v-for="tag in form.diagnoses"
                    :key="tag"
                    :label="tag"
                    class="selected-diagnosis-option"
                  />
                </div>
                <div v-if="showDiagnosisDropdown" class="diagnosis-dropdown">
                  <h3>常见疾病</h3>
                  <div class="diagnosis-tags">
                    <DiseaseOption
                      v-for="tag in commonDiagnoses"
                      :key="tag"
                      :label="tag"
                      :selected="form.diagnoses.includes(tag)"
                      @mousedown.prevent
                      @click="addDiagnosis(tag)"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section :class="['form-section', 'medicine-section', { 'is-disabled': !canEditMedicine }]">
              <div class="form-section__title-row">
                <h2 class="form-section__title"><em>*</em>所需药品</h2>
                <div class="form-section__title-actions">
                  <span class="form-section__note">乙类OTC不需开具处方，请勿录入</span>
                  <Button variant="outline-secondary" size="sm" :disabled="!canEditMedicine">新品登记</Button>
                </div>
              </div>
              <div class="right-field-control">
                <input
                  v-model="form.medicineKeyword"
                  class="jh-input-field jh-input-field--sm"
                  type="text"
                  :disabled="!canEditMedicine"
                  :placeholder="medicinePlaceholder"
                />
              </div>
              <div v-if="canEditMedicine" class="medicine-list">
                <article v-for="item in form.medicines" :key="item.id" class="medicine-row">
                  <span :class="['jh-tag jh-tag--lg', item.type === 'western' ? 'medicine-type-tag--western' : 'medicine-type-tag--tcm']">
                    {{ item.type === 'western' ? '西药' : '中成药' }}
                  </span>
                  <div class="medicine-row__info">
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.spec }}</span>
                  </div>
                  <div class="medicine-row__qty">
                    <button class="qty-btn" type="button" :disabled="!canEditMedicine" @click="changeQty(item, -1)">−</button>
                    <input v-model.number="item.qty" class="qty-input" type="number" min="1" :disabled="!canEditMedicine" />
                    <button class="qty-btn" type="button" :disabled="!canEditMedicine" @click="changeQty(item, 1)">+</button>
                  </div>
                  <select v-model="item.unit" class="medicine-row__unit" :disabled="!canEditMedicine">
                    <option value="盒">盒</option>
                    <option value="瓶">瓶</option>
                    <option value="袋">袋</option>
                  </select>
                  <button class="medicine-row__remove" type="button" aria-label="删除药品" :disabled="!canEditMedicine" @click="removeMedicine(item.id)">×</button>
                </article>
              </div>
            </section>

            <section class="form-section remark-section">
              <h2 class="form-section__title">备注</h2>
              <div class="right-field-control">
                <input
                  v-model="form.remark"
                  class="jh-input-field jh-input-field--sm"
                  type="text"
                  maxlength="30"
                  placeholder="请输入备注信息，最多30字"
                />
              </div>
            </section>
          </div>
        </div>

        <footer class="quick-consult-card__footer">
          <label class="consent-check">
            <input v-model="form.agreed" type="checkbox" />
            <span>我已阅读并同意 <a href="#" @click.prevent>《互联网问诊知情同意书》</a></span>
          </label>
          <Button variant="primary" size="md" @click="handleSubmit">提交</Button>
        </footer>
      </section>
    </main>

    <Teleport to="body">
      <div v-if="showConsentDialog" class="consent-confirm-overlay" @click.self="closeConsentDialog">
        <section class="consent-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="consent-confirm-title">
          <header class="consent-confirm-dialog__header">
            <h2 id="consent-confirm-title">互联网问诊知情同意书</h2>
            <button class="consent-confirm-dialog__close" type="button" aria-label="关闭" @click="closeConsentDialog">×</button>
          </header>
          <div class="consent-confirm-dialog__body">
            请确认您是否已经阅读并同意 <a href="#" @click.prevent>《互联网问诊知情同意书》</a>
          </div>
          <footer class="consent-confirm-dialog__footer">
            <Button variant="outline-secondary" size="md" @click="closeConsentDialog">取消</Button>
            <Button variant="primary" size="md" @click="agreeAndSubmit">同意</Button>
          </footer>
        </section>
      </div>

      <div v-if="showConfirmDialog" class="submit-confirm-overlay" @click.self="closeConfirmDialog">
        <section class="submit-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="submit-confirm-title">
          <header class="submit-confirm-dialog__header">
            <h2 id="submit-confirm-title">疾病信息确认</h2>
            <button class="submit-confirm-dialog__close" type="button" aria-label="关闭" @click="closeConfirmDialog">×</button>
          </header>

          <div class="submit-confirm-dialog__warning">
            您选择的药品与线下已确诊疾病不匹配，请重新确认用药人病情。
          </div>

          <div class="submit-confirm-dialog__body">
            <p class="submit-confirm-dialog__tip">
              <span class="submit-confirm-dialog__tip-icon" aria-hidden="true">!</span>
              请仔细核对疾病信息及所需药品，确认无误后继续提交
            </p>

            <div class="submit-confirm-row">
              <span class="submit-confirm-row__label">确诊疾病</span>
              <div class="submit-confirm-tags">
                <span v-for="item in confirmedDiagnoses" :key="item" class="submit-confirm-tag">{{ item }}</span>
              </div>
            </div>

            <div class="submit-confirm-row">
              <span class="submit-confirm-row__label">所需药品</span>
              <div class="submit-confirm-tags">
                <span v-for="item in confirmedMedicines" :key="item" class="submit-confirm-tag">{{ item }}</span>
              </div>
            </div>
          </div>

          <footer class="submit-confirm-dialog__footer">
            <Button variant="primary" size="sm" @click="closeConfirmDialog">确定</Button>
          </footer>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button, DiseaseOption, assetUrl } from "@jiahong/ui";
import ToggleField from "@/components/quick-consult/ToggleField.vue";
import { useConsultStore } from "@/stores/consult";

const router = useRouter();
const route = useRoute();
const consultStore = useConsultStore();
const showConfirmDialog = ref(false);
const showConsentDialog = ref(false);
const showDiagnosisDropdown = ref(false);
const patientNameFocused = ref(false);
const patientNameInput = ref(null);

const consultType = computed(() => route.query.type || consultStore.consultType || "western");
const medicinePlaceholder = computed(() =>
  !canEditMedicine.value
    ? "请将基本信息填写完整后再进行录药"
    : consultType.value === "tcm"
      ? "[中药] 请输入药品名称和规格...最多可录入5个药品"
      : "[西药] 请输入药品名称和规格...最多可录入5个药品"
);

const pregnancyOptions = [
  { label: "无", value: "none" },
  { label: "备孕中", value: "planning" },
  { label: "怀孕中", value: "pregnant" },
  { label: "哺乳期", value: "lactating" }
];

const commonDiagnoses = [
  "高血压",
  "急性支气管炎",
  "冠状动脉粥样硬化性心脏病（冠心病）",
  "2型糖尿病",
  "化脓性牙龈炎",
  "类风湿性关节炎",
  "急性扁桃体炎",
  "急性肠炎",
  "细菌性结膜炎",
  "骨关节病",
  "幽门螺旋杆菌感染",
  "高脂血症",
  "急性咽喉炎",
  "泌尿道感染",
  "男性勃起障碍",
  "急性鼻咽炎【感冒】",
  "过敏性鼻炎[变应性鼻炎]",
  "偏头痛",
  "支气管哮喘",
  "手皮肤感染"
];

const form = reactive({
  patientName: "",
  gender: "male",
  age: "",
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
  medicines: [
    { id: 1, type: "western", name: "阿奇霉素分散片", spec: "0.125g*6片", qty: 1, unit: "盒" },
    { id: 2, type: "tcm", name: "阿奇霉素分散片", spec: "0.125g*6片", qty: 1, unit: "盒" }
  ],
  remark: "",
  agreed: false
});

const parsedAge = computed(() => {
  const age = Number.parseFloat(String(form.age).trim());
  return Number.isFinite(age) ? age : null;
});

const isChildUnderSix = computed(() => parsedAge.value !== null && parsedAge.value < 6);

const patientBaseComplete = computed(() => {
  return Boolean(form.patientName.trim() && form.gender && parsedAge.value !== null);
});

const guardianComplete = computed(() => {
  if (!isChildUnderSix.value) return true;
  return Boolean(form.guardianName.trim() && form.guardianIdCard.trim());
});

const canEditMedicine = computed(() => patientBaseComplete.value && guardianComplete.value);
const hasMedicines = computed(() => canEditMedicine.value && form.medicines.length > 0);
const confirmedDiagnoses = computed(() => (form.diagnoses.length ? form.diagnoses : ["认知障碍", "卒中后抑郁", "抑郁发作"]));
const confirmedMedicines = computed(() => form.medicines.map((item) => item.name));

function addDiagnosis(tag) {
  if (!form.diagnoses.includes(tag)) {
    form.diagnoses.push(tag);
  }
  form.diagnosisKeyword = "";
}

function closeDiagnosisDropdown(event) {
  if (!event.target.closest(".diagnosis-section")) {
    showDiagnosisDropdown.value = false;
  }
}

function changeQty(item, delta) {
  item.qty = Math.max(1, (item.qty || 1) + delta);
}

function removeMedicine(id) {
  form.medicines = form.medicines.filter((item) => item.id !== id);
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

function handleSubmit() {
  if (!form.agreed) {
    showConsentDialog.value = true;
    return;
  }
  showConfirmDialog.value = true;
}

function agreeAndSubmit() {
  form.agreed = true;
  showConsentDialog.value = false;
  showConfirmDialog.value = true;
}

function closeConsentDialog() {
  showConsentDialog.value = false;
}

function closeConfirmDialog() {
  showConfirmDialog.value = false;
}

onMounted(() => {
  document.addEventListener("mousedown", closeDiagnosisDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", closeDiagnosisDropdown);
});
</script>

<style scoped>
.quick-consult-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.quick-consult-page__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 24px;
  background: var(--jh-color-bg-surface);
  border-bottom: 1px solid var(--jh-color-border);
}

.quick-consult-page__topbar :deep(.jh-btn) {
  height: 26px;
  padding: 3px 12px;
  border-radius: var(--jh-radius-sm);
  font-size: 12px;
}

.quick-consult-page__topbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.quick-consult-page__store {
  color: var(--jh-color-text);
  font-size: 12px;
}

.quick-consult-page__main {
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  margin: 0 auto;
  padding: 28px clamp(24px, 3vw, 56px);
}

.quick-consult-card {
  width: 100%;
  min-height: 720px;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-lg);
  background: var(--jh-color-bg-surface);
  box-shadow: var(--jh-shadow-soft);
  overflow: hidden;
}

.quick-consult-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  padding: 0 44px;
  border-bottom: 1px solid var(--jh-color-border);
}

.quick-consult-card__title-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quick-consult-card__title-row h1 {
  margin: 0;
  color: var(--jh-color-text);
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

.quick-consult-card__type {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: var(--jh-radius-sm);
  color: var(--jh-color-primary);
  font-size: 14px;
  background: color-mix(in srgb, var(--jh-color-primary) 12%, var(--jh-color-bg-surface));
}

.quick-consult-card__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0;
  min-height: 580px;
}

.quick-consult-card__col {
  padding: 38px 44px 20px;
}

.quick-consult-card__col + .quick-consult-card__col {
  border-left: 1px solid var(--jh-color-border);
}

.form-section + .form-section {
  margin-top: 28px;
}

.form-section__title {
  position: relative;
  margin: 0 0 18px;
  padding-left: 10px;
  color: var(--jh-color-text);
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
}

.form-section__title::before {
  position: absolute;
  top: 6px;
  left: 0;
  width: 3px;
  height: 16px;
  border-radius: 2px;
  background: var(--jh-color-primary);
  content: "";
}

.form-section__title em {
  margin-right: 4px;
  color: var(--jh-color-danger);
  font-style: normal;
}

.form-section__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.form-section__title-row .form-section__title {
  margin-bottom: 0;
}

.form-section__title-actions {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
}

.form-section__note {
  color: var(--jh-color-muted);
  font-size: 14px;
  line-height: 32px;
}

.form-grid {
  display: grid;
  gap: 14px 18px;
}

.form-grid--patient {
  grid-template-columns: minmax(0, 1.05fr) minmax(260px, 0.95fr);
  align-items: start;
}

.patient-info-fields,
.patient-proof-fields {
  display: grid;
  gap: 14px;
}

.form-grid--history {
  grid-template-columns: 1fr;
}

.form-field {
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-height: 40px;
}

.form-field--upload {
  align-items: start;
}

.form-field--upload .form-field__label {
  padding-top: 0;
  line-height: 32px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-field__label {
  color: var(--jh-color-text);
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  white-space: nowrap;
}

.form-field__label em {
  margin-right: 2px;
  color: var(--jh-color-danger);
  font-style: normal;
}

.form-field__inline {
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: 40px;
}

.form-radio {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--jh-color-text);
  font-size: 16px;
  cursor: pointer;
}

.form-radio input,
.consent-check input {
  accent-color: var(--jh-color-primary);
}

.patient-name-control {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.patient-name-inputbox {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  background: var(--jh-color-bg-surface);
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
  padding: 0 38px 0 12px;
  border: 0;
  border-radius: inherit;
  color: var(--jh-color-text);
  font: inherit;
  font-size: 16px;
  line-height: 40px;
  background: transparent;
  outline: none;
}

.patient-name-input::placeholder {
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
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  color: var(--jh-color-primary);
  font-size: 18px;
  line-height: 1;
  background: var(--jh-color-bg-surface);
  cursor: pointer;
}

.patient-name-dot:hover {
  border-color: var(--jh-color-primary);
}

.form-field__suffix {
  display: flex;
  align-items: center;
  gap: 0;
}

.form-field__suffix span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-left: -1px;
  border: 1px solid var(--jh-color-border);
  border-radius: 0 var(--jh-radius-sm) var(--jh-radius-sm) 0;
  color: var(--jh-color-muted);
  font-size: 14px;
  background: var(--jh-color-bg-page);
}

.form-field__suffix .jh-input-field {
  border-radius: var(--jh-radius-sm) 0 0 var(--jh-radius-sm);
}

.visit-method-field {
  cursor: not-allowed;
}

.upload-panel__hint {
  margin: 0 0 8px;
  color: var(--jh-color-muted);
  font-size: 16px;
  line-height: 26px;
}

.upload-panel__hint a {
  margin-left: 8px;
  color: var(--jh-color-primary);
}

.upload-panel__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  border: 1px dashed var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  color: var(--jh-color-muted);
  font-size: 28px;
  background: var(--jh-color-bg-page);
  cursor: pointer;
}

.pregnancy-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pregnancy-options .jh-btn {
  height: 34px;
  padding: 5px 16px;
  font-size: 16px;
}

.quick-consult-card .diagnosis-section,
.quick-consult-card .medicine-section {
  display: block;
  gap: normal;
  padding: 0;
}

.right-field-control {
  box-sizing: border-box;
  width: 100%;
}

.right-field-control .jh-input-field {
  box-sizing: border-box;
  width: 100%;
}

.diagnosis-picker {
  position: relative;
}

.selected-diagnosis-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.selected-diagnosis-option {
  cursor: default;
}

.selected-diagnosis-option:hover {
  border-color: #d8dde1;
  color: var(--jh-color-text);
  background: var(--jh-color-bg-surface);
}

.diagnosis-dropdown {
  position: absolute;
  z-index: 20;
  box-sizing: border-box;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  width: 100%;
  max-height: 270px;
  padding: 10px 14px 14px;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  background: var(--jh-color-bg-surface);
  box-shadow: var(--jh-shadow-soft);
  overflow-y: auto;
}

.diagnosis-dropdown::-webkit-scrollbar {
  width: 8px;
}

.diagnosis-dropdown::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: #d8dde1;
}

.diagnosis-dropdown h3 {
  margin: 0 0 18px;
  padding-left: 0;
  color: var(--jh-color-muted);
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.diagnosis-dropdown h3::before {
  display: none;
  content: none;
}

.diagnosis-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 10px;
}

.medicine-section.is-disabled .form-section__note {
  color: var(--jh-color-muted);
}

.medicine-section.is-disabled .jh-input-field {
  border-color: var(--jh-color-border);
  color: var(--jh-color-muted);
  background: #f8f9fb;
  cursor: not-allowed;
}

.medicine-section.is-disabled :deep(.jh-btn) {
  cursor: not-allowed;
}

.medicine-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.medicine-row {
  display: grid;
  grid-template-columns: 68px minmax(0, 1fr) 118px 72px 28px;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 10px;
  border: 0;
  border-radius: var(--jh-radius-sm);
  background: var(--jh-color-bg-page);
}

.medicine-type-tag--western {
  border: 1px solid color-mix(in srgb, var(--jh-color-success) 45%, var(--jh-color-bg-surface));
  background: color-mix(in srgb, var(--jh-color-success) 12%, var(--jh-color-bg-surface));
  color: var(--jh-color-success);
}

.medicine-type-tag--tcm {
  border: 1px solid color-mix(in srgb, var(--jh-color-warning) 45%, var(--jh-color-bg-surface));
  background: color-mix(in srgb, var(--jh-color-warning) 12%, var(--jh-color-bg-surface));
  color: var(--jh-color-warning);
}

.medicine-row__info {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.medicine-row__info strong {
  color: var(--jh-color-text);
  font-size: 16px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.medicine-row__info span {
  color: var(--jh-color-muted);
  font-size: 16px;
}

.medicine-row__qty {
  display: flex;
  align-items: center;
  gap: 0;
}

.qty-btn {
  width: 36px;
  height: 32px;
  font-size: 18px;
  border: 1px solid var(--jh-color-border);
  color: var(--jh-color-text);
  background: var(--jh-color-bg-surface);
  cursor: pointer;
}

.qty-btn:disabled,
.medicine-row__unit:disabled,
.medicine-row__remove:disabled {
  color: var(--jh-color-muted);
  cursor: not-allowed;
  opacity: 0.5;
}

.qty-input {
  width: 44px;
  height: 32px;
  margin: 0 -1px;
  border: 1px solid var(--jh-color-border);
  border-radius: 0;
  text-align: center;
  appearance: textfield;
  -moz-appearance: textfield;
}

.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  margin: 0;
  appearance: none;
  -webkit-appearance: none;
}

.medicine-row__unit {
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  font-size: 16px;
  background: var(--jh-color-bg-surface);
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  min-height: 84px;
  padding: 0 44px 28px;
}

.consent-check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--jh-color-text);
  font-size: 16px;
  cursor: pointer;
}

.consent-check span {
  color: var(--jh-color-muted);
}

.consent-check a {
  color: var(--jh-color-primary);
  text-decoration: none;
}

.jh-input-field {
  width: 100%;
  min-width: 0;
  height: 40px;
  padding: 8px 14px;
  font-size: 16px;
}

.jh-input-field:disabled {
  color: var(--jh-color-muted);
  background: #f8f9fb;
  cursor: not-allowed;
}

.quick-consult-card :deep(.jh-btn--sm) {
  min-width: 0;
}

.quick-consult-card__footer :deep(.jh-btn) {
  width: 122px;
  height: 44px;
  font-size: 18px;
}

.consent-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 3100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.48);
}

.consent-confirm-dialog {
  width: min(720px, calc(100vw - 48px));
  border-radius: var(--jh-radius-md);
  background: var(--jh-color-bg-surface);
  box-shadow: 0 20px 48px rgba(19, 29, 43, 0.2);
}

.consent-confirm-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 34px 36px 20px;
}

.consent-confirm-dialog__header h2 {
  margin: 0;
  color: var(--jh-color-text);
  font-size: 26px;
  font-weight: 400;
  line-height: 36px;
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
  padding: 28px 36px 40px;
  color: var(--jh-color-text);
  font-size: 22px;
  line-height: 34px;
}

.consent-confirm-dialog__body a {
  color: var(--jh-color-primary);
  text-decoration: none;
}

.consent-confirm-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  padding: 0 36px 36px;
}

.consent-confirm-dialog__footer :deep(.jh-btn) {
  width: 96px;
  height: 46px;
  font-size: 20px;
}

.submit-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(19, 29, 43, 0.42);
}

.submit-confirm-dialog {
  width: min(520px, calc(100vw - 48px));
  border-radius: var(--jh-radius-md);
  background: var(--jh-color-bg-surface);
  box-shadow: 0 20px 48px rgba(19, 29, 43, 0.22);
  overflow: hidden;
}

.submit-confirm-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 18px;
  border-bottom: 1px solid var(--jh-color-border);
}

.submit-confirm-dialog__header h2 {
  margin: 0;
  color: var(--jh-color-text);
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.submit-confirm-dialog__close {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: var(--jh-radius-sm);
  color: var(--jh-color-muted);
  font-size: 20px;
  line-height: 1;
  background: transparent;
  cursor: pointer;
}

.submit-confirm-dialog__close:hover {
  background: var(--jh-color-bg-page);
}

.submit-confirm-dialog__warning {
  padding: 10px 18px;
  color: #f07d22;
  font-size: 13px;
  line-height: 20px;
  background: #fff4e5;
}

.submit-confirm-dialog__body {
  display: grid;
  gap: 16px;
  padding: 16px 18px 4px;
  background: #f7fbff;
}

.submit-confirm-dialog__tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--jh-color-muted);
  font-size: 13px;
  line-height: 20px;
}

.submit-confirm-dialog__tip-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  background: #f07d22;
}

.submit-confirm-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
}

.submit-confirm-row__label {
  color: var(--jh-color-text);
  font-size: 13px;
  line-height: 28px;
  text-align: right;
}

.submit-confirm-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.submit-confirm-tag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  color: var(--jh-color-muted);
  font-size: 13px;
  background: #fff;
}

.submit-confirm-dialog__footer {
  display: flex;
  justify-content: flex-end;
  padding: 14px 18px 18px;
  background: #f7fbff;
}

.submit-confirm-dialog__footer :deep(.jh-btn) {
  width: 68px;
  height: 34px;
  font-size: 14px;
}

@media (max-width: 960px) {
  .quick-consult-card__body {
    grid-template-columns: 1fr;
  }

  .quick-consult-card__col + .quick-consult-card__col {
    border-top: 1px solid var(--jh-color-border);
    border-left: 0;
  }

  .form-grid--patient {
    grid-template-columns: 1fr;
  }

  .patient-info-fields,
  .patient-proof-fields {
    gap: 12px;
  }

  .form-field {
    grid-template-columns: 128px minmax(0, 1fr);
  }

  .medicine-row {
    grid-template-columns: 1fr;
  }

  .quick-consult-card__footer {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
}
</style>
