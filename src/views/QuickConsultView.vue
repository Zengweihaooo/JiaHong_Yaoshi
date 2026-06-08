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
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>用药人姓名</span>
                    <input v-model="form.patientName" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入姓名" />
                  </label>
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>性别</span>
                    <div class="form-field__inline">
                      <label class="form-radio"><input v-model="form.gender" type="radio" value="male" /> 男</label>
                      <label class="form-radio"><input v-model="form.gender" type="radio" value="female" /> 女</label>
                    </div>
                  </label>
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>年龄</span>
                    <input v-model="form.age" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入年龄" />
                  </label>
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>体重</span>
                    <div class="form-field__suffix">
                      <input v-model="form.weight" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入体重" />
                      <span>kg</span>
                    </div>
                  </label>
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>手机号码</span>
                    <input v-model="form.phone" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入手机号码" />
                  </label>
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>用药人身份证</span>
                    <input v-model="form.idCard" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入身份证号码" />
                  </label>
                  <label class="form-field">
                    <span class="form-field__label">监护人姓名</span>
                    <input v-model="form.guardianName" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入姓名" />
                  </label>
                  <label class="form-field">
                    <span class="form-field__label">监护人身份证</span>
                    <input v-model="form.guardianIdCard" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入身份证号码" />
                  </label>
                </div>
                <div class="patient-proof-fields">
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>就诊方式</span>
                    <input class="jh-input-field jh-input-field--sm" type="text" value="复诊" readonly />
                  </label>
                  <div class="form-field form-field--upload">
                    <span class="form-field__label"><em>*</em>复诊凭证</span>
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
                      :class="['jh-btn jh-btn--sm', form.pregnancy === option.value ? 'jh-btn--primary' : 'jh-btn--outline-secondary']"
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
            <section class="form-section">
              <h2 class="form-section__title"><em>*</em>线下已确诊疾病</h2>
              <input
                v-model="form.diagnosisKeyword"
                class="jh-input-field jh-input-field--sm"
                type="text"
                placeholder="请输入线下已确诊的疾病名称"
              />
              <div class="diagnosis-tags">
                <button
                  v-for="tag in commonDiagnoses"
                  :key="tag"
                  :class="['diagnosis-tag', { 'diagnosis-tag--active': form.diagnoses.includes(tag) }]"
                  type="button"
                  @click="toggleDiagnosis(tag)"
                >
                  {{ tag }}
                </button>
              </div>
            </section>

            <section class="form-section">
              <div class="form-section__title-row">
                <h2 class="form-section__title"><em>*</em>所需药品</h2>
                <div class="form-section__title-actions">
                  <span class="form-section__note">乙类OTC不需开具处方，请勿录入</span>
                  <Button variant="outline-secondary" size="sm">新品登记</Button>
                </div>
              </div>
              <input
                v-model="form.medicineKeyword"
                class="jh-input-field jh-input-field--sm"
                type="text"
                :placeholder="medicinePlaceholder"
              />
              <div class="medicine-list">
                <article v-for="item in form.medicines" :key="item.id" class="medicine-row">
                  <span :class="['jh-tag jh-tag--lg', item.type === 'western' ? 'medicine-type-tag--western' : 'medicine-type-tag--tcm']">
                    {{ item.type === 'western' ? '西药' : '中成药' }}
                  </span>
                  <div class="medicine-row__info">
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.spec }}</span>
                  </div>
                  <div class="medicine-row__qty">
                    <button class="qty-btn" type="button" @click="changeQty(item, -1)">−</button>
                    <input v-model.number="item.qty" class="qty-input" type="number" min="1" />
                    <button class="qty-btn" type="button" @click="changeQty(item, 1)">+</button>
                  </div>
                  <select v-model="item.unit" class="medicine-row__unit">
                    <option value="盒">盒</option>
                    <option value="瓶">瓶</option>
                    <option value="袋">袋</option>
                  </select>
                  <button class="medicine-row__remove" type="button" aria-label="删除药品" @click="removeMedicine(item.id)">×</button>
                </article>
              </div>
            </section>

            <section class="form-section">
              <h2 class="form-section__title">备注</h2>
              <input
                v-model="form.remark"
                class="jh-input-field jh-input-field--sm"
                type="text"
                maxlength="30"
                placeholder="请输入备注信息，最多30字"
              />
            </section>
          </div>
        </div>

        <footer class="quick-consult-card__footer">
          <label class="consent-check">
            <input v-model="form.agreed" type="checkbox" />
            <span>我已阅读并同意 <a href="#" @click.prevent>《互联网问诊知情同意书》</a></span>
          </label>
          <Button variant="primary" size="md" :disabled="!form.agreed" @click="handleSubmit">提交</Button>
        </footer>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button, assetUrl } from "@jiahong/ui";
import { ElMessage } from "element-plus";
import ToggleField from "@/components/quick-consult/ToggleField.vue";
import { useConsultStore } from "@/stores/consult";

const router = useRouter();
const route = useRoute();
const consultStore = useConsultStore();

const consultType = computed(() => route.query.type || consultStore.consultType || "western");
const medicinePlaceholder = computed(() =>
  consultType.value === "tcm"
    ? "[中药] 请输入药品名称和规格...最多可录入5个药品"
    : "[西药] 请输入药品名称和规格...最多可录入5个药品"
);

const pregnancyOptions = [
  { label: "无", value: "none" },
  { label: "备孕中", value: "planning" },
  { label: "怀孕中", value: "pregnant" },
  { label: "哺乳期", value: "lactating" }
];

const commonDiagnoses = ["急性支气管炎", "流行性感冒", "冠状动脉粥样硬化性心脏病", "急性咽喉炎"];

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

function toggleDiagnosis(tag) {
  const index = form.diagnoses.indexOf(tag);
  if (index >= 0) {
    form.diagnoses.splice(index, 1);
  } else {
    form.diagnoses.push(tag);
  }
}

function changeQty(item, delta) {
  item.qty = Math.max(1, (item.qty || 1) + delta);
}

function removeMedicine(id) {
  form.medicines = form.medicines.filter((item) => item.id !== id);
}

function handleSubmit() {
  ElMessage.success("问诊信息已提交（演示）");
}
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
  gap: 8px;
}

.diagnosis-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.diagnosis-tag {
  min-height: 34px;
  padding: 5px 14px;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  color: var(--jh-color-primary);
  font-size: 16px;
  background: color-mix(in srgb, var(--jh-color-primary) 12%, var(--jh-color-bg-surface));
  cursor: pointer;
}

.diagnosis-tag--active {
  border-color: var(--jh-color-primary);
  background: var(--jh-color-primary);
  color: #fff;
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

.quick-consult-card :deep(.jh-btn--sm) {
  min-width: 0;
}

.quick-consult-card__footer :deep(.jh-btn) {
  width: 122px;
  height: 44px;
  font-size: 18px;
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
