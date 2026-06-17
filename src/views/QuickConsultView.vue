<template>
  <div class="quick-consult-page">
    <header class="quick-consult-page__topbar">
      <Button class="quick-consult-page__back" variant="neutral" size="md" icon @click="router.push('/')">
        <el-icon class="quick-consult-page__back-icon" aria-hidden="true">
          <ArrowLeft />
        </el-icon>
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
                    <span class="form-field__label"><em v-if="requiresIdentityInfo">*</em>手机号码</span>
                    <input
                      v-model="form.phone"
                      class="jh-input-field jh-input-field--sm"
                      type="text"
                      placeholder="请输入手机号码"
                      :aria-required="requiresIdentityInfo"
                    />
                  </label>
                  <label class="form-field">
                    <span class="form-field__label"><em v-if="requiresIdentityInfo">*</em>用药人身份证</span>
                    <input
                      v-model="form.idCard"
                      class="jh-input-field jh-input-field--sm"
                      type="text"
                      placeholder="请输入身份证号码"
                      :aria-required="requiresIdentityInfo"
                    />
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
                        （支持上传线下就诊历史处方、门诊病历、出院记录等。最多上传5张；支持jpg、png格式，单张大小不超过5M）
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
                <div v-if="showPregnancyOptions" class="form-field form-field--pregnancy">
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
                  class="jh-input-field jh-input-field--sm diagnosis-picker__input"
                  type="text"
                  placeholder="请输入线下已确诊的疾病名称"
                  @focus="showDiagnosisDropdown = true"
                  @click="showDiagnosisDropdown = true"
                />
                <div v-if="showDiagnosisOptions" class="diagnosis-dropdown">
                  <p class="diagnosis-dropdown__label">可选疾病</p>
                  <div class="diagnosis-tags">
                    <button
                      v-for="option in diagnosisSuggestionOptions"
                      :key="option.label"
                      :class="[
                        'diagnosis-chip',
                        {
                          'is-selected': option.selected,
                          'is-disabled': option.disabled
                        }
                      ]"
                      type="button"
                      :disabled="option.disabled"
                      :aria-pressed="option.selected"
                      @mousedown.prevent
                      @click="toggleDiagnosis(option.label)"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section :class="['form-section', 'medicine-section', { 'is-disabled': !canEditMedicine }]">
              <div class="form-section__title-row">
                <h2 class="form-section__title"><em>*</em>所需药品</h2>
                <span class="form-section__note">乙类OTC不需开具处方，请勿录入</span>
              </div>
              <div :class="['right-field-control', 'medicine-search', { 'is-active': medicineFocused, 'is-disabled': !canEditMedicine }]">
                <input
                  v-model="form.medicineKeyword"
                  class="medicine-search__input"
                  type="text"
                  :disabled="!canEditMedicine"
                  :placeholder="medicinePlaceholder"
                  @focus="openMedicineDropdown"
                  @click="openMedicineDropdown"
                />
                <div v-if="showMedicineDropdown" class="medicine-dropdown">
                  <button
                    v-for="option in filteredMedicineOptions"
                    :key="option.id"
                    class="medicine-dropdown__item"
                    type="button"
                    @mousedown.prevent
                    @click="addMedicine(option)"
                  >
                    <span class="medicine-dropdown__type">[{{ medicineTypeLabel(option.type) }}]</span>
                    <span class="medicine-dropdown__name">{{ option.name }}</span>
                    <span class="medicine-dropdown__spec">{{ option.spec }}</span>
                    <span class="medicine-dropdown__unit">{{ option.unit }}</span>
                  </button>
                  <div v-if="!filteredMedicineOptions.length" class="medicine-not-found">
                    <button class="medicine-not-found__action" type="button" @mousedown.prevent @click="registerNewMedicine">
                      <span class="medicine-not-found__icon" aria-hidden="true"></span>
                      新品登记
                    </button>
                    <span>未找到该药品，点击登记</span>
                  </div>
                </div>
              </div>
              <div v-if="canEditMedicine" class="medicine-list">
                <article v-for="item in form.medicines" :key="item.id" class="medicine-row">
                  <span :class="['medicine-type-tag', `medicine-type-tag--${item.type}`]">
                    {{ medicineTypeLabel(item.type) }}
                  </span>
                  <div class="medicine-row__info">
                    <strong>{{ item.name }}</strong>
                  </div>
                  <span class="medicine-row__spec">{{ item.spec }}</span>
                  <div class="medicine-row__qty">
                    <button class="qty-btn" type="button" :disabled="!canEditMedicine" @click="changeQty(item, -1)">−</button>
                    <span class="qty-value">{{ item.qty }}</span>
                    <button class="qty-btn" type="button" :disabled="!canEditMedicine" @click="changeQty(item, 1)">+</button>
                  </div>
                  <div class="medicine-unit" @focusout="handleUnitFocusout($event, item)">
                    <button
                      class="medicine-row__unit"
                      type="button"
                      :disabled="!canEditMedicine"
                      @click="toggleUnitDropdown(item)"
                    >
                      <span>{{ item.unit }}</span>
                      <span class="medicine-row__unit-arrow">⌄</span>
                    </button>
                    <div v-if="activeUnitMedicineId === item.id" class="medicine-unit-menu">
                      <button
                        v-for="unit in medicineUnits"
                        :key="unit"
                        :class="['medicine-unit-menu__item', { 'is-active': item.unit === unit }]"
                        type="button"
                        @mousedown.prevent
                        @click="selectMedicineUnit(item, unit)"
                      >
                        {{ unit }}
                      </button>
                    </div>
                  </div>
                  <button class="medicine-row__remove" type="button" aria-label="删除药品" :disabled="!canEditMedicine" @click="removeMedicine(item.id)">×</button>
                </article>
              </div>
            </section>

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
          <label class="consent-check">
            <input v-model="form.agreed" type="checkbox" />
            <span class="consent-check__box" aria-hidden="true"></span>
            <span class="consent-check__text">我已阅读并同意 <a href="#" @click.prevent>《互联网问诊知情同意书》</a></span>
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
              每个或每组药品至少选择一个疾病信息
            </p>

            <div class="submit-confirm-groups">
              <section v-for="group in diagnosisConfirmGroups" :key="group.id" class="submit-confirm-group">
                <h3>{{ group.medicineName }}</h3>
                <div class="submit-confirm-tags">
                  <DiseaseOption
                    v-for="option in group.options"
                    :key="`${group.id}-${option.label}`"
                    :label="option.label"
                    :selected="isConfirmDiagnosisSelected(group.id, option.label)"
                    :disabled="option.disabled"
                    @click="toggleConfirmDiagnosis(group.id, option.label)"
                  />
                </div>
              </section>
            </div>

            <div v-if="diagnosisConfirmGroups.length === 0" class="submit-confirm-empty">
              已选择的药品和疾病信息匹配，可以继续提交。
            </div>
          </div>

          <footer class="submit-confirm-dialog__footer">
            <Button variant="primary" size="sm" :disabled="!canConfirmDiagnoses" @click="confirmDiagnosesAndSubmit">确定</Button>
          </footer>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "@element-plus/icons-vue";
import { Button, DiseaseOption } from "@jiahong/ui";
import ToggleField from "@/components/quick-consult/ToggleField.vue";
import { useConsultStore } from "@/stores/consult";

const router = useRouter();
const route = useRoute();
const consultStore = useConsultStore();
const showConfirmDialog = ref(false);
const showConsentDialog = ref(false);
const showDiagnosisDropdown = ref(false);
const showMedicineDropdown = ref(false);
const medicineFocused = ref(false);
const activeUnitMedicineId = ref(null);
const patientNameFocused = ref(false);
const patientNameInput = ref(null);
const confirmDiagnosisSelections = reactive({});

const consultType = computed(() => route.query.type || consultStore.consultType || "western");
const consultSource = computed(() => route.query.source || consultStore.consultSource || "text");
const medicinePlaceholder = computed(() =>
  !canEditMedicine.value
    ? "请将基本信息填写完整后再进行录药"
    : "请输入药品名称或首字母做模糊查询"
);

const pregnancyOptions = [
  { label: "无", value: "none" },
  { label: "备孕中", value: "planning" },
  { label: "怀孕中", value: "pregnant" },
  { label: "哺乳期", value: "lactating" }
];

const commonDiagnoses = [
  "认知障碍",
  "卒中后抑郁",
  "抑郁发作",
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
  "急性鼻咽炎 [感冒]",
  "过敏性鼻炎[变应性鼻炎]",
  "偏头痛",
  "支气管哮喘",
  "手皮肤感染"
];

const medicineOptions = [
  { id: "m-1", type: "western", name: "感冒灵胶囊", spec: "0.5g*24片", unit: "盒" },
  { id: "m-2", type: "tcm", name: "感冒灵颗粒", spec: "10g*7袋", unit: "盒" },
  { id: "m-3", type: "western", name: "草酸艾司西酞普兰片", spec: "10mg*7片", unit: "盒" },
  { id: "m-4", type: "western", name: "阿奇霉素分散片", spec: "0.125g*6片", unit: "盒" },
  { id: "m-5", type: "compound", name: "复方氨酚烷胺胶囊", spec: "10粒", unit: "盒" },
  { id: "m-6", type: "tcm", name: "参苏丸", spec: "6g*10袋", unit: "盒" }
];

const psychMedicineNames = ["草酸艾司西酞普兰片"];
const medicineDiagnosisRules = [
  {
    id: "psych",
    match: (name) => name.includes("草酸艾司西酞普兰片"),
    medicineName: "草酸艾司西酞普兰片",
    options: ["认知障碍", "卒中后抑郁", "抑郁发作"],
    disabledOptions: ["抑郁发作"]
  },
  {
    id: "cold",
    match: (name) => name.includes("感冒"),
    medicineName: "感冒灵胶囊",
    options: ["急性鼻咽炎 [感冒]"],
    disabledOptions: []
  }
];
const medicineUnits = ["盒", "瓶", "支", "袋", "板", "片"];

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
  medicines: [],
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
// 根据已录入药品生成 Figma 中“可选疾病”的候选、选中和禁用状态。
const diagnosisSuggestionOptions = computed(() => {
  const labels = [];
  activeDiagnosisRules.value.forEach((rule) => {
    rule.options.forEach((label) => {
      if (!labels.includes(label)) labels.push(label);
    });
  });
  form.diagnoses.forEach((label) => {
    if (!labels.includes(label)) labels.push(label);
  });
  if (!labels.length && form.medicines.length) {
    commonDiagnoses.slice(0, 4).forEach((label) => labels.push(label));
  }

  return labels.map((label) => ({
    label,
    selected: form.diagnoses.includes(label),
    disabled: activeDiagnosisRules.value.some((rule) => rule.disabledOptions.includes(label)) || isDiagnosisDisabled(label)
  }));
});
const showDiagnosisOptions = computed(() => diagnosisSuggestionOptions.value.length > 0);
const diagnosisConfirmGroups = computed(() => {
  return form.medicines
    .map((medicine) => {
      const rule = medicineDiagnosisRules.find((item) => item.match(medicine.name));
      if (!rule) return null;
      const hasMatchedDiagnosis = rule.options.some((option) => form.diagnoses.includes(option));
      if (hasMatchedDiagnosis) return null;
      return {
        id: `${rule.id}-${medicine.id}`,
        ruleId: rule.id,
        medicineName: medicine.name,
        options: rule.options.map((label) => ({
          label,
          disabled: rule.disabledOptions.includes(label) || isDiagnosisDisabled(label)
        }))
      };
    })
    .filter(Boolean);
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
  if (isDiagnosisDisabled(tag)) return;
  if (form.diagnoses.includes(tag)) {
    removeDiagnosis(tag);
  } else {
    addDiagnosis(tag);
  }
}

function addDiagnosis(tag) {
  if (isDiagnosisDisabled(tag)) return;
  if (!form.diagnoses.includes(tag)) {
    form.diagnoses.push(tag);
  }
  form.diagnosisKeyword = "";
}

function removeDiagnosis(tag) {
  if (isDiagnosisDisabled(tag)) return;
  form.diagnoses = form.diagnoses.filter((item) => item !== tag);
}

function isDiagnosisDisabled(tag) {
  return requiresIdentityInfo.value && tag === "抑郁发作";
}

function resetConfirmDiagnosisSelections() {
  Object.keys(confirmDiagnosisSelections).forEach((key) => {
    delete confirmDiagnosisSelections[key];
  });
}

function isConfirmDiagnosisSelected(groupId, label) {
  return confirmDiagnosisSelections[groupId] === label;
}

function toggleConfirmDiagnosis(groupId, label) {
  const group = diagnosisConfirmGroups.value.find((item) => item.id === groupId);
  const option = group?.options.find((item) => item.label === label);
  if (!group || option?.disabled) return;
  if (confirmDiagnosisSelections[groupId] === label) {
    delete confirmDiagnosisSelections[groupId];
  } else {
    confirmDiagnosisSelections[groupId] = label;
  }
}

function closeDiagnosisDropdown(event) {
  if (!event.target.closest(".diagnosis-section")) {
    showDiagnosisDropdown.value = false;
  }
  if (!event.target.closest(".medicine-section")) {
    showMedicineDropdown.value = false;
    medicineFocused.value = false;
    activeUnitMedicineId.value = null;
  }
}

function changeQty(item, delta) {
  item.qty = Math.max(1, (item.qty || 1) + delta);
}

function removeMedicine(id) {
  form.medicines = form.medicines.filter((item) => item.id !== id);
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

function addMedicine(option) {
  const duplicate = form.medicines.some((item) => item.name === option.name && item.spec === option.spec);
  if (!duplicate) {
    form.medicines.push({
      id: Date.now(),
      type: option.type,
      name: option.name,
      spec: option.spec,
      qty: 1,
      unit: option.unit
    });
  }
  form.medicineKeyword = "";
  showMedicineDropdown.value = false;
  medicineFocused.value = false;
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
  if (diagnosisConfirmGroups.value.length > 0) {
    resetConfirmDiagnosisSelections();
    showConfirmDialog.value = true;
    return;
  }
  goTextConsult();
}

function agreeAndSubmit() {
  form.agreed = true;
  showConsentDialog.value = false;
  if (diagnosisConfirmGroups.value.length > 0) {
    resetConfirmDiagnosisSelections();
    showConfirmDialog.value = true;
    return;
  }
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
  Object.values(confirmDiagnosisSelections).forEach((label) => {
    addDiagnosis(label);
  });
  resetConfirmDiagnosisSelections();
  goTextConsult();
}

function genderLabel(gender) {
  return gender === "female" ? "女" : "男";
}

function goTextConsult() {
  showConfirmDialog.value = false;
  consultStore.setVisitInfo({
    patientName: form.patientName.trim(),
    gender: form.gender,
    genderLabel: genderLabel(form.gender),
    age: String(form.age).trim(),
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
  document.addEventListener("mousedown", closeDiagnosisDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", closeDiagnosisDropdown);
});
</script>

<style scoped>
.quick-consult-page {
  min-width: 1440px;
  min-height: 900px;
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
  gap: 32px;
}

.quick-consult-page__store {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
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
  height: 796px;
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
  grid-template-columns: 696px 696px;
  gap: 0;
  height: 740px;
  min-height: 740px;
}

.quick-consult-card__col {
  box-sizing: border-box;
  width: 696px;
  padding: 32px 48px 20px;
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

.form-section__title-row .form-section__title {
  margin-bottom: 0;
}

.form-section__note {
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  line-height: 22px;
}

.form-grid {
  display: grid;
  gap: 12px 31px;
}

.form-grid--patient {
  grid-template-columns: 348px 237px;
  align-items: start;
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
  align-items: center;
  gap: 16px;
  min-height: 32px;
}

.patient-info-fields .form-field {
  grid-template-columns: 84px 248px;
}

.patient-info-fields .form-field:nth-child(3) .jh-input-field {
  width: 154px;
}

.patient-proof-fields .form-field {
  grid-template-columns: 63px 154px;
}

.form-grid--history .form-field {
  grid-template-columns: 70px minmax(0, 1fr);
}

.form-grid--history .form-field__label em {
  display: none;
}

.form-grid--history :deep(.toggle-field) {
  min-height: 32px;
}

.form-grid--history :deep(.toggle-field__buttons) {
  gap: 8px;
}

.form-grid--history :deep(.toggle-field__buttons .jh-btn) {
  min-width: 38px;
  height: 32px;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 16px;
  line-height: 22px;
}

.form-grid--history :deep(.toggle-field__detail) {
  width: 154px;
  height: 32px;
  font-size: 14px;
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

.form-field__label {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
  text-align: right;
  white-space: nowrap;
}

.form-field__label em {
  margin-right: 0;
  color: #cb2c2c;
  font-style: normal;
}

.form-field--gender {
  align-items: center;
  min-height: 22px;
}

.form-field__label--gender {
  color: var(--jh-color-danger);
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
  gap: 8px;
  width: 248px;
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
  width: 154px;
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
  width: 123px;
  border-radius: 6px 0 0 6px;
}

.visit-method-field {
  width: 154px;
  cursor: not-allowed;
}

.patient-proof-fields .jh-input-field {
  width: 154px;
}

.upload-panel {
  width: 158px;
}

.upload-panel__hint {
  height: 111px;
  margin: 0 0 9px;
  width: 158px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  line-height: 20px;
}

.upload-panel__hint a {
  display: block;
  margin-left: 0;
  color: #006ef9;
  font-size: 14px;
  line-height: 22px;
}

.upload-panel__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: 0.8px dashed #bec5cd;
  border-radius: 1.5px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 22px;
  background: #fff;
  cursor: pointer;
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
}

.quick-consult-card .diagnosis-section,
.quick-consult-card .medicine-section {
  display: block;
  gap: normal;
  padding: 0;
}

.quick-consult-card .medicine-section {
  margin-top: 34px;
}

.quick-consult-card .remark-section {
  margin-top: 12px;
}

.medicine-section .form-section__title-row {
  margin-bottom: 12px;
}

.right-field-control {
  box-sizing: border-box;
  width: 615px;
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

.diagnosis-dropdown__label {
  margin: 0 0 8px;
  color: rgba(0, 0, 0, 0.4);
  font-family: var(--jh-font-family);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.diagnosis-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
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
  width: 615px;
  margin-top: 8px;
  margin-left: 9px;
}

.remark-field {
  display: flex;
  align-items: center;
  width: 615px;
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
  width: 571px;
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
  color: #848f9a;
  font-size: 12px;
  line-height: 1;
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
  bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  min-height: 40px;
  padding: 0;
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
}

.consent-check a {
  color: var(--jh-color-primary);
  text-decoration: none;
}

.jh-input-field {
  width: 248px;
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

.quick-consult-card__footer :deep(.jh-btn) {
  width: 112px;
  height: 40px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
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
  background: rgba(19, 29, 43, 0.45);
}

.submit-confirm-dialog {
  width: min(778px, calc(100vw - 48px));
  border-radius: 8px;
  background: var(--jh-color-bg-surface);
  overflow: hidden;
  box-shadow: 0 20px 48px rgba(19, 29, 43, 0.22);
}

.submit-confirm-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 20px;
  border-bottom: 1px solid #e5e8eb;
  background: #fff;
}

.submit-confirm-dialog__header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
}

.submit-confirm-dialog__close {
  width: 32px;
  height: 32px;
  border: 0;
  color: #8b98a7;
  font-size: 34px;
  line-height: 1;
  background: transparent;
  cursor: pointer;
}

.submit-confirm-dialog__close:hover {
  background: var(--jh-color-bg-page);
}

.submit-confirm-dialog__warning {
  padding: 10px 22px;
  color: #ff6b1a;
  font-size: 16px;
  line-height: 24px;
  background: #fff2df;
}

.submit-confirm-dialog__body {
  display: grid;
  gap: 14px;
  padding: 18px 30px 18px;
  background: #fff;
}

.submit-confirm-dialog__tip {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  color: #ff6b1a;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
}

.submit-confirm-dialog__tip-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  background: #ee7417;
}

.submit-confirm-groups {
  display: grid;
  gap: 10px;
}

.submit-confirm-group {
  min-height: 96px;
  padding: 14px 18px;
  border-radius: 4px;
  background: #f3f7fd;
}

.submit-confirm-group h3 {
  margin: 0 0 10px;
  color: rgba(0, 0, 0, 0.48);
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
}

.submit-confirm-group :deep(.jh-disease-option) {
  min-height: 34px;
  padding: 4px 16px;
  font-size: 16px;
  line-height: 24px;
}

.submit-confirm-empty {
  padding: 32px 18px;
  border-radius: 4px;
  color: var(--jh-color-muted);
  font-size: 16px;
  text-align: center;
  background: #f3f7fd;
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
  padding: 0 30px 24px;
  background: #fff;
}

.submit-confirm-dialog__footer :deep(.jh-btn) {
  width: 96px;
  height: 56px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 700;
}

</style>
